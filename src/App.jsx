import React, { useState, useEffect } from 'react';
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
}

// Add Profile Form Component
function AddProfileForm({ onAddProfile, mode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    avatarUrl: '',
    year: '',
    major: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Title is required';
    } else if (formData.role.trim().length < 2) {
      newErrors.role = 'Title must be at least 2 characters';
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    } else if (formData.bio.trim().length > 200) {
      newErrors.bio = 'Bio must be less than 200 characters';
    }

    if (!formData.avatarUrl.trim()) {
      newErrors.avatarUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.avatarUrl);
      } catch {
        newErrors.avatarUrl = 'Please enter a valid URL';
      }
    }

    if (formData.year && (formData.year < 1900 || formData.year > 2100)) {
      newErrors.year = 'Please enter a valid year';
    }

    if (formData.major && formData.major.trim().length > 50) {
      newErrors.major = 'Major must be less than 50 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }

    const newProfile = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim(),
      avatarUrl: formData.avatarUrl.trim(),
      year: formData.year || '',
      major: formData.major.trim() || '',
      status: 'active',
      isFeatured: false
    };

    onAddProfile(newProfile);
    setSuccessMessage('Profile added successfully!');

    setFormData({
      name: '',
      email: '',
      role: '',
      bio: '',
      avatarUrl: '',
      year: '',
      major: ''
    });
    
    setErrors({});

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <section className={styles.formSection}>
      <h2 className={styles.formTitle}>Add New Profile</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
            placeholder="Enter full name"
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
            placeholder="email@example.com"
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role" className={styles.formLabel}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.role ? styles.inputError : ''}`}
            placeholder="e.g., Developer, Designer, Data Scientist"
          />
          {errors.role && (
            <span className={styles.errorMessage}>{errors.role}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bio" className={styles.formLabel}>
            Bio <span className={styles.required}>*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={`${styles.formTextarea} ${errors.bio ? styles.inputError : ''}`}
            placeholder="Write a brief bio (10-200 characters)"
            rows="4"
          />
          <div className={styles.charCount}>
            {formData.bio.length}/200 characters
          </div>
          {errors.bio && (
            <span className={styles.errorMessage}>{errors.bio}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="avatarUrl" className={styles.formLabel}>
            Image URL <span className={styles.required}>*</span>
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.avatarUrl ? styles.inputError : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.avatarUrl && (
            <span className={styles.errorMessage}>{errors.avatarUrl}</span>
          )}
          <small className={styles.fieldHint}>
            Use services like Unsplash, Pexels, or upload to Imgur
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.formLabel}>
            Graduation Year <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.year ? styles.inputError : ''}`}
            placeholder="2025"
            min="1900"
            max="2100"
          />
          {errors.year && (
            <span className={styles.errorMessage}>{errors.year}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="major" className={styles.formLabel}>
            Major <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="text"
            id="major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            className={`${styles.formInput} ${errors.major ? styles.inputError : ''}`}
            placeholder="e.g., Computer Science"
          />
          {errors.major && (
            <span className={styles.errorMessage}>{errors.major}</span>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          Add Profile
        </button>
      </form>
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

// Card Component
function Card({ name, role, bio, email, status, avatarUrl, year, major, isFeatured, viewMode, mode }) {
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
      
      <button 
        onClick={() => setViewMode(viewMode === 'view' ? 'edit' : 'view')} 
        className={styles.viewModeButton}
      >
        {viewMode === 'view' ? 'Edit Mode' : 'View Mode'}
      </button>
    </div>
  );
}

// API Filter Controls Component
function APIFilterControls({ apiTitleFilter, setApiTitleFilter, apiSearchText, setApiSearchText, handleApiReset, apiTitles, isLoading }) {
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
}

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
  const fetchTitles = async () => {
    try {
      const response = await fetch('https://web.ics.purdue.edu/~zong6/profile-app/get-titles.php');
      const data = await response.json();
      // API returns {titles: [...]}
      setApiTitles(data.titles || []);
    } catch (err) {
      console.error('Error fetching titles:', err);
      setError('Failed to load titles');
    }
  };

  // Fetch profiles from API
  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let url;
      if (apiTitleFilter || apiSearchText) {
        // Use filtered endpoint
        url = `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-filter.php?title=${encodeURIComponent(apiTitleFilter)}&name=${encodeURIComponent(apiSearchText)}`;
      } else {
        // Use all data endpoint
        url = 'https://web.ics.purdue.edu/~zong6/profile-app/fetch-data.php';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Transform API data to match our card format
      const transformedData = data.map((item, index) => ({
        id: `api-${index}`,
        name: item.name || 'Unknown',
        role: item.title || 'No Title',
        year: item.year || '',
        major: item.major || '',
        bio: item.bio || 'No bio available',
        email: item.email || 'no-email@example.com',
        status: 'active',
        avatarUrl: item.image || 'https://via.placeholder.com/400',
        isFeatured: false
      }));
      
      setApiProfiles(transformedData);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
      setApiProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset API filters
  const handleApiReset = () => {
    setApiTitleFilter('');
    setApiSearchText('');
  };
  
  // Function to add new profile
  const handleAddProfile = (newProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  };
  
  // Get unique roles for dropdown (local profiles)
  const uniqueRoles = [...new Set(profiles.map(profile => profile.role))];
  
  // Filter local profiles based on role and search text
  const filteredProfiles = profiles.filter((profile) => {
    const matchesRole = roleFilter === '' || profile.role === roleFilter;
    const matchesSearch = searchText === '' || 
      profile.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesRole && matchesSearch;
  });
  
  // Reset function for local profiles
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
      
      {/* Add Profile Form */}
      <AddProfileForm onAddProfile={handleAddProfile} mode={mode} />
      
      {/* Local Profiles Section */}
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
      
      <Section title={viewMode === 'view' ? "My Profiles" : "My Profiles (Edit Mode)"}>
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

      {/* API Profiles Section - NEW */}
      <APIFilterControls 
        apiTitleFilter={apiTitleFilter}
        setApiTitleFilter={setApiTitleFilter}
        apiSearchText={apiSearchText}
        setApiSearchText={setApiSearchText}
        handleApiReset={handleApiReset}
        apiTitles={apiTitles}
        isLoading={isLoading}
      />

      <Section title="Profiles from Database">
        <div className={styles.cardsContainer}>
          {isLoading ? (
            <div className={styles.loadingMessage}>Loading profiles...</div>
          ) : error ? (
            <div className={styles.errorBox}>{error}</div>
          ) : apiProfiles.length > 0 ? (
            apiProfiles.map((profile) => (
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
                viewMode="view"
                mode={mode}
              />
            ))
          ) : (
            <p className={styles.noResults}>
              No profiles found in database. Try adjusting your filters.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
