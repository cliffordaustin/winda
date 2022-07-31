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
      <h1 className="font-bold text-3xl font-OpenSans text-center">
        <span className="text-gray-600">Explore on</span>{" "}
        <span className="">winda</span>
      </h1>
      <div className="text-center mt-2">
        Take a look into what winda has to offer you.
      </div>
      <div className="px-2 sm:px-4 mt-6">
        <Swiper
          {...settings}
          modules={[FreeMode, Navigation, Mousewheel, Thumbs]}
          className=""
        >
          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/cultural-trip.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Explore the culture
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  Kenya has a vast and rich culture, so we created trips
                  dedicated to exploring it.
                </p>
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/trip",
                      query: {
                        tag: "cultural",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View curated trips
                </div>
              </div>
            </div>
            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="w-[48%] relative rounded-2xl h-[49%] p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Stays in <span>Nairobi</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Nairobi is the capital of Kenya and the largest city in the
                  country. It is full of beautiful, natural and cultural
                  landmarks, and is a popular tourist destination. The beauty is
                  reflected in its stays.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("nairobi-stays");
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
                title="Stays in Nairobi"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
              <div className="w-[48%] h-[49%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/nairobi.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Nairobi
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/stays",
                        query: {
                          search: "Nairobi",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View stays
                  </div>
                </div>
              </div>

              <div className="w-[48%] h-[49%] relative self-end before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/nairobi-experience.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Nairobi
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/experiences",
                        query: {
                          search: "Nairobi",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View experiences
                  </div>
                </div>
              </div>

              <div className="relative w-[48%] rounded-2xl h-[49%] self-end p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Experiences in <span>Nairobi</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Nobis, inventore maxime adipisci culpa delectus accusamus
                  ipsam quas eligendi velit. culpa delectus accusamus ipsam
                  quas.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("nairobi-experiences");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={selectedLocation === "nairobi-experiences"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Experiences in Nairobi"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/romantic-trip.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Romantic mood
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  The best memories are the ones you create with your perfect
                  partner. We created curated trip meant for you to create those
                  moments.
                </p>
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/trip",
                      query: {
                        tag: "romantic_getaway",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View curated trips
                </div>
              </div>
            </div>
            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="relative w-[48%] rounded-2xl h-[48%] p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Stays in <span>Nakuru</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Nobis, inventore maxime adipisci culpa delectus accusamus
                  ipsam quas eligendi velit impedit. Inventore maxime adipisci
                  culpa.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("nakuru-stays");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={selectedLocation === "nakuru-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Stays in Nakuru"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
              <div className="w-[48%] h-[48%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/nakuru.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Nakuru
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/stays",
                        query: {
                          search: "Nakuru",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View stays
                  </div>
                </div>
              </div>

              <div className="w-[48%] self-end h-[48%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/nakuru-experience.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Nakuru
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/experiences",
                        query: {
                          search: "Nakuru",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View experiences
                  </div>
                </div>
              </div>

              <div className="relative w-[48%] self-end rounded-2xl h-[48%] p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Experiences in <span>Nakuru</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                  inventore maxime adipisci culpa delectus accusamus ipsam quas
                  eligendi velit impedit quo. culpa delectus accusamus ipsam
                  quas.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("nakuru-experiences");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={selectedLocation === "nakuru-experiences"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Experiences in Nakuru"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/roadtrip.jpg"]}
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
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/tag",
                      query: {
                        tag: "road_trip",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View curated trips
                </div>
              </div>
            </div>
            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="relative w-[48%] rounded-2xl h-[48%] p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Stays in <span>Narok</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Nobis, inventore maxime adipisci culpa delectus accusamus
                  ipsam quas eligendi velit impedit quo. Inventore maxime
                  adipisci.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("narok-stays");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={selectedLocation === "narok-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Stays in Narok"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
              <div className="w-[48%] h-[48%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/stay-maasai-mara.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Narok
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/stays",
                        query: {
                          search: "Narok",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View stays
                  </div>
                </div>
              </div>

              <div className="w-[48%] self-end h-[48%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                <Carousel
                  images={["/images/home/maasai-mara-loita.JPG"]}
                  imageClass="rounded-2xl"
                ></Carousel>

                <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                  Narok
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/experiences",
                        query: {
                          search: "Narok",
                        },
                      });
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    View experiences
                  </div>
                </div>
              </div>

              <div className="relative w-[48%] self-end rounded-2xl h-[48%] p-2 !bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900">
                <div className="font-bold text-white font-Merriweather">
                  Experiences in <span>Narok</span>
                </div>
                <p className="mt-1 text-sm text-white">
                  Ipsum dolor sit amet consectetur adipisicing elit. Nobis,
                  inventore maxime adipisci culpa delectus accusamus ipsam quas
                  eligendi velit impedit quo expedita hic id.
                </p>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <div
                    onClick={() => {
                      setSelectedLocation("narok-experiences");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={selectedLocation === "narok-experiences"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Experiences in Narok"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Iste corrupti doloremque a ad, error distinctio optio
                    dolorem quo ratione quis qui animi eum pariatur nulla?
                    Quibusdam ratione facere ducimus fugit! A voluptas, placeat
                    nulla fugiat mollitia ducimus culpa molestias velit est quis
                    laudantium tempore vitae sequi facilis odio id quidem sunt.
                    Praesentium porro dolorem nobis. Quam architecto harum
                    distinctio esse? Dicta excepturi labore cupiditate atque
                    perspiciatis repellendus quam aperiam maiores. Non
                    consectetur iusto voluptatibus deleniti at modi adipisci a!
                    Delectus quas assumenda pariatur sit! Quo animi adipisci
                    fugiat cupiditate magnam. Suscipit molestiae dignissimos,
                    ipsum quidem sit nam laboriosam nisi consequuntur vel sunt
                    non libero obcaecati soluta perspiciatis eligendi debitis
                    accusamus atque beatae necessitatibus ratione rerum ipsa
                    voluptatibus odio quaerat? Alias. Odit suscipit molestias
                    consequatur optio! Tempora quibusdam quidem, illo officiis
                    fugiat magnam asperiores iure fuga sint eos exercitationem
                    minus nesciunt accusamus tempore deserunt culpa tenetur rem.
                    Quibusdam dolorum placeat excepturi! Commodi cum officiis
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
          </SwiperSlide>
        </Swiper>
      </div>

      <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Find stays that suits you</span>
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
                images={["/images/home/lodging.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Lodge
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        type_of_stay: "LODGE",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Campsites
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        type_of_stay: "CAMPSITE",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite-tented.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Tented camps
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        type_of_stay: "TENTED CAMP",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/uniquespace.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Unique spaces
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        type_of_stay: "UNIQUE SPACE",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/budget.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Budget
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        pricing_type: "REASONABLE",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/mid-range.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Mid-Range
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        pricing_type: "MID-RANGE",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/luxury.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Luxurious
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        pricing_type: "HIGH-END",
                      },
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

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

      <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Explore all our services</span>
      </h1>

      <div className="px-2">
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
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/curatedtrips.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Curated trips
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/trip",
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View curated trips
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/stays.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Stays
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View stays
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/experiences.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Experiences
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/experiences",
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View experiences
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/transport.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Transports
              </div>

              <div className="absolute bottom-2 z-30 flex flex-col left-2">
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/transport",
                    });
                  }}
                  className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                >
                  View transports
                </div>
              </div>
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
      </div>

      {/* <div className="flex gap-4 justify-between items-center px-4 sm:px-8 md:px-12">
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
      </div> */}
    </div>
  );
}

export default Main;
