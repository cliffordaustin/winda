import React from "react";
import StyledLink from "../ui/StyledLink";
import PropTypes from "prop-types";
import styles from "../../styles/StyledLink.module.css";
import Image from "next/image";
import Link from "next/link";

import Dropdown from "../ui/Dropdown";
import SearchSelect from "./SearchSelect";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
}) {
  return (
    <div className="flex items-center justify-between sm:px-12 px-6 md:px-24 py-4">
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
      <div className="hidden sm:block">
        <SearchSelect
          setCurrentNavState={setCurrentNavState}
          currentNavState={currentNavState}
        ></SearchSelect>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          changeShowDropdown();
        }}
        className="relative flex items-center gap-1 px-1 py-1 bg-gray-100 rounded-3xl cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <Dropdown
          showDropdown={showDropdown}
          className="absolute -left-40 top-full mt-2 w-56"
        >
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
            Signup
          </div>
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 mb-2">
            Login
          </div>
          <hr className="" />
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
            Host an activity
          </div>
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
            Help
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
