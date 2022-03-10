import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/RightTooltip.module.css";

function RightTooltip({ changeTooltipState, showTooltip, children }) {
  const variants = {
    hide: {
      scale: 0.8,
      opacity: 0.7,
      x: -5,
    },
    show: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: -5,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <div className="relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 cursor-pointer mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={changeTooltipState}
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <AnimatePresence exitBeforeEnter>
        {showTooltip && (
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
            }}
            variants={variants}
            animate="show"
            initial="hide"
            exit="exit"
            className={
              styles.tooltip +
              " w-40 px-2 py-3 bg-gray-200 rounded-md absolute left-full -top-6"
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

RightTooltip.propTypes = {
  changeTooltipState: PropTypes.func.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
};

export default RightTooltip;
