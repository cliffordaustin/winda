import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import SwiperCore from "swiper";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/Listing.module.css";

import "swiper/css/effect-creative";
import "swiper/css";
import Button from "../ui/Button";
import Card from "../ui/Card";
import TripTransportCard from "./TripTransportCard";
import TransportTrip from "./TransportTrip";
import TripStayCard from "./TripStayCard";
import TripActivityCard from "./TripActivityCard";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const Trip = ({
  nights,
  index,
  order,
  setInfoPopup,
  setShowInfo,
  trip,
  tripId,
  tripSlug,
  startingDestination,
}) => {
  const [days, setDays] = useState();

  const [transport, setTransport] = useState([]);

  const [activities, setActivities] = useState([]);

  const [stays, setStays] = useState([]);

  const router = useRouter();

  const dispatch = useDispatch();

  const rangeBetweenTwoNumbers = (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  };

  const calcDays = () => {
    const formattedDays = 0;

    rangeBetweenTwoNumbers(0, index).forEach((item) => {
      formattedDays += order[item].days;
    });

    setDays(formattedDays);
  };

  useEffect(() => {
    calcDays();
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/`)
      .then((res) => {
        setTransport(res.data.results);
      })
      .catch((err) => console.log(err.response));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/activities/`)
      .then((res) => {
        setActivities(res.data.results.slice(0, 5));
      })
      .catch((err) => console.log(err.response));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/stays/`)
      .then((res) => {
        setStays(res.data.results.slice(0, 5));
      })
      .catch((err) => console.log(err.response));
  }, []);

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    showNavigation: false,
    showEdit: false,
    showStaysEdit: false,
    showActivitiesEdit: false,
  });

  const settings = {
    spaceBetween: 10,
    slidesPerView: "auto",

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const setCartId = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setInfoPopup(false);
    router.push({ query: { ...router.query, order_id: index } }).then(() => {
      setInfoPopup(true);
    });

    setShowInfo(true);
  };

  const variants = {
    hide: {
      scale: 0.5,
      x: -20,
    },
    show: {
      x: 0,
      scale: 1,
    },
    exit: {
      scale: 0.8,
      x: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const [numOfNight, setNumOfNight] = useState(trip.nights);

  const [numOfNightLoading, setNumOfNightLoading] = useState(false);

  const [numOfPeople, setNumOfPeople] = useState(trip.number_of_people);

  const [numOfPeopleLoading, setNumOfPeopleLoading] = useState(false);

  const updateStayNights = async () => {
    const token = Cookies.get("token");
    setNumOfNightLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          nights: numOfNight,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setNumOfNightLoading(false);
        console.log(err.response.data);
      });
  };

  const updateStayPeople = async () => {
    const token = Cookies.get("token");
    setNumOfPeopleLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          number_of_people: numOfPeople,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setNumOfNightLoading(false);
        console.log(err.response.data);
      });
  };

  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const deleteTrip = async () => {
    setDeleteButtonLoading(true);
    const token = Cookies.get("token");
    await axios
      .delete(`${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setDeleteButtonLoading(false);
        console.log(err.response.data);
      });
  };

  return (
    <div className="border border-gray-200 px-2 py-2 rounded-lg">
      {!trip.transport && (
        <div className="px-2 mt-1 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32h181.2c40.8 0 77.1 25.78 90.6 64.29l35.2 100.51c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.33 32-32 32H32c-17.67 0-32-14.3-32-32V256c0-26.7 16.36-49.6 39.61-59.2zm69.49-4.8h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4L109.1 192zM96 256c-17.67 0-32 14.3-32 32s14.33 32 32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32zm320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
                />
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">
                  From {startingDestination}
                </p>
              )}

              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay && order[index - 1].stay.location
                    ? order[index - 1].stay.location
                    : order[index - 1].activity &&
                      order[index - 1].activity.location
                    ? order[index - 1].activity.location
                    : ""}
                </p>
              )}

              <h1 className="font-bold">Transportation</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No transportation added
              </h1>
            </div>
          </div>

          {!state.showEdit && (
            <div
              onClick={() => {
                setState({ ...state, showEdit: true });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
                />
              </svg>
            </div>
          )}

          {state.showEdit && (
            <div
              onClick={() => {
                setState({ ...state, showEdit: false });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {!trip.transport && (
            <div
              onMouseLeave={() => setState({ ...state, showNavigation: false })}
              onMouseEnter={() => setState({ ...state, showNavigation: true })}
            >
              <Swiper
                {...settings}
                onSwiper={(swiper) => {
                  setState({
                    ...state,
                    allowSlideNext: swiper.allowSlideNext,
                  });
                }}
                onSlideChange={(swiper) => {
                  setState({
                    ...state,
                    swiperIndex: swiper.realIndex,
                    endOfSlide: swiper.isEnd,
                  });
                }}
                className={
                  "!w-full mt-4 relative " + (!state.showEdit ? "hidden" : "")
                }
              >
                {transport.map((item, index) => {
                  const sortedImages = item.transportation_images.sort(
                    (x, y) => y.main - x.main
                  );

                  const images = sortedImages.map((image) => {
                    return image.image;
                  });
                  return (
                    <SwiperSlide key={index} className="!w-[240px]">
                      <TripTransportCard
                        tripId={tripId}
                        images={images}
                        transport={item}
                        tripSlug={tripSlug}
                      ></TripTransportCard>
                    </SwiperSlide>
                  );
                })}

                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                    (state.swiperIndex === 0 || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                    (state.endOfSlide || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </Swiper>
            </div>
          )}
        </div>
      )}

      {trip.transport && (
        <div className="px-2 mt-1 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32h181.2c40.8 0 77.1 25.78 90.6 64.29l35.2 100.51c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.33 32-32 32H32c-17.67 0-32-14.3-32-32V256c0-26.7 16.36-49.6 39.61-59.2zm69.49-4.8h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4L109.1 192zM96 256c-17.67 0-32 14.3-32 32s14.33 32 32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32zm320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
                />
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">From Nairobi</p>
              )}
              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay && order[index - 1].stay.location
                    ? order[index - 1].stay.location
                    : order[index - 1].activity &&
                      order[index - 1].activity.location
                    ? order[index - 1].activity.location
                    : ""}
                </p>
              )}
              <h1 className="font-bold">Transportation</h1>
            </div>
          </div>
          <div className="mt-2">
            <OrderCard
              orderId={trip.id}
              orderSlug={trip.slug}
              transport={trip.transport}
              transportPage={true}
              transportDistance={34009}
              transportDestination={"Naivasha"}
              transportStartingPoint={"Nairobi"}
              transportPrice={1200}
              checkoutInfo={true}
            ></OrderCard>
          </div>
        </div>
      )}

      {!trip.stay && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M224 115.5V208a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.5a16 16 0 0 1 5.2-11.8l80-72.7a16 16 0 0 1 21.6 0l80 72.7a16 16 0 0 1 5.2 11.8Z"
                />
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">From Nairobi</p>
              )}
              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay && order[index - 1].stay.location
                    ? order[index - 1].stay.location
                    : order[index - 1].activity &&
                      order[index - 1].activity.location
                    ? order[index - 1].activity.location
                    : ""}
                </p>
              )}
              <h1 className="font-bold">Stay</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No stay added
              </h1>
            </div>
          </div>

          {!state.showStaysEdit && (
            <div
              onClick={() => {
                setState({ ...state, showStaysEdit: true });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
                />
              </svg>
            </div>
          )}

          {state.showStaysEdit && (
            <div
              onClick={() => {
                setState({ ...state, showStaysEdit: false });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {!trip.stay && (
            <div
              onMouseLeave={() => setState({ ...state, showNavigation: false })}
              onMouseEnter={() => setState({ ...state, showNavigation: true })}
            >
              <Swiper
                {...settings}
                onSwiper={(swiper) => {
                  setState({
                    ...state,
                    allowSlideNext: swiper.allowSlideNext,
                  });
                }}
                onSlideChange={(swiper) => {
                  setState({
                    ...state,
                    swiperIndex: swiper.realIndex,
                    endOfSlide: swiper.isEnd,
                  });
                }}
                className={
                  "!w-full mt-4 relative " +
                  (!state.showStaysEdit ? "hidden" : "")
                }
              >
                {stays.map((item, index) => {
                  const sortedImages = item.stay_images.sort(
                    (x, y) => y.main - x.main
                  );

                  const images = sortedImages.map((image) => {
                    return image.image;
                  });
                  return (
                    <SwiperSlide key={index} className="!w-[240px]">
                      <TripStayCard
                        tripId={tripId}
                        tripSlug={tripSlug}
                        images={images}
                        stay={item}
                      ></TripStayCard>
                    </SwiperSlide>
                  );
                })}

                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                    (state.swiperIndex === 0 || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                    (state.endOfSlide || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </Swiper>
            </div>
          )}
        </div>
      )}

      {trip.stay && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">
                {trip.nights}
              </span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                nights
              </span>
            </div>
            <div>
              <div className="">
                {trip.stay && (
                  <h1 className="font-bold">{trip.stay.location}</h1>
                )}
              </div>
              <div className="">
                {trip.stay && <h1>{trip.stay.country}</h1>}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <OrderCard
              checkoutInfo={true}
              orderSlug={trip.slug}
              stay={trip.stay}
              orderId={trip.id}
              orderDays={trip.days}
              itemType="order"
              stayPage={true}
            ></OrderCard>
          </div>

          {/* white plus and minus round button to add and remove */}
          <div className="flex mt-4 mb-1 items-center gap-4">
            <div className="flex gap-3 items-center">
              <div
                onClick={() => {
                  if (numOfNight > 1) {
                    setNumOfNight(numOfNight - 1);
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg font-bold"
              >
                -
              </div>

              <div className="font-bold">{numOfNight} nights</div>
              <div
                onClick={() => {
                  setNumOfNight(numOfNight + 1);
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg font-bold"
              >
                +
              </div>
            </div>
            <div
              onClick={() => {
                updateStayNights();
              }}
              className="font-bold flex items-center bg-blue-200 cursor-pointer px-2 py-0.5 rounded-md"
            >
              <span className="text-blue-600 font-bold mr-1">update</span>
              <div className={" " + (!numOfNightLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="blue"
                ></LoadingSpinerChase>
              </div>
            </div>
          </div>

          {/* <div
            onClick={(e) => {
              setCartId(e);

              dispatch({
                type: "SET_CURRENT_CART_ITEM_NAME",
                payload: trip.stay
                  ? trip.stay.name
                  : trip.activity
                  ? trip.activity.name
                  : "",
              });
            }}
            className="w-8 h-8 shadow-md cursor-pointer bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
              />
            </svg>
          </div> */}
        </div>
      )}

      {!trip.activity && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                  <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                  <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                </g>
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">From Nairobi</p>
              )}
              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay && order[index - 1].stay.location
                    ? order[index - 1].stay.location
                    : order[index - 1].activity &&
                      order[index - 1].activity.location
                    ? order[index - 1].activity.location
                    : ""}
                </p>
              )}
              <h1 className="font-bold">Activity</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No activity added
              </h1>
            </div>
          </div>

          {!state.showActivitiesEdit && (
            <div
              onClick={() => {
                setState({ ...state, showActivitiesEdit: true });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
                />
              </svg>
            </div>
          )}

          {state.showActivitiesEdit && (
            <div
              onClick={() => {
                setState({ ...state, showActivitiesEdit: false });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {!trip.activity && (
            <div
              onMouseLeave={() => setState({ ...state, showNavigation: false })}
              onMouseEnter={() => setState({ ...state, showNavigation: true })}
            >
              <Swiper
                {...settings}
                onSwiper={(swiper) => {
                  setState({
                    ...state,
                    allowSlideNext: swiper.allowSlideNext,
                  });
                }}
                onSlideChange={(swiper) => {
                  setState({
                    ...state,
                    swiperIndex: swiper.realIndex,
                    endOfSlide: swiper.isEnd,
                  });
                }}
                className={
                  "!w-full mt-4 relative " +
                  (!state.showActivitiesEdit ? "hidden" : "")
                }
              >
                {activities.map((item, index) => {
                  const sortedImages = item.activity_images.sort(
                    (x, y) => y.main - x.main
                  );

                  const images = sortedImages.map((image) => {
                    return image.image;
                  });
                  return (
                    <SwiperSlide key={index} className="!w-[240px]">
                      <TripActivityCard
                        tripId={tripId}
                        images={images}
                        activity={item}
                        tripSlug={tripSlug}
                      ></TripActivityCard>
                    </SwiperSlide>
                  );
                })}

                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                    (state.swiperIndex === 0 || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                    (state.endOfSlide || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </Swiper>
            </div>
          )}
        </div>
      )}

      {trip.activity && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">{2}</span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                hours
              </span>
            </div>
            <div>
              <div className="">
                {trip.activity && (
                  <h1 className="font-bold">{trip.activity.location}</h1>
                )}
              </div>
              <div className="">
                {trip.activity && <h1>{trip.activity.country}</h1>}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <OrderCard
              checkoutInfo={true}
              orderSlug={trip.slug}
              activity={trip.activity}
              orderId={trip.id}
              orderDays={trip.days}
              itemType="order"
              activitiesPage={true}
            ></OrderCard>
          </div>

          <div className="flex mt-4 mb-1 items-center gap-4">
            <div className="flex gap-3 items-center">
              <div
                onClick={() => {
                  if (numOfPeople > 1) {
                    setNumOfPeople(numOfPeople - 1);
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg font-bold"
              >
                -
              </div>

              <div className="font-bold">
                {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
              </div>
              <div
                onClick={() => {
                  setNumOfPeople(numOfPeople + 1);
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg font-bold"
              >
                +
              </div>
            </div>
            <div
              onClick={() => {
                updateStayPeople();
              }}
              className="font-bold bg-blue-200 flex items-center cursor-pointer px-2 py-0.5 rounded-md"
            >
              <span className="text-blue-600 font-bold">update</span>
              <div className={" " + (!numOfPeopleLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="blue"
                ></LoadingSpinerChase>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Button
          onClick={() => {
            deleteTrip();
          }}
          className="!w-full !bg-red-500 hover:!bg-red-600 py-2 flex items-center gap-1"
        >
          <span className="font-bold">Delete</span>
          <div className={" " + (!deleteButtonLoading ? "hidden" : "")}>
            <LoadingSpinerChase
              width={16}
              height={16}
              color="white"
            ></LoadingSpinerChase>
          </div>
        </Button>
      </div>

      {/* <div className="px-2 mt-6 relative bg-gray-100 py-1 rounded-lg flex flex-col">
        <div className="flex gap-2">
          {trip.stay && (
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">
                {nights}
              </span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                nights
              </span>
            </div>
          )}
          {trip.activity && (
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">{2}</span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                hours
              </span>
            </div>
          )}
          <div>
            <div className="">
              {trip.stay && <h1 className="font-bold">{trip.stay.location}</h1>}
              {trip.activity && (
                <h1 className="font-bold">{trip.activity.location}</h1>
              )}
            </div>
            <div className="">
              {trip.stay && <h1>{trip.stay.country}</h1>}
              {trip.activity && <h1>{trip.activity.country}</h1>}
            </div>
          </div>

          <div
            onClick={(e) => {
              setCartId(e);

              dispatch({
                type: "SET_CURRENT_CART_ITEM_NAME",
                payload: trip.stay
                  ? trip.stay.name
                  : trip.activity
                  ? trip.activity.name
                  : "",
              });
            }}
            className="w-8 h-8 shadow-md cursor-pointer bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
              />
            </svg>
          </div>
        </div>

        <div className="mt-4">
          {trip.stay && (
            <OrderCard
              checkoutInfo={true}
              stay={trip.stay}
              orderId={trip.id}
              orderDays={trip.days}
              itemType="order"
              stayPage={true}
            ></OrderCard>
          )}
          {trip.activity && (
            <OrderCard
              checkoutInfo={true}
              activity={trip.activity}
              orderId={trip.id}
              orderDays={trip.days}
              itemType="order"
              activitiesPage={true}
            ></OrderCard>
          )}
        </div>
      </div> */}

      {/* {trip.stay && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                  <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                  <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                </g>
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">From Nairobi</p>
              )}
              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay
                    ? order[index - 1].stay.location
                    : order[index - 1].activity.location}
                </p>
              )}
              <h1 className="font-bold">Experiences</h1>
              <h1 className="font-medium mt-2 text-sm text-red-600">
                No experiences added
              </h1>
            </div>
          </div>

          {!state.showActivitiesEdit && (
            <div
              onClick={() => {
                setState({ ...state, showActivitiesEdit: true });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
                />
              </svg>
            </div>
          )}

          {state.showActivitiesEdit && (
            <div
              onClick={() => {
                setState({ ...state, showActivitiesEdit: false });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {!trip.transport && (
            <div
              onMouseLeave={() => setState({ ...state, showNavigation: false })}
              onMouseEnter={() => setState({ ...state, showNavigation: true })}
            >
              <Swiper
                {...settings}
                onSwiper={(swiper) => {
                  setState({
                    ...state,
                    allowSlideNext: swiper.allowSlideNext,
                  });
                }}
                onSlideChange={(swiper) => {
                  setState({
                    ...state,
                    swiperIndex: swiper.realIndex,
                    endOfSlide: swiper.isEnd,
                  });
                }}
                className={
                  "!w-full mt-4 relative " + (!state.showEdit ? "hidden" : "")
                }
              >
                {transport.map((item, index) => {
                  const sortedImages = item.transportation_images.sort(
                    (x, y) => y.main - x.main
                  );

                  const images = sortedImages.map((image) => {
                    return image.image;
                  });
                  return (
                    <SwiperSlide key={index} className="!w-[240px]">
                      <TripTransportCard
                        tripId={tripId}
                        images={images}
                        transport={item}
                      ></TripTransportCard>
                    </SwiperSlide>
                  );
                })}

                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                    (state.swiperIndex === 0 || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                    (state.endOfSlide || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </Swiper>
            </div>
          )}
        </div>
      )}

      {trip.activity && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M224 115.5V208a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.5a16 16 0 0 1 5.2-11.8l80-72.7a16 16 0 0 1 21.6 0l80 72.7a16 16 0 0 1 5.2 11.8Z"
                />
              </svg>
            </div>
            <div>
              {index === 0 && (
                <p className="text-sm font-medium">From Nairobi</p>
              )}
              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay
                    ? order[index - 1].stay.location
                    : order[index - 1].activity.location}
                </p>
              )}
              <h1 className="font-bold">Stay</h1>
              <h1 className="font-medium mt-2 text-sm text-red-600">
                No stay added
              </h1>
            </div>
          </div>

          {!state.showStaysEdit && (
            <div
              onClick={() => {
                setState({ ...state, showStaysEdit: true });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
                />
              </svg>
            </div>
          )}

          {state.showStaysEdit && (
            <div
              onClick={() => {
                setState({ ...state, showStaysEdit: false });
              }}
              className="w-8 h-8 cursor-pointer shadow-md bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};

Trip.propTypes = {};

export default Trip;
