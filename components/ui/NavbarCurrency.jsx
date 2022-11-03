import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PopoverBox from "./Popover";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function NavbarCurrency(props) {
  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const router = useRouter();

  const changeCurrency = (currency) => {
    Cookies.set("currency", currency);
    Cookies.set("defaultCurrency", "0");
    router.reload();
  };

  const [currency, setCurrency] = useState(Cookies.get("currency"));

  useEffect(() => {
    if (Cookies.get("defaultCurrency") !== "0") {
      setCurrency(userIsFromKenya ? "KES" : null);
    }
  }, [userIsFromKenya]);
  return (
    <PopoverBox
      btnPopover={
        <>
          {(!currency || currency === "USD") && (
            <div className="flex mt-1 items-center underline font-bold">
              <Icon icon="fxemoji:heavydollarsign" />
              <span className="text-sm">USD</span>
            </div>
          )}

          {currency && currency === "KES" && (
            <div className="flex mt-1 items-center underline font-bold">
              <span className="text-sm">KES</span>
            </div>
          )}
        </>
      }
      panelClassName="bg-white w-[200px] mt-0.5 py-0.5 right-0 rounded-sm shadow-md"
    >
      <div className="text-sm px-2 py-1 bg-gray-200 font-bold">
        Change currency
      </div>
      <div
        onClick={() => {
          changeCurrency("KES");
        }}
        className="px-2 py-1 hover:bg-gray-50 transition-colors duration-150 ease-linear cursor-pointer text-sm"
      >
        Kenyan shilling - KES
      </div>
      <div
        onClick={() => {
          changeCurrency("USD");
        }}
        className="px-2 py-1 hover:bg-gray-50 transition-colors duration-150 ease-linear cursor-pointer text-sm"
      >
        United States Dollar - USD
      </div>
    </PopoverBox>
  );
}

NavbarCurrency.propTypes = {};

export default NavbarCurrency;
