import React from "react";
import StyledLink from "../ui/StyledLink";
import PropTypes from "prop-types";
import styles from "../../styles/StyledLink.module.css";
import Image from "next/image";
import Link from "next/link";

import Dropdown from "../ui/Dropdown";
import SearchSelect from "./SearchSelect";
import UserDropdown from "./UserDropdown";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  showSearchOptions = true,
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
      {showSearchOptions && (
        <div className="hidden md:block">
          <SearchSelect
            setCurrentNavState={setCurrentNavState}
            currentNavState={currentNavState}
          ></SearchSelect>
        </div>
      )}
      <UserDropdown
        changeShowDropdown={changeShowDropdown}
        showDropdown={showDropdown}
      ></UserDropdown>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
