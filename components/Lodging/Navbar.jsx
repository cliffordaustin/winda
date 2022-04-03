import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

import SearchSelect from "../Home/SearchSelect";
import UserDropdown from "../Home/UserDropdown";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  showSearchOptions = true,
  userProfile,
}) {
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
      <UserDropdown
        changeShowDropdown={changeShowDropdown}
        showDropdown={showDropdown}
        userProfile={userProfile}
      ></UserDropdown>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
