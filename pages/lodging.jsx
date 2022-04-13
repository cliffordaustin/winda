import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoadingSpinerChase from "../components/ui/LoadingSpinerChase";
import LoadingPulse from "../components/ui/LoadingPulse";

import { getServerSideProps } from "../lib/getServerSideProps";
import styles from "../styles/Lodging.module.css";
import Navbar from "../components/Lodging/Navbar";
import Listings from "../components/Lodging/Listings";
import Map from "../components/Lodging/Map";
import SearchSelect from "../components/Home/SearchSelect";
import Search from "../components/Home/Search";
import Popup from "../components/ui/Popup";
import PriceFilter from "../components/Lodging/PriceFilter";
import RoomFilter from "../components/Lodging/RoomFilter";
import Badge from "../components/ui/Badge";
import Checkbox from "../components/ui/Checkbox";
import Footer from "../components/Home/Footer";
import RemoveFixed from "../components/Lodging/RemoveFixed";
import MobileModal from "../components/ui/MobileModal";
import Button from "../components/ui/Button";
import ClientOnly from "../components/ClientOnly";
import { setFilteredStays } from "../redux/actions/stay";
// import { getServerSideProps } from "./index";

function Lodging({ userProfile, longitude, latitude }) {
  const [state, setState] = useState({
    showDropdown: false,
    location: "",
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
    showHomeTypesPopup: false,
    showFilterPopup: false,
    exellentRating: false,
    veryGoodRating: false,
    goodRating: false,
    fairRating: false,
    okayRating: false,
    house: false,
    lodge: false,
    campsite: false,
    cottage: false,

    freeWifi: false,
    kitchen: false,
    selfCheckin: false,
    pool: false,
    dryer: false,
    heating: false,
    gym: false,
    dedicatedWorkspace: false,
    fullboard: false,
    allInclusive: false,
    freeParking: false,
    waterfront: false,
    laundry: false,
    aircondition: false,

    coworkingSpots: false,
    campsites: false,
    weekendGetaways: false,
    romanticGetaways: false,
    groupRetreats: false,
    conservancies: false,
    nationalParks: false,
    lakeHouse: false,

    gameDrives: false,
    walkingSafaris: false,
    horseBackRiding: false,
    waterSports: false,
    cultural: false,
    bushMeals: false,
    bushWalks: false,
    sundowners: false,
    ecoTours: false,
    spa: false,

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
  const [minPrice, setMinSelected] = useState(null);
  const [maxPrice, setMaxSelected] = useState(null);

  const [minRoom, setminRoomSelected] = useState(null);
  const [maxRoom, setmaxRoomSelected] = useState(null);

  const [mobileMap, setMobileMap] = useState(false);
  const filterStayLoading = useSelector(
    (state) => state.stay.filterStayLoading
  );

  const router = useRouter();

  // const userLatLng = {
  //   latitude: latitude,
  //   longitude: longitude,
  // };

  const [isFixed, setIsFixed] = useState(true);

  const searchRef = useRef(null);

  const dispatch = useDispatch();

  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  useEffect(() => {
    if (router.query.ordering) {
      dispatch(setFilteredStays(router));
    }
  }, [router.query]);

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
  });

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
              location={state.location}
              checkin={state.checkin}
              selectedSearchItem={state.selectedSearchItem}
              showSearchModal={state.showSearchModal}
              clearInput={() => {
                setState({ ...state, location: "" });
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
                setState({ ...state, location: event.target.value });
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
              className="absolute md:right-12 right-6 bottom-7 font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_FALSE",
                });
              }}
            >
              KES
            </div>
          )}
          {!currencyToDollar && (
            <div
              className="absolute md:right-12 right-6 bottom-7 font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_TRUE",
                });
              }}
            >
              USD
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
                  router.push({ query: { ordering: "-date_posted" } });
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
                  router.push({ query: { ordering: "+price" } });
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
                  router.push({ query: { ordering: "-price" } });
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
                  router.push({ query: { ordering: "-rooms" } });
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
                  router.push({ query: { ordering: "-beds" } });
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
                  router.push({ query: { ordering: "-bathrooms" } });
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
          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showHomeTypesPopup: !state.showHomeTypesPopup,
              });
            }}
            className="bg-gray-100 hidden relative cursor-pointer rounded-md border border-gray-200 py-2 px-2 lg:flex gap-1 items-center justify-center"
          >
            <span className="block">All home types</span>
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
              showPopup={state.showHomeTypesPopup}
            >
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    lodge: !state.lodge,
                  });
                }}
                className={styles.ratingItem}
              >
                <Checkbox checked={state.lodge}></Checkbox>
                <div>Lodge</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    cottage: !state.cottage,
                  });
                }}
                className={styles.ratingItem}
              >
                <Checkbox checked={state.cottage}></Checkbox>
                <div>Cottage</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    house: !state.house,
                  });
                }}
                className={styles.ratingItem}
              >
                <Checkbox checked={state.house}></Checkbox>
                <div>House</div>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setState({
                    ...state,
                    campsite: !state.campsite,
                  });
                }}
                className={styles.ratingItem}
              >
                <Checkbox checked={state.campsite}></Checkbox>
                <div>Campsite</div>
              </div>
            </Popup>
          </div>
          <div
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
                    All home types
                  </span>
                  <div className="flex justify-between flex-wrap">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          lodge: !state.lodge,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <Checkbox checked={state.lodge}></Checkbox>
                      <div>Lodge</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          cottage: !state.cottage,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <Checkbox checked={state.cottage}></Checkbox>
                      <div>Cottage</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          house: !state.house,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <Checkbox checked={state.house}></Checkbox>
                      <div>House</div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          campsite: !state.campsite,
                        });
                      }}
                      className={styles.ratingItem + " !w-[48%]"}
                    >
                      <Checkbox checked={state.campsite}></Checkbox>
                      <div>Campsite</div>
                    </div>
                  </div>
                </div>

                <div>
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
                </div>
              </div>

              <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
              <div className="flex gap-2 flex-wrap">
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      coworkingSpots: !state.coworkingSpots,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.coworkingSpots
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Coworking Spots
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, campsites: !state.campsites });
                  }}
                  className={
                    styles.tag +
                    (state.campsites
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Campsites
                </div>
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      weekendGetaways: !state.weekendGetaways,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.weekendGetaways
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Weekend Getaways
                </div>
                <div
                  onClick={() => {
                    setState({
                      ...state,
                      romanticGetaways: !state.romanticGetaways,
                    });
                  }}
                  className={
                    styles.tag +
                    (state.romanticGetaways
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Romantic Getaways
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, groupRetreats: !state.groupRetreats });
                  }}
                  className={
                    styles.tag +
                    (state.groupRetreats
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Group Retreats
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, conservancies: !state.conservancies });
                  }}
                  className={
                    styles.tag +
                    (state.conservancies
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Conservancies
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, nationalParks: !state.nationalParks });
                  }}
                  className={
                    styles.tag +
                    (state.nationalParks
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  National Parks
                </div>
                <div
                  onClick={() => {
                    setState({ ...state, lakeHouse: !state.lakeHouse });
                  }}
                  className={
                    styles.tag +
                    (state.lakeHouse
                      ? " bg-blue-500 hover:!bg-blue-500 text-white"
                      : "")
                  }
                >
                  Lake House
                </div>
              </div>

              <div className="text-lg font-bold mb-2 mt-8">Activities</div>
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
              </div>

              <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
              <div className="flex justify-between flex-wrap mb-4">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      freeWifi: !state.freeWifi,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free Wifi
                  </div>
                  <Checkbox checked={state.freeWifi}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      kitchen: !state.kitchen,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Kitchen</div>
                  <Checkbox checked={state.kitchen}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      selfCheckin: !state.selfCheckin,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Self Check-in</div>
                  <Checkbox checked={state.selfCheckin}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      pool: !state.pool,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Pool</div>
                  <Checkbox checked={state.pool}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      dryer: !state.dryer,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Dryer</div>
                  <Checkbox checked={state.dryer}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      heating: !state.heating,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Heating</div>
                  <Checkbox checked={state.heating}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      aircondition: !state.aircondition,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Air Condition</div>
                  <Checkbox checked={state.aircondition}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      dedicatedWorkspace: !state.dedicatedWorkspace,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Dedicated Workspace</div>
                  <Checkbox checked={state.dedicatedWorkspace}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      fullboard: !state.fullboard,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Fullboard(meals & stay only)</div>
                  <Checkbox checked={state.fullboard}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      allInclusive: !state.allInclusive,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div className="pr-2">
                    All Inclusive (meals, drinks, stay, shared game drives)
                  </div>
                  <Checkbox checked={state.allInclusive}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      freeParking: !state.freeParking,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Free Parking</div>
                  <Checkbox checked={state.freeParking}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      waterfront: !state.waterfront,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Waterfront</div>
                  <Checkbox checked={state.waterfront}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      laundry: !state.laundry,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div>Laundry</div>
                  <Checkbox checked={state.laundry}></Checkbox>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      gym: !state.gym,
                    });
                  }}
                  className={styles.amenitiesItem}
                >
                  <div className="flex gap-2 items-center">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.2739 9.86883L16.8325 4.95392L18.4708 3.80676L21.9122 8.72167L20.2739 9.86883Z"
                        fill="currentColor"
                      />
                      <path
                        d="M18.3901 12.4086L16.6694 9.95121L8.47783 15.687L10.1985 18.1444L8.56023 19.2916L3.97162 12.7383L5.60992 11.5912L7.33068 14.0487L15.5222 8.31291L13.8015 5.8554L15.4398 4.70825L20.0284 11.2615L18.3901 12.4086Z"
                        fill="currentColor"
                      />
                      <path
                        d="M20.7651 7.08331L22.4034 5.93616L21.2562 4.29785L19.6179 5.445L20.7651 7.08331Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7.16753 19.046L3.72607 14.131L2.08777 15.2782L5.52923 20.1931L7.16753 19.046Z"
                        fill="currentColor"
                      />
                      <path
                        d="M4.38208 18.5549L2.74377 19.702L1.59662 18.0637L3.23492 16.9166L4.38208 18.5549Z"
                        fill="currentColor"
                      />
                    </svg>
                    Gym
                  </div>
                  <Checkbox checked={state.gym}></Checkbox>
                </div>
              </div>
            </Popup>
          </div>
        </div>
      </div>
      <div className="mt-48 lg:mt-56 flex relative h-full overflow-y-scroll">
        {/* {!isFixed && (
            <div>
              <Map></Map>
            </div>
          )}
          {isFixed && (
            <div className="w-2/4 bottom-0 right-0 top-56 fixed">
              <Map></Map>
            </div>
          )} */}
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
        {/* <div
            className={
              "w-47p px-2 bottom-0 right-0 left-0 top-56 bg-red-400 " +
              (isFixed ? "fixed" : "sticky ")
            }
          >
            <div className="bg-red-400 w-full h-full">the name</div>
            <Map></Map>
          </div> */}
        {/* <div className="absolute right-0 top-54 w-2/4 h-full px-4">
            <div className={"w-full h-full fixed bg-red-400 "}>
              <Map></Map>
            </div>
          </div> */}
        {/* <div
            className={
              "w-2/4 px-4 bottom-0 right-0 top-56 " +
              (isFixed ? "fixed" : "sticky ")
            }
          >
            <Map></Map>
          </div> */}
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
                  All home types
                </span>
                <div className="flex justify-between flex-wrap">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopPropagation();
                      setState({
                        ...state,
                        lodge: !state.lodge,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%]"}
                  >
                    <Checkbox checked={state.lodge}></Checkbox>
                    <div>Lodge</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        cottage: !state.cottage,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%]"}
                  >
                    <Checkbox checked={state.cottage}></Checkbox>
                    <div>Cottage</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        house: !state.house,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%]"}
                  >
                    <Checkbox checked={state.house}></Checkbox>
                    <div>House</div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setState({
                        ...state,
                        campsite: !state.campsite,
                      });
                    }}
                    className={styles.ratingItem + " sm:!w-[48%]"}
                  >
                    <Checkbox checked={state.campsite}></Checkbox>
                    <div>Campsite</div>
                  </div>
                </div>
              </div>

              <div>
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
              </div>
            </div>

            <div className="text-lg font-bold mb-2 mt-2">Travel themes</div>
            <div className="flex gap-2 flex-wrap">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    coworkingSpots: !state.coworkingSpots,
                  });
                }}
                className={
                  styles.tag +
                  (state.coworkingSpots
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Coworking Spots
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, campsites: !state.campsites });
                }}
                className={
                  styles.tag +
                  (state.campsites
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Campsites
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    weekendGetaways: !state.weekendGetaways,
                  });
                }}
                className={
                  styles.tag +
                  (state.weekendGetaways
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Weekend Getaways
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({
                    ...state,
                    romanticGetaways: !state.romanticGetaways,
                  });
                }}
                className={
                  styles.tag +
                  (state.romanticGetaways
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Romantic Getaways
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, groupRetreats: !state.groupRetreats });
                }}
                className={
                  styles.tag +
                  (state.groupRetreats
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Group Retreats
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, conservancies: !state.conservancies });
                }}
                className={
                  styles.tag +
                  (state.conservancies
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Conservancies
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, nationalParks: !state.nationalParks });
                }}
                className={
                  styles.tag +
                  (state.nationalParks
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                National Parks
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setState({ ...state, lakeHouse: !state.lakeHouse });
                }}
                className={
                  styles.tag +
                  (state.lakeHouse
                    ? " bg-blue-500 hover:!bg-blue-500 text-white"
                    : "")
                }
              >
                Lake House
              </div>
            </div>

            <div className="text-lg font-bold mb-2 mt-8">Activities</div>
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
            </div>

            <div className="text-lg font-bold mb-2 mt-8">Amenities</div>
            <div className="flex justify-between flex-wrap mb-4">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    freeWifi: !state.freeWifi,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free Wifi
                </div>
                <Checkbox checked={state.freeWifi}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    kitchen: !state.kitchen,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Kitchen</div>
                <Checkbox checked={state.kitchen}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    selfCheckin: !state.selfCheckin,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Self Check-in</div>
                <Checkbox checked={state.selfCheckin}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    pool: !state.pool,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Pool</div>
                <Checkbox checked={state.pool}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    dryer: !state.dryer,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Dryer</div>
                <Checkbox checked={state.dryer}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    heating: !state.heating,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Heating</div>
                <Checkbox checked={state.heating}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    aircondition: !state.aircondition,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Air Condition</div>
                <Checkbox checked={state.aircondition}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    dedicatedWorkspace: !state.dedicatedWorkspace,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Dedicated Workspace</div>
                <Checkbox checked={state.dedicatedWorkspace}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    fullboard: !state.fullboard,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Fullboard(meals & stay only)</div>
                <Checkbox checked={state.fullboard}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    allInclusive: !state.allInclusive,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div className="pr-2">
                  All Inclusive (meals, drinks, stay, shared game drives)
                </div>
                <Checkbox checked={state.allInclusive}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    freeParking: !state.freeParking,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Free Parking</div>
                <Checkbox checked={state.freeParking}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    waterfront: !state.waterfront,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Waterfront</div>
                <Checkbox checked={state.waterfront}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    laundry: !state.laundry,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div>Laundry</div>
                <Checkbox checked={state.laundry}></Checkbox>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setState({
                    ...state,
                    gym: !state.gym,
                  });
                }}
                className={styles.amenitiesItem}
              >
                <div className="flex gap-2 items-center">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.2739 9.86883L16.8325 4.95392L18.4708 3.80676L21.9122 8.72167L20.2739 9.86883Z"
                      fill="currentColor"
                    />
                    <path
                      d="M18.3901 12.4086L16.6694 9.95121L8.47783 15.687L10.1985 18.1444L8.56023 19.2916L3.97162 12.7383L5.60992 11.5912L7.33068 14.0487L15.5222 8.31291L13.8015 5.8554L15.4398 4.70825L20.0284 11.2615L18.3901 12.4086Z"
                      fill="currentColor"
                    />
                    <path
                      d="M20.7651 7.08331L22.4034 5.93616L21.2562 4.29785L19.6179 5.445L20.7651 7.08331Z"
                      fill="currentColor"
                    />
                    <path
                      d="M7.16753 19.046L3.72607 14.131L2.08777 15.2782L5.52923 20.1931L7.16753 19.046Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.38208 18.5549L2.74377 19.702L1.59662 18.0637L3.23492 16.9166L4.38208 18.5549Z"
                      fill="currentColor"
                    />
                  </svg>
                  Gym
                </div>
                <Checkbox checked={state.gym}></Checkbox>
              </div>
            </div>
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
            location={state.location}
            checkin={state.checkin}
            selectedSearchItem={state.selectedSearchItem}
            clearInput={() => {
              setState({ ...state, location: "" });
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
              setState({ ...state, location: event.target.value });
            }}
            numOfAdults={state.numOfAdults}
            numOfChildren={state.numOfChildren}
            numOfInfants={state.numOfInfants}
            addToAdults={() => {
              console.log("add");
              setState({
                ...state,
                numOfAdults: state.numOfAdults + 1,
              });
            }}
            addToChildren={() => {
              setState({
                ...state,
                numOfChildren: state.numOfChildren + 1,
              });
            }}
            addToInfants={() => {
              setState({
                ...state,
                numOfInfants: state.numOfInfants + 1,
              });
            }}
            removeFromAdults={() => {
              state.numOfAdults > 0
                ? setState({
                    ...state,
                    numOfAdults: state.numOfAdults - 1,
                  })
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

export { getServerSideProps };

export default Lodging;
