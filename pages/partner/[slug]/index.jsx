import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import getToken from "../../../lib/getToken";
import Navbar from "../../../components/ui/Navbar";

import "react-day-picker/dist/style.css";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function PartnerDetail({ userProfile, stay }) {
  const getDate = () => {
    return (
      stay.unavailable_dates &&
      stay.unavailable_dates.map((date) => {
        return new Date(date);
      })
    );
  };

  const [dates, setDates] = useState(getDate() || []);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const updateUnavailability = async () => {
    try {
      setLoading(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays/${stay.slug}/`,
        {
          unavailable_dates: dates,
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      router.reload();
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar userProfile={userProfile}></Navbar>

      <div className="px-6 mt-4">
        <h1 className="font-black text-2xl">{stay.name}</h1>

        <div className="mt-3 px-4">
          <h3 className="font-bold">Update the date of this listing</h3>

          <DayPicker
            mode="multiple"
            disabled={{
              before: new Date(),
            }}
            selected={dates}
            onSelect={setDates}
            numberOfMonths={2}
            className="rounded-lg !w-full p-4"
          />

          <div className="mt-4">
            <div
              onClick={() => {
                updateUnavailability();
              }}
              className="font-bold text-white cursor-pointer flex gap-1.5 items-center bg-blue-700 w-fit px-3 py-2 rounded-sm text-sm"
            >
              <span>Update this stay</span>

              <div className={" " + (!loading ? "hidden" : "")}>
                <LoadingSpinerChase width={15} height={15}></LoadingSpinerChase>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PartnerDetail.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    if (response.data[0].is_partner) {
      const stay = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays/${context.query.slug}/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: "",
          stay: stay.data,
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
          destination: `/login?redirect=/partner/${context.query.slug}`,
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stay: [],
        },
      };
    }
  }
}

export default PartnerDetail;
