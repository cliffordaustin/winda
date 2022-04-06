import React, { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

function Switch({
  switchButton,
  changeSwitchButtonState,
  slideColorClass = "bg-red-200",
  roundedColorClass = "bg-red-500",
  switchButtonCircle = "",
  switchButtonContainer = "",
  xVal = null,
}) {
  const variants = {
    hide: {
      x: 0,
    },
    show: {
      x: xVal || 25,
    },
  };
  return (
    <motion.div
      onClick={changeSwitchButtonState}
      className={
        "w-16 h-9 bg-gray-200 rounded-3xl flex items-center px-1 cursor-pointer transition-colors duration-300 ease-in-out " +
        switchButtonContainer +
        " " +
        (switchButton ? slideColorClass : "")
      }
    >
      <motion.div
        variants={variants}
        animate={switchButton ? "show" : "hide"}
        className={
          "w-8 h-8 rounded-full " + switchButtonCircle + " " + roundedColorClass
        }
      ></motion.div>
    </motion.div>
  );
}

Switch.propTypes = {
  slideColorClass: PropTypes.string,
  roundedColorClass: PropTypes.string,
  switchButton: PropTypes.bool.isRequired,
  changeSwitchButtonState: PropTypes.func.isRequired,
};

export default Switch;
