import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { describesCampsite } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const CampsiteOptions = (props) => {
  const dispatch = useDispatch();

  const stay = useSelector((state) => state.stay.typeOfStay);
  const capsiteDescriptionOptions = useSelector(
    (state) => state.stay.describesCampsite
  );

  const campsiteOptions = [
    "On private property",
    "In a conservancy",
    "In a National Reserve",
    "In a National Park",
    "In a public area",
  ];

  const handleCheck = (event) => {
    var updatedList = [...capsiteDescriptionOptions];
    if (event.target.checked) {
      updatedList = [...capsiteDescriptionOptions, event.target.value];
    } else {
      updatedList.splice(
        capsiteDescriptionOptions.indexOf(event.target.value),
        1
      );
    }
    dispatch(describesCampsite(updatedList));
  };

  return (
    <>
      {stay === "campsite" && (
        <div className="mt-6 flex flex-col gap-6">
          {campsiteOptions.map((option, index) => (
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

CampsiteOptions.propTypes = {};

export default CampsiteOptions;
