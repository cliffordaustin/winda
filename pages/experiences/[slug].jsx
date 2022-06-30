import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Element } from "react-scroll";
import Select from "react-select";
import { createGlobalStyle } from "styled-components";
import moment from "moment";

// import { getServerSideProps } from "../../lib/getServerSideProps";
import Navbar from "../../components/Stay/Navbar";
import ImageGallery from "../../components/Stay/ImageGallery";
import Price from "../../components/Stay/Price";
import Button from "../../components/ui/Button";
import getToken from "../../lib/getToken";
import Map from "../../components/Stay/Map";
import ListItem from "../../components/ui/ListItem";
import DescribesStay from "../../components/Stay/DescribesStay";
import ReviewOverview from "../../components/Stay/ReviewOverview";
import Reviews from "../../components/Stay/Reviews";
import CreateReview from "../../components/Stay/CreateReview";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import Share from "../../components/Stay/Share";
import AllReviews from "../../components/Stay/AllReviews";
import getCart from "../../lib/getCart";
import ClientOnly from "../../components/ClientOnly";
import Footer from "../../components/Home/Footer";
import DatePicker from "../../components/ui/DatePickerOpen";
import Checkbox from "../../components/ui/Checkbox";
import useOnScreen from "../../lib/onScreen";
import Modal from "../../components/ui/FullScreenMobileModal";
import ScrollTo from "../../components/Activities/ScrollTo";

const ActivitiesDetail = ({ userProfile, activity, inCart }) => {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    width: 54px !important;
    height: 54px !important;
  }
`;

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 3,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const dispatch = useDispatch();

  const router = useRouter();

  const [showMoreActivities, setShowMoreActivities] = useState(false);

  const [showAllDescription, setShowAllDescription] = useState(false);
  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [filteredReviews, setFilteredReviews] = useState(null);

  const [showCreateReview, setShowCreateReview] = useState(false);

  const [reviewLoading, setReviewLoading] = useState(false);

  const [liked, setLiked] = useState(activity.has_user_saved);

  const [showShare, setShowShare] = useState(false);

  const [reviewCount, setReviewCount] = useState(0);

  const [nextReview, setNextReview] = useState(null);

  const [prevReview, setPrevReview] = useState(null);

  const [reviewPageSize, setReviewPageSize] = useState(0);

  const scrollToVisible = useRef(null);

  const isVisible = useOnScreen(scrollToVisible);

  const [filterRateVal, setFilterRateVal] = useState(0);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

  const [nonResident, setNonResident] = useState(false);

  const [guestPopup, setGuestPopup] = useState(false);

  const [showMobileDateModal, setShowMobileDateModal] = useState(false);

  const priceConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/usd",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.KES,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    priceConversionRate();
  }, []);

  const addToBasket = async () => {
    const token = Cookies.get("token");

    setAddToBasketLoading(true);

    if (token) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/add-to-cart/`,
          {
            from_date: addToCartDate,
            number_of_people: numOfPeople,
            number_of_sessions: numOfSession,
            number_of_groups: numOfGroups,
            non_resident: nonResident,
            pricing_type:
              currentPrice.value === "Price per person"
                ? "PER PERSON"
                : currentPrice.value === "Price per session"
                ? "PER SESSION"
                : currentPrice.value === "Price per group"
                ? "PER GROUP"
                : "PER PERSON",
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => location.reload())
        .catch((err) => {
          console.log(err.response);
        });
    } else if (!token) {
      let cookieVal = Cookies.get("cart");

      if (cookieVal !== undefined) {
        cookieVal = JSON.parse(cookieVal);
      }

      const data = [...(cookieVal || [])];
      const exist = data.some((val) => {
        return val.slug === activity.slug;
      });
      if (!exist) {
        data.push({
          slug: activity.slug,
          itemCategory: "activities",
          from_date: addToCartDate,
          number_of_people: numOfPeople,
          number_of_sessions: numOfSession,
          number_of_groups: numOfGroups,
          non_resident: nonResident,
          pricing_type:
            currentPrice.value === "Price per person"
              ? "PER PERSON"
              : currentPrice.value === "Price per session"
              ? "PER SESSION"
              : currentPrice.value === "Price per group"
              ? "PER GROUP"
              : "PER PERSON",
        });
        Cookies.set("cart", JSON.stringify(data));
        location.reload();
      }
    }
  };

  const getReview = async () => {
    setReviewLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/reviews/`
      );

      setReviews(response.data.results);
      setReviewCount(response.data.count);
      setReviewPageSize(response.data.page_size);
      setNextReview(response.data.next);
      setPrevReview(response.data.previous);
      setReviewLoading(false);
    } catch (error) {
      setReviewLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/add-view/`
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getReview();
  }, []);

  const filterReview = async (rate) => {
    setSpinner(true);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/reviews/?rate=${rate}`
    );
    setFilteredReviews(data.results);
    setReviewCount(data.count);
    setNextReview(data.next);
    setPrevReview(data.previous);
    setSpinner(false);
  };

  const [addToCartDate, setAddToCartDate] = useState("");

  const [numOfPeople, setNumOfPeople] = useState(1);

  const [slugIsCorrect, setSlugIsCorrect] = useState(false);

  const checkSlug = async () => {
    const token = Cookies.get("token");

    if (token) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`, {
          headers: {
            Authorization: "Token " + token,
          },
        })
        .then((res) => {
          setSlugIsCorrect(true);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setSlugIsCorrect(false);
          }
        });
    } else {
      setSlugIsCorrect(false);
    }
  };

  useEffect(() => {
    if (router.query.trip) {
      checkSlug();
    }
  }, []);

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const addToTrip = async () => {
    const token = Cookies.get("token");

    setAddToTripLoading(true);

    if (token) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
          {
            activity_id: activity.id,
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

  const [numOfSession, setNumOfSession] = useState(1);

  const [numOfGroups, setNumOfGroups] = useState(1);

  const [priceType, setPriceType] = useState([]);

  const [showDateForMobilePopup, setShowDateForMobilePopup] = useState(true);

  const [showGuestForMobilePopup, setShowGuestForMobilePopup] = useState(false);

  const [currentPrice, setCurrentPrice] = useState({
    label: "Price per person",
    value: "Price per person",
  });

  useEffect(() => {
    const availableOptions = [];

    if (activity.price_per_person) {
      availableOptions.push("Price per person");
    }
    if (activity.price_per_session) {
      availableOptions.push("Price per session");
    }
    if (activity.price_per_group) {
      availableOptions.push("Price per group");
    }

    availableOptions.forEach((e) => {
      setPriceType((prev) => [...prev, { label: e, value: e }]);
    });
  }, []);

  const maxGuests =
    currentPrice.value === "Price per person"
      ? activity.max_number_of_people
      : currentPrice.value === "Price per session"
      ? activity.max_number_of_sessions
      : currentPrice.value === "Price per group"
      ? activity.max_number_of_groups
      : "";

  const priceOfPlan =
    currentPrice.value === "Price per person" && !nonResident
      ? activity.price
      : currentPrice.value === "Price per person" && nonResident
      ? activity.price_non_resident
      : currentPrice.value === "Price per session" && !nonResident
      ? activity.session_price
      : currentPrice.value === "Price per session" && nonResident
      ? activity.session_price_non_resident
      : currentPrice.value === "Price per group" && !nonResident
      ? activity.group_price
      : currentPrice.value === "Price per group" && nonResident
      ? activity.group_price_non_resident
      : activity.price;

  const changeLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(false);
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.id}/delete/`,
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
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/save/`,
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
      onClick={(e) => {
        setGuestPopup(false);
      }}
      className={
        "" + (showMobileDateModal ? " !overflow-y-hidden h-screen" : "")
      }
    >
      <GlobalStyle></GlobalStyle>
      <div className="fixed top-0 w-full bg-white z-20">
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
      </div>

      <div className="flex flex-col px-4 md:px-0 md:flex-row justify-around relative h-full w-full">
        <div className="md:w-[56%] lg:w-[63%] md:px-4 md:border-r md:border-gray-200 md:absolute md:mt-0 mt-10 left-2 md:block top-10">
          {/* about */}
          <Element name="about">
            <div className="mt-10">
              <div className="text-sm text-gray-600 font-medium flex items-center">
                <div>
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/experiences",
                        query: {
                          search: activity.country,
                        },
                      });
                    }}
                    className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                  >
                    {activity.country}
                  </div>{" "}
                  <span className="mx-1">/</span>
                </div>
                <div>
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/experiences",
                        query: {
                          search: activity.city,
                        },
                      });
                    }}
                    className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                  >
                    {activity.city}
                  </div>{" "}
                  <span className="mx-1">/</span>{" "}
                </div>
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/experiences",
                      query: {
                        search: activity.location,
                      },
                    });
                  }}
                  className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                >
                  {activity.location}
                </div>
              </div>
              <div className="text-2xl font-bold">{activity.name}</div>
            </div>

            <div ref={scrollToVisible} className="relative -ml-8 -mr-4">
              <ImageGallery images={activity.activity_images}></ImageGallery>

              <div className="flex absolute bg-white px-3 rounded-3xl py-1 top-4 right-3 gap-2 items-center">
                <div className="cursor-pointer">
                  {!liked && (
                    <svg
                      width="28px"
                      height="28px"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-black text-opacity-50 cursor-pointer"
                      fill="currentColor"
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
                  {liked && (
                    <svg
                      width="28px"
                      height="28px"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="#e63946"
                      className="cursor-pointer"
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
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShare(true);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
            </div>

            <div
              className={
                !isVisible
                  ? "h-12 !fixed md:!w-[56.5%] lg:!w-[63.5%]  !w-full !top-[65px] left-0 right-0 z-[40] bg-white lg:px-10 px-5"
                  : "h-12 border-b border-gray-200 absolute top-[505px] sm:top-[565px] w-[100%] left-0 right-0 lg:px-10 px-5"
              }
            >
              <ScrollTo guestPopup={guestPopup} activity={activity}></ScrollTo>
            </div>

            <div className="mt-16">
              <h1 className="font-bold text-2xl">Quick facts</h1>
              <div className="flex">
                <div className="flex flex-col w-full">
                  <div className="text-gray-500 flex gap-2 text-sm truncate mt-3 flex-wrap">
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
                        <span>
                          {activity.capacity} Maximum number of guests
                        </span>
                      </div>
                    )}
                  </div>

                  <h1 className="text-sm text-gray-600 mt-2">
                    This experience has a duration of{" "}
                    {moment
                      .duration(activity.duration_of_activity, "minutes")
                      .humanize()}
                  </h1>

                  {activity.views > 0 && activity.views === 1 && (
                    <div className="mt-2 text-gray-600">
                      {activity.views} person has viewed this listing
                    </div>
                  )}
                  {activity.views > 0 && activity.views > 1 && (
                    <div className="mt-2 text-gray-600">
                      {activity.views} people has viewed this listing
                    </div>
                  )}

                  {slugIsCorrect && (
                    <div className="mt-2">
                      <Button
                        onClick={() => {
                          addToTrip();
                        }}
                        className={"!bg-blue-500 flex gap-2 !text-white "}
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
                </div>

                <div className="w-full z-10 px-4 md:hidden fixed bottom-0 left-0 right-0 bg-white py-2">
                  <div className="flex justify-between items-center gap-2">
                    {inCart && (
                      <Button
                        onClick={() => {
                          router.push({ pathname: "/cart" });
                        }}
                        className="!bg-transparent !w-full !text-black !border-2 border-blue-800"
                      >
                        View in basket
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          version="1.1"
                        >
                          <title>bag</title>
                          <desc>Created with Sketch.</desc>
                          <defs />
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Artboard-4"
                              transform="translate(-620.000000, -291.000000)"
                            >
                              <g
                                id="94"
                                transform="translate(620.000000, 291.000000)"
                              >
                                <rect
                                  id="Rectangle-40"
                                  stroke="#333333"
                                  strokeWidth="2"
                                  x="4"
                                  y="7"
                                  width="16"
                                  height="16"
                                  rx="1"
                                />
                                <path
                                  d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                                  id="Oval-21"
                                  stroke="#333333"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <rect
                                  id="Rectangle-41"
                                  fill="#333333"
                                  x="5"
                                  y="18"
                                  width="14"
                                  height="2"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              {!showAllDescription && (
                <p className="text-gray-600 font-medium">
                  {activity.description.slice(0, 500)}
                </p>
              )}
              {showAllDescription && (
                <p className="text-gray-600 font-medium">
                  {activity.description}
                </p>
              )}
              {!showAllDescription && (
                <div
                  onClick={() => {
                    setShowAllDescription(true);
                  }}
                  className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                >
                  <span>Read more</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-1"
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
              )}
              {showAllDescription && (
                <div
                  onClick={() => {
                    setShowAllDescription(false);
                  }}
                  className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                >
                  <span>Read less</span>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div
              className={
                "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-white py-1 "
              }
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Price
                      stayPrice={
                        priceOfPlan *
                        (currentPrice.value === "Price per person"
                          ? numOfPeople
                          : currentPrice.value === "Price per session"
                          ? numOfSession
                          : currentPrice.value === "Price per group"
                          ? numOfGroups
                          : 1)
                      }
                    ></Price>
                    {addToCartDate && (
                      <div className="mx-1 mb-1 font-bold">.</div>
                    )}
                    {addToCartDate && (
                      <span className="text-sm font-bold mt-1.5">
                        {moment(addToCartDate).format("MMM DD")}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm justify-end flex flex-wrap self-end">
                    {currentPrice.value === "Price per person" && (
                      <span>
                        {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
                      </span>
                    )}
                    {currentPrice.value === "Price per session" && (
                      <span>
                        {numOfSession}{" "}
                        {numOfSession > 1 ? "Sessions" : "Session"}
                      </span>
                    )}
                    {currentPrice.value === "Price per group" && (
                      <span>
                        {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                      </span>
                    )}

                    {nonResident && (
                      <>
                        <span className="font-bold mx-0.5 ">,</span>
                        <span>Non-resident</span>
                      </>
                    )}

                    {!nonResident && (
                      <>
                        <span className="font-bold mx-0.5 ">,</span>
                        <span>Resident</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowMobileDateModal(true);
                  }}
                  className={
                    "!bg-gradient-to-r !px-2 from-pink-500 via-red-500 to-yellow-500 !text-white " +
                    (!inCart ? "" : "")
                  }
                >
                  {!inCart ? "Add to basket" : "Add to basket again"}
                  <div
                    className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}
                  >
                    <LoadingSpinerChase
                      width={16}
                      height={16}
                      color="#fff"
                    ></LoadingSpinerChase>
                  </div>
                </Button>
              </div>
            </div>

            <Modal
              showModal={showMobileDateModal}
              closeModal={() => {
                setShowMobileDateModal(!showMobileDateModal);
              }}
              className="md:!hidden"
              title="Book this experience"
            >
              <div className="px-2 mt-2">
                {!showDateForMobilePopup && (
                  <div
                    onClick={() => {
                      setShowDateForMobilePopup(true);
                      setShowGuestForMobilePopup(false);
                    }}
                    className="cursor-pointer flex items-center justify-between px-4 py-4 rounded-2xl mt-6 border border-gray-200"
                  >
                    <div className="font-bold">Date</div>
                    {addToCartDate && (
                      <span className="text-sm font-bold mt-1.5">
                        {moment(addToCartDate).format("MMM DD")}
                      </span>
                    )}
                    {!addToCartDate && (
                      <div className="text-sm text-gray-500">Add a date +</div>
                    )}
                  </div>
                )}

                {showDateForMobilePopup && (
                  <div
                    className={
                      " h-full bg-white py-2 border border-gray-200 rounded-2xl w-full mx-auto xl:ml-2 order-1 md:order-2 "
                    }
                  >
                    {!addToCartDate && (
                      <div className="text-lg ml-4 font-bold">
                        Select the date you will be coming
                      </div>
                    )}

                    <DatePicker
                      setDate={setAddToCartDate}
                      date={addToCartDate}
                      disableDate={new Date()}
                    ></DatePicker>
                    {addToCartDate && (addToCartDate.from || addToCartDate.to) && (
                      <div
                        className="mb-2 cursor-pointer text-sm ml-4 underline"
                        onClick={() => {
                          setAddToCartDate("");
                        }}
                      >
                        clear date
                      </div>
                    )}
                  </div>
                )}

                {!showGuestForMobilePopup && (
                  <div
                    onClick={() => {
                      setShowGuestForMobilePopup(true);
                      setShowDateForMobilePopup(false);
                    }}
                    className="flex cursor-pointer items-center justify-between px-4 py-4 rounded-2xl mt-6 border border-gray-200"
                  >
                    <div className="font-bold">Guests</div>
                    <div className="text-gray-600 text-sm justify-start flex flex-wrap self-start">
                      {currentPrice.value === "Price per person" && (
                        <span>
                          {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
                        </span>
                      )}
                      {currentPrice.value === "Price per session" && (
                        <span>
                          {numOfSession}{" "}
                          {numOfSession > 1 ? "Sessions" : "Session"}
                        </span>
                      )}
                      {currentPrice.value === "Price per group" && (
                        <span>
                          {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                        </span>
                      )}

                      {nonResident && (
                        <>
                          <span className="font-bold mx-0.5 ">,</span>
                          <span>Non-resident</span>
                        </>
                      )}

                      {!nonResident && (
                        <>
                          <span className="font-bold mx-0.5 ">,</span>
                          <span>Resident</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {showGuestForMobilePopup && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="px-4 mt-4 py-4 bg-white border border-gray-200 rounded-2xl w-full"
                  >
                    <Select
                      defaultValue={currentPrice}
                      onChange={(value) => {
                        setCurrentPrice(value);
                        setNumOfPeople(1);
                        setNumOfGroups(1);
                        setNumOfSession(1);
                      }}
                      className={"text-sm outline-none border border-gray-500"}
                      instanceId={priceType}
                      placeholder="Type of room"
                      options={priceType}
                      isSearchable={true}
                    />

                    <div className="flex items-center gap-0.5 mt-4">
                      <svg
                        className="w-4 h-4 text-gray-500"
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
                      {currentPrice && (
                        <span className="text-gray-600 text-sm">
                          Maximum number of guests is {maxGuests}
                        </span>
                      )}
                    </div>

                    {currentPrice.value === "Price per person" && (
                      <div className="flex justify-between mt-6">
                        <div className="flex flex-col text-sm text-gray-600 items-center">
                          <span>
                            {numOfPeople}{" "}
                            {numOfPeople > 1 ? "People" : "Person"}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfPeople > 1) {
                                setNumOfPeople(numOfPeople - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (numOfPeople < maxGuests) {
                                setNumOfPeople(numOfPeople + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPrice.value === "Price per session" && (
                      <div className="flex justify-between mt-6">
                        <div className="flex flex-col text-sm text-gray-600 items-center">
                          <span>
                            {numOfSession}{" "}
                            {numOfSession > 1 ? "Sessions" : "Session"}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfSession > 0) {
                                setNumOfSession(numOfSession - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (numOfSession < maxGuests) {
                                setNumOfSession(numOfSession + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPrice.value === "Price per group" && (
                      <div className="flex justify-between mt-6">
                        <div className="flex flex-col text-sm text-gray-600 items-center">
                          <span>
                            {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfGroups > 0) {
                                setNumOfGroups(numOfGroups - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (numOfGroups < maxGuests) {
                                setNumOfGroups(numOfGroups + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <Checkbox
                        checked={nonResident}
                        onChange={() => setNonResident(!nonResident)}
                      ></Checkbox>
                      <span className="text-gray-600 text-sm">
                        Non-resident
                      </span>
                    </div>

                    {(numOfPeople > 1 ||
                      numOfSession > 0 ||
                      numOfGroups > 0) && (
                      <div
                        className="mt-2 cursor-pointer text-sm underline"
                        onClick={() => {
                          setNumOfPeople(1);
                          setNumOfGroups(1);
                          setNumOfSession(1);
                        }}
                      >
                        clear data
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={
                    "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 py-1 "
                  }
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Price
                          stayPrice={
                            priceOfPlan *
                            (currentPrice.value === "Price per person"
                              ? numOfPeople
                              : currentPrice.value === "Price per session"
                              ? numOfSession
                              : currentPrice.value === "Price per group"
                              ? numOfGroups
                              : 1)
                          }
                        ></Price>
                        {addToCartDate && (
                          <div className="mx-1 mb-1 font-bold">.</div>
                        )}
                        {addToCartDate && (
                          <span className="text-sm font-bold mt-1.5">
                            {moment(addToCartDate).format("MMM DD")}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm justify-end flex flex-wrap self-end">
                        {currentPrice.value === "Price per person" && (
                          <span>
                            {numOfPeople}{" "}
                            {numOfPeople > 1 ? "People" : "Person"}
                          </span>
                        )}
                        {currentPrice.value === "Price per session" && (
                          <span>
                            {numOfSession}{" "}
                            {numOfSession > 1 ? "Sessions" : "Session"}
                          </span>
                        )}
                        {currentPrice.value === "Price per group" && (
                          <span>
                            {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                          </span>
                        )}

                        {nonResident && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>Non-resident</span>
                          </>
                        )}

                        {!nonResident && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>Resident</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        addToBasket();
                      }}
                      className={
                        "!bg-gradient-to-r !px-2 from-pink-500 via-red-500 to-yellow-500 !text-white " +
                        (!inCart ? "" : "")
                      }
                    >
                      {!inCart ? "Book" : "Book again"}
                      <div
                        className={
                          " " + (!addToBasketLoading ? "hidden" : "ml-2")
                        }
                      >
                        <LoadingSpinerChase
                          width={16}
                          height={16}
                          color="#fff"
                        ></LoadingSpinerChase>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </Element>

          {/* experiences */}
          {activity.type_of_activities.length > 0 && (
            <Element
              name="experiences"
              className="flex flex-col md:flex-row gap-3 justify-between pt-10 "
            >
              <div className="border pb-2 h-fit border-gray-200 rounded-xl overflow-hidden w-full order-2 md:order-1 mt-4 md:mt-0">
                <div className="py-2 bg-gray-200 mb-2">
                  <span className="font-bold text-xl ml-6">Experiences</span>
                </div>
                {!showMoreActivities && (
                  <div className="flex flex-col gap-2 px-2">
                    {activity.type_of_activities
                      .slice(0, 5)
                      .map((amenity, index) => (
                        <ListItem key={index}>{amenity}</ListItem>
                      ))}
                  </div>
                )}

                {showMoreActivities && (
                  <div className="flex flex-col gap-2 px-2">
                    {activity.type_of_activities.map((amenity, index) => (
                      <ListItem key={index}>{amenity}</ListItem>
                    ))}
                  </div>
                )}

                {!showMoreActivities && activity.type_of_activities.length > 5 && (
                  <div
                    onClick={() => {
                      setShowMoreActivities(true);
                    }}
                    className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                  >
                    <span>Read more</span>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-1"
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
                )}

                {showMoreActivities && activity.type_of_activities.length > 5 && (
                  <div
                    onClick={() => {
                      setShowMoreActivities(false);
                    }}
                    className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                  >
                    <span>Read less</span>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Element>
          )}

          <div>
            {/* <div
              className={
                " h-fit w-full md:w-fit border border-gray-200 rounded-lg order-1 md:order-2 " +
                (!inCart ? "md:-mt-32" : "hidden")
              }
            >
              <DatePicker
                setDate={setAddToCartDate}
                date={addToCartDate}
                disableDate={new Date()}
              ></DatePicker>
              <div className="flex gap-3 items-center mb-4 ml-4">
                <div
                  onClick={() => {
                    if (numOfPeople > 1) {
                      setNumOfPeople(numOfPeople - 1);
                    }
                  }}
                  className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-gray-100 shadow-lg font-bold"
                >
                  -
                </div>

                <div className="font-bold">
                  {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
                </div>
                <div
                  onClick={() => {
                    setNumOfPeople(numOfPeople + 1);
                  }}
                  className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-gray-100 shadow-lg font-bold"
                >
                  +
                </div>
              </div>
              <div>
                <Button
                  onClick={addToBasket}
                  className="!bg-blue-500 !text-white !w-[95%] mx-auto mb-2"
                >
                  Add to basket
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white ml-2"
                    viewBox="0 0 24 24"
                    version="1.1"
                  >
                    <title>bag</title>
                    <desc>Created with Sketch.</desc>
                    <defs />
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Artboard-4"
                        transform="translate(-620.000000, -291.000000)"
                      >
                        <g
                          id="94"
                          transform="translate(620.000000, 291.000000)"
                        >
                          <rect
                            id="Rectangle-40"
                            stroke="#fff"
                            strokeWidth="2"
                            x="4"
                            y="7"
                            width="16"
                            height="16"
                            rx="1"
                          />
                          <path
                            d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                            id="Oval-21"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <rect
                            id="Rectangle-41"
                            fill="#fff"
                            x="5"
                            y="18"
                            width="14"
                            height="2"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div
                    className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}
                  >
                    <LoadingSpinerChase
                      width={16}
                      height={16}
                      color="#000"
                    ></LoadingSpinerChase>
                  </div>
                </Button>
              </div>
            </div> */}
          </div>

          {/* essentials */}
          {(activity.equipments_provided.length > 0 ||
            activity.equipments_required_by_user_to_bring.length > 0) && (
            <Element
              name="essentials"
              className={"w-full order-1 md:order-2 pt-10 "}
            >
              <h1 className="font-bold text-2xl mb-2 ml-2">Essentials</h1>

              {activity.equipments_provided.length > 0 && (
                <h3 className="mb-2 ml-4 font-semibold">
                  The following enquipments will be provided to by this place
                </h3>
              )}

              <div className="flex flex-col gap-2 px-2">
                {activity.equipments_provided.map((enquipment, index) => (
                  <ListItem key={index}>{enquipment}</ListItem>
                ))}
              </div>

              {activity.equipments_required_by_user_to_bring.length === 0 && (
                <h3 className="mt-2 font-medium ml-4 underline">
                  You are not required to bring extra equipment
                </h3>
              )}

              {activity.equipments_required_by_user_to_bring.length > 0 && (
                <h3 className="mb-2 mt-2 ml-4 font-semibold">
                  You are required to bring the following enquipments
                </h3>
              )}

              <div className="flex flex-col gap-2 px-2">
                {activity.equipments_required_by_user_to_bring.map(
                  (enquipment, index) => (
                    <ListItem key={index}>{enquipment}</ListItem>
                  )
                )}
              </div>
            </Element>
          )}

          <Element
            name="map"
            className={"w-full h-[350px] md:h-[450px] order-1 md:order-2 pt-6 "}
          >
            <h1 className="font-bold text-2xl mb-2 ml-2">Map</h1>
            <Map
              longitude={activity.longitude}
              latitude={activity.latitude}
            ></Map>
          </Element>

          <Element name="policies" className={"w-full pt-20 "}>
            <h1 className="font-bold text-2xl mb-2">Policies</h1>
            <div className="py-2 px-2 border-b border-gray-100">
              <span className="font-semibold">Refund Policy</span>
            </div>
            {!activity.refundable && (
              <div className="mt-2 ml-2">
                <p>Bookings at this experience is non-refundable.</p>
              </div>
            )}

            {activity.refundable && (
              <div className="mt-2 ml-2">
                <p>Bookings at this experience is refundable.</p>
                <div className="mt-6">{activity.refund_policy}</div>
              </div>
            )}

            {activity.damage_policy && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Damage Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{activity.damage_policy}</p>
                </div>
              </div>
            )}

            {activity.covid_19_compliance && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Covid-19 Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{activity.covid_19_compliance_details}</p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="py-2 px-2 border-b border-gray-100">
                <span className="font-semibold">Listing Rules</span>

                <div className="flex items-center gap-6 ml-4">
                  {activity.check_in_time && (
                    <div className="flex items-center mt-2">
                      <span className="font-bold mr-1 hidden sm:block">
                        Checkin at:
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 sm:hidden text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      {moment(activity.check_in_time, "HH:mm:ss").format(
                        "hh:mm a"
                      )}
                    </div>
                  )}
                  {activity.check_out_time && (
                    <div className="flex items-center mt-2">
                      <span className="font-bold mr-1 hidden sm:block">
                        Checkout at:
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 sm:hidden text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {moment(activity.check_out_time, "HH:mm:ss").format(
                        "hh:mm a"
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 ml-2">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Children allowed:{" "}
                      <span className="font-bold">
                        {activity.children_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Pets allowed:{" "}
                      <span className="font-bold">
                        {activity.pets_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Smoking allowed:{" "}
                      <span className="font-bold">
                        {activity.smoking_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>
                </div>
              </div>
            </div>
          </Element>

          <Element name="reviews" className="pt-12">
            {!reviewLoading && reviews.length > 0 && (
              <div>
                <div className="max-w-[750px] mb-10">
                  <h1 className="font-bold text-2xl mb-5">Reviews</h1>
                  <ReviewOverview
                    reviews={reviews}
                    filterReview={filterReview}
                    stay={activity}
                    setFilterRateVal={setFilterRateVal}
                  ></ReviewOverview>
                  <div className="flex gap-2">
                    {/* {!activity.has_user_reviewed && !activity.is_user_activity && (
                  <div
                    onClick={() => {
                      const token = Cookies.get("token");
                      if (token) {
                        setShowCreateReview(true);
                      } else {
                        router.push({
                          pathname: "/login",
                          query: { redirect: `${router.asPath}` },
                        });
                      }
                    }}
                    className="flex gap-1 border border-gray-200 cursor-pointer rounded-md px-2 py-2 w-fit mt-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <div>Add Review</div>
                  </div>
                )} */}
                    {filteredReviews && (
                      <div
                        onClick={() => {
                          getReview();
                          setFilteredReviews(null);
                        }}
                        className="flex gap-1 border border-gray-200 cursor-pointer rounded-md px-2 py-2 w-fit mt-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>Clear Filter</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <CreateReview
                    show={showCreateReview}
                    setShowCreateReview={setShowCreateReview}
                  ></CreateReview>
                </div>

                <div>
                  <Share
                    showShare={showShare}
                    type_of_stay={"EXPERIENCE"}
                    setShowShare={setShowShare}
                  ></Share>
                </div>

                {showAllReviews && (
                  <div>
                    <AllReviews
                      showAllReviews={showAllReviews}
                      setShowAllReviews={setShowAllReviews}
                      next={nextReview}
                      filterRateVal={filterRateVal}
                      filteredReviews={filteredReviews}
                      reviewPageSize={reviewPageSize}
                      reviewCount={reviewCount}
                    ></AllReviews>
                  </div>
                )}

                <div className="mb-16">
                  <Reviews
                    reviews={reviews}
                    spinner={spinner}
                    filteredReviews={filteredReviews}
                    setShowAllReviews={setShowAllReviews}
                    count={reviewCount}
                  ></Reviews>
                </div>
              </div>
            )}
            {reviewLoading && (
              <div className="flex items-center justify-center mb-16">
                <LoadingSpinerChase
                  width={35}
                  height={35}
                  color="#000"
                ></LoadingSpinerChase>
              </div>
            )}
          </Element>

          <div className="mt-6 -ml-10 -mr-4">
            <Footer></Footer>
          </div>
        </div>

        <div className="md:fixed hidden right-2 md:w-[42%] md:pl-2 lg:px-0 lg:w-[35%] top-20 md:block">
          <div className="flex justify-between">
            {
              <div>
                {!addToCartDate && (
                  <div className="text-base ml-2 font-bold">
                    Select the date you will be coming
                  </div>
                )}
              </div>
            }
            <div className="flex flex-col">
              <div className="flex self-end">
                <Price
                  stayPrice={
                    priceOfPlan *
                    (currentPrice.value === "Price per person"
                      ? numOfPeople
                      : currentPrice.value === "Price per session"
                      ? numOfSession
                      : currentPrice.value === "Price per group"
                      ? numOfGroups
                      : 1)
                  }
                ></Price>
              </div>
              {addToCartDate && (
                <span className="text-gray-600 text-sm font-bold self-end">
                  {moment(addToCartDate).format("MMM DD")}
                </span>
              )}
              <div className="text-gray-600 text-sm justify-end flex flex-wrap self-end">
                {currentPrice.value === "Price per person" && (
                  <span>
                    {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
                  </span>
                )}
                {currentPrice.value === "Price per session" && (
                  <span>
                    {numOfSession} {numOfSession > 1 ? "Sessions" : "Session"}
                  </span>
                )}
                {currentPrice.value === "Price per group" && (
                  <span>
                    {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                  </span>
                )}

                {nonResident && (
                  <>
                    <span className="font-bold mx-0.5 ">,</span>
                    <span>Non-resident</span>
                  </>
                )}

                {!nonResident && (
                  <>
                    <span className="font-bold mx-0.5 ">,</span>
                    <span>Resident</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className={
              " h-fit w-full lg:w-fit mx-auto xl:ml-2 order-1 md:order-2 "
            }
          >
            <DatePicker
              setDate={setAddToCartDate}
              date={addToCartDate}
              disableDate={new Date()}
            ></DatePicker>

            {addToCartDate && (
              <div
                className="my-2 cursor-pointer text-sm ml-4 underline"
                onClick={() => {
                  setAddToCartDate("");
                }}
              >
                clear date
              </div>
            )}

            <div className=" mt-4 relative">
              {
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setGuestPopup(!guestPopup);
                  }}
                  className="py-3 bg-blue-600 rounded-md bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="w-5 h-5"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
                    />
                  </svg>
                  <span>Add Guests</span>
                </div>
              }

              {guestPopup && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute -left-[410px] -top-[200px] px-4 py-4 !z-[99] w-[400px] bg-white shadow-lg rounded-lg h-fit"
                >
                  <Select
                    defaultValue={currentPrice}
                    onChange={(value) => {
                      setCurrentPrice(value);
                      setNumOfPeople(1);
                      setNumOfGroups(1);
                      setNumOfSession(1);
                    }}
                    className={"text-sm outline-none border border-gray-500"}
                    instanceId={priceType}
                    placeholder="Type of room"
                    options={priceType}
                    isSearchable={true}
                  />

                  <div className="flex items-center gap-0.5 mt-4">
                    <svg
                      className="w-4 h-4 text-gray-500"
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
                    {currentPrice && (
                      <span className="text-gray-600 text-sm">
                        Maximum number of guests is {maxGuests}
                      </span>
                    )}
                  </div>

                  {currentPrice.value === "Price per person" && (
                    <div className="flex justify-between mt-6">
                      <div className="flex flex-col text-sm text-gray-600 items-center">
                        <span>
                          {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfPeople > 1) {
                              setNumOfPeople(numOfPeople - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            if (numOfPeople < maxGuests) {
                              setNumOfPeople(numOfPeople + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPrice.value === "Price per session" && (
                    <div className="flex justify-between mt-6">
                      <div className="flex flex-col text-sm text-gray-600 items-center">
                        <span>
                          {numOfSession}{" "}
                          {numOfSession > 1 ? "Sessions" : "Session"}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfSession > 0) {
                              setNumOfSession(numOfSession - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            if (numOfSession < maxGuests) {
                              setNumOfSession(numOfSession + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPrice.value === "Price per group" && (
                    <div className="flex justify-between mt-6">
                      <div className="flex flex-col text-sm text-gray-600 items-center">
                        <span>
                          {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfGroups > 0) {
                              setNumOfGroups(numOfGroups - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            if (numOfGroups < maxGuests) {
                              setNumOfGroups(numOfGroups + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <Checkbox
                      checked={nonResident}
                      onChange={() => setNonResident(!nonResident)}
                    ></Checkbox>
                    <span className="text-gray-600 text-sm">Non-resident</span>
                  </div>

                  {(numOfPeople > 1 || numOfSession > 0 || numOfGroups > 0) && (
                    <div
                      className="mt-2 cursor-pointer text-sm underline"
                      onClick={() => {
                        setNumOfPeople(1);
                        setNumOfGroups(1);
                        setNumOfSession(1);
                      }}
                    >
                      clear data
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <div></div>
                    <Button
                      onClick={() => {
                        setGuestPopup(false);
                      }}
                      className="!bg-blue-700 !rounded-3xl"
                    >
                      <span>Done</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-around gap-2">
              {inCart && (
                <Button
                  onClick={() => {
                    router.push({ pathname: "/cart" });
                  }}
                  className={
                    "!bg-transparent !w-[48%] !text-black relative border-2 border-pink-500 "
                  }
                >
                  View in basket
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    version="1.1"
                  >
                    <title>bag</title>
                    <desc>Created with Sketch.</desc>
                    <defs />
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Artboard-4"
                        transform="translate(-620.000000, -291.000000)"
                      >
                        <g
                          id="94"
                          transform="translate(620.000000, 291.000000)"
                        >
                          <rect
                            id="Rectangle-40"
                            stroke="#333333"
                            strokeWidth="2"
                            x="4"
                            y="7"
                            width="16"
                            height="16"
                            rx="1"
                          />
                          <path
                            d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                            id="Oval-21"
                            stroke="#333333"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <rect
                            id="Rectangle-41"
                            fill="#333333"
                            x="5"
                            y="18"
                            width="14"
                            height="2"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </Button>
              )}

              {
                <Button
                  onClick={addToBasket}
                  disabled={!addToCartDate}
                  className={
                    "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                    (!inCart ? "!w-full" : "!w-[48%]") +
                    (!addToCartDate ? " !opacity-70 cursor-not-allowed" : "")
                  }
                >
                  {!inCart ? "Add to basket" : "Add again"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white ml-2"
                    viewBox="0 0 24 24"
                    version="1.1"
                  >
                    <title>bag</title>
                    <desc>Created with Sketch.</desc>
                    <defs />
                    <g
                      id="Page-1"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Artboard-4"
                        transform="translate(-620.000000, -291.000000)"
                      >
                        <g
                          id="94"
                          transform="translate(620.000000, 291.000000)"
                        >
                          <rect
                            id="Rectangle-40"
                            stroke="#fff"
                            strokeWidth="2"
                            x="4"
                            y="7"
                            width="16"
                            height="16"
                            rx="1"
                          />
                          <path
                            d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                            id="Oval-21"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <rect
                            id="Rectangle-41"
                            fill="#fff"
                            x="5"
                            y="18"
                            width="14"
                            height="2"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div
                    className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}
                  >
                    <LoadingSpinerChase
                      width={16}
                      height={16}
                      color="#fff"
                    ></LoadingSpinerChase>
                  </div>
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ActivitiesDetail.propTypes = {};

export async function getServerSideProps(context) {
  let exist = false;
  try {
    const token = getToken(context);
    let cart = getCart(context);

    const activity = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/activities/${context.query.slug}/`
    );

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
        `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      exist = data.results.some((val) => {
        return val.activity.slug === context.query.slug;
      });

      const activity = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/activities/${context.query.slug}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          activity: activity.data,
          inCart: exist,
        },
      };
    } else if (cart) {
      cart = JSON.parse(decodeURIComponent(cart));

      exist = cart.some((val) => {
        return val.slug === context.query.slug;
      });

      return {
        props: {
          userProfile: "",
          activity: activity.data,
          inCart: exist,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        activity: activity.data,
        inCart: exist,
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
    } else if (error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          activity: "",
          inCart: exist,
        },
      };
    }
  }
}

export default ActivitiesDetail;
