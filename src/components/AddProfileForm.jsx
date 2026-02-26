import React, { useState, useCallback } from 'react';
import styles from '../App.module.css';

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
    
    if (successMessage) {
      setSuccessMessage('');
    }
  }, [errors, successMessage]);

  const validateForm = useCallback(() => {
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
  }, [formData]);

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
  }, [formData, validateForm, onAddProfile]);

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

export default AddProfileForm;