import React from "react";
import styles from "./Spinner.module.scss";

export default ({
  size = "50px",
  thickness = "4px",
  solidColor = "rgb(0, 0, 0)",
  fadedColor = "rgb(0, 0, 0, 0.2)"
}) => {
  return (
    <div
      className={styles.loader}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderColor: fadedColor,
        borderLeftColor: solidColor
      }}
    />
  );
};
