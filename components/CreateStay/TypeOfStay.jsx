import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { typeOfStay, typeOfStayImage } from "../../redux/actions/stay";
import styles from "../../styles/Stay.module.css";

const TypeOfStay = (props) => {
  const dispatch = useDispatch();

  const stay = useSelector((state) => state.stay.typeOfStay);

  const changeTypeOfStay = (type, imageUrl) => {
    dispatch(typeOfStay(type));
    dispatch(typeOfStayImage(imageUrl));
  };
  return (
    <div className="flex">
      <div className="flex flex-col flex-wrap px-6 gap-4">
        <div
          className={
            styles.typeOfStay +
            (stay === "lodge" ? " bg-gray-100 !border-gray-500" : "")
          }
          onClick={() =>
            changeTypeOfStay("lodge", "/images/stay-types/lodging.jpg")
          }
        >
          <h1 className={styles.typeOfStayHeader}>Lodge</h1>
          <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p>
        </div>
        <div
          className={
            styles.typeOfStay +
            (stay === "house" ? " bg-gray-100 !border-gray-500" : "")
          }
          onClick={() =>
            changeTypeOfStay("house", "/images/stay-types/house.jpg")
          }
        >
          <h1 className={styles.typeOfStayHeader}>House</h1>
          <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p>
        </div>
        <div
          className={
            styles.typeOfStay +
            (stay === "campsite" ? " bg-gray-100 !border-gray-500" : "")
          }
          onClick={() =>
            changeTypeOfStay("campsite", "/images/travel-themes/campsites.jpg")
          }
        >
          <h1 className={styles.typeOfStayHeader}>Campsite</h1>
          <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p>
        </div>
        <div
          className={
            styles.typeOfStay +
            (stay === "uniquespace" ? " bg-gray-100 !border-gray-500" : "")
          }
          onClick={() =>
            changeTypeOfStay(
              "uniquespace",
              "/images/stay-types/uniquespace.jpg"
            )
          }
        >
          <h1 className={styles.typeOfStayHeader}>Unique Space</h1>
          <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p>
        </div>
        <div
          className={
            styles.typeOfStay +
            (stay === "boutiquehotel" ? " bg-gray-100 !border-gray-500" : "")
          }
          onClick={() =>
            changeTypeOfStay(
              "boutiquehotel",
              "/images/stay-types/boutiquehotel.jpg"
            )
          }
        >
          <h1 className={styles.typeOfStayHeader}>Boutique Hotel</h1>
          <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p>
        </div>
      </div>
    </div>
  );
};

TypeOfStay.propTypes = {};

export default TypeOfStay;
