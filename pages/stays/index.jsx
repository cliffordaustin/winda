import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import getToken from "../../lib/getToken";
import getTokenFromReq from "../../lib/getTokenFromReq";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import LoadingPulse from "../../components/ui/LoadingPulse";
import { wrapper } from "../../redux/store";
import styles from "../../styles/Lodging.module.css";
import Navbar from "../../components/Lodging/Navbar";
import Listings from "../../components/Lodging/Listings";
import Map from "../../components/Lodging/Map";
import SearchSelect from "../../components/Home/SearchSelect";
import Search from "../../components/Home/Search";
import Popup from "../../components/ui/Popup";
import PriceFilter from "../../components/Lodging/PriceFilter";
import RoomFilter from "../../components/Lodging/RoomFilter";
import Badge from "../../components/ui/Badge";
import Checkbox from "../../components/ui/Checkbox";
import Footer from "../../components/Home/Footer";
import RemoveFixed from "../../components/Lodging/RemoveFixed";
import MobileModal from "../../components/ui/MobileModal";
import Button from "../../components/ui/Button";
import ClientOnly from "../../components/ClientOnly";
import { setFilteredStays } from "../../redux/actions/stay";
import StayTypes from "../../components/Lodging/StayTypes";
import MobileStayTypes from "../../components/Lodging/MobileStayTypes";
import Amenities from "../../components/Lodging/Amenities";
import ThemeFilter from "../../components/Lodging/ThemeFilter";
import Cookies from "js-cookie";

function Stays({ userProfile, longitude, latitude }) {
  const [state, setState] = useState({
    showDropdown: false,
    checkin: "",
    checkout: "",
    showCheckInDate: false,
    showCheckOutDate: false,
    numOfAdults: 0,
    numOfChildren: 0,
    numOfInfants: 0,
    showPopup: false,
    currentNavState: 1,
    selectedSearchItem: 0,
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
    selectedSearchItem: 0,
    showSortPopup: false,
    showPricePopup: false,
    showRoomPopup: false,
    showRatingsPopup: false,
    showFilterPopup: false,
  };
  const router = useRouter();

  const isMounted = useRef(false);

  const isFirstRender = useRef(true);

  const [autoCompleteFromSearch, setAutoCompleteFromSearch] = useState([]);

  const [location, setLocation] = useState(router.query.search || "");

  const [showSearchLoader, setShowSearchLoader] = useState(false);

  const [itemsInCart, setItemsInCart] = useState([]);

  const [itemsInOrders, setItemsInOrders] = useState([]);

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromSearch(response.data.features);
      });
  };

  const getItemsInCart = async () => {
    let cart = Cookies.get("cart");
    if (Cookies.get("token")) {
      const staysCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
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

  const getItemsInOrder = async () => {
    if (Cookies.get("token")) {
      const staysCart = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-orders/`,
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
    getItemsInCart();
  }, []);

  useEffect(() => {
    getItemsInOrder();
  }, []);

  const locationFromSearch = (item) => {
    setLocation(item.place_name);
    setAutoCompleteFromSearch([]);
  };

  const apiSearchResult = () => {
    if (location !== "") {
      setShowSearchLoader(true);
      router
        .push({
          pathname: "/stays",
          query: { search: location },
        })
        .then(() => {
          setShowSearchLoader(false);
          router.reload();
        });
    }
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromSearch.length > 0) {
        setLocation(autoCompleteFromSearch[0].place_name);

        setAutoCompleteFromSearch([]);

        if (location !== "") {
          setShowSearchLoader(true);
          router
            .push({
              pathname: "/stays",
              query: { search: autoCompleteFromSearch[0].place_name },
            })
            .then(() => {
              setShowSearchLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const minPriceFilterFormat = router.query.min_price
    ? "KES" + router.query.min_price.replace("000", "k")
    : "";

  const minPriceFilterFormatObject = router.query.min_price
    ? {
        value: minPriceFilterFormat,
        label: minPriceFilterFormat,
      }
    : "";

  const maxPriceFilterFormat = router.query.max_price
    ? "KES" + router.query.max_price.replace("000", "k")
    : "";

  const maxPriceFilterFormatObject = router.query.min_price
    ? {
        value: maxPriceFilterFormat,
        label: maxPriceFilterFormat,
      }
    : "";

  const minRoomFilterFormat = "KES" + router.query.min_rooms;

  const minRoomFilterFormatObject = router.query.min_price
    ? {
        value: minRoomFilterFormat,
        label: minRoomFilterFormat,
      }
    : "";

  const maxRoomFilterFormat = "KES" + router.query.max_rooms;

  const maxRoomFilterFormatObject = router.query.min_price
    ? {
        value: maxRoomFilterFormat,
        label: maxRoomFilterFormat,
      }
    : "";

  const [minPrice, setMinSelected] = useState(minPriceFilterFormatObject);
  const [maxPrice, setMaxSelected] = useState(maxPriceFilterFormatObject);

  const [minRoom, setminRoomSelected] = useState(minRoomFilterFormatObject);
  const [maxRoom, setmaxRoomSelected] = useState(maxRoomFilterFormatObject);

  const [mobileMap, setMobileMap] = useState(false);
  const filterStayLoading = useSelector(
    (state) => state.stay.filterStayLoading
  );

  // const userLatLng = {
  //   latitude: latitude,
  //   longitude: longitude,
  // };

  const [isFixed, setIsFixed] = useState(true);

  const searchRef = useRef(null);

  const dispatch = useDispatch();

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  useEffect(() => {
    if (router.query) {
      dispatch(setFilteredStays(router));
    }
  }, [router.query]);

  useEffect(() => {
    const maxPriceSelect = maxPrice
      ? maxPrice.value.replace("KES", "").replace("k", "000")
      : "";
    const minPriceSelect = minPrice
      ? minPrice.value.replace("KES", "").replace("k", "000")
      : "";
    const maxRoomSelect = maxRoom
      ? maxRoom.value.replace("KES", "").replace("k", "000")
      : "";
    const minRoomSelect = minRoom
      ? minRoom.value.replace("KES", "").replace("k", "000")
      : "";
    router.push({
      query: {
        ...router.query,
        min_price: minPriceSelect,
        max_price: maxPriceSelect,
        min_rooms: minRoomSelect,
        max_rooms: maxRoomSelect,
      },
    });
  }, [minPrice, maxPrice, minRoom, maxRoom]);

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

  useEffect(() => {
    if (process.browser) {
      window.onresize = function () {
        setState({ ...state, windowSize: window.innerWidth });
      };
    }
  }, []);

  useEffect(() => {
    const getLatLng = async () => {
      const ip = await axios.get("https://api.ipify.org");
      const latlng = await axios.get(`https://ipapi.co/${ip.data}/json`);

      setUserLatLng({
        ...userLatLng,
        longitude: latlng.data.longitude,
        latitude: latlng.data.latitude,
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

  useEffect(() => {
    if (state.windowSize >= 768) {
      setState({
        ...state,
        showSearchModal: false,
        showMobileFilter: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.windowSize]);

  return (
    <div
      className="relativ overflow-x-hidden"
      onClick={() => {
        setState({
          ...state,
          showDropdown: false,
          showCheckInDate: false,
          showCheckOutDate: false,
          showPopup: false,
          selectedSearchItem: 0,
          showSearchModal: false,
          showSortPopup: false,
          showPricePopup: false,
          showRatingsPopup: false,
          showFilterPopup: false,
          showRoomPopup: false,
          showHomeTypesPopup: false,
          showMobileFilter: false,
        });
      }}
    >
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 pb-4">
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
        <div
          onClick={(e) => {
            e.stopPropagation();
            setState({ ...state, showSearchModal: true });
          }}
          className="w-5/6 mx-auto md:hidden cursor-pointer"
        >
          <div className="flex items-center justify-center gap-2 !px-2 !py-2 !bg-gray-100 w-full rounded-full text-center ml-1 font-bold">
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
        </div>
        {/* <div className="sm:hidden flex justify-center">
          <SearchSelect
            currentNavState={state.currentNavState}
            setCurrentNavState={(currentNavState) => {
              setState({
                ...state,
                currentNavState: currentNavState,
                showCheckOutDate: false,
                showCheckInDate: false,
                showPopup: false,
              });
            }}
          ></SearchSelect>
        </div> */}
        <div
          ref={searchRef}
          className="mt-1 hidden w-full md:flex md:justify-center md:px-0 px-4"
        >
          <div className="lg:w-4/6 md:w-11/12 w-full">
            <Search
              autoCompleteFromSearch={autoCompleteFromSearch}
              onKeyDown={keyDownSearch}
              showSearchLoader={showSearchLoader}
              locationFromSearch={(item) => {
                locationFromSearch(item);
              }}
              apiSearchResult={apiSearchResult}
              location={location}
              checkin={state.checkin}
              selectedSearchItem={state.selectedSearchItem}
              showSearchModal={state.showSearchModal}
              clearInput={() => {
                setLocation("");
              }}
              clearCheckInDate={() => {
                setState({ ...state, checkin: "" });
              }}
              clearCheckOutDate={() => {
                setState({ ...state, checkout: "" });
              }}
              changeShowCheckInDate={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showCheckInDate: !state.showCheckInDate,
                  selectedSearchItem: state.selectedSearchItem === 2 ? 0 : 2,
                });
              }}
              setCheckInDate={(date) => {
                state.checkout > date
                  ? setState({ ...state, checkin: date })
                  : setState({ ...state, checkout: "", checkin: date });
              }}
              showCheckInDate={state.showCheckInDate}
              checkout={state.checkout}
              changeShowCheckOutDate={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showCheckOutDate: !state.showCheckOutDate,
                  selectedSearchItem: state.selectedSearchItem === 3 ? 0 : 3,
                });
              }}
              changeSelectedSearchItem={(num) => {
                setState({ ...state, selectedSearchItem: num });
              }}
              setCheckOutDate={(date) => {
                setState({ ...state, checkout: date });
              }}
              showCheckOutDate={state.showCheckOutDate}
              showPopup={state.showPopup}
              changeShowPopup={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showPopup: !state.showPopup,
                  selectedSearchItem: state.selectedSearchItem === 4 ? 0 : 4,
                });
              }}
              onChange={(event) => {
                onChange(event);
              }}
              numOfAdults={state.numOfAdults}
              numOfChildren={state.numOfChildren}
              numOfInfants={state.numOfInfants}
              addToAdults={() => {
                console.log("add");
                setState({ ...state, numOfAdults: state.numOfAdults + 1 });
              }}
              addToChildren={() => {
                setState({
                  ...state,
                  numOfChildren: state.numOfChildren + 1,
                });
              }}
              addToInfants={() => {
                setState({ ...state, numOfInfants: state.numOfInfants + 1 });
              }}
              removeFromAdults={() => {
                state.numOfAdults > 0
                  ? setState({ ...state, numOfAdults: state.numOfAdults - 1 })
                  : null;
              }}
              removeFromChildren={() => {
                state.numOfChildren > 0
                  ? setState({
                      ...state,
                      numOfChildren: state.numOfChildren - 1,
                    })
                  : null;
              }}
              removeFromInfants={() => {
                state.numOfInfants > 0
                  ? setState({
                      ...state,
                      numOfInfants: state.numOfInfants - 1,
                    })
                  : null;
              }}
              clearGuests={() => {
                setState({
                  ...state,
                  numOfChildren: 0,
                  numOfInfants: 0,
                  numOfAdults: 0,
                });
              }}
            ></Search>
          </div>
        </div>
        <ClientOnly>
          {currencyToDollar && (
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
          {!currencyToDollar && (
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
        </ClientOnly>

        <div className="flex gap-4 mt-4 ml-4 sm:ml-10">
          <div
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
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-rooms"
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
                      query: { ...router.query, ordering: "-rooms" },
                    });
                  }
                }}
              >
                Rooms(max to min)
              </div>
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-beds"
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
                      query: { ...router.query, ordering: "-beds" },
                    });
                  }
                }}
              >
                Beds(max to min)
              </div>
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-bathrooms"
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
                      query: { ...router.query, ordering: "-bathrooms" },
                    });
                  }
                }}
              >
                Bathrooms(max to min)
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
                showRoomPopup: !state.showRoomPopup,
              });
            }}
            className="bg-gray-100 hidden lg:block relative cursor-pointer rounded-md border border-gray-200 py-2 px-2"
          >
            {!minRoom && !maxRoom && (
              <div className="flex gap-1 items-center justify-center">
                <span className="block">Rooms</span>
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
            {minRoom && maxRoom && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <h1>{minRoom.value}</h1>
                  <div> - </div>
                  <h1>{maxRoom.value}</h1>
                  <h1>Rooms</h1>
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

            {minRoom && !maxRoom && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <h1>{minRoom.value}</h1>
                  <div>+</div>
                </div>
                <h1>Rooms</h1>
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

            {!minRoom && maxRoom && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <h1>0</h1>
                  <div> - </div>
                  <h1>{maxRoom.value}</h1>
                  <h1>Rooms</h1>
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
              showPopup={state.showRoomPopup}
            >
              <h1 className="font-bold text-base mb-2 text-gray-600">Rooms</h1>

              <RoomFilter
                setMinRoomSelected={setminRoomSelected}
                setMaxRoomSelected={setmaxRoomSelected}
                minRoomInstanceId="minRoom"
                maxRoomInstanceId="maxRoom"
                minRoomSelected={minRoom}
                maxRoomSelected={maxRoom}
              ></RoomFilter>
            </Popup>
          </div>

          <div className="hidden lg:block">
            <StayTypes
              handlePopup={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showStayTypesPopup: !state.showStayTypesPopup,
                });
              }}
              showStayTypesPopup={state.showStayTypesPopup}
            ></StayTypes>
          </div>

          {/* <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showRatingsPopup: !state.showRatingsPopup,
              });
            }}
            className="bg-gray-100 hidden relative cursor-pointer rounded-md border border-gray-200 py-2 px-2 lg:flex gap-1 items-center justify-center"
          >
            <span className="block">Guest Ratings</span>
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
              showPopup={state.showRatingsPopup}
            >
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    exellentRating: state.veryGoodRating
                      ? true
                      : !state.exellentRating,
                    veryGoodRating: false,
                    goodRating: false,
                    fairRating: false,
                    okayRating: false,
                  });
                }}
                className={styles.ratingItem}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={state.exellentRating}></Checkbox>
                  <Badge className="!bg-green-700">4.5</Badge>
                </div>
                <div>Excellent</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    veryGoodRating: state.goodRating
                      ? true
                      : !state.veryGoodRating,
                    exellentRating: true,
                    goodRating: false,
                    fairRating: false,
                    okayRating: false,
                  });
                }}
                className={styles.ratingItem}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={state.veryGoodRating}></Checkbox>
                  <Badge className="!bg-green-600">4</Badge>
                </div>
                <div>Very Good</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    goodRating: state.fairRating ? true : !state.goodRating,
                    veryGoodRating: true,
                    exellentRating: true,
                    fairRating: false,
                    okayRating: false,
                  });
                }}
                className={styles.ratingItem}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={state.goodRating}></Checkbox>
                  <Badge className="!bg-green-500">3.5</Badge>
                </div>
                <div>Good</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    fairRating: state.okayRating ? true : !state.fairRating,
                    goodRating: true,
                    veryGoodRating: true,
                    exellentRating: true,
                    okayRating: false,
                  });
                }}
                className={styles.ratingItem}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={state.fairRating}></Checkbox>
                  <Badge className="!bg-yellow-500">3</Badge>
                </div>
                <div>Fair</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    okayRating: !state.okayRating,
                    fairRating: true,
                    goodRating: true,
                    veryGoodRating: true,
                    exellentRating: true,
                  });
                }}
                className={styles.ratingItem}
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={state.okayRating}></Checkbox>
                  <Badge className="!bg-red-500">0</Badge>
                </div>
                <div>Okay</div>
              </div>
            </Popup>
          </div> */}
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
              className="hidden md:block absolute top-full mt-2 max-h-[500px] w-[500px] -left-32 lg:left-[-20rem] xl:-left-44 px-4 overflow-scroll"
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

                <div className="mt-2 mb-4">
                  <h1 className="font-bold text-base mb-2">Rooms</h1>

                  <RoomFilter
                    setMinRoomSelected={setminRoomSelected}
                    setMaxRoomSelected={setmaxRoomSelected}
                    minRoomInstanceId="minRoom"
                    maxRoomInstanceId="maxRoom"
                    minRoomSelected={minRoom}
                    maxRoomSelected={maxRoom}
                  ></RoomFilter>
                </div>

                <div className="mt-2 mb-4">
                  <span className="block font-bold text-base mb-2">
                    All stay types
                  </span>
                  <MobileStayTypes
                    handlePopup={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showStayTypesPopup: !state.showStayTypesPopup,
                      });
                    }}
                    showStayTypesPopup={state.showStayTypesPopup}
                  ></MobileStayTypes>
                </div>

                {/* <div>
                  <span className="block font-bold text-base mb-2">
                    Guest ratings
                  </span>
                  <div className="mt-2 mb-4 flex flex-wrap">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          exellentRating: state.veryGoodRating
                            ? true
                            : !state.exellentRating,
                          veryGoodRating: false,
                          goodRating: false,
                          fairRating: false,
                          okayRating: false,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox checked={state.exellentRating}></Checkbox>
                        <Badge className="!bg-green-700">4.5</Badge>
                      </div>
                      <div>Excellent</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          veryGoodRating: state.goodRating
                            ? true
                            : !state.veryGoodRating,
                          exellentRating: true,
                          goodRating: false,
                          fairRating: false,
                          okayRating: false,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox checked={state.veryGoodRating}></Checkbox>
                        <Badge className="!bg-green-600">4</Badge>
                      </div>
                      <div>Very Good</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          goodRating: state.fairRating
                            ? true
                            : !state.goodRating,
                          veryGoodRating: true,
                          exellentRating: true,
                          fairRating: false,
                          okayRating: false,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox checked={state.goodRating}></Checkbox>
                        <Badge className="!bg-green-500">3.5</Badge>
                      </div>
                      <div>Good</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          fairRating: state.okayRating
                            ? true
                            : !state.fairRating,
                          goodRating: true,
                          veryGoodRating: true,
                          exellentRating: true,
                          okayRating: false,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox checked={state.fairRating}></Checkbox>
                        <Badge className="!bg-yellow-500">3</Badge>
                      </div>
                      <div>Fair</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          okayRating: !state.okayRating,
                          fairRating: true,
                          goodRating: true,
                          veryGoodRating: true,
                          exellentRating: true,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox checked={state.okayRating}></Checkbox>
                        <Badge className="!bg-red-500">0</Badge>
                      </div>
                      <div>Okay</div>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
              <ThemeFilter></ThemeFilter>

              {/* <div className="text-lg font-bold mb-2 mt-8">Activities</div>
              <div className="flex gap-2 flex-wrap">
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      gameDrives: !state.gameDrives,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.gameDrives
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Game Drives
                </div>
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      walkingSafaris: !state.walkingSafaris,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.walkingSafaris
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Walking Safaris
                </div>
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      horseBackRiding: !state.horseBackRiding,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.horseBackRiding
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Horseback Riding
                </div>
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      waterSports: !state.waterSports,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.waterSports
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Watersports
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, cultural: !state.cultural });
                  }}
                  className={
                    styles.tag +
                    (state.cultural
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Cultural
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, bushMeals: !state.bushMeals });
                  }}
                  className={
                    styles.tag +
                    (state.bushMeals
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Bush Meals
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, sundowners: !state.sundowners });
                  }}
                  className={
                    styles.tag +
                    (state.sundowners
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Sundowners
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, ecoTours: !state.ecoTours });
                  }}
                  className={
                    styles.tag +
                    (state.ecoTours
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                > 
                  Eco Tours
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, spa: !state.spa });
                  }}
                  className={
                    styles.tag +
                    (state.spa
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Spa
                </div>
              </div> */}

              <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
              <Amenities></Amenities>
            </Popup>
          </div>
        </div>
      </div>
      <div className="mt-48 lg:mt-56 flex relative h-full overflow-y-scroll">
        <div className={"hidden lg:block w-2/4 px-4 h-[70vh] relative"}>
          <Map></Map>
        </div>

        {!mobileMap && (
          <div
            className={
              "px-4 md:mt-10 lg:mt-0 relative lg:h-[70vh] w-2/4 lgMax:w-full lg:overflow-y-scroll " +
              (filterStayLoading ? "!overflow-y-hidden !h-[70vh]" : "")
            }
          >
            <Listings
              getDistance={getDistanceFromLatLonInKm}
              userLatLng={userLatLng}
              itemsInCart={itemsInCart}
              itemsInOrders={itemsInOrders}
              userProfile={userProfile}
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
          </div>
        )}
      </div>
      {state.windowSize < 768 && (
        <MobileModal
          showModal={state.showMobileFilter}
          closeModal={() => {
            setState({
              ...state,
              ...turnOffAllPopup,
              showMobileFilter: false,
            });
          }}
          containerHeight={90}
          closeAllPopups={() => {
            setState({ ...state, ...turnOffAllPopup });
          }}
          title="All Filters"
        >
          <div className="px-4">
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

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Rooms</h1>

                <RoomFilter
                  setMinRoomSelected={setminRoomSelected}
                  setMaxRoomSelected={setmaxRoomSelected}
                  minRoomInstanceId="minRoom"
                  maxRoomInstanceId="maxRoom"
                  minRoomSelected={minRoom}
                  maxRoomSelected={maxRoom}
                ></RoomFilter>
              </div>

              <div className="mt-2 mb-4">
                <span className="block font-bold text-base mb-2">
                  All stay types
                </span>
                <MobileStayTypes
                  handlePopup={() => {
                    setState({
                      ...state,
                      ...turnOffAllPopup,
                      showStayTypesPopup: !state.showStayTypesPopup,
                    });
                  }}
                  showStayTypesPopup={state.showStayTypesPopup}
                ></MobileStayTypes>
              </div>

              {/* <div>
                <span className="block font-bold text-base mb-2">
                  Guest ratings
                </span>
                <div className="mt-2 mb-4 flex flex-wrap">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        exellentRating: state.veryGoodRating
                          ? true
                          : !state.exellentRating,
                        veryGoodRating: false,
                        goodRating: false,
                        fairRating: false,
                        okayRating: false,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%] w-full"}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={state.exellentRating}></Checkbox>
                      <Badge className="!bg-green-700">4.5</Badge>
                    </div>
                    <div>Excellent</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        veryGoodRating: state.goodRating
                          ? true
                          : !state.veryGoodRating,
                        exellentRating: true,
                        goodRating: false,
                        fairRating: false,
                        okayRating: false,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%] w-full"}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={state.veryGoodRating}></Checkbox>
                      <Badge className="!bg-green-600">4</Badge>
                    </div>
                    <div>Very Good</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        goodRating: state.fairRating ? true : !state.goodRating,
                        veryGoodRating: true,
                        exellentRating: true,
                        fairRating: false,
                        okayRating: false,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%] w-full"}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={state.goodRating}></Checkbox>
                      <Badge className="!bg-green-500">3.5</Badge>
                    </div>
                    <div>Good</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        fairRating: state.okayRating ? true : !state.fairRating,
                        goodRating: true,
                        veryGoodRating: true,
                        exellentRating: true,
                        okayRating: false,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%] w-full"}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={state.fairRating}></Checkbox>
                      <Badge className="!bg-yellow-500">3</Badge>
                    </div>
                    <div>Fair</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        okayRating: !state.okayRating,
                        fairRating: true,
                        goodRating: true,
                        veryGoodRating: true,
                        exellentRating: true,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%] w-full"}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox checked={state.okayRating}></Checkbox>
                      <Badge className="!bg-red-500">0</Badge>
                    </div>
                    <div>Okay</div>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
            <ThemeFilter></ThemeFilter>

            {/* <div className="text-lg font-bold mb-2 mt-8">Activities</div>
            <div className="flex gap-2 flex-wrap">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    gameDrives: !state.gameDrives,
                  });
                }}
                className={
                  styles.tag +
                  (state.gameDrives
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Game Drives
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    walkingSafaris: !state.walkingSafaris,
                  });
                }}
                className={
                  styles.tag +
                  (state.walkingSafaris
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Walking Safaris
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    horseBackRiding: !state.horseBackRiding,
                  });
                }}
                className={
                  styles.tag +
                  (state.horseBackRiding
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Horseback Riding
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    waterSports: !state.waterSports,
                  });
                }}
                className={
                  styles.tag +
                  (state.waterSports
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Watersports
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, cultural: !state.cultural });
                }}
                className={
                  styles.tag +
                  (state.cultural
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Cultural
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, bushMeals: !state.bushMeals });
                }}
                className={
                  styles.tag +
                  (state.bushMeals
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Bush Meals
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, sundowners: !state.sundowners });
                }}
                className={
                  styles.tag +
                  (state.sundowners
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Sundowners
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, ecoTours: !state.ecoTours });
                }}
                className={
                  styles.tag +
                  (state.ecoTours
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Eco Tours
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, spa: !state.spa });
                }}
                className={
                  styles.tag +
                  (state.spa
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Spa
              </div>
            </div> */}

            <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
            <Amenities></Amenities>
          </div>
        </MobileModal>
      )}
      <MobileModal
        showModal={state.showSearchModal}
        closeModal={() => {
          setState({
            ...state,
            ...turnOffAllPopup,
            showSearchModal: false,
          });
        }}
        containerHeight={90}
        closeAllPopups={() => {
          setState({ ...state, ...turnOffAllPopup });
        }}
        title="Search"
      >
        <div className="flex justify-center mb-3 mt-6">
          <SearchSelect
            currentNavState={state.currentNavState}
            setCurrentNavState={(currentNavState) => {
              setState({
                ...state,
                currentNavState: currentNavState,
                showCheckOutDate: false,
                showCheckInDate: false,
                showPopup: false,
              });
            }}
          ></SearchSelect>
        </div>
        <div className="lg:w-4/6 md:w-11/12 w-full px-4">
          <Search
            autoCompleteFromSearch={autoCompleteFromSearch}
            onKeyDown={keyDownSearch}
            showSearchLoader={showSearchLoader}
            locationFromSearch={(item) => {
              locationFromSearch(item);
            }}
            apiSearchResult={apiSearchResult}
            location={location}
            checkin={state.checkin}
            selectedSearchItem={state.selectedSearchItem}
            showSearchModal={state.showSearchModal}
            clearInput={() => {
              setLocation("");
            }}
            clearCheckInDate={() => {
              setState({ ...state, checkin: "" });
            }}
            clearCheckOutDate={() => {
              setState({ ...state, checkout: "" });
            }}
            changeShowCheckInDate={() => {
              setState({
                ...state,
                ...turnOffAllPopup,
                showCheckInDate: !state.showCheckInDate,
                selectedSearchItem: state.selectedSearchItem === 2 ? 0 : 2,
              });
            }}
            setCheckInDate={(date) => {
              state.checkout > date
                ? setState({ ...state, checkin: date })
                : setState({ ...state, checkout: "", checkin: date });
            }}
            showCheckInDate={state.showCheckInDate}
            checkout={state.checkout}
            changeShowCheckOutDate={() => {
              setState({
                ...state,
                ...turnOffAllPopup,
                showCheckOutDate: !state.showCheckOutDate,
                selectedSearchItem: state.selectedSearchItem === 3 ? 0 : 3,
              });
            }}
            changeSelectedSearchItem={(num) => {
              setState({ ...state, selectedSearchItem: num });
            }}
            setCheckOutDate={(date) => {
              setState({ ...state, checkout: date });
            }}
            showCheckOutDate={state.showCheckOutDate}
            showPopup={state.showPopup}
            changeShowPopup={() => {
              setState({
                ...state,
                ...turnOffAllPopup,
                showPopup: !state.showPopup,
                selectedSearchItem: state.selectedSearchItem === 4 ? 0 : 4,
              });
            }}
            onChange={(event) => {
              onChange(event);
            }}
            numOfAdults={state.numOfAdults}
            numOfChildren={state.numOfChildren}
            numOfInfants={state.numOfInfants}
            addToAdults={() => {
              console.log("add");
              setState({ ...state, numOfAdults: state.numOfAdults + 1 });
            }}
            addToChildren={() => {
              setState({
                ...state,
                numOfChildren: state.numOfChildren + 1,
              });
            }}
            addToInfants={() => {
              setState({ ...state, numOfInfants: state.numOfInfants + 1 });
            }}
            removeFromAdults={() => {
              state.numOfAdults > 0
                ? setState({ ...state, numOfAdults: state.numOfAdults - 1 })
                : null;
            }}
            removeFromChildren={() => {
              state.numOfChildren > 0
                ? setState({
                    ...state,
                    numOfChildren: state.numOfChildren - 1,
                  })
                : null;
            }}
            removeFromInfants={() => {
              state.numOfInfants > 0
                ? setState({
                    ...state,
                    numOfInfants: state.numOfInfants - 1,
                  })
                : null;
            }}
            clearGuests={() => {
              setState({
                ...state,
                numOfChildren: 0,
                numOfInfants: 0,
                numOfAdults: 0,
              });
            }}
          ></Search>
        </div>
      </MobileModal>

      {state.windowSize < 768 && mobileMap && (
        <div className={"h-[80vh]"}>
          <Map></Map>
        </div>
      )}

      <div
        onClick={() => setMobileMap(!mobileMap)}
        className="w-40 lg:hidden fixed bottom-2 left-2/4 right-2/4 -translate-x-2/4 -translate-y-2/4 z-20"
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
          className="w-40 lg:hidden fixed bottom-2 left-2/4 right-2/4 -translate-x-2/4 -translate-y-2/4 z-20"
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

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
            query.search ? query.search : ""
          }&type_of_stay=${
            query.type_of_stay ? query.type_of_stay : ""
          }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
            query.max_price ? query.max_price : ""
          }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
            query.max_rooms ? query.max_rooms : ""
          }&ordering=${query.ordering ? query.ordering : ""}`
        );

        await context.dispatch({
          type: "SET_STAYS",
          payload: response.data.results,
        });

        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: response.data[0],
            },
          };
        }

        return {
          props: {
            userProfile: "",
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
            },
          };
        }
      }
    }
);

export default Stays;
