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

const Cart = ({
  cart,
  userProfile,
  allItemsInCart,
  activitiesCart,
  allItemsInActivityCart,
  transportCart,
  allItemsInTransportCart,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
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
    activitiesCart.forEach((item) => {
      price += item.price;
    });
    transportCart.forEach((item) => {
      price += ((item.distance * 0.001).toFixed(1) / 10) * item.transport.price;
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

  const addToOrders = async () => {
    if (Cookies.get("token")) {
      setLoading(true);
      for (const item of allItemsInCart) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
            {
              stay_id: item.stay.id,
              nights:
                new Date(item.to_date).getDate() -
                new Date(item.from_date).getDate(),
              from_date: new Date(item.from_date),
              activity_id: null,
              transport_id: null,
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
            console.log(err.response.data);
            setLoading(false);
          });
      }
      for (const item of allItemsInActivityCart) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
            {
              activity_id: item.activity.id,
              stay_id: null,
              transport_id: null,
            },
            {
              headers: {
                Authorization: `Token ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            axios.delete(
              `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/${item.id}/`,
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
      for (const item of allItemsInTransportCart) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
            {
              transport_id: item.transport.id,
              stay_id: null,
              activity_id: null,
            },
            {
              headers: {
                Authorization: `Token ${Cookies.get("token")}`,
              },
            }
          )
          .then((res) => {
            axios.delete(
              `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/${item.id}/`,
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
        pathname: "/trip/plan",
        query: {
          stay: "show",
          experiences: "show",
        },
      });
    } else if (!Cookies.get("token")) {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  let showCartItems = "";
  let nothingInCart = "";

  if (
    cart.length === 0 &&
    activitiesCart.length === 0 &&
    transportCart.length === 0
  ) {
    nothingInCart = (
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
        <div className="px-4 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
          <div className="mb-8 mt-4 ml-4 text-xl font-bold">
            Shopping Basket
          </div>
          <div className="flex flex-col items-center mb-12">
            <div className="w-[90%] sm:w-[80%] md:w-[480px] h-[20rem] relative">
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
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (
    cart.length > 0 ||
    activitiesCart.length > 0 ||
    transportCart.length > 0
  ) {
    showCartItems = (
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
          {cart.length > 0 && (
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Stays - Your Basket({cart.length})
            </div>
          )}
          <div className="flex flex-wrap mb-5 justify-between">
            {cart.map((item, index) => (
              <div key={index} className="md:w-[50%] w-full">
                <CartItem
                  cartId={
                    Cookies.get("token") ? allItemsInCart[index].id : null
                  }
                  stay={item}
                  from_date={allItemsInCart[index].from_date}
                  to_date={allItemsInCart[index].to_date}
                  stayPage={true}
                ></CartItem>
              </div>
            ))}
          </div>

          {activitiesCart.length > 0 && (
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Experiences - Your Basket({activitiesCart.length})
            </div>
          )}
          <div className="flex flex-wrap mb-5 justify-between">
            {activitiesCart.map((item, index) => (
              <div key={index} className="md:w-[50%] w-full">
                <CartItem
                  cartId={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].id
                      : null
                  }
                  activity={item}
                  activitiesPage={true}
                ></CartItem>
              </div>
            ))}
          </div>

          {transportCart.length > 0 && (
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Transport - Your Basket({transportCart.length})
            </div>
          )}
          <div className="flex flex-wrap mb-5 justify-between">
            {transportCart.map((item, index) => (
              <div key={index} className="md:w-[50%] w-full">
                <CartItem
                  cartId={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].id
                      : null
                  }
                  transport={item}
                  transportPage={true}
                  transportDistance={allItemsInTransportCart[index].distance}
                  transportDestination={
                    allItemsInTransportCart[index].destination
                  }
                  transportStartingPoint={
                    allItemsInTransportCart[index].starting_point
                  }
                  transportPrice={
                    ((allItemsInTransportCart[index].distance * 0.001).toFixed(
                      1
                    ) /
                      10) *
                    item.price
                  }
                ></CartItem>
              </div>
            ))}
          </div>

          <div className="px-2 mt-6 mb-12 ml-auto md:w-[50%]">
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
                className="w-full !py-3 flex items-center gap-2 text-lg !bg-blue-900 !text-primary-blue-200"
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
        </div>

        <Footer></Footer>
      </div>
    );
  }

  useEffect(() => {
    priceConversion(totalPrice());
  }, [totalPrice(), currencyToDollar, priceConversionRate]);

  return (
    <div>
      {showCartItems}
      {nothingInCart}
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

      const activitiesCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const transportCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/`,
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

      const newActivitiesCart = [];

      activitiesCart.data.results.forEach((result) => {
        newActivitiesCart.push(result.activity);
      });

      const newTransportCart = [];

      transportCart.data.results.forEach((result) => {
        newTransportCart.push(result.transport);
      });

      return {
        props: {
          userProfile: response.data[0],
          cart: newCart,
          activitiesCart: newActivitiesCart,
          allItemsInActivityCart: activitiesCart.data.results,
          allItemsInCart: data.results,
          transportCart: newTransportCart,
          allItemsInTransportCart: transportCart.data.results,
        },
      };
    } else if (cart) {
      const cartItems = [];
      const activitiesCart = [];
      const transportCart = [];

      cart = JSON.parse(decodeURIComponent(cart));

      for (const item of cart) {
        if (item.itemCategory === "stays") {
          await axios
            .get(`${process.env.NEXT_PUBLIC_baseURL}/stays/${item.slug}/`)
            .then((res) => {
              cartItems.push(res.data);
            })
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "activities") {
          await axios
            .get(`${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/`)
            .then((res) => {
              activitiesCart.push(res.data);
            })
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "transport") {
          await axios
            .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/`)
            .then((res) => {
              transportCart.push(res.data);
            })
            .catch((err) => {
              console.log(err.response);
            });
        }
      }

      return {
        props: {
          cart: cartItems,
          userProfile: "",
          activitiesCart: activitiesCart,
          transportCart: transportCart,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        cart: [],
        activitiesCart: [],
        transportCart: [],
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
          activitiesCart: [],
          transportCart: [],
          allItemsInActivityCart: [],
          allItemsInTransportCart: [],
        },
      };
    }
  }
}

export default Cart;
