import React from "react";
import Dropdown from "../ui/Dropdown";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import PopoverBox from "../ui/Popover";

function UserDropdown({
  changeShowDropdown,
  showDropdown,
  userProfile,
  isHomePage = false,
  numberOfItemsInCart = 0,
  numberOfTrips = 0,
  numberOfItemsInOrders = 0,
}) {
  const router = useRouter();
  let fullName = userProfile.first_name + " " + userProfile.last_name;
  return (
    <PopoverBox
      btnClassName="relative flex items-center gap-1 px-1 py-1 bg-gray-100 rounded-3xl cursor-pointer"
      panelClassName="bg-white rounded-xl shadow-md -left-40 mt-2 w-56 overflow-hidden"
      btnPopover={
        <>
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
          {userProfile && userProfile.profile_pic && (
            <div className="relative w-7 h-7 rounded-full">
              <Image
                layout="fill"
                alt="profile image of a user"
                className="object-cover rounded-full"
                src={userProfile.profile_pic}
                unoptimized={true}
                objectPosition="center"
                objectFit="cover"
                priority
              ></Image>
            </div>
          )}

          {userProfile && !userProfile.profile_pic && userProfile.avatar_url && (
            <div className="relative w-7 h-7 rounded-full">
              <Image
                layout="fill"
                alt="profile image of a user"
                className="object-cover rounded-full"
                src={userProfile.avatar_url}
                unoptimized={true}
                objectFit="cover"
                priority
              ></Image>
            </div>
          )}

          {!userProfile.profile_pic && userProfile && !userProfile.avatar_url && (
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
        </>
      }
    >
      {!userProfile && (
        <div>
          <Link href="/signup">
            <a>
              <div className="hover:bg-gray-100 text-base transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
                Signup
              </div>
            </a>
          </Link>
          <Link href="/login">
            <a>
              <div className="hover:bg-gray-100 text-base transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 mb-2">
                Login
              </div>
            </a>
          </Link>
        </div>
      )}
      {!userProfile && <hr className="" />}
      {isHomePage && (
        <Link href="/cart">
          <a>
            <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
              <span className="font-bold text-base">cart</span>
            </div>
          </a>
        </Link>
      )}

      <Link href="/trip/user-trips">
        <a>
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
            <span className="font-bold text-base">your trips</span>
          </div>
        </a>
      </Link>

      {!isHomePage && (
        <Link href="/trip/request-trip">
          <a>
            <div className="hover:bg-gray-100  transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
              <span className="font-bold text-base">Request to book</span>
            </div>
          </a>
        </Link>
      )}

      {!isHomePage && (
        <Link href="/cart">
          <a>
            <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
              <span className="font-bold text-base">cart</span>
            </div>
          </a>
        </Link>
      )}
      {!isHomePage && (
        <Link href="/trip/user-trips">
          <a>
            <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
              <span className="font-bold text-base">your trips</span>
            </div>
          </a>
        </Link>
      )}

      <Link href="/orders">
        <a>
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
            <span className="font-bold text-base">orders</span>
          </div>
        </a>
      </Link>

      <Link href="/saved-listings">
        <a>
          <div className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 flex justify-between items-center">
            <span className="font-bold text-base">Saved listings</span>
          </div>
        </a>
      </Link>

      <Link href="/about-us">
        <a>
          <div className="hover:bg-gray-100 text-base transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
            About
          </div>
        </a>
      </Link>

      {userProfile && <hr className="" />}
      {userProfile && (
        <Link href="/logout">
          <a>
            <div className="hover:bg-gray-100 text-base transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2 mb-2">
              Logout
            </div>
          </a>
        </Link>
      )}
    </PopoverBox>
  );
}

export default UserDropdown;
