import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CartItem from "../../components/Cart/CartItem";
import Navbar from "../../components/Stay/Navbar";
import getToken from "../../lib/getToken";
import getCart from "../../lib/getCart";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/Cart.module.css";
import Button from "../../components/ui/Button";
import Footer from "../../components/Home/Footer";

import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import ClientOnly from "../../components/ClientOnly";

const Cart = ({ cart, userProfile, allItemsInCart }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [newPrice, setNewPrice] = useState(null);

  const totalPrice = () => {
    let price = 0;
    cart.forEach((item) => {
      price += item.price;
    });
    return parseFloat(price);
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

  const addToOrders = () => {
    if (Cookies.get("token")) {
      setLoading(true);
      for (const item of allItemsInCart) {
        console.log("Checking...");
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.stay.slug}/add-to-order/`,
            {
              first_name: userProfile.first_name || "",
              last_name: userProfile.last_name || "",
            },
            {
              headers: {
                Authorization: `Token ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            axios.delete(
              `${process.env.NEXT_PUBLIC_baseURL}/user-cart/${item.id}/`,
              {
                headers: {
                  Authorization: `Token ${Cookies.get("token")}`,
                },
              }
            );
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
      router.push({
        pathname: "/orders",
      });
    } else if (!Cookies.get("token")) {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  useEffect(() => {
    priceConversion(totalPrice());
  }, [totalPrice(), currencyToDollar, priceConversionRate]);

  return (
    <div>
      {cart.length > 0 && (
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
          <div className="mb-4 mt-2 ml-4 text-xl font-bold">
            Your Basket({cart.length})
          </div>
          <div className="flex flex-col mb-5 md:w-[60%] mx-auto">
            {cart.map((item) => (
              <CartItem key={item.id} stay={item}></CartItem>
            ))}
          </div>

          <div className="px-4 mt-6 mb-12 md:w-[60%] mx-auto">
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

            <ClientOnly>
              {!Cookies.get("token") && (
                <div className="mt-2 mb-2">
                  You are currently not signed in. To checkout or save these
                  items or see your previously saved items,
                  <Link
                    href={{
                      pathname: "/login",
                      query: { redirect: `${router.asPath}` },
                    }}
                  >
                    <a className="text-blue-500 font-bold">sign in</a>
                  </Link>
                </div>
              )}
            </ClientOnly>

            <div className="flex mt-2 justify-center">
              <Button
                onClick={() => {
                  addToOrders();
                }}
                className="w-full !py-3 flex items-center gap-2 text-lg bg-primary-yellow !text-primary-blue-200"
              >
                <span>Continue to Check Out</span>
                <div className={" " + (!loading ? "hidden" : "")}>
                  <LoadingSpinerChase
                    width={20}
                    height={20}
                  ></LoadingSpinerChase>
                </div>
              </Button>
            </div>
          </div>
          <Footer></Footer>
        </div>
      )}

      {cart.length === 0 && (
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
          <div className="h-screen flex flex-col justify-between overflow-y-scroll">
            <div className="mb-8 mt-4 ml-4 text-xl font-bold">
              Shopping Basket
            </div>
            <div className="flex flex-col items-center mb-12">
              <div className="w-[90%] h-[20rem] relative">
                <Image
                  className="w-full h-full rounded-xl"
                  layout="fill"
                  src="/images/nocart-illustration.jpeg"
                  alt="Image"
                ></Image>
              </div>
              <div className="text-center mt-4 font-bold">
                No item in here. Don&apos;t worry.
              </div>
              <Link href="/stays">
                <a className="font-bold text-center text-blue-800 hover:text-blue-900 transition-all duration-300">
                  check these listings out
                </a>
              </Link>
            </div>
            <Footer></Footer>
          </div>
        </div>
      )}
    </div>
  );
};

Cart.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    let cart = getCart(context);

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
        `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const newCart = [];

      data.results.forEach((result) => {
        newCart.push(result.stay);
      });

      return {
        props: {
          userProfile: response.data[0],
          cart: newCart,
          allItemsInCart: data.results,
        },
      };
    } else if (cart) {
      const cartItems = [];

      cart = JSON.parse(decodeURIComponent(cart));

      for (const item of cart) {
        await axios
          .get(`${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/`)
          .then((res) => {
            cartItems.push(res.data);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
      return {
        props: {
          cart: cartItems,
          userProfile: "",
        },
      };
    }

    return {
      props: {
        userProfile: "",
        cart: [],
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
          cart: [],
        },
      };
    }
  }
}

export default Cart;
