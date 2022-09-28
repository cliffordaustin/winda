import React, { useState, useEffect } from "react";
import CartItem from "../../components/Cart/CartItem";
import Navbar from "../../components/Stay/Navbar";
import getToken from "../../lib/getToken";
import getCart from "../../lib/getCart";
import { useSelector } from "react-redux";
import styles from "../../styles/Cart.module.css";
import Button from "../../components/ui/Button";
import Footer from "../../components/Home/Footer";

import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import { checkFlightPrice } from "../../lib/flightLocations";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import ClientOnly from "../../components/ClientOnly";

import { getStayPrice, getActivityPrice } from "../../lib/getTotalCartPrice";
import PopoverBox from "../../components/ui/Popover";
import FlightItem from "../../components/Cart/FlightItem";
import Price from "../../components/Stay/Price";
import ContactBanner from "../../components/Home/ContactBanner";

const Cart = ({
  cart,
  userProfile,
  allItemsInCart,
  activitiesCart,
  flightCart,
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

  const totalPrice = () => {
    let price = 0;
    cart.forEach((item, index) => {
      if (Cookies.get("token")) {
        const nights =
          new Date(allItemsInCart[index].to_date).getDate() -
          new Date(allItemsInCart[index].from_date).getDate();

        if (!allItemsInCart[index].stay.per_house) {
          price +=
            getStayPrice(
              allItemsInCart[index].plan,
              item,
              allItemsInCart[index].num_of_adults,
              allItemsInCart[index].num_of_children,
              allItemsInCart[index].num_of_children_non_resident,
              allItemsInCart[index].num_of_adults_non_resident
            ) * nights;
        } else if (allItemsInCart[index].stay.per_house) {
          price += allItemsInCart[index].stay.per_house_price * nights;
        }
      } else if (!Cookies.get("token") && Cookies.get("cart")) {
        const nights =
          new Date(item.to_date).getDate() - new Date(item.from_date).getDate();

        if (!item.per_house) {
          price +=
            getStayPrice(
              item.plan,
              item,
              item.num_of_adults,
              item.num_of_children,
              item.num_of_children_non_resident,
              item.num_of_adults_non_resident
            ) * nights;
        } else if (item.per_house) {
          price += item.per_house_price * nights;
        }
      }
    });
    activitiesCart.forEach((item, index) => {
      if (Cookies.get("token")) {
        price += getActivityPrice(
          allItemsInActivityCart[index].pricing_type,
          item,
          allItemsInActivityCart[index].number_of_people,
          allItemsInActivityCart[index].number_of_sessions,
          allItemsInActivityCart[index].number_of_groups,
          allItemsInActivityCart[index].number_of_people_non_resident,
          allItemsInActivityCart[index].number_of_sessions_non_resident,
          allItemsInActivityCart[index].number_of_groups_non_resident
        );
      } else if (!Cookies.get("token") && Cookies.get("cart")) {
        price += getActivityPrice(
          item.pricing_type,
          item,
          item.number_of_people,
          item.number_of_people_non_resident,
          item.number_of_sessions,
          item.number_of_sessions_non_resident,
          item.number_of_groups,
          item.number_of_groups_non_resident
        );
      }
    });

    flightCart.forEach((item, index) => {
      price +=
        checkFlightPrice(
          item.starting_point,
          item.destination,
          item.flight_types
        ) * item.number_of_people;
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
              ? item.transport.additional_price_with_a_driver *
                item.number_of_days
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
            (item.user_need_a_driver
              ? item.additional_price_with_a_driver * item.number_of_days
              : 0);
        }
      });
    }
    return parseFloat(price);
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
            ? item.transport.additional_price_with_a_driver *
              item.number_of_days
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
          (item.user_need_a_driver
            ? item.additional_price_with_a_driver * item.number_of_days
            : 0);
      }
    }
    return price;
  };

  const checkout = async () => {
    setLoading(true);
    for (const item of allItemsInCart) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${item.stay.slug}/add-to-order/`,
          {
            first_name: userProfile.first_name || "",
            last_name: userProfile.last_name || "",
            from_date: item.from_date,
            to_date: item.to_date,
            num_of_adults: item.num_of_adults,
            num_of_children: item.num_of_children,
            num_of_adults_non_resident: item.num_of_adults_non_resident,
            num_of_children_non_resident: item.num_of_children_non_resident,
            plan: item.plan,
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
          setLoading(false);
        });
    }
    for (const item of allItemsInActivityCart) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${item.activity.slug}/add-to-order/`,
          {
            first_name: userProfile.first_name || "",
            last_name: userProfile.last_name || "",
            from_date: item.from_date,
            number_of_people: item.number_of_people,
            number_of_people_non_resident: item.number_of_people_non_resident,
            number_of_sessions: item.number_of_sessions,
            number_of_sessions_non_resident:
              item.number_of_sessions_non_resident,
            number_of_groups: item.number_of_groups,
            number_of_groups_non_resident: item.number_of_groups_non_resident,
            pricing_type: item.pricing_type,
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
          setLoading(false);
        });
    }
    for (const item of allItemsInTransportCart) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${item.transport.slug}/add-to-order/`,
          {
            first_name: userProfile.first_name || "",
            last_name: userProfile.last_name || "",
            starting_point: item.starting_point,
            user_need_a_driver: item.user_need_a_driver,
            from_date: item.from_date,
            number_of_days: item.number_of_days,
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
          setLoading(false);
        });
    }
    for (const item of flightCart) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/flights/${item.slug}/`,
          {
            user_has_ordered: true,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => {
          setLoading(false);
        });
    }

    router.push({
      pathname: "/orders",
      query: {
        show_checkout_message: "1",
      },
    });

    setLoading(false);
  };

  if (
    cart.length === 0 &&
    activitiesCart.length === 0 &&
    transportCart.length === 0 &&
    flightCart.length === 0
  ) {
    nothingInCart = (
      <div>
        {/* <ContactBanner></ContactBanner> */}
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
          showCart={false}
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
                unoptimized={true}
                alt="Image"
              ></Image>
            </div>
            <div className="text-center mt-4 font-bold">
              No item in here. Don&apos;t worry.
            </div>

            <PopoverBox
              btnPopover={
                <div className="flex gap-1 items-center justify-center text-blue-800 hover:text-blue-900 transition-all duration-300">
                  <span className="font-bold text-center">
                    explore all our services
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              }
              panelClassName="mt-2 w-[230px] shadow-all md:w-[250px] bg-white rounded-lg overflow-hidden"
            >
              <div
                onClick={() => {
                  router.push("/stays");
                }}
                className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
              >
                Stays
              </div>
              <div
                onClick={() => {
                  router.push("/activities");
                }}
                className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
              >
                Activities
              </div>
              <div
                onClick={() => {
                  router.push("/transport");
                }}
                className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
              >
                Transport
              </div>
              <div
                onClick={() => {
                  router.push("/trip");
                }}
                className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
              >
                Curated trips
              </div>
            </PopoverBox>
          </div>
        </div>
      </div>
    );
  }

  if (
    cart.length > 0 ||
    activitiesCart.length > 0 ||
    transportCart.length > 0 ||
    flightCart.length > 0
  ) {
    showCartItems = (
      <div>
        {/* <ContactBanner></ContactBanner> */}
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
          showCart={false}
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
                        : item.num_of_adults
                    }
                    num_of_children={
                      Cookies.get("token")
                        ? allItemsInCart[index].num_of_children
                        : item.num_of_children
                    }
                    num_of_children_non_resident={
                      Cookies.get("token")
                        ? allItemsInCart[index].num_of_children_non_resident
                        : item.num_of_children_non_resident
                    }
                    num_of_adults_non_resident={
                      Cookies.get("token")
                        ? allItemsInCart[index].num_of_adults_non_resident
                        : item.num_of_adults_non_resident
                    }
                    plan={
                      Cookies.get("token")
                        ? allItemsInCart[index].plan || ""
                        : item.plan || ""
                    }
                    stayPage={true}
                  ></CartItem>
                </div>
              );
            })}
          </div>

          {activitiesCart.length > 0 && (
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Activities - Your Basket({activitiesCart.length})
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
                  number_of_people_non_resident={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index]
                          .number_of_people_non_resident
                      : item.number_of_people_non_resident
                  }
                  number_of_sessions={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].number_of_sessions
                      : item.number_of_sessions
                  }
                  number_of_sessions_non_resident={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index]
                          .number_of_sessions_non_resident
                      : item.number_of_sessions_non_resident
                  }
                  number_of_groups={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].number_of_groups
                      : item.number_of_groups
                  }
                  number_of_groups_non_resident={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index]
                          .number_of_groups_non_resident
                      : item.number_of_groups_non_resident
                  }
                  pricing_type={
                    Cookies.get("token")
                      ? allItemsInActivityCart[index].pricing_type
                      : item.pricing_type
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

          {flightCart.length > 0 && (
            <div className="mb-4 mt-2 ml-4 text-lg font-bold">
              Flight - Your Basket({flightCart.length})
            </div>
          )}

          <div className="flex flex-wrap mb-5 justify-between">
            {flightCart.map((item, index) => (
              <div key={index} className="md:w-[50%] w-full">
                <FlightItem flight={item}></FlightItem>
              </div>
            ))}
          </div>

          <div className="px-2 mt-6 mb-12 ml-auto md:w-[50%]">
            <div className={styles.priceTotal}>
              <div className="font-bold">Price Total</div>

              <Price stayPrice={totalPrice()}></Price>
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
                  if (Cookies.get("token")) {
                    checkout();
                  } else {
                    router.push({
                      pathname: "/login",
                      query: { redirect: `${router.asPath}` },
                    });
                  }
                }}
                className="w-full !py-3 flex items-center gap-2 text-lg !bg-blue-900 !text-primary-blue-200"
              >
                <span>Request to book</span>
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
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-24">
        {showCartItems}
        {nothingInCart}
      </div>
      <div className="fixed left-0 right-0 bottom-0">
        <Footer></Footer>
      </div>
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

      const flightCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
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
          flightCart: flightCart.data.results,
        },
      };
    } else if (cart) {
      const cartItems = [];
      const activitiesCart = [];
      const transportCart = [];
      const flightCart = [];

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
                num_of_adults: item.num_of_adults,
                num_of_children: item.num_of_children,
                num_of_adults_non_resident: item.num_of_adults_non_resident,
                num_of_children_non_resident: item.num_of_children_non_resident,
                plan: item.plan,
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
                number_of_people_non_resident:
                  item.number_of_people_non_resident,
                number_of_sessions: item.number_of_sessions,
                number_of_sessions_non_resident:
                  item.number_of_sessions_non_resident,
                number_of_groups: item.number_of_groups,
                number_of_groups_non_resident:
                  item.number_of_groups_non_resident,
                from_date: item.from_date,
                pricing_type: item.pricing_type,
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
        } else if (item.itemCategory === "flight") {
          if (item.starting_point && item.destination) {
            flightCart.push({
              slug: item.slug,
              starting_point: item.starting_point,
              destination: item.destination,
              number_of_people: item.number_of_people,
              flight_types: item.flight_types,
            });
          }
        }
      }

      return {
        props: {
          cart: cartItems,
          userProfile: "",
          activitiesCart: activitiesCart,
          transportCart: transportCart,
          flightCart: flightCart,
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
        flightCart: [],
        allItemsInActivityCart: [],
        allItemsInCart: [],
        allItemsInTransportCart: [],
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          cart: [],
          activitiesCart: [],
          transportCart: [],
          flightCart: [],
          allItemsInActivityCart: [],
          allItemsInTransportCart: [],
        },
      };
    }
  }
}

export default Cart;
