import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import styles from "../../styles/Modal.module.css";

function Modal({
  showModal,
  closeModal,
  containerHeight,
  className = "",
  backdropClassName = "",
  children,
  myref,
  title,
  closeAllPopups = () => {},
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
      top: `0`,
      opacity: 1,
      transition: {
        type: "linear",
        duration: 0.5,
        delay: 0.1,
      },
    },

    hidden: {
      top: "100vh",
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
            onClick={(e) => {
              e.stopPropagation();
            }}
            variants={container}
            animate="show"
            initial="hidden"
            exit="hidden"
            style={{ height: "100%" }}
            ref={myref}
            className={
              "p-4 bg-white shadow-lg mx-auto rounded-xl z-30 overflow-y-scroll relative " +
              className
            }
          >
            {title && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                  className="cursor-pointer flex items-center justify-center text-center font-Merriweather w-7 h-7 border border-gray-100 rounded-full bg-white shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div className="font-semibold">{title}</div>
                <div></div>
              </div>
            )}
            {!title && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="relative cursor-pointer flex top-1 left-4 items-center justify-center text-center font-Merriweather mb-4 w-7 h-7 border border-gray-100 rounded-full bg-white shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
            <div className="h-full">{children}</div>
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
  backdropClassName: PropTypes.string,
  children: PropTypes.any,
  containerHeight: PropTypes.number,
  closeAllPopups: PropTypes.func,
  title: PropTypes.string,
};

export default Modal;
