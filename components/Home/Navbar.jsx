import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

import SearchSelect from "./SearchSelect";
import UserDropdown from "./UserDropdown";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  userProfile,
  showSearchOptions = true,
  isHomePage,
}) {
  return (
    <div className="flex items-center justify-between sm:px-12 px-6 md:px-24 py-4">
      <Link href="/">
        <a className="relative w-28 h-9 cursor-pointer">
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
            isHomePage={isHomePage}
          ></SearchSelect>
        </div>
      )}
      <UserDropdown userProfile={userProfile}></UserDropdown>
    </div>
  );
}

Navbar.propTypes = {};

export default Navbar;
