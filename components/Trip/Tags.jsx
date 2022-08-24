// Import Swiper React components
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

const Tags = () => {
  const settings = {
    spaceBetween: 10,
    navigation: {
      nextEl: ".slideNext-btn",
      prevEl: ".slidePrev-btn",
    },
  };
  const router = useRouter();
  return (
    <div className="w-[100%] relative sm:!w-[80%] lg:!w-[80%] h-full flex items-center">
      <Swiper
        {...settings}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
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
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="emojione-monotone:wedding" />
          <div className="text-sm">Honeymoon</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "honeymoon" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>
        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "cultural",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="carbon:agriculture-analytics" />
          <div className="text-sm">Cultural</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "cultural" ? "bg-black" : "")
            }
          ></div>
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
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="icon-park-outline:game-emoji" />
          <div className="text-sm">Game</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "game" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "weekend_getaway",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="bi:calendar-week" />
          <div className="text-sm">Weekend getaway</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "weekend_getaway" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>
        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "road_trip",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="bx:trip" />
          <div className="text-sm">Road trip</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "road_trip" ? "bg-black" : "")
            }
          ></div>
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
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="bx:trip" />
          <div className="text-sm">Hiking</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "hiking" ? "bg-black" : "")
            }
          ></div>
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
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="cil:beach-access" />
          <div className="text-sm">Beach</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "beach" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "romantic_getaway",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="icon-park:oval-love" />
          <div className="text-sm">Romantic getaway</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "romantic_getaway" ? "bg-black" : "")
            }
          ></div>
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
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="carbon:campsite" />
          <div className="text-sm">Camping</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "camping" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "active",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="icon-park-twotone:gymnastics" />
          <div className="text-sm">Active</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "active" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "cylcing",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="bx:cycling" />
          <div className="text-sm">Cylcing</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "cylcing" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "lake",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="fa6-solid:water" />
          <div className="text-sm">Lake</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "lake" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>

        <SwiperSlide
          onClick={() => {
            router.push({
              query: {
                ...router.query,
                tag: "walking",
              },
            });
          }}
          className="!w-fit flex cursor-pointer justify-center px-4 border-b-2 flex-col items-center border-transparent"
        >
          <Icon className="w-7 h-7" icon="healthicons:exercise-walking" />
          <div className="text-sm">Walking</div>
          <div
            className={
              "w-[50%] h-1 mt-0.5 " +
              (router.query.tag === "walking" ? "bg-black" : "")
            }
          ></div>
        </SwiperSlide>
      </Swiper>
      <div
        className={
          "hidden absolute h-12 w-12 -left-14 md:flex items-center justify-end "
        }
      >
        <div className="cursor-pointer h-8 w-8 slidePrev-btn rounded-full border flex items-center justify-center">
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
      </div>

      <div
        className={"hidden absolute h-12 w-12 -right-14 md:flex items-center "}
      >
        <div className="cursor-pointer h-8 w-8 slideNext-btn rounded-full border flex items-center justify-center">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Tags;
