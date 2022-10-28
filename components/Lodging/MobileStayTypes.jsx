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
    "tented_camp",
    "house",
    "campsite",
    "weekend_getaway",
    "romantic_getaway",
    "group_getaway",
    "conservancy",
    "farmstay",
    "national_park_game_reserves",
    "lakefront",
    "beachfront",
    "luxurious",
    "beautiful_view",
    "off_grid",
    "eco_stay",
    "quirky",
    "honeymoon_spot",
    "unique_experiences",
    "traditional",
    "mansion",
    "over_water",
    "stunning_architecture",
    "riverfront",
    "private_house",
    "resort",
    "boutique_hotel",
    "unique_space",
    "unique_location",
    "hotel",
    "cottage",
    "coworking_spot",
    "fast_wifi",
    "locally_owned",
    "community_owned",
    "carbon_neutral",
    "owner_operated",
    "popular",
    "wellness_retreat",
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

      router.push({ query: { ...router.query, tag: allOptions } });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({ query: { ...router.query, tag: allOptions } });
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.tag) {
      setCurrentOptions(router.query.tag.split(","));
    }
  }, [router.query.tag]);

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
            <div className="lowercase">{option.split("_").join(" ")}</div>
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
