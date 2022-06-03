import React from "react";
import Dropdown from "../ui/Dropdown";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function UserDropdown({
  changeShowDropdown,
  showDropdown,
  userProfile,
  isHomePage = false,
  numberOfItemsInCart = 0,
  numberOfTrips = 0,
}) {
  const router = useRouter();
  let fullName = userProfile.first_name + " " + userProfile.last_name;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        changeShowDropdown();
      }}
      className="relative flex items-center gap-1 px-1 py-1 bg-gray-100 rounded-3xl cursor-pointer"
    >
      {!userProfile && (
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
      )}
      {userProfile.profile_pic && (
        <div className="relative w-7 h-7 rounded-full">
          <Image
            layout="fill"
            alt="profile image of a user"
            className="object-cover rounded-full"
            src={userProfile.profile_pic}
            priority
          ></Image>
        </div>
      )}

      {!userProfile.profile_pic && userProfile && (
        <div className="relative w-7 h-7 rounded-full bg-[#303960] text-white font-bold flex items-center text-sm justify-center">
          {fullName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()}
        </div>
      )}

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
        {!userProfile && (
          <div>
            <Link href="/signup">
              <a>
                <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
                  Signup
                </div>
              </a>
            </Link>
            <Link href="/login">
              <a>
                <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 mb-2">
                  Login
                </div>
              </a>
            </Link>
          </div>
        )}
        {!userProfile && <hr className="" />}
        {isHomePage && (
          <div
            onClick={() => {
              router.push("/cart");
            }}
            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center"
          >
            <span className="font-bold">cart</span>
            <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-[#303960] flex items-center justify-center">
              {numberOfItemsInCart}
            </div>
          </div>
        )}
        {isHomePage && (
          <div
            onClick={() => {
              router.push("/trip/plan");
            }}
            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center"
          >
            <span className="font-bold">trips</span>
            <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-[#303960] flex items-center justify-center">
              {numberOfTrips}
            </div>
          </div>
        )}

        {!isHomePage && (
          <div
            onClick={() => {
              router.push("/cart");
            }}
            className="hover:bg-gray-100 transition-colors duration-300 md:hidden cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center"
          >
            <span className="font-bold">cart</span>
            <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-[#303960] flex items-center justify-center">
              {numberOfItemsInCart}
            </div>
          </div>
        )}
        {!isHomePage && (
          <div
            onClick={() => {
              router.push("/trip/plan");
            }}
            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center"
          >
            <span className="font-bold">trips</span>
            <div className="h-5 w-5 p-1 text-white text-sm rounded-full bg-[#303960] flex items-center justify-center">
              {numberOfTrips}
            </div>
          </div>
        )}

        <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
          About
        </div>
        <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
          Terms of use
        </div>
        {userProfile && <hr className="" />}
        {userProfile && (
          <Link href="/logout">
            <a>
              <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 mb-2">
                Logout
              </div>
            </a>
          </Link>
        )}
      </Dropdown>
    </div>
  );
}

export default UserDropdown;
