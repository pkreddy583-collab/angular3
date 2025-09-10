
import React, { useState, useCallback, useEffect } from 'react';
import type { Incident, AIAnalysisResult, SuggestedArticle } from '../types';
import { getIncidentResolutionSuggestion, getLeadershipSummary } from '../services/geminiService';
import { SparkleIcon, KnowledgeBaseIcon, ThumbUpIcon, ThumbDownIcon, ChecklistIcon, TimelineIcon, BriefcaseIcon } from './icons';

interface RecommendationEngineProps {
  incident: Incident;
}

type FeedbackStatus = 'pending' | 'submitted' | 'helpful' | 'not_helpful';
type ActiveTab = 'triage' | 'research' | 'timeline' | 'summary';

const SkeletonLoader: React.FC<{lines?: number}> = ({lines = 2}) => (
    <div className="mt-4 p-4 bg-white rounded-md space-y-4 animate-pulse">
        {Array.from({ length: lines }).map((_, index) => (
            <div className="space-y-2" key={index}>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
        ))}
    </div>
);

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ incident }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [leadershipSummary, setLeadershipSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackStatus>('pending');
  const [activeTab, setActiveTab] = useState<ActiveTab>('triage');

  const fetchRecommendation = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    setFeedback('pending');
    setLeadershipSummary('');
    setActiveTab('triage');
    try {
      const result = await getIncidentResolutionSuggestion(incident);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to fetch AI analysis.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [incident]);
  
  useEffect(() => {
    if (incident) {
      fetchRecommendation();
    }
  }, [incident, fetchRecommendation]);

  const handleTabChange = async (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'summary' && !leadershipSummary && !isSummaryLoading) {
        setIsSummaryLoading(true);
        try {
            const summary = await getLeadershipSummary(incident);
            setLeadershipSummary(summary);
        } catch (err) {
            setLeadershipSummary('Failed to generate executive summary.');
        } finally {
            setIsSummaryLoading(false);
        }
    }
  }

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback('submitted');
    setTimeout(() => {
        setFeedback(isHelpful ? 'helpful' : 'not_helpful');
    }, 300);
  }

  return (
    <div className="p-4 bg-humana-green-light/60 rounded-lg">
      <div className="flex items-center">
        <h4 className="text-lg font-semibold text-humana-green-dark flex items-center">
            <SparkleIcon className="w-6 h-6 mr-2" />
            AI Co-pilot
        </h4>
      </div>
      
      {isLoading && <SkeletonLoader />}
      {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

      {analysis && (
        <div className="mt-4 bg-white rounded-md">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('triage')}
                className={`${activeTab === 'triage' ? 'border-humana-blue text-humana-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <ChecklistIcon className="w-5 h-5 mr-2" /> Triage
              </button>
               <button
                onClick={() => handleTabChange('research')}
                className={`${activeTab === 'research' ? 'border-humana-blue text-humana-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <KnowledgeBaseIcon className="w-5 h-5 mr-2" /> Research
              </button>
               <button
                onClick={() => handleTabChange('timeline')}
                className={`${activeTab === 'timeline' ? 'border-humana-blue text-humana-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <TimelineIcon className="w-5 h-5 mr-2" /> Timeline
              </button>
              <button
                onClick={() => handleTabChange('summary')}
                className={`${activeTab === 'summary' ? 'border-humana-blue text-humana-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <BriefcaseIcon className="w-5 h-5 mr-2" /> Exec Summary
              </button>
            </nav>
          </div>
          <div className="p-4 space-y-4 min-h-[200px]">
            {activeTab === 'triage' && (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <h5 className="font-bold text-humana-blue-dark">Immediate Next Steps</h5>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                        {analysis.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-humana-blue-dark">Potential Root Cause</h5>
                        <p className="mt-1 text-gray-700">{analysis.rootCause}</p>
                    </div>
                </div>
            )}
             {activeTab === 'research' && (
                <div className="animate-fade-in">
                    {analysis.suggestedArticles && analysis.suggestedArticles.length > 0 ? (
                        <div className="space-y-3">
                            {analysis.suggestedArticles.map(kb => (
                            <a href="#" key={kb.id} className="block p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                                <p className="font-semibold text-sm text-humana-blue">{kb.id}: {kb.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{kb.summary}</p>
                                <p className="flex items-start text-xs font-medium text-humana-blue-dark mt-2 pt-2 border-t border-gray-200">
                                    <SparkleIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0" />
                                    <span className="font-semibold mr-1">AI Gist:</span>
                                    <span>{kb.relevance}</span>
                                </p>
                            </a>
                            ))}
                        </div>
                    ) : <p className="text-gray-600 text-sm">No relevant knowledge base articles were found for this incident.</p>}
                </div>
            )}
            {activeTab === 'timeline' && (
                <div className="animate-fade-in">
                    <ol className="relative border-l border-gray-200">                  
                        {analysis.timeline.map((event, index) => (
                            <li className="mb-4 ml-4" key={index}>
                                <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h3 className="text-sm font-semibold text-gray-900">{event.step}</h3>
                                <p className="text-sm font-normal text-gray-600">{event.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
            {activeTab === 'summary' && (
                 <div className="animate-fade-in">
                    {isSummaryLoading ? <SkeletonLoader lines={1} /> : (
                         <div>
                            <h5 className="font-bold text-humana-blue-dark">Executive Summary</h5>
                            <p className="mt-1 text-gray-700 whitespace-pre-wrap">{leadershipSummary}</p>
                        </div>
                    )}
                 </div>
            )}
          </div>

            <div className="p-3 text-center border-t bg-gray-50/50 rounded-b-md">
                {feedback === 'pending' || feedback === 'submitted' ? (
                    <>
                        <p className="text-sm font-medium text-gray-600 mb-2">Was this analysis helpful?</p>
                        <div className="flex justify-center space-x-3">
                            <button onClick={() => handleFeedback(true)} disabled={feedback === 'submitted'} className="p-2 rounded-full hover:bg-green-100 transition-colors disabled:opacity-50"><ThumbUpIcon className="w-5 h-5 text-gray-500 hover:text-green-600" /></button>
                            <button onClick={() => handleFeedback(false)} disabled={feedback === 'submitted'} className="p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"><ThumbDownIcon className="w-5 h-5 text-gray-500 hover:text-red-600" /></button>
                        </div>
                    </>
                ) : (
                    <p className="text-sm font-medium text-gray-600 animate-fade-in">Thank you for your feedback!</p>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationEngine;
