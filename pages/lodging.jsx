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
    showRatingsPopup: false,
    showFilterPopup: false,
  });
  const turnOffAllPopup = {
    showDropdown: false,
    showCheckInDate: false,
    showCheckOutDate: false,
    showPopup: false,
    selectedSearchItem: 0,
    showSortPopup: false,
    showPricePopup: false,
    showRatingsPopup: false,
    showFilterPopup: false,
  };
  const [minPrice, setMinSelected] = useState(null);
  const [maxPrice, setMaxSelected] = useState(null);
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
              className="absolute -bottom-[13.5rem] -mt-16 w-60 left-0"
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
            className="bg-gray-100 relative cursor-pointer rounded-md border border-gray-200 py-2 px-4 flex gap-1 items-center justify-center"
          >
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
            <Popup
              className="absolute -bottom-[5.5rem] -mt-16 w-[450px] -left-10 px-2"
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
              className="absolute -bottom-[13.5rem] -mt-16 w-60 left-0"
              showPopup={state.showRatingsPopup}
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
              className="absolute -bottom-[13.5rem] -mt-16 w-60 left-0"
              showPopup={state.showFilterPopup}
            >
              <div className={styles.listItem}>Just for you</div>
              <div className={styles.listItem}>Newest</div>
              <div className={styles.listItem}>Ratings(High to Low)</div>
              <div className={styles.listItem}>Price(min to max)</div>
              <div className={styles.listItem}>Price(max to min)</div>
            </Popup>
          </div>
        </div>
      </div>
      <div className="mt-56 flex relative">
        <div className="px-4 w-2/4">
          <Listings></Listings>
        </div>
        <div className="flex px-4 justify-center items-center w-2/4 h-screen fixed right-0 top-56">
          <Map></Map>
        </div>
      </div>
    </div>
  );
}

export default Lodging;
