import React from "react";

function Pagination({
  swiperIndex,
  allowSlideNext,
  endOfSlide,
  prevClassName,
  nextClassName,
}) {
  return (
    <div className="flex items-center gap-5">
      <div
        className={
          "cursor-pointer flex items-center justify-center w-7 h-7 rounded-full shadow-lg border border-gray-100 z-10 !relative " +
          prevClassName
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {/* "absolute cursor-pointer flex items-center justify-center -top-20 sm:-top-12 z-10 md:right-24 right-4 w-7 h-7 rounded-full bg-white shadow-lg border border-gray-100 "
      "absolute flex cursor-pointer items-center justify-center -top-20 sm:-top-12 z-10 md:right-36 right-16 w-7 h-7 rounded-full bg-white shadow-lg border border-gray-100 " */}
      <div
        className={
          "cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg border border-gray-100 !relative " +
          nextClassName
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

export default Pagination;
