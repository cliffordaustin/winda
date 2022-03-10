import React from "react";

function Guest({ type, guests, add, remove }) {
  return (
    <div className="flex items-center justify-between">
      <div className="select-none">{type}</div>
      <div className="flex items-center w-20 justify-between">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={remove}
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="font-medium select-none">{guests}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={add}
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

export default Guest;
