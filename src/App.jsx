import React, { useState } from 'react';

// Header Component
function Header() {
  const siteName = "Profile Gallery";
  const tagline = "Browse the profiles below:";
  const headerClass = "gallery-header";
  
  return (
    <header className={headerClass}>
      <h1>{siteName}</h1>
      <p className="tagline">{tagline}</p>
    </header>
  );
}

// Introduction Component
function Introduction() {
  const name = "Vruta";
  const bio = "Welcome to my profile gallery!";
  const email = "vruta@purdue.brightspace.com";
  const introClass = "intro-section";
  
  return (
    <section className={introClass}>
      <h2>Hello, I'm {name}!</h2>
      <p className="bio-text">{bio}</p>
      <p className="contact-info">
        Contact: <a href={`mailto:${email}`}>{email}</a>
      </p>
    </section>
  );
}

// Section Wrapper Component (uses children)
function Section({ title, children }) {
  return (
    <section className="section-wrapper">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

// Card Component (now uses props instead of hard-coded data)
function Card({ name, role, bio, email, status, avatarUrl, year, major, isFeatured }) {
  const cardClass = isFeatured ? "profile-card featured-card" : "profile-card";
  const statusClass = status === "active" ? "status-active" : "status-inactive";
  
  return (
    <div className={cardClass}>
      {isFeatured && <div className="featured-badge">Featured</div>}
      <div className="avatar-circle">
        <img src={avatarUrl} alt={name} className="avatar-img" />
      </div>
      <h3 className="card-name">{name}</h3>
      <p className="card-role">{role}</p>
      {year && <p className="card-year">Class of {year}</p>}
      {major && <p className="card-major">{major}</p>}
      <p className="card-bio">{bio}</p>
      <p className="card-email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <span className={statusClass}>{status}</span>
    </div>
  );
}

// Filter Controls Component
function FilterControls({ roleFilter, setRoleFilter, searchText, setSearchText, handleReset, roles }) {
  return (
    <div className="filter-controls">
      <div className="filter-group">
        <label htmlFor="role-filter">Filter by Role:</label>
        <select 
          id="role-filter"
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="search-box">Search by Name:</label>
        <input
          id="search-box"
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Type a name..."
          className="search-input"
        />
      </div>
      
      <button onClick={handleReset} className="reset-button">
        Reset Filters
      </button>
    </div>
  );
}

// Main App Component
export default function App() {
  // State for filters
  const [roleFilter, setRoleFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  
  // Array of card data (at least 2 profiles)
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
  
  return (
    <div className="app-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .app-container {
          min-height: 100vh;
          background: #f7fafc;
          padding: 40px 20px;
        }
        
        .gallery-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
        }
        
        .gallery-header h1 {
          font-size: 2.5rem;
          color: #1a202c;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .tagline {
          font-size: 1.1rem;
          color: #4a5568;
        }
        
        .intro-section {
          max-width: 700px;
          margin: 0 auto 50px;
          text-align: center;
          background: white;
          padding: 35px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }
        
        .intro-section h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 15px;
        }
        
        .bio-text {
          font-size: 1.05rem;
          color: #4a5568;
          line-height: 1.7;
          margin-bottom: 15px;
        }
        
        .contact-info {
          font-size: 1rem;
          color: #718096;
        }
        
        .contact-info a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 500;
        }
        
        .contact-info a:hover {
          text-decoration: underline;
        }
        
        .filter-controls {
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 25px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          display: flex;
          gap: 20px;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          min-width: 200px;
        }
        
        .filter-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d3748;
        }
        
        .filter-dropdown,
        .search-input {
          padding: 10px 14px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          color: #2d3748;
          background: white;
          transition: all 0.2s ease;
        }
        
        .filter-dropdown:focus,
        .search-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }
        
        .filter-dropdown:hover,
        .search-input:hover {
          border-color: #cbd5e0;
        }
        
        .reset-button {
          padding: 10px 24px;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          height: fit-content;
        }
        
        .reset-button:hover {
          background: #c53030;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
        }
        
        .reset-button:active {
          transform: translateY(0);
        }
        
        .section-wrapper {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }
        
        .section-title {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 25px;
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .section-content {
          padding: 20px 0;
        }
        
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }
        
        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        }
        
        .featured-card {
          border: 2px solid #3182ce;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
        }
        
        .featured-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #3182ce;
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .avatar-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 20px;
          overflow: hidden;
          border: 4px solid #e2e8f0;
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-name {
          font-size: 1.3rem;
          color: #1a202c;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .card-role {
          font-size: 0.95rem;
          color: #3182ce;
          margin-bottom: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .card-year {
          font-size: 0.85rem;
          color: #718096;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .card-major {
          font-size: 0.9rem;
          color: #4a5568;
          margin-bottom: 15px;
          font-style: italic;
        }
        
        .card-bio {
          font-size: 0.95rem;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .card-email {
          font-size: 0.9rem;
          color: #718096;
          margin-bottom: 20px;
        }
        
        .card-email a {
          color: #3182ce;
          text-decoration: none;
        }
        
        .card-email a:hover {
          text-decoration: underline;
        }
        
        .status-active {
          display: inline-block;
          padding: 6px 16px;
          background: #48bb78;
          color: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .status-inactive {
          display: inline-block;
          padding: 6px 16px;
          background: #cbd5e0;
          color: #2d3748;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        @media (max-width: 768px) {
          .gallery-header h1 {
            font-size: 2rem;
          }
          
          .intro-section {
            padding: 25px;
          }
          
          .intro-section h2 {
            font-size: 1.5rem;
          }
          
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-group {
            min-width: 100%;
          }
          
          .reset-button {
            width: 100%;
          }
          
          .section-wrapper {
            padding: 20px;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
          
          .cards-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <Header />
      <Introduction />
      
      <FilterControls 
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        handleReset={handleReset}
        roles={uniqueRoles}
      />
      
      <Section title="Featured Profiles">
        <div className="cards-container">
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
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#718096', fontSize: '1.1rem', gridColumn: '1 / -1' }}>
              No profiles match your filters. Try adjusting your search or role filter.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}
