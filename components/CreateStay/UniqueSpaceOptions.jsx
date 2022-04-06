import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { describesUniqueSpace } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const UniqueSpace = (props) => {
  const dispatch = useDispatch();

  const stay = useSelector((state) => state.stay.typeOfStay);
  const uniqueSpaceDescriptionOptions = useSelector(
    (state) => state.stay.describesUniqueSpace
  );

  const uniqueSpace = [
    "Boathouse (A boat that has been rebuilt to become a house)",
    "Bus (A bus that's been converted in a house)",
    "Lighthouse (A tower that's been converted into a house)",
    "Container house (Wholly or partially made from containers)",
    "Earth house (A house made of mud,stone or other natural materials)",
    "Glasshouse (A house made of glass or has a lot of glass within its structure)",
    "Treehouse (A house built on a tree)",
    "Shed/Barn ( An animal farmhouse that&apos;s been converted into a house)",
    "Cave (Converted into a living space)",
    "Grass house ( A structure mainly made of grass)",
    "A frame house (a house with a sloping roof all the way to the bottom)",
  ];

  const handleCheck = (event) => {
    var updatedList = [...uniqueSpaceDescriptionOptions];
    if (event.target.checked) {
      updatedList = [...uniqueSpaceDescriptionOptions, event.target.value];
    } else {
      updatedList.splice(
        uniqueSpaceDescriptionOptions.indexOf(event.target.value),
        1
      );
    }
    dispatch(describesUniqueSpace(updatedList));
  };
  return (
    <>
      {stay === "uniquespace" && (
        <div className="mt-6 flex flex-col gap-6">
          {uniqueSpace.map((option, index) => (
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

UniqueSpace.propTypes = {};

export default UniqueSpace;
