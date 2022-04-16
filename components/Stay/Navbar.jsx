import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import SearchSelect from "../Home/SearchSelect";
import UserDropdown from "../Home/UserDropdown";
import ClientOnly from "../ClientOnly";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  showSearchOptions = true,
  userProfile,
  showSearchModal,
}) {
  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);

  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between shadow-sm sm:px-12 px-6 md:px-24 py-4">
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
          <div className="hidden md:block mt-2">
            <SearchSelect
              setCurrentNavState={setCurrentNavState}
              currentNavState={currentNavState}
            ></SearchSelect>
          </div>
        )}
        {/* <div
          onClick={(e) => {
            e.stopPropagation();
            showSearchModal();
          }}
          className={"mx-6 w-[350px] hidden lg:block cursor-pointer "}
        >
          <div className="flex items-center justify-center gap-2 !px-2 !py-2 !bg-gray-100 w-full rounded-full text-center ml-1 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
                clipRule="evenodd"
              />
            </svg>
            <div>Nairobi</div>
          </div>
        </div> */}
      </div>

      <div className="flex justify-center items-center gap-4">
        <ClientOnly>
          {currencyToDollar && (
            <div
              className="font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear flex gap-1 items-center"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_FALSE",
                });
              }}
            >
              <div>USD</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div>KES</div>
            </div>
          )}
          {!currencyToDollar && (
            <div
              className="font-bold text-gray-700 hover:text-gray-900 cursor-pointer transition-all duration-300 ease-linear flex gap-1 items-center"
              onClick={() => {
                dispatch({
                  type: "CHANGE_CURRENCY_TO_DOLLAR_TRUE",
                });
              }}
            >
              <div>KES</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div>USD</div>
            </div>
          )}
        </ClientOnly>
        <UserDropdown
          changeShowDropdown={changeShowDropdown}
          showDropdown={showDropdown}
          userProfile={userProfile}
        ></UserDropdown>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
