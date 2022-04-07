import React, { useState } from "react";
import PropTypes from "prop-types";
import Switch from "../ui/Switch";
import Input from "../ui/Input";
import styles from "../../styles/Stay.module.css";

const Pricing = (props) => {
  const [state, setState] = useState({
    pricingPerPersonType: true,
    pricingPerRoomType: false,
    pricingWholePlaceType: false,

    princingPerPerson: "",
    princingPerRoom: "",
    pricingWholePlace: "",
  });

  const onChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  return (
    <div className="px-6 mt-4">
      <div
        className={styles.describesHeader + " !text-xl font-medium md:hidden"}
      >
        Select a pricing option
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <div className="flex gap-2 items-center">
          <Switch
            switchButton={state.pricingPerPersonType}
            changeSwitchButtonState={() =>
              setState({
                ...state,
                pricingPerPersonType: !state.pricingPerPersonType,
              })
            }
            switchButtonContainer="!w-12 !h-7"
            switchButtonCircle="!w-6 !h-6"
            xVal={18}
          ></Switch>
          <div>Pricing per person</div>
        </div>
        {state.pricingPerPersonType && (
          <div className="">
            <Input
              placeholder="Price"
              type="number"
              name="princingPerPerson"
              value={state.princingPerPerson}
              className={"w-full !py-2"}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
            ></Input>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt
              nostrum natus quibusdam odio molestias fugit, unde et nemo iusto,
              laudantium nobis magnam cum.
            </p>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Switch
            switchButton={state.pricingPerRoomType}
            changeSwitchButtonState={() =>
              setState({
                ...state,
                pricingPerRoomType: !state.pricingPerRoomType,
              })
            }
            switchButtonContainer="!w-12 !h-7"
            switchButtonCircle="!w-6 !h-6"
            xVal={18}
          ></Switch>
          <div>Pricing per room</div>
        </div>
        {state.pricingPerRoomType && (
          <div className="">
            <Input
              placeholder="Price"
              type="number"
              name="princingPerRoom"
              value={state.princingPerRoom}
              className={"w-full !py-2"}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
            ></Input>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt
              nostrum natus quibusdam odio molestias fugit, unde et nemo iusto,
              laudantium nobis magnam cum.
            </p>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Switch
            switchButton={state.pricingWholePlaceType}
            changeSwitchButtonState={() =>
              setState({
                ...state,
                pricingWholePlaceType: !state.pricingWholePlaceType,
              })
            }
            switchButtonContainer="!w-12 !h-7"
            switchButtonCircle="!w-6 !h-6"
            xVal={18}
          ></Switch>
          <div>Pricing for the whole place</div>
        </div>
        {state.pricingWholePlaceType && (
          <div className="">
            <Input
              placeholder="Price"
              type="number"
              name="pricingWholePlace"
              value={state.pricingWholePlace}
              className={"w-full !py-2"}
              autoComplete="off"
              onChange={(event) => {
                onChange(event);
              }}
            ></Input>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt
              nostrum natus quibusdam odio molestias fugit, unde et nemo iusto,
              laudantium nobis magnam cum.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

Pricing.propTypes = {};

export default Pricing;
