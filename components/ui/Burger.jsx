import React from "react";
import PropTypes from "prop-types";

function Burger({ checked, value, onChange }) {
  return (
    <div className="z-40 px-4 py-2 cursor-pointer bg-gray-200 rounded-full flex flex-col justify-center gap-1">
      <div className="h-[2px] w-[20px] bg-gray-600"></div>
      <div className="h-[2px] w-[20px] bg-gray-600"></div>
      <div className="h-[2px] w-[20px] bg-gray-600"></div>
    </div>
  );
}

Burger.propTypes = {};

export default Burger;
