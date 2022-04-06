import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateAmenities } from "../../redux/actions/stay";
import Checkbox from "../ui/Checkbox";

const AmenitiesOptions = (props) => {
  const dispatch = useDispatch();

  const amenities = useSelector((state) => state.stay.amenities);

  const options = [
    "Swimming Pool",
    "Hot tub",
    "Sauna",
    "Beachfront",
    "Patio",
    "Terrace",
    "Balcony",
    "Fire pit",
    "Barbecue grill",
    "Outdoor dining area",
    "Gym",
    "Spa",
    "Wifi",
    "TV",
    "Kitchen",
    "Laundry Service",
    "Washer",
    "Free Parking",
    "Paid Parking",
    "Outdoor Shower",
    "Dedicated Working Area",
    "Smoke Alarm",
    "First Aid Kit",
    "Medical services on ground",
    "Carbon Monoxide Alarm",
    "Lockable Rooms",
    "Desks in Rooms",
    "Bar",
    "Restaurant",
    "Giftshop",
    "Photography room",
    "Themed rooms (ie. map room, historical room)",
  ];

  const handleCheck = (event) => {
    var updatedList = [...amenities];
    if (event.target.checked) {
      updatedList = [...amenities, event.target.value];
    } else {
      updatedList.splice(amenities.indexOf(event.target.value), 1);
    }
    dispatch(updateAmenities(updatedList));
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      {options.map((option, index) => (
        <div key={index} className="flex gap-4 items-center">
          <Checkbox value={option} onChange={handleCheck}></Checkbox>
          <span>{option}</span>
        </div>
      ))}
    </div>
  );
};

AmenitiesOptions.propTypes = {};

export default AmenitiesOptions;
