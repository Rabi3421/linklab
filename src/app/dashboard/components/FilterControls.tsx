'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterControlsProps {
  onFilterChange: (filters: {
    status: string;
    dateRange: { start: string; end: string };
    search: string;
  }) => void;
}

export default function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [status, setStatus] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      status,
      dateRange: { start: dateStart, end: dateEnd },
      search
    });
  };

  const handleResetFilters = () => {
    setStatus('all');
    setDateStart('');
    setDateEnd('');
    setSearch('');
    onFilterChange({
      status: 'all',
      dateRange: { start: '', end: '' },
      search: ''
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4 lg:mb-0">
        <div className="flex items-center gap-3">
          <Icon name="FunnelIcon" size={20} variant="outline" className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-all duration-250"
        >
          <Icon 
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
            size={20} 
            variant="outline" 
          />
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden'} lg:block mt-4 lg:mt-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search Links
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by URL or alias..."
                className="w-full px-4 py-2 pl-10 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250"
              />
              <Icon 
                name="MagnifyingGlassIcon" 
                size={18} 
                variant="outline" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateStart" className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="dateStart"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250"
            />
          </div>

          <div>
            <label htmlFor="dateEnd" className="block text-sm font-medium text-foreground mb-2">
              End Date
            </label>
            <input
              type="date"
              id="dateEnd"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              min={dateStart}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-250"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] flex items-center gap-2"
          >
            <Icon name="FunnelIcon" size={18} variant="solid" />
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-muted text-foreground font-medium rounded-lg transition-all duration-250 ease-smooth hover:bg-muted/80 active:scale-[0.97] flex items-center gap-2"
          >
            <Icon name="XMarkIcon" size={18} variant="outline" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}