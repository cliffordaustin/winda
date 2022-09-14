import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Cookies } from "js-cookie";

import getToken from "../../lib/getToken";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import UserDropdown from "../../components/Home/UserDropdown";
import Dialogue from "../../components/Home/Dialogue";
import { useRouter } from "next/router";
import Listings from "../../components/Lodging/Listings";

function RequestTrip({ userProfile, stays }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <div className="fixed top-0 w-full bg-white z-50">
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
          </div>

          <div className="flex items-center gap-3">
            <UserDropdown userProfile={userProfile}></UserDropdown>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-[80px] relative">
        <div className="px-2 hidden md:block h-[91vh] mt-0 sticky top-[80px] w-[45%] xl:w-[55%] before:absolute before:left-0 before:right-0 before:h-[91vh] before:w-full before:z-30 before:bg-black before:opacity-40">
          <Image
            layout="fill"
            alt="Image of a car and a lion"
            src="/images/giraffe.jpg"
            className="object-cover z-10"
            unoptimized={true}
            priority
          ></Image>
        </div>
        <div
          className="w-full sm:w-[80%] sm:mx-auto md:w-[55%] xl:w-[45%] px-4
         py-3 h-full"
        >
          <Listings userProfile={userProfile} stays={stays}></Listings>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const stays = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/events/`);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const stays = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/events/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stays: stays.data.results,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        stays: stays.data.results,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stays: [],
        },
      };
    }
  }
}

RequestTrip.propTypes = {};

export default RequestTrip;
