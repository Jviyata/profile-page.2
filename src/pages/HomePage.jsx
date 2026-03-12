import React, { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import styles from '../App.module.css';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Filters from '../components/Filters';
import { Link } from 'react-router-dom';

function HomePage({ 
  profiles, 
  mode, 
  loading,
  error,
  isEditMode,
  onDeleteProfile,
  uniqueRoles,
  onProfileClick,
  roleFilter,
  setRoleFilter,
  searchText,
  setSearchText,
  handleReset
}) {
  // useRef to track card container and individual card widths
  const cardContainerRef = useRef(null);
  const cardRefs = useRef([]);

  // useLayoutEffect to measure card width and update state before paint
  useLayoutEffect(() => {
    if (cardRefs.current[0]) {
      const width = cardRefs.current[0].offsetWidth;
      // Just measure, don't need state for this
    }
  }, []);

  // Memoize delete handler
  const handleDeleteClick = useCallback((profile) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${profile.name}? This action cannot be undone.`
    );
    if (isConfirmed) {
      onDeleteProfile(profile.id);
    }
  }, [onDeleteProfile]);

  // Memoize filtered profiles calculation
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesRole = roleFilter === '' || profile.role === roleFilter;
      const matchesSearch = searchText === '' || 
        profile.name.toLowerCase().includes(searchText.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [profiles, roleFilter, searchText]);

  return (
    <>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Profiles</h2>
      </div>

      <Filters 
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchText={searchText}
        setSearchText={setSearchText}
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
