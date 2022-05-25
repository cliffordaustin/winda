import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

function Accordion({ accordion, setAccordion, title, children }) {
  const variants = {
    hide: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        type: "linear",
      },
    },
  };

  const icon = {
    hide: {
      rotate: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      rotate: 180,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <div className="py-1 px-2 bg-white border-t border-b border-gray-300 w-full min-h-fit">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setAccordion(!accordion);
        }}
        className="flex items-center justify-between cursor-pointer py-2"
      >
        <h1 className="font-bold">{title}</h1>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          variants={icon}
          initial="hide"
          animate={accordion ? "show" : ""}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </motion.svg>
      </div>
      <AnimatePresence exitBeforeEnter>
        {accordion && (
          <motion.div
            variants={variants}
            animate="show"
            initial="hide"
            exit="exit"
            className=""
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Accordion.propTypes = {
  accordion: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  setAccordion: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Accordion;
