
import React from 'react';
import type { Incident } from '../types';
import { PRIORITY_CONFIG } from '../constants';
import RecommendationEngine from './RecommendationEngine';
import { CloseIcon, ServicesIcon, UpdateIcon, PortfolioIcon } from './icons';

interface IncidentDetailsProps {
  incident: Incident | null;
  onClose: () => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident, onClose }) => {
  if (!incident) {
    return (
       <div className="bg-white p-6 rounded-lg shadow-sm text-center h-full border-2 border-dashed border-gray-200 flex flex-col justify-center items-center">
        <PortfolioIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Incident Selected</h3>
        <p className="mt-1 text-sm text-gray-500">Select an incident from the list to see details and AI analysis.</p>
      </div>
    );
  }
  
  const priorityConfig = PRIORITY_CONFIG[incident.priority];

  return (
    <div className="bg-white shadow-lg rounded-lg h-full animate-fade-in">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-humana-green-dark">Incident Details</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
            <span className="sr-only">Close details</span>
          </button>
        </div>

        <div className="space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          <div>
            <p className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${priorityConfig.background} ${priorityConfig.text} ring-1 ring-inset ring-current`}>
              {incident.priority} - {priorityConfig.label}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-gray-800">{incident.id}: {incident.title}</h3>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-600">Description</h4>
            <p className="text-gray-700 mt-1">{incident.description}</p>
          </div>

          <div>
              <h4 className="font-semibold text-gray-600 flex items-center"><ServicesIcon className="w-5 h-5 mr-2" />Affected Services</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                  {incident.affectedServices.map(service => (
                      <span key={service} className="bg-humana-green-light text-humana-green-dark text-xs font-medium px-2.5 py-1 rounded-full">{service}</span>
                  ))}
              </div>
          </div>

           <div>
              <h4 className="font-semibold text-gray-600 flex items-center"><UpdateIcon className="w-5 h-5 mr-2" />Last Update</h4>
              <p className="text-gray-700 mt-1">{incident.lastUpdate}</p>
          </div>

          <hr className="my-4"/>

          <RecommendationEngine incident={incident} />
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
