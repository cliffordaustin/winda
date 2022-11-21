import React from "react";
import PropTypes from "prop-types";

export default function TextArea({
  label,
  errorStyle,
  name,
  value,
  onChange,
  placeholder,
  onBlur,
  className,
}) {
  return (
    <>
      {label ? (
        <label className="block text-sm font-bold mb-2">{label}</label>
      ) : (
        ""
      )}
      <div>
        <textarea
          cols="30"
          rows="10"
          onChange={onChange}
          name={name}
          value={value}
          onBlur={onBlur}
          placeholder={placeholder}
          className={
            "appearance-none leading-tight border resize-none border-gray-300 rounded-md focus:outline-none py-3 px-4 w-full text-sm " +
            (errorStyle ? "border-red-300 " : "") +
            className
          }
        />
      </div>
    </>
  );
}

TextArea.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  errorStyle: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
};
