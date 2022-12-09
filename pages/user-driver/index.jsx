import React from "react";
import PropTypes from "prop-types";
import Calendar from "../../components/Drivers/Calendar";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import getToken from "../../lib/getToken";
import axios from "axios";
import { useRouter } from "next/router";
import Table from "../../components/Drivers/Table";
import Events from "../../components/Drivers/Events";
import Analytics from "../../components/Drivers/Analytics";
import SelectOptions from "../../components/Drivers/SelectOptions";

function UserDriver({ trips }) {
  const router = useRouter();

  const options = [
    {
      name: "Calendar",
      value: "Calendar",
    },
    {
      name: "Events",
      value: "Events",
    },
    {
      name: "Analytics",
      value: "Analytics",
    },
  ];
  return (
    <div className="flex md:flex-row flex-col">
      <div className="flex w-full md:hidden items-center px-2 py-3 border-b bg-gray-100 justify-center">
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
      </div>
      <div className="my-4 md:hidden px-3 top-0">
        <SelectOptions options={options}></SelectOptions>
      </div>

      <div className="w-[20%] hidden md:block sticky px-2 bottom-0 top-0 bg-gray-50 h-screen">
        <div className="relative w-28 h-9 mx-auto mt-4 cursor-pointer">
          <Image
            layout="fill"
            alt="Logo"
            src="/images/winda_logo/horizontal-blue-font.png"
            priority
          ></Image>
        </div>

        <div className="h-[1px] w-full bg-gray-200 my-6"></div>

        <div
          onClick={() => {
            router.replace(
              {
                query: {
                  ...router.query,
                  option: 1,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          className={
            "flex items-center gap-2 hover:bg-[#4361EE] hover:bg-opacity-20 rounded-sm hover:text-blue-600 cursor-pointer transition-colors duration-300 ease-linear px-2 py-3 " +
            (router.query.option === "1" || !router.query.option
              ? "bg-[#4361EE] bg-opacity-20 text-blue-600"
              : "")
          }
        >
          <Icon className="w-6 h-6" icon="ic:baseline-calendar-month" />
          <h1 className="font-bold text-black">Calendar</h1>
        </div>

        <div
          onClick={() => {
            router.replace(
              {
                query: {
                  ...router.query,
                  option: 2,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          className={
            "flex items-center gap-2 mt-1 hover:bg-[#4361EE] hover:bg-opacity-20 rounded-sm hover:text-blue-600 cursor-pointer transition-colors duration-300 ease-linear px-2 py-3 " +
            (router.query.option === "2"
              ? "bg-[#4361EE] bg-opacity-20 text-blue-600"
              : "")
          }
        >
          <Icon className="w-6 h-6" icon="ic:round-view-list" />
          <h1 className="font-bold text-black">Events</h1>
        </div>

        <div
          onClick={() => {
            router.replace(
              {
                query: {
                  ...router.query,
                  option: 3,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          className={
            "flex items-center gap-2 mt-1 hover:bg-[#4361EE] hover:bg-opacity-20 rounded-sm hover:text-blue-600 cursor-pointer transition-colors duration-300 ease-linear px-2 py-3 " +
            (router.query.option === "3"
              ? "bg-[#4361EE] bg-opacity-20 text-blue-600"
              : "")
          }
        >
          <Icon
            className="w-6 h-6"
            icon="material-symbols:stacked-line-chart-rounded"
          />
          <h1 className="font-bold text-black">Analytics</h1>
        </div>
      </div>

      <div className="md:p-4 mt-3 md:mt-0 w-full md:w-[80%]">
        {(router.query.option === "1" || !router.query.option) && (
          <div className="w-full h-full">
            <Calendar trips={trips}></Calendar>
          </div>
        )}

        {router.query.option === "2" && (
          <div className="w-full h-full">
            <Events trips={trips}></Events>
          </div>
        )}

        {router.query.option === "3" && (
          <div className="w-full h-full">
            <Analytics trips={trips}></Analytics>
          </div>
        )}
      </div>
    </div>
  );
}

UserDriver.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + "ebfae841806f5f312f304a1e44f367b22b37547d",
        },
      }
    );

    if (response.data[0].is_partner) {
      const trips = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/driver-trips/`,
        {
          headers: {
            Authorization:
              "Token " + "ebfae841806f5f312f304a1e44f367b22b37547d",
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          trips: trips.data.results,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: `/login?redirect=/user-driver`,
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          trips: [],
        },
      };
    }
  }
}

export default UserDriver;
