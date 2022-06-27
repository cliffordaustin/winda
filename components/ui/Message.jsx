import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Message = ({ children, showMessage }) => {
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
      {showMessage && (
        <motion.div
          onClick={(event) => event.stopPropagation()}
          variants={variants}
          animate="show"
          initial="hide"
          exit="exit"
          className="py-2 px-5 rounded-md shadow-md bg-white w-[150px] fixed right-2/4 -mr-[75px] -translate-x-2/4 -translate-y-2/4"
        >
          <div className="text-sm font-bold text-center">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Message.propTypes = {};

export default Message;
