import React, { useEffect } from "react";
import styles from "../../styles/LoadingSpinnerChase.module.css";
import PropTypes from "prop-types";

function LoadingSpinerChase({ width = 90, height = 90, color = "#fff" }) {
  return (
    <div
      style={{
        width: width + "px",
        height: height + "px",
        "--skchase-color": color,
      }}
      className={styles.skChase}
    >
      <div className={styles.skChaseDo}></div>
      <div className={styles.skChaseDot}></div>
      <div className={styles.skChaseDot}></div>
      <div className={styles.skChaseDot}></div>
      <div className={styles.skChaseDot}></div>
      <div className={styles.skChaseDot}></div>
    </div>
  );
}

LoadingSpinerChase.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  color: PropTypes.string,
};

export default LoadingSpinerChase;
