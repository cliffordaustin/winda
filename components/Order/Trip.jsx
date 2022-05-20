import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import moment from "moment";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import SwiperCore from "swiper";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/Listing.module.css";

import "swiper/css/effect-creative";
import "swiper/css";
import Button from "../ui/Button";
import Card from "../ui/Card";

const Trip = ({
  activitiesTrip,
  stayOrders,
  activitiesOrders,
  day,
  nights,
  hours,
  index,
  order,
  setInfoPopup,
  setShowInfo,
}) => {
  const [days, setDays] = useState();

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

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    showNavigation: false,
    showEdit: false,
  });

  const settings = {
    spaceBetween: 10,
    slidesPerView: "auto",
    pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
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

  const [drivers, setDrivers] = useState([
    {
      name: "Jane Doe",
      lat: -1.1204533,
      lng: 36.9405449,
      id: 2,
      status: "available",
      vehicle: "car",
      vehicle_type: "Sedan",
      vehicle_color: "blue",
      vehicle_plate: "EFG123",
      vehicle_model: "2016",
      vehicle_make: "Toyota",
      vehicle_year: "2016",
      vehicle_image:
        "https://images.unsplash.com/photo-1638618164682-12b986ec2a75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "John Doe",
      lat: -1.3428533,
      lng: 36.9405449,
      id: 1,
      status: "available",
      vehicle: "car",
      vehicle_type: "sedan",
      vehicle_color: "red",
      vehicle_plate: "ABC123",
      vehicle_model: "2019",
      vehicle_make: "Honda",
      vehicle_year: "2019",
      vehicle_image:
        "https://images.unsplash.com/photo-1614220654876-8a75c41f7a7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvbmRhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
    },
    {
      name: "Jack Doe",
      lat: -1.1004533,
      lng: 36.6005449,
      id: 3,
      status: "available",
      vehicle: "car",
      vehicle_type: "SUV",
      vehicle_color: "black",
      vehicle_plate: "HIJ123",
      vehicle_model: "2018",
      vehicle_make: "KIA",
      vehicle_year: "2018",
      vehicle_image:
        "https://images.unsplash.com/photo-1626630530997-2d26c0438401?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Jill Doe",
      lat: -1.2004533,
      lng: 35.9405449,
      id: 4,
      status: "available",
      vehicle: "car",
      vehicle_type: "SUV",
      vehicle_color: "green",
      vehicle_plate: "KLM123",
      vehicle_model: "2015",
      vehicle_make: "Mazda",
      vehicle_year: "2015",
      vehicle_image:
        "https://images.unsplash.com/photo-1531181616225-f8e50c1ab53e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
    {
      name: "Joe Doe",
      lat: -1.1904533,
      lng: 34.9405449,
      id: 5,
      status: "not available",
      vehicle: "car",
      vehicle_type: "Estate",
      vehicle_color: "orange",
      vehicle_plate: "NOP123",
      vehicle_model: "2019",
      vehicle_make: "Nissan",
      vehicle_year: "2019",
      vehicle_image:
        "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
  ]);

  const setCartId = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setInfoPopup(false);
    router.push({ query: { ...router.query, order_id: index } }).then(() => {
      setInfoPopup(true);
    });

    setShowInfo(true);
  };

  return (
    <>
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
            {index === 0 && <p className="text-sm font-medium">From Nairobi</p>}
            {index > 0 && (
              <p className="text-sm font-medium">
                From{" "}
                {order[index - 1].stay
                  ? order[index - 1].stay.location
                  : order[index - 1].activity.location}
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
            });
          }}
          className={
            "!w-full mt-4 relative " + (!state.showEdit ? "hidden" : "")
          }
        >
          {drivers.map((driver, index) => (
            <SwiperSlide key={index} className="!w-[200px]">
              <Card
                imagePaths={[driver.vehicle_image]}
                carouselClassName="h-[150px]"
                subCarouselClassName="hidden"
                className={styles.card + " !shadow-sm"}
                childrenClass="!mt-1"
              >
                <div className="flex flex-col gap-1">
                  <h1 className="text-gray-800 text-sm font-bold truncate">
                    {driver.name}
                  </h1>
                </div>

                <div className="font-bold text-sm truncate mt-1">
                  <span className="text-sm font-medium text-gray-500">
                    Plate #:{" "}
                  </span>
                  {driver.vehicle_plate}
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: driver.vehicle_color }}
                  ></div>
                  <div className="text-sm">
                    {driver.vehicle_year} {driver.vehicle_make}
                  </div>
                </div>

                <div className="mt-2">
                  <div
                    onClick={(e) => {}}
                    className="py-1.5 rounded-md bg-blue-600 bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="w-5 h-5"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
                      />
                    </svg>
                    <span>Add </span>
                  </div>
                </div>
              </Card>

              <div>
                {driver.vehicle_type === "SUV" && driver.vehicle === "car" && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <div className="px-2 rounded-md bg-lime-600 text-white">
                      Car
                    </div>
                    <div className="px-2 rounded-md bg-blue-600 text-white">
                      SUV
                    </div>
                  </div>
                )}
                {driver.vehicle_type === "Sedan" && driver.vehicle === "car" && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <div className="px-2 rounded-md bg-lime-600 text-white">
                      Car
                    </div>
                    <div className="px-2 rounded-md bg-blue-600 text-white">
                      Sedan
                    </div>
                  </div>
                )}
                {driver.vehicle_type === "Estate" && driver.vehicle === "car" && (
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <div className="px-2 rounded-md bg-lime-600 text-white">
                      Car
                    </div>
                    <div className="px-2 rounded-md bg-blue-600 text-white">
                      Estate
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}

          <div
            className={
              "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg "
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
          </div>
          <div
            className={
              "absolute cursor-pointer flex items-center justify-center top-2/4 z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 -mt-4 rounded-full bg-white shadow-lg "
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
          </div>
        </Swiper>
      </div>

      <div className="px-2 mt-6 relative bg-gray-100 py-1 rounded-lg flex flex-col">
        <div className="flex gap-2">
          {!activitiesTrip && (
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">
                {nights}
              </span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                nights
              </span>
            </div>
          )}
          {activitiesTrip && (
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              <span className="text-gray-500 font-extrabold text-lg">{2}</span>
              <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                hours
              </span>
            </div>
          )}
          <div>
            {/* {index === 0 && (
              <p className="text-sm font-medium">Day 1 - {days + 1}</p>
            )}
            {index > 0 && (
              <p className="text-sm font-medium">
                Day {order[index - 1].days + 1} - {days + 1}
              </p>
            )} */}
            <div className="">
              {!activitiesTrip && (
                <h1 className="font-bold">{stayOrders.stay.location}</h1>
              )}
              {activitiesTrip && (
                <h1 className="font-bold">
                  {activitiesOrders.activity.location}
                </h1>
              )}
            </div>
            <div className="">
              {!activitiesTrip && <h1>{stayOrders.stay.country}</h1>}
              {activitiesTrip && <h1>{activitiesOrders.activity.country}</h1>}
            </div>
          </div>

          <div
            onClick={(e) => {
              setCartId(e);

              dispatch({
                type: "SET_CURRENT_CART_ITEM_NAME",
                payload: !activitiesTrip
                  ? stayOrders.stay.name
                  : activitiesTrip
                  ? activitiesOrders.activity.name
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
          {!activitiesTrip && (
            <OrderCard
              checkoutInfo={true}
              stay={stayOrders.stay}
              orderId={stayOrders.id}
              orderDays={stayOrders.days}
              itemType="order"
            ></OrderCard>
          )}
          {activitiesTrip && (
            <OrderCard
              checkoutInfo={true}
              activity={activitiesOrders.activity}
              orderId={activitiesOrders.id}
              orderDays={activitiesOrders.days}
              itemType="order"
              activitiesPage={true}
            ></OrderCard>
          )}
        </div>
      </div>
    </>
  );
};

Trip.propTypes = {};

export default Trip;
