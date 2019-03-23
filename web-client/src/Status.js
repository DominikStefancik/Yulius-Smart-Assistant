import React from "react";
import styles from "./Status.module.scss";

export default () => {
  return (
    <div className={styles.status}>
      Assistant is <strong>&nbsp;online</strong>
    </div>
  );
};
