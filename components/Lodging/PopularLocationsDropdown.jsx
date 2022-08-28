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
            setLocation("Mombasa");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Mombasa
        </div>
        <div
          onClick={() => {
            setLocation("Nakuru");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Nakuru
        </div>
        <div
          onClick={() => {
            setLocation("Maasai mara");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Maasai mara
        </div>
        <div
          onClick={() => {
            setLocation("Kisii");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Kisii
        </div>
        <div
          onClick={() => {
            setLocation("Kisumu");
          }}
          className="w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm transition-all duration-200 ease-linear"
        >
          Kisumu
        </div>
      </div>
    </div>
  );
};

PopularLocationsDropdown.propTypes = {};

export default PopularLocationsDropdown;
