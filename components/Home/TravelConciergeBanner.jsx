import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Dialogue from "./Dialogue";
import { InlineWidget } from "react-calendly";

function TravelConciergeBanner() {
  const [showCalendly, setShowCalendly] = useState(false);
  return (
    <div className="flex justify-between text-white px-4 py-2 bg-white border-b">
      <Dialogue
        isOpen={showCalendly}
        closeModal={() => {
          setShowCalendly(false);
        }}
        title="Travel concierge"
        dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
        outsideDialogueClass="!p-0"
        dialoguePanelClassName="screen-height-safari !rounded-none md:!rounded-md md:!min-h-0 md:max-h-[700px] !px-0 max-w-6xl overflow-y-scroll remove-scroll"
      >
        <div className="">
          <InlineWidget url="https://calendly.com/ndiko/winda-guide-custom-trip" />
        </div>

        <div className="fixed top-3 right-4 flex flex-col">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowCalendly(false);
            }}
            className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </Dialogue>

      <div className="flex justify-between w-full items-center text-black gap-4">
        <div className="font-bold"></div>

        <div
          onClick={() => {
            setShowCalendly(true);
          }}
          className="flex items-center gap-0.5 px-4 py-3 !rounded-3xl !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
        >
          <span className="ml-2 text-white text-sm font-bold cursor-pointer">
            Travel concierge
          </span>
        </div>
      </div>
    </div>
  );
}

TravelConciergeBanner.propTypes = {};

export default TravelConciergeBanner;
