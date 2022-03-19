import React from "react";
import styles from "../../styles/Checkbox.module.css";
import PropTypes from "prop-types";

function Checkbox({ checked }) {
  return (
    <div>
      <label className={styles.checkboxLabel}>
        <input type="checkbox" checked={checked} readOnly />
        <span className={styles.checkboxCustom}></span>
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
};

export default Checkbox;
