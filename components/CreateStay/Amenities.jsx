import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Stay.module.css";
import AmenitiesOptions from "./AmenitiesOptions";

const Amenities = (props) => {
  return (
    <div className="px-6">
      <h1 className={styles.describesHeader}>What amenities do you have?</h1>
      <AmenitiesOptions></AmenitiesOptions>
    </div>
  );
};

Amenities.propTypes = {};

export default Amenities;
