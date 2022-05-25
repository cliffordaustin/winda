import React, { useState } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";

const TransportTrip = ({
  orderId,
  transport,
  transportDistance,
  transportStartingPoint,
  transportPrice,
  transportDestination,
}) => {
  const [state, setState] = useState({
    showEdit: false,
  });
  return (
    <div>
      <OrderCard
        orderId={orderId}
        transport={transport}
        transportPage={true}
        transportDistance={transportDistance}
        transportDestination={transportDestination}
        transportStartingPoint={transportStartingPoint}
        transportPrice={transportPrice}
        checkoutInfo={true}
      ></OrderCard>

      <div className="w-2/4 h-12 border-r -mt-4 border-gray-400"></div>

      <div className="relative mt-1">
        <div className="flex gap-2 px-2 relative bg-gray-100 py-1 rounded-lg">
          <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6 fill-current text-gray-500"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M224 115.5V208a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.5a16 16 0 0 1 5.2-11.8l80-72.7a16 16 0 0 1 21.6 0l80 72.7a16 16 0 0 1 5.2 11.8Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium truncate">
              To {transportDestination}
            </p>

            <h1 className="font-bold">Stay</h1>
            <h1 className="font-medium mt-2 text-sm text-red-600">
              No stay added
            </h1>
          </div>
        </div>

        {!state.showEdit && (
          <div
            onClick={() => {
              setState({ ...state, showEdit: true });
            }}
            className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
              />
            </svg>
          </div>
        )}

        {state.showEdit && (
          <div
            onClick={() => {
              setState({ ...state, showEdit: false });
            }}
            className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

TransportTrip.propTypes = {};

export default TransportTrip;
