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
  heightVal = "px",
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
      top: `calc(98vh - ${(containerHeight || "500") + heightVal})`,
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
      <motion.div
        onClick={closeModal}
        variants={backdrop}
        animate={showModal ? "show" : ""}
        initial="hidden"
        exit={!showModal ? "exit" : ""}
        className={
          "overflow-y-scroll px-1.5 " +
          backdropClassName +
          " " +
          styles.backdrop +
          (!showModal ? " hidden" : "")
        }
      >
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            closeAllPopups();
          }}
          variants={container}
          animate={showModal ? "show" : ""}
          initial="hidden"
          exit={!showModal ? "hidden" : ""}
          style={{ height: (containerHeight || "500") + heightVal }}
          className={
            "py-4 bg-white shadow-lg mx-auto sm:rounded-xl rounded-[2rem] z-30 overflow-y-scroll relative " +
            className
          }
        >
          <div className="text-center flex items-center px-2 font-Merriweather border-b border-gray-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer w-5 h-5 z-20"
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
            <h1 className="text-lg font-bold block w-full">{title}</h1>
          </div>
          <div className="">{children}</div>
        </motion.div>
      </motion.div>
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
