import { useRef, useLayoutEffect, useState } from "react";
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
  const avatarSrc = avatarMap[profile.name] || profile.avatarImage || profile.avatarUrl;
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  // Measure card width before browser paints
  useLayoutEffect(() => {
    if (cardRef.current) {
      const width = cardRef.current.offsetWidth;
      setCardWidth(width);
      
      // Apply dynamic styling based on width
      if (width < 250) {
        cardRef.current.style.fontSize = "0.875rem";
      } else if (width > 350) {
        cardRef.current.style.fontSize = "1.125rem";
      } else {
        cardRef.current.style.fontSize = "1rem";
      }
    }
  }, []);

  return (
    <Link to={`/profiles/${profile.id}`} className={styles.cardLink} data-testid={`card-profile-${profile.id}`}>
      <div ref={cardRef} className={styles.card}>
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
        {cardWidth > 0 && (
          <span className={styles.cardMeta} style={{ fontSize: '0.75rem', opacity: 0.6 }}>
            Width: {cardWidth}px
          </span>
        )}
      </div>
    </Link>
  );
}
