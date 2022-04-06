import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { describesHouse } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const HouseOptions = (props) => {
  const dispatch = useDispatch();

  const stay = useSelector((state) => state.stay.typeOfStay);

  const houseDescriptionOptions = useSelector(
    (state) => state.stay.describesHouse
  );

  const houseOptions = [
    "Residential home (In a residential neighborhood)",
    "Villa (Luxury home with a garden, lake, beachfront, pool etc.)",
    "Cottage (A small and cosy house built in the countryside that may have a garden, lake etc.)",
    "Cabin (A house made of wood or other natural materials in the countryside or mountains etc.)",
    "Boathouse (A boat that has been rebuilt to become a house)",
    "Chalet (A wooden house with a sloping rooftop typically in the countryside or mountains)",
    "Lighthouse (A tower that's been converted into a house)",
    "Container house (Wholly or partially made from containers)",
    "Earth house (A house made of mud,stone or other natural materials)",
    "Farm house (Found in a rural area with farming activity)",
    "Tiny house (A small space with all the elements of a house)",
    "A frame house (a house with a sloping roof all the way to the bottom)",
  ];

  const handleCheck = (event) => {
    var updatedList = [...houseDescriptionOptions];
    if (event.target.checked) {
      updatedList = [...houseDescriptionOptions, event.target.value];
    } else {
      updatedList.splice(
        houseDescriptionOptions.indexOf(event.target.value),
        1
      );
    }
    dispatch(describesHouse(updatedList));
  };

  return (
    <>
      {stay === "house" && (
        <div className="mt-6 flex flex-col gap-6">
          {houseOptions.map((option, index) => (
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

HouseOptions.propTypes = {};

export default HouseOptions;
