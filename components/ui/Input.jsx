import React from "react";
import PropTypes from "prop-types";

export default function Input({
  label,
  errorStyle,
  name,
  value,
  type,
  onChange,
  placeholder,
  className = "",
  showPassword = null,
  changeShowPasswordToFalse,
  onBlur,
  changeShowPasswordToTrue,
  onKeyPress,
  autoComplete = "",
  inputClassName = "",
}) {
  return (
    <div className={className}>
      {label ? (
        <label className="block text-sm font-bold mb-2">{label}</label>
      ) : (
        ""
      )}
      <div className="relative">
        <input
          onChange={onChange}
          name={name}
          value={value}
          type={type}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onKeyPress={onKeyPress}
          className={
            "appearance-none leading-tight font-bold border rounded-md focus:outline-none py-3 px-4 w-full text-sm " +
            (errorStyle ? "!border-red-300 " : "border-gray-300 ") +
            className +
            " " +
            inputClassName
          }
        />

        {/* since showPassword is null by default, this means that when no props is passed, 
        this block of code won't run, but when a value is passed the code within will run. It
        will check if the value passed is false or true and will run accordingly */}
        {showPassword !== null && (
          <div>
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer absolute top-2/4 bottom-2/4 -translate-x-1/2 -translate-y-1/2 right-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={changeShowPasswordToFalse}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer absolute top-2/4 bottom-2/4 -translate-x-1/2 -translate-y-1/2 right-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={changeShowPasswordToTrue}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  errorStyle: PropTypes.bool,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
  showPassword: PropTypes.bool,
  changeShowPasswordToTrue: PropTypes.func,
  changeShowPasswordToFalse: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  autoComplete: PropTypes.string,
};
