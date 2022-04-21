import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Rating from "../ui/Rating";

const ReviewOverview = (props) => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);
  return (
    <div className={"px-4 bg-gray-100 py-3 rounded-3xl flex gap-4 w-full"}>
      <div className={"flex sm:flex-row flex-col gap-4 w-full md:px-8"}>
        <div className={""}>
          <div className="flex">
            <h1 className="font-bold text-3xl">4.5</h1>
            <p className="text-base self-end">/5</p>
          </div>
          <div className="text-gray-500 mt-1 text-sm md:text-base sm:whitespace-nowrap">
            Based on 120 reviews
          </div>
          <div className="mt-1 sm:mt-3">
            <Rating fontSize={!isSafari ? 45 : 35} rating={4.5}></Rating>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">5 stars</div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
              <div className="bg-orange-400 absolute top-0 py-2 left-0 w-[75%]"></div>
            </div>
            <div>75%</div>
          </div>
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">4 stars</div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
              <div className="bg-orange-400 absolute top-0 py-2 left-0 w-[10%]"></div>
            </div>
            <div>10%</div>
          </div>
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">3 stars</div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
              <div className="bg-orange-400 absolute top-0 py-2 left-0 w-[5%]"></div>
            </div>
            <div>5%</div>
          </div>
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">2 stars</div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
              <div className="bg-orange-400 absolute top-0 py-2 left-0 w-[7%]"></div>
            </div>
            <div>7%</div>
          </div>
          <div className={"flex items-center gap-2 w-full"}>
            <div className="whitespace-nowrap">1 stars</div>
            <div className="bg-gray-300 rounded-3xl overflow-hidden py-2 w-full relative">
              <div className="bg-orange-400 absolute top-0 py-2 left-0 w-[3%]"></div>
            </div>
            <div>3%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewOverview.propTypes = {};

export default ReviewOverview;
