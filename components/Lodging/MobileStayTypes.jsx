import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

function MobileStayTypes({ handlePopup, showStayTypesPopup, screenWidth }) {
  const router = useRouter();

  const options = [
    "LODGE",
    "HOUSE",
    "UNIQUE SPACE",
    "BOUTIQUE HOTEL",
    "CAMPSITE",
    "TENTED CAMP",
    "WEEKEND GETAWAY",
    "ROMANTIC GETAWAY",
    "GROUP GETAWAY",
    "CONSERVANCY",
    "NATIONAL PARK/GAME RESERVES",
    "COZY PLACE",
    "LAKEFRONT",
    "BEACHFRONT",
    "LUXURIOUS",
    "BEAUTIFUL VIEW",
    "OFF-GRID",
    "ECO-STAY",
    "QUIRKY",
    "TRADITIONAL",
    "MANSIONS",
    "OVER-WATER",
    "UNIQUE EXPERIENCES",
    "STUNNING ARCHITECTURE",
    "HONEYMOON SPOT",
    "RIVERFRONT",
    "PRIVATE HOUSE",
    "RESORT",
    "FARMSTAY",
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

  useEffect(() => {
    if (router.query.type_of_stay) {
      setCurrentOptions(router.query.type_of_stay.split(","));
    }
  }, [router.query.type_of_stay]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
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
            <div className="lowercase">{option}</div>
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
