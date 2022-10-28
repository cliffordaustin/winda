import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { Icon } from "@iconify/react";

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
import { useGoogleOneTapLogin } from "@react-oauth/google";
import ContactBanner from "../../components/Home/ContactBanner";
import { stayUrl } from "../../lib/stayUrl";

function Stays({
  userProfile,
  stays,
  pageSize,
  count,
  nextLink,
  previousLink,
  allStays,
  totalPages,
}) {
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

  // useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("Login Failed");
  //   },
  // });

  const isMounted = useRef(false);

  const isFirstRender = useRef(true);

  const [autoCompleteFromSearch, setAutoCompleteFromSearch] = useState([]);

  const [location, setLocation] = useState(
    router.query.search || router.query.d_search || ""
  );

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
    setLocation(item);
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
            d_search: "",
            page: "",
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
              query: {
                ...router.query,
                search: autoCompleteFromSearch[0].place_name,
                d_search: "",
                page: "",
                min_capacity: numOfAdults > 0 ? numOfAdults : "",
              },
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
      window.onresize = () => {
        if (window.innerWidth >= 1024) {
          setMobileMap(false);
        }
      };
    }
  }, []);

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

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  return (
    <div
      className="relative"
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
      {/* <ContactBanner></ContactBanner> */}
      <div className="sticky top-0 left-0 right-0 bg-white border-b z-20 pb-4">
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
      </div>

      {!mobileMap && (
        <div className="mt-3 w-full">
          <div className="flex gap-2 px-4">
            <div className="lg:w-[40%] xl:w-[50%] hidden lg:block px-2 h-[78vh] mt-0 sticky top-[170px]">
              <Map stays={allStays}></Map>
            </div>
            <div className="lg:w-[60%] xl:w-[50%] w-full md:pl-4">
              <Listings
                itemsInCart={itemsInCart}
                itemsInOrders={itemsInOrders}
                userProfile={userProfile}
                stays={stays}
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
              {stays.length > 0 && (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={
                    <Icon icon="bx:chevron-right" className="w-7 h-7" />
                  }
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
          </div>
        </div>
      )}

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
        <div className="relative">
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

              <div className="flex items-center gap-3 mb-2 px-2">
                <div
                  onClick={() => {
                    router.push({
                      query: {
                        ...router.query,
                        pricing_type:
                          router.query.pricing_type === "REASONABLE"
                            ? ""
                            : "REASONABLE",
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
                        pricing_type:
                          router.query.pricing_type === "MID-RANGE"
                            ? ""
                            : "MID-RANGE",
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
                        pricing_type:
                          router.query.pricing_type === "HIGH-END"
                            ? ""
                            : "HIGH-END",
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
                Filter stays by
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

          {/* <hr className="-mx-4 my-6" />

          <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
          <Amenities></Amenities> */}
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
              Show all {count} stays
            </Button>
          </div>
        </div>
      </MobileModal>

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

                <div className="flex items-center gap-3 mb-2 px-10">
                  <div
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          pricing_type:
                            router.query.pricing_type === "REASONABLE"
                              ? ""
                              : "REASONABLE",
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
                          pricing_type:
                            router.query.pricing_type === "MID-RANGE"
                              ? ""
                              : "MID-RANGE",
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
                          pricing_type:
                            router.query.pricing_type === "HIGH-END"
                              ? ""
                              : "HIGH-END",
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
                  Filter stays by
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

            {/* <hr className="-mx-4 my-6" />

            <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
            <Amenities></Amenities> */}
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
                Show all {count} stays
              </Button>
            </div>
          </div>
        </LargeMobileModal>
      </div>

      {mobileMap && (
        <div className={"h-[83vh] mt-[140px]"}>
          <Map stays={allStays}></Map>
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

        const url = stayUrl(query);

        const allStaysUrl = stayUrl(query, true);

        const response = await axios.get(`${url}`);

        const allStays = await axios.get(`${allStaysUrl}`);

        if (token) {
          const userProfile = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/user/`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          const response = await axios.get(`${url}`, {
            headers: {
              Authorization: "Token " + token,
            },
          });

          return {
            props: {
              userProfile: userProfile.data[0],
              stays: response.data.results,
              allStays: allStays.data.results,
              nextLink: response.data.next,
              previousLink: response.data.previous,
              pageSize: response.data.page_size,
              totalPages: response.data.total_pages,
              count: response.data.count,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            stays: response.data.results,
            allStays: allStays.data.results,
            nextLink: response.data.next,
            previousLink: response.data.previous,
            pageSize: response.data.page_size,
            totalPages: response.data.total_pages,
            count: response.data.count,
          },
        };
      } catch (error) {
        if (error.response.status === 401) {
          return {
            redirect: {
              permanent: false,
              destination: "/logout",
            },
          };
        } else {
          return {
            props: {
              userProfile: "",
              stays: [],
              nextLink: "",
              previousLink: "",
              pageSize: 0,
              allStays: [],
              totalPages: 0,
              count: 0,
            },
          };
        }
      }
    }
);

export default Stays;
