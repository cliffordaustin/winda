import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

function MobileStayTypes({ handlePopup, showStayTypesPopup, screenWidth }) {
  const router = useRouter();

  const options = [
    "lodge",
    "tented camp",
    "house",
    "boutique hotel",
    "hotel",
    "campsite",
    "conservancy",
    "farmstay",
    "national park/Game reserves",
    "lakefront",
    "beachfront",
    "luxurious",
    "unique space",
    "off-grid",
    "eco-stay",
    "quirky",
    "unique experiences",
    "private house",
    "resort",
  ];

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

      router.push({
        query: { ...router.query, type_of_stay: allOptions.toUpperCase() },
      });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({
        query: { ...router.query, type_of_stay: allOptions.toUpperCase() },
      });
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.type_of_stay) {
      setCurrentOptions(router.query.type_of_stay.split(","));
    }
  }, [router.query.type_of_stay]);

  const containsOption = (option) => {
    return currentOptions.includes(option.toUpperCase());
  };

  return (
    <>
      <div className={"flex justify-between flex-wrap"}>
        {options.map((option, index) => (
          <label key={index} className={styles.ratingItem + " !w-[48%]"}>
            <Checkbox
              checked={containsOption(option)}
              value={option}
              onChange={handleCheck}
            ></Checkbox>
            <div className="capitalize">{option.split("_").join(" ")}</div>
          </label>
        ))}
      </div>
    </>
  );
}

MobileStayTypes.propTypes = {
  screenWidth: PropTypes.number,
  showStayTypesPopup: PropTypes.bool,
  handlePopup: PropTypes.func,
};

export default MobileStayTypes;
