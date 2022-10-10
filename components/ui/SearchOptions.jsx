import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

function SearchOptions(props) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center rounded-full overflow-hidden">
      <div
        onClick={(e) => {
          e.stopPropagation();
          router.push(
            {
              query: {
                ...router.query,
                search: "1",
              },
            },
            undefined,
            { shallow: true }
          );
        }}
        className={
          "px-3 py-2 font-bold text-sm cursor-pointer rounded-full " +
          (router.query.search === "1" ||
          !router.query.search ||
          (router.query.search !== "2" && router.query.search !== "3")
            ? "text-white bg-red-500 transition-all duration-150 ease-linear"
            : "")
        }
      >
        Curated trips
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();

          router.push(
            {
              query: {
                ...router.query,
                search: "2",
              },
            },
            undefined,
            { shallow: true }
          );
        }}
        className={
          "px-3 py-2 font-bold text-sm cursor-pointer rounded-full " +
          (router.query.search === "2"
            ? "text-white bg-red-500 transition-all duration-150 ease-linear"
            : "")
        }
      >
        Stays
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();

          router.push(
            {
              query: {
                ...router.query,
                search: "3",
              },
            },
            undefined,
            { shallow: true }
          );
        }}
        className={
          "px-3 py-2 font-bold text-sm cursor-pointer rounded-full " +
          (router.query.search === "3"
            ? "text-white bg-red-500 transition-all duration-150 ease-linear"
            : "")
        }
      >
        Activities
      </div>
    </div>
  );
}

SearchOptions.propTypes = {};

export default SearchOptions;
