import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import getTokenFromReq from "../../lib/getTokenFromReq";

import Navbar from "../../components/Lodging/Navbar";
import { wrapper } from "../../redux/store";
import TransportSearch from "../../components/Home/TransportSearch";
import Popup from "../../components/ui/Popup";
import PriceFilter from "../../components/Lodging/PriceFilter";
import TypeOfActivities from "../../components/Activities/ActivitiesFilterItems";
import styles from "../../styles/Lodging.module.css";
import MobileModal from "../../components/ui/MobileModal";
import SearchSelect from "../../components/Home/SearchSelect";
import ClientOnly from "../../components/ClientOnly";
import TransportTypes from "../../components/Transport/TransportTypes";
import MobileTransportTypes from "../../components/Transport/MobileTransportTypes";
import TransportCategories from "../../components/Transport/TransportCategories";
import Listings from "../../components/Transport/Listings";
import FilterTags from "../../components/Transport/FilterTags";

const Transport = ({ userProfile }) => {
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

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

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

  const [minPrice, setMinSelected] = useState(minPriceFilterFormatObject);
  const [maxPrice, setMaxSelected] = useState(maxPriceFilterFormatObject);

  useEffect(() => {
    if (minPrice || maxPrice) {
      const maxPriceSelect = maxPrice
        ? maxPrice.value.replace("KES", "").replace("k", "000")
        : "";
      const minPriceSelect = minPrice
        ? minPrice.value.replace("KES", "").replace("k", "000")
        : "";

      router.push({
        query: {
          ...router.query,
          min_price: minPriceSelect,
          max_price: maxPriceSelect,
        },
      });
    }
  }, [minPrice, maxPrice]);

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

  useEffect(() => {
    if (process.browser) {
      window.onresize = function () {
        setState({ ...state, windowSize: window.innerWidth });
      };
    }
  }, []);

  return (
    <div
      className="relative"
      onClick={() => {
        setState({
          ...state,
          ...turnOffAllPopup,
        });
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-100  pb-4">
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

        <div
          ref={searchRef}
          className="mt-1 hidden w-full md:flex md:justify-center md:px-0 px-4"
        >
          <div className="lg:w-4/6 md:w-11/12 w-full">
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

          <div className="hidden lg:block">
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
            className="bg-gray-100 relative md:hidden cursor-pointer rounded-md border border-gray-200 py-2 px-2 flex gap-1 items-center justify-center"
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
              <div className="md:hidden">
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
            </Popup>
          </div>
        </div>

        <MobileModal
          showModal={state.showSearchModal}
          closeModal={() => {
            setState({
              ...state,
              ...turnOffAllPopup,
              showSearchModal: false,
            });
          }}
          containerHeight={70}
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
                  showPopup: false,
                });
              }}
            ></SearchSelect>
          </div>
          <div className="lg:w-4/6 md:w-11/12 w-full px-4">
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
        </MobileModal>

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
            containerHeight={60}
            closeAllPopups={() => {
              setState({ ...state, ...turnOffAllPopup });
            }}
            title="All Filters"
          >
            <div className="px-4">
              <div className="mb-2">
                <FilterTags></FilterTags>
              </div>
              <div className="ml-2">
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
                  <span className="block font-bold text-base mb-2">
                    All car types
                  </span>
                  <MobileTransportTypes></MobileTransportTypes>
                </div>

                <TransportCategories></TransportCategories>
              </div>
            </div>
          </MobileModal>
        )}
      </div>

      <div className="flex relative justify-around h-full w-full">
        <div className="relative hidden md:block md:w-[30%] lg:w-[20%] h-screen top-[180px] overflow-y-auto bg-white border-r border-gray-100">
          <div className="px-4">
            <h1 className="my-3 font-bold text-lg">Filter results</h1>
            <div className="mb-2">
              <FilterTags></FilterTags>
            </div>
            <div className="ml-2">
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
                <span className="block font-bold text-base mb-2">
                  All car types
                </span>
                <MobileTransportTypes></MobileTransportTypes>
              </div>

              <TransportCategories></TransportCategories>
            </div>
          </div>
        </div>
        <div className="relative h-screen overflow-y-auto top-52 md:top-56 md:px-4 md:w-[68%] lg:w-[78%]">
          <Listings userProfile={userProfile}></Listings>
        </div>
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

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/transport/`
        );

        await context.dispatch({
          type: "SET_TRANSPORTS",
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

export default Transport;
