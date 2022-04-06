import React from "react";
import { useState } from "react";
import MapBox from "./Map";
import Input from "../ui/Input";
import styles from "../../styles/Search.module.css";
import stayStyles from "../../styles/Stay.module.css";

function Location() {
  const [location, setLocation] = useState("");

  const onChange = (event) => {
    setLocation(event.target.value);
  };
  return (
    <div className="h-[98%] relative">
      <div className="w-[80%] absolute top-32 left-2/4 right-2/4 -translate-x-2/4 z-20">
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={
            "w-full relative !py-4 !justify-between hover:!bg-gray-50 bg-white rounded-full " +
            styles.searchInput +
            " " +
            stayStyles.stepWebkitSetting
          }
        >
          <Input
            placeholder="Where is your location?"
            type="text"
            name="location"
            value={location}
            className={styles.input + " ml-3"}
            autoComplete="off"
            onChange={(event) => {
              onChange(event);
            }}
          ></Input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-6 top-2/4 -translate-y-2/4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <MapBox></MapBox>
    </div>
  );
}

export default Location;
