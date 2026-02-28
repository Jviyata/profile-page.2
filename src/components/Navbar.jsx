// Lab 13

import React, { useContext, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../App.module.css';
import ModeContext from '../context/ModeContext';

const Navbar = memo(({ isEditMode, setIsEditMode }) => {
  const location = useLocation();
  const { mode, toggleMode } = useContext(ModeContext);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLeft}>
          <h1 className={styles.siteName}>Profile App</h1>
          <ul className={styles.navMenu}>
            <li>
              <Link 
                to="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.navActive : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/add-profile" 
                className={`${styles.navLink} ${isActive('/add-profile') ? styles.navActive : ''}`}
              >
                Add Profile
              </Link>
            </li>
            <li>
              <Link 
                to="/other-profiles" 
                className={`${styles.navLink} ${isActive('/other-profiles') ? styles.navActive : ''}`}
              >
                Other Profiles
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`${styles.navLink} ${isActive('/about') ? styles.navActive : ''}`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.navRight}>
          <button 
            className={styles.modeToggle} 
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? 'Edit Mode: On' : 'Edit Mode: Off'}
          </button>
          <button 
            className={styles.modeToggle} 
            onClick={toggleMode}
          >
            {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
