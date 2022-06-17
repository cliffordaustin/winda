import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import getToken from "../../../lib/getToken";
import Button from "../../../components/ui/Button";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import UserDropdown from "../../../components/Home/UserDropdown";
import Link from "next/link";
import Image from "next/image";
import SingleTrip from "../../../components/Trip/SingleTrip";

const AllUserTrips = ({ userTrips, userProfile }) => {
  const [showDropdown, changeShowDropdown] = useState(false);

  const router = useRouter();

  return (
    <div>
      {/* <h1>All User Trips</h1> */}

      <div className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
        <div className="bg-white sm:px-12 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
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

            <div className="sm:flex mt-1 ml-4 hover:text-blue-700 items-center gap-8 hidden">
              <div
                onClick={(event) => {
                  router.push("/trip");
                }}
                className={"cursor-pointer md:!text-base "}
              >
                Recommended trips
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserDropdown
              userProfile={userProfile}
              changeShowDropdown={() => {
                changeShowDropdown(!showDropdown);
              }}
              showDropdown={showDropdown}
              numberOfTrips={userTrips.length}
            ></UserDropdown>
          </div>
        </div>
      </div>
      {userTrips.length > 0 && (
        <>
          <div className="mt-20 font-bold text-2xl text-center">Your trips</div>
          <div className="!overflow-y-scroll max-w-[500px] bg-white shadow-lg border rounded-2xl mt-4 mx-auto !max-h-[600px]">
            <div className="px-4 my-2 h-full relative">
              {userTrips.map((trip, index) => {
                return <SingleTrip key={index} trip={trip}></SingleTrip>;
              })}
            </div>
          </div>
        </>
      )}

      {userTrips.length === 0 && (
        <div className="flex flex-col items-center gap-4">
          <div className="mt-20 font-bold text-2xl text-center">
            Nothing in your trip
          </div>
          <div>
            Check out our{" "}
            <span
              onClick={() => {
                router.push("/trip");
              }}
              className="text-blue-500 hover:text-blue-800 cursor-pointer"
            >
              recommended trips
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

AllUserTrips.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          userTrips: data || [],
        },
      };
    }

    return {
      props: {
        userProfile: "",
        userTrips: [],
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          userTrips: [],
        },
      };
    }
  }
}

export default AllUserTrips;
