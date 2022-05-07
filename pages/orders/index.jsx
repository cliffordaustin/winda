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
        <div className="md:px-4 relative">
          <div className="md:flex gap-4">
            <div className={"w-full md:px-4 h-[90vh] md:h-[85vh] relative"}>
              {/* <div className="mb-4 mt-2 ml-4 text-xl font-bold">Map</div> */}
              <div className="mb-2"></div>
              <Map
                staysOrders={allOrders}
                activitiesOrders={activitiesOrders}
              ></Map>
            </div>
            <div className="md:w-[450px] hidden md:block lg:w-[500px] relative md:h-[85vh] md:overflow-y-scroll">
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
              <div className="sticky bottom-0 bg-white pt-4 w-full z-40 max-w-[inherit]">
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

          <div className="sm:px-12 mt-10 absolute md:hidden bottom-0 right-0 w-full">
            <ResponsiveModal
              showAllModal={showMoreModal}
              changeShowAllModal={() => {
                setShowMoreModal(!showMoreModal);
              }}
              className="px-4"
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
