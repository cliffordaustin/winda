import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function Lodging() {
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

  const [isFixed, setIsFixed] = useState(true);

  const searchRef = useRef(null);

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
        });
      }}
    >
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 pb-4">
        <Navbar
          showDropdown={state.showDropdown}
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
          changeShowDropdown={() =>
            setState({
              ...state,
              showDropdown: !state.showDropdown,
            })
          }
        ></Navbar>
        <div className="sm:hidden flex justify-center">
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
        <div
          ref={searchRef}
          className="mt-1 w-full flex md:justify-center md:px-0 px-4"
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
        <div className="flex gap-4 mt-4 ml-10">
          <div
            onClick={(event) => {
              event.stopPropagation();
              setState({
                ...state,
                ...turnOffAllPopup,
                showSortPopup: !state.showSortPopup,
              });
            }}
            className="cursor-pointer relative rounded-md border border-gray-200 py-2 px-4 mr-8 flex gap-1 items-center justify-center"
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
              <div className={styles.listItem}>Just for you</div>
              <div className={styles.listItem}>Newest</div>
              <div className={styles.listItem}>Ratings(High to Low)</div>
              <div className={styles.listItem}>Price(min to max)</div>
              <div className={styles.listItem}>Price(max to min)</div>
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
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4"
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
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4"
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
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4 flex gap-1 items-center justify-center"
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
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4 flex gap-1 items-center justify-center"
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
                  <Badge className="bg-green-700">4.5</Badge>
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
                  <Badge className="bg-green-600">4</Badge>
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
                  <Badge className="bg-green-500">3.5</Badge>
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
                  <Badge className="bg-yellow-500">3</Badge>
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
                  <Badge className="bg-red-500">0</Badge>
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
              });
            }}
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4 flex gap-1 items-center justify-center"
          >
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
              className="absolute top-full mt-2 max-h-[500px] w-[500px] -left-44 px-4 overflow-scroll"
              showPopup={state.showFilterPopup}
            >
              <div className="text-lg font-bold mb-2 mt-2">Travel Themes</div>
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
      <div>
        <div className="mt-56 flex relative">
          <div className="px-4 h-full w-2/4">
            <Listings></Listings>
          </div>
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
          <div className={isFixed ? "invisible" : "w-2/4"}>
            <Map></Map>
          </div>
          <div
            className={
              isFixed ? "w-2/4 bottom-0 right-0 top-56 fixed" : "invisible"
            }
          >
            <Map></Map>
          </div>
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
        <RemoveFixed isFixed={isFixed} setIsFixed={setIsFixed}></RemoveFixed>
      </div>
      <div className="mt-14">
        <Footer></Footer>
      </div>
    </div>
  );
}

export default Lodging;
