import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/Stay.module.css";
import Checkbox from "../ui/Checkbox";
import LodgeOptions from "./LodgeOptions";
import HouseOptions from "./HouseOptions";
import CampsiteOptions from "./CampsiteOptions";
import UniqueSpaceOption from "./UniqueSpaceOptions";
import BoutiqueHotelOption from "./BoutiqueHotelOptions";

const DescribeStay = (props) => {
  const stay = useSelector((state) => state.stay.typeOfStay);
  return (
    <div className="mt-10 px-6 relative overflow-y-scroll">
      {stay === "lodge" && (
        <div className={styles.describesHeader}>
          What best describes your{" "}
          <span className={styles.describeSubHeader}>Lodge?</span>
        </div>
      )}
      {stay === "house" && (
        <div className={styles.describesHeader}>
          What best describes your{" "}
          <span className={styles.describeSubHeader}>House?</span>
        </div>
      )}
      {stay === "uniquespace" && (
        <div className={styles.describesHeader}>
          What best describes your{" "}
          <span className={styles.describeSubHeader}>Unique Space?</span>
        </div>
      )}
      {stay === "boutiquehotel" && (
        <div className={styles.describesHeader}>
          What best describes your{" "}
          <span className={styles.describeSubHeader}>Boutique Hotel?</span>
        </div>
      )}
      {stay === "campsite" && (
        <div className={styles.describesHeader}>
          What best describes your{" "}
          <span className={styles.describeSubHeader}>Campsite?</span>
        </div>
      )}

      {stay === "lodge" && <LodgeOptions></LodgeOptions>}
      {stay === "house" && <HouseOptions></HouseOptions>}
      {stay === "uniquespace" && <UniqueSpaceOption></UniqueSpaceOption>}
      {stay === "boutiquehotel" && <BoutiqueHotelOption></BoutiqueHotelOption>}
      {stay === "campsite" && <CampsiteOptions></CampsiteOptions>}
    </div>
  );
};

DescribeStay.propTypes = {};

export default DescribeStay;
