import React from "react";

function Guest({ type, guests, add, remove }) {
  return (
    <div className="flex items-center justify-between">
      <div className="select-none text-sm">Guests</div>

      <div className="flex gap-3 items-center">
        <div
          onClick={remove}
          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
        >
          -
        </div>
        <h1 className="font-medium text-sm select-none">{guests}</h1>
        <div
          onClick={add}
          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
        >
          +
        </div>
      </div>
    </div>
  );
}

export default Guest;
