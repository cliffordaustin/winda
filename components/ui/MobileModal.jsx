import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import styles from "../../styles/Modal.module.css";

function Modal({
  showModal,
  closeModal,
  containerHeight,
  title,
  className = "",
  children,
  backdropClassName = "",
  myref,
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
      top: `calc(100vh - ${(containerHeight || "80") + "%"})`,
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
            onClick={(e) => {
              e.stopPropagation();
              closeAllPopups();
            }}
            variants={container}
            animate="show"
            initial="hidden"
            exit="hidden"
            style={{ height: (containerHeight || "80") + "%" }}
            ref={myref}
            className={
              "py-4 bg-white shadow-lg mx-auto sm:rounded-xl rounded-t-[2rem] z-30 overflow-y-scroll remove-scroll relative safari-bottom safari-top " +
              className
            }
          >
            {title && (
              <div className="relative text-center font-Merriweather border-b border-gray-100 mb-4">
                <h1 className="text-lg font-bold">{title}</h1>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-1 left-4 cursor-pointer w-5 h-5 z-20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal();
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}

            {!title && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="relative cursor-pointer flex top-1 left-4 items-center justify-center text-center font-Merriweather mb-4 w-7 h-7 rounded-full bg-white shadow-lg"
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
            <div className="h-full px-3">{children}</div>
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
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
  backdropClassName: PropTypes.string,
  containerHeight: PropTypes.number,
  closeAllPopups: PropTypes.func,
};

export default Modal;
