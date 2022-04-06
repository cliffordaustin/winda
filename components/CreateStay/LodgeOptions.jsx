import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { describesLodge } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const LodgeOptions = (props) => {
  const dispatch = useDispatch();

  const lodgeDescriptionOptions = useSelector(
    (state) => state.stay.describesLodge
  );

  const lodgeOptions = [
    "Tented camp (You've got a number of tents for guests to sleep in out in the wild)",
    "Permanent structures (You've built rooms for guests to stay in out in the wild)",
    "Mobile camp (You've got a tented camp that moves to different locations)",
    "Part-tented/Part permanent structures",
  ];

  const handleCheck = (event) => {
    var updatedList = [...lodgeDescriptionOptions];
    if (event.target.checked) {
      updatedList = [...lodgeDescriptionOptions, event.target.value];
    } else {
      updatedList.splice(
        lodgeDescriptionOptions.indexOf(event.target.value),
        1
      );
    }
    dispatch(describesLodge(updatedList));
  };

  const stay = useSelector((state) => state.stay.typeOfStay);
  return (
    <>
      {stay === "lodge" && (
        <div className="mt-6 flex flex-col gap-6">
          {lodgeOptions.map((option, index) => (
            <div key={index} className="flex gap-4 items-center">
              <Checkbox value={option} onChange={handleCheck}></Checkbox>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

LodgeOptions.propTypes = {};

export default LodgeOptions;
