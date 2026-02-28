import React, { useState, useCallback } from 'react';
import styles from '../App.module.css';

function AddOtherProfileForm({ onAddProfile, mode }) {
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
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'File size must be less than 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please upload a valid image file'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatarUrl: reader.result
        }));
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }

    const newProfile = {
      id: `api-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim(),
      avatarUrl: formData.avatarUrl,
      year: formData.year || '',
      major: formData.major.trim() || '',
      status: 'active',
      isFeatured: false
    };

    onAddProfile(newProfile);
    setSuccessMessage('Profile added to Other Profiles!');

    setFormData({
      name: '',
      email: '',
      role: '',
      bio: '',
      avatarUrl: '',
      year: '',
      major: ''
    });
    
    setImagePreview(null);
    setErrors({});

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  }, [formData, validateForm, onAddProfile]);

  return (
    <div className={styles.filterControls}>
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={styles.searchInput}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className={styles.searchInput}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role">Title</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Developer"
            className={styles.searchInput}
          />
          {errors.role && <span className={styles.errorMessage}>{errors.role}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a brief bio"
            className={styles.searchInput}
          />
          {errors.bio && <span className={styles.errorMessage}>{errors.bio}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="avatar">Upload Image</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          {errors.avatar && <span className={styles.errorMessage}>{errors.avatar}</span>}
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" className={styles.previewImg} />
              <p className={styles.previewLabel}>Image selected</p>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year">Graduation Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="2025"
            className={styles.searchInput}
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
            placeholder="e.g., Computer Science"
            className={styles.searchInput}
          />
        </div>

        <button type="submit" className={styles.resetButton}>
          Add Profile
        </button>
      </form>
    </div>
  );
}

export default AddOtherProfileForm;
