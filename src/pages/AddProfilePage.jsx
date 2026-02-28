import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

function AddProfilePage({ onAddProfile, mode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    avatarUrl: '',
    year: '',
    major: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Title is required';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    }
    
    if (!formData.avatarUrl) {
      newErrors.avatar = 'Image is required';
    }
    
    return newErrors;
  }, [formData]);

  const handleChange = useCallback((e) => {
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
  }, [errors]);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatarUrl: reader.result
        }));
        setImagePreview(reader.result);
        if (errors.avatar) {
          setErrors(prev => ({
            ...prev,
            avatar: ''
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  }, [errors.avatar]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }
    
    const newProfile = {
      id: Date.now(),
      ...formData,
      isFeatured: false
    };
    
    onAddProfile(newProfile);
    setSuccessMessage('Profile added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: '',
      bio: '',
      avatarUrl: '',
      year: '',
      major: '',
      status: 'active'
    });
    setImagePreview(null);
    setErrors({});
    
    // ✅ Redirect to homepage after successful submission
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  }, [formData, validateForm, onAddProfile, navigate]);

  return (
    <div className={styles.addProfileSection}>
      <div className={styles.profilesHeader}>
        <h2 className={styles.profilesTitle}>Add New Profile</h2>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Title *</label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
            {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
            {errors.bio && <span className={styles.errorMessage}>{errors.bio}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="year">Year</label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="major">Major</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="avatar">Image *</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              className={mode === 'dark' ? styles.darkModeInput : ''}
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginTop: '1rem'
                }}
              />
            )}
            {errors.avatar && <span className={styles.errorMessage}>{errors.avatar}</span>}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#6B7C3A',
              color: '#F5F5F5',
              border: 'none',
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.05rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              marginTop: '1rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#8FA35A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7C3A'}
          >
            Add Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProfilePage;
