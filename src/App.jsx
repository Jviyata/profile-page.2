// Lab 13

import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styles from './App.module.css';

// Import components
import Navbar from './components/Navbar';
import ModeContext, { ModeProvider } from './context/ModeContext';

// Image paths from public/assets
const girl2Img = '/profile-page.2/assets/girl2.png';
const boyImg = '/profile-page.2/assets/boy.png';
const girlImg = '/profile-page.2/assets/girl.png';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AddProfilePage = lazy(() => import('./pages/AddProfilePage'));
const FetchedProfilePage = lazy(() => import('./pages/FetchedProfilePage'));
const ProfileDetailPage = lazy(() => import('./pages/ProfileDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppContent() {
  // Handle GitHub Pages 404 redirect for client-side routing
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sessionStorage.getItem('pendingNavigation')) {
      const redirectPath = sessionStorage.getItem('pendingNavigation');
      sessionStorage.removeItem('pendingNavigation');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  // Navigation state
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // State for filters (local profiles)
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // Get mode and isEditMode from Context
  const { mode, toggleMode, isEditMode, setIsEditMode } = useContext(ModeContext);
  
  // API-related states with local fallback data
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "Arika Gibson",
      role: "Frontend Developer",
      year: "2025",
      major: "Computer Science",
      bio: "Full-stack developer with 5 years of experience building web applications.",
      email: "arika.gibson@example.com",
      status: "active",
      avatarUrl: girl2Img,
      isFeatured: true
    },
    {
      id: 2,
      name: "Julian Luzzader",
      role: "UX Designer",
      year: "2026",
      major: "UX Design",
      bio: "Creative designer specializing in user interface and experience design.",
      email: "julian.luzzader@example.com",
      status: "active",
      avatarUrl: boyImg,
      isFeatured: false
    },
    {
      id: 3,
      name: "Viyata Ruta",
      role: "Backend Developer",
      year: "2024",
      major: "Data Science",
      bio: "Data scientist passionate about machine learning and artificial intelligence.",
      email: "viyata.ruta@example.com",
      status: "active",
      avatarUrl: girlImg,
      isFeatured: false
    }
  ]);
  
  const [apiProfiles, setApiProfiles] = useState([
    {
      id: 'api-1',
      name: "Arika Gibson",
      role: "Frontend Developer",
      year: "2025",
      major: "Computer Science",
      bio: "Full-stack developer with 5 years of experience building web applications.",
      email: "arika.gibson@example.com",
      status: "active",
      avatarUrl: girl2Img,
      isFeatured: false
    },
    {
      id: 'api-2',
      name: "Julian Luzzader",
      role: "UX Designer",
      year: "2026",
      major: "UX Design",
      bio: "Creative designer specializing in user interface and experience design.",
      email: "julian.luzzader@example.com",
      status: "active",
      avatarUrl: boyImg,
      isFeatured: false
    },
    {
      id: 'api-3',
      name: "Viyata Ruta",
      role: "Backend Developer",
      year: "2024",
      major: "Data Science",
      bio: "Data scientist passionate about machine learning and artificial intelligence.",
      email: "viyata.ruta@example.com",
      status: "active",
      avatarUrl: girlImg,
      isFeatured: false
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTitles, setAvailableTitles] = useState([]);

  // Fetch available titles from API
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch('https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php');
        const data = await response.json();
        setAvailableTitles(data.titles || []);
      } catch (err) {
        console.error('Error fetching titles:', err);
        setAvailableTitles(['Frontend Developer', 'UX Designer', 'Backend Developer']);
      }
    };
    fetchTitles();
  }, []);

  // Fetch filtered profiles from API - DEFINE FIRST
  const fetchFilteredProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('title', roleFilter);
      if (searchText) params.append('name', searchText);
      params.append('page', '1');
      params.append('limit', '10');

      const url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setProfiles(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching filtered profiles:', err);
      setError('Failed to fetch filtered profiles');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchText]);

  // Fetch all profiles from API
  useEffect(() => {
    const fetchAllProfiles = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php');
        const data = await response.json();
        setApiProfiles(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchAllProfiles();
  }, []);

  // Call filtered API when filters change - FIX INFINITE LOOP
  useEffect(() => {
    if (roleFilter || searchText) {
      fetchFilteredProfiles();
    } else {
      setProfiles(apiProfiles);
    }
  }, [roleFilter, searchText, fetchFilteredProfiles]);

  const handleReset = useCallback(() => {
    setRoleFilter('');
    setSearchText('');
  }, []);

  const handleAddProfile = useCallback((newProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  }, []);

  const handleDeleteProfile = useCallback((profileId) => {
    setProfiles(prev => prev.filter(profile => profile.id !== profileId));
  }, []);

  const handleProfileClick = useCallback((profile) => {
    setSelectedProfile(profile);
  }, []);

  const uniqueRoles = useMemo(() => 
    availableTitles.length > 0 ? availableTitles : [...new Set(profiles.map(profile => profile.role))], 
    [profiles, availableTitles]
  );

  const appClass = useMemo(() => 
    mode === 'dark' ? `${styles.appContainer} ${styles.darkMode}` : styles.appContainer,
    [mode]
  );

  // Navbar gets isEditMode from context, doesn't need stale props
  const navbarProps = useMemo(() => ({
    isEditMode,
    setIsEditMode
  }), [isEditMode, setIsEditMode]);

  return (
    <div className={appClass}>
      <Navbar {...navbarProps} />
      <Suspense fallback={<div className={styles.loadingMessage}>Loading...</div>}>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                profiles={profiles}
                mode={mode}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                handleReset={handleReset}
                uniqueRoles={uniqueRoles}
                onProfileClick={handleProfileClick}
                loading={loading}
                error={error}
                isEditMode={isEditMode}
                onDeleteProfile={handleDeleteProfile}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route 
            path="/add-profile" 
            element={<AddProfilePage onAddProfile={handleAddProfile} mode={mode} />} 
          />
          <Route 
            path="/other-profiles" 
            element={
              <FetchedProfilePage 
                apiProfiles={apiProfiles}
                mode={mode}
                onProfileClick={handleProfileClick}
                loading={loading}
                error={error}
                isEditMode={isEditMode}
              />
            } 
          />
          
          <Route 
            path="/profile/:id" 
            element={<ProfileDetailPage 
              profile={selectedProfile} 
              mode={mode} 
              isEditMode={isEditMode} 
              onDeleteProfile={handleDeleteProfile}
              allProfiles={profiles}
            />} 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/profile-page.2">
      <ModeProvider>
        <AppContent />
      </ModeProvider>
    </Router>
  );
}