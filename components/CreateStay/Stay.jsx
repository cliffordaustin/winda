import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

import TypeOfStay from "./TypeOfStay";
import DescribeStay from "./DescribeStay";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import SwiperCore from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentSwiperState } from "../../redux/actions/stay";
import styles from "../../styles/Stay.module.css";

import "swiper/css/effect-creative";
import "swiper/css";
import Location from "./Location";
import Details from "./Details";
import Amenities from "./Amenities";

SwiperCore.use([Navigation]);

const Stay = (props) => {
  const dispatch = useDispatch();

  const currentSwiperIndex = useSelector(
    (state) => state.stay.currentSwiperIndex
  );

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    swiperTravelIndex: 0,
    allowTravelSlideNext: false,
    endOfTravelSlide: false,
    swiperExploreLocationIndex: 0,
    allowExploreLocationSlideNext: false,
    endOfExploreLocationSlide: false,
  });

  const settings = {
    slidesPerView: 1,
    preventInteractionOnTransition: true,
    allowTouchMove: false,
    speed: 600,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
  return (
    <div className="flex flex-col h-full relative">
      <Swiper
        {...settings}
        onSwiper={(swiper) => {
          setState({
            ...state,
            allowSlideNext: swiper.allowSlideNext,
          });
        }}
        onSlideChange={(swiper) => {
          dispatch(updateCurrentSwiperState(swiper.realIndex + 1));
          setState({
            ...state,
            swiperIndex: swiper.realIndex,
          });
        }}
        className="!w-full h-[93%]"
      >
        <SwiperSlide className="overflow-y-scroll">
          <div className="flex justify-end">
            <div className="font-bold inline mr-6 mb-3 mt-2 rounded-full text-sm px-2 py-1 bg-white shadow-lg">
              Step: {currentSwiperIndex} of 5
            </div>
          </div>
          <TypeOfStay></TypeOfStay>
        </SwiperSlide>
        <SwiperSlide className="overflow-y-scroll">
          <div className="flex justify-end">
            <div className="font-bold inline mr-6 mb-3 mt-2 rounded-full text-sm px-2 py-1 bg-white shadow-lg">
              Step: {currentSwiperIndex} of 5
            </div>
          </div>

          <DescribeStay></DescribeStay>
        </SwiperSlide>
        <SwiperSlide className="overflow-y-scroll relative">
          <Location></Location>
          <div
            className={
              "font-bold absolute top-4 right-6 !z-30 mt-2 rounded-full text-sm px-2 py-1 bg-white shadow-lg " +
              styles.stepWebkitSetting
            }
          >
            Step: {currentSwiperIndex} of 5
          </div>
        </SwiperSlide>
        <SwiperSlide className="overflow-y-scroll">
          <div className="flex justify-end">
            <div className="font-bold inline mr-6 mb-3 mt-2 rounded-full text-sm px-2 py-1 bg-white shadow-lg">
              Step: {currentSwiperIndex} of 5
            </div>
          </div>
          <Details></Details>
        </SwiperSlide>
        <SwiperSlide className="overflow-y-scroll">
          <div className="flex justify-end">
            <div className="font-bold inline mr-6 mb-3 mt-2 rounded-full text-sm px-2 py-1 bg-white shadow-lg">
              Step: {currentSwiperIndex} of 5
            </div>
          </div>
          <Amenities></Amenities>
        </SwiperSlide>
      </Swiper>

      <div className="w-full z-20 md:!w-[50%] lg:!w-[45%] h-[7%] fixed bg-gray-100 rounded-tl-2xl rounded-tr-2xl flex bottom-0 right-0 justify-between items-center px-6">
        <div className="swiper-pagination swiper-button-prev rounded-full border border-gray-200 cursor-pointer pl-2 pr-4 py-1 flex gap-1 items-center justify-center">
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
          <span>Back</span>
        </div>
        <div className="swiper-pagination swiper-button-next rounded-full bg-black text-white cursor-pointer flex gap-1 items-center pl-4 pr-2 py-1 justify-center">
          <span>Next</span>
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
    </div>
  );
};

Stay.propTypes = {};

export default Stay;
