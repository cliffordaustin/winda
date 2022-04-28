import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Input from "../../components/ui/Input";
import getToken from "../../lib/getToken";
import getCart from "../../lib/getCart";
import Navbar from "../../components/Stay/Navbar";
import CartItem from "../../components/Cart/CartItem";
import Button from "../../components/ui/Button";
import styles from "../../styles/Cart.module.css";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import OrderItem from "../../components/Cart/OrderItem";
import ModalPopup from "../../components/ui/ModalPopup";
import { priceConversionRateFunc } from "../../lib/PriceRate";
import { usePaystackPayment } from "react-paystack";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";

function Orders({ userProfile, allOrders }) {
  const router = useRouter();

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);
  const currentCartItemName = useSelector(
    (state) => state.home.currentCartItemName
  );
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [newPrice, setNewPrice] = useState(null);

  const [showInfo, setShowInfo] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const totalPrice = () => {
    let price = 0;
    allOrders.forEach((item) => {
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

  // useEffect(() => {
  //   dispatch({
  //     type: "SET_CURRENT_CART_ITEMS",
  //     payload: [],
  //   });
  //   setCheckoutButtonClicked(true);
  // }, []);

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  });

  useEffect(() => {
    dispatch({
      type: "SET_CURRENT_CART_ITEM_NAME",
      payload: allOrders.length > 0 ? allOrders[0].stay.name : "",
    });
  }, []);

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

  const initializePayment = usePaystackPayment(config);

  return (
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
      <div className="px-2 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
        <div className="md:flex md:gap-6 lg:gap-12">
          <div className="md:w-[60%] lg:w-[50%]">
            <div className="mb-4 mt-2 ml-4 text-xl font-bold">Your Basket</div>
            <div className="flex flex-col mb-5">
              {allOrders.map((item, index) => (
                <CartItem
                  checkoutInfo={true}
                  key={item.id}
                  stay={item.stay}
                  cartIndex={index}
                  orderId={item.id}
                  setShowInfo={setShowInfo}
                  orderDays={item.days}
                ></CartItem>
              ))}
            </div>

            <div className="px-2 mt-6 mb-12">
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
            </div>
            <div className="flex mt-2 justify-center">
              <Button
                onClick={() => {
                  initializePayment(onSuccess, onClose);
                }}
                className="w-full !py-3 text-lg !bg-blue-900 !text-primary-blue-200"
              >
                <span className="font-bold mr-2">Pay</span>
                <div className={" " + (!loading ? "hidden" : "")}>
                  <LoadingSpinerChase
                    width={20}
                    height={20}
                  ></LoadingSpinerChase>
                </div>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-4 lg:w-[50%] md:w-[40%]">
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Information for {currentCartItemName}
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
          </div>
        </div>

        <div className="md:hidden">
          <ModalPopup
            showModal={showInfo}
            closeModal={() => {
              setShowInfo(false);
            }}
            containerHeight={80}
            heightVal="%"
            title={"Information for " + currentCartItemName}
            className="px-4"
          >
            {allOrders.map((item, index) => (
              <OrderItem
                key={index}
                order={item}
                userProfile={userProfile}
                cartIndex={index}
                setShowInfo={setShowInfo}
              ></OrderItem>
            ))}
          </ModalPopup>
        </div>
      </div>
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

    return {
      props: {
        userProfile: response.data[0],
        allOrders: data.results,
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
