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
import Search from "../../components/Trip/Search";
import Footer from "../../components/Home/Footer";

import { wrapper } from "../../redux/store";
import styles from "../../styles/StyledLink.module.css";
import UserDropdown from "../../components/Home/UserDropdown";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import SearchButtonClose from "../../components/Home/SearchButtonClose";
import DatePicker from "../../components/ui/DatePicker";
import Modal from "../../components/ui/LargeFullscreenPopup";
import { getRecommendeTripUrl } from "../../lib/url";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import AllTrips from "../../components/Trip/Trips";
import Cookies from "js-cookie";
import getToken from "../../lib/getToken";
import Tags from "../../components/Trip/Tags";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import SingleTrip from "../../components/Trip/SingleTrip";

import Select from "react-select";
import { Icon } from "@iconify/react";
import Dropdown from "../../components/ui/Dropdown";

const Trips = ({ userProfile, recommendedTrips, userTrips }) => {
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

  const [showAddToTripPopup, setShowAddToTripPopup] = useState(false);

  const [selectedData, setSelectedData] = useState(null);

  const [addToYourNewTripLoading, setAddToYourNewTripLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("");

  const months = [
    {
      label: "January",
      value: "1",
    },
    {
      label: "February",
      value: "2",
    },
    {
      label: "March",
      value: "3",
    },
    {
      label: "April",
      value: "4",
    },
    {
      label: "May",
      value: "5",
    },
    {
      label: "June",
      value: "6",
    },
    {
      label: "July",
      value: "7",
    },
    {
      label: "August",
      value: "8",
    },
    {
      label: "September",
      value: "9",
    },
    {
      label: "October",
      value: "10",
    },
    {
      label: "November",
      value: "11",
    },
    {
      label: "December",
      value: "12",
    },
  ];

  const priceConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/usd",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.KES,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    priceConversionRate();
  });

  const addToANewTrip = async () => {
    if (selectedData) {
      setAddToYourNewTripLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
          {
            stay_id: selectedData.stay_id,
            activity_id: selectedData.activity_id,
            transport_id: selectedData.transport_id,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          router.push({
            pathname: `/trip/plan/${res.data.slug}`,
          });
        })
        .catch((err) => {
          console.log(err.response);
          setAddToYourNewTripLoading(false);
        });
    }
  };

  const [showPricePopup, setShowPricePopup] = useState(false);

  const filterArrayOfObjects = (array, value) => {
    return array.filter((obj) => obj.value === value);
  };

  const search = (location) => {
    let updatedLocation = location.split(",");
    if (updatedLocation.length > 1) {
      updatedLocation = updatedLocation[0];
    } else {
      updatedLocation = location;
    }

    router.push({
      query: {
        ...router.query,
        location: updatedLocation,
      },
    });
  };

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

            {/* <div className="sm:flex items-center gap-8 hidden">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentNavState(1);
                  router.push("/trip");
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
            </div> */}
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
              changeShowDropdown={() => {
                changeShowDropdown(!showDropdown);
              }}
              showDropdown={showDropdown}
              numberOfTrips={userTrips.length}
            ></UserDropdown>
          </div>
          <ClientOnly>
            {Cookies.get("token") && (
              <div className="bg-white shadow-md absolute text-sm font-bold top-[15%] right-[90px] sm:right-[126px] w-5 h-5 rounded-full flex items-center justify-center">
                {userTrips.length}
              </div>
            )}
          </ClientOnly>
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
          </div>

          <div className="absolute z-[30] flex md:flex-row flex-col bottom-20 w-[95%] md:w-[700px] lg:w-[900px] left-2/4 -translate-x-2/4 h-14 bg-white rounded-lg">
            <div className="md:w-[50%] w-full flex rounded-tr-lg md:rounded-br-lg items-center h-full rounded-tl-lg rounded-bl-lg bg-white border-r border-gray-300">
              <Search
                inputBoxClassName="border-0 "
                searchClass="w-full"
                location={location}
                placeholder="Search for a place"
                setLocation={setLocation}
                search={search}
              ></Search>
            </div>
            <div className="w-full md:w-[50%] flex">
              <div className="w-[50%] cursor-pointer pl-3 gap-2 h-full bg-white rounded-bl-lg md:rounded-bl-0 md:rounded-tr-lg md:rounded-br-lg border-r flex items-center">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div className="w-full">
                  <Select
                    defaultValue={selectedMonth}
                    onChange={(value) => {
                      setSelectedMonth(value);
                      router.push({
                        query: { ...router.query, month: value.value },
                      });
                    }}
                    className={"text-sm w-full outline-none border-none "}
                    instanceId={months}
                    placeholder="Select a month"
                    options={months}
                    isSearchable={true}
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  setShowPricePopup(!showPricePopup);
                }}
                className="w-[50%] relative cursor-pointer pl-3 gap-2 h-full bg-white md:rounded-tr-lg rounded-br-lg flex items-center"
              >
                <Icon
                  className="w-6 h-6 text-gray-500"
                  icon="material-symbols:price-change-outline-rounded"
                />
                <div className="text-sm text-gray-500">
                  {router.query.price === "1"
                    ? "Budget"
                    : router.query.price === "2"
                    ? "Mid Range"
                    : router.query.price === "3"
                    ? "Luxury"
                    : "Filter by price"}
                </div>

                <Dropdown
                  showDropdown={showPricePopup}
                  className="absolute left-[5%] top-full mt-2 w-56"
                >
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          price: "1",
                        },
                      });
                    }}
                    className={
                      "w-full py-3 px-2 font-bold text-sm " +
                      (router.query.price === "1"
                        ? "bg-gray-700 text-white"
                        : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                    }
                  >
                    Budget
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          price: "2",
                        },
                      });
                    }}
                    className={
                      "w-full py-3 px-2 font-bold text-sm " +
                      (router.query.price === "2"
                        ? "bg-gray-700 text-white"
                        : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                    }
                  >
                    Mid Range
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          price: "3",
                        },
                      });
                    }}
                    className={
                      "w-full py-3 px-2 font-bold text-sm " +
                      (router.query.price === "3"
                        ? "bg-gray-700 text-white"
                        : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                    }
                  >
                    Luxury
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="h-12 flex justify-center mt-2">
          <Tags></Tags>
        </div>
        <div className="flex justify-between relative mt-6 h-full w-full">
          <div>
            {/* <div
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
                <div className="border border-gray-100 px-2 py-2 rounded-3xl">
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
          </div> */}
          </div>
          <div className="h-full mx-auto w-full px-4 xl:w-[1300px] lg:w-[900px] ">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {router.query.tag && (
                <div className="px-2 py-1 flex items-center gap-2 rounded-3xl text-white bg-blue-500 mr-4">
                  <span className="text-sm font-semibold">honeymoon</span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          tag: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}
              {router.query.location && (
                <div className="px-2 flex gap-2 items-center py-1 rounded-3xl text-white bg-green-500">
                  <span className="text-sm font-semibold">
                    {router.query.location}
                  </span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          location: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}
              {router.query.month && (
                <div className="px-2 flex gap-2 items-center py-1 rounded-3xl text-white bg-green-500">
                  <span className="text-sm font-semibold">
                    {filterArrayOfObjects(months, router.query.month).length >
                      0 &&
                      filterArrayOfObjects(months, router.query.month)[0].label}
                  </span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          month: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}
              {router.query.price && (
                <div className="px-2 flex gap-2 items-center py-1 rounded-3xl text-white bg-green-500">
                  <span className="text-sm font-semibold">
                    {router.query.price === "1"
                      ? "Budget"
                      : router.query.price === "2"
                      ? "Mid Range"
                      : router.query.price === "3"
                      ? "Luxury"
                      : ""}
                  </span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          price: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}
            </div>
            <AllTrips
              userProfile={userProfile}
              trips={userTrips}
              userTrips={userTrips}
              recommendedTrips={recommendedTrips}
              setSelectedData={setSelectedData}
              setShowAddToTripPopup={setShowAddToTripPopup}
              showAddToTripPopup={showAddToTripPopup}
            ></AllTrips>
          </div>
        </div>
      </div>

      <Modal
        showModal={showAddToTripPopup}
        closeModal={() => {
          setShowAddToTripPopup(false);
        }}
        title="add to a trip"
        className="!overflow-y-scroll max-w-[500px] !h-[700px]"
      >
        <div className="px-4 mt-2 h-full relative">
          {userTrips.map((trip, index) => {
            return (
              <SingleTrip
                key={index}
                trip={trip}
                isRecommendedPage={true}
                selectedData={selectedData}
              ></SingleTrip>
            );
          })}

          <div className="flex justify-between mt-8">
            <div></div>
            <Button
              onClick={() => {
                addToANewTrip();
              }}
              className="flex w-full items-center gap-1 !px-0 !py-2 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
            >
              <span>Add to a new trip</span>

              <div
                className={
                  " " + (!addToYourNewTripLoading ? "hidden" : " ml-1")
                }
              >
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="white"
                ></LoadingSpinerChase>
              </div>
            </Button>
          </div>
        </div>
      </Modal>

      <div className="mt-20">
        <Footer></Footer>
      </div>
    </div>
  );
};

Trips.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const url = getRecommendeTripUrl(context);

    const trips = await axios.get(`${url}`);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          recommendedTrips: trips.data.results,
          userTrips: data || [],
        },
      };
    }

    return {
      props: {
        userProfile: "",
        recommendedTrips: trips.data.results,
        userTrips: [],
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
          recommendedTrips: [],
          userTrips: [],
        },
      };
    }
  }
}

export default Trips;
