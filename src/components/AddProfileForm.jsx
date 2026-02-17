import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationContext } from "../contexts/NotificationContext";
import styles from "../styles/addProfileForm.module.css";

// Simple validation function
const validateForm = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.role.trim()) errors.role = "Title is required";
  if (!form.email.trim()) errors.email = "Email is required";
  if (!form.bio.trim()) errors.bio = "Description is required";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }
  return errors;
};

export default function AddProfileForm({ onSuccess }) {
  const qc = useQueryClient();
  const { notification, showNotification } = useContext(NotificationContext);
  const [form, setForm] = useState({
    name: "", 
    role: "", 
    bio: "", 
    email: "", 
    avatarImage: null, 
    year: "2026",
    major: "General",
    status: "active", 
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          email: data.email,
          year: data.year,
          major: data.major,
          bio: data.bio,
          status: data.status,
          isFeatured: data.isFeatured,
          avatarImage: data.avatarImage || null,
        }),
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create profile");
      }
      
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/profiles"] });
      showNotification("Profile created successfully!", "success", 2000);
      setForm({ name: "", role: "", bio: "", email: "", avatarImage: null, year: "2026", major: "General", status: "active", isFeatured: false });
      setAvatarPreview(null);
      setFileName("No file chosen");
      setErrors({});
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      showNotification("Error creating profile. Please try again.", "error", 3000);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatarImage: reader.result });
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    mutation.mutate(form);
  };

  return (
    <form data-testid="form-add-profile" onSubmit={handleSubmit} className={styles.form}>
      {notification && (
        <div
          data-testid="text-notification"
          className={notification.type === "success" ? styles.successNotice : styles.errorNotice}
        >
          {notification.message}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input 
          id="name"
          data-testid="input-name" 
          className={styles.input} 
          placeholder="Enter full name" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
        />
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>Title</label>
        <input 
          id="role"
          data-testid="input-role" 
          className={styles.input} 
          placeholder="e.g. Developer, Designer" 
          value={form.role} 
          onChange={(e) => setForm({ ...form, role: e.target.value })} 
        />
        {errors.role && <p className={styles.error}>{errors.role}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input 
          id="email"
          data-testid="input-email" 
          className={styles.input} 
          type="email" 
          placeholder="your.email@example.com" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio" className={styles.label}>Add description</label>
        <textarea 
          id="bio"
          data-testid="input-bio" 
          className={styles.textarea} 
          placeholder="Tell us about yourself..." 
          value={form.bio} 
          onChange={(e) => setForm({ ...form, bio: e.target.value })} 
        />
        {errors.bio && <p className={styles.error}>{errors.bio}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="avatar-upload" className={styles.label}>Upload an image</label>
        <div className={styles.fileInputWrapper}>
          <input 
            id="avatar-upload"
            data-testid="input-avatar" 
            className={styles.fileInput} 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <span className={styles.fileName}>{fileName}</span>
        </div>
        {avatarPreview && (
          <div className={styles.previewContainer}>
            <img src={avatarPreview} alt="Preview" className={styles.preview} />
          </div>
        )}
      </div>

      <button
        data-testid="button-submit-profile"
        type="submit"
        disabled={mutation.isPending}
        className={styles.submitButton}
      >
        {mutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
