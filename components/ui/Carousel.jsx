import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";
import Image from "next/image";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { motion, AnimatePresence } from "framer-motion";

SwiperCore.use([Navigation]);

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Carousel({
  images,
  imageClass = "",
  className = "",
  unoptimized = true,
  objectPosition = "center",
  layout = "fill",
  alt = "Image Gallery",
}) {
  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    pagination: {
      dynamicBullets: true,
    },
  };

  const [state, setState] = useState({
    swiperIndex: 0,
    endOfSlide: false,
    showNavigation: false,
  });

  const variants = {
    hide: {
      scale: 0.5,
      x: -20,
    },
    show: {
      x: 0,
      scale: 1,
    },
    exit: {
      scale: 0.8,
      x: -5,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <div className="!h-full stepWebkitSetting">
      <Swiper
        {...settings}
        modules={[Navigation, Pagination]}
        onSlideChange={(swiper) => {
          setState({
            ...state,
            swiperIndex: swiper.realIndex,
            endOfSlide: swiper.isEnd,
          });
        }}
        navigation
        className="!h-full !relative "
      >
        {/* <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={
            "absolute flex cursor-pointer items-center justify-center top-2/4 z-20 left-3 swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
            (state.swiperIndex === 0 ? "invisible" : "")
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
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={
            "absolute cursor-pointer flex items-center justify-center top-2/4 z-20 right-3 swiper-button-next w-8 h-8 -mt-4 rounded-full bg-white shadow-lg " +
            (state.endOfSlide || images.length === 1 ? "invisible" : "")
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
        </div> */}
        {images.map((image, index) => (
          <SwiperSlide key={index} className={"!h-full " + className}>
            <Image
              className={"w-full object-cover " + imageClass}
              src={image}
              alt={alt}
              objectPosition={objectPosition}
              layout={layout}
              objectFit="cover"
              unoptimized={unoptimized}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

Carousel.propTypes = {
  className: PropTypes.string,
  images: PropTypes.array.isRequired,
  imageClass: PropTypes.string,
};

export default Carousel;
