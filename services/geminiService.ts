
import { GoogleGenAI, Type } from "@google/genai";
import type { Incident, AIAnalysisResult, SuggestedArticle } from '../types';
import { KNOWLEDGE_ARTICLES } from "../constants";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const incidentAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 2-3 concrete actions the on-call engineer should take right now.'
    },
    rootCause: {
      type: Type.STRING,
      description: 'A brief analysis of the most likely root cause.'
    },
    suggestedArticles: {
      type: Type.ARRAY,
      items: { 
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: 'The ID of the suggested knowledge article.'},
            title: { type: Type.STRING, description: 'The title of the knowledge article.'},
            summary: { type: Type.STRING, description: 'The original summary of the knowledge article.'},
            relevance: { type: Type.STRING, description: 'A brief, one-sentence explanation of *why* this article is relevant to the current incident.'}
        },
        required: ['id', 'title', 'summary', 'relevance']
      },
      description: 'A list of up to 2 relevant knowledge articles from the provided list, including a justification for their relevance.'
    },
    timeline: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                step: { type: Type.STRING, description: 'A short label for the timeline event (e.g., "Initial Report").' },
                description: { type: Type.STRING, description: 'A brief description of what happened at this step.' }
            },
            required: ['step', 'description']
        },
        description: 'A brief, reconstructed timeline of the incident based on the description.'
    }
  },
  required: ['nextSteps', 'rootCause', 'suggestedArticles', 'timeline']
};


export const getIncidentResolutionSuggestion = async (incident: Incident): Promise<AIAnalysisResult> => {
    const availableKbs = KNOWLEDGE_ARTICLES.map(kb => `- ID: ${kb.id}, Title: "${kb.title}", Summary: "${kb.summary}"`).join('\n');
    
    const prompt = `
        You are an expert Site Reliability Engineer (SRE) inside ServiceNow.
        Your task is to analyze an IT incident and provide a structured JSON response to help the on-call engineer.

        **Incident Details:**
        - Title: ${incident.title}
        - Priority: ${incident.priority}
        - Description: ${incident.description}
        - Affected Services: ${incident.affectedServices.join(', ')}
        - Last Known Update: ${incident.lastUpdate}

        **Available Knowledge Articles in ServiceNow:**
        ${availableKbs}

        **Instructions:**
        1.  **Analyze the incident.**
        2.  **Formulate Immediate Next Steps:** Provide a list of 2-3 concrete actions.
        3.  **Identify Potential Root Cause:** Give a brief analysis.
        4.  **Suggest Knowledge Articles:** From the list provided, identify up to 2 of the MOST relevant articles. For each suggested article, you MUST include its id, title, summary, and a new "relevance" field explaining in one sentence why it is useful for THIS specific incident. If no articles are relevant, return an empty array.
        5.  **Reconstruct a Timeline:** Based on the description, create a simple, plausible timeline of events.
        6.  **Return a JSON object** that strictly follows the provided schema. Do not add any other text or explanations outside of the JSON object.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: incidentAnalysisSchema,
      }
    });
    
    const jsonString = response.text;
    const result: AIAnalysisResult = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error('Error calling Gemini API for incident analysis:', error);
    throw new Error('An error occurred while generating a recommendation. Please check the API configuration and try again.');
  }
};

export const getIncidentSummary = async(incident: Incident): Promise<string> => {
    const prompt = `
        You are an AI assistant for an IT operations team.
        Analyze the following incident and provide a very brief, one-sentence summary of the recommended immediate action.
        This summary will be displayed on a dashboard list view. Make it concise and actionable.

        **Incident Title:** ${incident.title}
        **Incident Description:** ${incident.description}

        Example output: "Investigate SSL certificate on the authentication gateway." or "Prepare to rollback the latest deployment of the member service."

        **Your one-sentence summary:**
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch(error) {
        console.error('Error generating incident summary:', error);
        return "Could not generate summary.";
    }
};

export const getLeadershipSummary = async(incident: Incident): Promise<string> => {
    const commentHistory = incident.commentHistory.map(c => `- ${c.timestamp} (${c.author}): ${c.comment}`).join('\n');

    const prompt = `
        You are an AI analyst responsible for briefing executive leadership on IT incidents.
        Your audience is non-technical. Do not use jargon.
        Analyze the following incident details and its comment history.
        Provide a 2-3 sentence summary that covers:
        1. The business impact (what users/customers are experiencing).
        2. The current status of the investigation.
        3. The next steps toward resolution.

        **Incident Title:** ${incident.title}
        **Incident Priority:** ${incident.priority}
        **Incident Description:** ${incident.description}

        **Ticket Comment History:**
        ${commentHistory}

        **Your Executive Summary:**
    `;
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch(error) {
        console.error('Error generating leadership summary:', error);
        return "Could not generate executive summary.";
    }
};


// This function is no longer needed as summary generation is handled per-incident.
// It can be removed if the CommandCenter is simplified to not fetch P1 summaries in a batch.
// For now, it is kept but simplified.
export const getDashboardSummary = async (incidents: Incident[]): Promise<{ situationReport: string; focusAreas: string[]; }> => {
    const p1Count = incidents.filter(i => i.priority === 'P1').length;
    const totalCount = incidents.length;

    const incidentData = incidents.map(i => 
        `- Priority: ${i.priority}, Title: ${i.title}`
    ).join('\n');

    const prompt = `
        You are an AI Command Center lead for an IT operations team. Your task is to analyze a list of open incidents and provide a high-level summary JSON object.

        **Current Open Incidents:**
        ${incidentData}

        **Instructions:**
        1.  **Write a "Situation Report":** A brief, 1-2 sentence overview of the current status. There are ${totalCount} total incidents, and ${p1Count} of them are P1 (Critical).
        2.  **Identify "Focus Areas":** List 2-3 key themes or specific incidents that need immediate attention.
        3.  **Return a JSON object** with keys "situationReport" and "focusAreas".
    `;

    const dashboardSummarySchema = {
        type: Type.OBJECT,
        properties: {
            situationReport: {
                type: Type.STRING,
                description: "A 1-2 sentence summary of the overall incident situation."
            },
            focusAreas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 2-3 specific incident titles or themes that require immediate attention."
            }
        },
        required: ["situationReport", "focusAreas"]
    }

    if (incidents.length === 0) {
        return {
            situationReport: "All systems are green. No open incidents.",
            focusAreas: ["Monitor system health"],
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dashboardSummarySchema,
            }
        });

        const jsonString = response.text;
        const result = JSON.parse(jsonString);

        return {
            situationReport: result.situationReport,
            focusAreas: result.focusAreas,
        };

    } catch (error) {
        console.error('Error calling Gemini API for dashboard summary:', error);
        return {
            situationReport: "Could not generate AI summary. Please check API status.",
            focusAreas: ["Manual incident review required"],
        };
    }
}
