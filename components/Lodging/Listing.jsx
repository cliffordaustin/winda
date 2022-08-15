import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { setActiveStay } from "../../redux/actions/stay";

import Card from "../ui/Card";
import SecondCard from "../ui/SecondCard";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import Button from "../ui/Button";

function Listing({
  listing,
  getDistance,
  userLatLng,
  itemsInCart,
  userProfile,
  itemsInOrders,
  slugIsCorrect,
}) {
  const dispatch = useDispatch();

  const [isSafari, setIsSafari] = useState(false);

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const [liked, setLiked] = useState(listing.has_user_saved);

  const router = useRouter();

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const sortedImages = listing.stay_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState(null);

  const price = () => {
    return (
      listing.price_non_resident ||
      listing.price ||
      listing.per_house_price ||
      listing.deluxe_price_non_resident ||
      listing.deluxe_price ||
      listing.family_room_price_non_resident ||
      listing.family_room_price ||
      listing.executive_suite_room_price_non_resident ||
      listing.executive_suite_room_price ||
      listing.presidential_suite_room_price_non_resident ||
      listing.presidential_suite_room_price ||
      listing.emperor_suite_room_price_non_resident ||
      listing.emperor_suite_room_price
    );
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

  const [cartLoading, setCartLoading] = useState(false);

  const [listingIsInCart, setListingIsInCart] = useState(false);

  const [listingIsInOrder, setListingIsInOrder] = useState(false);

  const addToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    if (!listingIsInCart) {
      setCartLoading(true);

      if (Cookies.get("token")) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${listing.slug}/add-to-cart/`,
            {},
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => {})
          .catch((err) => {
            console.log(err.response);
          });
      } else if (!Cookies.get("token")) {
        setCartLoading(true);
        let cookieVal = Cookies.get("cart");

        if (cookieVal !== undefined) {
          cookieVal = JSON.parse(cookieVal);
        }

        const data = [...(cookieVal || [])];
        const exist = data.some((val) => {
          return val.slug === listing.slug;
        });
        if (!exist) {
          data.push({ slug: listing.slug, itemCategory: "stays" });
          Cookies.set("cart", JSON.stringify(data));
          location.reload();
        }
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
    let stayCartExist = false;
    const token = Cookies.get("token");
    const cart = Cookies.get("cart");

    if (token) {
      stayCartExist = itemsInCart.some((val) => {
        return val.stay.slug === listing.slug;
      });

      setListingIsInCart(exist || stayCartExist);
    } else if (!token && cart) {
      exist = itemsInCart.some((val) => {
        return val.slug === listing.slug;
      });

      setListingIsInCart(exist);
    }
  };

  useEffect(() => {
    itemIsInCart();
  }, [itemsInCart]);

  const itemIsInOrder = async () => {
    let exist = false;
    let stayOrderExist = false;
    const token = Cookies.get("token");

    // console.log(itemsInOrders);

    // if (token) {
    //   stayOrderExist = itemsInOrders.some((val) => {
    //     return val.stay.slug === listing.slug;
    //   });

    //   setListingIsInOrder(exist || stayOrderExist);
    // }
  };

  useEffect(() => {
    itemIsInOrder();
  }, [itemsInOrders]);

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const addToTrip = async () => {
    const token = Cookies.get("token");

    setAddToTripLoading(true);

    if (token) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
          {
            stay_id: listing.id,
            stay_num_of_adults: 1,
            stay_num_of_adults_non_resident: null,
            stay_num_of_children: null,
            stay_num_of_children_non_resident: null,
            stay_plan: "STANDARD",
            from_date: null,
            to_date: null,
            stay_is_not_available: false,
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => {
          router.push({
            pathname: `/trip/plan/${router.query.group_trip}`,
          });
        })
        .catch((err) => {
          setAddToTripLoading(false);
        });
    }
  };

  const changeLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(false);
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${listing.id}/delete/`,
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  const changeUnLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${listing.slug}/save/`,
          "",
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  return (
    <div
      onMouseEnter={() => {
        dispatch(setActiveStay(listing));
      }}
      onMouseLeave={() => {
        dispatch(setActiveStay(null));
      }}
      className="w-full xsMax:!w-full mdMax:!w-47p lgMax:!w-[31.5%] xl:!w-47p !relative select-none"
    >
      <div
        onClick={() => {
          if (router.query.trip) {
            router.push({
              pathname: `stays/${listing.slug}`,
              query: {
                trip: router.query.trip,
                group_trip: router.query.group_trip,
              },
            });
          } else {
            router.push(`stays/${listing.slug}`);
          }
        }}
      >
        <div className="lgMax:block lg:hidden xl:block relative">
          <Card
            imagePaths={images}
            carouselClassName="h-44"
            subCarouselClassName="hidden"
            className={styles.card + " "}
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-500 truncate">{listing.name}</h1>
              {!currencyToKES && (
                <h1 className={"font-bold text-xl font-OpenSans "}>
                  {price()
                    ? "$" + Math.ceil(price()).toLocaleString()
                    : "No data"}
                </h1>
              )}
              {currencyToKES && (
                <h1 className={"font-bold text-xl font-OpenSans "}>
                  {price()
                    ? "KES" + Math.ceil(newPrice).toLocaleString()
                    : "No data"}
                </h1>
              )}
            </div>
            <div className="text-gray-500 flex gap-1 text-sm truncate mt-1 flex-wrap">
              {listing.capacity && (
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
                  <span>{listing.capacity} Guests</span>
                </div>
              )}
              {listing.rooms && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                    />
                  </svg>

                  <span>{listing.rooms} rm</span>
                </div>
              )}
            </div>
            <div className="font-bold text-sm truncate mt-1">
              {listing.location}
            </div>
            {userLatLng.latitude &&
              userLatLng.longitude &&
              listing.latitude &&
              listing.longitude && (
                <div className="text-black text-sm truncate mt-1">
                  {Math.round(
                    getDistance(
                      listing.latitude,
                      listing.longitude,
                      userLatLng.latitude,
                      userLatLng.longitude
                    )
                  ).toLocaleString()}
                  KM Away
                </div>
              )}
            {/* {Cookies.get("token") && router.query.fromOrder === "true" && (
            <div
              className="text-sm w-fit flex items-center bg-green-500 bg-opacity-30 px-2 py-1 text-green-700 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
              onClick={(e) => {
                if (!listingIsInOrder) {
                  addToTrip(e);
                } else if (listingIsInOrder) {
                  e.stopPropagation();
                  router.push({
                    pathname: "/orders",
                    query: {
                      stay: "show",
                      experiences: "show",
                    },
                  });
                }
              }}
            >
              {!listingIsInOrder && <span className="mr-1">Add to trip</span>}
              {listingIsInOrder && (
                <span className="mr-1">View in your trip</span>
              )}
              <div className={" " + (!addToTripLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="green"
                ></LoadingSpinerChase>
              </div>
            </div>
          )} */}
            {/* <div className="flex items-center gap-1 mt-2">
            <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
              <Badge
                className={
                  listing.rating >= 4.5
                    ? "!bg-green-700"
                    : listing.rating >= 4
                    ? "!bg-green-600"
                    : listing.rating >= 3.5
                    ? "!bg-green-500"
                    : listing.rating >= 3
                    ? "!bg-yellow-500"
                    : "!bg-red-500"
                }
              >
                {listing.rating}
              </Badge>
            </div>
            <Rating
              rating={listing.rating}
              fontSize={!isSafari ? 25 : 16}
            ></Rating>
            <div className="font-medium text-sm">({listing.numRating})</div>
          </div> */}

            {slugIsCorrect && (
              <div className="mt-2">
                <Button
                  onClick={() => {
                    addToTrip();
                  }}
                  className="!bg-blue-500 !py-1 flex gap-2 !px-1.5"
                >
                  <span className="text-white text-sm">Add to trip</span>

                  {addToTripLoading && (
                    <div>
                      <LoadingSpinerChase
                        width={14}
                        height={14}
                      ></LoadingSpinerChase>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </Card>
          <div className="absolute rounded-3xl mt-2 mr-2 flex z-10 items-center justify-center gap-0.5 top-0 right-0">
            {liked && (
              <svg
                width="28px"
                height="28px"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                viewBox="0 0 20 20"
                fill="#e63946"
                onClick={(e) => {
                  e.stopPropagation();
                  changeLikeState();
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {!liked && (
              <svg
                width="28px"
                height="28px"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={(e) => {
                  e.stopPropagation();
                  changeUnLikeState();
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </div>

          {/* <div className="absolute top-2 left-2 z-10 px-2 rounded-md text-sm capitalize bg-blue-600 text-white">
            {listing.type_of_stay.toLowerCase()}
          </div> */}
        </div>
      </div>
      <div
        onClick={() => {
          if (router.query.trip) {
            router.push({
              pathname: `stays/${listing.slug}`,
              query: {
                trip: router.query.trip,
                group_trip: router.query.group_trip,
              },
            });
          } else {
            router.push(`stays/${listing.slug}`);
          }
        }}
      >
        <div className="lgMax:hidden lg:block xl:hidden relative">
          <SecondCard
            imagePaths={images}
            carouselClassName="min-h-[200px] !w-[45%]"
            subCarouselClassName="hidden"
            subCarouselContainerClassName="!w-[55%]"
            className={styles.card}
          >
            <div className="relative w-full">
              <div className="flex flex-col gap-1">
                <div className="text-gray-500 truncate w-[90%]">
                  {listing.name}
                </div>

                {!currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {price()
                      ? "$" + Math.ceil(price()).toLocaleString()
                      : "No data"}
                  </h1>
                )}
                {currencyToKES && (
                  <h1 className={"font-bold text-xl font-OpenSans "}>
                    {price()
                      ? "KES" + Math.ceil(newPrice).toLocaleString()
                      : "No data"}
                  </h1>
                )}
              </div>
              <div className="text-gray-500 flex gap-1 text-sm truncate mt-1 flex-wrap">
                {listing.capacity && (
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
                    <span>{listing.capacity} Guests</span>
                  </div>
                )}
                {listing.rooms && (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                      />
                    </svg>

                    <span>{listing.rooms} rm</span>
                  </div>
                )}

                {/* {listing.beds && (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
                      </svg>
                      <span>{listing.beds} bd</span>
                    </div>
                  )}

                  {listing.bathrooms && (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                      </svg>{" "}
                      <span>{listing.bathrooms} ba</span>
                    </div>
                  )} */}
              </div>
              <div className="font-bold text-sm truncate mt-1">
                {listing.location}
              </div>

              {userLatLng.latitude && userLatLng.longitude && (
                <div className="text-black text-sm truncate mt-1">
                  {Math.round(
                    getDistance(
                      listing.latitude,
                      listing.longitude,
                      userLatLng.latitude,
                      userLatLng.longitude
                    )
                  ).toLocaleString()}
                  KM Away
                </div>
              )}

              {slugIsCorrect && (
                <div className="mt-2">
                  <Button
                    onClick={() => {
                      addToTrip();
                    }}
                    className="!bg-blue-500 !py-1 flex gap-2 !px-1.5"
                  >
                    <span className="text-white text-sm">Add to trip</span>

                    {addToTripLoading && (
                      <div>
                        <LoadingSpinerChase
                          width={14}
                          height={14}
                        ></LoadingSpinerChase>
                      </div>
                    )}
                  </Button>
                </div>
              )}
              {/* {Cookies.get("token") && router.query.fromOrder === "true" && (
              <div
                className="text-sm w-fit flex items-center bg-green-500 bg-opacity-30 px-2 py-1 text-green-700 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
                onClick={(e) => {
                  if (!listingIsInOrder) {
                    addToTrip(e);
                  } else if (listingIsInOrder) {
                    e.stopPropagation();
                    router.push({
                      pathname: "/orders",
                      query: {
                        stay: "show",
                        experiences: "show",
                      },
                    });
                  }
                }}
              >
                {!listingIsInOrder && <span className="mr-1">Add to trip</span>}
                {listingIsInOrder && (
                  <span className="mr-1">View in your trip</span>
                )}
                <div className={" " + (!addToTripLoading ? "hidden" : "")}>
                  <LoadingSpinerChase
                    width={13}
                    height={13}
                    color="green"
                  ></LoadingSpinerChase>
                </div>
              </div>
            )} */}
              {/* <div className="flex items-center gap-1 mt-2">
              <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
                <Badge
                  className={
                    listing.rating >= 4.5
                      ? "!bg-green-700"
                      : listing.rating >= 4
                      ? "!bg-green-600"
                      : listing.rating >= 3.5
                      ? "!bg-green-500"
                      : listing.rating >= 3
                      ? "!bg-yellow-500"
                      : "!bg-red-500"
                  }
                >
                  {listing.rating}
                </Badge>
              </div>
              <Rating
                rating={listing.rating}
                fontSize={!isSafari ? 25 : 16}
              ></Rating>
              <div className="font-medium text-sm">({listing.numRating})</div>
            </div> */}

              <div className="absolute flex z-10 bg-white items-center justify-center top-0 right-0">
                {liked && (
                  <svg
                    width="28px"
                    height="28px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="#e63946"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeLikeState();
                    }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {!liked && (
                  <svg
                    width="28px"
                    height="28px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 py-1 rounded-3xl hover:bg-gray-200 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeUnLikeState();
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </SecondCard>
          {/* <div className="absolute top-2 left-2 z-10 px-2 text-sm rounded-md capitalize bg-blue-600 text-white">
            {listing.type_of_stay.toLowerCase()}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Listing;
