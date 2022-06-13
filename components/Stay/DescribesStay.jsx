import React, { useState } from "react";
import PropTypes from "prop-types";
import ListItem from "../ui/ListItem";

function DescribesStay({ stay }) {
  const [state, setState] = useState({
    showMoreOfHouse: false,
    showMoreOfLodge: false,
    showMoreOfUniqueSpace: false,
    showMoreOfBoutiqueHotel: false,
    showMoreOfCampsite: false,
  });

  return (
    <div className="">
      <div className="mb-3">
        <span className="font-bold text-xl">Best describe as</span>
      </div>
      {stay.type_of_stay === "HOUSE" && !state.showMoreOfHouse && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_house.slice(0, 5).map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "HOUSE" &&
        !state.showMoreOfHouse &&
        stay.best_describes_house.length > 5 && (
          <div
            onClick={() => {
              setState({ ...state, showMoreOfHouse: true });
            }}
            className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
          >
            <span>Read more</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-1"
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

      {stay.type_of_stay === "HOUSE" && state.showMoreOfHouse && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_house.map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}
      {stay.type_of_stay === "HOUSE" && state.showMoreOfHouse && (
        <div
          onClick={() => {
            setState({ ...state, showMoreOfHouse: false });
          }}
          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
        >
          <span>Read less</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {stay.type_of_stay === "LODGE" && !state.showMoreOfLodge && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_lodge.slice(0, 5).map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "LODGE" &&
        !state.showMoreOfLodge &&
        stay.best_describes_lodge.length > 5 && (
          <div
            onClick={() => {
              setState({ ...state, showMoreOfLodge: true });
            }}
            className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
          >
            <span>Read more</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-1"
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

      {stay.type_of_stay === "LODGE" && state.showMoreOfLodge && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_lodge.map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "LODGE" && state.showMoreOfLodge && (
        <div
          onClick={() => {
            setState({ ...state, showMoreOfLodge: false });
          }}
          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
        >
          <span>Read less</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {stay.type_of_stay === "UNIQUE SPACE" && !state.showMoreOfUniqueSpace && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_unique_space
            .slice(0, 5)
            .map((description, index) => (
              <div key={index} className="md:w-[48%] w-full">
                <ListItem>{description}</ListItem>
              </div>
            ))}
        </div>
      )}

      {stay.type_of_stay === "UNIQUE SPACE" &&
        !state.showMoreOfUniqueSpace &&
        stay.best_describes_unique_space.length > 5 && (
          <div
            onClick={() => {
              setState({ ...state, showMoreOfUniqueSpace: true });
            }}
            className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
          >
            <span>Read more</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-1"
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

      {stay.type_of_stay === "UNIQUE SPACE" && state.showMoreOfUniqueSpace && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_unique_space.map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "UNIQUE SPACE" && state.showMoreOfUniqueSpace && (
        <div
          onClick={() => {
            setState({ ...state, showMoreOfUniqueSpace: false });
          }}
          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
        >
          <span>Read less</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {stay.type_of_stay === "CAMPSITE" && !state.showMoreOfCampsite && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_campsite
            .slice(0, 5)
            .map((description, index) => (
              <div key={index} className="md:w-[48%] w-full">
                <ListItem>{description}</ListItem>
              </div>
            ))}
        </div>
      )}

      {stay.type_of_stay === "CAMPSITE" &&
        !state.showMoreOfCampsite &&
        stay.best_describes_campsite.length > 5 && (
          <div
            onClick={() => {
              setState({ ...state, showMoreOfCampsite: true });
            }}
            className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
          >
            <span>Read more</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-1"
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

      {stay.type_of_stay === "CAMPSITE" && state.showMoreOfCampsite && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_campsite.map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "CAMPSITE" && state.showMoreOfCampsite && (
        <div
          onClick={() => {
            setState({ ...state, showMoreOfCampsite: false });
          }}
          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
        >
          <span>Read less</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {stay.type_of_stay === "BOUTIQUE HOTEL" &&
        !state.showMoreOfBoutiqueHotel && (
          <div className="flex flex-wrap gap-2 justify-between px-2">
            {stay.best_describes_boutique_hotel
              .slice(0, 5)
              .map((description, index) => (
                <div key={index} className="md:w-[48%] w-full">
                  <ListItem>{description}</ListItem>
                </div>
              ))}
          </div>
        )}

      {stay.type_of_stay === "BOUTIQUE HOTEL" &&
        !state.showMoreOfBoutiqueHotel &&
        stay.best_describes_boutique_hotel.length > 5 && (
          <div
            onClick={() => {
              setState({ ...state, showMoreOfBoutiqueHotel: true });
            }}
            className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
          >
            <span>Read more</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-1"
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

      {stay.type_of_stay === "BOUTIQUE HOTEL" && state.showMoreOfBoutiqueHotel && (
        <div className="flex flex-wrap gap-2 justify-between px-2">
          {stay.best_describes_boutique_hotel.map((description, index) => (
            <div key={index} className="md:w-[48%] w-full">
              <ListItem>{description}</ListItem>
            </div>
          ))}
        </div>
      )}

      {stay.type_of_stay === "BOUTIQUE HOTEL" && state.showMoreOfBoutiqueHotel && (
        <div
          onClick={() => {
            setState({ ...state, showMoreOfBoutiqueHotel: false });
          }}
          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
        >
          <span>Read less</span>{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

DescribesStay.propTypes = {
  stay: PropTypes.object,
};

export default DescribesStay;
