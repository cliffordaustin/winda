import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/Stay.module.css";
import Input from "../ui/Input";
import Guest from "../Home/Guest";
import Rooms from "./Rooms";
import Switch from "../ui/Switch";

const Details = (props) => {
  const [guests, setGuests] = useState("");

  const [state, setState] = useState({
    rooms: 0,
    bathrooms: 0,
    beds: 0,
    isEnsuite: false,
  });

  const onChange = (event) => {
    setGuests(event.target.value);
  };
  return (
    <div className="mt-20">
      <div className="px-6 mt-4">
        <div
          className={styles.describesHeader + " !text-xl font-medium md:hidden"}
        >
          Give a detail about your stay
        </div>
        <div className="flex gap-4">
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
              value={guests}
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
              rooms={state.rooms}
              add={() => {
                setState({ ...state, rooms: state.rooms + 1 });
              }}
              remove={() => {
                state.rooms > 0
                  ? setState({ ...state, rooms: state.rooms - 1 })
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
              rooms={state.bathrooms}
              add={() => {
                setState({ ...state, bathrooms: state.bathrooms + 1 });
              }}
              remove={() => {
                state.bathrooms > 0
                  ? setState({ ...state, bathrooms: state.bathrooms - 1 })
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
              rooms={state.beds}
              add={() => {
                setState({ ...state, beds: state.beds + 1 });
              }}
              remove={() => {
                state.beds > 0
                  ? setState({ ...state, beds: state.beds - 1 })
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
              switchButton={state.isEnsuite}
              switchButtonContainer="!w-12 !h-7"
              switchButtonCircle="!w-6 !h-6"
              xVal={18}
              changeSwitchButtonState={() =>
                setState({ ...state, isEnsuite: !state.isEnsuite })
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
