
import React from 'react';
import type { Portfolio } from '../types';
import { PortfolioIcon } from './icons';

interface PortfolioSlicerProps {
  portfolios: Portfolio[];
  selectedPortfolio: string;
  onSelectPortfolio: (portfolioId: string) => void;
}

const PortfolioSlicer: React.FC<PortfolioSlicerProps> = ({ portfolios, selectedPortfolio, onSelectPortfolio }) => {
  return (
    <div>
      <label htmlFor="portfolio-slicer" className="block text-sm font-medium text-gray-700 mb-1">
        Portfolio
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <PortfolioIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <select
          id="portfolio-slicer"
          name="portfolio"
          className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-humana-green-dark sm:text-sm sm:leading-6"
          value={selectedPortfolio}
          onChange={(e) => onSelectPortfolio(e.target.value)}
        >
          <option value="all">All Portfolios</option>
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PortfolioSlicer;
