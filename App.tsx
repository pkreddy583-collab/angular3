
import React, { useState, useMemo, useEffect } from 'react';
import { PORTFOLIOS, INCIDENTS } from './constants';
import type { Incident, Portfolio } from './types';
import IncidentList from './components/IncidentList';
import IncidentDetails from './components/IncidentDetails';
import PortfolioSlicer from './components/PortfolioSlicer';
import CommandCenter from './components/CommandCenter';
import { HumanaLogoIcon } from './components/icons';
import { getIncidentSummary } from './services/geminiService';

const App: React.FC = () => {
  const [portfolios] = useState<Portfolio[]>(PORTFOLIOS);
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS.map(inc => ({ ...inc, isSummarizing: false })));
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = useMemo(() => {
    if (selectedPortfolio === 'all') {
      return incidents;
    }
    return incidents.filter(incident => incident.portfolioId === selectedPortfolio);
  }, [incidents, selectedPortfolio]);

  useEffect(() => {
    const generateSummaries = async () => {
      for (const incident of filteredIncidents) {
        if (!incident.aiSummary) {
          // Set loading state for the specific incident
          setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, isSummarizing: true } : i));

          try {
            const summary = await getIncidentSummary(incident);
            // Update the incident with the new summary and remove loading state
            setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, aiSummary: summary, isSummarizing: false } : i));
          } catch (error) {
            console.error(`Failed to get summary for ${incident.id}`, error);
            // Remove loading state on error
            setIncidents(prev => prev.map(i => i.id === incident.id ? { ...i, isSummarizing: false } : i));
          }
        }
      }
    };
    generateSummaries();
  }, [filteredIncidents.map(i => i.id).join(',')]); // Rerun if the list of filtered incidents changes


  const handleSelectIncident = (incident: Incident) => {
    setSelectedIncident(prev => (prev?.id === incident.id ? null : incident));
  };

  const handleCloseDetails = () => {
    setSelectedIncident(null);
  };

  return (
    <div className="bg-humana-gray-light min-h-screen font-sans text-humana-gray-dark">
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <HumanaLogoIcon className="h-10 w-10 text-humana-green" />
              <h1 className="text-2xl font-bold text-humana-green-dark tracking-tight">
                Incident SLA Dashboard
              </h1>
            </div>
            <div className="w-full max-w-xs">
              <PortfolioSlicer
                portfolios={portfolios}
                selectedPortfolio={selectedPortfolio}
                onSelectPortfolio={setSelectedPortfolio}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <CommandCenter incidents={filteredIncidents} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
                 <h2 className="text-xl font-bold text-humana-gray-dark tracking-tight mb-4">
                    Live Incident Queue
                </h2>
                <IncidentList
                    incidents={filteredIncidents}
                    onSelectIncident={handleSelectIncident}
                    selectedIncidentId={selectedIncident?.id}
                />
            </div>

            <div className="lg:col-span-2 sticky top-28">
                <IncidentDetails
                    incident={selectedIncident}
                    onClose={handleCloseDetails}
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
