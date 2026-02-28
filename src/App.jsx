// Lab 13

import React, { useState, useCallback, useMemo, lazy, Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';

// Import components
import Navbar from './components/Navbar';
import ModeContext, { ModeProvider } from './context/ModeContext';

// Import assets
import girl2Img from './assets/girl2.png';
import boyImg from './assets/boy.png';
import girlImg from './assets/girl.png';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AddProfilePage = lazy(() => import('./pages/AddProfilePage'));
const FetchedProfilePage = lazy(() => import('./pages/FetchedProfilePage'));
const ProfileDetailPage = lazy(() => import('./pages/ProfileDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfileLayout = lazy(() => import('./layouts/ProfileLayout'));

function AppContent() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // State for filters (local profiles)
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // State for UI modes
  const [viewMode, setViewMode] = useState('view');
  
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

  // Fetch all profiles from API
  useEffect(() => {
    const fetchAllProfiles = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php');
        const data = await response.json();
        setApiProfiles(data.data || apiProfiles);
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

  // Call filtered API when filters change
  useEffect(() => {
    if (roleFilter || searchText) {
      fetchFilteredProfiles();
    } else {
      setProfiles(apiProfiles);
    }
  }, [roleFilter, searchText, apiProfiles]);

  // Fetch filtered profiles from API
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

  // Memoize Navbar props to prevent unnecessary re-renders
  const navbarProps = useMemo(() => ({
    mode,
    toggleMode,
    isEditMode,
    setIsEditMode
  }), [mode, toggleMode, isEditMode, setIsEditMode]);

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
                viewMode={viewMode}
                mode={mode}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                searchText={searchText}
                setSearchText={setSearchText}
                handleReset={handleReset}
                uniqueRoles={uniqueRoles}
                setViewMode={setViewMode}
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
                viewMode={viewMode}
                onProfileClick={handleProfileClick}
                loading={loading}
                error={error}
                isEditMode={isEditMode}
              />
            } 
          />
          
          {/* Nested Profile Layout Route */}
          <Route 
            path="/profile" 
            element={<ProfileLayout mode={mode} />}
          >
            <Route 
              path=":id" 
              element={
                <ProfileDetailPage 
                  profile={selectedProfile} 
                  mode={mode} 
                  isEditMode={isEditMode} 
                  onDeleteProfile={handleDeleteProfile}
                  allProfiles={profiles}
                />
              } 
            />
          </Route>

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