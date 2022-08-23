import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import ClientOnly from "../ClientOnly";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { priceConversionRateFunc } from "../../lib/PriceRate";
import moment from "moment";

import { getStayPrice, getActivityPrice } from "../../lib/getTotalCartPrice";
import TopTooltip from "../ui/TopTooltip";

import Price from "../Stay/Price";

const CartItem = ({
  stay,
  activity,
  checkoutInfo,
  cartIndex,
  setShowInfo,
  orderDays,
  orderId,
  cartId,
  orderSuccessfull,
  userProfile,
  activitiesPage,
  lengthOfItems,
  setInfoPopup,
  itemType,
  stayPage,
  from_date,
  to_date,
  transportFromDate,
  number_of_people,
  number_of_people_non_resident,
  num_of_adults,
  num_of_children,
  num_of_children_non_resident,
  num_of_adults_non_resident,
  plan,

  number_of_sessions,
  number_of_sessions_non_resident,
  number_of_groups,
  number_of_groups_non_resident,
  pricing_type,

  transportPage,
  transport,
  transportDistance,
  transportDestination,
  transportStartingPoint,
  transportPrice,
  userNeedADriver,
  numberOfDays,
  forOrder,
}) => {
  const currencyToKES = useSelector((state) => state.home.currencyToKES);
  const activeItem = useSelector((state) => state.order.activeItem);
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const [newPrice, setNewPrice] = useState(null);

  const [cartLoading, setCartLoading] = useState(false);

  const [cartAdded, setCartAdded] = useState(false);

  const [listingIsInCart, setListingIsInCart] = useState(false);

  const [showPeopleBooked, setShowPeopleBooked] = useState(false);

  const [removeButtonLoading, setRemoveButtonLoading] = useState(false);

  const [orderAgainLoading, setOrderAgainLoading] = useState(false);

  const price = () => {
    return stayPage && !stay.per_house
      ? getStayPrice(
          plan,
          stay,
          num_of_adults,
          num_of_children,
          num_of_children_non_resident,
          num_of_adults_non_resident
        )
      : stayPage && stay.per_house
      ? stay.per_house_price
      : transportPage
      ? transportPrice
      : getActivityPrice(
          pricing_type,
          activity,
          number_of_people,
          number_of_sessions,
          number_of_groups,
          number_of_people_non_resident,
          number_of_sessions_non_resident,
          number_of_groups_non_resident
        );
  };

  const orderAgain = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setOrderAgainLoading(true);

    if (stayPage) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-order/`,
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
          router.push({
            pathname: "/orders",
            query: { stays_id: 0, activities_id: null },
          });
        })
        .catch((err) => {
          console.log(err);
          setOrderAgainLoading(false);
        });
    } else if (activitiesPage) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/add-to-order/`,
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
          router.push({
            pathname: "/orders",
            query: { stays_id: null, activities_id: 0 },
          });
        })
        .catch((err) => {
          console.log(err);
          setOrderAgainLoading(false);
        });
    } else if (transportPage) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${transport.slug}/add-to-order/`,
          {
            first_name: userProfile.first_name || "",
            last_name: userProfile.last_name || "",
            distance: transportDistance,
            starting_point: transportStartingPoint,
            destination: transportDestination,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          router.push({
            pathname: "/orders",
            query: {
              stay: "show",
              experiences: "show",
            },
          });
        })
        .catch((err) => {
          console.log(err);
          setOrderAgainLoading(false);
        });
    }
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    if (!listingIsInCart) {
      setCartLoading(true);

      if (stayPage) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-cart/`,
            {},
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => {
            setCartLoading(false);
            setCartAdded(true);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else if (activitiesPage) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/add-to-cart/`,
            {},
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => {
            setCartLoading(false);
            setCartAdded(true);
          })
          .catch((err) => {
            console.log(err.response);
          });
      } else if (transportPage) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/transport/${transport.slug}/add-to-cart/`,
            {
              distance: transportDistance,
              starting_point: transportStartingPoint,
              destination: transportDestination,
            },
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => {
            setCartLoading(false);
            setCartAdded(true);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }

      location.reload();
    } else if (listingIsInCart) {
      router.push({
        pathname: "/cart",
      });
    }
  };

  const itemIsInCart = async () => {
    let exist = false;
    let activitiesCartExist = false;

    if (stayPage) {
      const cart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      exist = cart.data.results.some((val) => {
        return val.stay.slug === stay.slug;
      });
    } else if (activitiesPage) {
      const activitiesCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      activitiesCartExist = activitiesCart.data.results.some((val) => {
        return val.activity.slug === activity.slug;
      });
    } else if (transportPage) {
      const transportCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );

      transportCartExist = transportCart.data.results.some((val) => {
        return val.transport.slug === transport.slug;
      });
    }

    setListingIsInCart(exist || transportCartExist);
  };

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  }, []);

  useEffect(() => {
    if (orderSuccessfull) {
      itemIsInCart();
    }
  }, []);

  const setCartId = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (stayPage) {
      setInfoPopup(false);
      router
        .push({ query: { stays_id: cartIndex, activities_id: null } })
        .then(() => {
          setInfoPopup(true);
        });
    } else if (activitiesPage) {
      setInfoPopup(false);
      router
        .push({ query: { activities_id: cartIndex, stays_id: null } })
        .then(() => {
          setInfoPopup(true);
        });
    }

    setShowInfo(true);
  };

  const removeCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    setRemoveButtonLoading(true);

    if (!checkoutInfo) {
      if (token) {
        if (stayPage) {
          await axios
            .delete(`${process.env.NEXT_PUBLIC_baseURL}/user-cart/${cartId}/`, {
              headers: {
                Authorization: "Token " + token,
              },
            })
            .then(() => {
              location.reload();
            })
            .catch((err) => {
              console.log(err.response.data);
              setRemoveButtonLoading(false);
            });
        } else if (activitiesPage) {
          console.log("remove cart");
          await axios
            .delete(
              `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/${cartId}/`,
              {
                headers: {
                  Authorization: "Token " + token,
                },
              }
            )
            .then(() => {
              location.reload();
            })
            .catch((err) => {
              console.log(err.response.data);
              setRemoveButtonLoading(false);
            });
        } else if (transportPage) {
          await axios
            .delete(
              `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/${cartId}/`,
              {
                headers: {
                  Authorization: "Token " + token,
                },
              }
            )
            .then(() => {
              location.reload();
            })
            .catch((err) => {
              console.log(err.response.data);
              setRemoveButtonLoading(false);
            });
        }
      } else if (Cookies.get("cart")) {
        const cart = JSON.parse(decodeURIComponent(Cookies.get("cart")));

        const newCart = [];

        if (stayPage) {
          newCart = cart.filter((el) => el.slug !== stay.slug);
        } else if (activitiesPage) {
          newCart = cart.filter((el) => el.slug !== activity.slug);
        } else if (transportPage) {
          newCart = cart.filter((el) => el.slug !== transport.slug);
        }

        Cookies.set("cart", JSON.stringify(newCart));

        location.reload();
      }
    } else if (checkoutInfo) {
      if (stayPage) {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_baseURL}/user-orders/${orderId}/`,
            {
              stay_id: null,
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
      } else if (activitiesPage) {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_baseURL}/user-orders/${orderId}/`,
            {
              activities_id: null,
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
      } else if (transportPage) {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_baseURL}/user-orders/${orderId}/`,
            {
              transport_id: null,
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
      }
    }
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

  useEffect(() => {
    priceConversion(price());
  }, [price(), currencyToKES, priceConversionRate]);
  const sortedImages = stayPage
    ? stay.stay_images.sort((x, y) => y.main - x.main)
    : transportPage
    ? transport.transportation_images.sort((x, y) => y.main - x.main)
    : activity.activity_images.sort((x, y) => y.main - x.main);
  let mainImage = sortedImages.find((image) => image.main);
  return (
    <div className="relative px-2 mb-3">
      <div
        className="cursor-pointer"
        onClick={() => {
          if (itemType === "order" || "order-mobile") {
            if (stayPage) {
              dispatch({
                type: "SET_ACTIVE_ITEM",
                payload: stay,
              });
            } else if (activitiesPage) {
              dispatch({
                type: "SET_ACTIVE_ITEM",
                payload: activity,
              });
            } else if (transportPage) {
              dispatch({
                type: "SET_ACTIVE_ITEM",
                payload: transport,
              });
            }
          }
        }}
      >
        <div
          className={
            "flex w-full rounded-lg shadow-md relative " +
            (itemType === "order" ? "flex-col" : "")
          }
        >
          <div
            className={
              "w-2/4 justify-between overflow-hidden rounded-md relative " +
              (itemType === "order" && !transportPage
                ? "h-[11rem]"
                : itemType !== "order" && transportPage
                ? "h-[11rem]"
                : "min-h-[10rem]")
            }
          >
            <div className="h-full w-full relative flex-shrink-0 flex-grow-0">
              {mainImage && (
                <Image
                  className="w-full h-full"
                  layout="fill"
                  src={mainImage.image}
                  unoptimized={true}
                  objectFit="cover"
                  alt="Image"
                />
              )}
              {!mainImage && (
                <Image
                  className="w-full h-full"
                  layout="fill"
                  src={sortedImages[0].image}
                  unoptimized={true}
                  objectFit="cover"
                  alt="Image"
                />
              )}
            </div>
          </div>
          <div className={"w-2/4 px-2 pb-1 "}>
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-500 truncate">
                {activitiesPage ? activity.name : stayPage ? stay.name : ""}
              </h1>
              {transportPage && (
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 w-full flex gap-[3px] lowercase">
                    <div className="truncate w-[48%]">
                      {transport.vehicle_make}
                    </div>
                    <span className="-mt-[5px] font-bold text-lg text-black">
                      .
                    </span>
                    <h1 className="truncate w-[48%]">
                      {transport.type_of_car}
                    </h1>
                  </div>
                </div>
              )}
              <ClientOnly>
                <div className="flex items-center">
                  <Price stayPrice={price()}></Price>

                  {transportPage && !numberOfDays && (
                    <span className="inline text-xs mt-1 font-semibold ml-0.5">
                      /for {(transportDistance * 0.001).toFixed(1)}km
                    </span>
                  )}
                  {transportPage && numberOfDays && (
                    <span className="inline text-xs mt-1 font-semibold ml-0.5">
                      /for {numberOfDays} days
                    </span>
                  )}

                  {stayPage && (
                    <span className="inline text-xs mt-1 font-semibold ml-0.5">
                      /night
                    </span>
                  )}
                  {userNeedADriver && (
                    <div className="font-bold text-lg ml-1.5 -mt-1 mr-0.5">
                      {" "}
                      .{" "}
                    </div>
                  )}
                  <ClientOnly>
                    {userNeedADriver && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-5 h-5 text-blue-700"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M15 9.5c0-.438 4.516-3.5 9-3.5s9 3.063 9 3.5c0 1.56-.166 2.484-.306 2.987c-.093.33-.402.513-.745.513H16.051c-.343 0-.652-.183-.745-.513C15.166 11.984 15 11.06 15 9.5Zm7.5-.5a1 1 0 1 0 0 2h3a1 1 0 0 0 0-2h-3Zm-6.462 10.218c-3.33-1.03-2.49-2.87-1.22-4.218H33.46c1.016 1.298 1.561 3.049-1.51 4.097a8 8 0 1 1-15.912.12Zm7.69.782c2.642 0 4.69-.14 6.26-.384a6 6 0 1 1-11.98.069c1.463.202 3.338.315 5.72.315Zm8.689 14.6A9.992 9.992 0 0 0 24 30a9.992 9.992 0 0 0-8.42 4.602a2.49 2.49 0 0 0-1.447-1.05l-1.932-.517a2.5 2.5 0 0 0-3.062 1.767L8.363 37.7a2.5 2.5 0 0 0 1.768 3.062l1.931.518A2.492 2.492 0 0 0 14 41.006A1 1 0 0 0 16 41v-1c0-.381.027-.756.078-1.123l5.204 1.395a3 3 0 0 0 5.436 0l5.204-1.395c.051.367.078.742.078 1.123v1a1 1 0 0 0 2 .01c.56.336 1.252.453 1.933.27l1.932-.517a2.5 2.5 0 0 0 1.768-3.062l-.777-2.898a2.5 2.5 0 0 0-3.062-1.767l-1.932.517a2.49 2.49 0 0 0-1.445 1.046Zm-15.814 2.347A8.008 8.008 0 0 1 23 32.062v4.109a3.007 3.007 0 0 0-1.88 1.987l-4.517-1.21Zm14.794 0A8.009 8.009 0 0 0 25 32.062v4.109c.904.32 1.61 1.06 1.88 1.987l4.517-1.21ZM24 40a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </ClientOnly>
                </div>
              </ClientOnly>
            </div>

            <div>
              {/* {transportPage && !numberOfDays && (
              <div className="flex mt-1">
                <div className="w-5 h-full flex flex-col justify-center self-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="w-4 h-4"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="w-[45%] h-[15px] border-r border-gray-400"></div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="w-4 h-4"
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
                  </div>
                </div>
                <div className="flex flex-col gap-2 overflow-hidden">
                  <div className="truncate">{transportStartingPoint}</div>
                  <div className="truncate">{transportDestination}</div>
                </div>
              </div>
            )} */}
            </div>

            {transportPage && numberOfDays && (
              <div className="flex items-center mt-2 gap-1">
                <div className="w-4 h-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="w-4 h-4"
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
                </div>
                <span className="truncate">{transportStartingPoint}</span>
              </div>
            )}

            <ClientOnly>
              {!checkoutInfo &&
                activitiesPage &&
                pricing_type === "PER PERSON" && (
                  <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 36 36"
                      >
                        <path
                          fill="currentColor"
                          d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                        />
                        <path
                          fill="currentColor"
                          d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                        />
                        <path
                          fill="currentColor"
                          d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                        />
                        <path
                          fill="currentColor"
                          d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                        />
                        <circle
                          cx="17.87"
                          cy="13.45"
                          r="4.47"
                          fill="currentColor"
                        />
                        <path
                          fill="currentColor"
                          d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                        />
                        <path fill="none" d="M0 0h36v36H0z" />
                      </svg>
                      <span>
                        {number_of_people + number_of_people_non_resident}{" "}
                        Guests
                      </span>
                    </div>
                  </div>
                )}
            </ClientOnly>
            <div className="font-bold text-sm truncate mt-1">
              {activitiesPage
                ? activity.location
                : stayPage
                ? stay.location
                : ""}
            </div>

            <ClientOnly>
              {!checkoutInfo && stayPage && (
                <div className="flex items-center gap-1 text-xs mt-1 font-bold truncate flex-wrap">
                  <span>
                    {moment(from_date).format("MMM DD")} -{" "}
                    {moment(to_date).format("MMM DD")}
                  </span>
                  <span className="font-bold text-xl -mt-3">.</span>
                  <span>
                    {new Date(to_date).getDate() -
                      new Date(from_date).getDate()}{" "}
                    nights
                  </span>
                </div>
              )}
            </ClientOnly>

            <ClientOnly>
              {!checkoutInfo && stayPage && stay.per_house && (
                <div className="flex items-center gap-1">
                  <div className="items-center gap-1 text-xs mt-1 font-bold truncate flex-wrap">
                    {num_of_adults > 0 && (
                      <>
                        <span>
                          {num_of_adults}{" "}
                          {num_of_adults > 1 ? "Adults" : "Adult"}
                        </span>
                      </>
                    )}

                    {num_of_children > 0 && (
                      <>
                        <span className="font-bold mx-0.5 ">,</span>
                        <span>
                          {num_of_children}{" "}
                          {num_of_children > 1 ? "Children" : "Child"}
                        </span>
                      </>
                    )}
                  </div>

                  <TopTooltip
                    showTooltip={showPeopleBooked}
                    className="text-sm font-bold !w-[240px] !bg-white border shadow-md"
                    changeTooltipState={() => {
                      setShowPeopleBooked(!showPeopleBooked);
                    }}
                  >
                    <span className="font-medium">You booked for {"  "}</span>
                    {num_of_adults > 0 && (
                      <>
                        <span>
                          {num_of_adults}{" "}
                          {num_of_adults > 1 ? "Adults" : "Adult"}
                        </span>
                      </>
                    )}

                    {num_of_children > 0 && (
                      <>
                        <span className="font-bold mx-0.5 ">,</span>
                        <span>
                          {num_of_children}{" "}
                          {num_of_children > 1 ? "Children" : "Child"}
                        </span>
                      </>
                    )}
                  </TopTooltip>
                </div>
              )}
              {!checkoutInfo && stayPage && !stay.per_house && (
                <div className="flex items-center gap-1">
                  <div className="items-center gap-1 text-xs mt-1 font-bold truncate flex-wrap">
                    {num_of_adults > 0 && (
                      <>
                        {/* <span> */}
                        {num_of_adults}{" "}
                        {num_of_adults > 1
                          ? "Resident Adults"
                          : "Resident Adult"}
                        {/* </span> */}
                      </>
                    )}
                    {num_of_children > 0 && (
                      <>
                        {" - "}
                        {/* <span className="font-bold ">.</span> */}
                        {/* <span> */}
                        {num_of_children}{" "}
                        {num_of_children > 1
                          ? "Resident Children"
                          : "Resident Child"}
                        {/* </span> */}
                      </>
                    )}
                    {num_of_adults_non_resident > 0 && (
                      <>
                        {" - "}
                        {/* <span className="font-bold ">.</span> */}
                        {/* <span> */}
                        {num_of_adults_non_resident}{" "}
                        {num_of_adults_non_resident > 1
                          ? "Non-Resident Adults"
                          : "Non-Resident Adult"}
                        {/* </span> */}
                      </>
                    )}
                    {num_of_children_non_resident > 0 && (
                      <>
                        {" - "}
                        {/* <span className="font-bold ">.</span> */}
                        {/* <span> */}
                        {num_of_children_non_resident}{" "}
                        {num_of_children_non_resident > 1
                          ? "Non-Resident Children"
                          : "Non-Resident Child"}
                        {/* </span> */}
                      </>
                    )}
                  </div>

                  <TopTooltip
                    showTooltip={showPeopleBooked}
                    className="text-sm font-bold !w-[240px] !bg-white border shadow-md"
                    changeTooltipState={() => {
                      setShowPeopleBooked(!showPeopleBooked);
                    }}
                  >
                    <span className="font-medium">You booked for {"  "}</span>
                    {num_of_adults > 0 && (
                      <>
                        <span>
                          {num_of_adults}{" "}
                          {num_of_adults > 1
                            ? "Resident Adults"
                            : "Resident Adult"}
                        </span>
                      </>
                    )}
                    {num_of_children > 0 && (
                      <>
                        {" - "}
                        <span>
                          {num_of_children}{" "}
                          {num_of_children > 1
                            ? "Resident Children"
                            : "Resident Child"}
                        </span>
                      </>
                    )}
                    {num_of_adults_non_resident > 0 && (
                      <>
                        {" - "}
                        <span>
                          {num_of_adults_non_resident}{" "}
                          {num_of_adults_non_resident > 1
                            ? "Non-Resident Adults"
                            : "Non-Resident Adult"}
                        </span>
                      </>
                    )}
                    {num_of_children_non_resident > 0 && (
                      <>
                        {" - "}
                        <span>
                          {num_of_children_non_resident}{" "}
                          {num_of_children_non_resident > 1
                            ? "Non-Resident Children"
                            : "Non-Resident Child"}
                        </span>
                      </>
                    )}
                  </TopTooltip>
                </div>
              )}
            </ClientOnly>

            {transportPage && (
              <div className="flex items-center gap-1 text-xs my-1 font-bold truncate flex-wrap">
                <span className="text-sm font-bold">
                  {moment(transportFromDate).format("Do MMMM YYYY")}
                </span>
              </div>
            )}

            <ClientOnly>
              {!checkoutInfo && activitiesPage && (
                <div className="items-center gap-1 text-xs mt-1 font-bold">
                  {/* <span>{moment(from_date).format("MMM DD")}</span>
                  <span className="font-bold text-xl -mt-3">.</span> */}

                  <span className="inline">
                    {moment(from_date).format("MMM DD")} {" - "}
                  </span>
                  {pricing_type === "PER PERSON" && number_of_people > 0 && (
                    <span>
                      {number_of_people}{" "}
                      {number_of_people > 1 ? "Residents" : "Resident"}
                    </span>
                  )}

                  {pricing_type === "PER SESSION" && number_of_sessions > 0 && (
                    <span>
                      {number_of_sessions}{" "}
                      {number_of_sessions > 1
                        ? "Resident Sessions"
                        : "Resident Session"}
                    </span>
                  )}
                  {pricing_type === "PER GROUP" && number_of_groups > 0 && (
                    <span>
                      {number_of_groups}{" "}
                      {number_of_groups > 1
                        ? "Resident Groups"
                        : "Resident Group"}
                    </span>
                  )}

                  {(number_of_people > 0 ||
                    number_of_sessions > 0 ||
                    number_of_groups > 0) &&
                    "  -  "}

                  {pricing_type === "PER PERSON" &&
                    number_of_people_non_resident > 0 && (
                      <span>
                        {number_of_people_non_resident}{" "}
                        {number_of_people_non_resident > 1
                          ? "Non-Residents"
                          : "Non-Resident"}
                      </span>
                    )}
                  {pricing_type === "PER SESSION" &&
                    number_of_sessions_non_resident > 0 && (
                      <span>
                        {number_of_sessions_non_resident}{" "}
                        {number_of_sessions_non_resident > 1
                          ? "Non-Resident Sessions"
                          : "Non-Resident Session"}
                      </span>
                    )}
                  {pricing_type === "PER GROUP" &&
                    number_of_groups_non_resident > 0 && (
                      <span>
                        {number_of_groups_non_resident}{" "}
                        {number_of_groups_non_resident > 1
                          ? "Non-Resident Groups"
                          : "Non-Resident Group"}
                      </span>
                    )}
                </div>
              )}
            </ClientOnly>

            {checkoutInfo && (
              <div className="font-bold text-sm truncate mt-1">
                Order for {orderDays} days
              </div>
            )}

            <div
              className={
                "flex " + (itemType === "order" ? "gap-2" : "flex-col")
              }
            >
              {checkoutInfo && (
                <div
                  className="text-sm w-fit bg-blue-400 bg-opacity-30 px-2 py-1 text-blue-500 font-bold p-3 rounded-md mt-2
          "
                  onClick={setCartId}
                >
                  Edit detail
                </div>
              )}

              <div className="flex gap-2">
                {!orderSuccessfull && !forOrder && (
                  <div
                    className="text-sm w-fit flex items-center bg-red-400 bg-opacity-30 px-2 py-1 text-red-500 font-bold p-3 rounded-md mt-2
          "
                    onClick={removeCart}
                  >
                    <span className="mr-1">Remove</span>
                    <div
                      className={" " + (!removeButtonLoading ? "hidden" : "")}
                    >
                      <LoadingSpinerChase
                        width={13}
                        height={13}
                        color="red"
                      ></LoadingSpinerChase>
                    </div>
                  </div>
                )}

                <div
                  className="text-sm w-fit xsMax:px-0.5 gap-1 flex items-center bg-blue-400 bg-opacity-30 px-2 py-1 text-blue-500 font-bold p-3 rounded-md mt-2
"
                  onClick={() => {
                    stayPage
                      ? router.push(`/stays/${stay.slug}`)
                      : activitiesPage
                      ? router.push(`/experiences/${activity.slug}`)
                      : transportPage
                      ? router.push(
                          `/transport/?transportSlug=${transport.slug}`
                        )
                      : null;
                  }}
                >
                  <span className="">View</span>
                </div>
              </div>

              {orderSuccessfull && (
                <div
                  className="text-sm w-fit flex items-center bg-green-500 bg-opacity-30 px-2 py-1 text-green-700 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
                  onClick={orderAgain}
                >
                  <span className="mr-1">Order again</span>
                  <div className={" " + (!orderAgainLoading ? "hidden" : "")}>
                    <LoadingSpinerChase
                      width={13}
                      height={13}
                      color="green"
                    ></LoadingSpinerChase>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {stayPage && (
        <div>
          <div className="absolute top-1.5 left-4 z-10 capitalize px-2 rounded-md bg-blue-600 text-sm text-white">
            {plan.toLowerCase()}
          </div>
        </div>
      )}
      <div onClick={addToCart}>
        {orderSuccessfull && (
          <div className="p-2 bg-blue-100 cursor-pointer absolute top-1 right-1 flex items-center justify-center rounded-full">
            {!cartLoading && !cartAdded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
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
            )}
            {!cartLoading && cartAdded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {cartLoading && (
              <LoadingSpinerChase
                width={15}
                height={15}
                color="#000"
              ></LoadingSpinerChase>
            )}
          </div>
        )}

        {orderSuccessfull && !listingIsInCart && !cartLoading && !cartAdded && (
          <div className="absolute top-1.5 right-1.5 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {orderSuccessfull && listingIsInCart && !cartLoading && !cartAdded && (
          <div className="absolute top-1.5 right-1.5 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 cursor-pointer text-blue-900"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

CartItem.propTypes = {
  checkoutInfo: PropTypes.bool,
};

export default CartItem;
