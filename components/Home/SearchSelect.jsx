import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/StyledLink.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

function SearchSelect({ setCurrentNavState, currentNavState, isHomePage }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-8">
      <Link
        href={
          !isHomePage && router.query.trip
            ? `/stays?trip=${router.query.trip}&group_trip=${router.query.group_trip}`
            : `/stays`
        }
      >
        <a>
          <div
            onClick={(event) => {
              event.stopPropagation();
              setCurrentNavState(1);
            }}
            className={
              "cursor-pointer md:!text-base " +
              (currentNavState === 1 ? styles.showLinkLine : styles.link)
            }
          >
            Stays
          </div>
        </a>
      </Link>

      <Link
        href={
          !isHomePage && router.query.trip
            ? `/activities?trip=${router.query.trip}&group_trip=${router.query.group_trip}`
            : `/activities`
        }
      >
        <a>
          <div
            onClick={(event) => {
              event.stopPropagation();
              setCurrentNavState(1);
            }}
            className={
              "cursor-pointer md:!text-base " +
              (currentNavState === 3 ? styles.showLinkLine : styles.link)
            }
          >
            Activities
          </div>
        </a>
      </Link>

      {/* <Link
        href={
          !isHomePage && router.query.trip
            ? `/transport?trip=${router.query.trip}&group_trip=${router.query.group_trip}`
            : `/transport`
        }
      >
        <a>
          <div
            onClick={(event) => {
              event.stopPropagation();
              setCurrentNavState(1);
            }}
            className={
              "cursor-pointer md:!text-base " +
              (currentNavState === 2 ? styles.showLinkLine : styles.link)
            }
          >
            Transport
          </div>
        </a>
      </Link> */}
    </div>
  );
}

SearchSelect.propTypes = {
  currentNavState: PropTypes.number.isRequired,
  setCurrentNavState: PropTypes.func.isRequired,
};

export default SearchSelect;
