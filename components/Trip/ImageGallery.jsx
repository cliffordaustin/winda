import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";
import Image from "next/image";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { motion, AnimatePresence } from "framer-motion";

SwiperCore.use([Navigation]);

import "swiper/css";
import "swiper/css/pagination";

function TripImageGallery({
  images,
  imageClass = "",
  className = "",
  unoptimized = true,
}) {
  const settings = {
    spaceBetween: 10,
    slidesPerView: "auto",
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
        modules={[Navigation]}
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
        {images.map((image, index) => (
          <SwiperSlide key={index} className={"!h-full " + className}>
            <Image
              className={"w-full object-cover " + imageClass}
              src={image}
              alt="Image Gallery"
              layout="fill"
              unoptimized={unoptimized}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

TripImageGallery.propTypes = {
  className: PropTypes.string,
  images: PropTypes.array.isRequired,
  imageClass: PropTypes.string,
};

export default TripImageGallery;
