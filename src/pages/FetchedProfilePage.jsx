import React from 'react';
import styles from '../App.module.css';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';

function FetchedProfilePage({ apiProfiles, mode, viewMode, onProfileClick }) {
  return (
    <>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Other Profiles</h2>
        <p className={styles.pageSubtitle}>All profiles from the database.</p>
      </div>

      <Wrapper>
        {apiProfiles.length === 0 ? (
          <p className={styles.noResults}>No profiles found in database.</p>
        ) : (
          <div className={styles.cardsContainerSmall}>
            {apiProfiles.map((profile) => (
              <Card
                key={profile.id}
                name={profile.name}
                role={profile.role}
                avatarUrl={profile.avatarUrl}
                onClick={() => onProfileClick(profile)}
              />
            ))}
          </div>
        )}
      </Wrapper>
    </>
  );
}

export default FetchedProfilePage;
