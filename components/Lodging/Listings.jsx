import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
// import { setFilteredStays } from "../../redux/actions/stay";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({
  getDistance,
  userLatLng,
  itemsInCart,
  userProfile,
  itemsInOrders,
  stays,
}) {
  // const stays = useSelector((state) => state.stay.stays);
  // const filteredStays = useSelector((state) => state.stay.filteredStays);

  const [slugIsCorrect, setSlugIsCorrect] = useState(false);

  const router = useRouter();

  const checkSlug = async () => {
    const token = Cookies.get("token");

    if (token) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`, {
          headers: {
            Authorization: "Token " + token,
          },
        })
        .then((res) => {
          setSlugIsCorrect(true);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setSlugIsCorrect(false);
          }
        });
    } else {
      setSlugIsCorrect(false);
    }
  };

  useEffect(() => {
    if (router.query.trip) {
      checkSlug();
    }
  }, []);

  return (
    <ClientOnly>
      {stays.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {stays.map((stay, index) => (
            <Listing
              key={index}
              listing={stay}
              getDistance={getDistance}
              userLatLng={userLatLng}
              slugIsCorrect={slugIsCorrect}
              itemsInCart={itemsInCart}
              userProfile={userProfile}
              itemsInOrders={itemsInOrders}
            ></Listing>
          ))}
        </div>
      )}

      {stays.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="font-bold text-2xl">No result for this filter</div>
          <div
            onClick={() => {
              router.push({
                pathname: "/stays",
                query: {
                  trip: router.query.trip,
                  group_trip: router.query.group_trip,
                },
              });
            }}
            className="text-sm font-bold cursor-pointer text-blue-400 hover:text-blue-600 transition-colors duration-200 ease-linear"
          >
            Clear filter
          </div>
        </div>
      )}
      {/* {filteredStays && (
        <div className="w-full flex flex-wrap gap-4">
          {filteredStays.map((stay, index) => (
            <Listing
              key={index}
              listing={stay}
              getDistance={getDistance}
              userLatLng={userLatLng}
            ></Listing>
          ))}
        </div>
      )} */}
    </ClientOnly>
  );
}

export default Listings;
