import React, { useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Main.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import SwiperCore from "swiper";

import "swiper/css/effect-creative";
import "swiper/css";
import Pagination from "./Pagination";

SwiperCore.use([Navigation]);

function Main() {
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
    spaceBetween: 40,
    slidesPerView: "auto",
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

  const travelSettings = {
    spaceBetween: 40,
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-travel-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-travel-button-next",
      prevEl: ".swiper-travel-button-prev",
    },
  };

  const exploreLocationSettings = {
    spaceBetween: 40,
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-explore-location-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-explore-location-button-next",
      prevEl: ".swiper-explore-location-button-prev",
    },
  };

  const experienceImages = [
    { image: "/images/explore-categories/stays.jpg", header: "Stays" },
    { image: "/images/explore-categories/transport.jpg", header: "Transport" },
    {
      image: "/images/explore-categories/experiences.jpg",
      header: "Experiences",
    },
    {
      image: "/images/explore-categories/curatedtrips.JPG",
      header: "Curated Trips",
    },
  ];

  const exploreLocationImages = [
    { image: "/images/explore-locations/nairobi.jpg", header: "Nairobi" },
    { image: "/images/explore-locations/nanyuki.jpg", header: "Nanyuki" },
    {
      image: "/images/explore-locations/lamu.jpg",
      header: "Lamu",
    },
    {
      image: "/images/explore-locations/kilifi.jpg",
      header: "Kilifi",
    },
  ];

  const travelImages = [
    { image: "/images/travel-themes/campsites.jpg", header: "Campsites" },
    {
      image: "/images/travel-themes/weekend-getaways.jpg",
      header: "Weekend Getaways",
    },
    {
      image: "/images/travel-themes/group-family-retreats.jpeg",
      header: "Group Family Retreats",
    },
    {
      image: "/images/travel-themes/romantic-getaways.jpg",
      header: "Romantic Getaway",
    },
    {
      image: "/images/travel-themes/national-parks.JPG",
      header: "National Park",
    },
    {
      image: "/images/travel-themes/active-experiences.JPG",
      header: "Active Experiences",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-4 justify-between items-center px-4 sm:px-8 md:px-12">
        <h1 className="font-bold text-2xl md:text-3xl font-OpenSans">
          Explore Categories
        </h1>
        <Pagination
          swiperIndex={state.swiperIndex}
          allowSlideNext={state.allowSlideNext}
          endOfSlide={state.endOfSlide}
          prevClassName="swiper-pagination swiper-button-prev"
          nextClassName="swiper-pagination swiper-button-next"
        ></Pagination>
      </div>
      <div className="px-0 pl-4 select-none md:pl-16 mb-10 mt-5 !relative w-full">
        <Swiper
          {...settings}
          onSwiper={(swiper) => {
            setState({
              ...state,
              allowSlideNext: swiper.allowSlideNext,
            });
          }}
          onSlideChange={(swiper) => {
            console.log(swiper);
            setState({
              ...state,
              swiperIndex: swiper.realIndex,
            });
          }}
          className="!w-full"
        >
          {experienceImages.map((experienceImage, index) => (
            <SwiperSlide key={index} className="!w-72 lgDesktop:!w-500">
              <Card
                imagePaths={[experienceImage.image]}
                header={experienceImage.header}
                className={styles.card}
                carouselClassName="h-56 lgDesktop:h-96"
              ></Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex gap-4 justify-between items-center px-4 sm:px-8 md:px-12">
        <h1 className="font-bold text-2xl md:text-3xl font-OpenSans">
          Explore Locations
        </h1>
        <Pagination
          swiperIndex={state.swiperExploreLocationIndex}
          allowSlideNext={state.allowExploreLocationSlideNext}
          endOfSlide={state.endOfExploreLocationSlide}
          prevClassName="swiper-explore-location-pagination swiper-explore-location-button-prev"
          nextClassName="swiper-explore-location-pagination swiper-explore-location-button-next"
        ></Pagination>
      </div>
      <div className="px-0 pl-4 select-none md:pl-16 mb-10 mt-5 !relative w-full">
        <Swiper
          {...exploreLocationSettings}
          onSwiper={(swiper) => {
            setState({
              ...state,
              allowExploreLocationSlideNext: swiper.allowSlideNext,
            });
          }}
          onSlideChange={(swiper) => {
            console.log(swiper);
            setState({
              ...state,
              swiperExploreLocationIndex: swiper.realIndex,
            });
          }}
          className="!w-full"
        >
          {exploreLocationImages.map((explorelocationImage, index) => (
            <SwiperSlide key={index} className="!w-72 lgDesktop:!w-500">
              <Card
                imagePaths={[explorelocationImage.image]}
                header={explorelocationImage.header}
                className={styles.card}
                carouselClassName="h-56 lgDesktop:h-96"
              ></Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex gap-4 justify-between items-center px-4 sm:px-8 md:px-12">
        <h1 className="font-bold text-2xl md:text-3xl font-OpenSans">
          Travel Themes
        </h1>
        <Pagination
          swiperIndex={state.swiperTravelIndex}
          allowSlideNext={state.allowTravelSlideNext}
          endOfSlide={state.endOfTravelSlide}
          prevClassName="swiper-travel-pagination swiper-travel-button-prev"
          nextClassName="swiper-travel-pagination swiper-travel-button-next"
        ></Pagination>
      </div>
      <div className="px-0 pl-4 select-none md:pl-16 mb-10 mt-5 !relative w-full">
        <Swiper
          {...travelSettings}
          onSwiper={(swiper) =>
            setState({
              ...state,
              allowTravelSlideNext: swiper.allowTravelSlideNext,
            })
          }
          onSlideChange={(swiper) =>
            setState({
              ...state,
              swiperTravelIndex: swiper.realIndex,
              endOfTravelSlide: swiper.isEnd,
            })
          }
          className="!w-full"
        >
          {travelImages.map((travelImage, index) => (
            <SwiperSlide key={index} className="!w-72 lgDesktop:!w-500">
              <Card
                imagePaths={[travelImage.image]}
                header={travelImage.header}
                className={styles.card}
                carouselClassName="h-56 lgDesktop:h-96"
              ></Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Main;
