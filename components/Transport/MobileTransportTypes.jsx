import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

function MobileTransportTypes({
  handlePopup,
  showTransportTypesPopup,
  screenWidth,
}) {
  const router = useRouter();

  const options = ["LARGE 4x4", "SMALL 4x4", "VAN", "SEDAN", "SMALL CAR"];

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

      router.push({
        query: { ...router.query, type_of_car: allOptions },
      });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({
        query: { ...router.query, type_of_car: allOptions },
      });
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.type_of_car) {
      setCurrentOptions(router.query.type_of_car.split(","));
    }
  }, [router.query.type_of_car]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  return (
    <>
      <div className={"flex justify-between flex-col gap-1"}>
        {options.map((option, index) => (
          <label
            key={index}
            className={
              styles.ratingItem +
              " !w-full !gap-2 " +
              (containsOption(option)
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
            <input
              type="checkbox"
              checked={containsOption(option)}
              value={option}
              onChange={handleCheck}
              className="hidden"
            />
            {option === "LARGE 4x4" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m18 14l.79.1l-.02.23l.47.17l.15-.16c.5.26.93.66 1.21 1.16l-.17.17l.2.45l.23-.02c.09.29.14.59.14.9l-.1.78l-.24-.01l-.19.47l.19.15c-.27.51-.66.93-1.16 1.21l-.17-.18l-.46.2l.02.24c-.28.09-.58.14-.89.14l-.79-.1l.01-.25l-.46-.18l-.16.19c-.5-.27-.93-.66-1.21-1.16l.18-.18l-.2-.46l-.24.02c-.08-.28-.13-.57-.13-.88l.11-.8l.23.01l.19-.46l-.18-.15c.27-.51.65-.92 1.15-1.21l.17.17l.46-.2l-.02-.22c.28-.09.58-.14.89-.14m0 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5s1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5M6 14l.79.1l-.02.23l.47.17l.15-.16c.5.26.93.66 1.21 1.16l-.17.17l.2.45l.23-.02c.09.29.14.59.14.9l-.1.78l-.25-.01l-.18.47l.19.15c-.27.51-.66.93-1.16 1.21l-.17-.18l-.46.2l.02.24c-.28.09-.58.14-.89.14l-.79-.1l.01-.25l-.46-.18l-.16.19c-.5-.27-.93-.66-1.21-1.16l.18-.18l-.2-.46l-.24.02C3.05 17.6 3 17.31 3 17l.11-.8l.23.01l.19-.46l-.18-.15c.27-.51.65-.92 1.15-1.21l.17.17l.46-.2l-.02-.22c.28-.09.58-.14.89-.14m0 1.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5s1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5M16 6l3 4h2c1.11 0 2 .89 2 2v3h-2c0-1.66-1.34-3-3-3s-3 1.34-3 3H9c0-1.66-1.34-3-3-3s-3 1.34-3 3H1v-5h9.5V6H16m-4 1.5V10h5.46L15.5 7.5H12Z"
                />
              </svg>
            )}

            {option === "SMALL 4x4" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M16 6h-5.5v4H1v5h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4m-4 1.5h3.5l1.96 2.5H12V7.5m-6 6A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5Z"
                />
              </svg>
            )}

            {option === "VAN" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M592 384h-16c0 53-43 96-96 96c-53.9 0-96-43-96-96H256c0 53-43 96-96 96c-53.9 0-96-43-96-96H48c-26.51 0-48-21.5-48-48V104c0-39.76 32.24-72 72-72h393.1c18 0 36.8 8.34 49 22.78l110 131.72c10.6 10.6 15.9 26.1 15.9 41.2V336c0 26.5-21.5 48-48 48zM64 192h96V96H72c-4.42 0-8 3.58-8 8v88zm481.1 0l-80-96H384v96h161.1zM320 192V96h-96v96h96zm160 144c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48zm-320 96c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48z"
                />
              </svg>
            )}

            {option === "SEDAN" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32h181.2c40.8 0 77.1 25.78 90.6 64.29l35.2 100.51c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.33 32-32 32H32c-17.67 0-32-14.3-32-32V256c0-26.7 16.36-49.6 39.61-59.2zm69.49-4.8h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4L109.1 192zM96 256c-17.67 0-32 14.3-32 32s14.33 32 32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32zm320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
                />
              </svg>
            )}

            {option === "SMALL CAR" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 36 36"
              >
                <path
                  fill="currentColor"
                  d="M26.87 14.28a22.36 22.36 0 0 0-7.22-7.38a9.64 9.64 0 0 0-9-.7a8.6 8.6 0 0 0-4.82 6.4c-.08.49-.15 1-.21 1.4h-1A2.59 2.59 0 0 0 2 16.59v8.55a.86.86 0 0 0 .86.86h1.73v-.39a5.77 5.77 0 0 1 7.71-5.45l-1 1a4.56 4.56 0 0 0-4.34 1.58a3 3 0 0 0-.63.93A4.5 4.5 0 1 0 14.82 26h5.48v-.39a5.77 5.77 0 0 1 7.7-5.45l-1 1a4.56 4.56 0 0 0-4.34 1.58a3 3 0 0 0-.63.93a4.5 4.5 0 1 0 8.5 2.33h2.61a.86.86 0 0 0 .86-.86v-1.78a9.39 9.39 0 0 0-7.13-9.08ZM12 14H8c0-.35.1-.71.16-1.07a6.52 6.52 0 0 1 3.87-5Zm-1.64 14.36a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5ZM19 19h-3v-2h3Zm-6-5V7.47a8.16 8.16 0 0 1 5.4 1.15A19.15 19.15 0 0 1 24 14Zm13.06 14.36a2.5 2.5 0 1 1 2.5-2.5a2.5 2.5 0 0 1-2.5 2.5Z"
                />
                <path fill="none" d="M0 0h36v36H0z" />
              </svg>
            )}
            <div className="lowercase">{option}</div>
          </label>
        ))}
      </div>
    </>
  );
}

MobileTransportTypes.propTypes = {
  screenWidth: PropTypes.number,
  showTransportTypesPopup: PropTypes.bool,
  handlePopup: PropTypes.func,
};

export default MobileTransportTypes;
