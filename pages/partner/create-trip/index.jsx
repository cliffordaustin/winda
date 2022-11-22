import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../../components/ui/Navbar";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../../../components/ui/Input";
import getToken from "../../../lib/getToken";
import TextArea from "../../../components/ui/TextArea";
import Link from "next/link";
import Image from "next/image";
import ListItem from "../../../components/ui/ListItem";

function CreateTrip({ userProfile }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      number_of_days: "",
      number_of_coutries: "",
      miximum_number_of_people: "",
      description: "",
      essential_information: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(200, "This field has a max length of 120")
        .required("This field is required"),
      number_of_days: Yup.number()
        .min(1, "This field has a min value of 1")
        .required("This field is required"),
      number_of_coutries: Yup.number()
        .min(1, "This field has a min value of 1")
        .required("This field is required"),
      miximum_number_of_people: Yup.number()
        .min(1, "This field has a min value of 1")
        .required("This field is required"),
      description: Yup.string().required("This field is required"),
      essential_information: Yup.string(),
    }),
    onSubmit: async (values) => {},
  });

  const saveContinue = () => {
    axios.post(
      `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/create/`,
      {
        rate: reviewValue,
        message: values.description,
        title: values.title,
      },
      {
        headers: {
          Authorization: "Token " + Cookies.get("token"),
        },
      }
    );
  };
  return (
    <div>
      <div className="sticky bg-white border w-full top-0 left-0 right-0 z-50">
        <div className="flex w-full justify-between sm:px-8 px-6 md:px-6 lg:px-12 py-5">
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex w-7 h-7 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-sm text-white items-center justify-center font-black">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-600">About trip</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex w-7 h-7 rounded-full bg-gray-400 text-sm text-white items-center justify-center font-black">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-600">Categories</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex w-7 h-7 rounded-full bg-gray-400 text-sm text-white items-center justify-center font-black">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-600">Itinerary</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex w-7 h-7 rounded-full bg-gray-400 text-sm text-white items-center justify-center font-black">
                4
              </div>
              <h3 className="font-bold text-sm text-gray-600">Prices</h3>
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-red-500 via-red-600 to-red-700 w-[20%]"></div>
      </div>

      <div className="flex gap-8 max-w-4xl mx-auto">
        <div className="w-[30%] pt-6 hidden md:block h-[90vh] mt-0 sticky top-[80px]">
          <h1 className="font-black text-2xl">Let&apos;s build your trip</h1>
          <d className="mt-4 flex flex-col gap-4">
            <ListItem>
              Start by telling us about your trip. The more the information, the
              better users will be engaged.
            </ListItem>
            <ListItem>
              Use words that are precise and easy to understand
            </ListItem>
          </d>
        </div>
        <div className="flex w-[70%] px-4 pt-6 flex-col">
          <h1 className="font-black text-2xl">About your trip</h1>

          <div className="mt-5">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex items-center gap-3">
                <div className="w-[60%] relative">
                  <Input
                    name="name"
                    type="text"
                    placeholder="Name of trip"
                    errorStyle={
                      formik.touched.name && formik.errors.name ? true : false
                    }
                    className={"w-full placeholder:text-sm "}
                    inputClassName="bg-gray-100 focus:bg-white !text-sm "
                    label="What is the name of your trip?"
                    {...formik.getFieldProps("name")}
                  ></Input>
                  {formik.touched.name && formik.errors.name ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.name}
                    </span>
                  ) : null}
                </div>

                <div className="w-[40%] relative">
                  <Input
                    name="miximum_number_of_people"
                    type="number"
                    placeholder="Number of people"
                    errorStyle={
                      formik.touched.miximum_number_of_people &&
                      formik.errors.miximum_number_of_people
                        ? true
                        : false
                    }
                    className={"w-full placeholder:text-sm "}
                    inputClassName="bg-gray-100 focus:bg-white !text-sm "
                    label="How many people can join?"
                    {...formik.getFieldProps("miximum_number_of_people")}
                  ></Input>
                  {formik.touched.miximum_number_of_people &&
                  formik.errors.miximum_number_of_people ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.miximum_number_of_people}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex mt-8 items-center gap-3">
                <div className="w-[50%] relative">
                  <Input
                    name="number_of_days"
                    type="number"
                    placeholder="Number of days"
                    errorStyle={
                      formik.touched.number_of_days &&
                      formik.errors.number_of_days
                        ? true
                        : false
                    }
                    className={"w-full placeholder:text-sm !text-sm "}
                    inputClassName="bg-gray-100 focus:bg-white"
                    label="How many days will your trip last?"
                    {...formik.getFieldProps("number_of_days")}
                  ></Input>
                  {formik.touched.number_of_days &&
                  formik.errors.number_of_days ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.number_of_days}
                    </span>
                  ) : null}
                </div>

                <div className="w-[50%] relative">
                  <Input
                    name="number_of_coutries"
                    type="number"
                    placeholder="Number of coutries"
                    errorStyle={
                      formik.touched.number_of_coutries &&
                      formik.errors.number_of_coutries
                        ? true
                        : false
                    }
                    className={"w-full placeholder:text-sm "}
                    inputClassName="bg-gray-100 focus:bg-white !text-sm "
                    label="How many coutries will the user visit?"
                    {...formik.getFieldProps("number_of_coutries")}
                  ></Input>
                  {formik.touched.number_of_coutries &&
                  formik.errors.number_of_coutries ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.number_of_coutries}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="h-[1px] w-full bg-gray-100 mt-[40px] mb-[30px]"></div>

              <div className="flex flex-col">
                <TextArea
                  placeholder="Description"
                  name="description"
                  label="Describe your trip"
                  errorStyle={
                    formik.touched.description && formik.errors.description
                      ? true
                      : false
                  }
                  className={
                    "w-full bg-gray-100 focus:bg-white !text-sm placeholder:text-sm "
                  }
                  {...formik.getFieldProps("description")}
                ></TextArea>

                {formik.touched.description && formik.errors.description ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.description}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col mt-5">
                <TextArea
                  placeholder="Essential Information"
                  name="essential_information"
                  label="What is the essential information for the user?"
                  className={
                    "w-full bg-gray-100 focus:bg-white !text-sm placeholder:text-sm "
                  }
                  {...formik.getFieldProps("essential_information")}
                ></TextArea>
              </div>

              <div className="flex justify-between my-4">
                <div></div>
                <div
                  onClick={() => {
                    saveContinue();
                  }}
                  className="px-4 text-white font-bold text-sm cursor-pointer py-2 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                >
                  Save and continue
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CreateTrip.propTypes = {};

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
      return {
        props: {
          userProfile: "",
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
          destination: `/login?redirect=/partner/create-trip`,
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

export default CreateTrip;
