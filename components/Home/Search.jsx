import React, { useState } from "react";
import moment from "moment";

import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "../../styles/Search.module.css";
import DatePicker from "../ui/DatePicker";
import Popup from "../ui/Popup";
import SearchButtonClose from "./SearchButtonClose";
import Guest from "./Guest";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

function Search({
  location,
  checkin,
  checkout,
  showCheckInDate,
  setCheckInDate,
  changeShowCheckInDate,
  showCheckOutDate,
  setCheckOutDate,
  changeShowCheckOutDate,
  showPopup,
  changeShowPopup,
  onChange,
  selectedSearchItem,
  changeSelectedSearchItem,
  clearInput,
  clearCheckInDate,
  clearCheckOutDate,
  numOfAdults,
  numOfChildren,
  numOfInfants,
  addToAdults,
  addToChildren,
  addToInfants,
  removeFromAdults,
  removeFromChildren,
  removeFromInfants,
  clearGuests,
  showSearchModal,
  autoCompleteFromSearch,
  locationFromSearch,
  apiSearchResult,
  showSearchLoader,
  onKeyDown,
}) {
  return (
    <div className="flex flex-col md:flex-row rounded-2xl py-4 px-2 md:py-0 md:px-0 md:rounded-full bg-white w-full shadow-md">
      <div
        onClick={(event) => {
          event.stopPropagation();
          changeSelectedSearchItem(1);
        }}
        className={
          "md:w-2/6 w-full !py-2 !justify-between relative " +
          styles.searchInput
        }
      >
        <div className="font-bold text-sm">Location</div>
        <Input
          placeholder="Where to?"
          type="text"
          name="location"
          value={location}
          className={styles.input}
          autoComplete="off"
          onChange={(event) => {
            onChange(event);
          }}
          onKeyPress={onKeyDown}
        ></Input>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedSearchItem === 1 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearInput}></SearchButtonClose>
        </div>

        {autoCompleteFromSearch.length > 0 && (
          <div className="absolute top-full left-0 z-30 rounded-b-xl w-full md:w-[350px] py-2 bg-white">
            {autoCompleteFromSearch.map((item, index) => (
              <div
                key={index}
                onClick={() => locationFromSearch(item)}
                className="flex items-center gap-6 hover:bg-gray-100 transition-all duration-300 ease-linear cursor-pointer px-4 py-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate">{item.place_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-4 md:w-2/5 md:flex-none">
        <div
          onClick={(e) => {
            e.stopPropagation();
            changeShowCheckInDate();
          }}
          className={
            "relative w-2/4 !py-2 !justify-between " + styles.searchInput
          }
        >
          <div className="font-bold text-sm">Check-in</div>
          <div className="text-sm text-gray-400">
            {checkin ? moment(checkin).format("MMM Do") : "Add date"}
          </div>
          <div
            className={
              "absolute top-2/4 right-3 -translate-y-2/4 " +
              (selectedSearchItem === 2 ? "block" : "hidden")
            }
          >
            <SearchButtonClose onClick={clearCheckInDate}></SearchButtonClose>
          </div>
          <div
            className={
              "mt-4 absolute !w-full smMobile:!w-96 " +
              (showSearchModal ? "hidden" : "")
            }
          >
            <DatePicker
              setDate={(date, modifiers = {}) => {
                if (!modifiers.disabled) {
                  setCheckInDate(date);
                }
              }}
              date={checkin}
              showDate={showCheckInDate}
              className="!top-12 !-left-6 md:!-left-12 "
              disableDate={new Date()}
            ></DatePicker>
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            changeShowCheckOutDate();
          }}
          className={
            "relative w-2/4 !py-2 !justify-between " + styles.searchInput
          }
        >
          <div className="font-bold text-sm">Check out</div>
          <div className="text-sm text-gray-400">
            {checkout ? moment(checkout).format("MMM Do") : "Add date"}
          </div>
          <div
            className={
              "absolute top-2/4 right-3 -translate-y-2/4 " +
              (selectedSearchItem === 3 ? "block" : "hidden")
            }
          >
            <SearchButtonClose onClick={clearCheckOutDate}></SearchButtonClose>
          </div>
          <div
            className={
              "mt-4 absolute !w-full smMobile:!w-96 " +
              (showSearchModal ? "hidden" : "")
            }
          >
            <DatePicker
              setDate={(date, modifiers = {}) => {
                if (!modifiers.disabled) {
                  setCheckOutDate(date);
                }
              }}
              date={checkout}
              showDate={showCheckOutDate}
              className="!top-12 -left-48 mobile:-left-44 sm:!-left-24 md:!-left-24 "
              disableDate={checkin}
            ></DatePicker>
          </div>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          changeShowPopup();
        }}
        className={"relative md:w-1/5 w-full !py-2 " + styles.searchInput}
      >
        <div className="font-bold text-sm">Guest</div>
        <div className="text-sm text-gray-400">
          {numOfAdults === 0 && numOfChildren === 0 && numOfInfants === 0
            ? "Add guests"
            : numOfAdults + numOfChildren + numOfInfants + " Guests"}
        </div>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedSearchItem === 4 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearGuests}></SearchButtonClose>
        </div>
        <div
          className={
            "mt-4 absolute !top-12 md:!top-14 md:!-left-16 !w-full smMobile:!w-72 z-30 " +
            (showSearchModal ? "hidden" : "")
          }
        >
          <Popup
            showPopup={showPopup}
            className="bg-white px-4 pb-4 pt-4 !border !border-gray-200 !rounded-2xl shadow-xl"
          >
            <div className="py-4">
              <Guest
                add={addToAdults}
                remove={removeFromAdults}
                guests={numOfAdults}
                type="Adults"
              ></Guest>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-0.5 w-4/5 bg-gray-100"></div>
            </div>
            <div className="py-4">
              <Guest
                add={addToChildren}
                remove={removeFromChildren}
                guests={numOfChildren}
                type="Children"
              ></Guest>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-0.5 w-4/5 bg-gray-100"></div>
            </div>
            <div className="py-4">
              <Guest
                add={addToInfants}
                remove={removeFromInfants}
                guests={numOfInfants}
                type="Infants"
              ></Guest>
            </div>
          </Popup>
        </div>
      </div>
      <div className="flex-grow md:pr-4 flex mt-4 md:mt-0 items-center">
        <Button onClick={apiSearchResult} className="!rounded-full w-full">
          <span className="font-bold md:hidden mr-1 md:mr-0">Search</span>
          {!showSearchLoader && (
            <svg
              className="h-6 w-6 hidden md:block"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="currentColor"
              />
            </svg>
          )}
          {showSearchLoader && (
            <LoadingSpinerChase width={24} height={24}></LoadingSpinerChase>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Search;
