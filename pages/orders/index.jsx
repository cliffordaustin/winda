import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import { usePaystackPayment } from "react-paystack";
import * as Yup from "yup";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Input from "../../components/ui/Input";
import getToken from "../../lib/getToken";
import getCart from "../../lib/getCart";
import Navbar from "../../components/Stay/Navbar";
import CartItem from "../../components/Cart/CartItem";
import Button from "../../components/ui/Button";
import styles from "../../styles/Cart.module.css";
import OrderItem from "../../components/Cart/OrderItem";
import ModalPopup from "../../components/ui/ModalPopup";
import Map from "../../components/Order/Map";
import { priceConversionRateFunc } from "../../lib/PriceRate";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import OrderItemActivities from "../../components/Cart/OrderItemActivities";
import ResponsiveModal from "../../components/ui/ResponsiveModal";
import Destination from "../../components/Order/Destination";
import { reorder } from "../../lib/random";
import Modal from "../../components/ui/MobileModal";
import TripOverview from "../../components/Order/TripOverview";
import Popup from "../../components/ui/Popup";

function Orders({ userProfile, allOrders, activitiesOrders }) {
  const router = useRouter();

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
    windowSize: 0,
  });

  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const [mobileMap, setMobileMap] = useState(false);

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);
  const activeItem = useSelector((state) => state.order.activeItem);
  const currentCartItemName = useSelector(
    (state) => state.home.currentCartItemName
  );
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [newPrice, setNewPrice] = useState(null);

  const [showInfo, setShowInfo] = useState(false);

  const [loading, setLoading] = useState(false);

  const [infoPopup, setInfoPopup] = useState(true);

  const [showMoreModal, setShowMoreModal] = useState(false);

  const dispatch = useDispatch();

  const totalPrice = () => {
    let price = 0;
    allOrders.forEach((item) => {
      price += item.total_order_price;
    });
    activitiesOrders.forEach((item) => {
      price += item.total_order_price;
    });
    return parseFloat(price);
  };

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
      if (currencyToDollar && priceConversionRate) {
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

  useEffect(() => {
    dispatch({
      type: "SET_ACTIVE_ITEM",
      payload:
        allOrders.length > 0
          ? allOrders[0].stay
          : activitiesOrders.length > 0
          ? activitiesOrders[0].activity
          : null,
    });
  }, []);

  const [uniqueLocation, setUniqueLocation] = useState("");

  const [destinationPopup, setDestinationPopup] = useState(false);

  const [tripOverviewPopup, setTripOverviewPopup] = useState(false);

  const helpReorderPopup = useSelector((state) => state.home.helpReorderPopup);

  const [activities, setActivities] = useState(activitiesOrders);

  const [stays, setStays] = useState(allOrders);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const staysContent = reorder(
      stays,
      result.source.index,
      result.destination.index
    );
    setStays(staysContent);
  };

  const onDragEndActivities = (result) => {
    if (!result.destination) {
      return;
    }

    const activitiesContent = reorder(
      activities,
      result.source.index,
      result.destination.index
    );
    setActivities(activitiesContent);
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: "HIDE_HELP_REORDER_POPUP",
      });
    }, 7000);
  }, []);

  useEffect(() => {
    let location = [];
    allOrders.forEach((item) => {
      if (!location.includes(item.stay.location)) {
        location.push(item.stay.location);
      }
    });

    activitiesOrders.forEach((item) => {
      if (!location.includes(item.activity.location)) {
        location.push(item.activity.location);
      }
    });

    location = location.toString().replace("[", " ").replace("]", " ");

    setUniqueLocation(location);
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
    const stays_id = router.query.stays_id
      ? Number(router.query.stays_id)
      : null;
    const activities_id = router.query.activities_id
      ? Number(router.query.activities_id)
      : null;

    dispatch({
      type: "SET_CURRENT_CART_ITEM_NAME",
      payload:
        router.query.stays_id && allOrders[stays_id]
          ? allOrders[stays_id].stay.name
          : router.query.activities_id && activitiesOrders[activities_id]
          ? activitiesOrders[activities_id].activity.name
          : "",
    });
  }, [router.query.stays_id, router.query.activities_id]);

  useEffect(() => {
    priceConversion(totalPrice());
  }, [totalPrice(), currencyToDollar, priceConversionRate]);

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

  if (stays.length === 0 && activities.length === 0) {
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

  if (stays.length > 0 || activities.length > 0) {
    showItemsInOrder = (
      <div className="relative">
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
        <div className="md:px-4 relative">
          <div className="flex relative h-full w-full">
            <div className="sticky lg:w-[25%] top-24 h-full hidden lg:block">
              <Destination uniqueLocation={uniqueLocation}></Destination>
            </div>
            <div className="relative hidden md:block h-full top-20 px-4 w-full md:w-[380px]">
              {(stays.length > 0 || activities.length > 0) && (
                <div className="mt-2 mb-4 text-xl font-bold text-center">
                  Your itinerary
                </div>
              )}
              {stays.length > 0 && (
                <div className="mt-2 mb-2 ml-4 text-lg font-bold">
                  Stays - Your Basket
                </div>
              )}
              <ClientOnly>
                <div className="flex flex-col">
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEnd(result);
                    }}
                  >
                    <Droppable droppableId="1">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={
                            {
                              // background: snapshot.isDraggingOver
                              //   ? "lightblue"
                              //   : "",
                            }
                          }
                        >
                          {stays.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#fff"
                                        : "",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <CartItem
                                      checkoutInfo={true}
                                      key={item.id}
                                      stay={item.stay}
                                      cartIndex={index}
                                      orderId={item.id}
                                      setShowInfo={setShowInfo}
                                      orderDays={item.days}
                                      lengthOfItems={stays.length}
                                      setInfoPopup={setInfoPopup}
                                      itemType="order"
                                    ></CartItem>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </ClientOnly>

              {activities.length > 0 && (
                <div className="mt-2 mb-2 ml-4 text-lg font-bold">
                  Experiences - Your Basket
                </div>
              )}

              <ClientOnly>
                <div className="flex flex-col">
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEndActivities(result);
                    }}
                  >
                    <Droppable droppableId="1">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={
                            {
                              // background: snapshot.isDraggingOver
                              //   ? "lightblue"
                              //   : "",
                            }
                          }
                        >
                          {activities.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#fff"
                                        : "",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <CartItem
                                      checkoutInfo={true}
                                      key={item.id}
                                      activity={item.activity}
                                      cartIndex={index}
                                      orderId={item.id}
                                      setShowInfo={setShowInfo}
                                      orderDays={item.days}
                                      activitiesPage={true}
                                      lengthOfItems={activities.length}
                                      setInfoPopup={setInfoPopup}
                                      itemType="order"
                                    ></CartItem>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </ClientOnly>
              <div className="sticky bottom-0 bg-white py-2 w-full z-40 max-w-[inherit]">
                {/* <div className="px-2 mt-6 mb-12">
                  <ClientOnly>
                    <div className={styles.priceTotal}>
                      <div className="font-bold">Price Total</div>
                      {currencyToDollar && (
                        <h1 className="font-bold text-lg font-OpenSans">
                          {totalPrice()
                            ? "$" + Math.ceil(newPrice).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                      {!currencyToDollar && (
                        <h1 className="font-bold text-lg font-OpenSans">
                          {totalPrice()
                            ? "KES" + Math.ceil(totalPrice()).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                    </div>
                  </ClientOnly>
                </div> */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      initializePayment(onSuccess, onClose);
                    }}
                    className="w-full !py-3 flex text-lg !bg-blue-900 !text-primary-blue-200"
                  >
                    <span className="font-bold mr-1">Pay</span>
                    <ClientOnly>
                      {currencyToDollar && (
                        <h1 className="font-bold font-OpenSans">
                          {totalPrice()
                            ? "$" + Math.ceil(newPrice).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                      {!currencyToDollar && (
                        <h1 className="font-bold font-OpenSans">
                          {totalPrice()
                            ? "KES" + Math.ceil(totalPrice()).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                    </ClientOnly>
                    <div className={" " + (!loading ? "hidden" : "")}>
                      <LoadingSpinerChase
                        width={20}
                        height={20}
                      ></LoadingSpinerChase>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div className="sticky lg:w-[calc(80%-380px)] md:w-[70%] h-[90vh] mt-16 md:mt-0 top-20 w-full">
              <div className="mb-2"></div>
              <Map staysOrders={stays} activitiesOrders={activities}></Map>

              <div className="absolute top-5 md:hidden left-2 flex gap-2">
                <div
                  onClick={() => {
                    setDestinationPopup(true);
                  }}
                  className="text-sm font-bold cursor-pointer bg-white px-2 py-2 rounded-xl shadow-lg"
                >
                  add new destination
                </div>
                <div
                  onClick={() => {
                    setTripOverviewPopup(true);
                  }}
                  className="text-sm font-bold cursor-pointer bg-white px-2 py-2 rounded-xl shadow-lg"
                >
                  trip overview
                </div>
              </div>

              <div
                onClick={() => {
                  setTripOverviewPopup(true);
                }}
                className="absolute text-sm top-5 hidden md:block left-2 font-bold cursor-pointer bg-white px-2 py-2 rounded-xl shadow-lg"
              >
                trip overview
              </div>

              <div className="absolute hidden md:flex bottom-5 left-2/4 w-full justify-center -translate-x-2/4">
                <div className="bg-white flex gap-2 w-fit px-1 rounded-2xl py-1">
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
                      "flex relative flex-col justify-center items-center just py-1 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                      "flex relative flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                      "flex relative flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                      "flex relative flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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

            {/* <div className="hidden md:flex flex-col items-center gap-4 lg:w-[50%] md:w-[40%]">
              <div className="mb-4 mt-2 ml-4 text-lg">
                {currentCartItemName && <span>Information for </span>}
                <span className="font-bold">{currentCartItemName}</span>
              </div>
              {stays.map((item, index) => (
                <OrderItem
                  key={index}
                  order={item}
                  userProfile={userProfile}
                  cartIndex={index}
                  setShowInfo={setShowInfo}
                ></OrderItem>
              ))}
              {activities.map((item, index) => (
                <OrderItemActivities
                  key={index}
                  order={item}
                  userProfile={userProfile}
                  cartIndex={index}
                  setShowInfo={setShowInfo}
                ></OrderItemActivities>
              ))}
            </div> */}
          </div>

          <div className="sm:px-12 -mb-2 absolute md:hidden bottom-0 right-0 w-full">
            <div className="bg-white flex gap-1 md:gap-5 w-fit mx-auto px-1 sm:px-2 rounded-2xl py-1">
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
                  "flex relative flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                  "flex relative flex-col justify-center items-center just py-1 px-1 sm:px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                  "flex relative flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                <span className="font-bold text-sm truncate">Experiences</span>
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
                  "flex relative flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                <span className="font-bold text-sm truncate">Transport</span>
              </div>
              <div
                onClick={() => {
                  router.push({
                    query: {
                      label: router.query.showAll === "show" ? "" : "show",
                      stay: router.query.showAll === "show" ? "" : "show",
                      experiences:
                        router.query.showAll === "show" ? "" : "show",
                      transport: router.query.showAll === "show" ? "" : "show",
                      showAll: router.query.showAll === "show" ? "" : "show",
                    },
                  });
                }}
                className={
                  "flex relative flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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

            <ResponsiveModal
              showAllModal={showMoreModal}
              changeShowAllModal={() => {
                setShowMoreModal(!showMoreModal);
              }}
              className="px-4 mt-6"
            >
              {stays.length > 0 && (
                <div className="mt-2 mb-2 ml-4 text-lg font-bold">
                  Stays - Your Basket
                </div>
              )}
              <ClientOnly>
                <div className="flex flex-col">
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEnd(result);
                    }}
                  >
                    <Droppable droppableId="1">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={
                            {
                              // background: snapshot.isDraggingOver
                              //   ? "lightblue"
                              //   : "",
                            }
                          }
                        >
                          {stays.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#fff"
                                        : "",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <CartItem
                                      checkoutInfo={true}
                                      key={item.id}
                                      stay={item.stay}
                                      cartIndex={index}
                                      orderId={item.id}
                                      setShowInfo={setShowInfo}
                                      orderDays={item.days}
                                      lengthOfItems={stays.length}
                                      setInfoPopup={setInfoPopup}
                                      itemType="order"
                                    ></CartItem>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </ClientOnly>

              {activities.length > 0 && (
                <div className="mt-2 mb-2 ml-4 text-lg font-bold">
                  Experiences - Your Basket
                </div>
              )}

              <ClientOnly>
                <div className="flex flex-col">
                  <DragDropContext
                    onDragEnd={(result) => {
                      onDragEndActivities(result);
                    }}
                  >
                    <Droppable droppableId="1">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={
                            {
                              // background: snapshot.isDraggingOver
                              //   ? "lightblue"
                              //   : "",
                            }
                          }
                        >
                          {activities.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#fff"
                                        : "",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <CartItem
                                      checkoutInfo={true}
                                      key={item.id}
                                      activity={item.activity}
                                      cartIndex={index}
                                      orderId={item.id}
                                      setShowInfo={setShowInfo}
                                      orderDays={item.days}
                                      activitiesPage={true}
                                      lengthOfItems={activities.length}
                                      setInfoPopup={setInfoPopup}
                                      itemType="order"
                                    ></CartItem>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </ClientOnly>

              <div className="sticky -bottom-4 bg-white pt-4 w-full z-40 max-w-[inherit]">
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      initializePayment(onSuccess, onClose);
                    }}
                    className="w-full !py-3 flex text-lg !bg-blue-900 !text-primary-blue-200"
                  >
                    <span className="font-bold mr-1">Pay</span>
                    <ClientOnly>
                      {currencyToDollar && (
                        <h1 className="font-bold font-OpenSans">
                          {totalPrice()
                            ? "$" + Math.ceil(newPrice).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                      {!currencyToDollar && (
                        <h1 className="font-bold font-OpenSans">
                          {totalPrice()
                            ? "KES" + Math.ceil(totalPrice()).toLocaleString()
                            : "No data"}
                        </h1>
                      )}
                    </ClientOnly>
                    <div className={" " + (!loading ? "hidden" : "")}>
                      <LoadingSpinerChase
                        width={20}
                        height={20}
                      ></LoadingSpinerChase>
                    </div>
                  </Button>
                </div>
              </div>
            </ResponsiveModal>
          </div>

          <div>
            <ModalPopup
              showModal={destinationPopup}
              closeModal={() => {
                setDestinationPopup(false);
              }}
              containerHeight={60}
              heightVal="%"
              title="New Destination"
              className="px-4"
            >
              <Destination className="shadow-none" inPopup={true}></Destination>
            </ModalPopup>
          </div>

          <div>
            <ModalPopup
              showModal={tripOverviewPopup}
              closeModal={() => {
                setTripOverviewPopup(false);
              }}
              containerHeight={60}
              heightVal="%"
              title="Trip Overview"
              className="md:w-[650px] px-4"
            >
              <TripOverview
                staysOrder={stays}
                activitiesOrder={activities}
              ></TripOverview>
            </ModalPopup>
          </div>

          {/* <div className="md:hidden">
            <ModalPopup
              showModal={showInfo}
              closeModal={() => {
                setShowInfo(false);
              }}
              containerHeight={80}
              heightVal="%"
              title={infoPopup ? "Information for " + currentCartItemName : ""}
              className="px-4"
            >
              {infoPopup && (
                <div>
                  {stays.map((item, index) => (
                    <OrderItem
                      key={index}
                      order={item}
                      userProfile={userProfile}
                      cartIndex={index}
                      setShowInfo={setShowInfo}
                    ></OrderItem>
                  ))}
                  {activities.map((item, index) => (
                    <OrderItemActivities
                      key={index}
                      order={item}
                      userProfile={userProfile}
                      cartIndex={index}
                      setShowInfo={setShowInfo}
                    ></OrderItemActivities>
                  ))}
                </div>
              )}
              {!infoPopup && (
                <div className="flex justify-center items-center mt-16">
                  <LoadingSpinerChase
                    color="#000"
                    width={30}
                    height={30}
                  ></LoadingSpinerChase>
                </div>
              )}
            </ModalPopup>
          </div> */}
        </div>

        <ClientOnly>
          <Popup
            showPopup={helpReorderPopup}
            className="fixed md:bottom-8 bottom-4 !z-50 md:left-4 bg-blue-600 font-bold border-none shadow-lg px-2 py-2 md:px-4 md:py-4"
          >
            <div className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="md:w-7 md:h-7 w-6 h-6 text-yellow-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm-2-2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1zm11.5-8.5c0 3.82-2.66 5.86-3.77 6.5H5.27c-1.11-.64-3.77-2.68-3.77-6.5C1.5 5.36 4.86 2 9 2s7.5 3.36 7.5 7.5zm4.87-2.13L20 8l1.37.63L22 10l.63-1.37L24 8l-1.37-.63L22 6l-.63 1.37zM19 6l.94-2.06L22 3l-2.06-.94L19 0l-.94 2.06L16 3l2.06.94L19 6z"
                />
              </svg>
              <span className="text-white">
                Drag and drop your itinerary to reoder your trips
              </span>
            </div>
          </Popup>
        </ClientOnly>
      </div>
    );
  }

  const initializePayment = usePaystackPayment(config);

  return (
    <div>
      {nothingInOrder}
      {showItemsInOrder}
    </div>
  );
}

Orders.propTypes = {};

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

    const { data } = await axios.get(
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

    return {
      props: {
        userProfile: response.data[0],
        allOrders: data.results,
        activitiesOrders: activitiesOrders.data.results,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "login",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          cart: [],
        },
      };
    }
  }
}

export default Orders;
