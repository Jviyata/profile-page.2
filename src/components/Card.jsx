import { Link } from "react-router-dom";
import { useContext } from "react";
import EditModeContext from "../contexts/EditModeContext";
import styles from "../styles/card.module.css";
import arikaImg from "../assets/arika-gibson.png";
import julianImg from "../assets/julian-luzadder.png";
import lyndieImg from "../assets/lyndie-lingg.png";

const avatarMap = {
  "Arika Gibson": arikaImg,
  "Julian Luzadder": julianImg,
  "Lyndie Lingg": lyndieImg,
};

export default function Card({ profile, onDelete }) {
  const avatarSrc = avatarMap[profile.name] || profile.avatarImage || profile.avatarUrl;
  const { isEditing } = useContext(EditModeContext);

  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete && confirm(`Delete ${profile.name}?`)) {
      onDelete(profile.id);
    }
  };

  return (
    <Link to={`/profiles/${profile.id}`} className={styles.cardLink} data-testid={`card-profile-${profile.id}`}>
      <div className={styles.card}>
        <img
          src={avatarSrc}
          alt={profile.name}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6B7A3A&color=fff&size=200`;
          }}
          className={styles.avatar}
        />
        <h3 className={styles.name}>{profile.name}</h3>
        <p className={styles.role}>{profile.role}</p>
        {isEditing && (
          <div className={styles.editButtons}>
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
