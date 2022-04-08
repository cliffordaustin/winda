import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Stay.module.css";
import Input from "../ui/Input";
import Guest from "../Home/Guest";
import Rooms from "./Rooms";
import Switch from "../ui/Switch";

import { useDispatch, useSelector } from "react-redux";

import { updateStayDetails } from "../../redux/actions/stay";

const Details = (props) => {
  const dispatch = useDispatch();

  const stayDetails = useSelector((state) => state.stay.stayDetails);

  const onChange = (event) => {
    dispatch(updateStayDetails({ ...stayDetails, guests: event.target.value }));
  };
  return (
    <div className="mt-4">
      <div className="px-6">
        <div
          className={styles.describesHeader + " !text-xl font-medium md:hidden"}
        >
          Give a detail about your stay
        </div>
        <div className="flex gap-4 mt-12">
          <div
            className={
              styles.typeOfStay +
              " !cursor-text flex flex-col !py-1 justify-center !w-[70%]"
            }
          >
            <h1 className={styles.typeOfStayHeader + " !text-base"}>Guests</h1>
            {/* <p className={styles.typeOfStaySubText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. alias quae?
            unde ullam provident, mollitia doloribus dolorem, placeat quibusdam
            voluptates.
          </p> */}
            <Input
              placeholder="Guests"
              type="number"
              name="guests"
              value={stayDetails.guests}
              className={"w-full !py-2"}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
            ></Input>
          </div>
          <div
            className={
              styles.typeOfStay +
              " !cursor-text flex flex-col justify-center items-center !w-[30%]"
            }
          >
            <h1 className={styles.typeOfStayHeader + " !text-base mb-2"}>
              Rooms
            </h1>
            <Rooms
              rooms={stayDetails.rooms}
              add={() => {
                dispatch(
                  updateStayDetails({
                    ...stayDetails,
                    rooms: stayDetails.rooms + 1,
                  })
                );
              }}
              remove={() => {
                stayDetails.rooms > 0
                  ? dispatch(
                      updateStayDetails({
                        ...stayDetails,
                        rooms: stayDetails.rooms - 1,
                      })
                    )
                  : null;
              }}
            ></Rooms>
          </div>
        </div>

        <div className="flex justify-between mt-12">
          <div
            className={
              styles.typeOfStay +
              " !cursor-text flex flex-col justify-center items-center !w-[30%]"
            }
          >
            <h1 className={styles.typeOfStayHeader + " !text-base mb-2"}>
              Bathrooms
            </h1>
            <Rooms
              rooms={stayDetails.bathrooms}
              add={() => {
                dispatch(
                  updateStayDetails({
                    ...stayDetails,
                    bathrooms: stayDetails.bathrooms + 1,
                  })
                );
              }}
              remove={() => {
                stayDetails.bathrooms > 0
                  ? dispatch(
                      updateStayDetails({
                        ...stayDetails,
                        bathrooms: stayDetails.bathrooms - 1,
                      })
                    )
                  : null;
              }}
            ></Rooms>
          </div>

          <div
            className={
              styles.typeOfStay +
              " !cursor-text flex flex-col justify-center items-center !w-[30%]"
            }
          >
            <h1 className={styles.typeOfStayHeader + " !text-base mb-2"}>
              Beds
            </h1>
            <Rooms
              rooms={stayDetails.beds}
              add={() => {
                dispatch(
                  updateStayDetails({
                    ...stayDetails,
                    beds: stayDetails.beds + 1,
                  })
                );
              }}
              remove={() => {
                stayDetails.beds > 0
                  ? dispatch(
                      updateStayDetails({
                        ...stayDetails,
                        beds: stayDetails.beds - 1,
                      })
                    )
                  : null;
              }}
            ></Rooms>
          </div>

          <div
            className={
              styles.typeOfStay +
              " !cursor-text flex flex-col justify-center items-center !w-[30%]"
            }
          >
            <h1 className={styles.typeOfStayHeader + " !text-base mb-2"}>
              Is ensuite
            </h1>
            <Switch
              switchButton={stayDetails.isEnsuite}
              switchButtonContainer="!w-12 !h-7"
              switchButtonCircle="!w-6 !h-6"
              xVal={18}
              changeSwitchButtonState={() =>
                dispatch(
                  updateStayDetails({
                    ...stayDetails,
                    isEnsuite: !stayDetails.isEnsuite,
                  })
                )
              }
            ></Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

Details.propTypes = {};

export default Details;
