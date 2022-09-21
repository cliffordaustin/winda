import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Link, animateScroll as scroll } from "react-scroll";
import { Transition } from "@headlessui/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

function ScrollTo({ guestPopup, stay }) {
  const settings = {
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [swiper, setSwiper] = useState(null);

  const [isEndOfSlide, setIsEndOfSlide] = useState(false);
  const [isStartOfSlide, setIsStartOfSlide] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);

  const [dontShowReserveBtn, setDontShowReserveBtn] = useState(false);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };
  return (
    <div
      className={
        stay.is_an_event
          ? "w-full flex items-center justify-between px-3"
          : "!w-full !relative h-full mx-auto flex justify-center items-center"
      }
    >
      <Swiper
        {...settings}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        onSwiper={(swiper) => {
          setSwiper(swiper);
          setIsEndOfSlide(swiper.isEnd);
          setIsStartOfSlide(swiper.isBeginning);
        }}
        onSlideChange={(swiper) => {
          setIsEndOfSlide(swiper.isEnd);
          setIsStartOfSlide(swiper.isBeginning);
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={"!w-full !h-full relative " + (guestPopup ? "!-z-10" : "")}
      >
        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="about"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>About</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="activities"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Activities</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="amenities"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Amenities</div>
          </Link>
        </SwiperSlide>

        {stay.is_an_event && (
          <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
            <Link
              className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
              activeClass="!border-b-2 !border-slate-800"
              to="rooms"
              spy={true}
              smooth={true}
              offset={-400}
              duration={500}
              onSetActive={() => {
                slideto(0);
                setDontShowReserveBtn(true);
              }}
              onSetInactive={() => {
                setDontShowReserveBtn(false);
              }}
            >
              <div>Rooms</div>
            </Link>
          </SwiperSlide>
        )}

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="policies"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(2);
            }}
          >
            <div>Policies</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="map"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(2);
            }}
          >
            <div>Map</div>
          </Link>
        </SwiperSlide>

        {stay.total_num_of_reviews > 0 && (
          <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
            <Link
              className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
              activeClass="!border-b-2 !border-slate-800"
              to="reviews"
              spy={true}
              smooth={true}
              offset={-400}
              duration={500}
              onSetActive={() => {
                slideto(3);
              }}
            >
              <div>Reviews</div>
            </Link>
          </SwiperSlide>
        )}
      </Swiper>

      {stay.is_an_event && (
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={!dontShowReserveBtn}
        >
          <Link
            className="px-3 cursor-pointer md:flex hidden items-center justify-center text-sm bg-blue-600 w-[150px] py-2 text-white font-bold rounded-md"
            to="rooms"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
          >
            <span>Reserve a room</span>
          </Link>
        </Transition>
      )}

      {/* <div
        className={
          "cursor-pointer absolute -left-4 swiper-button-prev " +
          (isStartOfSlide ? "invisible" : "")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </div>
      <div
        className={
          "cursor-pointer absolute -right-4 swiper-button-next " +
          (isEndOfSlide ? "invisible" : "")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div> */}
    </div>
  );
}

export default ScrollTo;
