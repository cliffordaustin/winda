import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/StyledLink.module.css";
import { useRouter } from "next/router";

function SearchSelect({ setCurrentNavState, currentNavState, isHomePage }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-8">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(1);
          if (!isHomePage && !router.query.trip) {
            router.push("/stays");
          } else if (!isHomePage && router.query.trip) {
            router.push({
              pathname: `/stays`,
              query: {
                trip: router.query.trip,
                group_trip: router.query.group_trip,
              },
            });
          }
        }}
        className={
          "cursor-pointer md:!text-base " +
          (currentNavState === 1 ? styles.showLinkLine : styles.link)
        }
      >
        Stays
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(3);

          if (!isHomePage && !router.query.trip) {
            router.push("/experiences");
          } else if (!isHomePage && router.query.trip) {
            router.push({
              pathname: `/experiences`,
              query: {
                trip: router.query.trip,
                group_trip: router.query.group_trip,
              },
            });
          }
        }}
        className={
          "cursor-pointer md:!text-base " +
          (currentNavState === 3 ? styles.showLinkLine : styles.link)
        }
      >
        Experiences
      </div>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setCurrentNavState(2);
          if (!isHomePage && !router.query.trip) {
            router.push("/transport");
          } else if (!isHomePage && router.query.trip) {
            router.push({
              pathname: `/transport`,
              query: {
                trip: router.query.trip,
                group_trip: router.query.group_trip,
              },
            });
          }
        }}
        className={
          "cursor-pointer md:!text-base " +
          (currentNavState === 2 ? styles.showLinkLine : styles.link)
        }
      >
        Transport
      </div>
    </div>
  );
}

SearchSelect.propTypes = {
  currentNavState: PropTypes.number.isRequired,
  setCurrentNavState: PropTypes.func.isRequired,
};

export default SearchSelect;
