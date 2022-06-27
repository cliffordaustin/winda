import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import SwiperCore from "swiper";
import { Element } from "react-scroll";

import Navbar from "../../components/Stay/Navbar";
import getToken from "../../lib/getToken";
import getCart from "../../lib/getCart";
import ImageGallery from "../../components/Transport/ImageGallery";
import Footer from "../../components/Transport/Footer";
import Accordion from "../../components/ui/Accordion";
import Share from "../../components/Stay/Share";
import Price from "../../components/Stay/Price";
import Button from "../../components/ui/Button";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import Search from "../../components/Order/Search";
import ClientOnly from "../../components/ClientOnly";
import Modal from "../../components/ui/Modal";
import MobileModal from "../../components/ui/FullScreenMobileModal";
import MapBox from "../../components/Transport/Map";
import Reviews from "../../components/Transport/Reviews";
import ReviewOverview from "../../components/Transport/ReviewOverview";
import AllReviews from "../../components/Transport/AllReviews";
import CreateReview from "../../components/Transport/CreateReview";
import Switch from "../../components/ui/Switch";
import SearchBar from "../../components/Trip/Search";
import ScrollTo from "../../components/Transport/ScrollTo";
import useOnScreen from "../../lib/onScreen";

import "swiper/css";
import moment from "moment";
import DatePicker from "../../components/ui/DatePicker";
import ListItem from "../../components/ui/ListItem";

function TransportDetail({ userProfile, transport, inCart }) {
  const router = useRouter();

  const mapRoute = useSelector((state) => state.home.mapRoute);

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 2,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
    swiperIndex: 0,
    from: "",
    to: "",
    fromLat: 0,
    fromLong: 0,
    toLat: 0,
    toLong: 0,
  });

  const [basketState, setBasketState] = useState({
    from: "",
    to: "",
    fromLat: 0,
    fromLong: 0,
    toLat: 0,
    toLong: 0,
  });

  const settings = {
    spaceBetween: 40,
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const dispatch = useDispatch();

  const sortedImages = transport.transportation_images.sort(
    (x, y) => y.main - x.main
  );

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const [newPrice, setNewPrice] = useState(null);

  const [liked, setLiked] = useState(false);

  const [showShare, setShowShare] = useState(false);

  const [showSearchDetails, setShowSearchDetails] = useState(false);

  const [featuresAccordion, setFeaturesAccordion] = useState(true);

  const [showRouteInMap, setShowRouteInMap] = useState(false);

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
            transport_id: transport.id,
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

  const scrollToVisible = useRef(null);

  const isVisible = useOnScreen(scrollToVisible);

  const price = () => {
    return transport.price;
  };

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
  });

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

  const [priceDistanceCalculator, setPriceDistanceCalculator] = useState(true);

  const [reviewAccordion, setReviewsAccordion] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [filteredReviews, setFilteredReviews] = useState(null);

  const [showCreateReview, setShowCreateReview] = useState(false);

  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewCount, setReviewCount] = useState(0);

  const [nextReview, setNextReview] = useState(null);

  const [prevReview, setPrevReview] = useState(null);

  const [reviewPageSize, setReviewPageSize] = useState(0);

  const [filterRateVal, setFilterRateVal] = useState(0);
  const [spinner, setSpinner] = useState(false);

  const getReview = async () => {
    setReviewLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/transport/${transport.slug}/reviews/`
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
    getReview();
  }, []);

  const filterReview = async (rate) => {
    setSpinner(true);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/transport/${transport.slug}/reviews/?rate=${rate}`
    );
    setFilteredReviews(data.results);
    setReviewCount(data.count);
    setNextReview(data.next);
    setPrevReview(data.previous);
    setSpinner(false);
  };

  const addToBasket = async () => {
    const token = Cookies.get("token");

    setAddToBasketLoading(true);

    if (token) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${transport.slug}/add-to-cart/`,
          {
            starting_point:
              state.swiperIndex === 0 ? startingDestination : basketState.from,
            destination: state.swiperIndex === 0 ? "" : basketState.to,
            distance: state.swiperIndex === 0 ? null : mapRoute.distance,
            user_need_a_driver: needADriver,
            from_date: startingDate,
            number_of_days: state.swiperIndex === 0 ? numberOfDays : null,
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
        return val.slug === transport.slug;
      });
      if (!exist) {
        data.push({
          slug: transport.slug,
          itemCategory: "transport",
          starting_point:
            state.swiperIndex === 0 ? startingDestination : basketState.from,
          destination: state.swiperIndex === 0 ? "" : basketState.to,
          distance: state.swiperIndex === 0 ? null : mapRoute.distance,
          user_need_a_driver: needADriver,
          from_date: startingDate,
          number_of_days: state.swiperIndex === 0 ? numberOfDays : null,
        });
        Cookies.set("cart", JSON.stringify(data));
        location.reload();
      }
    }
  };

  const [showBasketPopup, setShowBasketPopup] = useState(false);

  const [showDetailBasket, setShowDetailBasket] = useState(false);

  const [needADriver, setNeedADriver] = useState(false);

  const [showHirePerDay, setShowHirePerDay] = useState(false);

  const [numberOfDays, setNumberOfDays] = useState(1);

  const [startingDestination, setStartingDestination] = useState("");

  const [startingDate, setStartingDate] = useState(new Date());

  const [showStartingDate, setShowStartingDate] = useState(false);

  return (
    <div className="relative">
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

      <div className="flex flex-col md:flex-row justify-around relative h-full w-full">
        <div className="md:fixed left-2 md:w-[60%] lg:w-[64%] h-[50vh] md:h-[87vh] top-20 md:block">
          <ImageGallery images={images}></ImageGallery>
        </div>
        <div className="md:absolute md:mt-0 mt-10 right-0 md:block top-20 md:w-[38%] lg:w-[35%]">
          <Element name="about" className="">
            <div ref={scrollToVisible}></div>

            <div className="px-4">
              <div className="flex items-center gap-2">
                <h1 className="font-bold capitalize text-2xl">
                  {transport.vehicle_make.toLowerCase()}
                </h1>
                {/* <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-3 w-3 relative">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: transport.vehicle_color }}
                    ></span>
                    <span
                      className="relative inline-flex rounded-full h-3 w-3"
                      style={{ backgroundColor: transport.vehicle_color }}
                    ></span>
                  </span>
                </div> */}
              </div>
              <h2 className="lowercase -mt-1 text-lg text-gray-400">
                {transport.type_of_car}
              </h2>

              <div className="mt-3 flex items-center gap-2">
                {transport.price_per_day && (
                  <div className="flex gap-0.5">
                    <Price stayPrice={transport.price_per_day}></Price>
                    <div className="text-xs mt-2">{"/day"}</div>
                  </div>
                )}
              </div>

              <div className="sm:w-[70%] mx-auto flex items-center mt-4 gap-2 justify-between self-start md:w-full">
                {slugIsCorrect && (
                  <div className="!w-[40%] md:!w-[50%] lg:!w-[40%]">
                    <Button
                      onClick={() => {
                        addToTrip();
                      }}
                      className={
                        "!bg-blue-500 !text-white !w-full flex gap-2 !border-2 border-blue-500"
                      }
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
                {!inCart && (
                  <Button
                    onClick={() => {
                      setShowBasketPopup(true);
                    }}
                    className={
                      "!bg-transparent flex gap-1.5 !text-black !border-2 border-blue-800 " +
                      (slugIsCorrect
                        ? "!w-[60%] md:!w-[50%] lg:!w-[60%]"
                        : "w-full")
                    }
                  >
                    Add to basket
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:hidden lg:block"
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
                    <div
                      className={
                        " " + (!addToBasketLoading ? "hidden" : "ml-2")
                      }
                    >
                      <LoadingSpinerChase
                        width={16}
                        height={16}
                        color="#000"
                      ></LoadingSpinerChase>
                    </div>
                  </Button>
                )}
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

              <div className="flex absolute bg-white shadow-md px-3 rounded-3xl py-1 top-16 right-3 gap-2 items-center">
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
                        setLiked(true);
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
                        setLiked(false);
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

            <div className="mt-6">
              <Accordion
                title="Features & Specs"
                accordion={featuresAccordion}
                setAccordion={setFeaturesAccordion}
              >
                <div className="mt-2 ml-2 flex flex-col gap-2">
                  <h1 className="font-semibold mb-2 ">Comfort</h1>

                  {transport.has_air_condition && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M20 10q-.425 0-.712-.288Q19 9.425 19 9t.288-.713Q19.575 8 20 8t.712.287Q21 8.575 21 9t-.288.712Q20.425 10 20 10Zm-9 12q-.425 0-.712-.288Q10 21.425 10 21v-2.6l-1.9 1.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l3.3-3.3V14H8.4l-3.3 3.3q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7L5.6 14H3q-.425 0-.712-.288Q2 13.425 2 13t.288-.713Q2.575 12 3 12h2.6l-1.9-1.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L8.4 12H10v-1.6L6.7 7.1q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L10 7.6V5q0-.425.288-.713Q10.575 4 11 4t.713.287Q12 4.575 12 5v2.6l1.9-1.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L12 10.4V12h7q.425 0 .712.287q.288.288.288.713t-.288.712Q19.425 14 19 14h-2.6l1.9 1.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L13.6 14H12v1.6l3.3 3.3q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 18.4V21q0 .425-.287.712Q11.425 22 11 22Zm9-15q-.425 0-.712-.287Q19 6.425 19 6V3q0-.425.288-.713Q19.575 2 20 2t.712.287Q21 2.575 21 3v3q0 .425-.288.713Q20.425 7 20 7Z"
                        />
                      </svg>

                      <span>Air conditioning</span>
                    </div>
                  )}

                  {transport.open_roof && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m16 6l-1 .75L17.5 10h-4V8.5H12V10H3c-1.11 0-2 .89-2 2v3h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4M6 13.5A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5Z"
                        />
                      </svg>
                      <span>Open roof</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 ml-2 flex flex-col gap-2">
                  <h1 className="font-semibold mb-2 ">Entertainment</h1>

                  {transport.fm_radio && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m20.25 5.025l-7.898-2.962l-.703 1.873L14.484 5H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.018-.767-1.85-1.75-1.975zM4 19v-7h16v-2H4V7h16l.001 12H4z"
                        />
                        <circle
                          cx="16.5"
                          cy="15.5"
                          r="2.5"
                          fill="currentColor"
                        />
                        <path fill="currentColor" d="M6 15h4.999v2H6z" />
                      </svg>

                      <span>FM</span>
                    </div>
                  )}

                  {transport.cd_player && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 48 48"
                      >
                        <mask id="svgIDa">
                          <g fill="none" stroke="#fff" strokeWidth="4">
                            <circle cx="24" cy="24" r="18" />
                            <path
                              strokeLinecap="round"
                              d="M13 24c0-6.075 4.925-11 11-11"
                            />
                            <circle cx="24" cy="24" r="5" fill="#fff" />
                          </g>
                        </mask>
                        <path
                          fill="currentColor"
                          d="M0 0h48v48H0z"
                          mask="url(#svgIDa)"
                        />
                      </svg>
                      <span>CD</span>
                    </div>
                  )}

                  {transport.bluetooth && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m5 7l12 10l-6 5V2l6 5L5 17"
                        />
                      </svg>
                      <span>Bluetooth</span>
                    </div>
                  )}

                  {transport.audio_input && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M11 4V3c0-.55.45-1 1-1s1 .45 1 1v1h-2m2 5V5h-2v4H9v6c0 1.3.84 2.4 2 2.82V22h2v-4.18c1.16-.42 2-1.52 2-2.82V9h-2Z"
                        />
                      </svg>
                      <span>Audio Input</span>
                    </div>
                  )}

                  {transport.cruise_control && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M22 15c0 2.6-1.2 4.9-3.1 6.3l-.5-.5l-2.1-2.1l1.4-1.4l1.2 1.2c.5-.7.9-1.6 1-2.5H18v-2h1.9c-.2-.9-.5-1.7-1-2.5l-1.2 1.2l-1.4-1.4l1.2-1.2c-.7-.5-1.6-.9-2.5-1V11h-2V9.1c-.9.2-1.7.5-2.5 1l3 3c.2 0 .3-.1.5-.1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-.2 0-.3.1-.5l-3-3c-.5.7-.9 1.6-1 2.5H10v2H8.1c.2.9.5 1.7 1 2.5l1.2-1.2l1.4 1.4l-2.6 2.6C7.2 19.9 6 17.6 6 15a8 8 0 0 1 8-8a8 8 0 0 1 8 8M6.7 5.3L3.4 2L2 3.4l3.3 3.3L4 8h4V4L6.7 5.3Z"
                        />
                      </svg>

                      <span>Cruise Control</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 ml-2 flex flex-col gap-2">
                  <h1 className="font-semibold mb-2 ">Safety</h1>

                  {transport.overhead_passenger_airbag && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M14 8a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5m-3.54 7.55L13 18.03l-2 .02l-3.5 3.53L6 20.09l4.46-4.54M17 2c1.08 0 2 .88 2 2c0 1.08-.88 2-2 2c-1.08 0-2-.88-2-2c0-1.08.89-2 2-2m-2.59 13h-2.82l5.7 5.71l1.42-1.42l-4.3-4.29m.71-.71l4.29 4.3l.22.21c.23-.38.37-.8.37-1.3v-8A2.5 2.5 0 0 0 17.5 7A2.5 2.5 0 0 0 15 9.5v4.67l.12.12Z"
                        />
                      </svg>

                      <span>Overhead passenger airbag</span>
                    </div>
                  )}

                  {transport.side_airbag && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 640 512"
                      >
                        <path
                          fill="currentColor"
                          d="M176 8c6.6 0 12.4 3.1 14.9 10.09l29.4 73.96l76.1-23.12c6.3-1.9 13.1.21 17.2 5.34c.5.58.9 1.18 1.3 1.81c-17.1 8.24-32.2 20.85-43.5 37.22l-41 59.2c-27.3 8.9-49.8 31-57.8 60.9l-19.9 74l-35.3 32.5c-4.8 4.5-11.9 5.5-17.76 2.7c-5.91-2.9-9.48-9-9.02-15.6l5.59-79.4l-78.65-12.2c-6.48-1-11.689-5.8-13.147-12.2c-1.459-6.4 1.127-13.1 6.527-16.8l65.56-45.1l-39.49-69.12a15.991 15.991 0 0 1 1.39-17.91a15.986 15.986 0 0 1 17.15-5.34l76.15 23.12l29.4-73.96C163.6 11.1 169.4 8 176 8zm208.2 91.67l135.6 35.43c32.7 9.6 56.3 38 59 71.7l6.9 83.9c17.2 13.5 25.6 36.3 19.6 58.7l-35.2 131.4c-4.6 17-23 26.3-39.2 22.6l-15.4-4.1c-17.1-4.6-27.2-22.2-22.7-39.2l8.3-31l-247.3-66.2l-8.2 30.9c-5.5 17.1-22.2 27.2-39.2 22.6l-15.5-4.1c-17.1-4.6-27.2-22.1-22.6-39.2l35.2-131.4c6-22.4 24.7-37.9 46.3-41l47.9-69.2c19.2-27.9 53.9-40.58 86.5-31.83zm-16.5 61.83c-6.6-1.8-13.5.8-17.3 6.3l-32.3 46.7l201.5 54l-4.6-57.4c-.5-5.9-5.2-11.5-11.8-13.3l-135.5-36.3zm-99.4 147.3c12.8 3.4 26-4.2 29.4-17c3.5-12.8-4.1-25.9-16.9-29.4c-13.7-3.4-26 4.2-29.4 17c-3.5 12.8 4.1 26 16.9 29.4zM528 328.7c-12.8-3.4-25.9 4.2-29.4 17c-3.4 12.8 4.2 25.9 17 29.4c12.8 3.4 26-4.2 29.4-17c3.4-12.8-4.2-26-17-29.4z"
                        />
                      </svg>

                      <span>Side airbag</span>
                    </div>
                  )}

                  {transport.power_windows && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M20.253 4.004c.966 0 1.75.784 1.75 1.75V18.25a1.75 1.75 0 0 1-1.75 1.75h-7.248a1.79 1.79 0 0 1-.255-.018V4.023a1.79 1.79 0 0 1 .255-.019h7.248Zm-2.081 5.411a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Zm-7.167-5.413c.084 0 .166.006.246.017V19.98c-.08.011-.162.017-.246.017H3.758a1.75 1.75 0 0 1-1.75-1.75V5.752c0-.967.783-1.75 1.75-1.75h7.247ZM7.172 9.415a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Z"
                        />
                      </svg>

                      <span>Power windows</span>
                    </div>
                  )}

                  {transport.power_locks && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Power locks</span>
                    </div>
                  )}

                  {transport.power_mirrors && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="w-6 h-6"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <g fill="currentColor">
                          <path d="M5 8h14v6h-3v2h5V6H3v10h5v-2H5V8Z" />
                          <path d="M16.33 19L12 13l-4.33 6h8.66Z" />
                        </g>
                      </svg>
                      <span>Power mirrors</span>
                    </div>
                  )}
                </div>
              </Accordion>
            </div>

            <div className="px-4">
              <div className="mt-6 mb-6">
                <h1 className="font-bold mb-2">Safety tools</h1>
                <div className="flex">
                  {transport.safety_tools.map((safety_tool, index) => (
                    <div
                      key={index}
                      className="bg-red-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                    >
                      {safety_tool}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 mb-6">
                <h1 className="font-bold mb-2">Car operates within</h1>
                <div className="flex">
                  {transport.dropoff_city.split(",").map((city, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Element>

          <Element name="policies" className={"w-full pt-6 px-2 "}>
            <h1 className="font-bold text-2xl mb-2">Policies</h1>
            <div className="py-2 px-2 border-b border-gray-100">
              <span className="font-semibold">Refund Policy</span>
            </div>
            {!transport.refundable && (
              <div className="mt-2 ml-2">
                <p>Bookings at this transport is non-refundable.</p>
              </div>
            )}

            {transport.refundable && (
              <div className="mt-2 ml-2">
                <p>Bookings at this transport is refundable.</p>
                <div className="mt-6">{transport.refund_policy}</div>
              </div>
            )}

            {transport.damage_policy && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Damage Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{transport.damage_policy}</p>
                </div>
              </div>
            )}

            {transport.covid_19_compliance && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Covid-19 Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{transport.covid_19_compliance_details}</p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="py-2 px-2 border-b border-gray-100">
                <span className="font-semibold">Rules</span>
              </div>

              <div className="mt-2 ml-2">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Children allowed:{" "}
                      <span className="font-bold">
                        {transport.children_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Pets allowed:{" "}
                      <span className="font-bold">
                        {transport.pets_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>
                </div>
              </div>
            </div>
          </Element>

          <Element name="reviews" className="pt-4">
            <div className="ml-2">
              {reviews.length === 0 && (
                <>
                  <div className="flex gap-2">
                    {!transport.has_user_reviewed &&
                      !transport.is_user_transport && (
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
                  </div>
                  <div>
                    <CreateReview
                      show={showCreateReview}
                      setShowCreateReview={setShowCreateReview}
                    ></CreateReview>
                  </div>
                </>
              )}
            </div>

            {!reviewLoading && reviews.length > 0 && (
              <div className="mt-4">
                <Accordion
                  title="Reviews"
                  accordion={reviewAccordion}
                  setAccordion={setReviewsAccordion}
                >
                  <div>
                    <div className="">
                      <ReviewOverview
                        reviews={reviews}
                        filterReview={filterReview}
                        transport={transport}
                        setFilterRateVal={setFilterRateVal}
                      ></ReviewOverview>
                      <div className="flex gap-2">
                        {!transport.has_user_reviewed &&
                          !transport.is_user_transport && (
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

                    <div className="mt-4">
                      <Reviews
                        reviews={reviews}
                        spinner={spinner}
                        filteredReviews={filteredReviews}
                        setShowAllReviews={setShowAllReviews}
                        count={reviewCount}
                      ></Reviews>
                    </div>
                  </div>

                  {reviewLoading && (
                    <div className="flex items-center justify-center mb-16">
                      <LoadingSpinerChase
                        width={35}
                        height={35}
                        color="#000"
                      ></LoadingSpinerChase>
                    </div>
                  )}
                </Accordion>
              </div>
            )}
          </Element>

          <div className="mt-4">
            <Footer></Footer>
          </div>
        </div>
      </div>

      <MobileModal
        showModal={showBasketPopup}
        closeModal={() => {
          setShowBasketPopup(false);
        }}
        className="md:!hidden"
        title="Book this ride"
      >
        <div className={"!h-full !w-full !overflow-y-scroll remove-scroll"}>
          <div className="!px-4 !mt-6 !h-full">
            <div
              onClick={() => {
                setShowStartingDate(false);
              }}
              className="h-full"
            >
              <SearchBar
                location={startingDestination}
                setLocation={setStartingDestination}
              ></SearchBar>

              <div className="mt-3 mb-3">
                <h1 className="font-bold mb-2">Car operates within</h1>
                <div className="flex">
                  {transport.dropoff_city.split(",").map((city, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 ml-4 relative">
                <div className="flex gap-1 items-center">
                  <span className="font-bold">Select a starting date</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">
                    {moment(startingDate).format("Do MMMM YYYY")}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-4 text-blue-600 cursor-pointer"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStartingDate(!showStartingDate);
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M8.707 19.707L18 10.414L13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586L19.414 9L21 7.414z"
                    />
                  </svg>
                </div>
                <DatePicker
                  date={startingDate}
                  setDate={setStartingDate}
                  showDate={showStartingDate}
                  setShowDate={setShowStartingDate}
                  disableDate={new Date()}
                  className="!w-[400px] !top-[46px]"
                ></DatePicker>

                <div className="mb-1 font-semibold">
                  How long do you need this car?
                </div>

                <div className="flex gap-3 items-center mb-4 mt-2">
                  <div
                    onClick={() => {
                      if (numberOfDays > 1) {
                        setNumberOfDays(numberOfDays - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-gray-100 shadow-lg font-bold"
                  >
                    -
                  </div>

                  <div className="font-bold">
                    {numberOfDays} {numberOfDays > 1 ? "days" : "day"}
                  </div>
                  <div
                    onClick={() => {
                      setNumberOfDays(numberOfDays + 1);
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-gray-100 shadow-lg font-bold"
                  >
                    +
                  </div>
                </div>
              </div>

              <div className="mt-6 ml-4 relative">
                <div className="mb-1 font-semibold">Do you need a driver?</div>
                <div className="flex gap-2 items-center">
                  <Switch
                    switchButton={needADriver}
                    changeSwitchButtonState={() => {
                      setNeedADriver(!needADriver);
                    }}
                    switchButtonContainer="!w-[55px] !h-6"
                    switchButtonCircle="!w-5 !h-5 !bg-blue-500"
                    slideColorClass="!bg-blue-200"
                  ></Switch>
                  {!needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(true);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      no
                    </div>
                  )}
                  {needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(false);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      yes
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* <SwiperSlide className="!px-4 !mt-6">
            <div className="swiper-pagination-class swiper-button-prev-class cursor-pointer flex items-center gap-1 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-bold text-blue-600">Back</h3>
            </div>
            <div className="mb-2 ml-2 font-bold text-lg">Destination</div>
            <Search
              state={basketState}
              setState={setBasketState}
              setShowSearchDetails={setShowDetailBasket}
            ></Search>

            <div className="mt-2 ml-1 relative">
              <div className="mt-4 relative">
                <div className="flex gap-1 items-center">
                  <span className="font-bold">Select a starting date</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">
                    {moment(startingDate).format("Do MMMM YYYY")}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-4 text-blue-600 cursor-pointer"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStartingDate(!showStartingDate);
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M8.707 19.707L18 10.414L13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586L19.414 9L21 7.414z"
                    />
                  </svg>
                </div>
                <DatePicker
                  date={startingDate}
                  setDate={setStartingDate}
                  showDate={showStartingDate}
                  setShowDate={setShowStartingDate}
                  disableDate={new Date()}
                  className="!w-[400px] !top-[46px]"
                ></DatePicker>
              </div>
              <div className="mb-1 font-semibold">Do you need a driver?</div>
              <div className="flex gap-2 items-center">
                <Switch
                  switchButton={needADriver}
                  changeSwitchButtonState={() => {
                    setNeedADriver(!needADriver);
                  }}
                  switchButtonContainer="!w-[55px] !h-6"
                  switchButtonCircle="!w-5 !h-5 !bg-blue-500"
                  slideColorClass="!bg-blue-200"
                ></Switch>
                {!needADriver && (
                  <div
                    onClick={() => {
                      setNeedADriver(true);
                    }}
                    className="cursor-pointer text-sm mb-1"
                  >
                    no
                  </div>
                )}
                {needADriver && (
                  <div
                    onClick={() => {
                      setNeedADriver(false);
                    }}
                    className="cursor-pointer text-sm mb-1"
                  >
                    yes
                  </div>
                )}
              </div>
            </div>

            {showDetailBasket && (
              <div>
                <div className="mt-6 flex justify-between items-center">
                  <span className="font-bold">Total distance</span>
                  <span>{(mapRoute.distance * 0.001).toFixed(1)}km</span>
                </div>
              </div>
            )}
          </SwiperSlide> */}
          </div>
        </div>

        <div
          className={
            "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 py-1 "
          }
        >
          <div className="flex justify-between items-center gap-2">
            <div>
              <div className="flex items-center">
                <Price
                  stayPrice={
                    (state.swiperIndex === 0
                      ? transport.price_per_day
                      : transport.price) *
                      (state.swiperIndex === 0 ? numberOfDays : 1) *
                      (state.swiperIndex === 1 && mapRoute.distance
                        ? (mapRoute.distance * 0.001) / 10
                        : 1) +
                    (needADriver ? transport.additional_price_with_a_driver : 0)
                  }
                ></Price>
              </div>
            </div>

            <Button
              onClick={() => {
                addToBasket();
              }}
              disabled={
                (state.swiperIndex === 0 && !startingDestination) ||
                (state.swiperIndex === 1 && !showDetailBasket)
              }
              className={
                "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                (((state.swiperIndex === 0 && !startingDestination) ||
                  (state.swiperIndex === 1 && !showDetailBasket)) &&
                  "!opacity-60 !border-blue-100 cursor-not-allowed")
              }
            >
              {!inCart ? "Book" : "Book again"}
              <div className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}>
                <LoadingSpinerChase
                  width={16}
                  height={16}
                  color="#fff"
                ></LoadingSpinerChase>
              </div>
            </Button>
          </div>
        </div>
      </MobileModal>

      <Modal
        showModal={showBasketPopup}
        className={"max-w-[600px] !py-2 !pt-4 !hidden md:!block h-[500px]"}
        backdropClassName="!hidden md:!block"
        closeModal={() => {
          setShowBasketPopup(false);
        }}
      >
        <div className={"!h-full !w-full !overflow-y-scroll remove-scroll"}>
          <div>
            <div
              onClick={() => {
                setShowStartingDate(false);
              }}
              className="h-full"
            >
              <SearchBar
                location={startingDestination}
                setLocation={setStartingDestination}
              ></SearchBar>

              <div className="mt-3 mb-3">
                <h1 className="font-bold mb-2">Car operates within</h1>
                <div className="flex">
                  {transport.dropoff_city.split(",").map((city, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 ml-4 relative">
                <div className="flex gap-1 items-center">
                  <span className="font-bold">Select a starting date</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-3 mt-0.5">
                  <span className="text-sm font-bold text-blue-600">
                    {moment(startingDate).format("Do MMMM YYYY")}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="h-4 w-4 text-blue-600 cursor-pointer"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStartingDate(!showStartingDate);
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M8.707 19.707L18 10.414L13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586L19.414 9L21 7.414z"
                    />
                  </svg>
                </div>
                <DatePicker
                  date={startingDate}
                  setDate={setStartingDate}
                  showDate={showStartingDate}
                  setShowDate={setShowStartingDate}
                  disableDate={new Date()}
                  className="!w-[400px] !top-[46px]"
                ></DatePicker>

                <div className="mb-1 font-semibold">
                  How long do you need this car?
                </div>

                <div className="flex gap-3 items-center mb-4 mt-2">
                  <div
                    onClick={() => {
                      if (numberOfDays > 1) {
                        setNumberOfDays(numberOfDays - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-gray-100 shadow-lg font-bold"
                  >
                    -
                  </div>

                  <div className="font-bold">
                    {numberOfDays} {numberOfDays > 1 ? "days" : "day"}
                  </div>
                  <div
                    onClick={() => {
                      setNumberOfDays(numberOfDays + 1);
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-gray-100 shadow-lg font-bold"
                  >
                    +
                  </div>
                </div>
              </div>

              <div className="mt-6 ml-4 relative">
                <div className="mb-1 font-semibold">Do you need a driver?</div>
                <div className="flex gap-2 items-center">
                  <Switch
                    switchButton={needADriver}
                    changeSwitchButtonState={() => {
                      setNeedADriver(!needADriver);
                    }}
                    switchButtonContainer="!w-[55px] !h-6"
                    switchButtonCircle="!w-5 !h-5 !bg-blue-500"
                    slideColorClass="!bg-blue-200"
                  ></Switch>
                  {!needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(true);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      no
                    </div>
                  )}
                  {needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(false);
                      }}
                      className="cursor-pointer text-sm"
                    >
                      yes
                    </div>
                  )}
                </div>
              </div>

              {
                <Button
                  onClick={() => {
                    addToBasket();
                  }}
                  disabled={startingDestination ? false : true}
                  className={
                    "!bg-blue-600 mt-4 flex gap-1.5 !w-full !text-white !border-2 border-blue-600 " +
                    (!startingDestination
                      ? "!bg-opacity-50 !border-blue-100"
                      : "")
                  }
                >
                  Add to basket
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 "
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
              }
            </div>
          </div>

          <div>
            {/* <SwiperSlide>
              <div className="swiper-pagination-class swiper-button-prev-class cursor-pointer flex items-center gap-1 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-bold text-blue-600">Back</h3>
              </div>
              <div className="mb-2 ml-2 font-bold text-lg">Destination</div>
              <Search
                state={basketState}
                setState={setBasketState}
                setShowSearchDetails={setShowDetailBasket}
              ></Search>

              <div className="mt-2 ml-1 relative">
                <div className="mt-4 relative">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold">Select a starting date</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-3 mt-0.5">
                    <span className="text-sm font-bold text-blue-600">
                      {moment(startingDate).format("Do MMMM YYYY")}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="h-4 w-4 text-blue-600 cursor-pointer"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStartingDate(!showStartingDate);
                      }}
                    >
                      <path
                        fill="currentColor"
                        d="M8.707 19.707L18 10.414L13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586L19.414 9L21 7.414z"
                      />
                    </svg>
                  </div>
                  <DatePicker
                    date={startingDate}
                    setDate={setStartingDate}
                    showDate={showStartingDate}
                    setShowDate={setShowStartingDate}
                    disableDate={new Date()}
                    className="!w-[400px] !top-[46px]"
                  ></DatePicker>
                </div>
                <div className="mb-1 font-semibold">Do you need a driver?</div>
                <div className="flex gap-2 items-center">
                  <Switch
                    switchButton={needADriver}
                    changeSwitchButtonState={() => {
                      setNeedADriver(!needADriver);
                    }}
                    switchButtonContainer="!w-[55px] !h-6"
                    switchButtonCircle="!w-5 !h-5 !bg-blue-500"
                    slideColorClass="!bg-blue-200"
                  ></Switch>
                  {!needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(true);
                      }}
                      className="cursor-pointer text-sm mb-1"
                    >
                      no
                    </div>
                  )}
                  {needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(false);
                      }}
                      className="cursor-pointer text-sm mb-1"
                    >
                      yes
                    </div>
                  )}
                </div>
              </div>

              {showDetailBasket && (
                <div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="font-bold">Total price</span>
                    <span>
                      <Price
                        className="!text-base"
                        stayPrice={
                          ((mapRoute.distance * 0.001).toFixed(1) / 10) *
                            transport.price +
                          (needADriver
                            ? transport.additional_price_with_a_driver
                            : 0)
                        }
                      ></Price>
                    </span>
                  </div>

                  <hr className="mt-2" />

                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold">Total distance</span>
                    <span>{(mapRoute.distance * 0.001).toFixed(1)}km</span>
                  </div>
                  <Button
                    onClick={() => {
                      addToBasket();
                    }}
                    className="!bg-blue-600 mt-4 flex gap-1.5 !w-full !text-white !border-2 border-blue-600"
                  >
                    Add to basket
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 "
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
                        color="#000"
                      ></LoadingSpinerChase>
                    </div>
                  </Button>
                </div>
              )}
            </SwiperSlide> */}
          </div>
        </div>
      </Modal>

      <div>
        <ClientOnly>
          <Share
            showShare={showShare}
            type_of_stay="Transport"
            setShowShare={setShowShare}
          ></Share>
        </ClientOnly>
      </div>

      <div>
        <Modal
          showModal={showRouteInMap}
          className={"h-[700px] w-[700px] "}
          closeModal={() => {
            setShowRouteInMap(false);
          }}
        >
          <MapBox longitude={state.fromLong} latitude={state.fromLat}></MapBox>
        </Modal>
      </div>
    </div>
  );
}

TransportDetail.propTypes = {};

export async function getServerSideProps(context) {
  let exist = false;
  try {
    const token = getToken(context);
    let cart = getCart(context);

    const transport = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/transport/${context.query.slug}/`
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
        `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      exist = data.results.some((val) => {
        return val.transport.slug === context.query.slug;
      });

      const transport = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/transport/${context.query.slug}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          transport: transport.data,
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
          transport: transport.data,
          inCart: exist,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        transport: transport.data,
        inCart: exist,
      },
    };
  } catch (error) {
    if (error.response) {
      console.log(error.response);
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
      }
      return {
        props: {
          userProfile: "",
          stay: "",
          inCart: exist,
        },
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

export default TransportDetail;
