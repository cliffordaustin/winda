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
    const cart = Cookies.get("cart");

    setRemoveButtonLoading(true);
    if (token) {
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
    } else if (cart) {
      const cart = JSON.parse(decodeURIComponent(Cookies.get("cart")));
      const newCart = [];

      newCart = cart.filter((el) => el.slug !== flight.slug);
      Cookies.set("cart", JSON.stringify(newCart));
      location.reload();
    }
  };
  return (
    <div className="relative px-2 mb-3">
      <div className="flex gap-2 h-fit px-2 py-2 justify-between w-full rounded-md border">
        <div>
          <div className="flex items-center gap-1">
            <div className="font-bold">{flight.starting_point}</div>
            <div> - </div>
            <div className="font-bold">{flight.destination}</div>
          </div>
          <div>
            <div className="text-sm text-gray-800 mt-2">
              {flight.number_of_people}{" "}
              {flight.number_of_people > 1 ? "Passengers" : "Passenger"}
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
        <div className="mb-2 flex flex-col self-start">
          <Price
            stayPrice={
              checkFlightPrice(
                flight.starting_point,
                flight.destination,
                flight.flight_types
              ) * flight.number_of_people
            }
            className="self-end"
          ></Price>

          <div className="self-end text-sm text-gray-500">
            <span className="capitalize">
              {flight.flight_types && flight.flight_types.toLowerCase()}
            </span>{" "}
            flight
          </div>
        </div>
      </div>

      {forOrder && (
        <div>
          {flight.reviewing && (
            <div className="absolute bottom-1.5 right-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
              Reviewing
            </div>
          )}

          {flight.email_sent && (
            <div className="absolute bottom-1.5 right-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
              Email sent
            </div>
          )}

          {flight.cancelled && (
            <div className="absolute bottom-1.5 right-4 text-white  w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-red-500">
              Cancelled
            </div>
          )}

          {flight.paid && (
            <div className="absolute bottom-1.5 right-4 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-green-500">
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
