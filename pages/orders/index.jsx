import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import { priceConversionRateFunc } from "../../lib/PriceRate";
import { usePaystackPayment } from "react-paystack";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import OrderItemActivities from "../../components/Cart/OrderItemActivities";
import ResponsiveModal from "../../components/ui/ResponsiveModal";
import Destination from "../../components/Order/Destination";

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

    location = location
      .toString()
      .replace("[", " ")
      .replace("]", " ")
      .replaceAll(",", " ");

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

  if (allOrders.length === 0 && activitiesOrders.length === 0) {
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

  if (allOrders.length > 0 || activitiesOrders.length > 0) {
    showItemsInOrder = (
      <div>
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
              {allOrders.length > 0 && (
                <div className="mt-2 ml-4 text-xl font-bold">
                  Stays - Your Basket
                </div>
              )}
              <div className="flex flex-col">
                {allOrders.map((item, index) => (
                  <CartItem
                    checkoutInfo={true}
                    key={item.id}
                    stay={item.stay}
                    cartIndex={index}
                    orderId={item.id}
                    setShowInfo={setShowInfo}
                    orderDays={item.days}
                    lengthOfItems={allOrders.length}
                    setInfoPopup={setInfoPopup}
                    itemType="order"
                  ></CartItem>
                ))}
              </div>

              {activitiesOrders.length > 0 && (
                <div className="mt-2 ml-4 text-xl font-bold">
                  Experiences - Your Basket
                </div>
              )}
              <div className="flex flex-col">
                {activitiesOrders.map((item, index) => (
                  <CartItem
                    checkoutInfo={true}
                    key={item.id}
                    activity={item.activity}
                    cartIndex={index}
                    orderId={item.id}
                    setShowInfo={setShowInfo}
                    orderDays={item.days}
                    activitiesPage={true}
                    lengthOfItems={activitiesOrders.length}
                    setInfoPopup={setInfoPopup}
                    itemType="order"
                  ></CartItem>
                ))}
              </div>
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
              <Map
                staysOrders={allOrders}
                activitiesOrders={activitiesOrders}
              ></Map>

              <div
                onClick={() => {
                  setDestinationPopup(true);
                }}
                className="absolute text-sm top-5 md:hidden left-2 font-bold cursor-pointer bg-white px-2 py-2 rounded-xl shadow-lg"
              >
                Add new destination
              </div>

              <div className="absolute bottom-5 left-2/4 w-full flex justify-center -translate-x-2/4">
                <div className="bg-white flex gap-5 w-fit px-4 rounded-2xl py-1">
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
                      "flex relative flex-col items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                    <span className="font-bold">Labels</span>
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
                      "flex relative flex-col items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                    <span className="font-bold">Stays</span>
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
                      "flex relative flex-col items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
                      (router.query.experiences === "show"
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
                      viewBox="0 0 48 48"
                    >
                      <mask id="svgIDa">
                        <g
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeWidth="4"
                        >
                          <path
                            strokeLinejoin="round"
                            d="M22 14s-2.7 5.293-4 12c-1.3 6.707-1 16-1 16"
                          />
                          <path
                            fill="#fff"
                            strokeLinejoin="round"
                            d="M33.953 23.272c.346.23.893.391 1.428.503c.932.194 1.792-.446 1.768-1.397c-.045-1.774-.737-4.675-4.258-7.014c-3.325-2.207-6.626-2.238-8.708-1.92c-1.187.18-1.66 1.478-.978 2.467c.608.883 1.316 1.774 1.795 1.945c1 .355 2.203-.582 3.08 0c.876.581.615 1.925 1.492 2.507c.876.582 2.013-.18 2.89.402c.875.582.615 1.925 1.491 2.507ZM20 17c.858-.286 1.389-1.226 1.686-1.979c.246-.621.026-1.308-.55-1.648c-1.295-.766-4.06-1.814-8.374-.561c-4.265 1.238-5.39 4.056-5.677 5.715a1.33 1.33 0 0 0 1.178 1.566c.56.062 1.176.034 1.544-.278c.807-.685 1.025-1.582 1.927-1.824c.901-.241 1.679.858 2.58.616c.902-.241 1.026-1.582 1.927-1.824c.902-.241 2.26.717 3.76.217Zm7-11c-2.5 1-5 6-5 8l13-6c-1.38-2.391-5.5-3-8-2Z"
                          />
                          <path
                            fill="#fff"
                            strokeLinejoin="round"
                            d="M20 5c4 1.422 3.38 6.609 2 9L10 5.922C11 4 16 3.578 20 5Z"
                          />
                          <path d="M26 35c8.284 0 13 1.79 13 4s-6.716 4-15 4c-8.284 0-15-1.79-15-4c0-.54.4-1.053 1.125-1.523" />
                        </g>
                      </mask>
                      <path
                        fill="currentColor"
                        d="M0 0h48v48H0z"
                        mask="url(#svgIDa)"
                      />
                    </svg>
                    <span className="font-bold">Experiences</span>
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          label: router.query.showAll === "show" ? "" : "show",
                          stay: router.query.showAll === "show" ? "" : "show",
                          experiences:
                            router.query.showAll === "show" ? "" : "show",
                          showAll:
                            router.query.showAll === "show" ? "" : "show",
                        },
                      });
                    }}
                    className={
                      "flex relative flex-col items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                    <span className="font-bold">Show all</span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="hidden md:flex flex-col items-center gap-4 lg:w-[50%] md:w-[40%]">
              <div className="mb-4 mt-2 ml-4 text-lg">
                {currentCartItemName && <span>Information for </span>}
                <span className="font-bold">{currentCartItemName}</span>
              </div>
              {allOrders.map((item, index) => (
                <OrderItem
                  key={index}
                  order={item}
                  userProfile={userProfile}
                  cartIndex={index}
                  setShowInfo={setShowInfo}
                ></OrderItem>
              ))}
              {activitiesOrders.map((item, index) => (
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
            <div className="bg-white flex gap-2 md:gap-5 w-fit mx-auto px-4 rounded-2xl py-1">
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
                  "flex relative flex-col text-sm items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                <span className="font-bold">Labels</span>
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
                  "flex relative flex-col text-sm items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                <span className="font-bold">Stays</span>
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
                  "flex relative flex-col text-sm items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
                  (router.query.experiences === "show"
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
                  viewBox="0 0 48 48"
                >
                  <mask id="svgIDa">
                    <g
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinejoin="round"
                        d="M22 14s-2.7 5.293-4 12c-1.3 6.707-1 16-1 16"
                      />
                      <path
                        fill="#fff"
                        strokeLinejoin="round"
                        d="M33.953 23.272c.346.23.893.391 1.428.503c.932.194 1.792-.446 1.768-1.397c-.045-1.774-.737-4.675-4.258-7.014c-3.325-2.207-6.626-2.238-8.708-1.92c-1.187.18-1.66 1.478-.978 2.467c.608.883 1.316 1.774 1.795 1.945c1 .355 2.203-.582 3.08 0c.876.581.615 1.925 1.492 2.507c.876.582 2.013-.18 2.89.402c.875.582.615 1.925 1.491 2.507ZM20 17c.858-.286 1.389-1.226 1.686-1.979c.246-.621.026-1.308-.55-1.648c-1.295-.766-4.06-1.814-8.374-.561c-4.265 1.238-5.39 4.056-5.677 5.715a1.33 1.33 0 0 0 1.178 1.566c.56.062 1.176.034 1.544-.278c.807-.685 1.025-1.582 1.927-1.824c.901-.241 1.679.858 2.58.616c.902-.241 1.026-1.582 1.927-1.824c.902-.241 2.26.717 3.76.217Zm7-11c-2.5 1-5 6-5 8l13-6c-1.38-2.391-5.5-3-8-2Z"
                      />
                      <path
                        fill="#fff"
                        strokeLinejoin="round"
                        d="M20 5c4 1.422 3.38 6.609 2 9L10 5.922C11 4 16 3.578 20 5Z"
                      />
                      <path d="M26 35c8.284 0 13 1.79 13 4s-6.716 4-15 4c-8.284 0-15-1.79-15-4c0-.54.4-1.053 1.125-1.523" />
                    </g>
                  </mask>
                  <path
                    fill="currentColor"
                    d="M0 0h48v48H0z"
                    mask="url(#svgIDa)"
                  />
                </svg>
                <span className="font-bold">Experiences</span>
              </div>
              <div
                onClick={() => {
                  router.push({
                    query: {
                      label: router.query.showAll === "show" ? "" : "show",
                      stay: router.query.showAll === "show" ? "" : "show",
                      experiences:
                        router.query.showAll === "show" ? "" : "show",
                      showAll: router.query.showAll === "show" ? "" : "show",
                    },
                  });
                }}
                className={
                  "flex relative flex-col text-sm items-center py-3 px-2 rounded-xl transition-all duration-500 cursor-pointer " +
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
                <span className="font-bold">Show all</span>
              </div>
            </div>

            <ResponsiveModal
              showAllModal={showMoreModal}
              changeShowAllModal={() => {
                setShowMoreModal(!showMoreModal);
              }}
              className="px-4 mt-6"
            >
              {allOrders.length > 0 && (
                <div className="mt-2 ml-4 text-xl font-bold">
                  Stays - Your Basket
                </div>
              )}
              <div className="flex flex-col">
                {allOrders.map((item, index) => (
                  <CartItem
                    checkoutInfo={true}
                    key={item.id}
                    stay={item.stay}
                    cartIndex={index}
                    orderId={item.id}
                    setShowInfo={setShowInfo}
                    orderDays={item.days}
                    lengthOfItems={allOrders.length}
                    setInfoPopup={setInfoPopup}
                    itemType="order-mobile"
                  ></CartItem>
                ))}
              </div>

              {activitiesOrders.length > 0 && (
                <div className="mt-2 ml-4 text-xl font-bold">
                  Experiences - Your Basket
                </div>
              )}
              <div className="flex flex-col">
                {activitiesOrders.map((item, index) => (
                  <CartItem
                    checkoutInfo={true}
                    key={item.id}
                    activity={item.activity}
                    cartIndex={index}
                    orderId={item.id}
                    setShowInfo={setShowInfo}
                    orderDays={item.days}
                    activitiesPage={true}
                    lengthOfItems={activitiesOrders.length}
                    setInfoPopup={setInfoPopup}
                    itemType="order-mobile"
                  ></CartItem>
                ))}
              </div>

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
                  {allOrders.map((item, index) => (
                    <OrderItem
                      key={index}
                      order={item}
                      userProfile={userProfile}
                      cartIndex={index}
                      setShowInfo={setShowInfo}
                    ></OrderItem>
                  ))}
                  {activitiesOrders.map((item, index) => (
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
