import React from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";

function MapLocation({ location, index }) {
  return (
    <div className="w-full border rounded-md bg-[#f5f3f4] shadow-md px-2 py-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h1 className="font-bold">Location</h1>
          <p className="text-sm font-bold text-gray-500">#{index}</p>
        </div>

        <Button
          onClick={() => {
            // setShowEditPopup(true);
          }}
          className="!bg-transparent border-2 !border-red-700 !py-1 !text-sm !text-black !font-bold"
        >
          Edit
        </Button>
      </div>
      <h1>{location.name}</h1>
      <div className="flex flex-col gap-0.5 mt-2">
        <p className="font-bold text-sm text-gray-500">
          Location: {location.name ? `${location.name}` : "Not set"}
        </p>
        <p className="font-bold text-sm text-gray-500">
          Latitude: {location.latitude ? `${location.latitude}` : "Not set"}
        </p>
        <p className="font-bold text-sm text-gray-500">
          Longitude: {location.longitude ? `${location.longitude}` : "Not set"}
        </p>
      </div>
    </div>
  );
}

MapLocation.propTypes = {};

export default MapLocation;
