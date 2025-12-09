import React, { useState, useEffect } from 'react';
import '../styles/SearchFilter.css';

export interface FilterOptions {
  search: string;
  platform: string;
  minYear: number;
  maxYear: number;
  minRating: number;
  sortBy: 'year' | 'rating' | 'title';
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    platform: 'all',
    minYear: 1995, 
    maxYear: new Date().getFullYear(),
    minRating: 0,
    sortBy: 'year'
  });

  const platforms = ['all', 'PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PSP'];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minYear' || name === 'maxYear' || name === 'minRating' 
        ? Number(value) 
        : value
    }));
  };

  return (
    <div className="search-filter-container">
      <div className="filter-group full-width">
        <input
          type="text"
          name="search"
          placeholder="🔍 Search game title..."
          value={filters.search}
          onChange={handleChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label>Platform</label>
        <select name="platform" value={filters.platform} onChange={handleChange}>
          {platforms.map(p => (
            <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Year Range: {filters.minYear} - {filters.maxYear}</label>
        <div className="range-inputs">
          <input 
            type="number" 
            name="minYear" 
            min="1990" 
            max="2030" 
            value={filters.minYear} 
            onChange={handleChange} 
          />
          <span>to</span>
          <input 
            type="number" 
            name="maxYear" 
            min="1990" 
            max="2030" 
            value={filters.maxYear} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Min Rating: {filters.minRating}+ ⭐</label>
        <input
          type="range"
          name="minRating"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="year">Release Year (Newest)</option>
          <option value="rating">Rating (Highest)</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
    </div>
  );
};