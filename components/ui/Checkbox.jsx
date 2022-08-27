import React from "react";
import styles from "../../styles/Checkbox.module.css";
import PropTypes from "prop-types";

function Checkbox({ checked, value, onChange, hideInput = false }) {
  return (
    <div>
      <label className={styles.checkboxLabel + (hideInput ? " !hidden" : "")}>
        <input
          type="checkbox"
          value={value}
          onChange={onChange}
          checked={checked}
          id="checkbox"
          readOnly
        />
        {!hideInput && <span className={styles.checkboxCustom}></span>}
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
