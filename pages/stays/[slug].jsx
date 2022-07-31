import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Element } from "react-scroll";
import { createGlobalStyle } from "styled-components";
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";

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
import DatePicker from "../../components/ui/DatePickerRange";
import Footer from "../../components/Home/Footer";
import ScrollTo from "../../components/Stay/ScrollTo";
import { useRef } from "react";
import StickyHeader from "../../components/Home/StickyHeader";
import useOnScreen from "../../lib/onScreen";
import moment from "moment";
import Modal from "../../components/ui/FullScreenMobileModal";
import PopupModal from "../../components/ui/Modal";
import SelectInput from "../../components/ui/SelectInput";
import Checkbox from "../../components/ui/Checkbox";

import "swiper/css";
import "swiper/css/thumbs";
import Amenities from "../../components/Stay/Amenities";
import {
  priceOfAdultResident,
  priceOfAdultNonResident,
  priceOfChildrenResident,
  priceOfChildrenNonResident,
  priceOfSingleAdultResident,
  priceOfSingleAdultNonResident,
  priceOfSingleChildResident,
  priceOfSingleChildNonResident,
} from "../../lib/pricePlan";
import Stays from ".";
import Dialogue from "../../components/Home/Dialogue";

const StaysDetail = ({ userProfile, stay, inCart }) => {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    width: 54px !important;
    height: 54px !important;
  }
`;

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const dispatch = useDispatch();

  const router = useRouter();

  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const [showAllDescription, setShowAllDescription] = useState(false);
  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [filteredReviews, setFilteredReviews] = useState(null);

  const [showCreateReview, setShowCreateReview] = useState(false);

  const [reviewLoading, setReviewLoading] = useState(false);

  const [liked, setLiked] = useState(stay.has_user_saved);

  const [showShare, setShowShare] = useState(false);

  const [reviewCount, setReviewCount] = useState(0);

  const [nextReview, setNextReview] = useState(null);

  const [prevReview, setPrevReview] = useState(null);

  const [reviewPageSize, setReviewPageSize] = useState(0);

  const [filterRateVal, setFilterRateVal] = useState(0);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

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
    if (addToCartDate && addToCartDate.from && addToCartDate.to) {
      const token = Cookies.get("token");
      setAddToBasketLoading(true);
      if (token) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-cart/`,
            {
              from_date: addToCartDate.from,
              to_date: addToCartDate.to,
              num_of_adults: numOfAdults,
              num_of_children: numOfChildren,
              num_of_adults_non_resident: numOfAdultsNonResident,
              num_of_children_non_resident: numOfChildrenNonResident,
              plan:
                currentTypeOfLodge.value === "Standard"
                  ? "STANDARD"
                  : currentTypeOfLodge.value === "Deluxe"
                  ? "DELUXE"
                  : currentTypeOfLodge.value === "Family Room"
                  ? "FAMILY ROOM"
                  : currentTypeOfLodge.value === "Presidential Suite Room"
                  ? "PRESIDENTIAL SUITE ROOM"
                  : currentTypeOfLodge.value === "Executive Suite Room"
                  ? "EXECUTIVE SUITE ROOM"
                  : currentTypeOfLodge.value === "Emperor Suite Room"
                  ? "EMPEROR SUITE ROOM"
                  : "STANDARD",
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
            setAddToBasketLoading(false);
          });
      } else if (!token) {
        let cookieVal = Cookies.get("cart");
        if (cookieVal !== undefined) {
          cookieVal = JSON.parse(cookieVal);
        }
        const data = [...(cookieVal || [])];
        const exist = data.some((val) => {
          return val.slug === stay.slug;
        });
        if (!exist) {
          data.push({
            slug: stay.slug,
            itemCategory: "stays",
            from_date: addToCartDate.from,
            to_date: addToCartDate.to,
            num_of_adults: numOfAdults,
            num_of_children: numOfChildren,
            num_of_adults_non_resident: numOfAdultsNonResident,
            num_of_children_non_resident: numOfChildrenNonResident,
            plan:
              currentTypeOfLodge.value === "Standard"
                ? "STANDARD"
                : currentTypeOfLodge.value === "Deluxe"
                ? "DELUXE"
                : currentTypeOfLodge.value === "Family Room"
                ? "FAMILY ROOM"
                : currentTypeOfLodge.value === "Presidential Suite Room"
                ? "PRESIDENTIAL SUITE ROOM"
                : currentTypeOfLodge.value === "Executive Suite Room"
                ? "EXECUTIVE SUITE ROOM"
                : currentTypeOfLodge.value === "Emperor Suite Room"
                ? "EMPEROR SUITE ROOM"
                : "STANDARD",
          });
          Cookies.set("cart", JSON.stringify(data));
          location.reload();
        }
      }
    }
  };

  const getReview = async () => {
    setReviewLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/reviews/`
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
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-view/`
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
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/reviews/?rate=${rate}`
    );
    setFilteredReviews(data.results);
    setReviewCount(data.count);
    setNextReview(data.next);
    setPrevReview(data.previous);
    setSpinner(false);
  };

  const [addToCartDate, setAddToCartDate] = useState({
    from: "",
    to: "",
  });

  // handle scroll to

  const scrollToAbout = useRef(null);

  const scrollToAmenities = useRef(null);

  const scrollToReviews = useRef(null);

  const scrollToMap = useRef(null);

  const scrollToBestDescribesAs = useRef(null);

  const scrollToUniqueAboutPlace = useRef(null);

  const scrollToVisible = useRef(null);

  const isVisible = useOnScreen(scrollToVisible);

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
            stay_id: stay.id,
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

  const [showMobileDateModal, setShowMobileDateModal] = useState(false);

  const [typeOfLodge, setTypeOfLodge] = useState([]);

  useEffect(() => {
    const availableOptions = [];
    if (stay.standard) {
      availableOptions.push("Standard");
    }

    if (stay.deluxe) {
      availableOptions.push("Deluxe");
    }

    if (stay.family_room) {
      availableOptions.push("Family Room");
    }
    if (stay.presidential_suite_room) {
      availableOptions.push("Presidential Suite Room");
    }

    if (stay.executive_suite_room) {
      availableOptions.push("Executive Suite Room");
    }
    if (stay.emperor_suite_room) {
      availableOptions.push("Emperor Suite Room");
    }

    availableOptions.forEach((e) => {
      setTypeOfLodge((prev) => [...prev, { label: e, value: e }]);
    });
  }, []);

  const [currentTypeOfLodge, setCurrentTypeOfLodge] = useState({
    label: "Standard",
    value: "Standard",
  });

  const [numOfAdults, setNumOfAdults] = useState(0);

  const [numOfAdultsNonResident, setNumOfAdultsNonResident] = useState(2);

  const [numOfChildren, setNumOfChildren] = useState(0);

  const [numOfChildrenNonResident, setNumOfChildrenNonResident] = useState(0);

  const [guestPopup, setGuestPopup] = useState(false);

  const [swiper, setSwiper] = useState(null);

  const [showDateForMobilePopup, setShowDateForMobilePopup] = useState(true);

  const [showGuestForMobilePopup, setShowGuestForMobilePopup] = useState(false);

  // const maxGuests =
  //   currentTypeOfLodge.value === "Standard"
  //     ? stay.standard_capacity
  //     : currentTypeOfLodge.value === "Deluxe"
  //     ? stay.deluxe_capacity
  //     : currentTypeOfLodge.value === "Super Deluxe"
  //     ? stay.super_deluxe_capacity
  //     : currentTypeOfLodge.value === "Studio"
  //     ? stay.studio_capacity
  //     : currentTypeOfLodge.value === "Double Room"
  //     ? stay.double_room_capacity
  //     : currentTypeOfLodge.value === "Single Room"
  //     ? stay.single_room_capacity
  //     : currentTypeOfLodge.value === "Tripple Room"
  //     ? stay.tripple_room_capacity
  //     : currentTypeOfLodge.value === "Quad Room"
  //     ? stay.quad_room_capacity
  //     : currentTypeOfLodge.value === "Queen Room"
  //     ? stay.queen_room_capacity
  //     : currentTypeOfLodge.value === "King Room"
  //     ? stay.king_room_capacity
  //     : currentTypeOfLodge.value === "Twin Room"
  //     ? stay.twin_room_capacity
  //     : currentTypeOfLodge.value === "Family Room"
  //     ? stay.family_room_capacity
  //     : "";

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showMoreExperiences, setShowMoreExperiences] = useState(false);

  const changeLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(false);
      axios
        .delete(`${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.id}/delete/`, {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        })
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
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/save/`,
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

  const priceAdultResident = priceOfAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceAdultNonResident = priceOfAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceChildResident = priceOfChildrenResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceChildNonResident = priceOfChildrenNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleAdultNonResident = priceOfSingleAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleAdultResident = priceOfSingleAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleChildNonResident = priceOfSingleChildNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleChildResident = priceOfSingleChildResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

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
      {/* <div
        onClick={(e) => {
          e.stopPropagation();
          setState({ ...state, showSearchModal: true });
        }}
        className={"w-5/6 mx-auto lg:hidden cursor-pointer "}
      >
        <div className="flex items-center mt-4 justify-center gap-2 !px-2 !py-2 !bg-gray-100 w-full rounded-full text-center ml-1 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
              clipRule="evenodd"
            />
          </svg>
          <div>Nairobi</div>
        </div>
      </div> */}
      <div className="flex flex-col px-4 md:px-0 md:flex-row justify-around relative h-full w-full">
        <div
          className={
            "md:w-[56%] lg:w-[63%] md:px-4 md:border-r md:border-gray-200 md:absolute md:mt-0 mt-10 left-2 md:block top-10 " +
            (stay.type_of_stay === "HOUSE" && inCart
              ? "md:!w-[900px] !sticky !mt-12 !mx-auto !border-0"
              : "")
          }
        >
          <Element name="about">
            <div className="mt-10">
              <div className="text-sm text-gray-600 font-medium flex items-center">
                <div>
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/stays",
                        query: {
                          d_search: stay.country,
                        },
                      });
                    }}
                    className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                  >
                    {stay.country}
                  </div>{" "}
                  <span className="mx-1">/</span>
                </div>
                <div>
                  <div
                    onClick={() => {
                      router.push({
                        pathname: "/stays",
                        query: {
                          d_search: stay.city,
                        },
                      });
                    }}
                    className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                  >
                    {stay.city}
                  </div>{" "}
                  <span className="mx-1">/</span>{" "}
                </div>
                <div
                  onClick={() => {
                    router.push({
                      pathname: "/stays",
                      query: {
                        d_search: stay.location,
                      },
                    });
                  }}
                  className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                >
                  {stay.location}
                </div>
              </div>
              <div className="text-2xl font-bold">{stay.name}</div>
            </div>

            <div ref={scrollToVisible} className="relative -ml-8 -mr-4">
              <ImageGallery images={stay.stay_images}></ImageGallery>

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
                (!isVisible && (stay.type_of_stay !== "HOUSE" || !inCart)
                  ? "!fixed md:!w-[56.5%] lg:!w-[63.5%]  !w-full !top-[70px] left-0 z-10 right-0 bg-slate-100 "
                  : "") +
                (guestPopup ? " !z-0 " : "") +
                (!isVisible && stay.type_of_stay === "HOUSE" && inCart
                  ? "!fixed !w-full !top-[70px] left-0 right-0 z-[10] bg-slate-100 "
                  : "") +
                (stay.type_of_stay === "HOUSE" && inCart
                  ? "h-12 border-b border-gray-200 w-[100%] lg:px-10 px-5 bg-slate-100 absolute left-0 right-0 "
                  : "h-12 border-b border-gray-200 w-[100%] lg:px-10 px-5 bg-slate-100 absolute left-0 right-0 ")
              }
            >
              <ScrollTo guestPopup={guestPopup} stay={stay}></ScrollTo>
            </div>

            <div className="flex flex-wrap gap-1 mt-16">
              {stay.tags.map((tag, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-300 rounded-3xl text-xs capitalize"
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* about */}

            <div className="mt-4">
              <div className="flex">
                <div className="flex flex-col w-full">
                  <div className="text-gray-500 flex justify-between md:justify-start gap-4 md:gap-2 text-sm truncate mt-3 flex-wrap">
                    {stay.room_type && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Type of room
                        </h1>
                        <div className="text-gray-600 capitalize">
                          {stay.room_type.toLowerCase()}
                        </div>
                      </div>
                    )}
                    {stay.type_of_stay && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Type of stay
                        </h1>
                        <div className="text-gray-600 capitalize">
                          {stay.type_of_stay.toLowerCase()}
                        </div>
                      </div>
                    )}
                    {stay.capacity && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Capacity
                        </h1>
                        <div className="text-gray-600">{stay.capacity} max</div>
                      </div>
                    )}
                    {stay.rooms && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Rooms
                        </h1>
                        <div className="text-gray-600">{stay.rooms} rooms</div>
                      </div>
                    )}
                    {stay.beds && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Beds
                        </h1>
                        <div className="text-gray-600">
                          {stay.beds} bedrooms
                        </div>
                      </div>
                    )}
                    {stay.bathrooms && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Bathrooms
                        </h1>
                        <div className="text-gray-600">
                          {stay.bathrooms} baths
                        </div>
                      </div>
                    )}
                    {stay.views > 0 && (
                      <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                        <h1 className="font-bold text-base md:text-lg text-gray-800">
                          Views
                        </h1>
                        <div className="text-gray-600">{stay.views} views</div>
                      </div>
                    )}
                    {/* {stay.capacity && (
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
                        <span>{stay.capacity} Guests</span>
                      </div>
                    )}
                    {stay.rooms && (
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

                        <span>{stay.rooms} rm</span>
                      </div>
                    )}

                    {stay.beds && (
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
                        <span>{stay.beds} bd</span>
                      </div>
                    )}

                    {stay.bathrooms && (
                      <div className="flex items-center gap-0.5">
                        <svg
                          className="w-3 h-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                        </svg>{" "}
                        <span>{stay.bathrooms} ba</span>
                      </div>
                    )} */}
                  </div>

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

                {stay.type_of_stay === "HOUSE" && inCart && (
                  <Button
                    onClick={() => {
                      router.push({ pathname: "/cart" });
                    }}
                    className={
                      "!bg-transparent !hidden md:!flex !w-[200px] h-[45px] !text-black relative border-2 border-pink-500 "
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

                <div
                  className={
                    "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-white py-1 " +
                    (stay.type_of_stay === "HOUSE" && inCart && "!py-2.5")
                  }
                >
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <div className="flex items-center">
                        <Price
                          stayPrice={
                            (numOfAdults === 1
                              ? priceSingleAdultResident
                              : priceAdultResident) *
                              numOfAdults +
                            (numOfAdultsNonResident === 1
                              ? priceSingleAdultNonResident
                              : priceAdultNonResident) *
                              numOfAdultsNonResident +
                            (numOfChildren === 1
                              ? priceSingleChildResident
                              : priceChildResident) *
                              numOfChildren +
                            (numOfChildrenNonResident === 1
                              ? priceSingleChildNonResident
                              : priceChildNonResident) *
                              numOfChildrenNonResident
                          }
                        ></Price>
                        <span className="mt-1">/night</span>

                        {addToCartDate &&
                          addToCartDate.from &&
                          addToCartDate.to && (
                            <div className="mx-1 mb-1 font-bold">.</div>
                          )}

                        {addToCartDate &&
                          addToCartDate.from &&
                          addToCartDate.to && (
                            <span className="text-sm font-bold mt-1.5">
                              {moment(addToCartDate.from).format("MMM DD")} -{" "}
                              {moment(addToCartDate.to).format("MMM DD")}
                            </span>
                          )}
                      </div>

                      {(stay.type_of_stay !== "HOUSE" || !inCart) && (
                        <div className="text-gray-600 text-sm flex flex-wrap self-end">
                          {numOfAdultsNonResident > 0 && (
                            <>
                              <span>
                                {numOfAdultsNonResident}{" "}
                                {numOfAdultsNonResident > 1
                                  ? "Non-Resident Adults"
                                  : "Non-Resident Adult"}
                              </span>
                            </>
                          )}
                          {numOfAdults > 0 && (
                            <>
                              <span className="font-bold mx-0.5 ">,</span>
                              <span>
                                {numOfAdults}{" "}
                                {numOfAdults > 1
                                  ? "Resident Adults"
                                  : "Resident Adult"}
                              </span>
                            </>
                          )}
                          {numOfChildren > 0 && (
                            <>
                              <span className="font-bold mx-0.5 ">,</span>
                              <span>
                                {numOfChildren}{" "}
                                {numOfChildren > 1
                                  ? "Resident Children"
                                  : "Resident Child"}
                              </span>
                            </>
                          )}

                          {numOfChildrenNonResident > 0 && (
                            <>
                              <span className="font-bold mx-0.5 ">,</span>
                              <span>
                                {numOfChildrenNonResident}{" "}
                                {numOfChildrenNonResident > 1
                                  ? "Non-Resident Children"
                                  : "Non-Resident Child"}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {(stay.type_of_stay !== "HOUSE" || !inCart) && (
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
                    )}

                    {stay.type_of_stay === "HOUSE" && inCart && (
                      <Button
                        onClick={() => {
                          router.push({ pathname: "/cart" });
                        }}
                        className={
                          "!bg-gradient-to-r !px-2 from-pink-500 via-red-500 to-yellow-500 !text-white "
                        }
                      >
                        View in basket
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Modal
              showModal={showMobileDateModal}
              closeModal={() => {
                setShowMobileDateModal(!showMobileDateModal);
              }}
              className="md:!hidden overflow-y-auto"
              title="Book this stay"
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
                    {addToCartDate && addToCartDate.from && addToCartDate.to && (
                      <span className="text-sm font-bold mt-1.5">
                        {moment(addToCartDate.from).format("MMM DD")} -{" "}
                        {moment(addToCartDate.to).format("MMM DD")}
                      </span>
                    )}
                    {((addToCartDate && !addToCartDate.to) ||
                      !addToCartDate) && (
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
                    {addToCartDate &&
                      !addToCartDate.from &&
                      !addToCartDate.to && (
                        <div className="text-lg ml-4 font-bold">
                          Select a date
                        </div>
                      )}
                    {!addToCartDate && (
                      <div className="text-lg ml-4 font-bold">
                        Select a date
                      </div>
                    )}
                    {addToCartDate &&
                      addToCartDate.from &&
                      !addToCartDate.to && (
                        <div className="text-lg ml-4 font-bold">
                          Select checkout date
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
                          setAddToCartDate({
                            ...addToCartDate,
                            from: "",
                            to: "",
                          });
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
                    <div className="text-gray-600 text-sm  flex flex-wrap self-end justify-end">
                      {numOfAdultsNonResident > 0 && (
                        <>
                          <span>
                            {numOfAdultsNonResident}{" "}
                            {numOfAdultsNonResident > 1
                              ? "Non-Resident Adults"
                              : "Non-Resident Adult"}
                          </span>
                        </>
                      )}
                      {numOfAdults > 0 && (
                        <>
                          <span className="font-bold mx-0.5 ">,</span>
                          <span>
                            {numOfAdults}{" "}
                            {numOfAdults > 1
                              ? "Resident Adults"
                              : "Resident Adult"}
                          </span>
                        </>
                      )}
                      {numOfChildren > 0 && (
                        <>
                          <span className="font-bold mx-0.5 ">,</span>
                          <span>
                            {numOfChildren}{" "}
                            {numOfChildren > 1
                              ? "Resident Children"
                              : "Resident Child"}
                          </span>
                        </>
                      )}

                      {numOfChildrenNonResident > 0 && (
                        <>
                          <span className="font-bold mx-0.5 ">,</span>
                          <span>
                            {numOfChildrenNonResident}{" "}
                            {numOfChildrenNonResident > 1
                              ? "Non-Resident Children"
                              : "Non-Resident Child"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {showGuestForMobilePopup && (
                  <div className="px-4 mt-4 py-4 bg-white border border-gray-200 rounded-2xl w-full">
                    <div>
                      <Select
                        defaultValue={currentTypeOfLodge}
                        onChange={(value) => {
                          setCurrentTypeOfLodge(value);
                          setNumOfAdults(1);
                          setNumOfChildren(0);
                        }}
                        className={
                          "text-sm outline-none border border-gray-500 "
                        }
                        instanceId={typeOfLodge}
                        placeholder="Type of room"
                        options={typeOfLodge}
                        isSearchable={true}
                      />
                    </div>

                    {currentTypeOfLodge.value === "Standard" && (
                      <div className="text-sm text-gray-500 mt-2">
                        This is the perfect room for you if you are looking for
                        a simple, clean, and affordable room.
                      </div>
                    )}

                    {currentTypeOfLodge.value === "Emperor Suite Room" && (
                      <div className="text-sm text-gray-500 mt-2">
                        This is the perfect room for you if you are looking for
                        the very best and well decorated room this place has to
                        offer
                      </div>
                    )}

                    {currentTypeOfLodge.value === "Presidential Suite Room" && (
                      <div className="text-sm text-gray-500 mt-2">
                        This is the perfect room for you if you are looking for
                        the very best and well decorated room this place has to
                        offer
                      </div>
                    )}
                    {currentTypeOfLodge.value === "Executive Suite Room" && (
                      <div className="text-sm text-gray-500 mt-2">
                        This is the perfect room for you if you are looking for
                        the very best and well decorated room this place has to
                        offer
                      </div>
                    )}

                    {currentTypeOfLodge.value === "Deluxe" && (
                      <div className="text-sm text-gray-500 mt-2">
                        This is the perfect room for you if you are looking for
                        the best this place has to offer.
                      </div>
                    )}

                    {currentTypeOfLodge.value === "Family Room" && (
                      <div className="text-sm text-gray-500 mt-2">
                        If you just want to spend sometime with the family, this
                        is the room for you.
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between mt-6">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfAdultsNonResident}{" "}
                            {numOfAdultsNonResident > 1
                              ? "Non-Residents Adult"
                              : "Non-Resident Adult"}
                          </span>
                          <span>(18+)</span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (
                                (numOfAdultsNonResident > 1 ||
                                  numOfAdults > 0) &&
                                numOfAdultsNonResident > 0
                              ) {
                                setNumOfAdultsNonResident(
                                  numOfAdultsNonResident - 1
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              setNumOfAdultsNonResident(
                                numOfAdultsNonResident + 1
                              );
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>

                      {stay.conservation_or_park &&
                        stay.conservation_or_park_price_non_resident && (
                          <div className="text-sm mt-1 underline">
                            Park/Conservation fees for{" "}
                            <span className="font-bold">each</span> non-resident
                            adult costs{" "}
                            <Price
                              stayPrice={
                                stay.conservation_or_park_price_non_resident
                              }
                              className="text-sm inline font-bold"
                            ></Price>
                          </div>
                        )}
                    </div>

                    <div>
                      <div className="flex justify-between mt-6">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfAdults}{" "}
                            {numOfAdults > 1
                              ? "Residents Adult"
                              : "Resident Adult"}
                          </span>
                          <span>(18+)</span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (
                                (numOfAdults > 1 ||
                                  numOfAdultsNonResident > 0) &&
                                numOfAdults > 0
                              ) {
                                setNumOfAdults(numOfAdults - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              setNumOfAdults(numOfAdults + 1);
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>

                      {stay.conservation_or_park &&
                        stay.conservation_or_park_price && (
                          <div className="text-sm underline mt-1">
                            Park/Conservation fees for{" "}
                            <span className="font-bold">each</span> resident
                            adult costs{" "}
                            <Price
                              stayPrice={stay.conservation_or_park_price}
                              className="text-sm inline font-bold"
                            ></Price>
                          </div>
                        )}
                    </div>

                    <div>
                      <div className="flex justify-between mt-6">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfChildrenNonResident}{" "}
                            {numOfChildrenNonResident > 1
                              ? "Non-Resident Children"
                              : "Non-Resident Child"}
                          </span>
                          <span>(0 - 17)</span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfChildrenNonResident > 0) {
                                setNumOfChildrenNonResident(
                                  numOfChildrenNonResident - 1
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              setNumOfChildrenNonResident(
                                numOfChildrenNonResident + 1
                              );
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>

                      {stay.conservation_or_park &&
                        stay.conservation_or_park_children_price_non_resident && (
                          <div className="text-sm mt-1 underline">
                            Park/Conservation fees for{" "}
                            <span className="font-bold">each</span> non-resident
                            child costs{" "}
                            <Price
                              stayPrice={
                                stay.conservation_or_park_children_price_non_resident
                              }
                              className="text-sm inline font-bold"
                            ></Price>
                          </div>
                        )}
                    </div>

                    <div>
                      <div className="flex justify-between mt-6">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfChildren}{" "}
                            {numOfChildren > 1
                              ? "Resident Children"
                              : "Resident Child"}
                          </span>
                          <span>(0 - 17)</span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfChildren > 0) {
                                setNumOfChildren(numOfChildren - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              setNumOfChildren(numOfChildren + 1);
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                      {stay.conservation_or_park &&
                        stay.conservation_or_park_children_price && (
                          <div className="text-sm mt-1 underline">
                            Park/Conservation fees for{" "}
                            <span className="font-bold">each</span> resident
                            child costs{" "}
                            <Price
                              stayPrice={
                                stay.conservation_or_park_children_price
                              }
                              className="text-sm inline font-bold"
                            ></Price>
                          </div>
                        )}
                    </div>

                    {(numOfAdults > 1 ||
                      numOfChildren > 0 ||
                      numOfAdultsNonResident > 0 ||
                      numOfChildrenNonResident > 0) && (
                      <div
                        className="mt-2 cursor-pointer text-sm underline"
                        onClick={() => {
                          setNumOfAdults(1);
                          setNumOfChildren(0);
                          setNumOfAdultsNonResident(0);
                          setNumOfChildrenNonResident(0);
                        }}
                      >
                        clear data
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className={
                  "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 py-1 " +
                  (stay.type_of_stay === "HOUSE" && inCart && "!py-2.5")
                }
              >
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <div className="flex items-center">
                      <Price
                        stayPrice={
                          (numOfAdults === 1
                            ? priceSingleAdultResident
                            : priceAdultResident) *
                            numOfAdults +
                          (numOfAdultsNonResident === 1
                            ? priceSingleAdultNonResident
                            : priceAdultNonResident) *
                            numOfAdultsNonResident +
                          (numOfChildren === 1
                            ? priceSingleChildResident
                            : priceChildResident) *
                            numOfChildren +
                          (numOfChildrenNonResident === 1
                            ? priceSingleChildNonResident
                            : priceChildNonResident) *
                            numOfChildrenNonResident
                        }
                      ></Price>
                      <span className="mt-1">/night</span>

                      {addToCartDate &&
                        addToCartDate.from &&
                        addToCartDate.to && (
                          <div className="mx-1 mb-1 font-bold">.</div>
                        )}

                      {addToCartDate && addToCartDate.from && addToCartDate.to && (
                        <span className="text-sm font-bold mt-1.5">
                          {moment(addToCartDate.from).format("MMM DD")} -{" "}
                          {moment(addToCartDate.to).format("MMM DD")}
                        </span>
                      )}
                    </div>

                    {(stay.type_of_stay !== "HOUSE" || !inCart) && (
                      <div className="text-gray-600 text-sm flex flex-wrap self-end">
                        {numOfAdultsNonResident > 0 && (
                          <>
                            <span>
                              {numOfAdultsNonResident}{" "}
                              {numOfAdultsNonResident > 1
                                ? "Non-Resident Adults"
                                : "Non-Resident Adult"}
                            </span>
                          </>
                        )}
                        {numOfAdults > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfAdults}{" "}
                              {numOfAdults > 1
                                ? "Resident Adults"
                                : "Resident Adult"}
                            </span>
                          </>
                        )}
                        {numOfChildren > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfChildren}{" "}
                              {numOfChildren > 1
                                ? "Resident Children"
                                : "Resident Child"}
                            </span>
                          </>
                        )}

                        {numOfChildrenNonResident > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfChildrenNonResident}{" "}
                              {numOfChildrenNonResident > 1
                                ? "Non-Resident Children"
                                : "Non-Resident Child"}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      addToBasket();
                    }}
                    className={
                      "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
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
            </Modal>

            <div className="mt-10">
              {!showAllDescription && (
                <p className="font-medium text-gray-600">
                  {stay.description.slice(0, 500)}
                  {stay.description.length > 500 && "..."}
                </p>
              )}
              {showAllDescription && (
                <p className="font-medium text-gray-600">{stay.description}</p>
              )}
              {!showAllDescription && stay.description.length > 500 && (
                <div
                  onClick={() => {
                    setShowAllDescription(true);
                  }}
                  className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
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
                  className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
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

            <div className={"pt-10 " + (reviews.length > 0 ? "" : "")}>
              <h1 className="font-bold text-2xl mb-5">
                What makes this listing unique
              </h1>
              {!showAllUniqueFeature && (
                <p className="ml-2 font-medium">
                  {stay.unique_about_place.slice(0, 500)}
                </p>
              )}
              {showAllUniqueFeature && (
                <p className="ml-2 font-medium">{stay.unique_about_place}</p>
              )}
              {!showAllUniqueFeature && stay.unique_about_place.length > 500 && (
                <div
                  onClick={() => {
                    setShowAllUniqueFeature(true);
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
              {showAllUniqueFeature && (
                <div
                  onClick={() => {
                    setShowAllUniqueFeature(false);
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
          </Element>

          {stay.extras_included.length > 0 && (
            <Element
              name="experiences"
              className="flex flex-col md:flex-row gap-3 justify-between pt-10 "
            >
              <div className="">
                {stay.inclusions.length > 0 && (
                  <>
                    <div className="mb-3">
                      <span className="font-bold text-xl">
                        Included activities
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {stay.inclusions.map((inclusion, index) => (
                        <div key={index} className="w-full md:w-[48%]">
                          <ListItem>{inclusion.name}</ListItem>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mb-3 mt-4">
                  <span className="font-bold text-lg">Extras</span>
                </div>

                {!showMoreExperiences && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {stay.extras_included
                      .slice(0, 5)
                      .map((experience, index) => (
                        <div key={index} className="w-[48%]">
                          <ListItem>{experience.name}</ListItem>
                        </div>
                      ))}
                  </div>
                )}

                {showMoreExperiences && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {stay.extras_included.map((experience, index) => (
                      <div key={index} className="w-[48%]">
                        <ListItem>{experience.name}</ListItem>
                      </div>
                    ))}
                  </div>
                )}

                {!showMoreExperiences && stay.extras_included.length > 5 && (
                  <div
                    onClick={() => {
                      setShowMoreExperiences(true);
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

                {showMoreExperiences && stay.extras_included.length > 5 && (
                  <div
                    onClick={() => {
                      setShowMoreExperiences(false);
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

          {/* ammenities */}
          <Element
            name="amenities"
            className="flex flex-col md:flex-row gap-3 justify-between pt-10"
          >
            <div className="w-full">
              <div className="mb-3">
                <span className="font-bold text-xl">Amenities</span>
              </div>

              <Amenities amenities={stay}></Amenities>

              {stay.facts.length > 0 && (
                <div className="mt-4 ml-2">
                  <div className="flex gap-2 flex-wrap">
                    {stay.facts.map((fact, index) => (
                      <div key={index} className="w-full md:w-[48%]">
                        <ListItem>{fact.name}</ListItem>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Element>

          {/* Experiences */}

          {/* best describe as */}

          {/* unique about place */}

          {/* map */}

          {/* policies */}
          <Element name="policies" className={"w-full pt-12 "}>
            <h1 className="font-bold text-2xl mb-2">Policies</h1>

            {stay.cancellation_policy && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Cancellation Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p className="whitespace-pre-line">
                    {stay.cancellation_policy}
                  </p>
                </div>
              </div>
            )}
            {stay.cancellation_policy_by_provider && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">
                    Cancellation Policy by Provider
                  </span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{stay.cancellation_policy_by_provider}</p>
                </div>
              </div>
            )}

            {stay.health_and_safety_policy && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">
                    Health and safety policy
                  </span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{stay.health_and_safety_policy}</p>
                </div>
              </div>
            )}
            {stay.damage_policy_by_provider && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Damage policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{stay.damage_policy_by_provider}</p>
                </div>
              </div>
            )}
          </Element>

          <Element
            name="map"
            className={"h-[350px] md:h-[450px] relative pt-12 -ml-8 -mr-4"}
          >
            <Map longitude={stay.longitude} latitude={stay.latitude}></Map>
          </Element>

          {/* reviews */}
          <Element name="reviews" className="pt-12">
            {!reviewLoading && reviews.length > 0 && (
              <div>
                <div className="max-w-[750px] mb-10">
                  <h1 className="font-bold text-2xl mb-5">Reviews</h1>
                  <ReviewOverview
                    reviews={reviews}
                    filterReview={filterReview}
                    stay={stay}
                    setFilterRateVal={setFilterRateVal}
                  ></ReviewOverview>
                  <div className="flex gap-2">
                    {!stay.has_user_reviewed && !stay.is_user_stay && (
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
                    )}
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
                    type_of_stay={stay.type_of_stay}
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
              <div className="flex items-center justify-center mb-16 mt-16">
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
        {(stay.type_of_stay !== "HOUSE" || !inCart) && (
          // className="md:fixed hidden right-2 md:w-[42%] h-full md:pl-2 lg:px-0 lg:w-[35%] top-20 md:block"
          <div className="md:fixed hidden right-2 md:w-[42%] h-full md:pl-2 lg:px-0 lg:w-[35%] top-20 bottom-0 overflow-y-scroll md:block">
            <div className="flex h-fit justify-between">
              {
                <div>
                  {addToCartDate &&
                    !addToCartDate.from &&
                    !addToCartDate.to && (
                      <div className="text-xl ml-2 font-bold">
                        Select a date
                      </div>
                    )}
                  {!addToCartDate && (
                    <div className="text-xl ml-2 font-bold">Select a date</div>
                  )}
                  {addToCartDate && addToCartDate.from && !addToCartDate.to && (
                    <div className="text-xl ml-2 font-bold">
                      Select checkout date
                    </div>
                  )}
                </div>
              }
              <div className="flex flex-col">
                <div className="flex self-end">
                  <Price
                    stayPrice={
                      (numOfAdults === 1
                        ? priceSingleAdultResident
                        : priceAdultResident) *
                        numOfAdults +
                      (numOfAdultsNonResident === 1
                        ? priceSingleAdultNonResident
                        : priceAdultNonResident) *
                        numOfAdultsNonResident +
                      (numOfChildren === 1
                        ? priceSingleChildResident
                        : priceChildResident) *
                        numOfChildren +
                      (numOfChildrenNonResident === 1
                        ? priceSingleChildNonResident
                        : priceChildNonResident) *
                        numOfChildrenNonResident
                    }
                  ></Price>
                  <span className="mt-1">/night</span>
                </div>
                {addToCartDate && addToCartDate.from && addToCartDate.to && (
                  <span className="text-gray-600 text-sm font-bold self-end">
                    {moment(addToCartDate.from).format("MMM DD")} -{" "}
                    {moment(addToCartDate.to).format("MMM DD")}
                  </span>
                )}
                <div className="text-gray-600 text-sm flex flex-wrap self-end justify-end">
                  {numOfAdultsNonResident > 0 && (
                    <>
                      <span>
                        {numOfAdultsNonResident}{" "}
                        {numOfAdultsNonResident > 1
                          ? "Non-Resident Adults"
                          : "Non-Resident Adult"}
                      </span>
                    </>
                  )}
                  {numOfAdults > 0 && (
                    <>
                      <span className="font-bold mx-0.5 ">,</span>
                      <span>
                        {numOfAdults}{" "}
                        {numOfAdults > 1 ? "Resident Adults" : "Resident Adult"}
                      </span>
                    </>
                  )}
                  {numOfChildren > 0 && (
                    <>
                      <span className="font-bold mx-0.5 ">,</span>
                      <span>
                        {numOfChildren}{" "}
                        {numOfChildren > 1
                          ? "Resident Children"
                          : "Resident Child"}
                      </span>
                    </>
                  )}

                  {numOfChildrenNonResident > 0 && (
                    <>
                      <span className="font-bold mx-0.5 ">,</span>
                      <span>
                        {numOfChildrenNonResident}{" "}
                        {numOfChildrenNonResident > 1
                          ? "Non-Resident Children"
                          : "Non-Resident Child"}
                      </span>
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
              <div className="">
                {
                  <DatePicker
                    setDate={setAddToCartDate}
                    date={addToCartDate}
                    disableDate={new Date()}
                  ></DatePicker>
                }
              </div>

              {addToCartDate && (addToCartDate.from || addToCartDate.to) && (
                <div
                  className="my-2 cursor-pointer text-sm ml-4 underline"
                  onClick={() => {
                    setAddToCartDate({ ...addToCartDate, from: "", to: "" });
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

                <Dialogue
                  isOpen={guestPopup}
                  closeModal={() => setGuestPopup(false)}
                  dialoguePanelClassName="max-h-[600px] max-w-xl overflow-y-scroll remove-scroll"
                >
                  <Select
                    defaultValue={currentTypeOfLodge}
                    onChange={(value) => {
                      setCurrentTypeOfLodge(value);
                      setNumOfAdults(1);
                      setNumOfAdultsNonResident(0);
                      setNumOfChildren(0);
                      setNumOfChildrenNonResident(0);
                    }}
                    className={"text-sm outline-none border border-gray-500"}
                    instanceId={typeOfLodge}
                    placeholder="Type of room"
                    options={typeOfLodge}
                    isSearchable={true}
                  />

                  {currentTypeOfLodge.value === "Standard" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for a
                      simple, clean, and affordable room.
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Emperor Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Presidential Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}
                  {currentTypeOfLodge.value === "Executive Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Deluxe" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the best this place has to offer.
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Family Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      If you just want to spend sometime with the family, this
                      is the room for you.
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfAdultsNonResident}{" "}
                          {numOfAdultsNonResident > 1
                            ? "Non-Residents Adult"
                            : "Non-Resident Adult"}
                        </span>
                        <span>(18+)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (
                              (numOfAdultsNonResident > 1 || numOfAdults > 0) &&
                              numOfAdultsNonResident > 0
                            ) {
                              setNumOfAdultsNonResident(
                                numOfAdultsNonResident - 1
                              );
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfAdultsNonResident(
                              numOfAdultsNonResident + 1
                            );
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {stay.conservation_or_park &&
                      stay.conservation_or_park_price_non_resident && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> non-resident
                          adult costs{" "}
                          <Price
                            stayPrice={
                              stay.conservation_or_park_price_non_resident
                            }
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfAdults}{" "}
                          {numOfAdults > 1
                            ? "Residents Adult"
                            : "Resident Adult"}
                        </span>
                        <span>(18+)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (
                              (numOfAdults > 1 || numOfAdultsNonResident > 0) &&
                              numOfAdults > 0
                            ) {
                              setNumOfAdults(numOfAdults - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfAdults(numOfAdults + 1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {stay.conservation_or_park &&
                      stay.conservation_or_park_price && (
                        <div className="text-sm underline mt-1">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> resident adult
                          costs{" "}
                          <Price
                            stayPrice={stay.conservation_or_park_price}
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfChildrenNonResident}{" "}
                          {numOfChildrenNonResident > 1
                            ? "Non-Resident Children"
                            : "Non-Resident Child"}
                        </span>
                        <span>(0 - 17)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfChildrenNonResident > 0) {
                              setNumOfChildrenNonResident(
                                numOfChildrenNonResident - 1
                              );
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfChildrenNonResident(
                              numOfChildrenNonResident + 1
                            );
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {stay.conservation_or_park &&
                      stay.conservation_or_park_children_price_non_resident && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> non-resident
                          child costs{" "}
                          <Price
                            stayPrice={
                              stay.conservation_or_park_children_price_non_resident
                            }
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfChildren}{" "}
                          {numOfChildren > 1
                            ? "Resident Children"
                            : "Resident Child"}
                        </span>
                        <span>(0 - 17)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfChildren > 0) {
                              setNumOfChildren(numOfChildren - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfChildren(numOfChildren + 1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                    {stay.conservation_or_park &&
                      stay.conservation_or_park_children_price && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> resident child
                          costs{" "}
                          <Price
                            stayPrice={stay.conservation_or_park_children_price}
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  {(numOfAdultsNonResident > 1 ||
                    numOfChildren > 0 ||
                    numOfAdults > 0 ||
                    numOfChildrenNonResident > 0) && (
                    <div
                      className="mt-2 cursor-pointer text-sm underline"
                      onClick={() => {
                        setNumOfAdults(0);
                        setNumOfChildren(0);
                        setNumOfAdultsNonResident(1);
                        setNumOfChildrenNonResident(0);
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
                </Dialogue>
              </div>
              <div className="flex justify-around gap-2 mb-24">
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
                    disabled={
                      !addToCartDate || (addToCartDate && !addToCartDate.to)
                    }
                    className={
                      "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                      (!inCart ? "!w-full" : "!w-[48%]") +
                      (!addToCartDate || (addToCartDate && !addToCartDate.to)
                        ? " !opacity-70 cursor-not-allowed"
                        : "")
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
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

StaysDetail.propTypes = {};

export async function getServerSideProps(context) {
  let exist = false;
  try {
    const token = getToken(context);
    let cart = getCart(context);

    const stay = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${context.query.slug}/`
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
        `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      exist = data.results.some((val) => {
        return val.stay.slug === context.query.slug;
      });

      const stay = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${context.query.slug}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stay: stay.data,
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
          stay: stay.data,
          inCart: exist,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        stay: stay.data,
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
          stay: "",
          inCart: exist,
        },
      };
    }
  }
}

export default StaysDetail;
