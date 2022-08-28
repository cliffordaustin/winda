import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../ui/FullScreenMobileModal";
import Search from "../Trip/Search";
import DatePicker from "../ui/DatePickerRange";
import Button from "../ui/Button";
import SearchSelect from "../Home/SearchSelect";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import PopularLocationsDropdown from "../Lodging/PopularLocationsDropdown";

function MobileSearchModal({
  showModal,
  closeModal,
  search,
  setSearch,
  date,
  setDate,
  numOfAdults,
  setNumOfAdults,
  numOfChildren,
  setNumOfChildren,
  searchFilter,
  showSearchLoader,
}) {
  const [showDate, setShowDate] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  return (
    <Modal
      showModal={showModal}
      closeModal={() => {
        closeModal(false);
      }}
      className="md:!hidden"
      title="Where to?"
    >
      <div className="flex justify-center mb-3 mt-6">
        <SearchSelect
          currentNavState={1}
          setCurrentNavState={(currentNavState) => {}}
        ></SearchSelect>
      </div>

      <div className="px-3 mt-6">
        {!showSearch && (
          <div
            onClick={() => {
              setShowSearch(true);
              setShowGuests(false);
              setShowDate(false);
            }}
            className="px-3 py-6 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">Where?</div>
            <div className="font-bold text-sm truncate">
              {search ? search : "I am flexible"}
            </div>
          </div>
        )}

        {showSearch && (
          <div className="px-3 py-2 relative cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full">
            <h1 className="text-xl font-bold mb-2">Where to?</h1>

            <div
              onClick={(e) => {
                setShowLocation(!showLocation);
              }}
              className="mt-4"
            >
              <Search
                handlePropagation={() => {}}
                location={search}
                setLocation={setSearch}
              ></Search>
            </div>

            {showLocation && !search && (
              <PopularLocationsDropdown
                setLocation={setSearch}
                className="-mt-1.5"
              ></PopularLocationsDropdown>
            )}
          </div>
        )}

        {/* {!showDate && (
          <div
            onClick={() => {
              setShowDate(true);
              setShowGuests(false);
              setShowSearch(false);
            }}
            className="px-3 mt-3 cursor-pointer py-6 border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">When?</div>
            <div className="font-bold text-sm">Any week</div>
          </div>
        )}

        {showDate && (
          <div className="px-3 mt-3 py-2 cursor-pointer border border-gray-200 rounded-2xl shadow-lg bg-white w-full">
            <h1 className="text-xl font-bold mb-2">
              {date && date.from && <div>To when?</div>}
              {date && !date.from && !date.to && <div>From when?</div>}
              {!date && <div>From when?</div>}
            </h1>

            <div className="mt-4">
              <DatePicker
                setDate={setDate}
                date={date}
                disableDate={new Date()}
              ></DatePicker>
            </div>
          </div>
        )} */}

        {!showGuests && (
          <div
            onClick={() => {
              setShowGuests(true);
              setShowSearch(false);
              setShowDate(false);
            }}
            className="px-3 mt-3 cursor-pointer py-6 border border-gray-200 rounded-2xl shadow-lg bg-white w-full flex items-center justify-between"
          >
            <div className="text-sm">Who?</div>
            <div className="font-bold text-sm">
              {numOfAdults > 0
                ? `${numOfAdults} ${numOfAdults > 1 ? "Guests" : "Guest"}`
                : "Add a guest"}
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
                    {numOfAdults} {numOfAdults > 1 ? "Guests" : "Guest"}
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <div
                    onClick={() => {
                      if (numOfAdults > 0) {
                        setNumOfAdults(numOfAdults - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                  >
                    -
                  </div>

                  <div
                    onClick={() => {
                      setNumOfAdults(numOfAdults + 1);
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
              setNumOfAdults(0);
              setNumOfChildren(0);
              setSearch("");
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
              "!bg-gradient-to-r !flex gap-1 from-pink-500 via-red-500 to-yellow-500 !text-white "
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
