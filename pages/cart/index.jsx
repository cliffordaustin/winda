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
    cart.forEach((item, index) => {
      if (Cookies.get("token")) {
        const nights =
          new Date(allItemsInCart[index].to_date).getDate() -
          new Date(allItemsInCart[index].from_date).getDate();
        price += item.price * nights;
      } else if (!Cookies.get("token") && Cookies.get("cart")) {
        const nights =
          new Date(item.to_date).getDate() - new Date(item.from_date).getDate();
        price += item.price * nights;
      }
    });
    activitiesCart.forEach((item, index) => {
      if (Cookies.get("token")) {
        price += item.price * allItemsInActivityCart[index].number_of_people;
      } else if (!Cookies.get("token") && Cookies.get("cart")) {
        price += item.price * item.number_of_people;
      }
    });
    if (Cookies.get("token")) {
      allItemsInTransportCart.forEach((item) => {
        if (!item.number_of_days) {
          price +=
            ((item.distance * 0.001).toFixed(1) / 10) * item.transport.price +
            (item.user_need_a_driver
              ? item.transport.additional_price_with_a_driver
              : 0);
        } else if (item.number_of_days) {
          price +=
            item.number_of_days * item.transport.price_per_day +
            (item.user_need_a_driver
              ? item.transport.additional_price_with_a_driver
              : 0);
        }
      });
    } else if (!Cookies.get("token") && Cookies.get("cart")) {
      transportCart.forEach((item) => {
        if (!item.number_of_days) {
          price +=
            ((item.distance * 0.001).toFixed(1) / 10) * item.price +
            (item.user_need_a_driver ? item.additional_price_with_a_driver : 0);
        } else if (item.number_of_days) {
          price +=
            item.number_of_days * item.price_per_day +
            (item.user_need_a_driver ? item.additional_price_with_a_driver : 0);
        }
      });
    }
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
              activity_from_date: new Date(item.from_date),
              number_of_people: item.number_of_people,
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
              number_of_days: item.number_of_days,
              user_need_a_driver: item.user_need_a_driver,
              distance: item.distance,
              starting_point: item.starting_point,
              destination: item.destination,
              transport_from_date: new Date(item.from_date),
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

  const priceOfTransportCart = (item) => {
    let price = 0;
    if (Cookies.get("token")) {
      if (!item.number_of_days) {
        price +=
          ((item.distance * 0.001).toFixed(1) / 10) * item.transport.price +
          (item.user_need_a_driver
            ? item.transport.additional_price_with_a_driver
            : 0);
      } else if (item.number_of_days) {
        price +=
          item.number_of_days * item.transport.price_per_day +
          (item.user_need_a_driver
            ? item.transport.additional_price_with_a_driver
            : 0);
      }
    } else if (!Cookies.get("token") && Cookies.get("cart")) {
      if (!item.number_of_days) {
        price +=
          ((item.distance * 0.001).toFixed(1) / 10) * item.price +
          (item.user_need_a_driver ? item.additional_price_with_a_driver : 0);
      } else if (item.number_of_days) {
        price +=
          item.number_of_days * item.price_per_day +
          (item.user_need_a_driver ? item.additional_price_with_a_driver : 0);
      }
    }
    return price;
  };

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
            {cart.map((item, index) => {
              return (
                <div key={index} className="md:w-[50%] w-full">
                  <CartItem
                    cartId={
                      Cookies.get("token") ? allItemsInCart[index].id : null
                    }
                    stay={item}
                    from_date={
                      Cookies.get("token")
                        ? allItemsInCart[index].from_date
                        : item.from_date
                    }
                    to_date={
                      Cookies.get("token")
                        ? allItemsInCart[index].to_date
                        : item.to_date
                    }
                    num_of_adults={
                      Cookies.get("token")
                        ? allItemsInCart[index].num_of_adults
                        : item.to_date
                    }
                    num_of_children={
                      Cookies.get("token")
                        ? allItemsInCart[index].num_of_children
                        : item.to_date
                    }
                    plan={
                      Cookies.get("token")
                        ? allItemsInCart[index].plan
                        : item.to_date
                    }
                    stayPage={true}
                  ></CartItem>
                </div>
              );
            })}
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
                  from_date={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].from_date
                      : item.from_date
                  }
                  number_of_people={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].number_of_people
                      : item.number_of_people
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
                  transportDistance={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].distance
                      : item.distance
                  }
                  transportFromDate={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].from_date
                      : item.from_date
                  }
                  numberOfDays={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].number_of_days
                      : item.number_of_days
                  }
                  userNeedADriver={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].user_need_a_driver
                      : item.user_need_a_driver
                  }
                  transportDestination={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].destination
                      : item.destination
                  }
                  transportStartingPoint={
                    Cookies.get("token")
                      ? allItemsInTransportCart[index].starting_point
                      : item.starting_point
                  }
                  transportPrice={priceOfTransportCart(
                    Cookies.get("token") ? allItemsInTransportCart[index] : item
                  )}
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
              cartItems.push({
                ...res.data,
                from_date: item.from_date,
                to_date: item.to_date,
              });
            })
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "activities") {
          await axios
            .get(`${process.env.NEXT_PUBLIC_baseURL}/activities/${item.slug}/`)
            .then((res) => {
              activitiesCart.push({
                ...res.data,
                number_of_people: item.number_of_people,
                from_date: item.from_date,
              });
            })
            .catch((err) => {
              console.log(err.response);
            });
        } else if (item.itemCategory === "transport") {
          await axios
            .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/${item.slug}/`)
            .then((res) => {
              transportCart.push({
                ...res.data,
                starting_point: item.starting_point,
                destination: item.destination,
                distance: item.distance,
                user_need_a_driver: item.user_need_a_driver,
                from_date: item.from_date,
                number_of_days: item.number_of_days,
              });
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
          allItemsInActivityCart: [],
          allItemsInCart: [],
          allItemsInTransportCart: [],
        },
      };
    }

    return {
      props: {
        userProfile: "",
        cart: [],
        activitiesCart: [],
        transportCart: [],
        allItemsInActivityCart: [],
        allItemsInCart: [],
        allItemsInTransportCart: [],
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
