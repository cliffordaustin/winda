import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import axios from "axios";
import Cookies from "js-cookie";
import Price from "../../components/Stay/Price";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { checkFlightPrice } from "../../lib/flightLocations";

function FlightItem({ flight, forOrder }) {
  const [removeButtonLoading, setRemoveButtonLoading] = useState(false);

  const removeCart = async () => {
    const token = Cookies.get("token");

    setRemoveButtonLoading(true);
    await axios
      .delete(`${process.env.NEXT_PUBLIC_baseURL}/flights/${flight.slug}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        console.log(err.response.data);
        setRemoveButtonLoading(false);
      });
  };
  return (
    <div className="relative px-2 mb-3">
      <div className="flex gap-2 h-fit px-2 py-2 w-full rounded-md shadow-md border">
        <div className="h-16 w-20 flex justify-center items-center bg-gray-200 rounded-md">
          <Icon icon="fa:plane" className="text-gray-600 w-8 h-8" />
        </div>
        <div>
          <div className="mb-2">
            <Price
              stayPrice={
                checkFlightPrice(flight.starting_point, flight.destination) *
                flight.number_of_people
              }
              className=""
            ></Price>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold">{flight.starting_point}</div>
            <div className="text-sm font-bold">{flight.destination}</div>
          </div>

          <div className="text-sm font-bold mt-2">
            {flight.number_of_people}{" "}
            {flight.number_of_people > 1 ? "People" : "Person"}
          </div>

          <div
            className="text-sm w-fit cursor-pointer flex items-center bg-red-400 bg-opacity-30 px-2 py-1 text-red-500 font-bold p-3 rounded-md mt-2
          "
            onClick={removeCart}
          >
            <span className="mr-1">Remove</span>
            <div className={" " + (!removeButtonLoading ? "hidden" : "")}>
              <LoadingSpinerChase
                width={13}
                height={13}
                color="red"
              ></LoadingSpinerChase>
            </div>
          </div>
        </div>
      </div>

      {forOrder && (
        <div>
          {flight.reviewing && (
            <div className="absolute top-1.5 left-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
              Reviewing
            </div>
          )}

          {flight.email_sent && (
            <div className="absolute top-1.5 left-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
              Email sent
            </div>
          )}

          {flight.cancelled && (
            <div className="absolute top-1.5 left-4 text-white  w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-red-500">
              Cancelled
            </div>
          )}

          {flight.paid && (
            <div className="absolute top-1.5 left-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-green-500">
              Paid
            </div>
          )}
        </div>
      )}
    </div>
  );
}

FlightItem.propTypes = {};

export default FlightItem;
