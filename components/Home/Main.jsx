import React, { useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Main.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Mousewheel } from "swiper";
import SwiperCore from "swiper";
import { useDispatch, useSelector } from "react-redux";

import "swiper/css/effect-creative";
import "swiper/css";
import Image from "next/image";
import Carousel from "../ui/Carousel";
import { useRouter } from "next/router";
import Dialogue from "./Dialogue";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Link from "next/link";
import Button from "../ui/Button";
import { Icon } from "@iconify/react";
import Price from "../Stay/Price";
import PopoverBox from "../ui/Popover";

import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import axios from "axios";
import Cookies from "js-cookie";
import Slider from "react-slick";

SwiperCore.use([Navigation]);

import "swiper/css/pagination";

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
    isEndOfReviewSlide: false,
    isBeginningOfReviewSlide: false,
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

  const reviewSettings = {
    spaceBetween: 0,
    slidesPerView: 1,
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-review-button-next",
      prevEl: ".swiper-review-button-prev",
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

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const options = [
    {
      icon: "carbon:pedestrian-family",
      title: "Family",
      href: "/trip?tag=family",
    },

    {
      icon: "icon-park-outline:oval-love-two",
      title: "Romantic",
      href: "/trip?tag=romantic",
    },

    {
      icon: "akar-icons:people-group",
      title: "Groups",
      href: "/trip?tag=groups",
    },

    {
      icon: "fluent:beach-16-regular",
      title: "Beach",
      href: "/trip?tag=beach",
    },

    {
      icon: "tabler:brand-safari",
      title: "Unconventional safaris",
      href: "/trip?tag=unconventional_safaris",
    },

    {
      icon: "la:hiking",
      title: "Walking/Hiking",
      href: "/trip?tag=walking_hiking",
    },

    {
      icon: "bx:trip",
      title: "Road trip",
      href: "/trip?tag=road_trip",
    },

    {
      icon: "emojione-monotone:national-park",
      title: "Park & conservancies",
      href: "/trip?tag=park_conservancies",
    },

    {
      icon: "icon-park-outline:green-new-energy",
      title: "Sustainable safari",
      href: "/trip?tag=sustainable",
    },

    {
      icon: "majesticons:community-line",
      title: "Community owned",
      href: "/trip?tag=community_owned",
    },

    {
      icon: "fontisto:night-clear",
      title: "Night game drives",
      href: "/trip?tag=night_game_drives",
    },

    {
      icon: "cil:diamond",
      title: "Luxury",
      href: "/trip?tag=luxury",
    },

    {
      icon: "tabler:report-money",
      title: "Budget",
      href: "/trip?tag=budget",
    },

    {
      icon: "material-symbols:price-change-outline-sharp",
      title: "Mid-range",
      href: "/trip?tag=mid_range",
    },

    {
      icon: "iconoir:sea-and-sun",
      title: "Lakes",
      href: "/trip?tag=lake",
    },
  ];

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (process.browser) {
      window.open(
        "https://winda-guide.s3.eu-west-2.amazonaws.com/pdf/east.pdf",
        "_blank"
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Field is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-ebook-email/`,
        {
          email: values.email,
        }
      );
      // download pdf file
      await handleDownload();
      setLoading(false);
    },
  });

  const slider = React.useRef(null);

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div>
        <div
          className={
            " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center "
          }
          onClick={onClick}
        >
          <div className="cursor-pointer h-11 w-11 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
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

        <div
          onClick={onClick}
          className="flex md:hidden absolute cursor-pointer mt-2 left-[50%] items-center gap-1"
        >
          <h1 className="font-bold">Next </h1>
          <Icon
            className="w-6 h-6 mt-[1px]"
            icon="material-symbols:arrow-right-alt-rounded"
          />
        </div>
      </div>
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div>
        <div
          className={
            " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end "
          }
          onClick={onClick}
        >
          <div className="cursor-pointer h-11 w-11 rounded-full bg-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
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
          onClick={onClick}
          className="flex md:hidden cursor-pointer mr-6 mt-2 top-full absolute right-[50%] items-center gap-1"
        >
          <Icon
            className="w-6 h-6 mt-[1px] rotate-180"
            icon="material-symbols:arrow-right-alt-rounded"
          />
          <h1 className="font-bold">Prev </h1>
        </div>
      </div>
    );
  }

  const testSettings = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-full mt-6 md:mt-0">
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

      <div className="flex flex-col sm:px-2 gap-4 mb-12 md:mb-32">
        <div className="w-full h-[300px] relative hidden sm:flex bg-red-700 bg-opacity-10 home-clip justify-center"></div>
        <div className="w-full sm:w-[95%] md:w-[80%] lg:w-[80%] sm:absolute md:left-[10%] flex flex-col sm:flex-row justify-center mx-auto smgap-6 md:gap-20 items-center">
          <div className="w-[100%] sm:w-[50%] md:w-[270px] h-[300px] md:h-[350px] relative bg-white shadow-xl md:ml-6">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/home/pdf.webp"
              className="h-full w-full object-cover"
              priority
            ></Image>
          </div>

          <div className="flex border-b flex-col bg-gray-100 sm:bg-transparent px-3 py-4 md:py-0 md:px-0 w-full sm:w-[50%] md:w-auto items-center gap-6 md:mt-8">
            <h1 className="font-black font-SourceSans text-center text-2xl">
              Get Your Guide to Travelling Within East Africa
            </h1>

            <Button onClick={() => {
                  handleDownload();
                }} className="!bg-red-500 !py-2.5 !w-[90vw] sm:!w-[250px] font-bold !font-SourceSans uppercase">
                  Download Free PDF
            </Button>

            {/* <PopoverBox
              panelClassName="bg-white rounded-xl after:!left-[60%] md:after:!left-[40%] after:!border-b-white tooltip !w-full md:!w-[440px] left-0 sm:!w-auto sm:!-left-[200px] md:!-left-[100px] shadow-md mt-2 w-[425px] !p-4"
              btnPopover={
                <Button className="!bg-red-500 !py-2.5 !w-[90vw] sm:!w-[250px] font-bold !font-SourceSans uppercase">
                  Download Free PDF
                </Button>
              }
            >
              <div className="w-full relative">
                <Input
                  name="email"
                  type="text"
                  placeholder="Your email"
                  label="Add in an email that’s verifiable to download the link"
                  className={
                    "w-full placeholder:text-gray-500 !h-full placeholder:text-sm "
                  }
                  labelClassName="!text-base !font-SourceSans !font-semibold"
                  errorStyle={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  inputClassName="!text-sm "
                  {...formik.getFieldProps("email")}
                ></Input>
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-center mt-4">
                <Button
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  disabled={loading}
                  className="!bg-red-500 flex gap-2 !py-2.5 font-bold !font-SourceSans uppercase"
                >
                  <span className="font-bold">Download Now</span>
                  {loading && (
                    <LoadingSpinerChase
                      width={14}
                      height={14}
                    ></LoadingSpinerChase>
                  )}
                </Button>
              </div>
            </PopoverBox> */}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col px-2 gap-4">
        <h1 className="font-black text-2xl md:text-3xl font-OpenSans ml-2 tracking-wide">
          Featured Trips
        </h1>

        <div className="mb-8 px-2">
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

              const totalPrice = () => {
                return userIsFromKenya
                  ? trip.price
                  : trip.price_non_resident || trip.price;
              };
              return (
                <SwiperSlide key={index} className="!w-[320px] cursor-pointer">
                  <Link href={`/trip/${trip.slug}`}>
                    <a
                      onClick={() => {
                        Mixpanel.track("User opened a trip", {
                          name_of_trip: trip.name,
                        });
                      }}
                      className="w-full cursor-pointer"
                    >
                      <div className="!h-[220px] relative w-full">
                        <Carousel
                          images={[images[0]]}
                          imageClass="rounded-md"
                        ></Carousel>
                      </div>

                      <div className="mt-1 px-2 py-1">
                        <h1 className="font-bold text-lg truncate">
                          {trip.name}
                        </h1>
                        <div className="absolute cursor-pointer top-1.5 left-1.5 w-fit flex items-center gap-2 font-bold text-sm">
                          <div className="text-sm font-bold bg-white rounded-md px-1 py-[2px]">
                            {trip.area_covered.split(",")[0]}
                          </div>
                          {trip.valentine_offer && (
                            <div className="text-sm font-bold flex gap-1 items-center bg-white rounded-md py-[2px] px-1">
                              <span>Valentine offer</span>
                              <Icon
                                icon="ps:lovedsgn"
                                className="text-red-600"
                              />
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-700 flex flex-wrap gap-0.5 items-center">
                          <div className="text-xl mr-0.5 font-bold flex gap-1">
                            {trip.old_price && (
                              <Price
                                stayPrice={trip.old_price}
                                className="!text-sm line-through self-end mb-0.5 text-red-500"
                              ></Price>
                            )}
                            <Price
                              stayPrice={totalPrice()}
                              className="!text-lg"
                            ></Price>
                          </div>
                          <div className="font-bold">
                            /per person/{trip.total_number_of_days}{" "}
                            {trip.total_number_of_days > 1 ? "days" : "day"}
                          </div>
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
      </div> */}

      {/* <div className="my-6">
        <h1 className="font-black text-2xl ml-2 text-center">
          It&apos;s as easy as it gets
        </h1>

        <div className="py-4 mt-1 px-4 flex items-center gap-4 flex-wrap justify-between">
          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon
              icon="zondicons:explore"
              className="w-12 h-12 icon-gradient"
            />

            <dniv className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-lg">Explore</h1>
              <p className="text-sm text-gray-600 text-center">
                Explore our curated trips and find what you like
              </p>
            </dniv>
          </div>

          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon icon="bi:calendar-check-fill" className="w-12 h-12" />
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-lg">Availability</h1>
              <p className="text-sm text-gray-600 text-center">
                Add the number of people and dates to check availability
              </p>
            </div>
          </div>

          <div className="flex flex-col w-[31%] items-center gap-3">
            <Icon icon="fluent:payment-16-filled" className="w-12 h-12" />
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-bold text-lg">Book</h1>
              <p className="text-sm text-gray-600 text-center">
                Book your trip
              </p>
            </div>
          </div>
        </div>
      </div> */}

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

      {/* <h1 className="font-black text-2xl md:text-3xl font-OpenSans ml-4 tracking-wide mt-6 mb-4">
        <span className="text-slate-800">Explore on</span>{" "}
        <span className="text-red-600">winda</span>
      </h1>

      <div className="px-4 flex flex-wrap items-center gap-4 md:gap-6">
        {options.map((option, index) => (
          <Link key={index} href={option.href}>
            <a className="explore-card">
              <Icon icon={option.icon} className={"w-7 h-7 text-red-600"} />

              <h1 className="font-bold text-center">{option.title}</h1>
            </a>
          </Link>
        ))}
      </div> */}
      <div className="md:px-8 mt-12">
        <h1 className="text-center font-bold text-2xl md:text-4xl mb-5 font-SourceSans">
          What our customers are saying about us
        </h1>

        <Slider {...testSettings}>
          <div className="!flex border-b px-2 sm:px-4 md:px-0 md:border-none pb-2 items-center justify-center">
            <div className="md:w-[80%] flex justify-center items-center flex-col gap-3">
              <h1 className="text-center text-lg md:text-xl font-Merriweather">
                <q>
                  The service and the booking system were great. Great
                  communications and the campsite was excellent!
                </q>
              </h1>

              <h1 className="font-bold text-center flex items-center justify-center">
                <div className="w-[20px] h-[1.5px] bg-gray-600 mr-1"></div>
                <span className="text-red-600">Kai</span>, Australia{" "}
                <div className="ml-2">
                  <Icon
                    className="w-6 h-6"
                    icon="emojione-v1:flag-for-australia"
                  />
                </div>
              </h1>
            </div>
          </div>
          <div className="!flex border-b px-2 sm:px-4 md:px-0 md:border-none pb-2 items-center justify-center">
            <div className="md:w-[80%] flex justify-center items-center flex-col gap-3">
              <h1 className="text-center text-lg md:text-xl font-Merriweather">
                <q>
                  Winda provided several amazing options that fit all of our
                  needs, including pricing for the trip end to end, took care of
                  booking, helped us arrange transport, and even contacted the
                  lodge
                </q>
              </h1>

              <h1 className="font-bold text-center flex items-center justify-center">
                <div className="w-[20px] h-[1.5px] bg-gray-600 mr-1"></div>
                <span className="text-red-600">Thea</span>, United States{" "}
                <div className="ml-2">
                  <Icon className="w-6 h-6" icon="twemoji:flag-united-states" />
                </div>
              </h1>
            </div>
          </div>

          <div className="!flex border-b px-2 sm:px-4 md:px-0 md:border-none pb-2 items-center justify-center">
            <div className="md:w-[80%] flex justify-center items-center flex-col gap-3">
              <h1 className="text-center text-lg md:text-xl font-Merriweather">
                <q>
                  Winda’s service communication and support with bookings was
                  excellent!
                </q>
              </h1>

              <h1 className="font-bold text-center flex items-center justify-center">
                <div className="w-[20px] h-[1.5px] bg-gray-600 mr-1"></div>
                <span className="text-red-600">Sue</span>, Kenya{" "}
                <div className="ml-2">
                  <Icon className="w-6 h-6" icon="twemoji:flag-kenya" />
                </div>
              </h1>
            </div>
          </div>

          <div className="!flex border-b px-2 sm:px-4 md:px-0 md:border-none pb-2 items-center justify-center">
            <div className="md:w-[80%] flex justify-center items-center flex-col gap-3">
              <h1 className="text-center text-lg md:text-xl font-Merriweather">
                <q>
                  It was our first time planning such a trip. It was difficult
                  to find a french travel agency that were affordable and
                  flexible. We managed to find winda which planned a trip in our
                  budget and they were very flexible.
                </q>
              </h1>

              <h1 className="font-bold text-center flex items-center justify-center">
                <div className="w-[20px] h-[1.5px] bg-gray-600 mr-1"></div>
                <span className="text-red-600">Caroline</span>, France{" "}
                <div className="ml-2">
                  <Icon
                    className="w-6 h-6"
                    icon="twemoji:flag-for-flag-france"
                  />
                </div>
              </h1>
            </div>
          </div>
        </Slider>
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
