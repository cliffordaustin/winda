import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import Popup from "../ui/Popup";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

const ThemeFilter = (props) => {
  const router = useRouter();

  const options = [
    "Coworking Spots",
    "Campsites",
    "Weekend Getaways",
    "Romantic Getaways",
    "Group Retreats",
    "Conservancies",
    "National Parks",
    "Lake House",
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

      // router.push({ query: { ...router.query, theme: allOptions } });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      // router.push({ query: { ...router.query, theme: allOptions } });
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.theme) {
      setCurrentOptions(router.query.theme.split(","));
    }
  }, [router.query.theme]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option, index) => (
        <label
          key={index}
          className={
            styles.tag +
            (containsOption(option)
              ? " bg-blue-500 hover:!bg-blue-500 text-white"
              : "")
          }
        >
          <div className="hidden">
            <Checkbox
              checked={containsOption(option)}
              value={option}
              onChange={handleCheck}
            ></Checkbox>
          </div>
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

ThemeFilter.propTypes = {};

export default ThemeFilter;
