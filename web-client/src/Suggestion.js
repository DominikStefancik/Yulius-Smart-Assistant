import React from "react";
import styles from "./Suggestion.module.scss";
import classNames from "classnames";

export default ({ pane, recommended, onClick }) => (
  <div
    onClick={onClick}
    className={classNames(styles.suggestion, recommended && styles.recommended)}
  >
    <div className={styles.suggestionColumn}>
      <div className={styles.suggestionHeader}>{pane.title}</div>
      <div className={styles.suggestionDescription}>{pane.description}</div>
    </div>
    {/* <img className={styles.arrowRight} alt="arrow-right" src={arrowRight} /> */}
  </div>
);
