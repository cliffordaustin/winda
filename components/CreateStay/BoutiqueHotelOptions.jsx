import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { describesBoutiqueHotel } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const BoutiqueHotelOptions = (props) => {
  const dispatch = useDispatch();

  const stay = useSelector((state) => state.stay.typeOfStay);

  const boutiqueHotelDescriptionOptions = useSelector(
    (state) => state.stay.describesBoutiqueHotel
  );

  const boutiqueHotelOptions = [
    "A hotel out in Nature",
    "Historical building",
    "Unique architectural or design",
    "Resort",
  ];

  const handleCheck = (event) => {
    var updatedList = [...boutiqueHotelDescriptionOptions];
    if (event.target.checked) {
      updatedList = [...boutiqueHotelDescriptionOptions, event.target.value];
    } else {
      updatedList.splice(
        boutiqueHotelDescriptionOptions.indexOf(event.target.value),
        1
      );
    }
    dispatch(describesBoutiqueHotel(updatedList));
  };

  return (
    <>
      {stay === "boutiquehotel" && (
        <div className="mt-6 flex flex-col gap-6">
          {boutiqueHotelOptions.map((option, index) => (
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

BoutiqueHotelOptions.propTypes = {};

export default BoutiqueHotelOptions;
