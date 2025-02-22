import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { Swiper, SwiperSlide } from "swiper/react";
import ReactPaginate from "react-paginate";
import { Navigation } from "swiper";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";

import getTokenFromReq from "../../lib/getTokenFromReq";
import Navbar from "../../components/Lodging/Navbar";
import { wrapper } from "../../redux/store";
import Popup from "../../components/ui/Popup";
import styles from "../../styles/Lodging.module.css";
import MobileModal from "../../components/ui/FullScreenMobileModal";
import MobileTransportTypes from "../../components/Transport/MobileTransportTypes";
import TransportCategories from "../../components/Transport/TransportCategories";
import Listings from "../../components/Transport/Listings";
import FilterTags from "../../components/Transport/FilterTags";
import SearchBar from "../../components/Trip/Search";
import Button from "../../components/ui/Button";
import Footer from "../../components/Home/Footer";
import Carousel from "../../components/ui/Carousel";
import {
  startingLocationOptions,
  destinationLocationOptions,
  destinationLocationOptionsForZanzibar,
  destinationLocationOptionsForMaasaiMara,
  checkFlightPrice,
  flightTypes,
} from "../../lib/flightLocations";
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
import Dialogue from "../../components/Home/Dialogue";
import Link from "next/link";

const Transport = ({
  userProfile,
  transport,
  pageSize,
  count,
  nextLink,
  previousLink,
  totalPages,
}) => {
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
    showTypeOfCar: false,
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
    showTypeOfCar: false,
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

  const [slugIsCorrectForGroupTrip, setSlugIsCorrectForGroupTrip] =
    useState(false);

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

  const checkGroupTripSlug = async () => {
    const token = Cookies.get("token");

    if (token) {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_baseURL}/trips/${router.query.group_trip}/`,
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then((res) => {
          setSlugIsCorrectForGroupTrip(true);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setSlugIsCorrectForGroupTrip(false);
          }
        });
    } else {
      setSlugIsCorrectForGroupTrip(false);
    }
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
    if (router.query.group_trip) {
      checkGroupTripSlug();
    }
  }, []);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

  const [showBasketPopup, setShowBasketPopup] = useState(false);

  const [needADriver, setNeedADriver] = useState(false);

  const [numberOfDays, setNumberOfDays] = useState(1);

  const [startingDestination, setStartingDestination] = useState("");

  const [startingDate, setStartingDate] = useState(new Date());

  const [showStartingDate, setShowStartingDate] = useState(false);

  const [flightPopup, setFlightPopup] = useState(false);

  const [selectedFlightStartingLocation, setSelectedFlightStartingLocation] =
    useState({
      value: "Nairobi",
      label: "Nairobi",
    });

  const [selectedFlightType, setSelectedFlightType] = useState({
    value: "ONE WAY",
    label: "One way",
  });

  const [selectedFlightDestination, setSelectedFlightDestination] =
    useState(null);

  const flightPrice = checkFlightPrice(
    selectedFlightStartingLocation ? selectedFlightStartingLocation.value : "",
    selectedFlightDestination ? selectedFlightDestination.value : "",
    selectedFlightType ? selectedFlightType.value : ""
  );

  const checkDestinationLocations =
    selectedFlightStartingLocation.value == "Nairobi"
      ? destinationLocationOptions
      : selectedFlightStartingLocation.value == "Zanzibar"
      ? destinationLocationOptionsForZanzibar
      : selectedFlightStartingLocation.value == "Maasai Mara"
      ? destinationLocationOptionsForMaasaiMara
      : [];

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

  const addToBasket = async (type = "") => {
    const token = Cookies.get("token");

    setAddToBasketLoading(true);

    if (type === "flight") {
      if (token) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
            {
              starting_point: selectedFlightStartingLocation.value,
              destination: selectedFlightDestination.value,
              number_of_people: numberOfPeopleInFlight,
              flight_types: selectedFlightType.value,
            },
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => router.reload())
          .catch((err) => {});
      } else if (!token) {
        let cookieVal = Cookies.get("cart");

        if (cookieVal !== undefined) {
          cookieVal = JSON.parse(cookieVal);
        }

        const data = [...(cookieVal || [])];
        data.push({
          itemCategory: "flight",
          slug: uuidv4(),
          starting_point: selectedFlightStartingLocation.value,
          destination: selectedFlightDestination.value,
          number_of_people: numberOfPeopleInFlight,
          flight_types: selectedFlightType.value,
        });
        Cookies.set("cart", JSON.stringify(data));
        router.reload();
      }
    } else {
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
          .then(() => router.reload())
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
          return val.slug === currentListing.slug;
        });
        if (!exist) {
          data.push({
            slug: currentListing.slug,
            itemCategory: "transport",
            starting_point: startingDestination,
            destination: "",
            distance: 0,
            user_need_a_driver: needADriver,
            from_date: startingDate,
            number_of_days: numberOfDays,
          });
          Cookies.set("cart", JSON.stringify(data));
          router.reload();
        }
      }
    }
  };

  const [swiper, setSwiper] = useState(null);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const [showGeneralTransfersPopup, setShowGeneralTransfersPopup] =
    useState(false);

  const [numberOfPeopleInFlight, setNumberOfPeopleInFlight] = useState(1);

  const addToTrip = async (type = "") => {
    const token = Cookies.get("token");

    setAddToTripLoading(true);

    if (type === "flight") {
      if (token) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/flights/`,
            {
              starting_point: selectedFlightStartingLocation.value,
              destination: selectedFlightDestination.value,
              number_of_people: numberOfPeopleInFlight,
              flight_types: selectedFlightType.value,
            },
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then((res) => {
            axios
              .put(
                `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
                {
                  transport_id: null,
                  flight_id: res.data.id,
                  // transport_number_of_days: 1,
                  transport_from_date: null,
                  user_need_a_driver: false,
                  starting_point: null,
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
          })
          .catch((err) => {
            setAddToTripLoading(false);
          });
      }
    } else {
      if (token) {
        await axios
          .put(
            `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
            {
              transport_id: currentListing.id,
              flight_id: null,
              transport_number_of_days: 1,
              transport_from_date: null,
              user_need_a_driver: false,
              starting_point: null,
            },
            {
              headers: {
                Authorization: "Token " + token,
              },
            }
          )
          .then(() => {
            if (router.query.flight) {
              axios
                .delete(
                  `${process.env.NEXT_PUBLIC_baseURL}/flights/${router.query.flight}/`,
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
            } else {
              router.push({
                pathname: `/trip/plan/${router.query.group_trip}`,
              });
            }
          })
          .catch((err) => {
            setAddToTripLoading(false);
          });
      }
    }
  };

  return (
    <div
      className={"relative overflow-x-hidden md:overflow-x-visible "}
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
          isTransport={true}
          setFlightPopup={setFlightPopup}
        ></Navbar>

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

        <div className="flex gap-2 sm:gap-4 mt-4 ml-4 sm:ml-10">
          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showSortPopup: !state.showSortPopup,
              });
            }}
            className="cursor-pointer relative rounded-md border border-gray-200 py-1 px-1 sm:py-2 sm:px-2 mr-1 md:mr-4 flex sm:gap-1 items-center justify-center"
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
                  (router.query.ordering === "+price_per_day"
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
                  if (router.query.ordering === "+price_per_day") {
                    router.push({ query: { ...router.query, ordering: "" } });
                  } else {
                    router.push({
                      query: { ...router.query, ordering: "+price_per_day" },
                    });
                  }
                }}
              >
                Price(min to max)
              </div>
              <div
                className={
                  styles.listItem +
                  (router.query.ordering === "-price_per_day"
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
                  if (router.query.ordering === "-price_per_day") {
                    router.push({ query: { ...router.query, ordering: "" } });
                  } else {
                    router.push({
                      query: { ...router.query, ordering: "-price_per_day" },
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
            className="bg-gray-100 block relative cursor-pointer rounded-md border border-gray-200 py-1 px-1 sm:py-2 sm:px-2"
          >
            {!minPrice && !maxPrice && (
              <div className="flex sm:gap-1 items-center justify-center">
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
              className="absolute top-full mt-2 xssMax:w-[250px] w-[338px] sm:w-[450px] -left-20 sm:-left-10 px-2"
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
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showTypeOfCar: !state.showTypeOfCar,
              });
            }}
            className="bg-gray-100 block md:hidden relative cursor-pointer rounded-md border border-gray-200 py-1 px-1 sm:py-2 sm:px-2"
          >
            <div className="flex sm:gap-1 items-center justify-center">
              <span className="block text-sm">Types</span>
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

            <Popup
              className="absolute top-full mt-2 w-[240px] -left-36 sm:-left-14 px-2"
              showPopup={state.showTypeOfCar}
            >
              <h1 className="font-bold text-base mb-2 text-gray-600">
                Type of car
              </h1>
              <div>
                <MobileTransportTypes></MobileTransportTypes>
              </div>
            </Popup>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col relative justify-around h-full w-full">
        <div className="mb-2 block md:hidden mt-[150px] px-4">
          <FilterTags></FilterTags>
        </div>
        <div className="fixed hidden md:block md:w-[30%] lg:w-[20%] h-full top-[170px] bottom-0 left-0 overflow-y-scroll bg-white border-r border-gray-100">
          <div className="px-4">
            {/* <h1 className="my-3 font-bold text-lg">Filter results</h1> */}
            <div className="mb-1">
              <FilterTags></FilterTags>
            </div>
            <div className="ml-2">
              {/* <div className="mt-2 mb-4 md:hidden">
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
              </div> */}
              <div className="mt-2 mb-4">
                <span className="block font-bold text-base mb-2">
                  All car types
                </span>
                <MobileTransportTypes></MobileTransportTypes>
              </div>
              {/* this is required to prevent the scrollbar from hiding the content */}
              <div className="py-20"></div>

              <div className="fixed bottom-2 md:w-[30%] lg:w-[20%] flex flex-col gap-1 items-center justify-center left-0 right-0 p-2 w-full">
                <Button
                  onClick={() => {
                    setFlightPopup(true);
                  }}
                  className="flex items-center gap-2 !w-full !py-3 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                >
                  <span className="font-bold">Book for a flight</span>
                  <Icon icon="fa6-solid:plane" />
                </Button>

                {/* <Button
                  onClick={() => {
                    setShowGeneralTransfersPopup(true);
                  }}
                  className="flex items-center gap-2 !w-full !py-3 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                >
                  <span className="font-bold">General transfers</span>
                  <Icon icon="fa6-solid:plane" />
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        {/* absolute h-full right-0 md:top-[170px] md:px-4 md:w-[68%] lg:w-[78%] */}

        <div className=" md:absolute h-full right-0 top-[170px] md:px-4 w-full md:w-[68%] lg:w-[78%]">
          <Listings
            setCurrentListing={setCurrentListing}
            userProfile={userProfile}
            transports={transport}
            slugIsCorrect={slugIsCorrect}
            slugIsCorrectForGroupTrip={slugIsCorrectForGroupTrip}
          ></Listings>

          {transport.length > 0 && (
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

          <div className="mt-6 md:-ml-10 md:-mr-4">
            <Footer></Footer>
          </div>
        </div>
      </div>

      <Dialogue
        isOpen={showGeneralTransfersPopup}
        closeModal={() => {
          setShowGeneralTransfersPopup(false);
        }}
        dialoguePanelClassName="relative overflow-y-scroll remove-scroll !relative max-w-[550px] !p-4 !top-[10%] md:max-h-[420px]"
        outsideDialogueClass="!p-3"
        title={"Book for a ground transfer"}
        dialogueTitleClassName="!font-bold !text-xl"
      >
        <div className="flex flex-col w-full mt-3">
          <Select
            defaultValue={selectedFlightStartingLocation}
            onChange={(value) => {
              setSelectedFlightStartingLocation(value);
              setSelectedFlightDestination(null);
            }}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={startingLocationOptions}
            placeholder="Select a starting locations"
            options={startingLocationOptions}
            isSearchable={true}
          />

          <div className="w-[50%] h-[30px] flex flex-col gap-1.5">
            <div className="h-[46%] w-full border-r border-gray-400"></div>
            <div className="h-[8%] relative flex items-center justify-end">
              <Icon
                icon="bxs:plane"
                className="text-gray-400 w-3 h-3 absolute -right-1.5 rotate-180"
              />
            </div>
            <div className="h-[46%] w-full border-r border-gray-400"></div>
          </div>
          <Select
            defaultValue={selectedFlightDestination}
            onChange={(value) => {
              setSelectedFlightDestination(value);
            }}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={checkDestinationLocations}
            placeholder="Select a destination"
            options={checkDestinationLocations}
            isSearchable={true}
          />
        </div>

        <div className="mt-5">
          <Select
            defaultValue={selectedFlightType}
            onChange={(value) => {
              setSelectedFlightType(value);
            }}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={flightTypes}
            placeholder="Select flight type"
            options={flightTypes}
            isSearchable={true}
          />
        </div>

        <div className="mb-2 mt-4 font-bold">Number of passengers</div>
        <div className="flex items-center gap-2 ">
          <div
            onClick={() => {
              if (numberOfPeopleInFlight > 1) {
                setNumberOfPeopleInFlight(numberOfPeopleInFlight - 1);
              }
            }}
            className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
          >
            {" "}
            -{" "}
          </div>

          <div className="text-sm font-bold">
            {numberOfPeopleInFlight}{" "}
            {numberOfPeopleInFlight > 1 ? "People" : "Person"}
          </div>
          <div
            onClick={() => {
              setNumberOfPeopleInFlight(numberOfPeopleInFlight + 1);
            }}
            className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
          >
            +
          </div>
        </div>

        {flightPrice && (
          <div className="mt-4 text-gray-700 text-sm">
            The flight from{" "}
            <span className="font-semibold">
              {selectedFlightStartingLocation &&
                selectedFlightStartingLocation.value}{" "}
            </span>
            to{" "}
            <span className="font-semibold">
              {selectedFlightDestination && selectedFlightDestination.value}{" "}
            </span>
            with{" "}
            <span className="font-semibold">
              {numberOfPeopleInFlight}{" "}
              {numberOfPeopleInFlight > 1 ? "people" : "person"}
            </span>{" "}
            will cost{" "}
            <span className="font-semibold">
              <Price
                stayPrice={flightPrice * numberOfPeopleInFlight}
                className="!text-sm inline"
              ></Price>
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {slugIsCorrect && !router.query.flight && (
            <button
              onClick={() => {
                addToTrip("flight");
              }}
              disabled={
                !selectedFlightStartingLocation || !selectedFlightDestination
              }
              className={
                "bg-blue-500 h-10 w-full flex items-center justify-center bottom-0 mt-3 left-0 right-0 " +
                (selectedFlightStartingLocation &&
                selectedFlightStartingLocation.value &&
                selectedFlightDestination &&
                selectedFlightDestination.value
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50")
              }
            >
              <span className="font-semibold text-sm text-white">
                Add to trip
              </span>
              <div className={" " + (!addToTripLoading ? "hidden" : "ml-2")}>
                <LoadingSpinerChase
                  width={16}
                  height={16}
                  color="#fff"
                ></LoadingSpinerChase>
              </div>
            </button>
          )}

          <button
            onClick={() => {
              addToBasket("flight");
            }}
            disabled={
              !selectedFlightStartingLocation || !selectedFlightDestination
            }
            className={
              "h-10 w-full flex items-center justify-center bottom-0 mt-3 left-0 right-0 bg-blue-500 " +
              (selectedFlightStartingLocation &&
              selectedFlightStartingLocation.value &&
              selectedFlightDestination &&
              selectedFlightDestination.value
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50")
            }
          >
            <span className="font-semibold text-sm text-white">Book now</span>
            <div className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}>
              <LoadingSpinerChase
                width={16}
                height={16}
                color="#fff"
              ></LoadingSpinerChase>
            </div>
          </button>
        </div>
      </Dialogue>

      <Dialogue
        isOpen={flightPopup}
        closeModal={() => {
          setFlightPopup(false);
        }}
        dialoguePanelClassName="relative overflow-y-scroll remove-scroll !relative max-w-[550px] !p-4 !top-[10%] md:max-h-[420px]"
        outsideDialogueClass="!p-3"
        title={"Book for a flight"}
        dialogueTitleClassName="!font-bold !text-xl"
      >
        <div className="flex flex-col w-full mt-3">
          <Select
            defaultValue={selectedFlightStartingLocation}
            onChange={(value) => {
              setSelectedFlightStartingLocation(value);
              setSelectedFlightDestination(null);
            }}
            value={selectedFlightStartingLocation}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={startingLocationOptions}
            placeholder="Select a starting location"
            options={startingLocationOptions}
            isSearchable={true}
          />

          <div className="w-[50%] h-[30px] flex flex-col gap-1.5">
            <div className="h-[46%] w-full border-r border-gray-400"></div>
            <div className="h-[8%] relative flex items-center justify-end">
              <Icon
                icon="bxs:plane"
                className="text-gray-400 w-3 h-3 absolute -right-1.5 rotate-180"
              />
            </div>
            <div className="h-[46%] w-full border-r border-gray-400"></div>
          </div>
          <Select
            defaultValue={selectedFlightDestination}
            onChange={(value) => {
              setSelectedFlightDestination(value);
            }}
            value={selectedFlightDestination}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={checkDestinationLocations}
            placeholder="Select a destination"
            options={checkDestinationLocations}
            isSearchable={true}
          />
        </div>

        <div className="mt-5">
          <Select
            defaultValue={selectedFlightType}
            onChange={(value) => {
              setSelectedFlightType(value);
            }}
            className={"text-sm outline-none border border-gray-500 "}
            instanceId={flightTypes}
            placeholder="Select flight type"
            options={flightTypes}
            isSearchable={true}
          />
        </div>

        <div className="mb-2 mt-4 font-bold">Number of passengers</div>
        <div className="flex items-center gap-2 ">
          <div
            onClick={() => {
              if (numberOfPeopleInFlight > 1) {
                setNumberOfPeopleInFlight(numberOfPeopleInFlight - 1);
              }
            }}
            className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
          >
            {" "}
            -{" "}
          </div>

          <div className="text-sm font-bold">
            {numberOfPeopleInFlight}{" "}
            {numberOfPeopleInFlight > 1 ? "People" : "Person"}
          </div>
          <div
            onClick={() => {
              setNumberOfPeopleInFlight(numberOfPeopleInFlight + 1);
            }}
            className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
          >
            +
          </div>
        </div>

        {flightPrice && (
          <div className="mt-4 text-gray-700 text-sm">
            The flight from{" "}
            <span className="font-semibold">
              {selectedFlightStartingLocation &&
                selectedFlightStartingLocation.value}{" "}
            </span>
            to{" "}
            <span className="font-semibold">
              {selectedFlightDestination && selectedFlightDestination.value}{" "}
            </span>
            with{" "}
            <span className="font-semibold">
              {numberOfPeopleInFlight}{" "}
              {numberOfPeopleInFlight > 1 ? "people" : "person"}
            </span>{" "}
            will cost{" "}
            <span className="font-semibold">
              <Price
                stayPrice={flightPrice * numberOfPeopleInFlight}
                className="!text-sm inline"
              ></Price>
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {slugIsCorrect && !router.query.flight && (
            <button
              onClick={() => {
                addToTrip("flight");
              }}
              disabled={
                !selectedFlightStartingLocation || !selectedFlightDestination
              }
              className={
                "bg-blue-500 h-10 w-full flex items-center justify-center bottom-0 mt-3 left-0 right-0 " +
                (selectedFlightStartingLocation &&
                selectedFlightStartingLocation.value &&
                selectedFlightDestination &&
                selectedFlightDestination.value
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50")
              }
            >
              <span className="font-semibold text-sm text-white">
                Add to trip
              </span>
              <div className={" " + (!addToTripLoading ? "hidden" : "ml-2")}>
                <LoadingSpinerChase
                  width={16}
                  height={16}
                  color="#fff"
                ></LoadingSpinerChase>
              </div>
            </button>
          )}

          <button
            onClick={() => {
              addToBasket("flight");
            }}
            disabled={
              !selectedFlightStartingLocation || !selectedFlightDestination
            }
            className={
              "h-10 w-full flex items-center justify-center bottom-0 mt-3 left-0 right-0 bg-blue-500 " +
              (selectedFlightStartingLocation &&
              selectedFlightStartingLocation.value &&
              selectedFlightDestination &&
              selectedFlightDestination.value
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50")
            }
          >
            <span className="font-semibold text-sm text-white">Book now</span>
            <div className={" " + (!addToBasketLoading ? "hidden" : "ml-2")}>
              <LoadingSpinerChase
                width={16}
                height={16}
                color="#fff"
              ></LoadingSpinerChase>
            </div>
          </button>
        </div>
      </Dialogue>

      <Dialogue
        isOpen={currentListing && router.query.transportSlug ? true : false}
        closeModal={() => {
          setCurrentListing(null);
          router.replace({
            query: {
              ...router.query,
              transportSlug: "",
            },
          });
        }}
        dialoguePanelClassName="h-[85vh] !relative max-w-[600px] !top-[10%] !p-0 md:max-h-[550px]"
        outsideDialogueClass="!p-3"
      >
        <Swiper
          {...settings}
          preventInteractionOnTransition={true}
          allowTouchMove={false}
          onSwiper={(swiper) => {
            setSwiper(swiper);
            setAllowSlideNext(swiper.allowSlideNext);
          }}
          onSlideChange={(swiper) => setSwiperIndex(swiper.realIndex)}
          modules={[Navigation]}
          className="!h-full !w-full !overflow-y-scroll remove-scroll"
        >
          <SwiperSlide className="!p-4 h-screen overflow-y-scroll">
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

                  {currentListing.included_in_price.length > 0 && (
                    <h1 className="font-bold text-lg mb-2 mt-4">
                      Included in price
                    </h1>
                  )}
                  {currentListing.included_in_price.map((item, index) => (
                    <ListItem key={index}>{item.included_in_price}</ListItem>
                  ))}
                </div>

                <div className={"w-full mt-2 "}>
                  <h1 className="font-bold text-lg">Policies</h1>

                  <div className="mt-2">
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">Cancellation Policy</span>
                    </div>

                    <div className="mt-2 ml-2 flex flex-col gap-2">
                      <ListItem>
                        You should have CV-19 travel insurance
                      </ListItem>
                      <ListItem>
                        See the full cancellation policy more{" "}
                        <Link href="/policies">
                          <a>
                            <div className="text-blue-500 underline inline">
                              here
                            </div>
                          </a>
                        </Link>
                      </ListItem>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">
                        Health and safety policy
                      </span>
                    </div>

                    <div className="mt-2 ml-2 flex flex-col gap-2">
                      <ListItem>
                        This transport is compliant with Winda.guide&apos;s
                        CV-19 requirements. More
                        <Link href="/safety">
                          <a>
                            <div className="text-blue-500 underline inline">
                              here
                            </div>
                          </a>
                        </Link>
                      </ListItem>
                    </div>
                  </div>
                </div>

                <div className="fixed top-3 left-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentListing(null);
                      router.replace({
                        query: {
                          ...router.query,
                          transportSlug: "",
                        },
                      });
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className={
                    "w-full z-10 flex gap-2 sticky bottom-0 bg-gray-100 border-t border-gray-200 "
                  }
                >
                  {slugIsCorrect && (
                    <Button
                      onClick={() => {
                        addToTrip();
                      }}
                      className="flex w-full items-center gap-1 !px-0 !py-1.5 font-bold !bg-blue-500 border-2 border-blue-500 !text-white"
                    >
                      <span>Add to trip</span>
                      {addToTripLoading && (
                        <div>
                          <LoadingSpinerChase
                            width={14}
                            height={14}
                          ></LoadingSpinerChase>
                        </div>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      slideto(1);
                    }}
                    className={
                      "flex w-full items-center gap-1 !px-0 !py-1.5 font-bold border-2 border-blue-500 " +
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

          <SwiperSlide className="!p-4 h-screen overflow-y-scroll">
            {currentListing && (
              <>
                <div
                  onClick={() => {
                    slideto(0);
                  }}
                  className="bg-white cursor-pointer flex items-center gap-1"
                >
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
                                ? currentListing.additional_price_with_a_driver *
                                  numberOfDays
                                : 0)
                            }
                            className="text-lg"
                          ></Price>
                        </div>
                      </div>

                      <div className="w-full sticky z-10 flex gap-2 bottom-10 left-0 right-0 bg-gray-100 border-t border-gray-200">
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
      </Dialogue>
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
          }&page=${query.page ? query.page : 1}&max_price=${
            query.max_price ? query.max_price : ""
          }&ordering=${query.ordering ? query.ordering : ""}&type_of_car=${
            query.type_of_car ? query.type_of_car : ""
          }`
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
            }&page=${query.page ? query.page : 1}&max_price=${
              query.max_price ? query.max_price : ""
            }&ordering=${query.ordering ? query.ordering : ""}&type_of_car=${
              query.type_of_car ? query.type_of_car : ""
            }`,
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
              nextLink: transport.data.next,
              previousLink: transport.data.previous,
              pageSize: transport.data.page_size,
              totalPages: transport.data.total_pages,
              count: transport.data.count,
            },
          };
        }

        return {
          props: {
            userProfile: "",
            transport: transport.data.results,
            nextLink: transport.data.next,
            previousLink: transport.data.previous,
            pageSize: transport.data.page_size,
            totalPages: transport.data.total_pages,
            count: transport.data.count,
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
              transport: [],
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

export default Transport;
