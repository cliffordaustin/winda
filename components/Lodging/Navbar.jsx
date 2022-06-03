import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

import SearchSelect from "../Home/SearchSelect";
import UserDropdown from "../Home/UserDropdown";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  showSearchOptions = true,
  userProfile,
}) {
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  const router = useRouter();

  const getNumberOfItemsInCartInDatabase = async () => {
    const stayCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const activityCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const transportCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const totalNumberOfItemsInCart =
      stayCart.data.results.length +
      activityCart.data.results.length +
      transportCart.data.results.length;

    setNumberOfItemsInCart(totalNumberOfItemsInCart);
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      getNumberOfItemsInCartInDatabase();
    } else if (Cookies.get("cart")) {
      let cookieVal = Cookies.get("cart");

      if (cookieVal !== undefined) {
        cookieVal = JSON.parse(cookieVal);
      }

      const data = [...(cookieVal || [])];

      setNumberOfItemsInCart(data.length);
    }
  }, []);

  const [trips, setTrips] = useState([]);

  const getItemsInTrip = async () => {
    if (Cookies.get("token")) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setTrips(data[0] || []);
    }
  };

  useEffect(() => {
    getItemsInTrip();
  }, []);

  return (
    <div className="flex items-center justify-between sm:px-12 px-6 md:px-24 py-4">
      <div className="flex items-center gap-8">
        <Link href="/">
          <a className="font-lobster text-xl relative w-28 h-9 cursor-pointer">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              priority
            ></Image>
          </a>
        </Link>
        {showSearchOptions && (
          <div className="hidden sm:block mt-2">
            <SearchSelect
              setCurrentNavState={setCurrentNavState}
              currentNavState={currentNavState}
            ></SearchSelect>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <UserDropdown
          changeShowDropdown={changeShowDropdown}
          showDropdown={showDropdown}
          userProfile={userProfile}
          numberOfItemsInCart={numberOfItemsInCart}
          numberOfTrips={trips.trip && trips.trip.length}
        ></UserDropdown>

        <div
          onClick={() => {
            router.push("/cart");
          }}
          className="relative cursor-pointer md:block hidden ml-4 hover:bg-gray-200 transition-all duration-300 ease-linear h-8 w-8 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 absolute top-2/4 right-2/4 -translate-y-2/4 translate-x-2/4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {numberOfItemsInCart > 0 && (
            <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-blue-400 absolute -top-1.5 -right-2 flex items-center justify-center">
              {numberOfItemsInCart}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
