// Lab 12

import React, { useRef, useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

function ProfileLayout({ mode }) {
  const navigate = useNavigate();
  const layoutRef = useRef(null);
  const buttonRef = useRef(null);

  // useLayoutEffect to ensure button is properly positioned before paint
  useLayoutEffect(() => {
    if (buttonRef.current && layoutRef.current) {
      // Measure and adjust button position if needed
      const buttonRect = buttonRef.current.getBoundingClientRect();
      console.log(`Back button positioned at: ${buttonRect.top}px from top`);
    }
  }, []);

  return (
    <div className={styles.profileDetailWrapper} ref={layoutRef}>
      <button
        ref={buttonRef}
        className={styles.backButton}
        onClick={() => navigate(-1)}
        style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}
      >
        Go Back
      </button>
      <Outlet />
    </div>
  );
}

export default ProfileLayout;
