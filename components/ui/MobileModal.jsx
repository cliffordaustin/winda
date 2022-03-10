import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import styles from "../styles/Modal.module.css";

function Modal({
  showModal,
  closeModal,
  className = "",
  children,
  backdropClassName = "",
}) {
  const backdrop = {
    show: {
      opacity: 1,
    },

    hidden: {
      opacity: 0,
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const container = {
    show: {
      top: "calc(100vh - 80%)",
      opacity: 1,
      transition: {
        type: "linear",
        duration: 0.5,
        delay: 0.1,
      },
    },

    hidden: {
      top: "100vh",
      opacity: 0,
      transition: {
        type: "linear",
      },
    },
  };
  return (
    <AnimatePresence exitBeforeEnter>
      {showModal ? (
        <motion.div
          onClick={closeModal}
          variants={backdrop}
          animate="show"
          initial="hidden"
          exit="exit"
          className={
            "overflow-y-scroll " + backdropClassName + " " + styles.backdrop
          }
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={container}
            animate="show"
            initial="hidden"
            exit="hidden"
            className={
              "py-4 h-4/5 bg-white shadow-lg mx-auto sm:rounded-xl rounded-t-xl z-20 overflow-y-scroll relative " +
              className
            }
          >
            <div className="relative text-center font-Merriweather border-b border-gray-100 mb-4">
              <h1 className="text-lg font-bold">Title</h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-1 left-4 cursor-pointer lg:hidden w-5 h-5 z-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={closeModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="px-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : (
        ""
      )}
    </AnimatePresence>
  );
}

Modal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  backdropClassName: PropTypes.string,
};

export default Modal;
