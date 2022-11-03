import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import SearchSelect from "../Home/SearchSelect";
import UserDropdown from "../Home/UserDropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ClientOnly from "../ClientOnly";
import { getItemsInBasket } from "../../lib/getItemsInBasket";
import CartItem from "../Cart/CartItem";
import FlightItem from "../Cart/FlightItem";
import PopoverBox from "../ui/Popover";
import { Icon } from "@iconify/react";
import NavbarCurrency from "../ui/NavbarCurrency";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  showSearchOptions = true,
  userProfile,
  isTransport,
  setFlightPopup,
}) {
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const router = useRouter();

  const dispatch = useDispatch();

  const getNumberOfItemsInCartInDatabase = async () => {
    const stayCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const activityCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const transportCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const flightCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/flights`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const totalNumberOfItemsInCart =
      stayCart.data.results.length +
      activityCart.data.results.length +
      transportCart.data.results.length +
      flightCart.data.results.length;

    setNumberOfItemsInCart(totalNumberOfItemsInCart);
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      getNumberOfItemsInCartInDatabase();
    } else if (Cookies.get("cart")) {
      let cookieVal = Cookies.get("cart");

      if (cookieVal !== undefined) {
        cookieVal = JSON.parse(cookieVal);
      }

      const data = [...(cookieVal || [])];

      setNumberOfItemsInCart(data.length);
    }
  }, []);

  const [trips, setTrips] = useState([]);

  const getItemsInTrip = async () => {
    if (Cookies.get("token")) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setTrips(data[0] || []);
    }
  };

  useEffect(() => {
    getItemsInTrip();
  }, []);

  const [cart, setCart] = useState([]);

  const [activitiesCart, setActivitiesCart] = useState([]);

  const [transportCart, setTransportCart] = useState([]);

  const [flightsCart, setFlightsCart] = useState([]);

  const [allItemsInActivityCart, setAllItemsInActivityCart] = useState([]);

  const [allItemsInTransportCart, setAllItemsInTransportCart] = useState([]);

  const [allItemsInCart, setAllItemsInCart] = useState([]);

  const [cartLoading, setCartLoading] = useState(false);

  const getCart = async () => {
    setCartLoading(true);
    const {
      cart,
      activitiesCart,
      allItemsInActivityCart,
      allItemsInCart,
      transportCart,
      flightCart,
      allItemsInTransportCart,
    } = await getItemsInBasket();

    setCart(cart);
    setActivitiesCart(activitiesCart);
    setAllItemsInActivityCart(allItemsInActivityCart);
    setAllItemsInCart(allItemsInCart);
    setTransportCart(transportCart);
    setFlightsCart(flightCart);
    setAllItemsInTransportCart(allItemsInTransportCart);

    setCartLoading(false);
  };

  useEffect(() => {
    getCart();
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  const priceOfTransportCart = (item) => {
    let price = 0;
    if (Cookies.get("token")) {
      price +=
        item.number_of_days * item.transport.price_per_day +
        (item.user_need_a_driver
          ? item.transport.additional_price_with_a_driver * item.number_of_days
          : 0);
    } else {
      price +=
        item.number_of_days * item.price_per_day +
        (item.user_need_a_driver
          ? item.additional_price_with_a_driver * item.number_of_days
          : 0);
    }

    return price;
  };

  return (
    <div className="relative flex items-center justify-between sm:px-8 px-6 md:px-12 lg:px-24 py-4">
      <div className="flex items-center gap-8">
        <Link href="/">
          <a className="font-lobster text-xl relative w-28 h-9 cursor-pointer">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              priority
            ></Image>
          </a>
        </Link>
        {showSearchOptions && (
          <div className="hidden sm:block mt-2">
            <SearchSelect
              setCurrentNavState={setCurrentNavState}
              currentNavState={currentNavState}
            ></SearchSelect>
          </div>
        )}
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          {isTransport && (
            <div
              onClick={() => {
                setFlightPopup(true);
              }}
              className="rounded-3xl md:hidden px-1 sm:px-3 py-1 glass-effect font-bold text-xs sm:text-sm cursor-pointer !bg-gradient-to-r from-pink-600 via-red-600 to-yellow-500 !text-white"
            >
              book flight
            </div>
          )}
          <UserDropdown
            changeShowDropdown={changeShowDropdown}
            showDropdown={showDropdown}
            userProfile={userProfile}
            numberOfItemsInCart={numberOfItemsInCart}
            numberOfTrips={trips.trip && trips.trip.length}
          ></UserDropdown>

          <div
            onClick={() => {
              setShowPopup(!showPopup);
            }}
            className="relative cursor-pointer md:block hidden ml-4 hover:bg-gray-200 transition-all duration-300 ease-linear h-8 w-8 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute top-2/4 right-2/4 -translate-y-2/4 translate-x-2/4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {numberOfItemsInCart > 0 && (
              <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-blue-400 absolute -top-1.5 -right-2 flex items-center justify-center">
                {numberOfItemsInCart}
              </div>
            )}
          </div>
        </div>

        {showPopup && (
          <div className="w-[500px] z-50 hidden md:block h-[400px] rounded-xl bg-white shadow-xl absolute right-6 top-14">
            <div className="h-full overflow-y-scroll">
              {!cartLoading && (
                <div className="p-4">
                  {cart.length > 0 && (
                    <div className="mb-2 mt-2 ml-4 text-lg font-bold">
                      Stays - Your Basket({cart.length})
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between">
                    {cart.map((item, index) => {
                      return (
                        <div key={index} className="w-full">
                          <CartItem
                            cartId={
                              Cookies.get("token")
                                ? allItemsInCart[index].id
                                : null
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
                                ? allItemsInCart[index]
                                    .num_of_children_non_resident
                                : item.num_of_children_non_resident
                            }
                            num_of_adults_non_resident={
                              Cookies.get("token")
                                ? allItemsInCart[index]
                                    .num_of_adults_non_resident
                                : item.num_of_adults_non_resident
                            }
                            plan={
                              Cookies.get("token")
                                ? allItemsInCart[index].plan
                                : item.plan
                            }
                            stayPage={true}
                          ></CartItem>
                        </div>
                      );
                    })}
                  </div>

                  {activitiesCart.length > 0 && (
                    <div className="mb-2 ml-4 text-lg font-bold">
                      Activities - Your Basket({activitiesCart.length})
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between">
                    {activitiesCart.map((item, index) => (
                      <div key={index} className="w-full">
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
                    <div className="mb-4 ml-4 text-lg font-bold">
                      Transport - Your Basket({transportCart.length})
                    </div>
                  )}
                  <div className="flex flex-wrap mb-5 justify-between">
                    {transportCart.map((item, index) => (
                      <div key={index} className="w-full">
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
                              ? allItemsInTransportCart[index]
                                  .user_need_a_driver
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
                            Cookies.get("token")
                              ? allItemsInTransportCart[index]
                              : item
                          )}
                        ></CartItem>
                      </div>
                    ))}
                  </div>

                  {flightsCart.length > 0 && (
                    <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                      Flight - Your Basket({flightsCart.length})
                    </div>
                  )}

                  <div className="flex flex-wrap mb-5 justify-between">
                    {flightsCart.map((item, index) => (
                      <div key={index} className="w-full">
                        <FlightItem flight={item}></FlightItem>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {cart.length === 0 &&
                activitiesCart.length === 0 &&
                transportCart.length === 0 &&
                flightsCart.length === 0 && (
                  <div className="font-bold text-2xl text-center w-full inline-block">
                    <span>Nothing in basket</span>
                  </div>
                )}
            </div>
            <div
              onClick={() => {
                router.push("/cart");
              }}
              className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center font-bold cursor-pointer rounded-b-xl text-white w-full bg-gray-700"
            >
              View in basket
            </div>
          </div>
        )}
        <NavbarCurrency></NavbarCurrency>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
