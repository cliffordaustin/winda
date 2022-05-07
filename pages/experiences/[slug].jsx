import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

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

const ActivitiesDetail = ({ userProfile, activity, inCart }) => {
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
          `${process.env.NEXT_PUBLIC_baseURL}/activities/${activity.slug}/add-to-cart/`,
          {},
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
        data.push({ slug: activity.slug, itemCategory: "activities" });
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

  return (
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

      <div className="md:w-[85%] px-4 sm:px-8 md:px-0 mx-auto">
        <div className="relative">
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

        <div className="flex mt-4">
          <div className="flex flex-col w-full">
            <div className="text-2xl font-bold">{activity.name}</div>
            <div className="text-lg font-medium">{activity.location}</div>
            <div className="my-2 md:hidden">
              <Price stayPrice={activity.price}></Price>
            </div>
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
                  <span>{activity.capacity} Maximum number of guests</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full z-10 px-4 md:hidden fixed bottom-0 left-0 right-0 bg-white py-2">
            <div className="flex justify-between items-center gap-2">
              {!inCart && (
                <Button
                  onClick={addToBasket}
                  className="!bg-transparent !w-full !text-black !border-2 border-blue-800"
                >
                  Add to basket
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
          </div>
          <div className="w-fit px-4 hidden md:block">
            <div className="flex flex-col items-end">
              <Price stayPrice={activity.price}></Price>
              <div className="flex items-center mt-2 gap-2 justify-between self-start w-full">
                {!inCart && (
                  <Button
                    onClick={addToBasket}
                    className="!bg-transparent !w-[185px] !text-black !border-2 border-blue-800"
                  >
                    Add to basket
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
                    className="!bg-transparent !w-[185px] !text-black !border-2 border-blue-800"
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

        <div className="flex flex-col md:flex-row justify-between my-10 lg:px-10">
          <div className="border h-fit border-gray-200 rounded-xl overflow-hidden w-full md:w-[48%] order-2 md:order-1 mt-4 md:mt-0">
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
          <div className="w-full h-[350px] md:w-[50%] md:h-[450px] order-1 md:order-2">
            <Map
              longitude={activity.longitude}
              latitude={activity.latitude}
            ></Map>
          </div>
        </div>

        <div className="lg:px-10 mb-6">
          <h1 className="font-bold text-2xl mb-5">Description</h1>
          {!showAllDescription && (
            <p className="ml-2 font-medium">
              {activity.description.slice(0, 500)}
            </p>
          )}
          {showAllDescription && (
            <p className="ml-2 font-medium">{activity.description}</p>
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

        {!reviewLoading && reviews.length > 0 && (
          <div>
            <div className="max-w-[750px] mb-10 lg:px-10">
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

            <div className="mb-16 lg:px-10">
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
      </div>
      <Footer></Footer>
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
