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

SwiperCore.use([Navigation]);

function Main() {
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
      <h1 className="font-bold text-3xl mb-6 font-OpenSans text-center">
        <span className="text-gray-600">Explore trips on</span>{" "}
        <span className="">winda</span>
      </h1>

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

      <div className="px-2">
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
            <div className="w-full rounded-2xl flex flex-col lg:flex-row gap-4 px-2 md:px-4 py-2 md:py-4 h-full bg-red-500">
              <div className="lg:w-[40%] flex flex-col justify-between py-2">
                <h1 className="text-xl md:text-3xl font-bold text-white">
                  Start your holiday with these curated trips.
                </h1>

                <Link href="/trip?holiday=1">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for this holiday button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
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

                <div className="absolute z-20 bottom-4 font-bold left-4 text-white text-3xl md:text-5xl">
                  Holiday season offers
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[80%] lg:!w-[800px] flex gap-3">
            <div className="w-full rounded-2xl flex flex-col lg:flex-row gap-4 px-2 md:px-4 py-2 md:py-4 h-full bg-red-500">
              <div className="lg:w-[40%] flex flex-col justify-between py-2">
                <h1 className="text-xl md:text-3xl font-bold text-white">
                  We created trips dedicated to exploring kenya culture.
                </h1>

                <Link href="/trip?tag=cultural">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Nairobi button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      Book now
                    </div>
                  </a>
                </Link>
              </div>
              <div className="w-full h-full lg:w-[60%] rounded-2xl relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/cultural-trip.webp"]}
                  imageClass="rounded-2xl"
                  objectPosition="center"
                ></Carousel>

                <div className="absolute z-20 bottom-4 font-bold left-4 text-white text-3xl md:text-5xl">
                  Explore the culture
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[80%] lg:!w-[800px] flex gap-3">
            <div className="w-full rounded-2xl flex flex-col lg:flex-row gap-4 px-2 md:px-4 py-2 md:py-4 h-full bg-red-500">
              <div className="lg:w-[40%] flex flex-col justify-between py-2">
                <h1 className="text-xl md:text-3xl font-bold text-white">
                  The best memories are the ones you create with your perfect
                  partner.
                </h1>

                <Link href="/trip?tag=romantic">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Naivasha button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      Book now
                    </div>
                  </a>
                </Link>
              </div>
              <div className="w-full h-full lg:w-[60%] rounded-2xl relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/romantic-trip.webp"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="absolute z-20 bottom-4 font-bold left-4 text-white text-3xl md:text-5xl">
                  Romantic mood
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[90%] sm:!w-[80%] lg:!w-[800px] flex gap-3">
            <div className="w-full rounded-2xl flex flex-col lg:flex-row gap-4 px-2 md:px-4 py-2 md:py-4 h-full bg-red-500">
              <div className="lg:w-[40%] flex flex-col justify-between py-2">
                <h1 className="text-xl md:text-3xl font-bold text-white">
                  We created trips meant for you to explore kenya and enjoy your
                  time.
                </h1>

                <Link href="/trip?tag=road_trip">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Maasai Mara button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      Book now
                    </div>
                  </a>
                </Link>
              </div>
              <div className="w-full h-full lg:w-[60%] rounded-2xl relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/roadtrip.webp"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="absolute z-20 bottom-4 font-bold left-4 text-white text-3xl md:text-5xl">
                  Spend time on the road
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[600px] sm:!w-[800px] md:!w-[900px] lg:!w-[900px] flex gap-3">
            <div className="xsmall:w-[50%] w-[55%] sm:w-[60%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-40">
              <Carousel
                images={["/images/home/cultural-trip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Explore the culture
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  Kenya has a vast and rich culture, so we created trips
                  dedicated to exploring it.
                </p>
                <Link href="/trip?tag=cultural">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Nairobi button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
            <div className="xsmall:w-[50%] w-[45%] sm:w-[40%] h-full flex justify-between flex-wrap">
              <div className="w-[100%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/stays-location.webp"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Nairobi
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    Nairobi is the capital of Kenya and East Africa’s most
                    cosmopolitan city, with a vibrant population of 4.5 million.
                    Unique to the city is the proximity of Nairobi National
                    Park, a true wilderness area juxtaposed against the larger
                    urban metropolis.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("nairobi-stays");
                      Mixpanel.track("Show more about Nairobi button clicked");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "nairobi-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Nairobi"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      Nairobi is a concrete jungle like no other, being the only
                      national park like it in the world and a real embodiment
                      of the human-wildlife conflicts that challenge many
                      African communities who must learn to cohabitate with
                      wildlife on their doorstep.
                    </p>
                    <br />
                    <p>
                      Nairobi National Park is one of the best places in Africa
                      to see rhinos. There is also a healthy population of lion,
                      leopard, cheetah, and plains game like giraffe and
                      antelope. Other attractions include the African Heritage
                      House, the Giraffe Center, Sheldrick’s Elephant Orphanage,
                      a visit to the African market for exquisite pieces of
                      African artefacts from the continent, there are many
                      Maasai market where you can shop for local crafts and
                      trinkets. There&apos;s also a budding restaurant scene to
                      explore, from roadside food stalls to local nyama-choma
                      (barbecue joints) to five-star dining restaurants.
                      There&apos;s a vibrant entertainment scene ranging from
                      local bars to nightclubs, live music and jazz spots. There
                      are few art galleries that you can explore and very funky
                      artistic events including Gondwana - East Africa&apos;s
                      premier
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>
            </div>
          </SwiperSlide> */}

          {/* <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[600px] sm:!w-[800px] md:!w-[900px] lg:!w-[900px] flex gap-3">
            <div className="xsmall:w-[50%] w-[55%] sm:w-[60%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-40">
              <Carousel
                images={["/images/home/romantic-trip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <h1 className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Romantic mood
              </h1>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  The best memories are the ones you create with your perfect
                  partner. We created curated trip meant for you to create those
                  moments.
                </p>
                <Link href="/trip?tag=romantic">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Naivasha button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            <div className="xsmall:w-[50%] w-[45%] sm:w-[40%] h-full flex justify-between flex-wrap">
              <div className="w-[100%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/naivasha.webp"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Naivasha
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    The vibrant town of Naivasha sits on the northeast side of
                    the lake and the rest of the lake is surrounded by small
                    farms, tourist lodges, and even an active geothermal
                    project.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("naivasha-stays");
                      Mixpanel.track("Show more about Naivasha button clicked");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "naivasha-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Naivasha"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      Most visitors enjoy water activities on the lake, bird
                      watching, and visits to the local flower farms; a round of
                      golf at Green Park and tea at Elsamere with their resident
                      colobus monkeys.
                    </p>
                    <br />
                    <p>
                      At an elevation of 1,883 m (6,181 ft), Lake Naivasha is
                      the highest elevation lake in the Great Rift Valley,
                      though it is fairly shallow with depths ranging from 6 -
                      30 m (20 - 100 ft). The lake itself is 139 km2 (53 mi2) in
                      size and part of an ancient pleistocene lake and volcanic
                      system. The freshwater lake is home to many species of
                      fish, birds, and a decent population of hippopotamus. It
                      has over the years been susceptible to invasive species
                      such as crayfish, carp and hyacinth.
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>

              
            </div>
          </SwiperSlide> */}

          {/* <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[600px] sm:!w-[800px] md:!w-[900px] lg:!w-[900px] flex gap-3">
            <div className="xsmall:w-[50%] w-[55%] sm:w-[60%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-40">
              <Carousel
                images={["/images/home/roadtrip.webp"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Spend time on the road
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  Kenya is a country to has a lot to offer. We created curated
                  trips meant for your explore the country and enjoy your time.
                </p>

                <Link href="/trip?tag=road_trip">
                  <a>
                    <div
                      onClick={() => {
                        Mixpanel.track(
                          "View curated trips for Maasai Mara button clicked"
                        );
                      }}
                      className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                    >
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            <div className="xsmall:w-[50%] w-[45%] sm:w-[40%] h-full flex justify-between flex-wrap">
              <div className="w-[97%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/massai-mara.webp"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Maasai Mara
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    Named in honour of the Maasai people who call this corner of
                    Africa home. Spanning 1510 km2 (583 mi2) the Mara ecosystem
                    boasts of quality of wildlife viewing. It is haven for
                    photography and every year visitors come to capture the
                    spectacular wildlife. The reserve and its conservancies
                    contain some of the highest densities of predators in Africa
                    peaking during the seasonal wildebeest migration.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("massai-mara-stays");
                      Mixpanel.track(
                        "Show more about Maasai Mara button clicked"
                      );
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "massai-mara-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Maasai Mara"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      It overlooks sweeping savannas, riverine woodlands, and
                      forests on a deceptively flat landscape that extends
                      eastwards towards the Sekenani Hills and northwards
                      towards the Aitong Hills. The Mara is in essence the
                      northern extension of the Mara-Serengeti ecosystem and
                      plays host to one of nature&apos;s greatest phenomenons,
                      the Great Wildebeest Migration. Maasai Mara is
                      world-renowned for itss exceptional populations of lion,
                      leopard, cheetah, buffalo, black rhino, and a thriving
                      elephant population. Around July of each year, the Great
                      Migration arrives in the Maasai Mara National Reserve for
                      its annual four-month stay.
                    </p>
                    <br />
                    <p>
                      Maasai Mara is a game reserve ran by the county government
                      of Narok. Surrounding the reserve are many conservancies
                      that are privately owned and offer more exclusive
                      activities such as night game drives and bush walks which
                      are not allowed in the reserve. This is something to
                      consider when choosing your lodge.
                    </p>
                    <br />
                    <p>
                      The conservancy approach is widely seen as the way forward
                      for wildlife conservation and eco-tourism in Kenya because
                      it not only secures vital space for wildlife but includes
                      the local population as custodians of their national
                      heritage. This has been vital not only for the
                      conservation of the whole greater Mara but also for
                      wildlife corridors and the prosperity of many hundreds of
                      Maasai families. Nearly forty tourist camps contribute to
                      employment amongst the communities and provide a presence,
                      alongside Maasai anti-poaching units, for the protection
                      of the wildlife.
                    </p>
                    <br />
                    <h1 className="text-lg font-bold mb-1">
                      The Wildebeest Migration
                    </h1>
                    <p>
                      The Great Wildebeest Migration is one of the Seven Natural
                      Wonders of the World and sees around two million animals
                      (including wildebeest, zebras and gazelles) make the
                      annual pilgrimage between the Maasai Mara and the
                      Serengeti. It is not as straightforward as a south to
                      north and return movement, but dictated by the drive to
                      the calving grounds in the southern Serengeti and rainfall
                      patterns throughout the ecosystem as the animals seek
                      fresh grazing grasses and standing water.
                    </p>
                    <br />

                    <h1 className="text-lg font-bold mb-1">Mara Triangle</h1>
                    <p>
                      West of the Mara River, beneath the Oloololo escarpment
                      and bordered by Tanzania to the south, lies the jewel of
                      this great reserve: the Mara Triangle. Not only is this
                      the most productive part of the entire Serengeti-Mara
                      ecosystem in terms of grass nutrition, but it is also
                      spectacularly scenic. The huge grassy plains are dotted
                      with widely spaced Balanites trees that give the landscape
                      an almost manicured look which, together with the
                      steep-sided escarpment and broad Mara River, provides a
                      breath-taking backdrop for wildlife photographers.
                    </p>

                    <br />

                    <p>
                      The Mara Triangle has been most efficiently managed by the
                      Mara Conservancy for the past 15 years – evidenced in the
                      guides’ discipline, successful anti-poaching efforts, and
                      impressive road infrastructure. For much of the year, the
                      Mara Triangle has the lowest density of visitors in the
                      Greater Maasai Mara, with just two lodges within its
                      perimeters and a few on the northern border.
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>

              
            </div>
          </SwiperSlide> */}

          {/* <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-button-prev rounded-full border flex items-center justify-center">
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
            <div className="cursor-pointer h-8 w-8 swiper-button-next rounded-full border flex items-center justify-center">
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
          </div> */}

          <div
            className={
              " absolute clear-both hidden md:flex h-12 w-12 z-30 left-1 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer clear-both h-8 w-8 swiper-button-prev rounded-full border-2 flex items-center justify-center">
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
              " absolute hidden md:flex h-12 w-12 z-30 right-1 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-button-next rounded-full border-2 flex items-center justify-center">
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

      <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Find what suits you</span>
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
            <div className="cursor-pointer h-8 w-8 swiper-room-button-prev rounded-full border flex items-center justify-center">
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
