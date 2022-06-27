import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../ui/FullScreenMobileModal";
import Search from "../Trip/Search";
import DatePicker from "../ui/DatePickerOpen";
import Button from "../ui/Button";
import SearchSelect from "../Home/SearchSelect";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

function MobileSearchModal({
  showModal,
  closeModal,
  pickupLocation,
  setPickupLocation,
  destinationLocation,
  setDestinationLocation,
  numOfPeople,
  searchFilter,
  showSearchLoader,
  clearNumOfPeople,

  addTraveler,
  removeTraveler,
}) {
  const [showDate, setShowDate] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showDestination, setShowDestination] = useState(false);
  return (
    <Modal
      showModal={showModal}
      closeModal={() => {
        closeModal(false);
      }}
      className="md:!hidden"
      title="Search for a car"
    >
      <div className="flex justify-center mb-3 mt-6">
        <SearchSelect
          currentNavState={2}
          setCurrentNavState={(currentNavState) => {}}
        ></SearchSelect>
      </div>

      <div className="px-3 mt-6">
        {!showSearch && (
          <div
            onClick={() => {
              setShowDestination(false);
              setShowSearch(true);
              setShowGuests(false);
            }}
            className="px-3 py-6 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">Starting point</div>
            <div className="font-bold text-sm truncate">
              {pickupLocation ? pickupLocation : "I am flexible"}
            </div>
          </div>
        )}

        {showSearch && (
          <div className="px-3 py-2 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full">
            <h1 className="text-xl font-bold mb-2">Starting point</h1>

            <div className="mt-4">
              <Search
                location={pickupLocation}
                setLocation={setPickupLocation}
              ></Search>
            </div>
          </div>
        )}

        {!showDestination && (
          <div
            onClick={() => {
              setShowDestination(true);
              setShowSearch(false);
              setShowGuests(false);
            }}
            className="px-3 mt-3 py-6 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">Destination</div>
            <div className="font-bold text-sm truncate">
              {destinationLocation ? destinationLocation : "I am flexible"}
            </div>
          </div>
        )}

        {showDestination && (
          <div className="px-3 mt-3 py-2 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full">
            <h1 className="text-xl font-bold mb-2">Destination</h1>

            <div className="mt-4">
              <Search
                location={destinationLocation}
                setLocation={setDestinationLocation}
                placeholder="Enter a destination"
              ></Search>
            </div>
          </div>
        )}

        {!showGuests && (
          <div
            onClick={() => {
              setShowDestination(false);
              setShowSearch(false);
              setShowGuests(true);
            }}
            className="px-3 mt-3 cursor-pointer py-6 border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">Who?</div>
            <div className="font-bold text-sm">
              {numOfPeople > 0
                ? `${numOfPeople} ${
                    numOfPeople > 1 ? "Passengers" : "Passenger"
                  }`
                : "Add a passenger"}
            </div>
          </div>
        )}

        {showGuests && (
          <div className="px-3 mt-3 py-2 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full">
            <h1 className="text-xl font-bold mb-2">Who is coming?</h1>

            <hr />
            <div className="mt-0">
              <div className="flex justify-between items-center mt-4 mb-2">
                <div className="flex flex-col text-sm text-gray-600 items-center">
                  <span>
                    {numOfPeople} {numOfPeople > 1 ? "Passengers" : "Passenger"}
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <div
                    onClick={() => {
                      removeTraveler();
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                  >
                    -
                  </div>

                  <div
                    onClick={() => {
                      addTraveler();
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                  >
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        className={
          "w-full z-10 px-2 py-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 "
        }
      >
        <div className="flex justify-between items-center gap-2">
          <div
            onClick={() => {
              clearNumOfPeople();
              setPickupLocation("");
              setDestinationLocation("");
            }}
            className="underline cursor-pointer"
          >
            Clear all
          </div>

          <Button
            onClick={() => {
              searchFilter();
            }}
            className={
              "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white "
            }
          >
            <span className="font-bold mr-0.5">Search</span>

            {showSearchLoader && (
              <LoadingSpinerChase width={14} height={14}></LoadingSpinerChase>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

MobileSearchModal.propTypes = {};

export default MobileSearchModal;
