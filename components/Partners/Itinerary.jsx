import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import Dialogue from "../Home/Dialogue";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../ui/Input";
import Location from "./Location";
import { Icon } from "@iconify/react";
import OptionalActivities from "./OptionalActivities";
import Transport from "./Transport";
import ListItem from "../ui/ListItem";

function Itinerary({ itinerary, index, setItineraries }) {
  const [showEditPopup, setShowEditPopup] = useState(false);

  const realIndex = index - 1;

  const formik = useFormik({
    initialValues: {
      title: itinerary.title,
      day: itinerary.day,
      location_name: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(200, "This field has a max length of 200")
        .required("This field is required"),
      day: Yup.number()
        .min(1, "This field has a min value of 1")
        .required("This field is required"),
    }),
    onSubmit: async (values) => {},
  });

  return (
    <div className="w-full border rounded-md bg-[#f5f3f4] shadow-md px-2 py-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h1 className="font-bold">Itinerary</h1>
          <p className="text-sm font-bold text-gray-500">#{index}</p>
        </div>

        <Button
          onClick={() => {
            setShowEditPopup(true);
          }}
          className="!bg-transparent border-2 !border-red-700 !py-1 !text-sm !text-black !font-bold"
        >
          Edit
        </Button>
      </div>

      <Dialogue
        isOpen={showEditPopup}
        closeModal={() => {
          setShowEditPopup(false);
        }}
        dialoguePanelClassName="!max-h-[600px] !relative !p-0 !max-w-5xl overflow-y-scroll remove-scroll"
      >
        <div className="w-full relative px-5 py-3">
          <h1 className="text-2xl font-black mb-8">
            Edit itinerary <span className="text-gray-600">#{index}</span>
          </h1>

          <form className="relative" onSubmit={formik.handleSubmit}>
            <div className="flex gap-4">
              <div className="w-[35%]">
                <h1 className="font-black text-xl">About itinerary</h1>
                <div className="mt-4 flex flex-col gap-4">
                  <ListItem>
                    Start by telling us about your trip. The more the
                    information, the better users will be engaged.
                  </ListItem>
                  <ListItem>
                    Use words that are precise and easy to understand.
                  </ListItem>
                </div>
              </div>
              <div className="flex w-[65%] self-start items-center gap-3">
                <div className="w-[60%] relative">
                  <Input
                    name="title"
                    type="text"
                    value={formik.values.title}
                    placeholder="Title on the itinerary"
                    errorStyle={
                      formik.touched.title && formik.errors.title ? true : false
                    }
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="What is the title of your trip?"
                    onChange={(e) => {
                      formik.handleChange(e);
                      setItineraries((prev) => {
                        const newItineraries = [...prev];
                        newItineraries[realIndex].title = e.target.value;
                        return newItineraries;
                      });
                    }}
                  ></Input>
                  {formik.touched.title && formik.errors.title ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.title}
                    </span>
                  ) : null}
                </div>

                <div className="w-[40%] relative">
                  <Input
                    name="day"
                    type="number"
                    value={formik.values.day}
                    placeholder="Day of this itinerary"
                    errorStyle={
                      formik.touched.day && formik.errors.day ? true : false
                    }
                    className={"w-full placeholder:text-sm "}
                    inputClassName="!text-sm "
                    label="What day is this itinerary?"
                    onChange={(e) => {
                      formik.handleChange(e);
                      setItineraries((prev) => {
                        const newItineraries = [...prev];
                        newItineraries[realIndex].day = e.target.value;
                        return newItineraries;
                      });
                    }}
                  ></Input>
                  {formik.touched.day && formik.errors.day ? (
                    <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                      {formik.errors.day}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mb-3 mt-6 h-[1px] bg-gray-200"></div>

            <div className="flex gap-4">
              <div className="w-[35%] sticky top-4 left-0 right-0 h-fit">
                <h1 className="font-black text-xl">Locations</h1>
                <div className="mt-4 flex flex-col gap-4">
                  <ListItem>
                    Start by telling us about your trip. The more the
                    information, the better users will be engaged.
                  </ListItem>
                  <ListItem>
                    Use words that are precise and easy to understand.
                  </ListItem>
                </div>
              </div>
              <div className="w-[65%]">
                <div className="mt-10 flex flex-col gap-3">
                  {itinerary.locations.map((location, index) => (
                    <Location
                      location={location}
                      key={index}
                      index={index}
                      realIndex={realIndex}
                      setItineraries={setItineraries}
                    ></Location>
                  ))}
                </div>
                <div
                  onClick={() => {
                    setItineraries((prev) => {
                      const newItineraries = [...prev];
                      newItineraries[realIndex].locations.push({
                        name: "",
                        description: "",
                      });
                      return newItineraries;
                    });
                  }}
                  className="flex text-blue-700 mt-2 w-fit text-sm items-center gap-0.5 cursor-pointer py-2"
                >
                  <h1 className="font-bold">Add another location</h1>
                  <Icon icon="material-symbols:add" />
                </div>
              </div>
            </div>

            <div className="mb-3 mt-6 h-[1px] bg-gray-200"></div>

            <div className="flex gap-4">
              <div className="w-[35%] sticky top-4 left-0 right-0 h-fit">
                <h1 className="font-black text-xl">Transports</h1>
                <div className="mt-4 flex flex-col gap-4">
                  <ListItem>
                    Start by telling us about your trip. The more the
                    information, the better users will be engaged.
                  </ListItem>
                  <ListItem>
                    Use words that are precise and easy to understand.
                  </ListItem>
                </div>
              </div>

              <div className="w-[65%]">
                <div className="mt-6 flex flex-col gap-3">
                  {itinerary.transports.map((transport, index) => (
                    <Transport
                      transport={transport}
                      key={index}
                      index={index}
                      realIndex={realIndex}
                      setItineraries={setItineraries}
                    ></Transport>
                  ))}
                </div>
                <div
                  onClick={() => {
                    setItineraries((prev) => {
                      const newItineraries = [...prev];
                      newItineraries[realIndex].transports.push({
                        starting_location: "",
                        ending_location: "",
                        transport_type: "",
                      });
                      return newItineraries;
                    });
                  }}
                  className="flex w-fit text-blue-700 mt-2 text-sm items-center gap-0.5 cursor-pointer py-2"
                >
                  <h1 className="font-bold">Add another Transport</h1>
                  <Icon icon="material-symbols:add" />
                </div>
              </div>
            </div>

            <div className="mb-3 mt-6 h-[1px] bg-gray-200"></div>

            <div className="flex gap-4">
              <div className="w-[35%] sticky top-4 left-0 right-0 h-fit">
                <h1 className="font-black text-xl">Optional activities</h1>
                <div className="mt-4 flex flex-col gap-4">
                  <ListItem>
                    Start by telling us about your trip. The more the
                    information, the better users will be engaged.
                  </ListItem>
                  <ListItem>
                    Use words that are precise and easy to understand.
                  </ListItem>
                </div>
              </div>

              <div className="w-[65%]">
                <div className="mt-6 flex flex-col gap-3">
                  {itinerary.optional_activities.map((activity, index) => (
                    <OptionalActivities
                      activity={activity}
                      key={index}
                      index={index}
                      realIndex={realIndex}
                      setItineraries={setItineraries}
                    ></OptionalActivities>
                  ))}
                </div>
                <div
                  onClick={() => {
                    setItineraries((prev) => {
                      const newItineraries = [...prev];
                      newItineraries[realIndex].optional_activities.push({
                        name: "",
                      });
                      return newItineraries;
                    });
                  }}
                  className="flex w-fit text-blue-700 mt-2 text-sm items-center gap-0.5 cursor-pointer py-2"
                >
                  <h1 className="font-bold">Add another activity</h1>
                  <Icon icon="material-symbols:add" />
                </div>
              </div>
            </div>
          </form>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowEditPopup(false);
            }}
            className="flex cursor-pointer items-center absolute top-4 right-4 justify-center w-7 h-7 rounded-full bg-white shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </Dialogue>

      <div className="flex flex-col gap-1 mt-2 text-sm">
        <p className="font-bold text-gray-500">
          {itinerary.day ? `Day ${itinerary.day}` : "Not set"}
        </p>
        <p className="font-bold text-gray-500">
          Title: {itinerary.title ? itinerary.title : "Not set"}
        </p>
      </div>

      {realIndex > 0 && (
        <div className="flex flex-col justify-between mt-2">
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <div
            onClick={() => {
              setItineraries((prev) => {
                const newItineraries = [...prev];

                newItineraries.splice(realIndex, 1);
                return newItineraries;
              });
            }}
            className="text-sm w-fit mt-2 bg-red-100 border-2 border-red-400 px-2 rounded-md text-red-600 cursor-pointer font-bold py-0.5"
          >
            remove
          </div>
        </div>
      )}
    </div>
  );
}

Itinerary.propTypes = {};

export default Itinerary;
