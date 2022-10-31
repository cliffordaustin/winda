import React, { useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Main.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Mousewheel } from "swiper";
import SwiperCore from "swiper";

import "swiper/css/effect-creative";
import "swiper/css";
import Pagination from "./Pagination";
import Image from "next/image";
import Carousel from "../ui/Carousel";
import { useRouter } from "next/router";
import Dialogue from "./Dialogue";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Link from "next/link";
import Button from "../ui/Button";
import { Icon } from "@iconify/react";
import Price from "../Stay/Price";

SwiperCore.use([Navigation]);

function Main({ holidayTrips }) {
  const router = useRouter();

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

    isEndOfSlide: false,
    isBeginningOfSlide: false,
    isEndOfExploreSlide: false,
    isBeginningOfExploreSlide: false,
    isEndOfTripSlide: false,
    isBeginningOfTripSlide: false,
  });

  const settings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    // slidesPerGroup: 1,
    loop: true,
    freeMode: {
      enabled: true,
    },
    mousewheel: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const roomsSettings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-room-button-next",
      prevEl: ".swiper-room-button-prev",
    },
  };

  const tripSettings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-trip-button-next",
      prevEl: ".swiper-trip-button-prev",
    },
  };

  const exploreSettings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-explore-button-next",
      prevEl: ".swiper-explore-button-prev",
    },
  };

  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="w-full">
      {/* <div className="w-full flex justify-center">
        <div className="px-3 md:px-6 md:w-[60%] w-full">
          <h2 className="text-center mt-2 text-base md:text-lg">
            Have you ever been frustrated while planning your trip in East
            Africa? Searching through many websites, talking to multiple travel
            agents and still not sure whether you got the best deal?
          </h2>
        </div>
      </div>

      <div className="w-full flex justify-center mt-8">
        <div className="px-3 flex flex-col items-center justify-center gap-2 md:px-6 md:w-[60%] w-full">
          <h2 className="text-center mt-2 text-base md:text-lg">
            Cut through the noise. Discover tried and tested trips enjoyed by
            our customers
          </h2>
          <Link href="/trip">
            <a>
              <Button
                onClick={() => {
                  Mixpanel.track(
                    "Clicked view all curated trips button under about our service section"
                  );
                }}
                className="flex items-center gap-4 max-w-[360px] !uppercase !py-3 !bg-gradient-to-r !bg-red-500 !rounded-3xl"
              >
                <span className="font-bold">Explore trips now</span>
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="my-6">
        <hr />
      </div>

      <div className="w-full flex justify-center mt-8">
        <div className="px-3 flex items-center justify-center gap-2 md:px-6 md:w-[60%] w-full">
          <div className="py-4 px-3 rounded-md text-base md:text-lg hover:shadow-md transition-shadow duration-500">
            Everyone deserves a great travel experience
          </div>
          <div className="h-[60%] w-[2px] bg-gray-300"></div>
          <div className="py-4 px-3 rounded-md text-base md:text-lg md:hover:shadow-md transition-shadow duration-500">
            Trips booked across Kenya, Uganda, Tanzania and Rwanda
          </div>
        </div>
      </div>

      <div className="md:px-6 px-3 text-center mt-8">
        <h1 className="text-2xl font-bold">How it works</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap mt-4">
          <div className="w-full h-[0.5px] bg-gray-200 md:hidden"></div>

          <div className="h-[120px] md:h-[200px] w-[260px] flex items-center justify-center flex-col gap-4 bg-white rounded-lg md:hover:shadow-all transition-shadow duration-500 px-3">
            <h1 className="font-bold">1</h1>
            <p className="mt-2">
              Explore our curated trips and find what you like
            </p>
          </div>

          <div className="w-full h-[0.5px] bg-gray-200 md:hidden"></div>

          <div className="h-[120px] md:h-[200px] w-[260px] flex items-center justify-center flex-col gap-4 bg-white rounded-lg md:hover:shadow-all transition-shadow duration-500 px-3">
            <h1 className="font-bold">2</h1>
            <p className="mt-2">
              Add the number of people and dates to check availability
            </p>
          </div>

          <div className="w-full h-[0.5px] bg-gray-200 md:hidden"></div>

          <div className="h-[120px] md:h-[200px] w-[260px] flex items-center justify-center flex-col gap-4 bg-white rounded-lg md:hover:shadow-all transition-shadow duration-500 px-3">
            <h1 className="font-bold">3</h1>
            <p className="mt-2">Book your trip</p>
          </div>

          <div className="w-full h-[0.5px] bg-gray-200 md:hidden"></div>
        </div>
      </div> */}

      {/* <div className="md:px-6 px-3 text-center mt-8">
        <h1 className="text-2xl font-bold">Popular trips</h1>
      </div>

      <div className="px-2 md:px-0 mt-6">
        <Swiper
          {...roomsSettings}
          modules={[FreeMode, Navigation, Thumbs]}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          className="md:w-[70%] lg:w-[900px] w-full"
        >
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-md before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/romantic-trip.webp"]}
                imageClass="rounded-md"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Romantic weekend
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <Link href="/trip?tag=romantic">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track("View curated trips for romantic trips");
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-md before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/person_hiking.webp"]}
                imageClass="rounded-md"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Solo trips
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <Link href="/trip?tag=solo_getaway">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track("View curated trips for solo trips");
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-md before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/roadtrip.webp"]}
                imageClass="rounded-md"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Road trips
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <Link href="/trip?tag=road_trip">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track("View curated trips for road trips");
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-md before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/cultural-trip.webp"]}
                imageClass="rounded-md"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Cultural trips
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <Link href="/trip?tag=cultural">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track("View curated trips for cultural trips");
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-10 left-[46%] -bottom-[30px] items-center justify-end " +
              (state.isBeginningOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-prev border bg-white shadow-lg rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-black"
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
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div
              className={
                "cursor-pointer h-8 w-8 swiper-room-button-prev border bg-white rounded-full flex items-center justify-center " +
                (state.isBeginningOfSlide
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 border-blue-500")
              }
            >
              <Icon icon="codicon:arrow-small-left" className="w-6 h-6" />
            </div>

            <div
              className={
                "cursor-pointer h-8 w-8 swiper-room-button-next rounded-full bg-white border flex items-center justify-center " +
                (state.isEndOfSlide
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-500 border-blue-500")
              }
            >
              <Icon icon="codicon:arrow-small-right" className="w-6 h-6" />
            </div>
          </div>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-next rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Swiper>
      </div>

      <div className="flex items-center justify-center mt-6">
        <Link href="/trip">
          <a>
            <Button
              onClick={() => {
                Mixpanel.track(
                  "Clicked view all curated trips button under popular trips"
                );
              }}
              className="flex items-center gap-4 max-w-[360px] !uppercase !py-3 !bg-gradient-to-r !bg-red-500 !rounded-3xl"
            >
              <span className="font-bold">see all trips</span>
            </Button>
          </a>
        </Link>
      </div> */}

      <div className="flex flex-col px-2 gap-4">
        <h1 className="font-black text-2xl ml-2 text-center">
          Holiday Special
        </h1>

        <div className="mb-8">
          <Swiper
            {...tripSettings}
            onSwiper={(swiper) => {
              setState({
                ...state,
                isEndOfTripSlide: swiper.isEnd,
                isBeginningOfTripSlide: swiper.isBeginning,
              });
            }}
            onSlideChange={(swiper) => {
              setState({
                ...state,
                isEndOfTripSlide: swiper.isEnd,
                isBeginningOfTripSlide: swiper.isBeginning,
              });
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="!relative"
          >
            {holidayTrips.map((trip, index) => {
              const sortedImages = trip.single_trip_images.sort(
                (x, y) => y.main - x.main
              );

              const images = sortedImages.map((image) => {
                return image.image;
              });
              return (
                <SwiperSlide key={index} className="!w-[320px] cursor-pointer">
                  <Link href={`/trip/${trip.slug}`}>
                    <a className="w-full cursor-pointer">
                      <div className="!h-[220px] relative w-full">
                        <Carousel
                          images={[images[0]]}
                          imageClass="rounded-lg"
                        ></Carousel>
                      </div>

                      <div className="px-2">
                        <h1 className="font-bold text-lg truncate">
                          {trip.name}
                        </h1>
                        <p className="text-gray-600 text-sm">
                          {trip.area_covered.split(",")[0]} |{" "}
                          {trip.total_number_of_days}{" "}
                          {trip.total_number_of_days > 1
                            ? "days trip"
                            : "day trip"}
                        </p>

                        <div className="text-sm text-gray-700 flex flex-wrap gap-0.5 items-center">
                          <div className="text-xl mr-0.5 font-bold flex gap-1">
                            {trip.old_price && (
                              <Price
                                stayPrice={trip.old_price}
                                className="!text-sm line-through self-end mb-0.5 text-red-500"
                              ></Price>
                            )}
                            <Price
                              stayPrice={trip.price_non_resident || trip.price}
                              className="!text-lg"
                            ></Price>
                          </div>
                          <div className="font-bold">/per person</div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </SwiperSlide>
              );
            })}

            <div
              className={
                " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
                (state.isBeginningOfTripSlide ? "invisible" : "")
              }
            >
              <div className="cursor-pointer h-8 w-8 swiper-trip-button-prev rounded-full border-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
            </div>

            <div
              className={
                " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
                (state.isEndOfTripSlide ? "invisible" : "")
              }
            >
              <div className="cursor-pointer h-8 w-8 swiper-trip-button-next rounded-full border-2 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Swiper>
        </div>
      </div>

      <div className="my-6">
        <h1 className="font-black text-2xl ml-2 text-center">
          It&apos;s as easy as it gets
        </h1>

        <div className="py-4 mt-1 px-4 flex items-center gap-4 flex-wrap justify-between">
          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon
              icon="zondicons:explore"
              className="w-12 h-12 icon-gradient"
            />

            <div className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-red-600 text-lg">Explore</h1>
              <p className="text-sm text-gray-600 text-center">
                Explore our curated trips and find what you like
              </p>
            </div>
          </div>

          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon icon="bi:calendar-check-fill" className="w-12 h-12" />
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-red-600 text-lg">Availability</h1>
              <p className="text-sm text-gray-600 text-center">
                Add the number of people and dates to check availability
              </p>
            </div>
          </div>

          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon icon="fluent:payment-16-filled" className="w-12 h-12" />
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-red-600 text-lg">Book</h1>
              <p className="text-sm text-gray-600 text-center">
                Book your trip
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="px-2">
        <Swiper
          {...settings}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          modules={[Navigation, FreeMode]}
          className="stepWebkitSetting"
        >
          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[80%] lg:!w-[800px] flex gap-3">
            <div className="w-full rounded-2xl flex flex-col lg:flex-row gap-4 px-2 md:px-4 py-2 md:py-4 h-full bg-white border">
              <div className="lg:w-[40%] flex flex-col justify-between py-2">
                <h1 className="text-xl md:text-3xl font-bold text-black">
                  Great travel offers for the upcoming holiday season
                </h1>

                <Link href="/trip?holiday=1">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for this holiday button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-gradient-to-r from-pink-500 via-red-500 rounded-lg text-white to-yellow-500 mt-2"
                    >
                      Book now
                    </div>
                  </a>
                </Link>
              </div>
              <div className="w-full h-full lg:w-[60%] rounded-2xl relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/group-of-travelers.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="absolute z-20 bottom-4 font-bold left-4 text-white text-2xl md:text-3xl">
                  Holiday season offers
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[380px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/cultural-trip.webp"]}
                imageClass="rounded-2xl"
                objectPosition="center"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Explore the culture
              </h1>

              <Link href="/trip?tag=cultural">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-gradient-to-r from-pink-500 via-red-500 rounded-lg text-white to-yellow-500 mt-2"
                  >
                    Book now
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[380px]">
            <div className="relative h-full w-full">
              <Carousel
                images={["/images/home/romantic-trip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Romantic mood
              </h1>

              <Link href="/trip?tag=romantic">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-gradient-to-r from-pink-500 via-red-500 rounded-lg text-white to-yellow-500 mt-2"
                  >
                    Book now
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[380px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/roadtrip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Road-trips galore!
              </h1>

              <Link href="/trip?tag=road_trip">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-gradient-to-r from-pink-500 via-red-500 rounded-lg text-white to-yellow-500 mt-2"
                  >
                    Book now
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <div
            className={
              " absolute clear-both hidden md:flex h-12 w-12 z-30 left-1 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer clear-both h-8 w-8 swiper-button-prev rounded-full border-2 border-gray-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
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
          </div>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-1 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-button-next rounded-full border-2 border-gray-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Swiper>
      </div> */}

      {/* <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Find what suits you</span>
      </h1> */}

      <h1 className="font-bold text-3xl mb-6 font-OpenSans text-center mt-6">
        <span className="text-slate-800">Explore on</span>{" "}
        <span className="text-red-500">winda</span>
      </h1>

      <div className="px-2">
        <Swiper
          {...roomsSettings}
          modules={[FreeMode, Navigation, Thumbs]}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          className="!relative"
        >
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/cultural-trip.webp"]}
                imageClass="rounded-2xl"
                objectPosition="center"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Explore the culture
              </h1>

              <Link href="/trip?tag=cultural">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-white rounded-lg mt-2"
                  >
                    View trips
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full">
              <Carousel
                images={["/images/home/romantic-trip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Romantic mood
              </h1>

              <Link href="/trip?tag=romantic">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white rounded-lg mt-2"
                  >
                    View trips
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/roadtrip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Road-trips galore!
              </h1>

              <Link href="/trip?tag=road_trip">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit !bg-white rounded-lg"
                  >
                    View trips
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full">
              <Carousel
                images={["/images/home/romantic-trip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                Romantic mood
              </h1>

              <Link href="/trip?tag=romantic">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track(
                        "View curated trips for Nairobi button clicked"
                      );
                    }}
                    className="absolute bottom-4 z-30 flex flex-col left-4 px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white rounded-lg mt-2"
                  >
                    View trips
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Campings
              </h1>

              <Link href="/stays?type_of_stay=CAMPSITE">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Campsites button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/uniquespace.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Unique spaces
              </h1>

              <Link href="/stays?type_of_stay=UNIQUE SPACE">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Unique spaces button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/lodging.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Lodge
              </h1>

              <Link href="/stays?type_of_stay=LODGE">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Lodge button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/restaurant.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Food & Drink
              </h1>

              <Link href="/activities?tags=food & drink">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Lodge button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View activities
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/culture-activity.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Local Culture
              </h1>

              <Link href="/activities?tags=local culture">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Lodge button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View activities
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/weekend-getaway-activity.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Weekend Getaways
              </h1>

              <Link href="/activities?tags=weekend">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Lodge button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View activities
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          {/* <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite-tented.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Tented camps
              </h1>

              <Link href="/stays?type_of_stay=TENTED CAMP">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Tented camps button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/budget.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Budget
              </h1>

              <Link href="/stays?pricing_type=REASONABLE">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Budget button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/mid-range.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Mid-Range
              </h1>

              <Link href="/stays?pricing_type=MID-RANGE">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Mid-Range button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/luxury.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Luxurious
              </h1>

              <Link href="/stays?pricing_type=HIGH-END">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("Luxurious button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide> */}

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-prev rounded-full border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
          </div>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-next rounded-full border-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Swiper>
      </div>

      {/* <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Explore all our services</span>
      </h1> */}

      {/* <div className="px-2">
        <Swiper
          {...exploreSettings}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="!relative"
        >
          <SwiperSlide className="!h-[320px] !w-[320px] md:!w-[520px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/curatedtrips.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Curated trips
              </div>

              <Link href="/trip">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("All curated trips button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View curated trips
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px] md:!w-[520px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/stays.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Stays
              </div>

              <Link href="/stays">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("All stays button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px] md:!w-[520px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/activities.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Activities
              </div>

              <Link href="/activities">
                <a>
                  <div
                    onClick={() => {
                      Mixpanel.track("All activities button clicked");
                    }}
                    className="absolute bottom-2 z-30 flex flex-col left-2"
                  >
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View activities
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-explore-button-prev rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
          </div>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-explore-button-next rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Swiper>
      </div> */}
    </div>
  );
}

export default Main;
