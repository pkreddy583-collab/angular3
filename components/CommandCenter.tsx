
import React, { useState, useMemo, useEffect } from 'react';
import type { Incident } from '../types';
import { IncidentPriority } from '../types';
import { getDashboardSummary } from '../services/geminiService';
import { SparkleIcon } from './icons';
import DonutChart from './DonutChart';

interface CommandCenterProps {
  incidents: Incident[];
}

const StatCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-5 rounded-lg shadow-sm ${className}`}>
        <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
        <div className="mt-2">{children}</div>
    </div>
);

const CommandCenter: React.FC<CommandCenterProps> = ({ incidents }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState<{ situationReport: string; focusAreas: string[] }>({ situationReport: '', focusAreas: [] });

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            const { situationReport, focusAreas } = await getDashboardSummary(incidents);
            setSummary({ situationReport, focusAreas });
            setIsLoading(false);
        };
        fetchSummary();
    }, [incidents]); // Reruns when filter changes

    const priorityCounts = useMemo(() => {
        return incidents.reduce((acc, incident) => {
            acc[incident.priority] = (acc[incident.priority] || 0) + 1;
            return acc;
        }, {} as Record<IncidentPriority, number>);
    }, [incidents]);

    const chartData = [
        { label: 'P1', value: priorityCounts.P1 || 0, color: '#EF4444' },
        { label: 'P2', value: priorityCounts.P2 || 0, color: '#F59E0B' },
        { label: 'P3', value: priorityCounts.P3 || 0, color: '#3B82F6' },
        { label: 'P4', value: priorityCounts.P4 || 0, color: '#6B7280' },
    ];

    const SkeletonText: React.FC<{className?: string}> = ({className}) => <div className={`bg-gray-200 rounded animate-pulse ${className}`}>&nbsp;</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard title="AI Situation Report" className="lg:col-span-1">
                 {isLoading ? (
                    <div className="space-y-2">
                        <SkeletonText className="h-4 w-full" />
                        <SkeletonText className="h-4 w-5/6" />
                    </div>
                ) : (
                    <p className="text-gray-700 text-base">{summary.situationReport}</p>
                )}
            </StatCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-4 sm:gap-6">
                <StatCard title="AI-Suggested Focus">
                     {isLoading ? (
                        <div className="space-y-2">
                            <SkeletonText className="h-4 w-4/5" />
                            <SkeletonText className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {summary.focusAreas.map((area, i) => (
                                <li key={i} className="flex items-start text-humana-blue-dark font-semibold text-sm">
                                    <SparkleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{area}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </StatCard>
                <StatCard title="Priority Breakdown">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-full">
                            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                        </div>
                    ) : (
                        <DonutChart data={chartData} />
                    )}
                </StatCard>
            </div>
        </div>
    );
};

export default CommandCenter;
