import React, { useState } from "react";
import { useDispatch, useStore, useSelector } from "react-redux";
import Button from "../ui/Button";

import { hideTopBanner, showTopBanner } from "../../redux/actions/home";
import ClientOnly from "../ClientOnly";

function TopBanner() {
  const store = useStore();

  //   const [topBar, setTopBar] = useState(store.getState().home.showTopBanner);

  const topBanner = useSelector((state) => state.home.topBanner);

  const dispatch = useDispatch();
  return (
    <ClientOnly>
      <div>
        <div>
          <div
            className={
              "bg-red-600 py-3 px-12 md:px-2 relative " +
              (!topBanner ? "hidden" : "")
            }
          >
            <div className="text-center font-medium text-white">
              <span className="font-bold">Special offer:</span> Get 20% off your
              first payment
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(hideTopBanner());
              }}
              className="w-6 h-6 rounded-full cursor-pointer shadow-lg bg-black bg-opacity-20 flex items-center justify-center absolute top-2/4 right-3 md:right-6 -translate-y-2/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 z-30"
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
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}

export default TopBanner;
