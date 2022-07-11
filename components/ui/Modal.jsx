import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import styles from "../../styles/Modal.module.css";

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
      y: "20px",
      transition: {
        type: "spring",
        stiffness: 60,
        delay: 0.1,
      },
    },

    hidden: {
      y: "-100vh",
      transition: {
        type: "spring",
        stiffness: 60,
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
            className={
              "p-4 bg-white shadow-lg mx-auto rounded-xl z-30 overflow-y-scroll relative " +
              className
            }
          >
            {children}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-2 right-2 cursor-pointer lg:hidden w-7 h-7 z-20"
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
  children: PropTypes.any,
  backdropClassName: PropTypes.string,
};

export default Modal;
