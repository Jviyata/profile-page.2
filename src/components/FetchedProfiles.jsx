import React from 'react';
import styles from '../App.module.css';

const FetchedProfiles = React.memo(function FetchedProfiles({ apiTitleFilter, setApiTitleFilter, apiSearchText, setApiSearchText, handleApiReset, apiTitles, isLoading }) {
  return (
    <div className={styles.filterControls}>
      <div className={styles.filterGroup}>
        <label htmlFor="api-title-filter">Filter by Title:</label>
        <select 
          id="api-title-filter"
          value={apiTitleFilter} 
          onChange={(e) => setApiTitleFilter(e.target.value)}
          className={styles.filterDropdown}
          disabled={isLoading}
        >
          <option value="">All Titles</option>
          {apiTitles.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="api-search-box">Search by Name:</label>
        <input
          id="api-search-box"
          type="text"
          value={apiSearchText}
          onChange={(e) => setApiSearchText(e.target.value)}
          placeholder="Type a name..."
          className={styles.searchInput}
          disabled={isLoading}
        />
      </div>
      
      <button onClick={handleApiReset} className={styles.resetButton} disabled={isLoading}>
        Reset Filters
      </button>
    </div>
  );
});

export default FetchedProfiles;
