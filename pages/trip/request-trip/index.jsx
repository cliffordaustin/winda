import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Cookies } from "js-cookie";

import getToken from "../../../lib/getToken";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import UserDropdown from "../../../components/Home/UserDropdown";
import Dialogue from "../../../components/Home/Dialogue";
import { useRouter } from "next/router";
import Head from "next/head";

function RequestTrip({ userProfile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCheckoutResponseModal, setShowCheckoutResponseModal] =
    useState(false);
  const formik = useFormik({
    initialValues: {
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
      message: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      last_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("This field is required"),
      message: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_baseURL}/request-custom-trip/`, {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          message: values.message,
        })
        .then((res) => {
          setLoading(false);
          setShowCheckoutResponseModal(true);
        })
        .catch((err) => {
          setLoading(false);
        });
    },
  });
  return (
    <div className="flex gap-2 relative">
      <Head>
        <title>Winda.guide | Request for a trip</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="w-full sm:w-[80%] sm:mx-auto md:w-[45%] px-4 py-3 h-full">
        <div
          onClick={() => {
            router.back();
          }}
          className="flex gap-1 mb-1 font-bold cursor-pointer items-center text-black"
        >
          <Icon className="w-6 h-6" icon="bx:chevron-left" />
          <span>Back</span>
        </div>
        <div className="mt-4 text-3xl font-bold font-SourceSans">
          Request for a custom trip
        </div>

        <div className="h-[1px] bg-gray-300 w-full my-6"></div>

        <div className=""></div>

        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center gap-4 w-full">
              <div className="w-full relative">
                <Input
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  errorStyle={
                    formik.touched.first_name && formik.errors.first_name
                      ? true
                      : false
                  }
                  className={"w-full "}
                  label="First name"
                  {...formik.getFieldProps("first_name")}
                ></Input>
                {formik.touched.first_name && formik.errors.first_name ? (
                  <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                    {formik.errors.first_name}
                  </span>
                ) : null}
              </div>
              <div className="w-full relative">
                <Input
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  label="Last name"
                  className={"w-full "}
                  errorStyle={
                    formik.touched.last_name && formik.errors.last_name
                      ? true
                      : false
                  }
                  {...formik.getFieldProps("last_name")}
                ></Input>
                {formik.touched.last_name && formik.errors.last_name ? (
                  <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                    {formik.errors.last_name}
                  </span>
                ) : null}
              </div>
            </div>
            <div
              className={
                "mb-4 " +
                (formik.errors.last_name || formik.errors.first_name
                  ? "mb-[32px]"
                  : "")
              }
            ></div>
            <Input
              name="email"
              type="email"
              errorStyle={
                formik.touched.email && formik.errors.email ? true : false
              }
              placeholder="Email"
              label="Email"
              {...formik.getFieldProps("email")}
            ></Input>
            {formik.touched.email && formik.errors.email ? (
              <span className="text-sm mt-3 font-bold text-red-400">
                {formik.errors.email}
              </span>
            ) : null}

            <div className="mb-6"></div>

            <TextArea
              label="message"
              name="message"
              errorStyle={
                formik.touched.message && formik.errors.message ? true : false
              }
              placeholder="Send us your message"
              {...formik.getFieldProps("message")}
            ></TextArea>

            {formik.touched.message && formik.errors.message ? (
              <span className="text-sm font-bold text-red-400">
                {formik.errors.message}
              </span>
            ) : null}
            <div className="mb-4"></div>

            <Button
              type="submit"
              disabled={loading}
              className={
                "mt-5 w-full px-5 flex items-center gap-2 !py-3 !bg-[#0353a4] hover:!bg-[#023e7d] !rounded-lg !font-bold !text-base " +
                (loading ? "opacity-60 cursor-not-allowed" : "")
              }
            >
              <span>Send request</span>
              <div>
                {loading ? (
                  <LoadingSpinerChase
                    width={20}
                    height={20}
                  ></LoadingSpinerChase>
                ) : (
                  ""
                )}
              </div>
            </Button>
          </form>
        </div>

        <div className="mt-6 flex gap-4 items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="text-sm font-bold text-center">Or</div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="mt-4">
          call or send us a message on whatsapp{" "}
          <span
            onClick={() => {
              window.open("tel:+254757629101", "_self");
            }}
            className="font-bold underline cursor-pointer"
          >
            +254 757 629 101
          </span>{" "}
          or email us on:
          <span
            onClick={() => {
              window.open("mailto:info@winda.guide", "_self");
            }}
            className="font-bold underline cursor-pointer"
          >
            info@winda.guide
          </span>
        </div>
      </div>

      <Dialogue
        isOpen={showCheckoutResponseModal}
        closeModal={() => {
          setShowCheckoutResponseModal(false);
        }}
        dialoguePanelClassName="!max-w-md !h-[265px]"
        title={"Thanks for booking this trip!"}
        dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
      >
        <div>
          We&apos;ll get back to you in 24 hours confirming all the details of
          the trip. We will send an extended itinerary to your email address:{" "}
          <span className="font-bold underline">{formik.values.email}</span>
        </div>

        <div className="mt-4">Meanwhile...</div>

        <div className="flex gap-2 w-full">
          <Button
            onClick={() => {
              router.replace("/trip");
            }}
            className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
          >
            <span>Checkout other curated trips</span>
          </Button>

          <Button
            onClick={() => {
              setShowCheckoutResponseModal(false);
            }}
            className="flex w-[40%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
          >
            <span>Close</span>
          </Button>
        </div>
      </Dialogue>

      <div className="px-2 hidden md:block h-[100vh] mt-0 sticky top-[0] w-[55%] before:absolute before:left-0 before:right-0 before:h-screen before:w-full before:z-30 before:bg-black before:opacity-40">
        <Image
          layout="fill"
          alt="Image of a car and a lion"
          src="/images/giraffe.jpg"
          className="object-cover z-10"
          unoptimized={true}
          priority
        ></Image>
        <div className="w-full h-16 absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-4">
          <Link href="/">
            <a className="block text-xl relative w-28 h-9 z-30 cursor-pointer">
              <Image
                layout="fill"
                alt="Logo"
                className="z-30"
                src="/images/winda_logo/horizontal-white-font.png"
                quality={10}
                priority
              ></Image>
            </a>
          </Link>

          <UserDropdown
            isHomePage={true}
            userProfile={userProfile}
          ></UserDropdown>
        </div>
      </div>
    </div>
  );
}

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

      return {
        props: {
          userProfile: response.data[0],
        },
      };
    }

    return {
      props: {
        userProfile: "",
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
        },
      };
    }
  }
}

RequestTrip.propTypes = {};

export default RequestTrip;
