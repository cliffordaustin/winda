import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

function TopBarMessage({
  children,
  closeTopBarMessage,
  showTopBarMessage = false,
  className = "",
}) {
  const variants = {
    hide: {
      opacity: 0.7,
      x: 50,
    },
    show: {
      x: 0,
      opacity: 1,
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {showTopBarMessage && (
        <motion.div
          variants={variants}
          animate="show"
          initial="hide"
          exit="exit"
          className={
            "fixed top-8 right-2 ml-2 sm:right-6 p-2 rounded-md bg-red-100 max-w-xs " +
            className
          }
        >
          {children}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute -top-2 -right-2 cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={(e) => {
              closeTopBarMessage(e);
            }}
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

TopBarMessage.propTypes = {
  children: PropTypes.any.isRequired,
  showTopBarMessage: PropTypes.bool.isRequired,
  closeTopBarMessage: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default TopBarMessage;
