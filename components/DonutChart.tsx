
import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
      return <div className="flex items-center justify-center h-full text-sm text-gray-500">No incident data</div>;
  }

  let cumulative = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulative / total) * 360;
    const endAngle = ((cumulative + item.value) / total) * 360;
    cumulative += item.value;
    return { ...item, percentage, startAngle, endAngle };
  });

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center space-x-4 h-full">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="12" />
          {segments.map((segment, index) => {
             if (segment.value === 0) return null;
             const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
             const strokeDashoffset = - (segment.startAngle / 360) * circumference;
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 50 50)`}
              />
            );
          })}
           <text x="50" y="55" textAnchor="middle" className="text-2xl font-bold fill-current text-gray-700">
            {total}
          </text>
        </svg>
      </div>
      <div className="text-sm">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="font-semibold text-gray-700">{segment.value}</span>
            <span className="text-gray-500">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
