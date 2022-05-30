import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useRouter } from "next/router";

import { wrapper } from "../../../redux/store";
import styles from "../../../styles/StyledLink.module.css";
import UserDropdown from "../../../components/Home/UserDropdown";
import getTokenFromReq from "../../../lib/getTokenFromReq";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import SearchButtonClose from "../../../components/Home/SearchButtonClose";
import DatePicker from "../../../components/ui/DatePicker";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import AllTrips from "../../../components/Trip/Trips";
import Cookies from "js-cookie";

const Trips = ({ userProfile }) => {
  const [state, setState] = useState({});

  const [showDropdown, changeShowDropdown] = useState(false);

  const [currentNavState, setCurrentNavState] = useState(1);

  const dispatch = useDispatch();

  const [location, setLocation] = useState("");

  const [autoComplete, setAutoComplete] = useState([]);

  const router = useRouter();

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoComplete(response.data.features);
      });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (autoComplete.length > 0) {
        setLocation(autoComplete[0].place_name);

        setAutoComplete([]);
      }
    }
  };

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

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [allowSlideNext, setAllowSlideNext] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);

  const [date, setDate] = useState("");

  const [showDate, setShowDate] = useState(false);

  const [travellers, setTravellers] = useState(1);

  const priceConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/kes",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.USD,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    priceConversionRate();
  });

  const [trips, setTrips] = useState([]);

  const getItemsInTrip = async () => {
    if (Cookies.get("token")) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setTrips(data[0] || []);
    }
  };

  useEffect(() => {
    getItemsInTrip();
  }, []);

  return (
    <div>
      <div className="fixed top-0 w-full bg-white z-50">
        <div className="bg-white sm:px-12 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="relative w-28 h-9 cursor-pointer">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </a>
            </Link>

            <div className="sm:flex items-center gap-8 hidden">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentNavState(1);
                  router.push("/trip/stays");
                }}
                className={
                  "cursor-pointer md:!text-base " +
                  (currentNavState === 1 ? styles.showLinkLine : styles.link)
                }
              >
                Stays
              </div>

              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentNavState(2);
                  router.push("/trip/experiences");
                }}
                className={
                  "cursor-pointer md:!text-base " +
                  (currentNavState === 2 ? styles.showLinkLine : styles.link)
                }
              >
                Experiences
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                if (Cookies.get("token")) {
                  router.push("/trip/plan");
                } else {
                  router.push({
                    pathname: "/login",
                    query: {
                      redirect: "/trip/plan",
                    },
                  });
                }
              }}
              className="!px-1 !py-1 !bg-blue-600"
            >
              my trip
            </Button>

            <UserDropdown
              userProfile={userProfile}
              changeShowDropdown={changeShowDropdown}
              showDropdown={showDropdown}
            ></UserDropdown>
          </div>
          {Cookies.get("token") && (
            <div className="bg-white shadow-md absolute text-sm font-bold top-[15%] right-[90px] sm:right-[126px] w-5 h-5 rounded-full flex items-center justify-center">
              {trips.trip && trips.trip.length}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="w-full h-500 relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
          <Image
            className={"sm:w-full md:w-full"}
            layout="fill"
            objectFit="cover"
            src="/images/trip-header-image.jpg"
            sizes="380"
            alt="Image Gallery"
            priority
          />

          <div className="absolute flex flex-col items-center justify-center top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 w-fit px-6 md:px-0">
            <div>
              <h1 className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase text-center">
                A Trip building experience
              </h1>
            </div>

            <Button className="flex items-center gap-4 w-36 !py-3 !bg-blue-600">
              <span className="font-bold">Learn more</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-2 top-4 relative">
        <div className="flex justify-between relative h-full w-full">
          <div
            className={
              "sticky w-[35%] hidden md:block overflow-y-scroll top-[74px] h-screen border-r border-gray-200 px-4 "
            }
          >
            <h1 className="mb-2 font-bold text-lg">Filter based on</h1>
            <Swiper
              {...settings}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              onSwiper={(swiper) => setAllowSlideNext(swiper.allowSlideNext)}
              onSlideChange={(swiper) => setSwiperIndex(swiper.realIndex)}
              modules={[FreeMode, Navigation, Thumbs]}
              className="!w-full relative"
            >
              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Budget
                </div>
              </SwiperSlide>
              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Couples
                </div>
              </SwiperSlide>
              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Family
                </div>
              </SwiperSlide>

              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Budget
                </div>
              </SwiperSlide>
              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Couples
                </div>
              </SwiperSlide>
              <SwiperSlide className="!w-fit">
                <div className="border border-gray-100 px-3 py-2 rounded-3xl">
                  Family
                </div>
              </SwiperSlide>

              <div
                className={
                  "absolute hidden md:flex cursor-pointer select-none items-center justify-center top-[20%] z-50 left-2 -translate-y-2/4 swiper-pagination swiper-button-prev " +
                  (swiperIndex === 0 ? "invisible" : "")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
                  "absolute hidden cursor-pointer md:flex select-none items-center justify-center top-[20%] z-50 right-2 -translate-y-2/4 swiper-pagination swiper-button-next " +
                  (!allowSlideNext ? "invisible" : "")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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

            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              className={"w-full !py-2 !justify-between relative "}
            >
              <div className="font-bold text-sm">Location</div>
              <Input
                placeholder="Where to?"
                type="text"
                name="location"
                value={location}
                className={"!w-full !bg-white mt-1"}
                autoComplete="off"
                onChange={(event) => {
                  onChange(event);
                }}
                onKeyPress={onKeyDown}
              ></Input>
              <div
                className={
                  "absolute top-[65%] right-3 -translate-y-2/4 " +
                  (location ? "block" : "hidden")
                }
              >
                <SearchButtonClose
                  onClick={() => {
                    setLocation("");
                    setAutoComplete([]);
                  }}
                ></SearchButtonClose>
              </div>

              {autoComplete.length > 0 && (
                <div className="absolute top-full left-0 z-30 rounded-b-xl w-full md:w-[350px] py-2 bg-white">
                  {autoComplete.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => locationFromSearch(item)}
                      className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="truncate">{item.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="relative w-full">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDate(!showDate);
                  }}
                  className={
                    "relative !w-full mt-2 border rounded-md px-2 border-gray-200 !py-2 !justify-between "
                  }
                >
                  <div className="font-bold text-sm mb-2">Date</div>
                  <div className="text-sm text-gray-400">
                    {date ? moment(date).format("MMM Do") : "Add date"}
                  </div>
                  <div
                    className={
                      "absolute top-2/4 right-3 -translate-y-2/4 " +
                      (date ? "block" : "hidden")
                    }
                  >
                    <SearchButtonClose
                      onClick={() => {
                        setDate("");
                      }}
                    ></SearchButtonClose>
                  </div>
                </div>
                <div className={" " + (!showDate ? "hidden" : "")}>
                  <DatePicker
                    setDate={(date, modifiers = {}) => {
                      if (!modifiers.disabled) {
                        setDate(date);
                      }
                    }}
                    date={date}
                    showDate={showDate}
                    className="!top-20 w-full lg:!w-[380px] "
                    disableDate={new Date()}
                  ></DatePicker>
                </div>
              </div>

              <div className="relative w-full">
                <div
                  className={
                    "relative !w-full mt-2 border rounded-md px-2 border-gray-200 !py-2 !justify-between "
                  }
                >
                  <div className="font-bold text-sm mb-2">travellers</div>

                  <div className="flex gap-3 items-center">
                    <div
                      onClick={() => {
                        if (travellers > 1) {
                          setTravellers(travellers - 1);
                        }
                      }}
                      className="w-6 h-6 rounded-full flex items-center cursor-pointer justify-center  bg-white border border-gray-300 shadow-sm text-sm"
                    >
                      -
                    </div>

                    <div className="text-sm">
                      {travellers} {travellers > 1 ? "People" : "Person"}
                    </div>
                    <div
                      onClick={() => {
                        setTravellers(travellers + 1);
                      }}
                      className="w-6 h-6 rounded-full flex items-center cursor-pointer justify-center bg-white border border-gray-300 shadow-sm text-sm"
                    >
                      +
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative right-0 h-full xsMax:w-full px-4 w-[63%]">
            <AllTrips userProfile={userProfile} trips={trips}></AllTrips>
          </div>
        </div>
      </div>
    </div>
  );
};

Trips.propTypes = {};

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query, resolvedUrl }) => {
      try {
        const token = getTokenFromReq(req);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
            query.search ? query.search : ""
          }&type_of_stay=${
            query.type_of_stay ? query.type_of_stay : ""
          }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
            query.max_price ? query.max_price : ""
          }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
            query.max_rooms ? query.max_rooms : ""
          }&ordering=${query.ordering ? query.ordering : ""}`
        );

        await context.dispatch({
          type: "SET_STAYS",
          payload: response.data.results,
        });

        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: response.data[0],
            },
          };
        }

        return {
          props: {
            userProfile: "",
          },
        };
      } catch (error) {
        if (error.response.status === 401) {
          return {
            redirect: {
              permanent: false,
              destination: "logout",
            },
          };
        } else {
          return {
            props: {
              userProfile: "",
            },
          };
        }
      }
    }
);

export default Trips;
