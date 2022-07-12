import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";

import getTokenFromReq from "../../lib/getTokenFromReq";
import Navbar from "../../components/Lodging/Navbar";
import { wrapper } from "../../redux/store";
import TransportSearch from "../../components/Home/TransportSearch";
import Popup from "../../components/ui/Popup";
import PriceFilter from "../../components/Lodging/PriceFilter";
import TypeOfActivities from "../../components/Activities/ActivitiesFilterItems";
import styles from "../../styles/Lodging.module.css";
import MobileModal from "../../components/ui/FullScreenMobileModal";
import SearchSelect from "../../components/Home/SearchSelect";
import ClientOnly from "../../components/ClientOnly";
import TransportTypes from "../../components/Transport/TransportTypes";
import MobileTransportTypes from "../../components/Transport/MobileTransportTypes";
import TransportCategories from "../../components/Transport/TransportCategories";
import PopupModal from "../../components/ui/Modal";
import Modal from "../../components/ui/FullScreenMobileModal";
import Listings from "../../components/Transport/Listings";
import FilterTags from "../../components/Transport/FilterTags";
import MobileSearchModal from "../../components/Transport/MobileSearchModal";
import SearchBar from "../../components/Trip/Search";
import Button from "../../components/ui/Button";
import Footer from "../../components/Home/Footer";
import Carousel from "../../components/ui/Carousel";
import { Icon } from "@iconify/react";
import ListItem from "../../components/ui/ListItem";
import Price from "../../components/Stay/Price";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import Switch from "../../components/ui/Switch";
import DatePicker from "../../components/ui/DatePicker";
import moment from "moment";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

const Transport = ({ userProfile, transport }) => {
  const router = useRouter();

  const [state, setState] = useState({
    passengers: 0,
    showPassengerPopup: false,
    currentNavState: 2,
    showNeedADriver: false,
    needADriver: false,
    showTravelersPopup: false,
    showPopup: false,
    showDropdown: false,
    transportDate: "",
    showSearchModal: false,
    showTransportDate: false,
    selectedTransportSearchItem: 0,
    showSortPopup: false,
    showPricePopup: false,
    windowSize: process.browser ? window.innerWidth : 0,
    showTransportTypesPopup: false,
    showFilterPopup: false,
    showMobileFilter: false,

    //health category
    hasAirCondition: false,
    openRoof: false,

    //Entertainment category
    hasFm: false,
    hasCd: false,
    hasBluetooth: false,
    hasAudioInput: false,
    hasCruiseControl: false,

    //Safety category
    hasOverheadPassengerAirbag: false,
    hasSideAirbag: false,
    hasPowerWindows: false,
    hasPowerMirrors: false,
    hasPowerLocks: false,
  });

  const turnOffAllPopup = {
    showDropdown: false,
    showPopup: false,
    showTransportDate: false,
    showPassengerPopup: false,
    showTravelersPopup: false,
    selectedTransportSearchItem: 0,
    showNeedADriver: false,
    showSortPopup: false,
    showPricePopup: false,
    showSearchModal: false,
    showTransportTypesPopup: false,
    showFilterPopup: false,
    showMobileFilter: false,
  };

  const searchRef = useRef();

  const dispatch = useDispatch();

  const currencyToKES = useSelector((state) => state.home.currencyToKES);

  const [typeOfCar, setTypeOfCar] = useState(null);

  const [pickupLocation, setPickupLocation] = useState(
    router.query.search || ""
  );
  const [destinationLocation, setDestinationLocation] = useState(
    router.query.destination || ""
  );
  const [
    autoCompleteFromPickupLocationSearch,
    setAutoCompleteFromPickupLocationSearch,
  ] = useState([]);
  const [
    autoCompleteFromDestinationLocationSearch,
    setAutoCompleteFromDestinationLocationSearch,
  ] = useState([]);

  const [locationLoader, setLocationLoader] = useState(false);

  const locationFromPickupLocationSearch = (item) => {
    setPickupLocation(item.place_name);
    setAutoCompleteFromPickupLocationSearch([]);
  };

  const locationFromDestinationLocationSearch = (item) => {
    setDestinationLocation(item.place_name);
    setAutoCompleteFromDestinationLocationSearch([]);
  };

  const onPickupLocationChange = (event) => {
    setAutoCompleteFromDestinationLocationSearch([]);
    setPickupLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromPickupLocationSearch(response.data.features);
      });
  };

  const onDestinationLocationChange = (event) => {
    setAutoCompleteFromPickupLocationSearch([]);
    setDestinationLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromDestinationLocationSearch(response.data.features);
      });
  };

  const apiTransportSearchResult = () => {
    if (pickupLocation !== "") {
      setLocationLoader(true);
      router
        .push({
          pathname: "/transport",
          query: { search: pickupLocation, destination: destinationLocation },
        })
        .then(() => {
          setLocationLoader(false);
          router.reload();
        });
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromPickupLocationSearch.length > 0) {
        setPickupLocation(autoCompleteFromPickupLocationSearch[0].place_name);

        setAutoCompleteFromPickupLocationSearch([]);

        if (pickupLocation !== "") {
          setLocationLoader(true);
          router
            .push({
              pathname: "/transport",
              query: {
                search: autoCompleteFromPickupLocationSearch[0].place_name,
                destination: destinationLocation,
              },
            })
            .then(() => {
              setLocationLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const onDestinationSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromDestinationLocationSearch.length > 0) {
        setDestinationLocation(
          autoCompleteFromDestinationLocationSearch[0].place_name
        );

        setAutoCompleteFromDestinationLocationSearch([]);

        if (pickupLocation !== "") {
          setLocationLoader(true);
          router
            .push({
              pathname: "/transport",
              query: {
                search: pickupLocation,
                destination:
                  autoCompleteFromDestinationLocationSearch[0].place_name,
              },
            })
            .then(() => {
              setLocationLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [mobileSearchModal, setMobileSearchModal] = useState(false);

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

  const [currentListing, setCurrentListing] = useState(null);

  useEffect(() => {
    if (router.query.transportSlug) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${router.query.transportSlug}/`
        )
        .then((res) => {
          setCurrentListing(res.data);
        })
        .catch(() => {
          setCurrentListing(null);
        });
    }
  }, [router.query.transportSlug]);

  // useEffect(() => {
  //   if (process.browser) {
  //     setState({
  //       ...state,
  //       windowSize: window.innerWidth,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (process.browser) {
  //     window.onresize = function () {
  //       setState({ ...state, windowSize: window.innerWidth });
  //     };
  //   }
  // }, []);

  const filterMinPrice = () => {
    router.push({
      query: {
        ...router.query,
        min_price: minPrice,
        max_price: router.query.max_price || "",
      },
    });
  };

  const filterMaxPrice = () => {
    router.push({
      query: {
        ...router.query,
        min_price: router.query.min_price || "",
        max_price: maxPrice,
      },
    });
  };

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

  // useEffect(() => {
  //   if (router.query.trip) {
  //     checkSlug();
  //   }
  // }, []);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

  const [showBasketPopup, setShowBasketPopup] = useState(false);

  const [needADriver, setNeedADriver] = useState(false);

  const [numberOfDays, setNumberOfDays] = useState(1);

  const [startingDestination, setStartingDestination] = useState("");

  const [startingDate, setStartingDate] = useState(new Date());

  const [showStartingDate, setShowStartingDate] = useState(false);

  const [allowSlideNext, setAllowSlideNext] = useState(false);
  const [swiperIndex, setSwiperIndex] = useState(0);

  const settings = {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const addToBasket = async () => {
    const token = Cookies.get("token");

    setAddToBasketLoading(true);

    if (token) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/${currentListing.slug}/add-to-cart/`,
          {
            starting_point: startingDestination,
            destination: "",
            distance: 0,
            user_need_a_driver: needADriver,
            from_date: startingDate,
            number_of_days: numberOfDays,
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => router.back())
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
          starting_point: startingDestination,
          destination: "",
          distance: 0,
          user_need_a_driver: needADriver,
          from_date: startingDate,
          number_of_days: numberOfDays,
        });
        Cookies.set("cart", JSON.stringify(data));
        router.back();
      }
    }
  };

  return (
    <div
      className={
        "relative " + (currentListing ? "h-screen overflow-y-hidden" : "")
      }
      onClick={() => {
        setState({
          ...state,
          ...turnOffAllPopup,
        });
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b  pb-4">
        <Navbar
          showDropdown={state.showDropdown}
          currentNavState={state.currentNavState}
          userProfile={userProfile}
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
              <span>Where to?</span>
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
                    if (router.query.ordering === "-date_posted") {
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
                    if (router.query.ordering === "+price") {
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
                    if (router.query.ordering === "-price") {
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
          pickupLocation={pickupLocation}
          setPickupLocation={setPickupLocation}
          destinationLocation={destinationLocation}
          setDestinationLocation={setDestinationLocation}
          numOfPeople={state.passengers}
          addTraveler={() => {
            setState({ ...state, passengers: state.passengers + 1 });
          }}
          removeTraveler={() => {
            state.passengers > 0
              ? setState({ ...state, passengers: state.passengers - 1 })
              : null;
          }}
          clearNumOfPeople={() => {
            setState({ ...state, passengers: 0 });
          }}
          searchFilter={apiTransportSearchResult}
          showSearchLoader={locationLoader}
        ></MobileSearchModal>

        <div
          ref={searchRef}
          className="mt-1 hidden w-full md:flex md:justify-center md:px-0 px-4"
        >
          <div className="xl:w-[750px] lg:w-[70%] md:w-[80%]">
            <TransportSearch
              transportDate={state.transportDate}
              showSearchModal={state.showSearchModal}
              apiTransportSearchResult={apiTransportSearchResult}
              changeShowTransportDate={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showTransportDate: !state.showTransportDate,
                  selectedTransportSearchItem: 3,
                });
              }}
              setTransportDate={(date) => {
                setState({ ...state, transportDate: date });
              }}
              showTransportDate={state.showTransportDate}
              showPassengerPopup={state.showPassengerPopup}
              changeShowPassengerPopup={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showPassengerPopup: !state.showPassengerPopup,
                  selectedTransportSearchItem: 4,
                });
              }}
              selectedTransportSearchItem={state.selectedTransportSearchItem}
              clearTransportDate={() => {
                setState({ ...state, transportDate: "" });
              }}
              clearPassengers={() => {
                setState({ ...state, passengers: 0 });
              }}
              passengers={state.passengers}
              addPassenger={() => {
                setState({ ...state, passengers: state.passengers + 1 });
              }}
              removePassenger={() => {
                state.passengers > 0
                  ? setState({ ...state, passengers: state.passengers - 1 })
                  : null;
              }}
              pickupLocation={pickupLocation}
              onPickupLocationChange={(event) => {
                onPickupLocationChange(event);
              }}
              onKeyDown={onKeyDown}
              autoCompleteFromPickupLocationSearch={
                autoCompleteFromPickupLocationSearch
              }
              clearLocationInput={() => {
                setPickupLocation("");
                setAutoCompleteFromPickupLocationSearch([]);
              }}
              locationFromPickupLocationSearch={(item) => {
                locationFromPickupLocationSearch(item);
              }}
              destinationLocation={destinationLocation}
              onDestinationLocationChange={(event) => {
                onDestinationLocationChange(event);
              }}
              onDestinationSearchKeyDown={onDestinationSearchKeyDown}
              autoCompleteFromDestinationLocationSearch={
                autoCompleteFromDestinationLocationSearch
              }
              clearDestinationLocationInput={() => {
                setDestinationLocation("");
                setAutoCompleteFromDestinationLocationSearch([]);
              }}
              locationFromDestinationLocationSearch={(item) => {
                locationFromDestinationLocationSearch(item);
              }}
              locationLoader={locationLoader}
            ></TransportSearch>
          </div>
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
          <div className="px-1">
            <div className="mb-2 mt-2">
              <FilterTags></FilterTags>
            </div>
            <div className="ml-2">
              <div className="mt-2 mb-4 md:hidden">
                <h1 className="font-bold text-base mb-2">Price Range</h1>

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

              <div className="mt-2 mb-4">
                <span className="block font-bold text-base mb-2">
                  All car types
                </span>
                <MobileTransportTypes></MobileTransportTypes>
              </div>

              <TransportCategories></TransportCategories>
            </div>
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
                    pathname: "/transport",
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
                Show all {transport.length} transports
              </Button>
            </div>
          </div>
        </MobileModal>

        <div className="md:flex gap-4 hidden mt-4 ml-4 sm:ml-10">
          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showSortPopup: !state.showSortPopup,
              });
            }}
            className="cursor-pointer hidden relative rounded-md border border-gray-200 py-2 px-2 mr-1 md:mr-4 md:flex gap-1 items-center justify-center"
          >
            <span className="block text-sm">Sort by</span>
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
                  if (router.query.ordering === "-date_posted") {
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
                  if (router.query.ordering === "+price") {
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
                  if (router.query.ordering === "-price") {
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
                <span className="block text-sm">Any Prices</span>
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
              <div className="flex items-center gap-1">
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
              <div className="flex items-center gap-2">
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
              className="absolute top-full mt-2 w-[450px] -left-10 px-2"
              showPopup={state.showPricePopup}
            >
              <h1 className="font-bold text-base mb-2 text-gray-600">
                Price Range
              </h1>
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
            </Popup>
          </div>

          {/* <div className="hidden md:block">
            <TransportTypes
              handlePopup={() => {
                setState({
                  ...state,
                  ...turnOffAllPopup,
                  showTransportTypesPopup: !state.showTransportTypesPopup,
                });
              }}
              showTransportTypesPopup={state.showTransportTypesPopup}
            ></TransportTypes>
          </div> */}
        </div>
      </div>

      <div className="flex md:flex-row flex-col relative justify-around h-full w-full">
        <div className="mb-2 block md:hidden mt-[150px] px-4">
          <FilterTags></FilterTags>
        </div>
        <div className="relative hidden md:block md:w-[30%] lg:w-[20%] h-screen top-[180px] overflow-y-auto bg-white border-r border-gray-100">
          <div className="px-4">
            <h1 className="my-3 font-bold text-lg">Filter results</h1>
            <div className="mb-2">
              <FilterTags></FilterTags>
            </div>
            <div className="ml-2">
              <div className="mt-2 mb-4 md:hidden">
                <h1 className="font-bold text-base mb-2">Price Range</h1>
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

              <div className="mt-2 mb-4">
                <span className="block font-bold text-base mb-2">
                  All car types
                </span>
                <MobileTransportTypes></MobileTransportTypes>
              </div>

              <TransportCategories></TransportCategories>
            </div>
          </div>
        </div>

        <div className="relative h-full md:h-screen overflow-y-auto md:top-56 md:px-4 md:w-[68%] lg:w-[78%]">
          <Listings
            setCurrentListing={setCurrentListing}
            userProfile={userProfile}
            transports={transport}
            slugIsCorrect={slugIsCorrect}
          ></Listings>
        </div>
      </div>

      <div className="hidden md:block">
        <PopupModal
          showModal={
            currentListing && router.query.transportSlug ? true : false
          }
          closeModal={() => {
            setCurrentListing(null);
            router.replace({
              query: {
                ...router.query,
                transportSlug: "",
              },
            });
          }}
          // className="absolute -left-[410px] -top-[250px] px-4 py-4 !z-[99] w-[400px] bg-white shadow-lg rounded-lg h-fit"
          className="max-w-[600px] !top-[10%] !py-2 !pt-4 h-[600px]"
        >
          <Swiper
            {...settings}
            preventInteractionOnTransition={true}
            allowTouchMove={false}
            autoHeight={true}
            onSwiper={(swiper) => setAllowSlideNext(swiper.allowSlideNext)}
            onSlideChange={(swiper) => setSwiperIndex(swiper.realIndex)}
            className="!h-full !w-full !overflow-y-scroll remove-scroll"
          >
            <SwiperSlide className="!relative">
              {currentListing && (
                <>
                  <div className="h-[200px] relative">
                    <div className="px-2 py-0.5 rounded-full text-sm z-10 bg-blue-300 absolute left-3 bottom-3">
                      or similar
                    </div>
                    <Carousel
                      images={currentListing.transportation_images
                        .sort((x, y) => y.main - x.main)
                        .map((image) => {
                          return image.image;
                        })}
                      imageClass="rounded-tl-md rounded-tr-2xl"
                    ></Carousel>
                  </div>

                  <div className="mt-2 mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-lg font-semibold w-full text-gray-700 truncate">
                        {currentListing.vehicle_make}
                      </div>

                      <div className="flex">
                        <Price stayPrice={currentListing.price_per_day}></Price>
                        <div className="text-xs mt-2">/day</div>
                      </div>
                    </div>

                    <div className="text-sm ml-1 capitalize font-bold">
                      {currentListing.type_of_car.toLowerCase()}
                    </div>

                    <div className="py-2 border-t border-b border-gray-400 px-2 my-2 text-sm text-gray-600 flex justify-between items-center">
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="carbon:user-filled" />
                        <p>{currentListing.capacity}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="bi:bag-fill" />
                        <p>{currentListing.bags}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon
                          className="w-4 h-4"
                          icon="icon-park-solid:manual-gear"
                        />
                        <p className="capitalize">
                          {currentListing.transmission.toLowerCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon
                          className="w-4 h-4"
                          icon="ic:baseline-severe-cold"
                        />
                        <p className="capitalize">
                          {currentListing.has_air_condition ? "AC" : "No AC"}
                        </p>
                      </div>
                    </div>

                    {currentListing.driver_operates_within.length > 0 && (
                      <h1 className="font-bold text-lg mb-2">
                        Car operates within
                      </h1>
                    )}
                    {currentListing.driver_operates_within.map(
                      (item, index) => (
                        <ListItem key={index}>{item.city}</ListItem>
                      )
                    )}

                    {currentListing.included_in_price.length > 0 && (
                      <h1 className="font-bold text-lg mb-2 mt-4">
                        Included in price
                      </h1>
                    )}
                    {currentListing.included_in_price.map((item, index) => (
                      <ListItem key={index}>{item.included_in_price}</ListItem>
                    ))}

                    {currentListing.policy && (
                      <h1 className="mt-4 font-bold">Please take note</h1>
                    )}

                    {currentListing.policy && (
                      <p className="mt-2">{currentListing.policy}</p>
                    )}
                  </div>

                  <div
                    className={
                      "w-full sticky z-10 flex gap-2 bottom-10 !-mr-4 !-ml-4 !-mb-16 left-0 right-0 bg-gray-100 border-t border-gray-200 "
                    }
                  >
                    {slugIsCorrect && (
                      <Button className="flex w-full items-center gap-1 !px-0 !py-1.5 font-bold !bg-blue-500 border-2 border-blue-500 !text-white">
                        <span>Add to trip</span>
                      </Button>
                    )}
                    <Button
                      // onClick={setShowBasketPopup(true)}
                      className={
                        "flex w-full swiper-pagination swiper-button-next items-center gap-1 !px-0 !py-1.5 font-bold border-2 border-blue-500 " +
                        (slugIsCorrect
                          ? "!bg-transparent !text-black"
                          : "!bg-blue-500 !text-white")
                      }
                    >
                      <span>Add to basket</span>
                    </Button>
                  </div>
                </>
              )}
            </SwiperSlide>

            <SwiperSlide className="!w-full">
              {currentListing && (
                <>
                  <div className="swiper-pagination bg-white swiper-button-prev cursor-pointer flex items-center gap-1">
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

                  <div className={"!w-full mt-8 remove-scroll"}>
                    <div className="!mt-6 !h-full">
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
                          <h1 className="font-bold mb-2">
                            Car operates within
                          </h1>
                          <div className="flex flex-wrap">
                            {currentListing.driver_operates_within.map(
                              (location, index) => (
                                <div
                                  key={index}
                                  className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                                >
                                  {location.city}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div className="mt-4 ml-4 relative">
                          <div className="flex gap-1 items-center">
                            <span className="font-bold">
                              Select a starting date
                            </span>
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
                          <div className="mb-1 font-semibold">
                            Do you need a driver?
                          </div>
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

                        <div className="my-4">
                          <div className="flex items-center justify-between">
                            <div className="font-bold">Total cost</div>
                            <Price
                              stayPrice={
                                currentListing.price_per_day * numberOfDays +
                                (needADriver
                                  ? currentListing.additional_price_with_a_driver
                                  : 0)
                              }
                              className="text-lg"
                            ></Price>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 gap-2">
                          <Button
                            onClick={() => {
                              addToBasket();
                            }}
                            disabled={!startingDestination}
                            className={
                              "flex w-full !bg-blue-500 swiper-pagination swiper-button-next items-center gap-1 !px-0 !py-1.5 font-bold border-2 border-blue-500 " +
                              (!startingDestination
                                ? "opacity-50 cursor-not-allowed"
                                : "")
                            }
                          >
                            Add
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
                  </div>
                </>
              )}
            </SwiperSlide>
          </Swiper>
        </PopupModal>
      </div>

      <div className="md:hidden !relative">
        <Modal
          showModal={
            currentListing && router.query.transportSlug ? true : false
          }
          closeModal={() => {
            setCurrentListing(null);
            router.replace({
              query: {
                ...router.query,
                transportSlug: "",
              },
            });
          }}
          // className="absolute -left-[410px] -top-[250px] px-4 py-4 !z-[99] w-[400px] bg-white shadow-lg rounded-lg h-fit"
          className="remove-scroll !overflow-y-scroll"
          title={"Transport detail"}
        >
          <Swiper
            {...settings}
            autoHeight={true}
            preventInteractionOnTransition={true}
            allowTouchMove={false}
            onSwiper={(swiper) => setAllowSlideNext(swiper.allowSlideNext)}
            onSlideChange={(swiper) => setSwiperIndex(swiper.realIndex)}
            className="!h-full !w-full !overflow-y-scroll remove-scroll"
          >
            <SwiperSlide className="">
              {currentListing && (
                <div className="px-3">
                  <div className="h-[200px] relative">
                    <div className="px-2 py-0.5 rounded-full text-sm z-10 bg-blue-300 absolute left-3 bottom-3">
                      or similar
                    </div>
                    <Carousel
                      images={currentListing.transportation_images
                        .sort((x, y) => y.main - x.main)
                        .map((image) => {
                          return image.image;
                        })}
                      imageClass="rounded-tl-md rounded-tr-2xl"
                    ></Carousel>
                  </div>

                  <div className="mt-2 mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-lg font-semibold w-full text-gray-700 truncate">
                        {currentListing.vehicle_make}
                      </div>

                      <div className="flex">
                        <Price stayPrice={currentListing.price_per_day}></Price>
                        <div className="text-xs mt-2">/day</div>
                      </div>
                    </div>

                    <div className="text-sm ml-1 capitalize font-bold">
                      {currentListing.type_of_car.toLowerCase()}
                    </div>

                    <div className="py-2 border-t border-b border-gray-400 px-2 my-2 text-sm text-gray-600 flex justify-between items-center">
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="carbon:user-filled" />
                        <p>{currentListing.capacity}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="bi:bag-fill" />
                        <p>{currentListing.bags}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon
                          className="w-4 h-4"
                          icon="icon-park-solid:manual-gear"
                        />
                        <p className="capitalize">
                          {currentListing.transmission.toLowerCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon
                          className="w-4 h-4"
                          icon="ic:baseline-severe-cold"
                        />
                        <p className="capitalize">
                          {currentListing.has_air_condition ? "AC" : "No AC"}
                        </p>
                      </div>
                    </div>

                    {currentListing.driver_operates_within.length > 0 && (
                      <h1 className="font-bold text-lg mb-2">
                        Car operates within
                      </h1>
                    )}
                    {currentListing.driver_operates_within.map(
                      (item, index) => (
                        <ListItem key={index}>{item.city}</ListItem>
                      )
                    )}

                    {currentListing.included_in_price.length > 0 && (
                      <h1 className="font-bold text-lg mb-2 mt-4">
                        Included in price
                      </h1>
                    )}
                    {currentListing.included_in_price.map((item, index) => (
                      <ListItem key={index}>{item.included_in_price}</ListItem>
                    ))}

                    {currentListing.policy && (
                      <h1 className="mt-4 font-bold">Please take note</h1>
                    )}

                    {currentListing.policy && (
                      <p className="mt-2">{currentListing.policy}</p>
                    )}
                  </div>

                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Ipsa, quam dignissimos facere rerum odit fugit voluptas
                    explicabo error voluptate blanditiis enim sunt quibusdam
                    provident. Amet, porro. Officiis animi dolores hic? Vel est
                    harum commodi, praesentium, ex quas hic ea cumque qui ad
                    vero, minima nemo earum dolorem architecto sit dolores fugit
                    voluptatibus veniam explicabo blanditiis! Delectus totam
                    quod eius ut? Dignissimos consequatur doloribus quaerat
                    reprehenderit? Rem perferendis quaerat doloribus rerum
                    exercitationem iusto voluptatum culpa debitis, beatae quo,
                    inventore quibusdam. Velit illum cum doloremque ea
                    molestias, tempore perspiciatis labore maiores ipsa.
                    Cupiditate illum, minima, distinctio reiciendis odio
                    veritatis perferendis quisquam ullam velit eaque officia,
                    incidunt odit voluptatibus est quasi illo! Tenetur harum
                    ullam amet magni nesciunt veritatis optio ratione,
                    aspernatur libero? Voluptates, in accusantium, modi cumque
                    ipsa vitae beatae est unde, alias dolore aperiam amet
                    tempora dolorem magnam porro. Harum repudiandae alias,
                    similique hic nostrum id aperiam. Quod, doloribus quo.
                    Error.
                  </div>
                </div>
              )}

              <div
                className={
                  "w-full sticky z-10 flex gap-2 bottom-10 !-mb-16 left-0 right-0 bg-gray-100 border-t border-gray-200 "
                }
              >
                {slugIsCorrect && (
                  <Button className="flex w-full items-center gap-1 !px-0 !py-1.5 font-bold !bg-blue-500 border-2 border-blue-500 !text-white">
                    <span>Add to trip</span>
                  </Button>
                )}
                <Button
                  // onClick={setShowBasketPopup(true)}
                  className={
                    "flex w-full swiper-pagination swiper-button-next items-center gap-1 !px-0 !py-1.5 font-bold border-2 border-blue-500 " +
                    (slugIsCorrect
                      ? "!bg-transparent !text-black"
                      : "!bg-blue-500 !text-white")
                  }
                >
                  <span>Add to basket</span>
                </Button>
              </div>
            </SwiperSlide>

            <SwiperSlide className="!w-full">
              {currentListing && (
                <div className="px-4">
                  <div className="swiper-pagination bg-white swiper-button-prev cursor-pointer flex items-center gap-1 mb-8">
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

                  <div className={"!w-full mt-6 remove-scroll"}>
                    <div className="!mt-6 !h-full">
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
                          <h1 className="font-bold mb-2">
                            Car operates within
                          </h1>
                          <div className="flex flex-wrap">
                            {currentListing.driver_operates_within.map(
                              (location, index) => (
                                <div
                                  key={index}
                                  className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                                >
                                  {location.city}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div className="mt-4 ml-4 relative">
                          <div className="flex gap-1 items-center">
                            <span className="font-bold">
                              Select a starting date
                            </span>
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
                          <div className="mb-1 font-semibold">
                            Do you need a driver?
                          </div>
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

                        <div className="my-4">
                          <div className="flex items-center justify-between">
                            <div className="font-bold">Total cost</div>
                            <Price
                              stayPrice={
                                currentListing.price_per_day * numberOfDays +
                                (needADriver
                                  ? currentListing.additional_price_with_a_driver
                                  : 0)
                              }
                              className="text-lg"
                            ></Price>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 gap-2">
                          <Button
                            onClick={() => {
                              addToBasket();
                            }}
                            disabled={!startingDestination}
                            className={
                              "flex w-full !bg-blue-500 swiper-pagination swiper-button-next items-center gap-1 !px-0 !py-1.5 font-bold border-2 border-blue-500 " +
                              (!startingDestination
                                ? "opacity-50 cursor-not-allowed"
                                : "")
                            }
                          >
                            Add
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
                  </div>
                </div>
              )}
            </SwiperSlide>
          </Swiper>
        </Modal>
      </div>

      <div className="mt-12 md:hidden">
        <Footer></Footer>
      </div>
    </div>
  );
};

Transport.propTypes = {};

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query, resolvedUrl }) => {
      try {
        const token = getTokenFromReq(req);

        const transport = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/?min_price=${
            query.min_price ? query.min_price : ""
          }&max_price=${query.max_price ? query.max_price : ""}&ordering=${
            query.ordering ? query.ordering : ""
          }&type_of_car=${query.type_of_car ? query.type_of_car : ""}`
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

          const transport = await axios.get(
            `${process.env.NEXT_PUBLIC_baseURL}/transport/?min_price=${
              query.min_price ? query.min_price : ""
            }&max_price=${query.max_price ? query.max_price : ""}&ordering=${
              query.ordering ? query.ordering : ""
            }&type_of_car=${query.type_of_car ? query.type_of_car : ""}`,
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          );

          return {
            props: {
              userProfile: response.data[0],
              transport: transport.data.results,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            transport: transport.data.results,
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
              transport: [],
            },
          };
        }
      }
    }
);

export default Transport;
