import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { useRouter } from "next/router";

function Tags(props) {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const settings = {
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: navigationNextRef.current,
      prevEl: navigationPrevRef.current,
    },
  };

  const router = useRouter();

  const [swiper, setSwiper] = useState(null);

  const [isEndOfSlide, setIsEndOfSlide] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);
  return (
    <div className="!w-[95%] sm:!w-[90%] lg:!w-[90%] h-full flex items-center">
      <div
        ref={navigationPrevRef}
        className={
          "cursor-pointer h-5 w-5 rounded-full border flex items-center justify-center "
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
      <Swiper
        {...settings}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        onSwiper={(swiper) => setSwiper(swiper)}
        onSlideChange={(swiper) => {
          setIsEndOfSlide(swiper.isEnd);
          setSwiperIndex(swiper.realIndex);
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={"!w-full !h-full relative "}
      >
        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "honeymoon",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="emojione-monotone:wedding" />
            <div className="text-sm">Honeymoon</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "honeymoon" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "game",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="icon-park-outline:game-emoji" />
            <div className="text-sm">Game</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "game" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "family",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="carbon:pedestrian-family" />
            <div className="text-sm">Family</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "family" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "camping",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="carbon:campsite" />
            <div className="text-sm">Camping</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "camping" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "hiking",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="la:hiking" />
            <div className="text-sm">Hiking</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "hiking" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "couples",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon
              className="w-7 h-7"
              icon="emojione-monotone:couple-with-heart"
            />
            <div className="text-sm">Couples</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "couples" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "friends",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="la:user-friends" />
            <div className="text-sm">Friends</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "friends" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "desert",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="uil:desert" />
            <div className="text-sm">Desert</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "desert" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "surfing",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="ic:round-surfing" />
            <div className="text-sm">Surfing</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "surfing" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "tropical",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="bi:tropical-storm" />
            <div className="text-sm">Tropical</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "tropical" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "mountain",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="carbon:mountain" />
            <div className="text-sm">Mountain</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "mountain" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "treehouse",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="cib:treehouse" />
            <div className="text-sm">Tree house</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "treehouse" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "boat",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon
              className="w-7 h-7"
              icon="material-symbols:directions-boat-outline-sharp"
            />
            <div className="text-sm">Boat</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "boat" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "beach",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="cil:beach-access" />
            <div className="text-sm">Beach</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "beach" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "creative_space",
              },
            });
          }}
          className="!w-auto flex cursor-pointer justify-center"
        >
          <div className="px-4 border-b-2 flex flex-col items-center justify-center border-transparent">
            <Icon className="w-7 h-7" icon="fluent:color-24-regular" />
            <div className="text-sm">Creative space</div>
            <div
              className={
                "w-[50%] h-1 mt-0.5 " +
                (router.query.tag === "creative space" ? "bg-black" : "")
              }
            ></div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div
        ref={navigationNextRef}
        className={
          "cursor-pointer h-5 w-5 rounded-full border flex items-center justify-center "
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
      </div>
    </div>
  );
}

Tags.propTypes = {};

export default Tags;
