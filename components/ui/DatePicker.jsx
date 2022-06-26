import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export default function DatePicker({
  setDate,
  date,
  showDate,
  disableDate,
  className = "",
  mode = "single",
  setShowDate = () => {},
}) {
  const variants = {
    hide: {
      scale: 0.9,
      opacity: 0.7,
    },
    show: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  const disabledDays = [
    { from: new Date(2022, 4, 18), to: new Date(2022, 4, 29) },
  ];

  return (
    <AnimatePresence exitBeforeEnter>
      {showDate && (
        <motion.div
          variants={variants}
          animate="show"
          initial="hide"
          exit="exit"
          className={
            "absolute top-0 left-0 w-full z-30 bg-gray-50 rounded-xl border border-gray-200 " +
            className
          }
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            disabled={{ before: disableDate }}
            mode={mode}
            selected={date}
            onSelect={(date) => {
              setShowDate(false);
              setDate(date);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DatePicker.propTypes = {
  disableDate: PropTypes.any,
  setDate: PropTypes.func.isRequired,
  showDate: PropTypes.bool.isRequired,
  className: PropTypes.string,
};
