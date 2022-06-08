import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Element } from "react-scroll";
import { createGlobalStyle } from "styled-components";

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
import Modal from "../../components/ui/MobileModal";

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

  const [liked, setLiked] = useState(false);

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
        "https://api.exchangerate-api.com/v4/latest/kes",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.USD,
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
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-cart/`,
          {
            from_date: addToCartDate.from,
            to_date: addToCartDate.to,
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
        return val.slug === stay.slug;
      });
      if (!exist) {
        data.push({
          slug: stay.slug,
          itemCategory: "stays",
          from_date: addToCartDate.from,
          to_date: addToCartDate.to,
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

  const [showMobileDateModal, setShowMobileDateModal] = useState(false);

  return (
    <div>
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
        <div className="md:w-[56%] lg:w-[63%] md:px-4 md:border-r md:border-gray-200 md:absolute md:mt-0 mt-10 left-2 md:block top-10">
          <Element name="about">
            <div ref={scrollToVisible} className="relative -ml-8 -mr-4">
              <ImageGallery
                images={stay.stay_images}
                stayType={stay.type_of_stay}
              ></ImageGallery>

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

            <div
              className={
                "h-12 border-b border-gray-200 absolute top-[430px] sm:top-[480px] w-[100%] left-0 right-0 lg:px-10 px-5 " +
                (!isVisible
                  ? "!fixed md:!w-[56.5%] lg:!w-[63.5%]  !w-full !top-[65px] left-0 right-0 z-[50] bg-white"
                  : "")
              }
            >
              <ScrollTo></ScrollTo>
            </div>

            {/* about */}

            <div className="flex mt-20">
              <div className="flex flex-col w-full">
                <div className="text-2xl font-bold">{stay.name}</div>
                <div className="text-lg font-medium">{stay.location}</div>

                <div className="text-gray-500 flex gap-2 text-sm truncate mt-3 flex-wrap">
                  {stay.capacity && (
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
                </div>
              </div>

              <div className="w-full z-10 px-4 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-white py-4">
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

                  <div>
                    <div className="flex">
                      <Price stayPrice={stay.price}></Price>
                      <span className="mt-1">/night</span>
                    </div>
                    {addToCartDate && addToCartDate.from && addToCartDate.to && (
                      <span className="text-sm font-bold">
                        {moment(addToCartDate.from).format("MMM DD")} -{" "}
                        {moment(addToCartDate.to).format("MMM DD")}
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setShowMobileDateModal(true);
                    }}
                    className={
                      "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                      (!inCart ? "" : "")
                    }
                  >
                    Add to basket
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

            <Modal
              showModal={showMobileDateModal}
              closeModal={() => {
                setShowMobileDateModal(!showMobileDateModal);
              }}
            >
              <div
                className={
                  " h-fit w-full lg:w-fit py-2 mx-auto xl:ml-2 mt-2 order-1 md:order-2 "
                }
              >
                <div>
                  {addToCartDate &&
                    !addToCartDate.from &&
                    !addToCartDate.to && (
                      <div className="text-xl ml-4 font-bold">
                        Select a date
                      </div>
                    )}
                  {!addToCartDate && (
                    <div className="text-xl ml-4 font-bold">Select a date</div>
                  )}
                  {addToCartDate && addToCartDate.from && !addToCartDate.to && (
                    <div className="text-xl ml-4 font-bold">
                      Select checkout date
                    </div>
                  )}
                </div>
                <DatePicker
                  setDate={setAddToCartDate}
                  date={addToCartDate}
                  disableDate={new Date()}
                ></DatePicker>
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
                <div className="flex justify-around px-3 gap-2">
                  {inCart && (
                    <Button
                      onClick={() => {
                        router.push({ pathname: "/cart" });
                      }}
                      className="!bg-transparent !w-[48%] !text-black relative border-2 border-pink-500"
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

                  <Button
                    onClick={addToBasket}
                    className={
                      "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                      (!inCart ? "!w-full" : "!w-[48%]")
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
                </div>
              </div>
            </Modal>

            {stay.views > 0 && stay.views === 1 && (
              <div className="mt-2 text-gray-600">
                {stay.views} person has viewed this listing
              </div>
            )}
            {stay.views > 0 && stay.views > 1 && (
              <div className="mt-2 text-gray-600">
                {stay.views} people has viewed this listing
              </div>
            )}

            <div className="mt-10">
              {!showAllDescription && (
                <p className="font-medium text-gray-600">
                  {stay.description.slice(0, 500)}
                </p>
              )}
              {showAllDescription && (
                <p className="font-medium text-gray-600">{stay.description}</p>
              )}
              {!showAllDescription && (
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
          </Element>

          {/* ammenities */}
          <Element
            name="amenities"
            className="flex flex-col md:flex-row gap-3 justify-between pt-10"
          >
            <div className="border h-fit border-gray-200 rounded-xl overflow-hidden w-full order-2 md:order-1 mt-4 md:mt-0">
              <div className="py-2 bg-gray-200 mb-2">
                <span className="font-bold text-xl ml-6">Amenities</span>
              </div>

              {!showMoreAmenities && (
                <div className="flex flex-wrap gap-2 px-2">
                  {stay.amenities.slice(0, 5).map((amenity, index) => (
                    <div key={index} className="w-[48%]">
                      <ListItem>{amenity}</ListItem>
                    </div>
                  ))}
                </div>
              )}

              {showMoreAmenities && (
                <div className="flex flex-wrap gap-2 px-2">
                  {stay.amenities.map((amenity, index) => (
                    <div key={index} className="w-[48%]">
                      <ListItem>{amenity}</ListItem>
                    </div>
                  ))}
                </div>
              )}

              {!showMoreAmenities && stay.amenities.length > 5 && (
                <div
                  onClick={() => {
                    setShowMoreAmenities(true);
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

              {showMoreAmenities && stay.amenities.length > 5 && (
                <div
                  onClick={() => {
                    setShowMoreAmenities(false);
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

          {/* best describe as */}
          <Element
            name="best-describe-as"
            className="flex flex-col md:flex-row justify-between pt-10 gap-3"
          >
            <DescribesStay stay={stay}></DescribesStay>
          </Element>

          {/* unique about place */}
          <Element
            name="unique-about-place"
            className={"pt-10 " + (reviews.length > 0 ? "" : "")}
          >
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
            {!showAllUniqueFeature && (
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
          </Element>

          {/* map */}
          <Element
            name="map"
            className={"w-full h-[350px] md:h-[450px] order-1 md:order-2 pt-6 "}
          >
            <h1 className="font-bold text-2xl mb-2 ml-2">Map</h1>
            <Map longitude={stay.longitude} latitude={stay.latitude}></Map>
          </Element>

          {/* policies */}
          <Element name="policies" className={"w-full pt-20 "}>
            <h1 className="font-bold text-2xl mb-2">Policies</h1>
            <div className="py-2 px-2 border-b border-gray-100">
              <span className="font-semibold">Refund Policy</span>
            </div>
            {!stay.refundable && (
              <div className="mt-2 ml-2">
                <p>Bookings at this property is non-refundable.</p>
              </div>
            )}

            {stay.damage_policy && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Damage Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>Bookings at this property is non-refundable.</p>
                </div>
              </div>
            )}

            {stay.covid_19_compliance && (
              <div className="mt-4">
                <div className="py-2 px-2 border-b border-gray-100">
                  <span className="font-semibold">Covid-19 Policy</span>
                </div>

                <div className="mt-2 ml-2">
                  <p>{stay.covid_19_compliance_details}</p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="py-2 px-2 border-b border-gray-100">
                <span className="font-semibold">Listing Rules</span>

                <div className="flex items-center gap-6 ml-4">
                  {stay.check_in_time && (
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
                      {moment(stay.check_in_time, "HH:mm:ss").format("hh:mm a")}
                    </div>
                  )}
                  {stay.check_out_time && (
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
                      {moment(stay.check_out_time, "HH:mm:ss").format(
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
                        {stay.children_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Pets allowed:{" "}
                      <span className="font-bold">
                        {stay.pets_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Smoking allowed:{" "}
                      <span className="font-bold">
                        {stay.smoking_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>

                  <div className="md:w-[48%] w-full">
                    <ListItem>
                      Events allowed:{" "}
                      <span className="font-bold">
                        {stay.events_allowed ? "yes" : "no"}
                      </span>
                    </ListItem>
                  </div>
                </div>
              </div>
            </div>
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
        <div className="md:fixed hidden right-2 md:w-[42%] md:pl-2 lg:px-0 lg:w-[35%] top-20 md:block">
          <div className="mb-2 flex justify-between">
            <div>
              {addToCartDate && !addToCartDate.from && !addToCartDate.to && (
                <div className="text-xl ml-2 font-bold">Select a date</div>
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
            <div>
              <div className="flex">
                <Price stayPrice={stay.price}></Price>
                <span className="mt-1">/night</span>
              </div>
              {addToCartDate && addToCartDate.from && addToCartDate.to && (
                <span className="text-sm font-bold">
                  {moment(addToCartDate.from).format("MMM DD")} -{" "}
                  {moment(addToCartDate.to).format("MMM DD")}
                </span>
              )}
            </div>
          </div>
          <div
            className={
              " h-fit w-full lg:w-fit shadow-xl py-2 mx-auto xl:ml-2 mt-2 rounded-lg order-1 md:order-2 "
            }
          >
            <DatePicker
              setDate={setAddToCartDate}
              date={addToCartDate}
              disableDate={new Date()}
            ></DatePicker>
            <div className="flex justify-around px-3 gap-2">
              {inCart && (
                <Button
                  onClick={() => {
                    router.push({ pathname: "/cart" });
                  }}
                  className="!bg-transparent !w-[48%] !text-black relative border-2 border-pink-500"
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

              <Button
                onClick={addToBasket}
                className={
                  "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                  (!inCart ? "!w-full" : "!w-[48%]")
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
                      <g id="94" transform="translate(620.000000, 291.000000)">
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
            </div>
          </div>
        </div>
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
