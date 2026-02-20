import { useReducer, useContext, useRef } from "react";
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

// Reducer for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value }
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SET_AVATAR":
      return {
        ...state,
        form: { ...state.form, avatarImage: action.image },
        avatarPreview: action.preview,
        fileName: action.fileName
      };
    case "RESET_FORM":
      return {
        form: {
          name: "", 
          role: "", 
          bio: "", 
          email: "", 
          avatarImage: null, 
          year: "2026",
          major: "General",
          status: "active", 
          isFeatured: false,
        },
        errors: {},
        avatarPreview: null,
        fileName: "No file chosen"
      };
    default:
      return state;
  }
};

const initialState = {
  form: {
    name: "", 
    role: "", 
    bio: "", 
    email: "", 
    avatarImage: null, 
    year: "2026",
    major: "General",
    status: "active", 
    isFeatured: false,
  },
  errors: {},
  avatarPreview: null,
  fileName: "No file chosen"
};

export default function AddProfileForm({ onSuccess }) {
  const qc = useQueryClient();
  const { notification, showNotification } = useContext(NotificationContext);
  const [state, dispatch] = useReducer(formReducer, initialState);
  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Save to localStorage instead of making API call
      const stored = localStorage.getItem("customProfiles");
      const existing = stored ? JSON.parse(stored) : [];
      const newProfile = {
        id: Date.now(),
        name: data.name,
        role: data.role,
        email: data.email,
        year: data.year,
        major: data.major,
        bio: data.bio,
        status: data.status,
        isFeatured: data.isFeatured,
        avatarImage: data.avatarImage || null,
      };
      existing.push(newProfile);
      localStorage.setItem("customProfiles", JSON.stringify(existing));
      return newProfile;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/profiles"] });
      showNotification("Profile created successfully!", "success", 2000);
      dispatch({ type: "RESET_FORM" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: "SET_AVATAR",
          image: reader.result,
          preview: reader.result,
          fileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(state.form);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: validationErrors });
      return;
    }
    dispatch({ type: "SET_ERRORS", errors: {} });
    mutation.mutate(state.form);
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
          value={state.form.name} 
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "name", value: e.target.value })} 
        />
        {state.errors.name && <p className={styles.error}>{state.errors.name}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role" className={styles.label}>Title</label>
        <input 
          id="role"
          data-testid="input-role" 
          className={styles.input} 
          placeholder="e.g. Developer, Designer" 
          value={state.form.role} 
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "role", value: e.target.value })} 
        />
        {state.errors.role && <p className={styles.error}>{state.errors.role}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input 
          id="email"
          data-testid="input-email" 
          className={styles.input} 
          type="email" 
          placeholder="your.email@example.com" 
          value={state.form.email} 
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "email", value: e.target.value })} 
        />
        {state.errors.email && <p className={styles.error}>{state.errors.email}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio" className={styles.label}>Add description</label>
        <textarea 
          id="bio"
          data-testid="input-bio" 
          className={styles.textarea} 
          placeholder="Tell us about yourself..." 
          value={state.form.bio} 
          onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "bio", value: e.target.value })} 
        />
        {state.errors.bio && <p className={styles.error}>{state.errors.bio}</p>}
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
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <span className={styles.fileName}>{state.fileName}</span>
        </div>
        {state.avatarPreview && (
          <div className={styles.previewContainer}>
            <img src={state.avatarPreview} alt="Preview" className={styles.preview} />
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
