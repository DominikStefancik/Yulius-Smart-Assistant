import React from "react";
import styles from "./VideoChat.module.scss";

import tomek from "./tomek.mp4";

export default () => (
  <div className={styles.wrapper}>
    <div className={styles.video} />
    <video className={styles.video}>
      <source src={tomek} type="video/mp4" />
    </video>
  </div>
);
