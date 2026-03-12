import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../App.module.css';

function ProfileDetailPage({ mode, isEditMode, onDeleteProfile, allProfiles }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Find profile from allProfiles array using the :id parameter
    const found = allProfiles.find(p => String(p.id) === String(id));
    setProfile(found);
  }, [id, allProfiles]);

  if (!profile) {
    return (
      <div className={styles.profileDetailContent}>
        <h1>Profile not found</h1>
      </div>
    );
  }

  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${profile.name}? This action cannot be undone.`
    );
    if (isConfirmed) {
      onDeleteProfile(profile.id);
    }
  };

  return (
    <div className={styles.profileDetailContainer}>
      <div style={{ position: 'relative' }}>
        <div className={styles.profileDetailAvatar}>
          <img src={profile.avatarUrl} alt={profile.name} />
        </div>
        {isEditMode && (
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
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

      <div className={styles.profileDetailContent}>
        <h1>{profile.name}</h1>
        <div className={styles.detailRole}>{profile.role}</div>
        <div className={styles.detailInfo}>
          <p><strong>Year:</strong> {profile.year}</p>
          <p><strong>Major:</strong> {profile.major}</p>
        </div>
        <div className={styles.detailBio}>{profile.bio}</div>
        <div className={styles.detailEmail}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
        <div className={styles.detailStatus}>{profile.status}</div>
      </div>
    </div>
  );
}

export default ProfileDetailPage;
