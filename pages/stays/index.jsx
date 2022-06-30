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
import MobileModal from "../../components/ui/FullScreenMobileModal";
import LargeMobileModal from "../../components/ui/LargeFullscreenPopup";
import Button from "../../components/ui/Button";
import ClientOnly from "../../components/ClientOnly";
import { setFilteredStays } from "../../redux/actions/stay";
import StayTypes from "../../components/Lodging/StayTypes";
import MobileStayTypes from "../../components/Lodging/MobileStayTypes";
import Amenities from "../../components/Lodging/Amenities";
import ThemeFilter from "../../components/Lodging/ThemeFilter";
import Cookies from "js-cookie";
import { route } from "next/dist/server/router";
import MobileSearchModal from "../../components/Stay/MobileSearchModal";

function Stays({ userProfile, longitude, latitude, stays }) {
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
    if (location !== "" || numOfAdults !== 0) {
      setShowSearchLoader(true);
      router
        .push({
          pathname: "/stays",
          query: {
            ...router.query,
            search: location,
            min_capacity: numOfAdults > 0 ? numOfAdults : "",
          },
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

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minRoom, setminRoomSelected] = useState(null);
  const [maxRoom, setmaxRoomSelected] = useState(null);

  const [mobileMap, setMobileMap] = useState(false);
  const filterStayLoading = useSelector(
    (state) => state.stay.filterStayLoading
  );

  const [isFixed, setIsFixed] = useState(true);

  const searchRef = useRef(null);

  const dispatch = useDispatch();

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //   } else {
  //     dispatch(setFilteredStays(router));
  //   }
  // }, [router.query.min_price, router.query.max_price, router.query.ordering]);

  // useEffect(() => {
  //   const minPriceFilterFormat = router.query.min_price
  //     ? "KES" + router.query.min_price.replace("000", "k")
  //     : "";

  //   const minPriceFilterFormatObject = router.query.min_price
  //     ? {
  //         value: minPriceFilterFormat,
  //         label: minPriceFilterFormat,
  //       }
  //     : "";

  //   const maxPriceFilterFormat = router.query.max_price
  //     ? "KES" + router.query.max_price.replace("000", "k")
  //     : "";

  //   const maxPriceFilterFormatObject = router.query.max_price
  //     ? {
  //         value: maxPriceFilterFormat,
  //         label: maxPriceFilterFormat,
  //       }
  //     : "";

  //   setMinSelected(minPriceFilterFormatObject);
  //   setMaxSelected(maxPriceFilterFormatObject);
  // }, [router.query.min_price, router.query.max_price]);

  // useEffect(() => {
  //   if (minPrice || maxPrice || minRoom || maxRoom) {
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
  //         min_rooms: minRoom,
  //         max_rooms: maxRoom,
  //       },
  //     });
  //   }
  // }, [minPrice, maxPrice, minRoom, maxRoom]);

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

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [mobileSearchModal, setMobileSearchModal] = useState(false);

  const [numOfAdults, setNumOfAdults] = useState(
    Number(router.query.min_capacity) || 0
  );

  const [numOfChildren, setNumOfChildren] = useState(0);

  const [showDateRangePopup, setShowDateRangePopup] = useState(false);

  const [numOfRoomsFilter, setNumOfRoomsFilter] = useState(0);

  const [numOfBedsFilter, setNumOfBedsFilter] = useState(0);

  const [numOfBathroomsFilter, setNumOfBathroomsFilter] = useState(0);

  const filterMinPrice = () => {
    if (minPrice) {
      router.push({
        query: {
          ...router.query,
          min_price: minPrice,
          max_price: router.query.max_price || "",
        },
      });
    }
  };

  const filterMaxPrice = () => {
    if (maxPrice) {
      router.push({
        query: {
          ...router.query,
          min_price: router.query.min_price || "",
          max_price: maxPrice,
        },
      });
    }
  };

  return (
    <div
      className={
        "overflow-x-hidden " + (state.showMobileFilter ? "h-screen" : "")
      }
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

        setShowDateRangePopup(false);
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
                  showSortPopup: !state.showSortPopup,
                });
              }}
              className="w-2/4 relative flex items-center justify-center transition-all duration-200 ease-linear hover:border-gray-200 rounded-xl"
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
                className="absolute top-full mt-2 w-60 -right-6"
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

                    router.push({
                      query: { ...router.query, ordering: "-date_posted" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "+price" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-price" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-rooms" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-beds" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-bathrooms" },
                    });
                  }}
                >
                  Bathrooms(max to min)
                </div>
              </Popup>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showMobileFilter: true,
                });
              }}
              className="w-2/4 flex items-center justify-center hover:border transition-all duration-200 ease-linear hover:border-gray-200 rounded-xl border"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-7 h-7"
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
            </div>
          </div>
        </div>

        <MobileSearchModal
          showModal={mobileSearchModal}
          closeModal={setMobileSearchModal}
          search={location}
          setSearch={setLocation}
          numOfAdults={numOfAdults}
          setNumOfAdults={setNumOfAdults}
          numOfChildren={numOfChildren}
          setNumOfChildren={setNumOfChildren}
          searchFilter={apiSearchResult}
          showSearchLoader={showSearchLoader}
        ></MobileSearchModal>

        <div
          ref={searchRef}
          className="mt-1 hidden w-full md:flex lg:justify-center lg:px-0 md:px-4"
        >
          <div className="lg:w-[750px] md:w-[80%]">
            <Search
              autoCompleteFromSearch={autoCompleteFromSearch}
              onKeyDown={keyDownSearch}
              showSearchLoader={showSearchLoader}
              locationFromSearch={(item) => {
                locationFromSearch(item);
              }}
              dateRange={dateRange}
              setDateRange={setDateRange}
              clearDateRange={() => {
                setDateRange({
                  from: "",
                  to: "",
                });
              }}
              showDateRange={showDateRangePopup}
              setShowDateRange={setShowDateRangePopup}
              apiSearchResult={apiSearchResult}
              location={location}
              selectedSearchItem={state.selectedSearchItem}
              showSearchModal={state.showSearchModal}
              clearInput={() => {
                setLocation("");
              }}
              changeSelectedSearchItem={(num) => {
                setState({ ...state, selectedSearchItem: num });
              }}
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
              numOfAdults={numOfAdults}
              numOfChildren={state.numOfChildren}
              numOfInfants={state.numOfInfants}
              addToAdults={() => {
                setNumOfAdults(numOfAdults + 1);
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
                numOfAdults > 0 ? setNumOfAdults(numOfAdults - 1) : null;
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

          <div className="flex absolute right-2 bottom-[30px]">
            <div
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
              className="w-2/4 relative border p-2 cursor-pointer flex items-center justify-center transition-all duration-200 ease-linear hover:border-gray-200 rounded-md"
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

                    router.push({
                      query: { ...router.query, ordering: "-date_posted" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "+price" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-price" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-rooms" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-beds" },
                    });
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

                    router.push({
                      query: { ...router.query, ordering: "-bathrooms" },
                    });
                  }}
                >
                  Bathrooms(max to min)
                </div>
              </Popup>
            </div>
          </div>
        </div>

        <div>
          {/* <div className="gap-4 mt-4 ml-4 md:flex hidden sm:ml-10">
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
              <div className="flex gap-1 my-2">
                <div
                  onClick={() => {
                    if (router.query.isBudget === "true") {
                      router.push({
                        query: {
                          ...router.query,
                          isBudget: "",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    } else {
                      router.push({
                        query: {
                          ...router.query,
                          isBudget: "true",
                          min_price: "0",
                          max_price: "6000",
                          isHighEnd: "",
                          isMidEnd: "",
                        },
                      });
                    }
                  }}
                  className={
                    "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                    (router.query.isBudget === "true"
                      ? "!bg-blue-500 !text-white"
                      : "")
                  }
                >
                  Budget
                </div>
                <div
                  onClick={() => {
                    if (router.query.isMidRange === "true") {
                      router.push({
                        query: {
                          ...router.query,
                          isMidRange: "",
                          min_price: "",
                          max_price: "",
                        },
                      });
                    } else {
                      router.push({
                        query: {
                          ...router.query,
                          isMidRange: "true",
                          min_price: "6000",
                          max_price: "18000",
                          isHighEnd: "",
                          isBudget: "",
                        },
                      });
                    }
                  }}
                  className={
                    "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                    (router.query.isMidRange === "true"
                      ? "!bg-blue-500 !text-white"
                      : "")
                  }
                >
                  Mid-range
                </div>
                <div
                  onClick={() => {
                    if (router.query.highEnd === "true") {
                      router.push({
                        query: {
                          ...router.query,
                          highEnd: "",
                          min_price: "",
                          max_price: "",
                          isBudget: "",
                          isMidRange: "",
                        },
                      });
                    } else {
                      router.push({
                        query: {
                          ...router.query,
                          highEnd: "true",
                          min_price: "18000",
                          max_price: "",
                        },
                      });
                    }
                  }}
                  className={
                    "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                    (router.query.highEnd === "true"
                      ? "!bg-blue-500 !text-white"
                      : "")
                  }
                >
                  High-end
                </div>
              </div>
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
              </div>

              <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
              <ThemeFilter></ThemeFilter>

              <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
              <Amenities></Amenities>
            </Popup>
          </div>
        </div> */}
        </div>
      </div>

      <div className="mt-[146px] md:mt-[142px] lg:mt-[188px] flex relative h-full overflow-y-scroll">
        <div className={"hidden lg:block w-2/4 px-4 h-[75vh] relative"}>
          <Map stays={stays}></Map>
        </div>

        {!mobileMap && (
          <div
            className={
              "px-4 md:mt-10 lg:mt-0 relative lg:h-[75vh] w-2/4 lgMax:w-full lg:overflow-y-scroll " +
              (filterStayLoading ? "!overflow-y-hidden !h-[75vh]" : "")
            }
          >
            <Listings
              getDistance={getDistanceFromLatLonInKm}
              userLatLng={userLatLng}
              itemsInCart={itemsInCart}
              itemsInOrders={itemsInOrders}
              stays={stays}
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
          <div className="">
            <div className="mt-2 mb-4">
              <h1 className="font-bold text-base mb-2">Price Range</h1>
              {/* <PriceFilter
                    setMinPriceSelected={setMinSelected}
                    setMaxPriceSelected={setMaxSelected}
                    minPriceInstanceId="minPrice"
                    maxPriceInstanceId="maxPrice"
                    minPriceSelected={minPrice}
                    maxPriceSelected={maxPrice}
                  ></PriceFilter> */}

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
                      className="w-full focus:outline-none text-sm "
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="-mx-4 my-6" />

            <div className="mt-2 mb-4">
              <h1 className="font-bold text-base mb-2">Rooms</h1>

              <div className="flex flex-wrap items-center gap-3 px-2">
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_rooms: "",
                        min_rooms: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                    (router.query.max_rooms != 1 &&
                    router.query.max_rooms != 2 &&
                    router.query.max_rooms != 3 &&
                    router.query.max_rooms != 4 &&
                    router.query.max_rooms != 5 &&
                    router.query.max_rooms != 6 &&
                    router.query.max_rooms != 7 &&
                    router.query.min_rooms != 8
                      ? "bg-slate-800 text-white"
                      : "")
                  }
                >
                  Any
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 1, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 1
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  1
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 2, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 2
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  2
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 3, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 3
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  3
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 4, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 4
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  4
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 5, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 5
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  5
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 6, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 6
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  6
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_rooms: 7, min_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_rooms == 7
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  7
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, min_rooms: 8, max_rooms: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.min_rooms == 8
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  8+
                </div>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <h1 className="font-bold text-base mb-2">Beds</h1>

              <div className="flex flex-wrap items-center gap-3 px-2">
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_beds: "",
                        min_beds: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                    (router.query.max_beds != 1 &&
                    router.query.max_beds != 2 &&
                    router.query.max_beds != 3 &&
                    router.query.max_beds != 4 &&
                    router.query.max_beds != 5 &&
                    router.query.max_beds != 6 &&
                    router.query.max_beds != 7 &&
                    router.query.min_beds != 8
                      ? "bg-slate-800 text-white"
                      : "")
                  }
                >
                  Any
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 1, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 1
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  1
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 2, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 2
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  2
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 3, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 3
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  3
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 4, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 4
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  4
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 5, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 5
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  5
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 6, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 6
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  6
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, max_beds: 7, min_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_beds == 7
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  7
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: { ...router.query, min_beds: 8, max_beds: "" },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.min_beds == 8
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  8+
                </div>
              </div>
            </div>

            <div className="mt-2 mb-4">
              <h1 className="font-bold text-base mb-2">Bathrooms</h1>

              <div className="flex flex-wrap items-center gap-3 px-2">
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: "",
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                    (router.query.max_bathrooms != 1 &&
                    router.query.max_bathrooms != 2 &&
                    router.query.max_bathrooms != 3 &&
                    router.query.max_bathrooms != 4 &&
                    router.query.max_bathrooms != 5 &&
                    router.query.max_bathrooms != 6 &&
                    router.query.max_bathrooms != 7 &&
                    router.query.min_bathrooms != 8
                      ? "bg-slate-800 text-white"
                      : "")
                  }
                >
                  Any
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 1,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 1
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  1
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 2,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 2
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  2
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 3,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 3
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  3
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 4,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 4
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  4
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 5,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 5
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  5
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 6,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 6
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  6
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        max_bathrooms: 7,
                        min_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.max_bathrooms == 7
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  7
                </div>

                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        min_bathrooms: 8,
                        max_bathrooms: "",
                      },
                    });
                  }}
                  className={
                    "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                    (router.query.min_bathrooms == 8
                      ? "!bg-slate-800 !text-white"
                      : "")
                  }
                >
                  8+
                </div>
              </div>
            </div>

            <hr className="-mx-4 my-6" />

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
          </div>

          <hr className="-mx-4 my-6" />

          <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
          <Amenities></Amenities>
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
                  pathname: "/stays",
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
              Show all {stays.length} stays
            </Button>
          </div>
        </div>
      </MobileModal>

      <div>
        {/* {state.windowSize < 768 && (
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
              </div>

              <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
              <ThemeFilter></ThemeFilter>

              <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
              <Amenities></Amenities>
            </div>
          </MobileModal>
        )} */}
      </div>

      <div className="relative hidden md:block ">
        <LargeMobileModal
          showModal={state.showMobileFilter}
          closeModal={() => {
            setState({
              ...state,
              ...turnOffAllPopup,
              showMobileFilter: false,
            });
          }}
          className="!overflow-y-scroll max-w-[800px] !h-[700px]"
          title="Filters"
        >
          <div className="px-4 relative">
            <div className="">
              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Price Range</h1>
                {/* <PriceFilter
                    setMinPriceSelected={setMinSelected}
                    setMaxPriceSelected={setMaxSelected}
                    minPriceInstanceId="minPrice"
                    maxPriceInstanceId="maxPrice"
                    minPriceSelected={minPrice}
                    maxPriceSelected={maxPrice}
                  ></PriceFilter> */}

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
                        className="w-full focus:outline-none text-sm "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="-mx-4 my-6" />

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Rooms</h1>

                <div className="flex flex-wrap items-center gap-3 px-10">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_rooms: "",
                          min_rooms: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                      (router.query.max_rooms != 1 &&
                      router.query.max_rooms != 2 &&
                      router.query.max_rooms != 3 &&
                      router.query.max_rooms != 4 &&
                      router.query.max_rooms != 5 &&
                      router.query.max_rooms != 6 &&
                      router.query.max_rooms != 7 &&
                      router.query.min_rooms != 8
                        ? "bg-slate-800 text-white"
                        : "")
                    }
                  >
                    Any
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 1, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 1
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    1
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 2, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 2
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    2
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 3, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 3
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    3
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 4, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 4
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    4
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 5, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 5
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    5
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 6, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 6
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    6
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_rooms: 7, min_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_rooms == 7
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    7
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, min_rooms: 8, max_rooms: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.min_rooms == 8
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    8+
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Beds</h1>

                <div className="flex flex-wrap items-center gap-3 px-10">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_beds: "",
                          min_beds: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                      (router.query.max_beds != 1 &&
                      router.query.max_beds != 2 &&
                      router.query.max_beds != 3 &&
                      router.query.max_beds != 4 &&
                      router.query.max_beds != 5 &&
                      router.query.max_beds != 6 &&
                      router.query.max_beds != 7 &&
                      router.query.min_beds != 8
                        ? "bg-slate-800 text-white"
                        : "")
                    }
                  >
                    Any
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 1, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 1
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    1
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 2, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 2
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    2
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 3, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 3
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    3
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 4, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 4
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    4
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 5, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 5
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    5
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 6, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 6
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    6
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, max_beds: 7, min_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_beds == 7
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    7
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: { ...router.query, min_beds: 8, max_beds: "" },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.min_beds == 8
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    8+
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-4">
                <h1 className="font-bold text-base mb-2">Bathrooms</h1>

                <div className="flex flex-wrap items-center gap-3 px-10">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: "",
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-3 py-2 cursor-pointer border rounded-3xl text-sm font-bold " +
                      (router.query.max_bathrooms != 1 &&
                      router.query.max_bathrooms != 2 &&
                      router.query.max_bathrooms != 3 &&
                      router.query.max_bathrooms != 4 &&
                      router.query.max_bathrooms != 5 &&
                      router.query.max_bathrooms != 6 &&
                      router.query.max_bathrooms != 7 &&
                      router.query.min_bathrooms != 8
                        ? "bg-slate-800 text-white"
                        : "")
                    }
                  >
                    Any
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 1,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 1
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    1
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 2,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 2
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    2
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 3,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 3
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    3
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 4,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 4
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    4
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 5,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 5
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    5
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 6,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 6
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    6
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          max_bathrooms: 7,
                          min_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.max_bathrooms == 7
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    7
                  </div>

                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          min_bathrooms: 8,
                          max_bathrooms: "",
                        },
                      });
                    }}
                    className={
                      "px-5 cursor-pointer py-2 border rounded-3xl text-black text-sm font-bold " +
                      (router.query.min_bathrooms == 8
                        ? "!bg-slate-800 !text-white"
                        : "")
                    }
                  >
                    8+
                  </div>
                </div>
              </div>

              <hr className="-mx-4 my-6" />

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
            </div>

            <hr className="-mx-4 my-6" />

            <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
            <ThemeFilter></ThemeFilter>

            <hr className="-mx-4 my-6" />

            <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
            <Amenities></Amenities>
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
                    pathname: "/stays",
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
                Show all {stays.length} stays
              </Button>
            </div>
          </div>
        </LargeMobileModal>
      </div>

      {mobileMap && (
        <div className={"h-[82vh] md:hidden"}>
          <Map stays={stays}></Map>
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

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
            query.search ? query.search : ""
          }&type_of_stay=${
            query.type_of_stay ? query.type_of_stay : ""
          }&min_capacity=${
            query.min_capacity ? query.min_capacity : ""
          }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
            query.max_price ? query.max_price : ""
          }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
            query.max_rooms ? query.max_rooms : ""
          }&min_beds=${query.min_beds ? query.min_beds : ""}&max_beds=${
            query.max_beds ? query.max_beds : ""
          }&min_bathrooms=${
            query.min_bathrooms ? query.min_bathrooms : ""
          }&max_bathrooms=${
            query.max_bathrooms ? query.min_bathrooms : ""
          }&ordering=${query.ordering ? query.ordering : ""}`
        );

        // await context.dispatch({
        //   type: "SET_STAYS",
        //   payload: response.data.results,
        // });

        if (token) {
          const userProfile = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/?search=${
              query.search ? query.search : ""
            }&type_of_stay=${
              query.type_of_stay ? query.type_of_stay : ""
            }&min_capacity=${
              query.min_capacity ? query.min_capacity : ""
            }&min_price=${query.min_price ? query.min_price : ""}&max_price=${
              query.max_price ? query.max_price : ""
            }&min_rooms=${query.min_rooms ? query.min_rooms : ""}&max_rooms=${
              query.max_rooms ? query.max_rooms : ""
            }&min_beds=${query.min_beds ? query.min_beds : ""}&max_beds=${
              query.max_beds ? query.max_beds : ""
            }&min_bathrooms=${
              query.min_bathrooms ? query.min_bathrooms : ""
            }&max_bathrooms=${
              query.max_bathrooms ? query.min_bathrooms : ""
            }&ordering=${query.ordering ? query.ordering : ""}`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: userProfile.data[0],
              stays: response.data.results,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            stays: response.data.results,
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
              stays: [],
            },
          };
        }
      }
    }
);

export default Stays;
