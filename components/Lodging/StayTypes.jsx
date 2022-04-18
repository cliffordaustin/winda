import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import Popup from "../ui/Popup";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

function StayTypes({ handlePopup, showStayTypesPopup, screenWidth }) {
  const router = useRouter();

  const options = [
    "HOUSE",
    "CAMPSITE",
    "UNIQUE SPACE",
    "BOUTIQUE HOTEL",
    "LODGE",
  ];

  const [deselectAll, setDeselectAll] = useState(false);

  //   const [activeOptions, setActiveOptions] = useState([]);

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleCheck = (event) => {
    var updatedList = [...currentOptions];
    if (event.target.checked) {
      updatedList = [...currentOptions, event.target.value];
      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({ query: { ...router.query, type_of_stay: allOptions } });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({ query: { ...router.query, type_of_stay: allOptions } });
    }
    setCurrentOptions(updatedList);
  };

  const handleDeselectAll = (e) => {
    if (e.target.checked) {
      const allOptions = options
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim();
      router.push({ query: { ...router.query, type_of_stay: allOptions } });
    } else {
      setCurrentOptions([]);
      router.push({ query: { ...router.query, type_of_stay: "" } });
    }
  };

  useEffect(() => {
    if (router.query.type_of_stay) {
      setCurrentOptions(router.query.type_of_stay.split(","));
    }
  }, [router.query.type_of_stay]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  const allItemsSelected = () => {
    return currentOptions.length === options.length;
  };

  return (
    <>
      <div
        onClick={(event) => {
          event.stopPropagation();
          handlePopup();
        }}
        className={
          "bg-gray-100 hidden relative cursor-pointer rounded-md border border-gray-200 py-2 px-2 lg:flex gap-1 items-center justify-center"
        }
      >
        <span className="block">All stay types</span>
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
          showPopup={showStayTypesPopup}
        >
          <label className={styles.ratingItem}>
            <Checkbox
              checked={allItemsSelected()}
              onChange={handleDeselectAll}
            ></Checkbox>
            <div className="lowercase">select all</div>
          </label>
          {options.map((option, index) => (
            <label key={index} className={styles.ratingItem}>
              <Checkbox
                checked={containsOption(option)}
                value={option}
                onChange={handleCheck}
              ></Checkbox>
              <div className="lowercase">{option}</div>
            </label>
          ))}
        </Popup>
      </div>
    </>
  );
}

StayTypes.propTypes = {
  screenWidth: PropTypes.number,
  showStayTypesPopup: PropTypes.bool,
  handlePopup: PropTypes.func,
};

export default StayTypes;
