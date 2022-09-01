import React from "react";
import PropTypes from "prop-types";

const PopularLocationsDropdown = ({
  className = "",
  setLocation = () => {},
}) => {
  return (
    <div
      className={
        "py-4 px-2 w-full absolute top-full bg-white rounded-b-lg border left-0 " +
        className
      }
    >
      <div className="text-sm font-bold">Popular locations</div>
      <div className="mt-2 flex flex-col gap-1">
        <div
          onClick={() => {
            setLocation("Nairobi");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Nairobi
        </div>
        <div
          onClick={() => {
            setLocation("Naivasha");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Naivasha
        </div>
        <div
          onClick={() => {
            setLocation("Maasai Mara");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Maasai Mara
        </div>
        <div
          onClick={() => {
            setLocation("Samburu");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Samburu
        </div>

        <div
          onClick={() => {
            setLocation("Lake Magadi");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Lake Magadi
        </div>
        <div
          onClick={() => {
            setLocation("Ol Pejeta");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Ol Pejeta
        </div>
      </div>
    </div>
  );
};

PopularLocationsDropdown.propTypes = {};

export default PopularLocationsDropdown;