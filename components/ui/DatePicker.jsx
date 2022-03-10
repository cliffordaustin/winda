import React from "react";
import DayPicker from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export default function DatePicker({
  setDate,
  date,
  showDate,
  disableDate,
  className = "",
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

  return (
    <AnimatePresence exitBeforeEnter>
      {showDate && (
        <motion.div
          variants={variants}
          animate="show"
          initial="hide"
          exit="exit"
          className={"absolute top-0 left-0 w-full z-30 " + className}
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            disabledDays={{ before: disableDate }}
            selectedDays={date}
            onDayClick={setDate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DatePicker.propTypes = {
  date: PropTypes.any.isRequired,
  disableDate: PropTypes.any,
  setDate: PropTypes.func.isRequired,
  showDate: PropTypes.bool.isRequired,
  className: PropTypes.string,
};
