import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

const FilterTags = ({}) => {
  const router = useRouter();
  const containsOption = (option) => {
    const options = router.query.type_of_car
      ? router.query.type_of_car.split(",")
      : [];
    return options.includes(option);
  };

  return (
    <div className="flex flex-wrap">
      {containsOption("LARGE 4x4") && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          large 4x4
        </div>
      )}
      {containsOption("SMALL 4x4") && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          small 4x4
        </div>
      )}
      {containsOption("VAN") && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          van
        </div>
      )}

      {containsOption("SEDAN") && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          sedan
        </div>
      )}

      {containsOption("SMALL CAR") && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          small car
        </div>
      )}
      {router.query.hasAirCondition === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Air condition
        </div>
      )}
      {router.query.hasOpenRoof === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Open roof
        </div>
      )}
      {router.query.hasFm === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          FM
        </div>
      )}
      {router.query.hasCd === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          CD
        </div>
      )}
      {router.query.hasBluetooth === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Bluetooth
        </div>
      )}
      {router.query.hasAudioInput === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Audio input
        </div>
      )}
      {router.query.hasOverheadPassengerAirbag === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Overhead passenger airbag
        </div>
      )}
      {router.query.hasSideAirbag === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Side airbag
        </div>
      )}

      {router.query.hasCruiseControl === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Cruise control
        </div>
      )}
      {router.query.hasPowerWindows === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Power windows
        </div>
      )}
      {router.query.hasPowerLocks === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Power locks
        </div>
      )}
      {router.query.hasPowerMirrors === "true" && (
        <div className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full">
          Power mirrors
        </div>
      )}
    </div>
  );
};

FilterTags.propTypes = {};

export default FilterTags;
