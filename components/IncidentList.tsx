
import React from 'react';
import type { Incident } from '../types';
import IncidentListItem from './IncidentListItem';

interface IncidentListProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  selectedIncidentId?: string | null;
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, onSelectIncident, selectedIncidentId }) => {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium text-gray-500">No incidents found for this portfolio.</h2>
        <p className="text-gray-400 mt-2">All systems are operational.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <IncidentListItem
          key={incident.id}
          incident={incident}
          onSelect={onSelectIncident}
          isSelected={selectedIncidentId === incident.id}
        />
      ))}
    </div>
  );
};

export default IncidentList;
