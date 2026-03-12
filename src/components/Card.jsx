import React, { useRef, useLayoutEffect, useState, memo } from 'react';
import styles from '../App.module.css';

const Card = memo(({ name, role, avatarUrl, onClick }) => {
  const cardRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      console.log(`Card ${name} width: ${rect.width}px`);
    }
  }, [name]);

  return (
    <div 
      ref={cardRef}
      className={styles.cardSmall}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.avatarSmall}>
        <img 
          src={avatarUrl} 
          alt={name}
          className={styles.avatarImgSmall}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      <h3 className={styles.cardNameSmall}>{name}</h3>
      <p className={styles.cardRoleSmall}>{role}</p>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
