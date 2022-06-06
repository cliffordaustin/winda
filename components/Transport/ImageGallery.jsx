import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper";
import Image from "next/image";

const ImageGallery = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [allowGallerySlideNext, setAllowGallerySlideNext] = useState(false);
  const [gallerySwiperIndex, setGallerySwiperIndex] = useState(0);
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
  return (
    <div className="w-full h-full">
      <Swiper
        {...settings}
        thumbs={{ swiper: thumbsSwiper }}
        onSwiper={(swiper) => setAllowGallerySlideNext(swiper.allowSlideNext)}
        onSlideChange={(swiper) => setGallerySwiperIndex(swiper.realIndex)}
        modules={[FreeMode, Navigation, Thumbs]}
        className="!h-[80%] !w-full !mb-2 select-none"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="h-full rounded-xl w-full overflow-hidden relative flex-shrink-0 flex-grow-0">
              <Image
                src={image}
                className="w-full h-full object-cover"
                layout="fill"
                alt="Image of a car"
                unoptimized={true}
              ></Image>
            </div>
          </SwiperSlide>
        ))}

        <div
          className={
            "absolute hidden md:flex cursor-pointer select-none items-center justify-center top-2/4 z-50 left-6 -translate-y-2/4 swiper-pagination swiper-button-prev w-10 h-10 rounded-full bg-white shadow-lg " +
            (gallerySwiperIndex === 0 ? "invisible" : "")
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
          className={
            "absolute hidden cursor-pointer md:flex select-none items-center justify-center top-2/4 z-50 right-6 -translate-y-2/4 swiper-pagination swiper-button-next w-10 h-10 rounded-full bg-white shadow-lg " +
            (!allowGallerySlideNext ? "invisible" : "")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="black"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="!h-[20%] box-border py-3 image-picker-container select-none"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="!w-[25%] !h-full rounded-xl !overflow-hidden select-none"
          >
            <div className="h-full w-full relative flex-shrink-0 flex-grow-0">
              <Image
                src={image}
                className="w-full h-full object-cover"
                layout="fill"
                alt="Image of a car"
                unoptimized={true}
              ></Image>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.array,
};

export default ImageGallery;
