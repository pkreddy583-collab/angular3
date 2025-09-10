
import React from 'react';
import type { Incident } from '../types';
import { PRIORITY_CONFIG } from '../constants';
import { TimeIcon, AlertIcon, SparkleIcon } from './icons';

interface IncidentListItemProps {
  incident: Incident;
  onSelect: (incident: Incident) => void;
  isSelected: boolean;
}

const IncidentListItem: React.FC<IncidentListItemProps> = ({ incident, onSelect, isSelected }) => {
  const priorityConfig = PRIORITY_CONFIG[incident.priority];

  const cardClasses = `
    p-4 border-l-8 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ease-in-out
    ${priorityConfig.base} ${priorityConfig.background}
    ${isSelected ? `ring-2 ring-humana-blue shadow-lg scale-[1.02]` : 'hover:shadow-md hover:scale-[1.01]'}
  `;

  const SkeletonSummary: React.FC = () => (
     <div className="flex items-center text-sm font-medium text-humana-blue-dark/60 animate-pulse">
        <SparkleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  );

  return (
    <div onClick={() => onSelect(incident)} className={cardClasses}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="flex-grow">
                 <p className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${priorityConfig.background} ${priorityConfig.text} ring-1 ring-inset ring-current`}>
                    <AlertIcon className="w-4 h-4 mr-1.5" />
                    {incident.priority} - {priorityConfig.label}
                </p>
                <h3 className={`mt-2 text-lg font-semibold ${priorityConfig.text}`}>
                    {incident.id}: {incident.title}
                </h3>
            </div>
             <div className="flex-shrink-0 mt-2 sm:mt-1 sm:ml-4 flex items-center space-x-2 text-sm text-red-600 font-semibold">
                <TimeIcon className="w-5 h-5" />
                <span>SLA Breach: {incident.slaBreachTime}</span>
            </div>
        </div>
      <p className="mt-2 text-sm text-gray-600">
        {incident.description.substring(0, 150)}...
      </p>

      {(incident.aiSummary || incident.isSummarizing) && (
        <div className="mt-3 pt-3 border-t border-gray-400/20">
            {incident.isSummarizing ? (
                <SkeletonSummary />
            ) : (
                <p className="flex items-center text-sm font-medium text-humana-blue-dark">
                    <SparkleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="font-semibold mr-1.5">AI Suggests:</span>
                    <span>{incident.aiSummary}</span>
                </p>
            )}
        </div>
      )}
    </div>
  );
};

export default IncidentListItem;
