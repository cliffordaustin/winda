import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import Popup from "../ui/Popup";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

const Amenities = () => {
  const router = useRouter();

  const options = [
    "Swimming Pool",
    "Hot tub",
    "Self Check-in",
    "Sauna",
    "Beachfront",
    "Patio",
    "Terrace",
    "Balcony",
    "Fire pit",
    "Barbecue grill",
    "Outdoor dining area",
    "Gym",
    "Spa",
    "Wifi",
    "TV",
    "Kitchen",
    "Laundry Service",
    "Washer",
    "Free Parking",
    "Paid Parking",
    "Dedicated Working Area",
    "Smoke Alarm",
    "First Aid Kit",
    "Medical services on ground",
    "Carbon Monoxide Alarm",
    "Lockable Rooms",
    "Desks in Rooms",
    "Bar",
    "Restaurant",
    "Giftshop",
    "Photography room",
    "Themed rooms",
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

      // router.push({ query: { ...router.query, type_of_stay: allOptions } });
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
    if (router.query.amenities) {
      setCurrentOptions(router.query.amenities.split(","));
    }
  }, [router.query.amenities]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };
  return (
    <>
      <div className="flex flex-wrap mb-4">
        {options.map((option, index) => (
          <label
            key={index}
            className={styles.amenitiesItem + " " + styles.ratingItem}
          >
            <Checkbox
              checked={containsOption(option)}
              value={option}
              onChange={handleCheck}
            ></Checkbox>
            <div className="flex gap-2 items-center">{option}</div>
          </label>
        ))}
      </div>
    </>
  );
};

Amenities.propTypes = {};

export default Amenities;
