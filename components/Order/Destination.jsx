import React, { useState } from "react";
import PropTypes from "prop-types";
import Input from "../ui/Input";
import SearchButtonClose from "../Home/SearchButtonClose";
import styles from "../../styles/StyledLink.module.css";
import Button from "../ui/Button";

import axios from "axios";
import { useRouter } from "next/router";

const Destination = ({ className = "", data }) => {
  const [location, setLocation] = useState("");
  const [currentNavState, setCurrentNavState] = useState(1);
  const [autoCompleteFromSearch, setAutoCompleteFromSearch] = useState([]);

  const router = useRouter();
  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromSearch(response.data.features);
      });
  };

  const searchApi = () => {
    if (location !== "") {
      if (currentNavState === 1) {
        router
          .push({
            pathname: "/stays",
            query: { search: location, fromOrder: "true" },
          })
          .then(() => {
            router.reload();
          });
      } else if (currentNavState === 2) {
        router
          .push({
            pathname: "/experiences",
            query: { search: location, fromOrder: "true" },
          })
          .then(() => {
            router.reload();
          });
      }
    }
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromSearch.length > 0) {
        setLocation(autoCompleteFromSearch[0].place_name);

        setAutoCompleteFromSearch([]);

        if (location !== "") {
          if (currentNavState === 1) {
            router
              .push({
                pathname: "/stays",
                query: {
                  search: autoCompleteFromSearch[0].place_name,
                  fromOrder: "true",
                },
              })
              .then(() => {
                router.reload();
              });
          } else if (currentNavState === 2) {
            router
              .push({
                pathname: "/experiences",
                query: {
                  search: autoCompleteFromSearch[0].place_name,
                  fromOrder: "true",
                },
              })
              .then(() => {
                router.reload();
              });
          }
        }
      }
    }
  };

  const staysSearch = () => {
    router
      .push({
        pathname: "/stays",
        query: { search: data.location, fromOrder: "true" },
      })
      .then(() => {
        router.reload();
      });
  };

  const experiencesSearch = () => {
    router
      .push({
        pathname: "/experiences",
        query: { search: data.location, fromOrder: "true" },
      })
      .then(() => {
        router.reload();
      });
  };
  return (
    <div className={"px-3 py-2 " + className}>
      <div className="flex items-center gap-4 justify-center mb-4">
        <div
          onClick={(event) => {
            event.stopPropagation();
            setCurrentNavState(1);
          }}
          className={
            "cursor-pointer md:!text-base " +
            (currentNavState === 1 ? styles.showLinkLine : styles.link)
          }
        >
          Stays
        </div>

        <div
          onClick={(event) => {
            event.stopPropagation();
            setCurrentNavState(2);
          }}
          className={
            "cursor-pointer md:!text-base " +
            (currentNavState === 2 ? styles.showLinkLine : styles.link)
          }
        >
          Experiences
        </div>
      </div>

      <div className="w-full flex bg-white border border-gray-300 rounded-lg">
        <div className="h-full w-full relative">
          <Input
            placeholder="Where to?"
            type="text"
            name="location"
            value={location}
            className="!rounded-lg border-none !h-full"
            autoComplete="off"
            onChange={(event) => {
              onChange(event);
            }}
            onKeyPress={(event) => {
              keyDownSearch(event);
            }}
          ></Input>

          {autoCompleteFromSearch.length > 0 && (
            <div className="absolute top-full left-0 z-30 rounded-b-xl shadow-md w-full md:w-[350px] py-2 bg-white">
              {autoCompleteFromSearch.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setLocation(item.place_name);
                    setAutoCompleteFromSearch([]);
                  }}
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
        {/* <div className={"bg-white flex items-center"}>
          <SearchButtonClose
            onClick={() => {
              setLocation("");
            }}
          ></SearchButtonClose>
        </div> */}
        <div className={"bg-white flex items-center mr-2"}>
          <Button onClick={searchApi} className="">
            Search
          </Button>
        </div>
      </div>

      <div className="flex mt-5 gap-4 items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <div className="text-sm font-bold text-center">Or jump right to</div>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="mt-4">
        <div
          onClick={staysSearch}
          className="py-4 w-full border border-gray-300 pl-3 cursor-pointer rounded-lg"
        >
          Stays
        </div>
        <div
          onClick={experiencesSearch}
          className="py-4 w-full border border-gray-300 mt-2 pl-3 cursor-pointer rounded-lg"
        >
          Experiences
        </div>
      </div>
    </div>
  );
};

Destination.propTypes = {};

export default Destination;
