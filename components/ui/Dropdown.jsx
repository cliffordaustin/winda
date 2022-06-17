import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

function Dropdown({ children, showDropdown, className = "" }) {
  const variants = {
    hide: {
      y: -10,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
  };
  return (
    <AnimatePresence exitBeforeEnter>
      {showDropdown && (
        <motion.div
          onClick={(event) => event.stopPropagation()}
          variants={variants}
          animate="show"
          initial="hide"
          exit="exit"
          className={
            "bg-white border-gray-200 border py-1 rounded-md z-30 " + className
          }
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

Dropdown.propTypes = {
  children: PropTypes.any.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default Dropdown;
