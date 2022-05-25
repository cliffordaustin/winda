import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import ClientOnly from "../ClientOnly";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { priceConversionRateFunc } from "../../lib/PriceRate";

const OrderCard = ({
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
  transport,
  transportPage,
  transportStartingPoint,
  transportDestination,
  transportDistance,
  transportPrice,
}) => {
  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);
  const activeItem = useSelector((state) => state.order.activeItem);
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const [newPrice, setNewPrice] = useState(null);

  const [removeButtonLoading, setRemoveButtonLoading] = useState(false);

  const price = () => {
    return stayPage
      ? stay.price
      : transportPage
      ? transportPrice
      : activity.price;
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
    }

    setListingIsInCart(exist || activitiesCartExist);
  };

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  }, []);

  useEffect(() => {
    if (orderSuccessfull) {
      itemIsInCart();
    }
  }, []);

  const removeCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    setRemoveButtonLoading(true);

    if (checkoutInfo) {
      if (stayPage) {
        await axios
          .delete(
            `${process.env.NEXT_PUBLIC_baseURL}/user-orders/${orderId}/`,
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
          .delete(
            `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/${orderId}/`,
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
          .delete(
            `${process.env.NEXT_PUBLIC_baseURL}/user-transport-orders/${orderId}/`,
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
      if (currencyToDollar && priceConversionRate) {
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
  }, [price(), currencyToDollar, priceConversionRate]);
  const sortedImages = stayPage
    ? stay.stay_images.sort((x, y) => y.main - x.main)
    : activitiesPage
    ? activity.activity_images.sort((x, y) => y.main - x.main)
    : transportPage
    ? transport.transportation_images.sort((x, y) => y.main - x.main)
    : [];
  let mainImage = sortedImages.find((image) => image.main);
  return (
    <div className="relative mb-6">
      <div
        className="cursor-pointer"
        onClick={() => {
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
          }
        }}
      >
        <div
          className={
            "flex w-full shadow-md relative bg-white rounded-lg py-1 px-1 "
          }
        >
          <div
            className={
              "w-2/4 justify-between overflow-hidden rounded-md relative "
            }
          >
            <div className="h-full w-full relative flex-shrink-0 flex-grow-0">
              <Image
                className="w-full h-full"
                layout="fill"
                src={mainImage.image}
                alt="Image"
              />
            </div>
          </div>
          <div className={"flex-grow-0 flex-shrink-0 px-2 py-2 w-2/4 "}>
            <div className="flex flex-col gap-1 mb-2">
              <h1 className="text-gray-500 truncate">
                {activitiesPage ? activity.name : stayPage ? stay.name : ""}

                {transportPage && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transport.vehicle_color }}
                    ></div>
                    <div className="text-gray-500 flex gap-[3px] lowercase">
                      <h1>{transport.vehicle_make}</h1>
                      <span className="-mt-[5px] font-bold text-lg text-black">
                        .
                      </span>
                      <h1>{transport.type_of_car}</h1>
                    </div>
                  </div>
                )}
              </h1>
              <ClientOnly>
                <div className="flex">
                  {currencyToDollar && (
                    <h1 className="font-bold font-OpenSans">
                      {price()
                        ? "$" + Math.ceil(newPrice).toLocaleString()
                        : "No data"}
                    </h1>
                  )}
                  {!currencyToDollar && (
                    <h1 className="font-bold font-OpenSans">
                      {price()
                        ? "KES" + Math.ceil(price()).toLocaleString()
                        : "No data"}
                    </h1>
                  )}

                  {transportPage && (
                    <span className="inline text-xs mt-2 font-semibold ml-0.5">
                      /for {(transportDistance * 0.001).toFixed(1)}km
                    </span>
                  )}
                </div>
              </ClientOnly>
            </div>

            {transportPage && (
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
            )}

            {stayPage && (
              <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
                {stay.rooms && (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 fill-current text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                      />
                    </svg>

                    <span>{stay.rooms} rm</span>
                  </div>
                )}

                {stay.beds && (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 fill-current text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
                    </svg>
                    <span>{stay.beds} bd</span>
                  </div>
                )}

                {stay.bathrooms && (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 fill-current text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                    </svg>{" "}
                    <span>{stay.bathrooms} ba</span>
                  </div>
                )}
              </div>
            )}

            {activitiesPage && (
              <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
                {activity.capacity && (
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
                    <span>{activity.capacity} Guests</span>
                  </div>
                )}
              </div>
            )}

            <div
              className="text-sm w-fit flex items-center bg-red-400 bg-opacity-30 px-2 py-1 text-red-500 font-bold p-3 rounded-md mt-2
          "
              onClick={removeCart}
            >
              <span className="mr-1">Remove</span>
              <div className={" " + (!removeButtonLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="red"
                ></LoadingSpinerChase>
              </div>
            </div>
          </div>
        </div>
      </div>
      {stayPage && (
        <div>
          {stay.type_of_stay === "LODGE" && (
            <div className="absolute top-1.5 left-2 z-10 px-1 rounded-md bg-green-600 text-white">
              Lodge
            </div>
          )}
          {stay.type_of_stay === "HOUSE" && (
            <div className="absolute top-1.5 left-2 z-10 px-1 rounded-md bg-green-600 text-white">
              House
            </div>
          )}
          {stay.type_of_stay === "UNIQUE SPACE" && (
            <div className="absolute top-1.5 left-2 z-10 px-1 rounded-md bg-green-600 text-white">
              Unique space
            </div>
          )}
          {stay.type_of_stay === "CAMPSITE" && (
            <div className="absolute top-1.5 left-2 z-10 px-1 rounded-md bg-green-600 text-white">
              Campsite
            </div>
          )}
          {stay.type_of_stay === "BOUTIQUE HOTEL" && (
            <div className="absolute top-1.5 left-2 z-10 px-1 rounded-md bg-green-600 text-white">
              Boutique hotel
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OrderCard.propTypes = {
  checkoutInfo: PropTypes.bool,
};

export default OrderCard;
