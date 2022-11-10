import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Link, animateScroll as scroll } from "react-scroll";
import { Transition } from "@headlessui/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

function ScrollToNavigation({}) {
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

  const [dontShowPlanBtn, setDontShowPlanBtn] = useState(false);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };
  return (
    <div
      className={
        "!w-full !relative h-full mx-auto flex justify-center items-center"
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
        className={"!w-full !h-full relative "}
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
            to="essential-info"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Essential info</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="gallery"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
            }}
          >
            <div>Gallery</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="itinerary"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(0);
              setDontShowPlanBtn(true);
            }}
            onSetInactive={() => {
              setDontShowPlanBtn(false);
            }}
          >
            <div>Itinerary</div>
          </Link>
        </SwiperSlide>

        <SwiperSlide className="!w-auto md:hidden flex cursor-pointer justify-center">
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

        <SwiperSlide className="!w-auto md:hidden flex cursor-pointer justify-center">
          <Link
            className="px-1 text-sm font-bold flex items-center border-b-2 border-transparent"
            activeClass="!border-b-2 !border-slate-800"
            to="plan"
            spy={true}
            smooth={true}
            offset={-400}
            duration={500}
            onSetActive={() => {
              slideto(2);
            }}
          >
            <div>Plans</div>
          </Link>
        </SwiperSlide>
      </Swiper>

      <Transition
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={!dontShowPlanBtn}
      >
        <Link
          className="px-3 cursor-pointer md:flex hidden items-center justify-center text-sm bg-blue-600 w-[150px] py-2 text-white font-bold rounded-md"
          to="plan"
          spy={true}
          smooth={true}
          offset={-400}
          duration={500}
        >
          <span>Pick a plan</span>
        </Link>
      </Transition>
    </div>
  );
}

export default ScrollToNavigation;
