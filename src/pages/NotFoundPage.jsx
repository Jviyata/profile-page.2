// Lab 6

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../App.module.css';

function NotFoundPage() {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Warning Triangle Button */}
      <button
        onClick={() => setShowMessage(!showMessage)}
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '40px',
          height: '40px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}
        title="Page not found"
      >
        <div style={{
          width: '0',
          height: '0',
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '26px solid #FFA500',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            position: 'absolute',
            top: '4px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            !
          </span>
        </div>
      </button>

      {/* Not Found Message */}
      {showMessage && (
        <div className={styles.profilesHeader}>
          <div className={styles.sectionWrapper}>
            <h1 className={styles.profilesTitle}>404 - Page Not Found</h1>
            <p className={styles.noResults}>The page you're looking for doesn't exist.</p>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link 
                to="/" 
                className={styles.backButton}
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Default Message when no warning clicked */}
      {!showMessage && (
        <div className={styles.profilesHeader}>
          <div className={styles.sectionWrapper}>
            <h1 className={styles.profilesTitle}>Page Not Found</h1>
            <p className={styles.noResults}>Click the warning icon in the top-right corner to see details, or go back home.</p>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link 
                to="/" 
                className={styles.backButton}
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotFoundPage;
