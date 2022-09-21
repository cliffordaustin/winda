import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";
import Image from "next/image";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";

SwiperCore.use([Navigation]);

import "swiper/css";
import "swiper/css/pagination";

function Carousel({
  images,
  imageClass = "",
  className = "",
  unoptimized = true,
}) {
  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [state, setState] = useState({
    swiperIndex: 0,
    endOfSlide: false,
    showNavigation: false,
  });

  return (
    <div className="!h-full stepWebkitSetting">
      <Swiper
        {...settings}
        modules={[Pagination, Autoplay]}
        onSlideChange={(swiper) => {
          setState({
            ...state,
            swiperIndex: swiper.realIndex,
            endOfSlide: swiper.isEnd,
          });
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="!h-full !relative !w-full "
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={"!h-full !w-full " + className}>
            <Image
              className={"w-full object-cover " + imageClass}
              src={image}
              alt="Image Gallery"
              layout="fill"
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
