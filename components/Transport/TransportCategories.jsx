import React from "react";
import PropTypes from "prop-types";
import Checkbox from "../ui/Checkbox";
import styles from "../../styles/Lodging.module.css";
import checkBoxStyles from "../../styles/Checkbox.module.css";
import { useRouter } from "next/router";

const TransportCategories = ({}) => {
  const router = useRouter();

  return (
    <div>
      <div className="mt-2 mb-4">
        <span className="block font-bold text-base mb-2">Comfort</span>

        <div className={"flex justify-between flex-col gap-1"}>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasAirCondition:
                    router.query.hasAirCondition === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full !gap-2 " +
              (router.query.hasAirCondition === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M20 10q-.425 0-.712-.288Q19 9.425 19 9t.288-.713Q19.575 8 20 8t.712.287Q21 8.575 21 9t-.288.712Q20.425 10 20 10Zm-9 12q-.425 0-.712-.288Q10 21.425 10 21v-2.6l-1.9 1.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l3.3-3.3V14H8.4l-3.3 3.3q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7L5.6 14H3q-.425 0-.712-.288Q2 13.425 2 13t.288-.713Q2.575 12 3 12h2.6l-1.9-1.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L8.4 12H10v-1.6L6.7 7.1q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L10 7.6V5q0-.425.288-.713Q10.575 4 11 4t.713.287Q12 4.575 12 5v2.6l1.9-1.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L12 10.4V12h7q.425 0 .712.287q.288.288.288.713t-.288.712Q19.425 14 19 14h-2.6l1.9 1.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L13.6 14H12v1.6l3.3 3.3q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 18.4V21q0 .425-.287.712Q11.425 22 11 22Zm9-15q-.425 0-.712-.287Q19 6.425 19 6V3q0-.425.288-.713Q19.575 2 20 2t.712.287Q21 2.575 21 3v3q0 .425-.288.713Q20.425 7 20 7Z"
              />
            </svg>

            <span>Air conditioning</span>
          </div>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasOpenRoof:
                    router.query.hasOpenRoof === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full !gap-2 " +
              (router.query.hasOpenRoof === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="m16 6l-1 .75L17.5 10h-4V8.5H12V10H3c-1.11 0-2 .89-2 2v3h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4M6 13.5A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5Z"
              />
            </svg>
            <span>Open roof</span>
          </div>
        </div>
      </div>

      <div className="mt-2 mb-4">
        <span className="block font-bold text-base mb-2">Entertainment</span>

        <div className={"flex justify-between flex-col gap-1"}>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasFm: router.query.hasFm === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasFm === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="m20.25 5.025l-7.898-2.962l-.703 1.873L14.484 5H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.018-.767-1.85-1.75-1.975zM4 19v-7h16v-2H4V7h16l.001 12H4z"
              />
              <circle cx="16.5" cy="15.5" r="2.5" fill="currentColor" />
              <path fill="currentColor" d="M6 15h4.999v2H6z" />
            </svg>

            <span>FM</span>
          </div>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasCd: router.query.hasCd === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasCd === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 48 48"
            >
              <mask id="svgIDa">
                <g fill="none" stroke="#fff" strokeWidth="4">
                  <circle cx="24" cy="24" r="18" />
                  <path
                    strokeLinecap="round"
                    d="M13 24c0-6.075 4.925-11 11-11"
                  />
                  <circle cx="24" cy="24" r="5" fill="#fff" />
                </g>
              </mask>
              <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#svgIDa)" />
            </svg>
            <span>CD</span>
          </div>

          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasBluetooth:
                    router.query.hasBluetooth === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasBluetooth === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m5 7l12 10l-6 5V2l6 5L5 17"
              />
            </svg>
            <span>Bluetooth</span>
          </div>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasAudioInput:
                    router.query.hasAudioInput === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasAudioInput === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M11 4V3c0-.55.45-1 1-1s1 .45 1 1v1h-2m2 5V5h-2v4H9v6c0 1.3.84 2.4 2 2.82V22h2v-4.18c1.16-.42 2-1.52 2-2.82V9h-2Z"
              />
            </svg>
            <span>Audio Input</span>
          </div>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasCruiseControl:
                    router.query.hasCruiseControl === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasCruiseControl === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M22 15c0 2.6-1.2 4.9-3.1 6.3l-.5-.5l-2.1-2.1l1.4-1.4l1.2 1.2c.5-.7.9-1.6 1-2.5H18v-2h1.9c-.2-.9-.5-1.7-1-2.5l-1.2 1.2l-1.4-1.4l1.2-1.2c-.7-.5-1.6-.9-2.5-1V11h-2V9.1c-.9.2-1.7.5-2.5 1l3 3c.2 0 .3-.1.5-.1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-.2 0-.3.1-.5l-3-3c-.5.7-.9 1.6-1 2.5H10v2H8.1c.2.9.5 1.7 1 2.5l1.2-1.2l1.4 1.4l-2.6 2.6C7.2 19.9 6 17.6 6 15a8 8 0 0 1 8-8a8 8 0 0 1 8 8M6.7 5.3L3.4 2L2 3.4l3.3 3.3L4 8h4V4L6.7 5.3Z"
              />
            </svg>

            <span>Cruise Control</span>
          </div>
        </div>
      </div>

      <div className="mt-2 mb-4">
        <span className="block font-bold text-base mb-2">Safety</span>

        <div className={"flex justify-between flex-col gap-1"}>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasOverheadPassengerAirbag:
                    router.query.hasOverheadPassengerAirbag === "true"
                      ? ""
                      : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasOverheadPassengerAirbag === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M14 8a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5m-3.54 7.55L13 18.03l-2 .02l-3.5 3.53L6 20.09l4.46-4.54M17 2c1.08 0 2 .88 2 2c0 1.08-.88 2-2 2c-1.08 0-2-.88-2-2c0-1.08.89-2 2-2m-2.59 13h-2.82l5.7 5.71l1.42-1.42l-4.3-4.29m.71-.71l4.29 4.3l.22.21c.23-.38.37-.8.37-1.3v-8A2.5 2.5 0 0 0 17.5 7A2.5 2.5 0 0 0 15 9.5v4.67l.12.12Z"
              />
            </svg>

            <span>Overhead passenger airbag</span>
          </div>
          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasSideAirbag:
                    router.query.hasSideAirbag === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasSideAirbag === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M176 8c6.6 0 12.4 3.1 14.9 10.09l29.4 73.96l76.1-23.12c6.3-1.9 13.1.21 17.2 5.34c.5.58.9 1.18 1.3 1.81c-17.1 8.24-32.2 20.85-43.5 37.22l-41 59.2c-27.3 8.9-49.8 31-57.8 60.9l-19.9 74l-35.3 32.5c-4.8 4.5-11.9 5.5-17.76 2.7c-5.91-2.9-9.48-9-9.02-15.6l5.59-79.4l-78.65-12.2c-6.48-1-11.689-5.8-13.147-12.2c-1.459-6.4 1.127-13.1 6.527-16.8l65.56-45.1l-39.49-69.12a15.991 15.991 0 0 1 1.39-17.91a15.986 15.986 0 0 1 17.15-5.34l76.15 23.12l29.4-73.96C163.6 11.1 169.4 8 176 8zm208.2 91.67l135.6 35.43c32.7 9.6 56.3 38 59 71.7l6.9 83.9c17.2 13.5 25.6 36.3 19.6 58.7l-35.2 131.4c-4.6 17-23 26.3-39.2 22.6l-15.4-4.1c-17.1-4.6-27.2-22.2-22.7-39.2l8.3-31l-247.3-66.2l-8.2 30.9c-5.5 17.1-22.2 27.2-39.2 22.6l-15.5-4.1c-17.1-4.6-27.2-22.1-22.6-39.2l35.2-131.4c6-22.4 24.7-37.9 46.3-41l47.9-69.2c19.2-27.9 53.9-40.58 86.5-31.83zm-16.5 61.83c-6.6-1.8-13.5.8-17.3 6.3l-32.3 46.7l201.5 54l-4.6-57.4c-.5-5.9-5.2-11.5-11.8-13.3l-135.5-36.3zm-99.4 147.3c12.8 3.4 26-4.2 29.4-17c3.5-12.8-4.1-25.9-16.9-29.4c-13.7-3.4-26 4.2-29.4 17c-3.5 12.8 4.1 26 16.9 29.4zM528 328.7c-12.8-3.4-25.9 4.2-29.4 17c-3.4 12.8 4.2 25.9 17 29.4c12.8 3.4 26-4.2 29.4-17c3.4-12.8-4.2-26-17-29.4z"
              />
            </svg>

            <span>Side airbag</span>
          </div>

          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasPowerWindows:
                    router.query.hasPowerWindows === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasPowerWindows === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
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
                d="M20.253 4.004c.966 0 1.75.784 1.75 1.75V18.25a1.75 1.75 0 0 1-1.75 1.75h-7.248a1.79 1.79 0 0 1-.255-.018V4.023a1.79 1.79 0 0 1 .255-.019h7.248Zm-2.081 5.411a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Zm-7.167-5.413c.084 0 .166.006.246.017V19.98c-.08.011-.162.017-.246.017H3.758a1.75 1.75 0 0 1-1.75-1.75V5.752c0-.967.783-1.75 1.75-1.75h7.247ZM7.172 9.415a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Z"
              />
            </svg>

            <span>Power windows</span>
          </div>

          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasPowerLocks:
                    router.query.hasPowerLocks === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasPowerLocks === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Power locks</span>
          </div>

          <div
            onClick={() => {
              router.push({
                query: {
                  ...router.query,
                  hasPowerMirrors:
                    router.query.hasPowerMirrors === "true" ? "" : "true",
                },
              });
            }}
            className={
              styles.ratingItem +
              " !w-full " +
              (router.query.hasPowerMirrors === "true"
                ? "!bg-blue-700 !bg-opacity-20 text-blue-800"
                : "")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path d="M5 8h14v6h-3v2h5V6H3v10h5v-2H5V8Z" />
                <path d="M16.33 19L12 13l-4.33 6h8.66Z" />
              </g>
            </svg>
            <span>Power mirrors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

TransportCategories.propTypes = {};

export default TransportCategories;
