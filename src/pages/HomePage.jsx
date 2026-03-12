import React, { useReducer, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import styles from '../App.module.css';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Filters from '../components/Filters';
import { Link } from 'react-router-dom';

// Reducer for managing filter and view state
const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE_FILTER':
      return { ...state, roleFilter: action.payload };
    case 'SET_SEARCH_TEXT':
      return { ...state, searchText: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'RESET_FILTERS':
      return { ...state, roleFilter: '', searchText: '' };
    case 'SET_CARD_WIDTH':
      return { ...state, cardWidth: action.payload };
    default:
      return state;
  }
};

const initialFilterState = {
  roleFilter: '',
  searchText: '',
  viewMode: 'view',
  cardWidth: 0
};

function HomePage({ 
  profiles, 
  mode, 
  loading,
  error,
  isEditMode,
  onDeleteProfile,
  uniqueRoles,
  onProfileClick
}) {
  // useReducer for complex filter and view state
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  
  // useRef to track card container and individual card widths
  const cardContainerRef = useRef(null);
  const cardRefs = useRef([]);

  // useLayoutEffect to measure card width and update state before paint
  useLayoutEffect(() => {
    if (cardRefs.current[0]) {
      const width = cardRefs.current[0].offsetWidth;
      if (width !== filterState.cardWidth) {
        dispatch({ type: 'SET_CARD_WIDTH', payload: width });
      }
    }
  }, [filterState.cardWidth]);

  // Memoize delete handler
  const handleDeleteClick = useCallback((profile) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${profile.name}? This action cannot be undone.`
    );
    if (isConfirmed) {
      onDeleteProfile(profile.id);
    }
  }, [onDeleteProfile]);

  // Memoize filter callbacks
  const handleSetRoleFilter = useCallback((value) => {
    dispatch({ type: 'SET_ROLE_FILTER', payload: value });
  }, []);

  const handleSetSearchText = useCallback((value) => {
    dispatch({ type: 'SET_SEARCH_TEXT', payload: value });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  // Memoize filtered profiles calculation
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesRole = filterState.roleFilter === '' || profile.role === filterState.roleFilter;
      const matchesSearch = filterState.searchText === '' || 
        profile.name.toLowerCase().includes(filterState.searchText.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [profiles, filterState.roleFilter, filterState.searchText]);

  return (
    <>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Profiles</h2>
      </div>

      <Filters 
        roleFilter={filterState.roleFilter}
        setRoleFilter={handleSetRoleFilter}
        searchText={filterState.searchText}
        setSearchText={handleSetSearchText}
        handleReset={handleReset}
        roles={uniqueRoles}
      />

      <Wrapper>
        {loading && <p className={styles.loadingMessage}>Loading profiles...</p>}
        {error && <p className={styles.errorBox}>{error}</p>}
        {!loading && !error && filteredProfiles.length === 0 && (
          <p className={styles.noResults}>No profiles found.</p>
        )}
        {!loading && !error && filteredProfiles.length > 0 && (
          <div className={styles.cardsContainerSmall} ref={cardContainerRef}>
            {filteredProfiles.map((profile, index) => (
              <div 
                key={profile.id} 
                ref={(el) => cardRefs.current[index] = el}
                style={{ position: 'relative' }}
              >
                <Link 
                  to={`/profile/${profile.id}`}
                  onClick={() => onProfileClick(profile)}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    name={profile.name}
                    role={profile.role}
                    avatarUrl={profile.avatarUrl}
                  />
                </Link>
                {isEditMode && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteClick(profile)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '30px',
                      height: '30px',
                      padding: '0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                    title="Delete profile"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Wrapper>
    </>
  );
}

export default HomePage;
