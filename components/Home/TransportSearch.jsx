import React from "react";
import moment from "moment";

import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "../../styles/Search.module.css";
import DatePicker from "../ui/DatePicker";
import Popup from "../ui/Popup";
import SelectInput from "../ui/SelectInput";
import SearchButtonClose from "./SearchButtonClose";
import Guest from "./Guest";
import Switch from "../ui/Switch";

function TransportSearch({
  typeOfCar,
  setTypeOfCar,
  transportDate,
  passengers,
  changeShowTransportDate,
  setTransportDate,
  showTransportDate,
  showPassengerPopup,
  changeShowPassengerPopup,
  showNeedADriver,
  changeShowNeedADriver,
  selectedTransportSearchItem,
  clearTransportDate,
  clearPassengers,
  clearNeedADriver,
  addPassenger,
  removePassenger,
  needADriver,
  changeNeedADriver,
  showSearchModal,
}) {
  const options = [
    { value: "Car 1", label: "Car 1" },
    { value: "Car 2", label: "Car 2" },
    { value: "Car 3", label: "Car 3" },
    { value: "Car 4", label: "Car 4" },
  ];
  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row rounded-2xl py-4 px-2 md:py-0 md:px-0 md:rounded-full bg-white w-full shadow-md">
      <div
        onClick={(event) => {
          event.stopPropagation();
        }}
        className={
          "md:w-2/6 w-full !justify-between relative " + styles.searchInput
        }
      >
        <div className="font-bold text-sm">Type of car</div>
        <SelectInput
          options={options}
          instanceId="carModels"
          selectedOption={typeOfCar}
          setSelectedOption={setTypeOfCar}
          className={styles.input}
        ></SelectInput>
      </div>
      <div className="flex gap-4 md:gap-0 md:w-2/6 md:flex-none">
        <div
          onClick={(e) => {
            e.stopPropagation();
            changeShowTransportDate();
          }}
          className={"relative w-2/4 " + styles.searchInput}
        >
          <div className="font-bold text-sm">Date</div>
          <div className="text-sm text-gray-400">
            {transportDate
              ? moment(transportDate).format("MMM Do")
              : "Add date"}
          </div>
          <div
            className={
              "absolute top-2/4 right-3 -translate-y-2/4 " +
              (selectedTransportSearchItem === 1 ? "block" : "hidden")
            }
          >
            <SearchButtonClose onClick={clearTransportDate}></SearchButtonClose>
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
                  setTransportDate(date);
                }
              }}
              date={transportDate}
              showDate={showTransportDate}
              className="!top-12 !-left-6 md:!-left-12 "
              disableDate={new Date()}
            ></DatePicker>
          </div>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            changeShowPassengerPopup();
          }}
          className={"relative w-2/4 " + styles.searchInput}
        >
          <div className="font-bold text-sm">Passengers</div>
          <div className="text-sm text-gray-400 truncate">
            {passengers === 0 ? "Add Passengers" : passengers + " Passengers"}
          </div>
          <div
            className={
              "absolute top-2/4 right-3 -translate-y-2/4 " +
              (selectedTransportSearchItem === 2 ? "block" : "hidden")
            }
          >
            <SearchButtonClose onClick={clearPassengers}></SearchButtonClose>
          </div>
          <div
            className={
              "mt-4 absolute !top-10 md:!top-14 !-left-32 sm:!-left-2 md:!-left-16 w-72 z-30 " +
              (showSearchModal ? "hidden" : "")
            }
          >
            <Popup
              showPopup={showPassengerPopup}
              className="bg-white px-4 py-4 !rounded-2xl shadow-xl border border-gray-200"
            >
              <div className="py-4">
                <Guest
                  add={addPassenger}
                  remove={removePassenger}
                  guests={passengers}
                  type="Passengers"
                ></Guest>
              </div>
            </Popup>
          </div>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          changeShowNeedADriver();
        }}
        className={"relative md:w-1/4 w-full " + styles.searchInput}
      >
        <div className="font-bold text-sm">Do you need a driver?</div>
        <div className="text-sm text-gray-400 truncate">
          {needADriver ? "I want a driver" : "Want a driver?"}
        </div>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedTransportSearchItem === 3 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearNeedADriver}></SearchButtonClose>
        </div>
        <div
          className={
            "mt-4 absolute !top-10 md:!top-14 md:!-left-2 !w-full smMobile:!w-72 z-30 " +
            (showSearchModal ? "hidden" : "")
          }
        >
          <Popup
            showPopup={showNeedADriver}
            className="bg-white px-4 py-4 !rounded-2xl shadow-xl border border-gray-200"
          >
            <div className="py-4">
              <div className="flex items-center gap-4">
                <Switch
                  switchButton={needADriver}
                  changeSwitchButtonState={changeNeedADriver}
                ></Switch>
                <h1>Do you need a driver?</h1>
              </div>
            </div>
          </Popup>
        </div>
      </div>
      <div className="flex-grow md:pr-4 flex mt-4 md:mt-0 items-center">
        <Button className="!rounded-full w-full">
          <span className="font-bold md:hidden mr-1 md:mr-0">Search</span>
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
        </Button>
      </div>
    </div>
  );
}

export default TransportSearch;
