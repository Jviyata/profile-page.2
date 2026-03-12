import React from 'react';
import styles from '../App.module.css';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

function FetchedProfilePage({ apiProfiles, mode, onProfileClick, loading, error }) {
  return (
    <>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Other Profiles</h2>
        <p className={styles.pageSubtitle}>All profiles from the database.</p>
      </div>

      <Wrapper>
        {loading && <p className={styles.loadingMessage}>Loading profiles...</p>}
        {error && <p className={styles.errorBox}>{error}</p>}
        {!loading && !error && apiProfiles.length === 0 ? (
          <p className={styles.noResults}>No profiles found in database.</p>
        ) : (
          !loading && !error && (
            <div className={styles.cardsContainerSmall}>
              {apiProfiles.map((profile) => (
                <Link 
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  onClick={() => onProfileClick(profile)}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    profile={profile}
                  />
                </Link>
              ))}
            </div>
          )
        )}
      </Wrapper>
    </>
  );
}

export default FetchedProfilePage;
