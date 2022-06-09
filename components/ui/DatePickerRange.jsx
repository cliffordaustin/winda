import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

export default function DatePicker({
  setDate,
  date,
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
    <div className={"w-full " + className} onClick={(e) => e.stopPropagation()}>
      <DayPicker
        mode="range"
        disabled={{ before: disableDate }}
        selected={date}
        onSelect={setDate}
      />
    </div>
  );
}

DatePicker.propTypes = {
  disableDate: PropTypes.any,
  setDate: PropTypes.func.isRequired,
  className: PropTypes.string,
};
