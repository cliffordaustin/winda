import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import Popup from "../ui/Popup";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

const TypeOfActivities = () => {
  const router = useRouter();

  const options = [
    "Game Drives",
    "Walking Safaris",
    "Horseback Riding",
    "Watersports",
    "Sailing",
    "Cultural",
    "Bush Meals",
    "Sundowners",
    "Eco Tours",
    "Spa",
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

      // router.push({ query: { ...router.query, type_of_activities: allOptions } });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      // router.push({ query: { ...router.query, type_of_stay: allOptions } });
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.type_of_activities) {
      setCurrentOptions(router.query.type_of_activities.split(","));
    }
  }, [router.query.type_of_activities]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };
  return (
    <>
      <div className="flex justify-between flex-wrap mb-4">
        {options.map((option, index) => (
          <label key={index} className={styles.amenitiesItem}>
            <div className="flex gap-2 items-center">{option}</div>
            <Checkbox
              checked={containsOption(option)}
              value={option}
              onChange={handleCheck}
            ></Checkbox>
          </label>
        ))}
      </div>
    </>
  );
};

TypeOfActivities.propTypes = {};

export default TypeOfActivities;
