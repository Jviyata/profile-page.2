import React from 'react';
import styles from '../App.module.css';

const Wrapper = React.memo(function Wrapper({ title, children }) {
  return (
    <section className={styles.sectionWrapper}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.sectionContent}>
        {children}
      </div>
    </section>
  );
});

export default Wrapper;
