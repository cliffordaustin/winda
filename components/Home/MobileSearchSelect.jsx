import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/MobileStyledLink.module.css";

function SearchSelect({ setCurrentNavState, currentNavState }) {
  return (
    <div className="flex items-center gap-8">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(1);
        }}
        className={
          "cursor-pointer md:!text-base font-bold text-white " +
          (currentNavState === 1 ? styles.showLinkLine : styles.link)
        }
      >
        Stays
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(2);
        }}
        className={
          "cursor-pointer md:!text-base font-bold text-white " +
          (currentNavState === 2 ? styles.showLinkLine : styles.link)
        }
      >
        Transport
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(3);
        }}
        className={
          "cursor-pointer md:!text-base font-bold text-white " +
          (currentNavState === 3 ? styles.showLinkLine : styles.link)
        }
      >
        Activities
      </div>
    </div>
  );
}

SearchSelect.propTypes = {
  currentNavState: PropTypes.number.isRequired,
  setCurrentNavState: PropTypes.func.isRequired,
};

export default SearchSelect;
