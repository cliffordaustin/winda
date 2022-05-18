import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

function Popup({ children, showPopup, className = "" }) {
  const variants = {
    hide: {
      scale: 0.9,
      opacity: 0.7,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
  };
  return (
    <AnimatePresence exitBeforeEnter>
      {showPopup && (
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

Popup.propTypes = {
  children: PropTypes.any.isRequired,
  showPopup: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default Popup;
