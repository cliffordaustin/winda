import React, { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../../../components/ui/Navbar";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import Input from "../../../components/ui/Input";
import getToken from "../../../lib/getToken";
import TextArea from "../../../components/ui/TextArea";
import Link from "next/link";
import Image from "next/image";
import ListItem from "../../../components/ui/ListItem";
import PulseLoader from "react-spinners/PulseLoader";
import Button from "../../../components/ui/Button";
import { useRouter } from "next/router";
import Checkbox from "../../../components/ui/Checkbox";
import Itinerary from "../../../components/Partners/Itinerary";
import { Icon } from "@iconify/react";
import MapLocation from "../../../components/Partners/MapLocation";

function CreateTrip({ userProfile }) {
  const router = useRouter();

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
        .max(200, "This field has a max length of 200")
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

  const [aboutLoading, setAboutLoading] = useState(false);

  const saveContinue = () => {
    router.replace(
      {
        query: {
          ...router.query,
          step: "2",
        },
      },
      undefined,
      { shallow: true }
    );
    // setAboutLoading(true);
    // axios
    //   .post(
    //     `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/create/`,
    //     {
    //       name: formik.values.name,
    //       total_number_of_days: formik.values.number_of_days,
    //       number_of_coutries: formik.values.number_of_coutries,
    //       max_number_of_people: formik.values.miximum_number_of_people,
    //       description: formik.values.description,
    //       essential_information: formik.values.essential_information,
    //     },
    //     {
    //       headers: {
    //         Authorization: "Token " + Cookies.get("token"),
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     setAboutLoading(false);
    //     Cookies.set("partner_trip_slug", res.data.slug);
    //     router.push({
    //       query: {
    //         step: "2",
    //       },
    //     });
    //   })
    //   .catch((error) => {
    //     setAboutLoading(false);
    //   });
  };

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "3px",
  };

  const currentStepNumber = Number(router.query.step)
    ? Number(router.query.step)
    : 1;

  const options = [
    "weekend_getaway",
    "road_trip",
    "cultural",
    "lake",
    "day_game_drives",
    "walking_hiking",
    "beach",
    "family",
    "romantic",
    "culinary",
    "day_trips",
    "community_owned",
    "off_grid",
    "solo_getaway",
    "wellness",
    "unconventional_safaris",
    "shopping",
    "art",
    "watersports",
    "sailing",
    "night_game_drives",
    "sustainable",
    "all_female",
    "groups",
    "luxury",
    "budget",
    "mid_range",
    "short_getaways",
    "cross_country",
    "park_conservancies",
  ];

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleCheck = (event) => {
    var updatedList = [...currentOptions];
    if (event.target.checked) {
      updatedList = [...currentOptions, event.target.value];
      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);
    }
    setCurrentOptions(updatedList);
  };

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  const [itineraries, setItineraries] = useState([
    {
      title: "",
      day: 1,
      breakfast_included: false,
      lunch_included: false,
      dinner_included: false,
      locations: [
        {
          name: "",
          description: "",
        },
      ],
      transports: [
        {
          starting_location: "",
          ending_location: "",
          transport_type: "",
        },
      ],
      optional_activities: [
        {
          name: "",
        },
      ],
    },
  ]);

  const [locations, setLocations] = useState([
    {
      name: "",
      longitude: "",
      latitude: "",
    },
  ]);

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
              <div
                className={
                  "flex w-7 h-7 rounded-full text-sm text-white items-center justify-center font-black " +
                  (currentStepNumber >= 2
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : "bg-gray-400")
                }
              >
                2
              </div>
              <h3 className="font-bold text-sm text-gray-600">Categories</h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={
                  "flex w-7 h-7 rounded-full text-sm text-white items-center justify-center font-black " +
                  (currentStepNumber >= 3
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : "bg-gray-400")
                }
              >
                3
              </div>
              <h3 className="font-bold text-sm text-gray-600">Itinerary</h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={
                  "flex w-7 h-7 rounded-full text-sm text-white items-center justify-center font-black " +
                  (currentStepNumber >= 4
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : "bg-gray-400")
                }
              >
                4
              </div>
              <h3 className="font-bold text-sm text-gray-600">Map & Images</h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={
                  "flex w-7 h-7 rounded-full text-sm text-white items-center justify-center font-black " +
                  (currentStepNumber >= 5
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : "bg-gray-400")
                }
              >
                5
              </div>
              <h3 className="font-bold text-sm text-gray-600">Prices</h3>
            </div>
          </div>
        </div>
        <div
          className={
            "h-[2px] bg-gradient-to-r from-red-500 via-red-600 to-red-700 " +
            (currentStepNumber === 1
              ? "w-[20%]"
              : currentStepNumber === 2
              ? "w-[40%]"
              : currentStepNumber === 3
              ? "w-[60%]"
              : currentStepNumber === 4
              ? "w-[80%]"
              : "w-[100%]")
          }
        ></div>
      </div>

      <div className="flex gap-8 max-w-4xl mx-auto">
        <div className="w-[30%] pt-6 hidden md:block h-[90vh] mt-0 sticky top-[80px]">
          {router.query.step !== "1" && router.query.step && (
            <div
              onClick={() => {
                if (router.query.step === "2") {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "1",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                } else if (router.query.step === "3") {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "2",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                } else if (router.query.step === "4") {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "3",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                } else if (router.query.step === "5") {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "4",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }
              }}
              className="flex gap-1 mb-3 font-bold cursor-pointer items-center text-black"
            >
              <Icon className="w-6 h-6" icon="bx:chevron-left" />
              <span>Back</span>
            </div>
          )}
          <h1 className="font-black text-2xl">Let&apos;s build your trip</h1>
          {(router.query.step === "1" || !router.query.step) && (
            <div className="mt-4 flex flex-col gap-4">
              <ListItem>
                Start by telling us about your trip. The more the information,
                the better users will be engaged.
              </ListItem>
              <ListItem>
                Use words that are precise and easy to understand.
              </ListItem>
              <ListItem>You can always change your selections later.</ListItem>
            </div>
          )}

          {router.query.step === "2" && (
            <div className="mt-4 flex flex-col gap-4">
              <ListItem>
                Select the categories that best describe your trip.
              </ListItem>
              <ListItem>
                You can select multiple categories for your trip.
              </ListItem>
              <ListItem>You can always change your selections later.</ListItem>
            </div>
          )}

          {router.query.step === "3" && (
            <div className="mt-4 flex flex-col gap-4">
              <ListItem>
                Select the categories that best describe your trip.
              </ListItem>
              <ListItem>
                You can select multiple categories for your trip.
              </ListItem>
              <ListItem>You can always change your selections later.</ListItem>
            </div>
          )}

          {router.query.step === "4" && (
            <div className="mt-4 flex flex-col gap-4">
              <ListItem>
                Select the categories that best describe your trip.
              </ListItem>
              <ListItem>
                You can select multiple categories for your trip.
              </ListItem>
              <ListItem>You can always change your selections later.</ListItem>
            </div>
          )}
        </div>
        {(router.query.step === "1" || !router.query.step) && (
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
                  <Button
                    onClick={() => {
                      formik.setTouched({
                        name: true,
                        miximum_number_of_people: true,
                        number_of_days: true,
                        number_of_coutries: true,
                        description: true,
                        essential_information: true,
                      });

                      formik.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          saveContinue();
                        }
                      });
                    }}
                    type="button"
                    className="px-4 flex items-center gap-1 text-white font-bold text-sm cursor-pointer !py-3 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                  >
                    <span>Save and continue</span>
                    <PulseLoader
                      color={"#ffffff"}
                      loading={aboutLoading}
                      cssOverride={override}
                      size={7}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {router.query.step === "2" && (
          <div className="flex w-[70%] px-4 pt-6 flex-col">
            <h1 className="font-black text-2xl">Select a category</h1>

            <div className="mt-5 flex justify-between gap-6 flex-wrap">
              {options.map((option, index) => (
                <label
                  key={index}
                  className={"flex items-center gap-2 w-[45%]"}
                >
                  <Checkbox
                    checked={containsOption(option)}
                    value={option}
                    onChange={handleCheck}
                  ></Checkbox>
                  <div className="capitalize text-sm font-bold">
                    {option.split("_").join(" ")}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between my-4">
              <div></div>
              <Button
                onClick={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "3",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                type="button"
                className="px-4 flex items-center gap-1 text-white font-bold text-sm cursor-pointer !py-2.5 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              >
                <span>Continue</span>
                <PulseLoader
                  color={"#ffffff"}
                  loading={false}
                  cssOverride={override}
                  size={7}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </Button>
            </div>
          </div>
        )}

        {router.query.step === "3" && (
          <div className="flex w-[70%] px-4 pt-6 flex-col">
            <h1 className="font-black text-2xl">Build your itinerary</h1>

            <div className="mt-5 flex flex-col gap-6 flex-wrap">
              {itineraries.map((itinerary, index) => (
                <div key={index}>
                  <Itinerary
                    itinerary={itinerary}
                    index={index + 1}
                    setItineraries={setItineraries}
                  ></Itinerary>
                </div>
              ))}
            </div>
            <div
              onClick={() => {
                setItineraries([
                  ...itineraries,
                  {
                    title: "",
                    day: itineraries[itineraries.length - 1].day + 1,
                    breakfast_included: false,
                    lunch_included: false,
                    dinner_included: false,
                    locations: [
                      {
                        name: "",
                        description: "",
                      },
                    ],
                    transports: [
                      {
                        starting_location: "",
                        ending_location: "",
                        transport_type: "",
                      },
                    ],
                    optional_activities: [
                      {
                        name: "",
                      },
                    ],
                  },
                ]);
              }}
              className="flex w-fit text-blue-700 mt-2 text-sm items-center gap-0.5 cursor-pointer py-2"
            >
              <h1 className="font-bold">Add another itinerary</h1>
              <Icon icon="material-symbols:add" />
            </div>

            <div className="flex justify-between my-4">
              <div></div>
              <Button
                onClick={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "4",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                type="button"
                className="px-4 flex items-center gap-1 text-white font-bold text-sm cursor-pointer !py-2.5 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              >
                <span>Continue</span>
                <PulseLoader
                  color={"#ffffff"}
                  loading={false}
                  cssOverride={override}
                  size={7}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </Button>
            </div>
          </div>
        )}

        {router.query.step === "4" && (
          <div className="flex w-[70%] px-4 pt-6 flex-col">
            <h1 className="font-black text-2xl">Map and images</h1>

            <div className="mt-5 flex flex-col gap-6 flex-wrap">
              {locations.map((location, index) => (
                <MapLocation
                  key={index}
                  location={location}
                  index={index + 1}
                ></MapLocation>
              ))}
            </div>

            <div className="flex justify-between my-4">
              <div></div>
              <Button
                onClick={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        step: "5",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                type="button"
                className="px-4 flex items-center gap-1 text-white font-bold text-sm cursor-pointer !py-2.5 rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700"
              >
                <span>Continue</span>
                <PulseLoader
                  color={"#ffffff"}
                  loading={false}
                  cssOverride={override}
                  size={7}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </Button>
            </div>
          </div>
        )}
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
