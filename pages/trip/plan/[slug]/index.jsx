import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { usePaystackPayment } from "react-paystack";
import * as Yup from "yup";
import Steps from "rc-steps";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Icon } from "@iconify/react";

import Input from "../../../../components/ui/Input";
import getToken from "../../../../lib/getToken";
import getTokenFromReq from "../../../../lib/getTokenFromReq";
import getCart from "../../../../lib/getCart";
import Navbar from "../../../../components/Stay/Navbar";
import CartItem from "../../../../components/Cart/CartItem";
import Button from "../../../../components/ui/Button";
import styles from "../../../../styles/Cart.module.css";
import OrderItem from "../../../../components/Cart/OrderItem";
import ModalPopup from "../../../../components/ui/ModalPopup";
import Map from "../../../../components/Order/Map";
import { priceConversionRateFunc } from "../../../../lib/PriceRate";
import ClientOnly from "../../../../components/ClientOnly";
import LoadingSpinerChase from "../../../../components/ui/LoadingSpinerChase";
import OrderItemActivities from "../../../../components/Cart/OrderItemActivities";
import ResponsiveModal from "../../../../components/ui/ResponsiveModal";
import Destination from "../../../../components/Order/Destination";
import { reorder } from "../../../../lib/random";
import Modal from "../../../../components/ui/MobileModal";
import OpenModal from "../../../../components/ui/Modal";
import TripOverview from "../../../../components/Order/TripOverview";
import Popup from "../../../../components/ui/Popup";
import moment from "moment";
import OrderCard from "../../../../components/Order/OrderCard";
import Trip from "../../../../components/Order/Trip";
import TransportTrip from "../../../../components/Order/TransportTrip";
import { console } from "jsondiffpatch";
import SelectInput from "../../../../components/ui/SelectInput";
import {
  stayPriceOfPlan,
  activityPriceOfPlan,
  activityNumOfGuests,
} from "../../../../lib/pricePlan";

import "swiper/css/effect-creative";
import "swiper/css";
import TripTransportCard from "../../../../components/Order/TripTransportCard";
import Search from "../../../../components/Trip/Search";
import {
  getStayPrice,
  getActivityPrice,
} from "../../../../lib/getTotalCartPrice";
import BottomTooltip from "../../../../components/ui/BottomTooltip";
import TopTooltip from "../../../../components/ui/TopTooltip";

function PlanTrip({
  userProfile,
  allOrders,
  activitiesOrders,
  transportOrders,
  userTrips,
}) {
  const router = useRouter();

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
    windowSize: 0,
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    showNavigation: false,
  });

  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);
  const activeItem = useSelector((state) => state.order.activeItem);
  const currentCartItemName = useSelector(
    (state) => state.home.currentCartItemName
  );
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const totalPrice = () => {
    let price = 0;
    userTrips.trip &&
      userTrips.trip.forEach((item, index) => {
        const nights =
          new Date(item.to_date).getDate() - new Date(item.from_date).getDate();
        if (item.stay) {
          price +=
            getStayPrice(
              item.stay_plan,
              item.stay,
              item.stay_num_of_adults,
              item.stay_num_of_children,
              item.stay_num_of_children_non_resident,
              item.stay_num_of_adults_non_resident
            ) * (nights || 1);
        }

        if (item.activity) {
          price += getActivityPrice(
            item.activity_pricing_type,
            item.activity,
            item.activity_number_of_people,
            item.activity_number_of_sessions,
            item.activity_number_of_groups,
            item.activity_number_of_people_non_resident,
            item.activity_number_of_sessions_non_resident,
            item.activity_number_of_groups_non_resident
          );
        }

        if (item.transport) {
          price +=
            item.transport_number_of_days * item.transport.price_per_day +
            (item.user_need_a_driver
              ? item.transport.additional_price_with_a_driver *
                item.transport_number_of_days
              : 0);
        }
      });
    return parseFloat(price);
  };

  const [newPrice, setNewPrice] = useState(null);

  const [showInfo, setShowInfo] = useState(false);

  const [loading, setLoading] = useState(false);

  const [infoPopup, setInfoPopup] = useState(true);

  const [showMoreModal, setShowMoreModal] = useState(false);

  const dispatch = useDispatch();

  // work on this later
  // const totalPrice = () => {
  //   let price = 0;
  //   if (userTrips.trip) {
  //     userTrips.trip.forEach((item) => {
  //       const calcPrice =
  //         (item.stay ? item.stay.price : 0) +
  //         (item.transport ? item.transport.price : 0) +
  //         (item.activity ? item.activity.price : 0);

  //       price += calcPrice;
  //     });
  //   }
  //   return parseFloat(price);
  // };

  const reference = () => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToKES && priceConversionRate) {
        setNewPrice(priceConversionRate * price);
      } else {
        setNewPrice(price);
      }
    } else {
      return null;
    }
  };

  const price = () => {
    return parseInt(
      (Math.floor(priceConversionRate * totalPrice() * 100) / 100)
        .toFixed(2)
        .replace(".", ""),
      10
    );
  };

  const [destinationPopup, setDestinationPopup] = useState(false);

  const helpReorderPopup = useSelector((state) => state.home.helpReorderPopup);

  const [groupedStays, setGroupedStays] = useState([]);

  const [groupedActivitiesAndStays, setGroupActivitiesAndStays] = useState([]);

  const [destinationData, setDestinationData] = useState({
    location: "Nairobi, Kenya",
  });

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: "HIDE_HELP_REORDER_POPUP",
      });
    }, 7000);
  }, []);

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  }, []);

  useEffect(() => {
    if (process.browser) {
      setState({
        ...state,
        windowSize: window.innerWidth,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.browser) {
      window.onresize = function () {
        setState({ ...state, windowSize: window.innerWidth });
      };
    }
  }, []);

  useEffect(() => {
    priceConversion(totalPrice());
  }, [totalPrice(), currencyToKES, priceConversionRate]);

  const [transport, setTransport] = useState([]);

  const [showTransportOptionsPopup, setShowTransportOptionsPopup] =
    useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/`)
      .then((res) => {
        setTransport(res.data.results);
      })
      .catch((err) => console.log(err.response));
  }, []);

  const config = {
    reference: reference(),
    email: userProfile.email,
    amount: price(),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLICK_KEY,
    currency: "GHS",
    embed: false,
  };

  const onSuccess = async (reference) => {
    setLoading(true);
    try {
      for (const item of allOrders) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_baseURL}/user-orders/${item.id}/`,
          {
            paid: true,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );
      }
      for (const item of activitiesOrders) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/${item.id}/`,
          {
            paid: true,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );
      }
      router.push({
        pathname: "/order-successfull",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onClose = () => {
    console.log("closed");
  };

  let nothingInOrder = "";
  let showItemsInOrder = "";

  //********* */

  const [order, setOrder] = useState([]);

  const setAllOrders = () => {
    let orderFormatted = [];
    if (userTrips.trip) {
      orderFormatted = userTrips.trip.sort((a, b) => {
        return new Date(a.from_date) - new Date(b.from_date);
      });
    }

    setOrder(orderFormatted);
  };

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setAllOrders();
  }, []);

  const changeTransportBack = () => {
    router.push({
      pathname: "/transport",
      query: {
        transportBack: 1,
        group_trip: router.query.slug,
      },
    });
  };

  const [showStartLocation, setShowStartLocation] = useState(null);
  const [showStartLocationLoading, setShowStartLocationLoading] =
    useState(false);

  const [startingLocationSelected, setStartingLocationSelected] = useState({
    value: "Nairobi Internation Airport",
    label: "Nairobi Internation Airport",
  });

  const initializePayment = usePaystackPayment(config);

  const locations = [
    {
      value: "Nairobi Internation Airport",
      label: "Nairobi Internation Airport",
    },
    { value: "Naivasha Airport", label: "Naivasha Airport" },
  ];

  const [location, setLocation] = useState("");

  const updateStartingLocation = async () => {
    const token = Cookies.get("token");

    setShowStartLocationLoading(true);

    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/${userTrips.slug}/`,
        {
          starting_point: location
            ? location
            : startingLocationSelected
            ? startingLocationSelected.value
            : "",
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
        console.log(err.response.data);
      });
  };

  const settings = {
    spaceBetween: 10,
    slidesPerView: "auto",

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

  const [itineraryTooltip, setItineraryTooltip] = useState(false);

  if (!userTrips.trip || userTrips.trip.length === 0) {
    nothingInOrder = (
      <>
        <Navbar
          showDropdown={state.showDropdown}
          currentNavState={state.currentNavState}
          userProfile={userProfile}
          showSearchModal={() => {
            setState({ ...state, showSearchModal: true });
          }}
          setCurrentNavState={(currentNavState) => {
            setState({
              ...state,
              currentNavState: currentNavState,
              showCheckOutDate: false,
              showCheckInDate: false,
              showPopup: false,
            });
          }}
          changeShowDropdown={() =>
            setState({
              ...state,
              showDropdown: !state.showDropdown,
            })
          }
        ></Navbar>
        <div className="flex flex-col items-center justify-center mt-24">
          <p className="font-bold text-xl">
            You have no item in your order. Checkout;
          </p>
          <div className="flex gap-2 mt-2">
            <Link href="/stays">
              <a>
                <Button>Stays</Button>
              </a>
            </Link>
            <Link href="/experiences">
              <a>
                <Button>Experiences</Button>
              </a>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const [showNamePopup, setShowNamePopup] = useState(false);

  const [nameOfTrip, setNameOfTrip] = useState(userTrips.name);

  const [nameOfTripLoading, setNameOfTripLoading] = useState(false);

  const updateName = async () => {
    const token = Cookies.get("token");
    setNameOfTripLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/${userTrips.slug}/`,
        {
          name: nameOfTrip,
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
        setNameOfTripLoading(false);
        console.log(err.response.data);
      });
  };

  if (userTrips.trip && userTrips.trip.length > 0) {
    showItemsInOrder = (
      <div className="relative">
        <div className="hidden md:block md:px-4 relative">
          <div className="fixed top-0 w-full bg-white z-20">
            <Navbar
              showDropdown={state.showDropdown}
              currentNavState={state.currentNavState}
              userProfile={userProfile}
              showSearchModal={() => {
                setState({ ...state, showSearchModal: true });
              }}
              setCurrentNavState={(currentNavState) => {
                setState({
                  ...state,
                  currentNavState: currentNavState,
                  showCheckOutDate: false,
                  showCheckInDate: false,
                  showPopup: false,
                });
              }}
              changeShowDropdown={() =>
                setState({
                  ...state,
                  showDropdown: !state.showDropdown,
                })
              }
            ></Navbar>
          </div>
          <div className="flex relative h-full w-full">
            <div className="sticky lg:w-[22%] top-32 h-full hidden lg:block">
              <ClientOnly>
                {!currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {totalPrice()
                      ? "$" + Math.ceil(totalPrice()).toLocaleString()
                      : "No data"}
                  </h1>
                )}
                {currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {totalPrice()
                      ? "KES" + Math.ceil(newPrice).toLocaleString()
                      : "No data"}
                  </h1>
                )}
              </ClientOnly>

              <div className="px-2 mt-6 mb-6">
                <ClientOnly>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        // initializePayment(onSuccess, onClose);
                      }}
                      className="w-full !py-3 flex text-lg !bg-blue-900 !text-primary-blue-200"
                    >
                      <span className="font-bold mr-1">
                        Check for availablity
                      </span>

                      <div className={" " + (!loading ? "hidden" : "")}>
                        <LoadingSpinerChase
                          width={20}
                          height={20}
                        ></LoadingSpinerChase>
                      </div>
                    </Button>
                  </div>
                </ClientOnly>
              </div>

              <hr />

              <h1 className="text-xl font-bold mt-2">Chat with an expert</h1>
              <p className="mt-2 text-base">
                Chat with an expert to get advice or enquire on this trip
              </p>

              <Button
                onClick={() => {}}
                className="w-full !py-3 mt-5 flex text-lg !bg-blue-600 !text-primary-blue-200"
              >
                <span className="font-bold mr-1">Enquire</span>
              </Button>
            </div>
            <div className="relative hidden md:block h-full top-20 px-4 w-full md:w-[380px] lg:w-[420px]">
              {order.length > 0 && (
                <>
                  <div className="flex gap-1 items-center">
                    <div className="text-xl font-bold">{userTrips.name}</div>
                    <Icon
                      onClick={() => {
                        setShowNamePopup(true);
                      }}
                      className="w-6 cursor-pointer h-6 text-blue-600"
                      icon="akar-icons:pencil"
                    />
                  </div>
                  <div className="mt-3 mb-4 flex items-center gap-2 text-lg font-bold">
                    <span>Your itinerary</span>

                    <div>
                      {/* <TopTooltip
                        showTooltip={itineraryTooltip}
                        className="text-sm !w-[240px] !font-normal"
                        changeTooltipState={() => {
                          setItineraryTooltip(!itineraryTooltip);
                        }}
                      >
                        {order[0].starting_point && `Your trip starts at `}
                        {order[0].starting_point && (
                          <span className="font-bold">
                            {order[0].starting_point},{" "}
                          </span>
                        )}
                        from{" "}
                        <span className="font-bold">
                          {order.length > 0 &&
                            moment(
                              order[0].stay &&
                                !order[0].activity &&
                                !order[0].transport
                                ? order[0].from_date
                                : order[0].activity &&
                                  !order[0].stay &&
                                  !order[0].transport
                                ? order[0].activity_from_date
                                : !order[0].activity &&
                                  !order[0].stay &&
                                  order[0].transport
                                ? order[0].transport_from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date <=
                                    order[0].from_date &&
                                  order[0].activity_from_date <=
                                    order[0].transport_from_date
                                ? order[0].activity_from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date >=
                                    order[0].from_date &&
                                  order[0].transport_from_date >=
                                    order[0].from_date
                                ? order[0].from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date >=
                                    order[0].transport_from_date &&
                                  order[0].from_date >=
                                    order[0].transport_from_date
                                ? order[0].transport_from_date
                                : order[0].from_date
                            ).format("MMMM Do")}{" "}
                          to{" "}
                          {order.length > 0 &&
                            moment(
                              order[order.length - 1].stay &&
                                !order[order.length - 1].activity &&
                                !order[order.length - 1].transport
                                ? order[order.length - 1].to_date
                                : !order[order.length - 1].stay &&
                                  !order[order.length - 1].transport &&
                                  order[order.length - 1].activity
                                ? order[order.length - 1].activity_from_date
                                : !order[order.length - 1].stay &&
                                  order[order.length - 1].transport &&
                                  !order[order.length - 1].activity
                                ? order[order.length - 1].transport_from_date
                                : order[order.length - 1].stay &&
                                  order[order.length - 1].activity &&
                                  order[order.length - 1].transport &&
                                  order[order.length - 1].to_date >
                                    order[order.length - 1]
                                      .activity_from_date &&
                                  order[order.length - 1].to_date >
                                    order[order.length - 1].transport_from_date
                                ? new Date(
                                    new Date(
                                      order[order.length - 1].from_date
                                    ).setDate(
                                      new Date(
                                        order[order.length - 1].from_date
                                      ).getDate() +
                                        order[order.length - 1].nights
                                    )
                                  ).toISOString()
                                : order[order.length - 1].stay &&
                                  order[order.length - 1].activity &&
                                  new Date(
                                    order[order.length - 1].activity_from_date
                                  ) >
                                    new Date(
                                      new Date(
                                        order[order.length - 1].from_date
                                      ).setDate(
                                        new Date(
                                          order[order.length - 1].from_date
                                        ).getDate() +
                                          order[order.length - 1].nights
                                      )
                                    )
                                ? order[order.length - 1].activity_from_date
                                : ""
                            ).format("MMMM Do")}
                        </span>
                      </TopTooltip> */}
                    </div>
                  </div>
                </>
              )}
              <div>
                {/* {order.length > 0 && (
                <>
                  <div className="px-2 relative bg-gray-100 py-1 rounded-lg flex gap-2">
                    <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6 fill-current text-gray-500"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464l-.003.001l-.006.003l-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35c-.816.252-1.879.523-2.71.523c-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007l.004-.002h.001"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Day 1</p>
                      <h1 className="font-bold">Starting point</h1>
                      {userTrips.starting_point && (
                        <h1 className="font-medium mt-2 text-sm">
                          {userTrips.starting_point}
                        </h1>
                      )}
                      {!userTrips.starting_point && (
                        <h1 className="font-medium mt-2 text-red-500 text-sm">
                          where are you coming from?
                        </h1>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setShowStartLocation(true);
                      }}
                      className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center absolute top-1 right-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
                </>
              )} */}
              </div>

              {order.map((item, index) => {
                return (
                  <div key={index}>
                    <Trip
                      trip={item}
                      nights={3}
                      index={index}
                      order={order}
                      tripId={item.id}
                      startingDestination={userTrips.starting_point}
                      tripSlug={item.slug}
                      setInfoPopup={setInfoPopup}
                      setShowInfo={setShowInfo}
                    ></Trip>
                    {order.length - 1 !== index && (
                      <div className="flex items-center">
                        <div className="w-[5%] h-16 border-r border-gray-400"></div>

                        {/* <div className="w-fit text-sm ml-1 bg-red-700 bg-opacity-10 px-1.5 font-bold rounded-md">
                          {moment(
                            item.stay && !item.activity
                              ? item.from_date
                              : item.activity && !item.stay
                              ? item.activity_from_date
                              : item.stay &&
                                item.activity &&
                                item.activity_from_date < item.from_date
                              ? item.activity_from_date
                              : item.stay &&
                                item.activity &&
                                item.activity_from_date > item.from_date
                              ? item.from_date
                              : item.from_date
                          ).format("Do")}{" "}
                          -{" "}
                          {moment(
                            order[index + 1].stay && !order[index + 1].activity
                              ? order[index + 1].from_date
                              : order[index + 1].activity &&
                                !order[index + 1].stay
                              ? order[index + 1].activity_from_date
                              : order[index + 1].stay &&
                                order[index + 1].activity &&
                                order[index + 1].activity_from_date <
                                  order[index + 1].from_date
                              ? order[index + 1].activity_from_date
                              : order[index + 1].stay &&
                                order[index + 1].activity &&
                                order[index + 1].activity_from_date >
                                  order[index + 1].from_date
                              ? order[index + 1].from_date
                              : order[index + 1].from_date
                          ).format("Do MMM")}
                        </div> */}
                      </div>
                    )}
                  </div>
                );
              })}
              <>
                {/* {order.length > 0 && !userTrips.transport_back && (
                  <div>
                    <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
                    <div className="px-2 relative bg-gray-100 py-1 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            role="img"
                            className="w-6 h-6 fill-current text-gray-500"
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="0 0 32 32"
                          >
                            <path
                              fill="currentColor"
                              d="M5 4v24h2v-8h20V4H5zm2 2h3v3h3V6h3v3h3V6h3v3h3v3h-3v3h3v3h-3v-3h-3v3h-3v-3h-3v3h-3v-3H7v-3h3V9H7V6zm3 6v3h3v-3h-3zm3 0h3V9h-3v3zm3 0v3h3v-3h-3zm3 0h3V9h-3v3z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Finished</p>
                          <h1 className="font-bold">Back to starting point</h1>
                          <h1 className="font-medium mt-2 text-sm">
                            {userTrips.starting_point ||
                              startingLocationSelected.value}
                          </h1>
                          <h1 className="font-medium mt-2 text-sm text-red-600">
                            No transportation added
                          </h1>
                        </div>

                        <div
                          onClick={() => {
                            changeTransportBack();
                          }}
                          className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center rounded-full absolute top-1 right-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {order.length > 0 && userTrips.transport_back && (
                  <div>
                    <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
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
                          <p className="text-sm font-medium">Finished</p>
                          <h1 className="font-bold">Back to starting point</h1>
                          <h1 className="font-medium mt-2 text-sm">
                            {userTrips.starting_point ||
                              startingLocationSelected.value}
                          </h1>
                        </div>
                      </div>
                      <div className="mt-2">
                        <OrderCard
                          groupTripSlug={userTrips.slug}
                          transport={userTrips.transport_back}
                          transportPage={true}
                          groupTripTransport={true}
                          transportDistance={34009}
                          transportDestination={"Naivasha"}
                          transportStartingPoint={"Nairobi"}
                          transportPrice={1200}
                          checkoutInfo={true}
                        ></OrderCard>
                      </div>
                    </div>
                  </div>
                )} */}
              </>
              <div className=" mt-4">
                <div
                  onClick={() => {
                    setDestinationData({
                      ...destinationData,
                      location: "Nairobi",
                    });
                    setDestinationPopup(true);
                  }}
                  className="py-3 bg-blue-600 bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
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
                  <span>Add a destination</span>
                </div>
              </div>
            </div>
            <div className="fixed lg:w-[calc(78%-450px)] md:w-[calc(100%-420px)] h-[90vh] md:mt-0 top-20 right-4 w-full">
              <div className="mb-2"></div>
              <Map
                trips={order}
                startingPoint={
                  userTrips.starting_point || startingLocationSelected.value
                }
              ></Map>

              <div className="absolute hidden md:flex bottom-5 left-2/4 w-full justify-center -translate-x-2/4">
                <div className="bg-white flex gap-0.5 w-fit rounded-2xl py-1">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          label: router.query.label === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.label === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M16 18a5 5 0 1 1 5-5a5.006 5.006 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3a3.003 3.003 0 0 0-3-3Z"
                      />
                      <path
                        fill="currentColor"
                        d="m16 30l-8.436-9.949a35.076 35.076 0 0 1-.348-.451A10.889 10.889 0 0 1 5 13a11 11 0 0 1 22 0a10.884 10.884 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.812 18.395c.002 0 .234.308.287.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.901 8.901 0 0 0 25 13a9 9 0 1 0-18 0a8.905 8.905 0 0 0 1.813 5.395Z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Labels</span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          stay: router.query.stay === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col justify-center items-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.stay === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M22 20v-7.826a4 4 0 0 0-1.253-2.908l-7.373-6.968a2 2 0 0 0-2.748 0L3.253 9.266A4 4 0 0 0 2 12.174V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Stays</span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          experiences:
                            router.query.experiences === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.experiences === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="w-6 h-6"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                      >
                        <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                        <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                        <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                      </g>
                    </svg>
                    <span className="font-bold text-sm truncate">
                      Experiences
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          transport:
                            router.query.transport === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.transport === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
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
                        d="m20.772 10.155l-1.368-4.104A2.995 2.995 0 0 0 16.559 4H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2 2 0 0 0 2 12v5c0 .738.404 1.376 1 1.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h12v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.277A1.99 1.99 0 0 0 22 17v-5a2 2 0 0 0-1.228-1.845zM7.441 6h9.117c.431 0 .813.274.949.684L18.613 10H5.387l1.105-3.316A1 1 0 0 1 7.441 6zM5.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 16zm13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 16z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">
                      Transport
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          label: router.query.showAll === "show" ? "" : "show",
                          stay: router.query.showAll === "show" ? "" : "show",
                          experiences:
                            router.query.showAll === "show" ? "" : "show",
                          transport:
                            router.query.transport === "show" ? "" : "show",
                          showAll:
                            router.query.showAll === "show" ? "" : "show",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.showAll === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="currentColor"
                        d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486l-.943 1.179z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Show all</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden md:px-4 relative">
          <div className="fixed top-0 w-full bg-white z-20">
            <Navbar
              showDropdown={state.showDropdown}
              currentNavState={state.currentNavState}
              userProfile={userProfile}
              showSearchModal={() => {
                setState({ ...state, showSearchModal: true });
              }}
              setCurrentNavState={(currentNavState) => {
                setState({
                  ...state,
                  currentNavState: currentNavState,
                  showCheckOutDate: false,
                  showCheckInDate: false,
                  showPopup: false,
                });
              }}
              changeShowDropdown={() =>
                setState({
                  ...state,
                  showDropdown: !state.showDropdown,
                })
              }
            ></Navbar>
          </div>
          <div className="flex relative h-full w-full">
            <div className="w-[35%] sticky top-[76px] hidden sm:block left-4 h-full">
              <ClientOnly>
                {!currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {totalPrice()
                      ? "$" + Math.ceil(totalPrice()).toLocaleString()
                      : "No data"}
                  </h1>
                )}
                {currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {totalPrice()
                      ? "KES" + Math.ceil(newPrice).toLocaleString()
                      : "No data"}
                  </h1>
                )}
              </ClientOnly>

              <div className="px-2 mt-6 mb-6">
                <ClientOnly>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        initializePayment(onSuccess, onClose);
                      }}
                      className="w-full !py-3 flex text-lg !bg-blue-900 !text-primary-blue-200"
                    >
                      <span className="font-bold mr-1">
                        Chat with an expert
                      </span>

                      <div className={" " + (!loading ? "hidden" : "")}>
                        <LoadingSpinerChase
                          width={20}
                          height={20}
                        ></LoadingSpinerChase>
                      </div>
                    </Button>
                  </div>
                </ClientOnly>
              </div>

              <hr />

              <h1 className="text-xl font-bold mt-2">Chat with an expert</h1>
              <p className="mt-2 text-base">
                Chat with an expert to get advice or enquire on this trip
              </p>

              <Button
                onClick={() => {}}
                className="w-full !py-3 mt-5 flex text-lg !bg-blue-600 !text-primary-blue-200"
              >
                <span className="font-bold mr-1">Enquire</span>
              </Button>
            </div>
            {/* relative top-20 md:w-[380px] lg:w-[420px] sm:right-0 h-full xsMax:w-full px-4 xsMax:mx-0 sm:w-[62%] w-[82%] right-2/4 translate-x-2/4 sm:translate-x-0 */}
            <div className="relative h-full top-20 sm:right-0 xsMax:w-full mx-auto xsMax:mx-0 px-4 sm:w-[62%] w-[82%]">
              {order.length > 0 && (
                <>
                  <div className="flex gap-1 items-center">
                    <div className="text-xl font-bold">{userTrips.name}</div>
                    <Icon
                      onClick={() => {
                        setShowNamePopup(true);
                      }}
                      className="w-6 cursor-pointer h-6 text-blue-600"
                      icon="akar-icons:pencil"
                    />
                  </div>
                  <div className="mt-3 mb-4 flex items-center gap-2 text-lg font-bold">
                    <span>Your itinerary</span>

                    <div>
                      {/* <TopTooltip
                        showTooltip={itineraryTooltip}
                        className="text-sm !w-[240px] !font-normal"
                        changeTooltipState={() => {
                          setItineraryTooltip(!itineraryTooltip);
                        }}
                      >
                        {order[0].starting_point && `Your trip starts at `}
                        {order[0].starting_point && (
                          <span className="font-bold">
                            {order[0].starting_point},{" "}
                          </span>
                        )}
                        from{" "}
                        <span className="font-bold">
                          {order.length > 0 &&
                            moment(
                              order[0].stay &&
                                !order[0].activity &&
                                !order[0].transport
                                ? order[0].from_date
                                : order[0].activity &&
                                  !order[0].stay &&
                                  !order[0].transport
                                ? order[0].activity_from_date
                                : !order[0].activity &&
                                  !order[0].stay &&
                                  order[0].transport
                                ? order[0].transport_from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date <=
                                    order[0].from_date &&
                                  order[0].activity_from_date <=
                                    order[0].transport_from_date
                                ? order[0].activity_from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date >=
                                    order[0].from_date &&
                                  order[0].transport_from_date >=
                                    order[0].from_date
                                ? order[0].from_date
                                : order[0].stay &&
                                  order[0].activity &&
                                  order[0].transport &&
                                  order[0].activity_from_date >=
                                    order[0].transport_from_date &&
                                  order[0].from_date >=
                                    order[0].transport_from_date
                                ? order[0].transport_from_date
                                : order[0].from_date
                            ).format("MMMM Do")}{" "}
                          to{" "}
                          {order.length > 0 &&
                            moment(
                              order[order.length - 1].stay &&
                                !order[order.length - 1].activity &&
                                !order[order.length - 1].transport
                                ? order[order.length - 1].to_date
                                : !order[order.length - 1].stay &&
                                  !order[order.length - 1].transport &&
                                  order[order.length - 1].activity
                                ? order[order.length - 1].activity_from_date
                                : !order[order.length - 1].stay &&
                                  order[order.length - 1].transport &&
                                  !order[order.length - 1].activity
                                ? order[order.length - 1].transport_from_date
                                : order[order.length - 1].stay &&
                                  order[order.length - 1].activity &&
                                  order[order.length - 1].transport &&
                                  order[order.length - 1].to_date >
                                    order[order.length - 1]
                                      .activity_from_date &&
                                  order[order.length - 1].to_date >
                                    order[order.length - 1].transport_from_date
                                ? new Date(
                                    new Date(
                                      order[order.length - 1].from_date
                                    ).setDate(
                                      new Date(
                                        order[order.length - 1].from_date
                                      ).getDate() +
                                        order[order.length - 1].nights
                                    )
                                  ).toISOString()
                                : order[order.length - 1].stay &&
                                  order[order.length - 1].activity &&
                                  new Date(
                                    order[order.length - 1].activity_from_date
                                  ) >
                                    new Date(
                                      new Date(
                                        order[order.length - 1].from_date
                                      ).setDate(
                                        new Date(
                                          order[order.length - 1].from_date
                                        ).getDate() +
                                          order[order.length - 1].nights
                                      )
                                    )
                                ? order[order.length - 1].activity_from_date
                                : ""
                            ).format("MMMM Do")}
                        </span>
                      </TopTooltip> */}
                    </div>
                  </div>
                </>
              )}
              <div>
                {/* {order.length > 0 && (
                <>
                  <div className="px-2 relative bg-gray-100 py-1 rounded-lg flex gap-2">
                    <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6 fill-current text-gray-500"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464l-.003.001l-.006.003l-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35c-.816.252-1.879.523-2.71.523c-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007l.004-.002h.001"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Day 1</p>
                      <h1 className="font-bold">Starting point</h1>
                      {userTrips.starting_point && (
                        <h1 className="font-medium mt-2 text-sm">
                          {userTrips.starting_point}
                        </h1>
                      )}
                      {!userTrips.starting_point && (
                        <h1 className="font-medium mt-2 text-red-500 text-sm">
                          where are you coming from?
                        </h1>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setShowStartLocation(true);
                      }}
                      className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center absolute top-1 right-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
                </>
              )} */}
              </div>
              {order.map((item, index) => {
                return (
                  <div key={index}>
                    <Trip
                      trip={item}
                      nights={3}
                      index={index}
                      order={order}
                      startingDestination={userTrips.starting_point}
                      tripId={item.id}
                      tripSlug={item.slug}
                      setInfoPopup={setInfoPopup}
                      setShowInfo={setShowInfo}
                    ></Trip>
                    {order.length - 1 !== index && (
                      <div className="flex items-center">
                        <div className="w-[5%] h-16 border-r border-gray-400"></div>

                        {/* <div className="w-fit text-sm ml-1 bg-red-700 bg-opacity-10 px-1.5 font-bold rounded-md">
                          {moment(
                            item.stay && !item.activity
                              ? item.from_date
                              : item.activity && !item.stay
                              ? item.activity_from_date
                              : item.stay &&
                                item.activity &&
                                item.activity_from_date < item.from_date
                              ? item.activity_from_date
                              : item.stay &&
                                item.activity &&
                                item.activity_from_date > item.from_date
                              ? item.from_date
                              : item.from_date
                          ).format("Do")}{" "}
                          -{" "}
                          {moment(
                            order[index + 1].stay && !order[index + 1].activity
                              ? order[index + 1].from_date
                              : order[index + 1].activity &&
                                !order[index + 1].stay
                              ? order[index + 1].activity_from_date
                              : order[index + 1].stay &&
                                order[index + 1].activity &&
                                order[index + 1].activity_from_date <
                                  order[index + 1].from_date
                              ? order[index + 1].activity_from_date
                              : order[index + 1].stay &&
                                order[index + 1].activity &&
                                order[index + 1].activity_from_date >
                                  order[index + 1].from_date
                              ? order[index + 1].from_date
                              : order[index + 1].from_date
                          ).format("Do MMM")}
                        </div> */}
                      </div>
                    )}
                  </div>
                );
              })}
              <>
                {/* {order.length > 0 && !userTrips.transport_back && (
                <div>
                  <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
                  <div className="px-2 relative bg-gray-100 py-1 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          className="w-6 h-6 fill-current text-gray-500"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 32 32"
                        >
                          <path
                            fill="currentColor"
                            d="M5 4v24h2v-8h20V4H5zm2 2h3v3h3V6h3v3h3V6h3v3h3v3h-3v3h3v3h-3v-3h-3v3h-3v-3h-3v3h-3v-3H7v-3h3V9H7V6zm3 6v3h3v-3h-3zm3 0h3V9h-3v3zm3 0v3h3v-3h-3zm3 0h3V9h-3v3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Finished</p>
                        <h1 className="font-bold">Back to starting point</h1>
                        <h1 className="font-medium mt-2 text-sm">
                          {userTrips.starting_point ||
                            startingLocationSelected.value}
                        </h1>
                        <h1 className="font-medium mt-2 text-sm text-red-600">
                          No transportation added
                        </h1>
                      </div>

                      {!showTransportOptionsPopup && (
                        <div
                          onClick={() => {
                            setShowTransportOptionsPopup(true);
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

                      {showTransportOptionsPopup && (
                        <div
                          onClick={() => {
                            setShowTransportOptionsPopup(false);
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
                    <div
                      onMouseLeave={() =>
                        setState({ ...state, showNavigation: false })
                      }
                      onMouseEnter={() =>
                        setState({ ...state, showNavigation: true })
                      }
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
                          (!showTransportOptionsPopup ? "hidden" : "")
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
                                groupTripSlug={userTrips.slug}
                                isGroupTripTransport={true}
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
                  </div>
                </div>
              )}

              {order.length > 0 && userTrips.transport_back && (
                <div>
                  <div className="w-2/4 h-12 mt-1 border-r border-gray-400"></div>
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
                        <p className="text-sm font-medium">Finished</p>
                        <h1 className="font-bold">Back to starting point</h1>
                        <h1 className="font-medium mt-2 text-sm">
                          {userTrips.starting_point ||
                            startingLocationSelected.value}
                        </h1>
                      </div>
                    </div>
                    <div className="mt-2">
                      <OrderCard
                        groupTripSlug={userTrips.slug}
                        transport={userTrips.transport_back}
                        transportPage={true}
                        groupTripTransport={true}
                        transportDistance={34009}
                        transportDestination={"Naivasha"}
                        transportStartingPoint={"Nairobi"}
                        transportPrice={1200}
                        checkoutInfo={true}
                      ></OrderCard>
                    </div>
                  </div>
                </div>
              )} */}
              </>

              <div className=" mt-4">
                <div
                  onClick={() => {
                    setDestinationData({
                      ...destinationData,
                      location: "Nairobi",
                    });
                    setDestinationPopup(true);
                  }}
                  className="py-3 bg-blue-600 bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
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
                  <span>Add a destination</span>
                </div>
              </div>
            </div>
          </div>

          {!showMap && (
            <div
              onClick={() => {
                setShowMap(true);
              }}
              className="md:hidden top-[72px] flex items-center gap-0.5 cursor-pointer text-sm bg-blue-600 bg-opacity-90 text-white shadow-sm right-4 fixed px-2 py-1 rounded-3xl font-bold"
            >
              <span>map</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    d="m8.368 4.79l-2.736-.913A2 2 0 0 0 3 5.775v11.783a2 2 0 0 0 1.368 1.898l4 1.333a2 2 0 0 0 1.264 0l4.736-1.578a2 2 0 0 1 1.264 0l2.736.912A2 2 0 0 0 21 18.224V6.442a2 2 0 0 0-1.367-1.898l-4-1.333a2 2 0 0 0-1.265 0L9.631 4.789a2 2 0 0 1-1.264 0Z"
                  />
                  <path d="M9 5v16m6-18v16" />
                </g>
              </svg>
            </div>
          )}

          {showMap && (
            <div
              onClick={() => {
                setShowMap(false);
              }}
              className="md:hidden cursor-pointer z-40 top-[12px] flex items-center gap-0.5 text-sm bg-blue-600 bg-opacity-90 text-white shadow-sm left-4 fixed px-2 py-1 rounded-3xl font-bold"
            >
              <span>hide map</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    d="m8.368 4.79l-2.736-.913A2 2 0 0 0 3 5.775v11.783a2 2 0 0 0 1.368 1.898l4 1.333a2 2 0 0 0 1.264 0l4.736-1.578a2 2 0 0 1 1.264 0l2.736.912A2 2 0 0 0 21 18.224V6.442a2 2 0 0 0-1.367-1.898l-4-1.333a2 2 0 0 0-1.265 0L9.631 4.789a2 2 0 0 1-1.264 0Z"
                  />
                  <path d="M9 5v16m6-18v16" />
                </g>
              </svg>
            </div>
          )}

          {showMap && (
            <div className="w-full md:hidden h-[93vh] top-0 left-0 right-0 sm:flex gap-2 absolute xsMax:mb-3">
              <Map
                trips={order}
                startingPoint={
                  userTrips.starting_point || startingLocationSelected.value
                }
              ></Map>

              <div className="absolute flex bottom-5 z-40 w-full justify-center">
                <div className="bg-white flex gap-0.5 w-fit rounded-2xl py-1">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          label: router.query.label === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.label === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M16 18a5 5 0 1 1 5-5a5.006 5.006 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3a3.003 3.003 0 0 0-3-3Z"
                      />
                      <path
                        fill="currentColor"
                        d="m16 30l-8.436-9.949a35.076 35.076 0 0 1-.348-.451A10.889 10.889 0 0 1 5 13a11 11 0 0 1 22 0a10.884 10.884 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.812 18.395c.002 0 .234.308.287.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.901 8.901 0 0 0 25 13a9 9 0 1 0-18 0a8.905 8.905 0 0 0 1.813 5.395Z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Labels</span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          stay: router.query.stay === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col justify-center items-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.stay === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M22 20v-7.826a4 4 0 0 0-1.253-2.908l-7.373-6.968a2 2 0 0 0-2.748 0L3.253 9.266A4 4 0 0 0 2 12.174V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Stays</span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          experiences:
                            router.query.experiences === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.experiences === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="w-6 h-6"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                      >
                        <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                        <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                        <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                      </g>
                    </svg>
                    <span className="font-bold text-sm truncate">
                      Experiences
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          transport:
                            router.query.transport === "show" ? "" : "show",
                          showAll: router.query.showAll === "",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.transport === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
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
                        d="m20.772 10.155l-1.368-4.104A2.995 2.995 0 0 0 16.559 4H7.441a2.995 2.995 0 0 0-2.845 2.051l-1.368 4.104A2 2 0 0 0 2 12v5c0 .738.404 1.376 1 1.723V21a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h12v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.277A1.99 1.99 0 0 0 22 17v-5a2 2 0 0 0-1.228-1.845zM7.441 6h9.117c.431 0 .813.274.949.684L18.613 10H5.387l1.105-3.316A1 1 0 0 1 7.441 6zM5.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5.5 16zm13 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 18.5 16z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">
                      Transport
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          label: router.query.showAll === "show" ? "" : "show",
                          stay: router.query.showAll === "show" ? "" : "show",
                          experiences:
                            router.query.showAll === "show" ? "" : "show",
                          transport:
                            router.query.transport === "show" ? "" : "show",
                          showAll:
                            router.query.showAll === "show" ? "" : "show",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.showAll === "show"
                        ? "bg-blue-400 hover:bg-blue-500"
                        : "hover:bg-gray-300")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="currentColor"
                        d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14l.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486l-.943 1.179z"
                      />
                    </svg>
                    <span className="font-bold text-sm truncate">Show all</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <ModalPopup
            showModal={destinationPopup}
            closeModal={() => {
              setDestinationPopup(false);
            }}
            containerHeight={40}
            heightVal="%"
            title="New Destination"
            className="px-4 md:w-[500px]"
          >
            <Destination
              className="shadow-none"
              data={destinationData}
            ></Destination>
          </ModalPopup>
        </div>

        <div>
          <OpenModal
            showModal={showNamePopup}
            closeModal={() => {
              setShowNamePopup(false);
            }}
            containerHeight={80}
            className="px-4 md:w-[500px] w-[95%] h-fit"
          >
            <h1 className="text-2xl mt-4 font-bold mb-4">Edit name of trip</h1>

            <Input
              name="name"
              type="text"
              value={nameOfTrip}
              onChange={(event) => {
                setNameOfTrip(event.target.value);
              }}
              label="Location"
            ></Input>

            <div>
              <Button
                onClick={() => {
                  updateName();
                }}
                disabled={!nameOfTrip}
                className={
                  "flex text-lg !bg-blue-600 !w-fit mt-6 !py-2 " +
                  (!nameOfTrip ? " !opacity-70 cursor-not-allowed" : "")
                }
              >
                <span className="mr-2 font-bold">Update</span>

                {nameOfTripLoading && (
                  <div>
                    <LoadingSpinerChase
                      width={18}
                      height={18}
                    ></LoadingSpinerChase>
                  </div>
                )}
              </Button>
            </div>
          </OpenModal>
        </div>

        <div className="">
          <OpenModal
            showModal={showStartLocation}
            closeModal={() => {
              setShowStartLocation(false);
            }}
            containerHeight={80}
            className="px-4 md:w-[500px] w-[95%] h-fit"
          >
            <h1 className="font-bold text-xl">Starting Location</h1>

            <div className="mt-6">
              <SelectInput
                selectedOption={startingLocationSelected}
                setSelectedOption={setStartingLocationSelected}
                className="border border-gray-100"
                instanceId="location"
                options={locations}
                placeholder="Your Location"
                isSearchable={true}
              ></SelectInput>
            </div>

            <div className="mt-8">
              <h1 className="font-bold mb-1">Custom search</h1>
              <Search location={location} setLocation={setLocation}></Search>
            </div>

            <Button
              onClick={() => {
                updateStartingLocation();
              }}
              className="flex text-lg !bg-blue-600 mt-16 !text-primary-blue-200"
            >
              <span className="mr-2">Done</span>

              {showStartLocationLoading && (
                <div>
                  <LoadingSpinerChase
                    width={18}
                    height={18}
                  ></LoadingSpinerChase>
                </div>
              )}
            </Button>
          </OpenModal>
        </div>

        <div className="">
          <OpenModal
            showModal={showInfo}
            closeModal={() => {
              setShowInfo(false);
            }}
            containerHeight={80}
            className="px-4 md:w-[450px]"
          >
            {infoPopup && (
              <div>
                {order.map((item, index) => (
                  <OrderItem
                    key={index}
                    order={item}
                    userProfile={userProfile}
                    cartIndex={index}
                    setShowInfo={setShowInfo}
                  ></OrderItem>
                ))}
              </div>
            )}
            {!infoPopup && (
              <div className="flex justify-center items-center">
                <LoadingSpinerChase
                  color="#000"
                  width={30}
                  height={30}
                ></LoadingSpinerChase>
              </div>
            )}
          </OpenModal>
        </div>
      </div>
    );
  }

  return (
    <div>
      {nothingInOrder}
      {showItemsInOrder}
    </div>
  );
}

PlanTrip.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const stay = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const activitiesOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const transportOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/trips/${context.query.slug}/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        allOrders: stay.data.results,
        userTrips: data,
        activitiesOrders: activitiesOrders.data.results,
        transportOrders: transportOrders.data.results,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    } else if (error.response && error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          allOrders: [],
          activitiesOrders: [],
          transportOrders: [],
          userTrips: [],
        },
      };
    }
  }
}

export default PlanTrip;
