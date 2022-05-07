import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import ImageGallery from "./ImageGallery";

function SearchDetails({ location, routeData }) {
  const activeItem = useSelector((state) => state.order.activeItem);
  const duration = moment.duration(routeData.duration, "seconds").humanize();
  return (
    <div className="bg-white rounded-3xl w-[350px] lg:h-[450px] lg:py-0 h-fit py-2">
      <div className="hidden lg:block">
        <ImageGallery
          images={
            activeItem.activity_images
              ? activeItem.activity_images
              : activeItem.stay_images
          }
        ></ImageGallery>
      </div>

      <div className="flex w-full mt-1">
        <div className="flex ml-auto mr-2 gap-2">
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-3 h-3"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 480 512"
            >
              <path
                fill="currentColor"
                d="m438.66 212.33l-11.24-28.1l-19.93-49.83C390.38 91.63 349.57 64 303.5 64h-127c-46.06 0-86.88 27.63-103.99 70.4l-19.93 49.83l-11.24 28.1C17.22 221.5 0 244.66 0 272v48c0 16.12 6.16 30.67 16 41.93V416c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h256v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-54.07c9.84-11.25 16-25.8 16-41.93v-48c0-27.34-17.22-50.5-41.34-59.67zm-306.73-54.16c7.29-18.22 24.94-30.17 44.57-30.17h127c19.63 0 37.28 11.95 44.57 30.17L368 208H112l19.93-49.83zM80 319.8c-19.2 0-32-12.76-32-31.9S60.8 256 80 256s48 28.71 48 47.85s-28.8 15.95-48 15.95zm320 0c-19.2 0-48 3.19-48-15.95S380.8 256 400 256s32 12.76 32 31.9s-12.8 31.9-32 31.9z"
              />
            </svg>
            <span className="ml-1">
              {(routeData.distance * 0.001).toFixed(1)}km
            </span>
          </div>

          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-3 h-3"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M271.514 95.5h-32v178.111l115.613 54.948l13.737-28.902l-97.35-46.268V95.5z"
              />
              <path
                fill="currentColor"
                d="M256 16C123.452 16 16 123.452 16 256s107.452 240 240 240s240-107.452 240-240S388.548 16 256 16Zm0 448c-114.875 0-208-93.125-208-208S141.125 48 256 48s208 93.125 208 208s-93.125 208-208 208Z"
              />
            </svg>
            <span className="ml-1">{duration}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="ml-2 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            className="mb-1"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-1 h-1 mt-0.5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-1 h-1 mt-0.5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-1 h-1 mt-0.5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-1 h-1 mt-0.5"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            className="mt-1"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z" />
            </g>
          </svg>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="w-6 h-6"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m3 8l4-4l4 4M7 4v9m6 3l4 4l4-4m-4-6v10"
            />
          </svg> */}
        </div>
        <div className="flex flex-col items-center px-2 mt-2 w-full">
          <div className="bg-gray-100 w-full rounded-lg px-4 py-3 truncate">
            <span className="font-bold">From:</span> {location}
          </div>

          <div className="bg-gray-100 w-full rounded-lg px-4 py-3 truncate">
            <span className="font-bold">To:</span> {activeItem.name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDetails;
