import { Link } from "react-router-dom";
import styles from "../styles/card.module.css";
import arikaImg from "../assets/arika-gibson.png";
import julianImg from "../assets/julian-luzadder.png";
import lyndieImg from "../assets/lyndie-lingg.png";

const avatarMap = {
  "Arika Gibson": arikaImg,
  "Julian Luzadder": julianImg,
  "Lyndie Lingg": lyndieImg,
};

export default function Card({ profile }) {
  const avatarSrc = avatarMap[profile.name] || profile.avatarUrl;

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
      </div>
    </Link>
  );
}
