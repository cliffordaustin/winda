import React from "react";
import styles from "../../styles/Checkbox.module.css";
import PropTypes from "prop-types";

function Checkbox({ checked, value, onChange }) {
  return (
    <div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          value={value}
          onChange={onChange}
          checked={checked}
          readOnly
        />
        <span className={styles.checkboxCustom}></span>
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default Checkbox;
