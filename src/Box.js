import React from 'react';
import styles from './Box.module.css';

function Box({ text }) {
  return <div className={styles.box}>{text}</div>;
}

export default Box;
