import React from "react";
import styles from "../../styles/Loading.module.css";
import PropTypes from "prop-types";

function LoadingPulse({ width = 90, height = 90, className = "" }) {
  return (
    <div
      style={{ width: width + "px", height: height + "px" }}
      className={styles.loading}
    >
      <div
        className={styles.doubleBounce1 + " bg-purple-400 " + className}
      ></div>
      <div
        className={styles.doubleBounce2 + " bg-purple-400 " + className}
      ></div>
    </div>
  );
}

LoadingPulse.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default LoadingPulse;
