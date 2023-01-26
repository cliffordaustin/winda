import React from "react";
import PropTypes from "prop-types";
import Header from "../../../components/Events/Header";
import Image from "next/image";
import Button from "../../../components/ui/Button";

import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { FreeMode, Navigation, Thumbs } from "swiper";
import SwiperCore from "swiper";
SwiperCore.use([Navigation]);

import "swiper/css/effect-creative";
import "swiper/css";
import Carousel from "../../../components/ui/Carousel";
import Link from "next/link";

function EventKaleidoscope({ lodges }) {
  return (
    <div>
      <div
        className="px-0 md:px-8 md:mt-4 rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md"
        offset={0}
        speed={0.2}
      >
        <Header></Header>
      </div>

      <div className="h-full mt-16 mb-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-SourceSans text-2xl md:text-4xl font-black">
            Pick a Lodge That Suits You
          </h1>
          <div className="h-[15px] w-[250px] -mt-2 -z-10 bg-[#04BDED]"></div>
        </div>
        <div className="flex gap-4 mt-12 px-2 md:px-8">
          <Swiper
            spaceBetween={20}
            slidesPerView="auto"
            freeMode={{ enabled: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="!relative"
          >
            {lodges.map((lodge, index) => {
              const sortedImages = lodge.stay_images.sort(
                (x, y) => y.main - x.main
              );

              const images = sortedImages.map((image) => {
                return image.image;
              });

              return (
                <SwiperSlide key={index} className="!w-[325px]">
                  <div className="border rounded-2xl">
                    <div className="relative w-full h-[220px]">
                      <Carousel
                        images={[images[0]]}
                        imageClass="!rounded-t-2xl"
                      ></Carousel>
                    </div>
                    <div className="py-2 px-2">
                      <h1 className="uppercase text-gray-500 text-xs">
                        {lodge.location}
                      </h1>
                      <h1 className="font-bold font-SourceSans text-xl truncate">
                        {lodge.name}
                      </h1>

                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            width="1em"
                            height="1em"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 36 36"
                          >
                            <path
                              fill="currentColor"
                              d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                            />
                            <path
                              fill="currentColor"
                              d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                            />
                            <path
                              fill="currentColor"
                              d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                            />
                            <path
                              fill="currentColor"
                              d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                            />
                            <circle
                              cx="17.87"
                              cy="13.45"
                              r="4.47"
                              fill="currentColor"
                            />
                            <path
                              fill="currentColor"
                              d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                            />
                            <path fill="none" d="M0 0h36v36H0z" />
                          </svg>
                          <span className="text-sm">
                            {lodge.capacity} Guests
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            width="1em"
                            height="1em"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                            />
                          </svg>

                          <span className="text-sm">{lodge.rooms} rm</span>
                        </div>
                      </div>

                      <Link href={`/stays/${lodge.slug}`}>
                        <a>
                          <Button className="!rounded-tl-2xl !rounded-tr-md !rounded-br-2xl !rounded-bl-md mt-2 h-[40px] !flex gap-1 !px-1 items-center justify-center w-full !bg-[#D31567]">
                            <span className="text-white font-bold text-sm">
                              Book Now
                            </span>
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

EventKaleidoscope.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const lodges = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/?is_kaleidoscope_event=true`
    );

    return {
      props: {
        lodges: lodges.data.results,
      },
    };
  } catch (error) {
    return {
      props: {
        lodges: [],
      },
    };
  }
}

export default EventKaleidoscope;
