import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import ReactPaginate from "react-paginate";

import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import getToken from "../../lib/getToken";
import getTokenFromReq from "../../lib/getTokenFromReq";
import { wrapper } from "../../redux/store";
import styles from "../../styles/Lodging.module.css";
import Navbar from "../../components/Lodging/Navbar";
import Listings from "../../components/Activities/Listings";
import Map from "../../components/Activities/Map";
import SearchSelect from "../../components/Home/SearchSelect";
import Search from "../../components/Home/ActivitiesSearch";
import Popup from "../../components/ui/Popup";
import PriceFilter from "../../components/Lodging/PriceFilter";
import Footer from "../../components/Home/Footer";
import MobileModal from "../../components/ui/FullScreenMobileModal";
import LargeMobileModal from "../../components/ui/LargeFullscreenPopup";
import Button from "../../components/ui/Button";
import ClientOnly from "../../components/ClientOnly";
import { setFilteredActivities } from "../../redux/actions/activity";
import TypeOfActivities from "../../components/Activities/ActivitiesFilterItems";
import MobileSearchModal from "../../components/Activities/MobileSearchModal";
import { Icon } from "@iconify/react";

function Activities({
  userProfile,
  activities,
  pageSize,
  count,
  nextLink,
  previousLink,
  totalPages,
}) {
  const router = useRouter();
  const [state, setState] = useState({
    showDropdown: false,
    travelers: Number(router.query.min_capacity) || 0,
    activityDate: "",
    showActivityDate: false,
    selectedActivitiesSearchItem: 0,
    showTravelersPopup: false,

    numOfAdults: 0,
    numOfChildren: 0,
    numOfInfants: 0,
    showPopup: false,
    currentNavState: 3,
    showSearchModal: false,
    showSortPopup: false,
    showPricePopup: false,
    showRoomPopup: false,
    showMobileFilter: false,
    showRatingsPopup: false,
    showStayTypesPopup: false,
    showFilterPopup: false,
    exellentRating: false,
    veryGoodRating: false,
    goodRating: false,
    fairRating: false,
    okayRating: false,
    windowSize: 0,
  });

  const turnOffAllPopup = {
    showDropdown: false,
    showCheckInDate: false,
    showCheckOutDate: false,
    showPopup: false,
    showSearchModal: false,
    showSortPopup: false,
    showPricePopup: false,
    showRatingsPopup: false,
    showFilterPopup: false,
    showRoomPopup: false,
    showHomeTypesPopup: false,
    showMobileFilter: false,
    showTravelersPopup: false,
    showActivityDate: false,
  };

  const isMounted = useRef(false);

  const isFirstRender = useRef(true);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [mobileMap, setMobileMap] = useState(false);
  const filterStayLoading = useSelector(
    (state) => state.stay.filterStayLoading
  );

  const [isFixed, setIsFixed] = useState(true);

  const searchRef = useRef(null);

  const dispatch = useDispatch();

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  // useEffect(() => {
  //   if (router.query) {
  //     dispatch(setFilteredActivities(router));
  //   }
  // }, [router.query]);

  // useEffect(() => {
  //   if (minPrice || maxPrice) {
  //     const maxPriceSelect = maxPrice
  //       ? maxPrice.value.replace("KES", "").replace("k", "000")
  //       : "";
  //     const minPriceSelect = minPrice
  //       ? minPrice.value.replace("KES", "").replace("k", "000")
  //       : "";

  //     router.push({
  //       query: {
  //         ...router.query,
  //         min_price: minPriceSelect,
  //         max_price: maxPriceSelect,
  //       },
  //     });
  //   }
  // }, [minPrice, maxPrice]);

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

  useEffect(() => {
    if (process.browser) {
      setState({
        ...state,
        windowSize: window.innerWidth,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userLatLng, setUserLatLng] = useState({
    latitude: null,
    longitude: null,
  });

  // useEffect(() => {
  //   if (process.browser) {
  //     window.onresize = function () {
  //       setState({ ...state, windowSize: window.innerWidth });
  //     };
  //   }
  // }, []);

  useEffect(() => {
    const getLatLng = async () => {
      const latlng = await axios.get(
        `https://ipinfo.io?token=${process.env.NEXT_PUBLIC_ipInfoToken}`
      );

      const lat = latlng.data.loc.split(",")[0];
      const lng = latlng.data.loc.split(",")[1];

      setUserLatLng({
        ...userLatLng,
        longitude: lat,
        latitude: lng,
      });
    };
    getLatLng();
  }, []);

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  // useEffect(() => {
  //   if (state.windowSize >= 768) {
  //     setState({
  //       ...state,
  //       showSearchModal: false,
  //       showMobileFilter: false,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.windowSize]);

  const [activityLocation, setActivityLocation] = useState(
    router.query.search || router.query.d_search || ""
  );

  const [autoCompleteFromActivitySearch, setAutoCompleteFromActivitySearch] =
    useState([]);

  const [showActivityLoader, setShowActivityLoader] = useState(false);

  const onActivityChange = (event) => {
    setActivityLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromActivitySearch(response.data.features);
      });
  };

  const locationFromActivitySearch = (item) => {
    setActivityLocation(item.place_name);
    setAutoCompleteFromActivitySearch([]);
  };

  const apiActivitySearchResult = () => {
    if (activityLocation !== "" || state.travelers !== 0) {
      setShowActivityLoader(true);
      router
        .push({
          pathname: "/experiences",
          query: {
            ...router.query,
            search: activityLocation,
            d_search: "",
            min_capacity: state.travelers ? state.travelers : "",
          },
        })
        .then(() => {
          setShowActivityLoader(false);
          router.reload();
        });
    }
  };

  const keyDownActivitySearch = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromActivitySearch.length > 0) {
        setActivityLocation(autoCompleteFromActivitySearch[0].place_name);

        setAutoCompleteFromActivitySearch([]);

        if (activityLocation !== "") {
          setShowActivityLoader(true);
          router
            .push({
              pathname: "/experiences",
              query: {
                ...router.query,
                search: autoCompleteFromActivitySearch[0].place_name,
                d_search: "",
                min_capacity: state.travelers ? state.travelers : "",
              },
            })
            .then(() => {
              setShowActivityLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const [itemsInCart, setItemsInCart] = useState([]);

  const getItemsInCart = async () => {
    let cart = Cookies.get("cart");
    if (Cookies.get("token")) {
      const staysCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setItemsInCart(staysCart.data.results);
    } else if (!Cookies.get("token") && cart) {
      cart = JSON.parse(decodeURIComponent(cart));

      setItemsInCart(cart);
    }
  };

  useEffect(() => {
    getItemsInCart();
  }, []);

  const [itemsInOrders, setItemsInOrders] = useState([]);

  const getItemsInOrder = async () => {
    if (Cookies.get("token")) {
      const staysCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setItemsInOrders(staysCart.data.results);
    }
  };

  useEffect(() => {
    getItemsInOrder();
  }, []);

  const searchFilter = () => {
    console.log("search Filter");
  };

  const [numOfPeople, setNumOfPeople] = useState(1);

  const [date, setDate] = useState(new Date());

  const [location, setLocation] = useState("");

  const [mobileSearchModal, setMobileSearchModal] = useState(false);

  const filterMinPrice = () => {
    router.push({
      query: {
        ...router.query,
        min_price: minPrice,
        max_price: router.query.max_price || "",
        pricing_type: "",
      },
    });
  };

  const filterMaxPrice = () => {
    router.push({
      query: {
        ...router.query,
        min_price: router.query.min_price || "",
        max_price: maxPrice,
        pricing_type: "",
      },
    });
  };

  const handlePageClick = (event) => {
    router.push({
      query: {
        ...router.query,
        page: event.selected + 1,
      },
    });
  };

  return (
    <div
      className="overflow-x-hidden"
      onClick={() => {
        setState({
          ...state,
          showDropdown: false,
          showCheckInDate: false,
          showCheckOutDate: false,
          showPopup: false,

          showSearchModal: false,
          showSortPopup: false,
          showPricePopup: false,
          showRatingsPopup: false,
          showFilterPopup: false,
          showRoomPopup: false,
          showHomeTypesPopup: false,
          showMobileFilter: false,
          showTravelersPopup: false,
          showActivityDate: false,
          selectedActivitiesSearchItem: 0,
        });
      }}
    >
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-20 pb-4">
        <Navbar
          showDropdown={state.showDropdown}
          currentNavState={state.currentNavState}
          userProfile={userProfile}
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

        <div className="w-[90%] sm:w-[70%] mx-auto flex shadow-lg border border-gray-200 rounded-xl pl-3 h-12 md:hidden cursor-pointer">
          <div
            onClick={() => {
              setMobileSearchModal(true);
            }}
            className="flex items-center gap-2 w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <div className="font-bold text-sm">
              {router.query.search && (
                <span className="truncate">
                  {router.query.search.split(",")[0]}
                </span>
              )}
              {router.query.search && "..."}
              {Number(router.query.min_capacity) > 0 ? "," : ""}{" "}
              <span>
                {Number(router.query.min_capacity) > 0
                  ? `${Number(router.query.min_capacity)} ${
                      Number(router.query.min_capacity) > 1 ? "Guests" : "Guest"
                    }`
                  : ""}
              </span>
              <span>
                {!Number(router.query.min_capacity) && !router.query.search
                  ? "Where to?"
                  : ""}
              </span>
            </div>
          </div>

          <div className="flex w-32 border rounded-xl transition-all duration-200 ease-linear self-stretch ">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showPricePopup: !state.showPricePopup,
                });
              }}
              className="w-2/4 relative flex items-center justify-center transition-all duration-200 ease-linear hover:border-gray-200 rounded-xl"
            >
              <Icon className="w-7 h-7 text-gray-600" icon="la:funnel-dollar" />

              <Popup
                className="absolute top-full mt-2 xssMax:w-[250px] w-[338px] sm:w-[450px] xssMax:-left-44 -left-64 md:-left-10 px-2"
                showPopup={state.showPricePopup}
              >
                <h1 className="font-bold text-base mb-2 text-gray-600">
                  Price Range
                </h1>
                <div className="flex items-center gap-3 mb-2 px-2">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "REASONABLE",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "REASONABLE"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Reasonable
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "MID-RANGE",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "MID-RANGE"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Mid-range
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "HIGH-END",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "HIGH-END"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Luxurious
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2">
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Min price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMinPrice();
                        }}
                        name="min-price"
                        value={minPrice}
                        type="number"
                        onChange={(event) => {
                          setMinPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            event.target.blur();
                          }
                        }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                  <div> - </div>
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Max price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMaxPrice();
                        }}
                        name="max-price"
                        value={maxPrice}
                        type="number"
                        onChange={(event) => {
                          setMaxPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            event.target.blur();
                          }
                        }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showSortPopup: !state.showSortPopup,
                });
              }}
              className="w-2/4 flex items-center justify-center hover:border transition-all duration-200 ease-linear hover:border-gray-200 rounded-xl border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>

              <Popup
                className="absolute top-full -mt-2 w-60 right-3"
                showPopup={state.showSortPopup}
              >
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "-date_posted"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "-date_posted" },
                      });
                    }
                  }}
                >
                  Newest
                </div>
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "+price"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "+price" },
                      });
                    }
                  }}
                >
                  Price(min to max)
                </div>
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "-price"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "-price" },
                      });
                    }
                  }}
                >
                  Price(max to min)
                </div>
              </Popup>
            </div>
          </div>
        </div>

        <MobileSearchModal
          showModal={mobileSearchModal}
          closeModal={setMobileSearchModal}
          search={activityLocation}
          setSearch={setActivityLocation}
          date={date}
          setDate={setDate}
          numOfPeople={state.travelers}
          addTraveler={() => {
            setState({ ...state, travelers: state.travelers + 1 });
          }}
          removeTraveler={() => {
            state.travelers > 0
              ? setState({ ...state, travelers: state.travelers - 1 })
              : null;
          }}
          clearNumOfPeople={() => {
            setState({ ...state, travelers: 0 });
          }}
          searchFilter={apiActivitySearchResult}
          showSearchLoader={showActivityLoader}
        ></MobileSearchModal>

        <div
          ref={searchRef}
          className="mt-1 hidden w-full md:flex items-center lg:justify-center lg:px-0 md:px-4"
        >
          <div className="xl:w-[750px] lg:w-[60%] md:w-[75%]">
            <Search
              autoCompleteFromActivitySearch={autoCompleteFromActivitySearch}
              onKeyDown={keyDownActivitySearch}
              showActivityLoader={showActivityLoader}
              locationFromActivitySearch={(item) => {
                locationFromActivitySearch(item);
              }}
              apiActivitySearchResult={apiActivitySearchResult}
              activityLocation={activityLocation}
              travelers={state.travelers}
              activityDate={state.activityDate}
              showSearchModal={state.showSearchModal}
              onChange={(event) => {
                onActivityChange(event);
              }}
              changeSelectedActivitiesSearchItem={(num) => {
                setState({ ...state, selectedActivitiesSearchItem: num });
              }}
              changeActivityDate={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showActivityDate: !state.showActivityDate,
                  selectedActivitiesSearchItem:
                    state.selectedActivitiesSearchItem === 2 ? 0 : 2,
                });
              }}
              setActivityDate={(date) => {
                setState({ ...state, activityDate: date });
              }}
              showActivityDate={state.showActivityDate}
              showTravelersPopup={state.showTravelersPopup}
              changeShowTravelersPopup={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showTravelersPopup: !state.showTravelersPopup,
                  selectedActivitiesSearchItem:
                    state.selectedActivitiesSearchItem === 3 ? 0 : 3,
                });
              }}
              selectedActivitiesSearchItem={state.selectedActivitiesSearchItem}
              clearLocationInput={() => {
                setActivityLocation("");
              }}
              clearActivityDate={() => {
                setState({ ...state, activityDate: "" });
              }}
              clearTravelers={() => {
                setState({ ...state, travelers: 0 });
              }}
              addTraveler={() => {
                setState({ ...state, travelers: state.travelers + 1 });
              }}
              removeTraveler={() => {
                state.travelers > 0
                  ? setState({ ...state, travelers: state.travelers - 1 })
                  : null;
              }}
            ></Search>
          </div>

          <div className="flex absolute right-2 bottom-[25px]">
            <div
              onClick={(event) => {
                event.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showPricePopup: !state.showPricePopup,
                });
              }}
              className="cursor-pointer w-[120px] relative rounded-md border border-gray-200 py-2 px-2 mr-1 md:mr-4 flex gap-1 items-center justify-center"
            >
              {!minPrice && !maxPrice && (
                <div className="flex sm:gap-1 items-center justify-center">
                  <span className="inline text-sm">Any price</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-1"
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
              {minPrice && maxPrice && (
                <div className="flex items-center sm:gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <h1>{minPrice}</h1>
                    <div> - </div>
                    <h1>{maxPrice}</h1>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-1"
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

              {minPrice && !maxPrice && (
                <div className="flex items-center sm:gap-1">
                  <div className="flex items-center text-sm">
                    <h1>{minPrice}</h1>
                    <div>+</div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-1"
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

              {!minPrice && maxPrice && (
                <div className="flex items-center sm:gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <h1>$0</h1>
                    <div> - </div>
                    <h1>{maxPrice}</h1>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mt-1"
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
              <Popup
                className="absolute top-full mt-2 xssMax:w-[250px] w-[338px] sm:w-[450px] -left-20 sm:-left-72 px-2"
                showPopup={state.showPricePopup}
              >
                <h1 className="font-bold text-base mb-2 text-gray-600">
                  Price Range
                </h1>
                <div className="flex items-center gap-3 mb-2 px-2">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "REASONABLE",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "REASONABLE"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Reasonable
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "MID-RANGE",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "MID-RANGE"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Mid-range
                  </div>
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type: "HIGH-END",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                      (router.query.pricing_type === "HIGH-END"
                        ? "bg-blue-500 text-white"
                        : "")
                    }
                  >
                    Luxurious
                  </div>
                </div>
                <div className="flex items-center gap-3 px-2">
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Min price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMinPrice();
                        }}
                        name="min-price"
                        value={minPrice}
                        type="number"
                        onChange={(event) => {
                          setMinPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            event.target.blur();
                          }
                        }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                  <div> - </div>
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Max price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMaxPrice();
                        }}
                        name="max-price"
                        value={maxPrice}
                        type="number"
                        onChange={(event) => {
                          setMaxPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            event.target.blur();
                          }
                        }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
            {/* <div
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showMobileFilter: true,
                });
              }}
              className="flex items-center bg-gray-100 px-4 gap-1 cursor-pointer justify-center mr-1 transition-all duration-200 ease-linear hover:border-gray-600 border-gray-400 rounded-md border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-5 h-5"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="14" cy="6" r="2" />
                  <path d="M4 6h8m4 0h4" />
                  <circle cx="8" cy="12" r="2" />
                  <path d="M4 12h2m4 0h10" />
                  <circle cx="17" cy="18" r="2" />
                  <path d="M4 18h11m4 0h1" />
                </g>
              </svg>

              <span>filter</span>
            </div> */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showSortPopup: !state.showSortPopup,
                });
              }}
              className="w-[50px] relative border p-2 cursor-pointer flex items-center justify-center transition-all duration-200 ease-linear hover:border-gray-200 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>

              <Popup
                className="absolute top-full mt-2 w-60 right-2"
                showPopup={state.showSortPopup}
              >
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "-date_posted"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "-date_posted" },
                      });
                    }
                  }}
                >
                  Newest
                </div>
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "+price"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "+price" },
                      });
                    }
                  }}
                >
                  Price(min to max)
                </div>
                <div
                  className={
                    styles.listItem +
                    (router.query.ordering === "-price"
                      ? " !bg-red-500 !text-white"
                      : "")
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showSortPopup: false,
                    });
                    if (router.query.ordering) {
                      router.push({ query: { ...router.query, ordering: "" } });
                    } else {
                      router.push({
                        query: { ...router.query, ordering: "-price" },
                      });
                    }
                  }}
                >
                  Price(max to min)
                </div>
              </Popup>
            </div>
          </div>
        </div>

        <div>
          {/* <ClientOnly>
          {currencyToKES && (
            <div
              className="text-xs md:text-base absolute md:right-12 right-6 bottom-7 font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear flex items-center"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_FALSE",
                });
              }}
            >
              <div>USD</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div>KES</div>
            </div>
          )}
          {!currencyToKES && (
            <div
              className="text-xs md:text-base absolute md:right-12 right-6 bottom-7 font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear flex md:gap-1 items-center"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_TRUE",
                });
              }}
            >
              <div>KES</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 md:h-4 md:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div>USD</div>
            </div>
          )}
        </ClientOnly> */}
        </div>

        <div>
          {/* <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showSortPopup: !state.showSortPopup,
              });
            }}
            className="cursor-pointer relative rounded-md border border-gray-200 py-2 px-2 mr-1 md:mr-4 flex gap-1 items-center justify-center"
          >
            <span className="block">Sort by</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mt-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <Popup
              className="absolute top-full mt-2 w-60 left-0"
              showPopup={state.showSortPopup}
            >
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-date_posted"
                    ? " !bg-red-500 !text-white"
                    : "")
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showSortPopup: false,
                  });
                  if (router.query.ordering) {
                    router.push({ query: { ...router.query, ordering: "" } });
                  } else {
                    router.push({
                      query: { ...router.query, ordering: "-date_posted" },
                    });
                  }
                }}
              >
                Newest
              </div>
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "+price"
                    ? " !bg-red-500 !text-white"
                    : "")
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showSortPopup: false,
                  });
                  if (router.query.ordering) {
                    router.push({ query: { ...router.query, ordering: "" } });
                  } else {
                    router.push({
                      query: { ...router.query, ordering: "+price" },
                    });
                  }
                }}
              >
                Price(min to max)
              </div>
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-price"
                    ? " !bg-red-500 !text-white"
                    : "")
                }
                onClick={(event) => {
                  event.stopPropagation();
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showSortPopup: false,
                  });
                  if (router.query.ordering) {
                    router.push({ query: { ...router.query, ordering: "" } });
                  } else {
                    router.push({
                      query: { ...router.query, ordering: "-price" },
                    });
                  }
                }}
              >
                Price(max to min)
              </div>
            </Popup>
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showPricePopup: !state.showPricePopup,
              });
            }}
            className="bg-gray-100 hidden md:block relative cursor-pointer rounded-md border border-gray-200 py-2 px-2"
          >
            {!minPrice && !maxPrice && (
              <div className="flex gap-1 items-center justify-center">
                <span className="block">Any Prices</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1"
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
            {minPrice && maxPrice && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <h1>{minPrice.value}</h1>
                  <div> - </div>
                  <h1>{maxPrice.value}</h1>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1"
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

            {minPrice && !maxPrice && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <h1>{minPrice.value}</h1>
                  <div>+</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1"
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

            {!minPrice && maxPrice && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <h1>KES0</h1>
                  <div> - </div>
                  <h1>{maxPrice.value}</h1>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mt-1"
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
            <Popup
              className="absolute top-full mt-2 w-[450px] -left-10 px-2"
              showPopup={state.showPricePopup}
            >
              <h1 className="font-bold text-base mb-2 text-gray-600">
                Price Range
              </h1>
              <PriceFilter
                setMinPriceSelected={setMinSelected}
                setMaxPriceSelected={setMaxSelected}
                minPriceInstanceId="minPrice"
                maxPriceInstanceId="maxPrice"
                minPriceSelected={minPrice}
                maxPriceSelected={maxPrice}
              ></PriceFilter>
            </Popup>
          </div>

          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showFilterPopup: !state.showFilterPopup,
                showMobileFilter: true,
              });
            }}
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-2 flex gap-1 items-center justify-center"
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span className="block">Filters</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mt-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <Popup
              className="hidden md:block absolute top-full mt-2 max-h-[500px] w-[500px] -left-32 lg:left-[-15rem] xl:-left-44 px-4 overflow-scroll"
              showPopup={state.showFilterPopup}
            >
              <div className="lg:hidden">
                <div className="mt-2 mb-4 md:hidden">
                  <h1 className="font-bold text-base mb-2">Price Range</h1>
                  <PriceFilter
                    setMinPriceSelected={setMinSelected}
                    setMaxPriceSelected={setMaxSelected}
                    minPriceInstanceId="minPrice"
                    maxPriceInstanceId="maxPrice"
                    minPriceSelected={minPrice}
                    maxPriceSelected={maxPrice}
                  ></PriceFilter>
                </div>
              </div>

              <div className="text-lg font-bold mb-2 mt-2">Activities</div>
              <TypeOfActivities></TypeOfActivities>
            </Popup>
          </div> */}
        </div>
      </div>

      <div className="relative hidden md:block ">
        {/* <LargeMobileModal
          showModal={state.showMobileFilter}
          closeModal={() => {
            setState({
              ...state,
              ...turnOffAllPopup,
              showMobileFilter: false,
            });
          }}
          className="!overflow-y-scroll !relative max-w-[600px] !h-[500px]"
          title="Filters"
        >
          <div className="px-4 relative">
            <div>
              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Price Range</h1>

                <div className="flex items-center gap-3 px-10">
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Min price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMinPrice();
                        }}
                        name="min-price"
                        value={minPrice}
                        type="number"
                        onChange={(event) => {
                          setMinPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.target.blur();
                        }
                      }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                  <div> - </div>
                  <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                    <span className="text-sm text-gray-500">Max price</span>
                    <div className="flex items-center">
                      <div className="text-sm font-bold mr-2 ">$</div>
                      <input
                        onBlur={() => {
                          filterMaxPrice();
                        }}
                        name="max-price"
                        value={maxPrice}
                        type="number"
                        onChange={(event) => {
                          setMaxPrice(event.target.value);
                        }}
                        onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.target.blur();
                        }
                      }}
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="-mx-4 my-6" />

            <div className="text-lg font-bold mb-2 mt-2">Activities</div>
            <TypeOfActivities></TypeOfActivities>
          </div>
          <div
            className={
              "w-full sticky z-10 px-2 py-2 bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 "
            }
          >
            <div className="flex justify-between items-center gap-2">
              <div
                onClick={() => {
                  router.push({
                    pathname: "/experiences",
                    query: {
                      trip: router.query.trip,
                      group_trip: router.query.group_trip,
                    },
                  });
                }}
                className="underline cursor-pointer"
              >
                Clear all
              </div>

              <Button
                onClick={() => {
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showMobileFilter: false,
                  });
                }}
                className={
                  "!bg-gradient-to-r !px-4 from-pink-500 via-red-500 to-yellow-500 !text-white "
                }
              >
                Show all {count} experiences
              </Button>
            </div>
          </div>
        </LargeMobileModal> */}
      </div>

      <MobileModal
        showModal={state.showMobileFilter}
        closeModal={() => {
          setState({
            ...state,
            ...turnOffAllPopup,
            showMobileFilter: false,
          });
        }}
        className="md:!hidden !overflow-y-scroll"
        title="Filters"
      >
        <div className="px-4 relative">
          <div>
            <div className="mt-2 mb-4">
              <h1 className="font-bold text-base mb-2">Price Range</h1>

              <div className="flex items-center gap-3 mb-2 px-2">
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        pricing_type: "REASONABLE",
                        min_price: "",
                        max_price: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                    (router.query.pricing_type === "REASONABLE"
                      ? "bg-blue-500 text-white"
                      : "")
                  }
                >
                  Reasonable
                </div>
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        pricing_type: "MID-RANGE",
                        min_price: "",
                        max_price: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                    (router.query.pricing_type === "MID-RANGE"
                      ? "bg-blue-500 text-white"
                      : "")
                  }
                >
                  Mid-range
                </div>
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        pricing_type: "HIGH-END",
                        min_price: "",
                        max_price: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-1 border rounded-3xl text-sm font-bold cursor-pointer " +
                    (router.query.pricing_type === "HIGH-END"
                      ? "bg-blue-500 text-white"
                      : "")
                  }
                >
                  Luxurious
                </div>
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                  <span className="text-sm text-gray-500">Min price</span>
                  <div className="flex items-center">
                    <div className="text-sm font-bold mr-2 ">$</div>
                    <input
                      onBlur={() => {
                        filterMinPrice();
                      }}
                      name="min-price"
                      value={minPrice}
                      type="number"
                      onChange={(event) => {
                        setMinPrice(event.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.target.blur();
                        }
                      }}
                      className="w-full focus:outline-none text-sm "
                    />
                  </div>
                </div>
                <div> - </div>
                <div className="w-[50%] border rounded-md h-fit px-2 py-1">
                  <span className="text-sm text-gray-500">Max price</span>
                  <div className="flex items-center">
                    <div className="text-sm font-bold mr-2 ">$</div>
                    <input
                      onBlur={() => {
                        filterMaxPrice();
                      }}
                      name="max-price"
                      value={maxPrice}
                      type="number"
                      onChange={(event) => {
                        setMaxPrice(event.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          event.target.blur();
                        }
                      }}
                      className="w-full focus:outline-none text-sm "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="-mx-4 my-6" />

          <div className="text-lg font-bold mb-2 mt-2">Activities</div>
          <TypeOfActivities></TypeOfActivities>
        </div>
        <div
          className={
            "w-full fixed z-10 px-2 py-2 bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 "
          }
        >
          <div className="flex justify-between items-center gap-2">
            <div
              onClick={() => {
                router.push({
                  pathname: "/experiences",
                  query: {
                    trip: router.query.trip,
                    group_trip: router.query.group_trip,
                  },
                });
              }}
              className="underline cursor-pointer"
            >
              Clear all
            </div>

            <Button
              onClick={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showMobileFilter: false,
                });
              }}
              className={
                "!bg-gradient-to-r !px-4 from-pink-500 via-red-500 to-yellow-500 !text-white "
              }
            >
              Show all {count} experiences
            </Button>
          </div>
        </div>
      </MobileModal>

      <div className="mt-[146px] md:mt-[142px] lg:mt-[188px]  flex relative h-full overflow-y-scroll">
        <div className={"hidden lg:block w-2/4 px-4 h-[78vh] relative"}>
          <Map activities={activities}></Map>
        </div>

        {!mobileMap && (
          <div
            className={
              "px-4 md:mt-10 lg:mt-0 relative lg:h-[80vh] w-2/4 lgMax:w-full lg:overflow-y-scroll " +
              (filterStayLoading ? "!overflow-y-hidden !h-[70vh]" : "")
            }
          >
            <Listings
              getDistance={getDistanceFromLatLonInKm}
              userLatLng={userLatLng}
              itemsInCart={itemsInCart}
              itemsInOrders={itemsInOrders}
              userProfile={userProfile}
              activities={activities}
            ></Listings>
            {filterStayLoading && (
              <div className="bg-white bg-opacity-50 lg:h-[70vh] lg:overflow-y-scroll absolute w-full top-0 bottom-0 right-0 left-0 z-10">
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinerChase
                    width={30}
                    height={30}
                    color="#000"
                  ></LoadingSpinerChase>
                </div>
              </div>
            )}

            {activities.length > 0 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel={<Icon icon="bx:chevron-right" className="w-7 h-7" />}
                disabledClassName="text-gray-300"
                onPageChange={handlePageClick}
                forcePage={parseInt(router.query.page) - 1 || 0}
                pageRangeDisplayed={pageSize}
                pageCount={totalPages}
                previousLabel={
                  <Icon icon="bx:chevron-left" className="w-7 h-7" />
                }
                activeLinkClassName="bg-gray-700 text-white font-bold"
                renderOnZeroPageCount={null}
                containerClassName="flex flex-wrap gap-2 justify-center items-center mt-4"
                pageLinkClassName="bg-white h-8 w-8 font-bold flex justify-center items-center cursor-pointer hover:border border-gray-200 rounded-full text-sm"
              />
            )}
          </div>
        )}
      </div>

      {state.windowSize < 768 && mobileMap && (
        <div className={"h-[80vh]"}>
          <Map activities={activities}></Map>
        </div>
      )}

      <div
        onClick={() => setMobileMap(!mobileMap)}
        className="w-40 lg:hidden fixed bottom-2 left-2/4 right-2/4 -translate-x-2/4 -translate-y-2/4 z-10"
      >
        <Button className="flex items-center justify-center gap-2 !bg-[#303960] !py-2.5 !w-full !rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="text-sm">Map</span>
        </Button>
      </div>

      {mobileMap && (
        <div
          onClick={() => setMobileMap(false)}
          className="w-40 lg:hidden fixed bottom-2 left-2/4 right-2/4 -translate-x-2/4 -translate-y-2/4 z-10"
        >
          <Button className="flex items-center justify-center gap-2 !bg-[#303960] !py-2.5 !w-full !rounded-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 7H7V9H9V7Z" fill="currentColor" />
              <path d="M7 13V11H9V13H7Z" fill="currentColor" />
              <path d="M7 15V17H9V15H7Z" fill="currentColor" />
              <path d="M11 15V17H17V15H11Z" fill="currentColor" />
              <path d="M17 13V11H11V13H17Z" fill="currentColor" />
              <path d="M17 7V9H11V7H17Z" fill="currentColor" />
            </svg>
            <span className="text-sm">List</span>
          </Button>
        </div>
      )}
      {!mobileMap && (
        <div className="mt-14">
          <Footer></Footer>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query, resolvedUrl }) => {
      try {
        const token = getTokenFromReq(req);

        const activities = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/activities/?search=${
            query.search ? query.search : ""
          }&d_search=${query.d_search ? query.d_search : ""}&page=${
            query.page ? query.page : 1
          }&min_capacity=${
            query.min_capacity ? query.min_capacity : ""
          }&pricing_type=${
            query.pricing_type ? query.pricing_type : ""
          }&type_of_activities=${
            query.type_of_stay ? query.type_of_stay : ""
          }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
            query.max_price ? query.max_price : ""
          }&ordering=${query.ordering ? query.ordering : ""}`
        );

        // await context.dispatch({
        //   type: "SET_ACTIVITIES",
        //   payload: response.data.results,
        // });

        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          const activities = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/activities/?search=${
              query.search ? query.search : ""
            }&d_search=${query.d_search ? query.d_search : ""}&page=${
              query.page ? query.page : 1
            }&min_capacity=${
              query.min_capacity ? query.min_capacity : ""
            }&pricing_type=${
              query.pricing_type ? query.pricing_type : ""
            }&type_of_activities=${
              query.type_of_stay ? query.type_of_stay : ""
            }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
              query.max_price ? query.max_price : ""
            }&ordering=${query.ordering ? query.ordering : ""}`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: response.data[0],
              activities: activities.data.results,
              nextLink: activities.data.next,
              previousLink: activities.data.previous,
              pageSize: activities.data.page_size,
              totalPages: activities.data.total_pages,
              count: activities.data.count,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            activities: activities.data.results,
            nextLink: activities.data.next,
            previousLink: activities.data.previous,
            pageSize: activities.data.page_size,
            totalPages: activities.data.total_pages,
            count: activities.data.count,
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
              activities: [],
              nextLink: "",
              previousLink: "",
              pageSize: 0,
              totalPages: 0,
              count: 0,
            },
          };
        }
      }
    }
);

export default Activities;
