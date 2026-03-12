import React, { memo, useCallback } from 'react';
import styles from '../App.module.css';

const Filters = memo(({ 
  roleFilter, 
  setRoleFilter, 
  searchText, 
  setSearchText, 
  handleReset, 
  roles 
}) => {
  // Memoize callbacks to prevent recreation on parent re-render
  const handleRoleChange = useCallback((e) => {
    setRoleFilter(e.target.value);
  }, [setRoleFilter]);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, [setSearchText]);

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterControls}>
        <div className={styles.filterGroup}>
          <label htmlFor="role">Filter by Role</label>
          <select
            id="role"
            className={styles.filterDropdown}
            value={roleFilter}
            onChange={handleRoleChange}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="search">Search by Name</label>
          <input
            id="search"
            type="text"
            className={styles.searchInput}
            placeholder="Search profiles..."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>

        <button 
          className={styles.resetButton}
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
});

Filters.displayName = 'Filters';

export default Filters;
