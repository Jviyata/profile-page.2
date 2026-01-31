import React, { useState } from 'react';
import styles from './App.module.css';

// Header Component
function Header({ mode, toggleMode }) {
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
}

// Introduction Component
function Introduction({ viewMode }) {
  const name = "Vruta";
  const bio = "Welcome to my profile gallery!";
  const email = "vruta@purdue.brightspace.com";
  
  return (
    <section className={styles.introSection}>
      <h2>Hello, I'm {name}!</h2>
      <p className={styles.bioText}>{bio}</p>
      
      {/* Conditional Rendering based on viewMode */}
      {viewMode === 'view' ? (
        <p className={styles.contactInfo}>
          Contact: <a href={`mailto:${email}`}>{email}</a>
        </p>
      ) : (
        <div className={styles.editMode}>
          <p className={styles.contactInfo}>📧 Email (editable):</p>
          <input 
            type="email" 
            defaultValue={email} 
            className={styles.editInput}
          />
          <p className={styles.editHint}>✏️ Edit mode active - changes are for demonstration only</p>
        </div>
      )}
    </section>
  );
}

// Section Wrapper Component
function Section({ title, children }) {
  return (
    <section className={styles.sectionWrapper}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </section>
  );
}

// Card Component with dynamic styling
function Card({ name, role, bio, email, status, avatarUrl, year, major, isFeatured, viewMode, mode }) {
  // Dynamic class names based on mode and viewMode
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
      
      {/* Conditional rendering based on viewMode */}
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
}

// Filter Controls Component
function FilterControls({ roleFilter, setRoleFilter, searchText, setSearchText, handleReset, roles, viewMode, setViewMode }) {
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
      
      {/* View Mode Toggle */}
      <button 
        onClick={() => setViewMode(viewMode === 'view' ? 'edit' : 'view')} 
        className={styles.viewModeButton}
      >
        {viewMode === 'view' ? 'Edit Mode' : 'View Mode'}
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  // State for filters
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // State for UI modes
  const [mode, setMode] = useState('light'); // light or dark
  const [viewMode, setViewMode] = useState('view'); // view or edit
  
  // Array of card data
  const profilesData = [
    {
      id: 1,
      name: "Arika Gibson",
      role: "Developer",
      year: "2025",
      major: "Computer Science",
      bio: "Full-stack developer with 5 years of experience building web applications.",
      email: "arika.gibson@example.com",
      status: "active",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
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
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
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
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      isFeatured: false
    }
  ];
  
  // Get unique roles for dropdown
  const uniqueRoles = [...new Set(profilesData.map(profile => profile.role))];
  
  // Filter profiles based on role and search text
  const filteredProfiles = profilesData.filter((profile) => {
    const matchesRole = roleFilter === '' || profile.role === roleFilter;
    const matchesSearch = searchText === '' || 
      profile.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesRole && matchesSearch;
  });
  
  // Reset function
  const handleReset = () => {
    setRoleFilter('');
    setSearchText('');
  };
  
  // Toggle mode function
  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };
  
  // Dynamic class for app container based on mode
  const appClass = mode === 'dark' ? `${styles.appContainer} ${styles.darkMode}` : styles.appContainer;
  
  return (
    <div className={appClass}>
      <Header mode={mode} toggleMode={toggleMode} />
      <Introduction viewMode={viewMode} />
      
      <FilterControls 
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        handleReset={handleReset}
        roles={uniqueRoles}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <Section title={viewMode === 'view' ? "Featured Profiles" : "Featured Profiles (Edit Mode)"}>
        <div className={styles.cardsContainer}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
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
            ))
          ) : (
            <p className={styles.noResults}>
              No profiles match your filters. Try adjusting your search or role filter.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
