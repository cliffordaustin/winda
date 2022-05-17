import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const ResponsiveModal = ({
  showAllModal,
  changeShowAllModal,
  containerHeight,
  className = "",
  children,
  closeAllPopups = () => {},
}) => {
  const variant = {
    show: {
      height: "70vh",
    },

    hidden: {
      height: "20vh",
    },
  };
  return (
    <div className="relative">
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          closeAllPopups();
        }}
        variants={variant}
        animate={showAllModal ? "show" : "hidden"}
        className={
          "py-4 bg-white mx-auto sm:rounded-xl rounded-t-[2rem] z-30 overflow-y-scroll " +
          className
        }
      >
        <div
          onClick={changeShowAllModal}
          className="absolute cursor-pointer w-10 h-4 rounded-t-lg bg-white py-2 z-30 flex justify-center items-center -top-4 left-2/4 -translate-x-2/4"
        >
          {!showAllModal && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {showAllModal && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
          )}
        </div>
        <div className="">{children}</div>
      </motion.div>
    </div>
  );
};

ResponsiveModal.propTypes = {};

export default ResponsiveModal;
