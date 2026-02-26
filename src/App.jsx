import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import styles from './App.module.css';

// Lazy load the AddProfileForm component
const AddProfileForm = lazy(() => import('./components/AddProfileForm'));

// Header Component
const Header = React.memo(function Header({ mode, toggleMode }) {
  const siteName = "Profile Gallery";
  const tagline = mode === 'light' ? "Browse the profiles below:" : "Discover profiles in dark mode";
  
  return (
    <header className={styles.galleryHeader}>
      <h1>{siteName}</h1>
      <p className={styles.tagline}>{tagline}</p>
      <button onClick={toggleMode} className={styles.modeToggle}>
        {mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </header>
  );
});

// Introduction Component
const Introduction = React.memo(function Introduction({ viewMode }) {
  const name = "Vruta";
  const bio = "Welcome to my profile gallery!";
  const email = "vruta@purdue.brightspace.com";
  
  return (
    <section className={styles.introSection}>
      <h2>Hello, I'm {name}!</h2>
      <p className={styles.bioText}>{bio}</p>
      
      {viewMode === 'view' ? (
        <p className={styles.contactInfo}>
          Contact: <a href={`mailto:${email}`}>{email}</a>
        </p>
      ) : (
        <div className={styles.editMode}>
          <p className={styles.contactInfo}>Email (editable):</p>
          <input 
            type="email" 
            defaultValue={email} 
            className={styles.editInput}
          />
          <p className={styles.editHint}>Edit mode active - changes are for demonstration only</p>
        </div>
      )}
    </section>
  );
});

// Section Wrapper Component
const Section = React.memo(function Section({ title, children }) {
  return (
    <section className={styles.sectionWrapper}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </section>
  );
});

// Card Component
const Card = React.memo(function Card({ name, role, bio, email, status, avatarUrl, year, major, isFeatured, viewMode, mode }) {
  const cardClasses = `${styles.profileCard} ${isFeatured ? styles.featuredCard : ''} ${mode === 'dark' ? styles.darkCard : ''}`;
  const statusClass = status === "active" ? styles.statusActive : styles.statusInactive;
  
  return (
    <div className={cardClasses}>
      {isFeatured && <div className={styles.featuredBadge}>Featured</div>}
      <div className={styles.avatarCircle}>
        <img src={avatarUrl} alt={name} className={styles.avatarImg} />
      </div>
      <h3 className={styles.cardName}>{name}</h3>
      <p className={styles.cardRole}>{role}</p>
      {year && <p className={styles.cardYear}>Class of {year}</p>}
      {major && <p className={styles.cardMajor}>{major}</p>}
      <p className={styles.cardBio}>{bio}</p>
      
      {viewMode === 'view' ? (
        <p className={styles.cardEmail}>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      ) : (
        <div className={styles.editEmailContainer}>
          <label className={styles.editLabel}>Email:</label>
          <input 
            type="email" 
            defaultValue={email} 
            className={styles.editInput}
          />
        </div>
      )}
      
      <span className={statusClass}>{status}</span>
    </div>
  );
});

// Filter Controls Component
const FilterControls = React.memo(function FilterControls({ roleFilter, setRoleFilter, searchText, setSearchText, handleReset, roles, viewMode, setViewMode }) {
  return (
    <div className={styles.filterControls}>
      <div className={styles.filterGroup}>
        <label htmlFor="role-filter">Filter by Role:</label>
        <select 
          id="role-filter"
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className={styles.filterDropdown}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="search-box">Search by Name:</label>
        <input
          id="search-box"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Type a name..."
          className={styles.searchInput}
        />
      </div>
      
      <button onClick={handleReset} className={styles.resetButton}>
        Reset Filters
      </button>
      
      <button 
        onClick={() => setViewMode(viewMode === 'view' ? 'edit' : 'view')} 
        className={styles.viewModeButton}
      >
        {viewMode === 'view' ? 'Edit Mode' : 'View Mode'}
      </button>
    </div>
  );
});

// API Filter Controls Component
const APIFilterControls = React.memo(function APIFilterControls({ apiTitleFilter, setApiTitleFilter, apiSearchText, setApiSearchText, handleApiReset, apiTitles, isLoading }) {
  return (
    <div className={styles.filterControls}>
      <div className={styles.filterGroup}>
        <label htmlFor="api-title-filter">Filter by Title:</label>
        <select 
          id="api-title-filter"
          value={apiTitleFilter} 
          onChange={(e) => setApiTitleFilter(e.target.value)}
          className={styles.filterDropdown}
          disabled={isLoading}
        >
          <option value="">All Titles</option>
          {apiTitles.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="api-search-box">Search by Name:</label>
        <input
          id="api-search-box"
          type="text"
          value={apiSearchText}
          onChange={(e) => setApiSearchText(e.target.value)}
          placeholder="Type a name..."
          className={styles.searchInput}
          disabled={isLoading}
        />
      </div>
      
      <button onClick={handleApiReset} className={styles.resetButton} disabled={isLoading}>
        Reset Filters
      </button>
    </div>
  );
});

// Cards Container Component - new sub-component
const CardsContainer = React.memo(function CardsContainer({ profiles, viewMode, mode, isLoading, error, noResultsMessage }) {
  if (isLoading) {
    return <div className={styles.loadingMessage}>Loading profiles...</div>;
  }
  
  if (error) {
    return <div className={styles.errorBox}>{error}</div>;
  }
  
  if (profiles.length === 0) {
    return <p className={styles.noResults}>{noResultsMessage}</p>;
  }
  
  return (
    <div className={styles.cardsContainer}>
      {profiles.map((profile) => (
        <Card
          key={profile.id}
          name={profile.name}
          role={profile.role}
          year={profile.year}
          major={profile.major}
          bio={profile.bio}
          email={profile.email}
          status={profile.status}
          avatarUrl={profile.avatarUrl}
          isFeatured={profile.isFeatured}
          viewMode={viewMode}
          mode={mode}
        />
      ))}
    </div>
  );
});

// Main App Component
export default function App() {
  // State for filters (local profiles)
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // State for UI modes
  const [mode, setMode] = useState('light');
  const [viewMode, setViewMode] = useState('view');
  
  // State for local profiles
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: "Arika Gibson",
      role: "Developer",
      year: "2025",
      major: "Computer Science",
      bio: "Full-stack developer with 5 years of experience building web applications.",
      email: "arika.gibson@example.com",
      status: "active",
      avatarUrl: "/Arika_Gibson.png",
      isFeatured: true
    },
    {
      id: 2,
      name: "Julian Luzzader",
      role: "Designer",
      year: "2026",
      major: "UX Design",
      bio: "Creative designer specializing in user interface and experience design.",
      email: "julian.luzzader@example.com",
      status: "active",
      avatarUrl: "/Julian__Luzadder.png",
      isFeatured: false
    },
    {
      id: 3,
      name: "Lyndie Lingg",
      role: "Data Scientist",
      year: "2024",
      major: "Data Science",
      bio: "Data scientist passionate about machine learning and artificial intelligence.",
      email: "lyndie.lingg@example.com",
      status: "active",
      avatarUrl: "/Lyndie_Lingg.png",
      isFeatured: false
    }
  ]);

  // State for API data
  const [apiProfiles, setApiProfiles] = useState([]);
  const [apiTitles, setApiTitles] = useState([]);
  const [apiTitleFilter, setApiTitleFilter] = useState('');
  const [apiSearchText, setApiSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch titles on component mount
  useEffect(() => {
    fetchTitles();
  }, []);

  // Fetch profiles when filters change
  useEffect(() => {
    fetchProfiles();
  }, [apiTitleFilter, apiSearchText]);

  // Fetch titles from API
  const fetchTitles = useCallback(async () => {
    try {
      const response = await fetch('https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php');
      const data = await response.json();
      setApiTitles(data.titles || []);
    } catch (err) {
      console.error('Error fetching titles:', err);
      setError('Failed to load titles');
    }
  }, []);

  // Fetch profiles from API
  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url;
      if (apiTitleFilter || apiSearchText) {
        url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${encodeURIComponent(apiTitleFilter)}&name=${encodeURIComponent(apiSearchText)}`;
      } else {
        url = 'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      const transformedData = data.map((item, index) => {
        const imageFilename = item.name ? `/${item.name.replace(/\s+/g, '_')}.png` : null;
        
        return {
          id: `api-${index}`,
          name: item.name || 'Unknown',
          role: item.title || 'No Title',
          year: item.year || '',
          major: item.major || '',
          bio: item.bio || 'No bio available',
          email: item.email || 'no-email@example.com',
          status: 'active',
          avatarUrl: item.image || imageFilename || 'https://via.placeholder.com/400',
          isFeatured: false
        };
      });
      
      setApiProfiles(transformedData);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
      setApiProfiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiTitleFilter, apiSearchText]);

  // Memoized callbacks for filter controls
  const handleReset = useCallback(() => {
    setRoleFilter('');
    setSearchText('');
  }, []);

  const handleApiReset = useCallback(() => {
    setApiTitleFilter('');
    setApiSearchText('');
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode]);

  const handleAddProfile = useCallback((newProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  }, []);

  const setRoleFilterCallback = useCallback((value) => {
    setRoleFilter(value);
  }, []);

  const setSearchTextCallback = useCallback((value) => {
    setSearchText(value);
  }, []);

  const setViewModeCallback = useCallback((value) => {
    setViewMode(value);
  }, []);

  const setApiTitleFilterCallback = useCallback((value) => {
    setApiTitleFilter(value);
  }, []);

  const setApiSearchTextCallback = useCallback((value) => {
    setApiSearchText(value);
  }, []);

  // Memoized derived data
  const uniqueRoles = useMemo(() => 
    [...new Set(profiles.map(profile => profile.role))], 
    [profiles]
  );

  const filteredProfiles = useMemo(() => 
    profiles.filter((profile) => {
      const matchesRole = roleFilter === '' || profile.role === roleFilter;
      const matchesSearch = searchText === '' || 
        profile.name.toLowerCase().includes(searchText.toLowerCase());
      return matchesRole && matchesSearch;
    }), 
    [profiles, roleFilter, searchText]
  );

  const appClass = useMemo(() => 
    mode === 'dark' ? `${styles.appContainer} ${styles.darkMode}` : styles.appContainer,
    [mode]
  );
  
  return (
    <div className={appClass}>
      <Header mode={mode} toggleMode={toggleMode} />
      <Introduction viewMode={viewMode} />
      
      {/* Add Profile Form - Lazy Loaded */}
      <Suspense fallback={<div className={styles.loadingMessage}>Loading form...</div>}>
        <AddProfileForm onAddProfile={handleAddProfile} mode={mode} />
      </Suspense>
      
      {/* Local Profiles Section */}
      <FilterControls 
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilterCallback}
        searchText={searchText}
        setSearchText={setSearchTextCallback}
        handleReset={handleReset}
        roles={uniqueRoles}
        viewMode={viewMode}
        setViewMode={setViewModeCallback}
      />
      
      <Section title={viewMode === 'view' ? "My Profiles" : "My Profiles (Edit Mode)"}>
        <CardsContainer
          profiles={filteredProfiles}
          viewMode={viewMode}
          mode={mode}
          isLoading={false}
          error={null}
          noResultsMessage="No profiles match your filters. Try adjusting your search or role filter."
        />
      </Section>

      {/* API Profiles Section */}
      <APIFilterControls 
        apiTitleFilter={apiTitleFilter}
        setApiTitleFilter={setApiTitleFilterCallback}
        apiSearchText={apiSearchText}
        setApiSearchText={setApiSearchTextCallback}
        handleApiReset={handleApiReset}
        apiTitles={apiTitles}
        isLoading={isLoading}
      />

      <Section title="Profiles from Database">
        <CardsContainer
          profiles={apiProfiles}
          viewMode="view"
          mode={mode}
          isLoading={isLoading}
          error={error}
          noResultsMessage="No profiles found in database. Try adjusting your filters."
        />
      </Section>
    </div>
  );
}