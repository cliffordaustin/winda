import React from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";

function Transport({ transport, index, setItineraries, realIndex }) {
  const formik = useFormik({
    initialValues: {
      starting_location: transport.starting_location,
      ending_location: transport.ending_location,
      transport_type: transport.transport_type,
    },
    validationSchema: Yup.object({
      starting_location: Yup.string().max(
        200,
        "This field has a max length of 200"
      ),
      ending_location: Yup.string().max(
        200,
        "This field has a max length of 200"
      ),
      transport_type: Yup.string().max(
        100,
        "This field has a max length of 100"
      ),
    }),
    onSubmit: async (values) => {},
  });
  return (
    <div className="border rounded-md bg-[#f5f3f4] shadow-md flex flex-col gap-3 px-3 py-2">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-between gap-2">
          <div className="w-[48%] relative">
            <Input
              name="starting_location"
              type="text"
              value={formik.values.starting_location}
              placeholder="Starting location"
              errorStyle={
                formik.touched.starting_location &&
                formik.errors.starting_location
                  ? true
                  : false
              }
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="What is the starting location?"
              onChange={(e) => {
                formik.handleChange(e);
                setItineraries((prev) => {
                  const newItineraries = [...prev];
                  newItineraries[realIndex].transports[
                    index
                  ].starting_location = e.target.value;
                  return newItineraries;
                });
              }}
            ></Input>
            {formik.touched.starting_location &&
            formik.errors.starting_location ? (
              <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                {formik.errors.starting_location}
              </span>
            ) : null}
          </div>

          <div className="w-[48%] relative">
            <Input
              name="ending_location"
              type="text"
              value={formik.values.ending_location}
              placeholder="Ending location"
              errorStyle={
                formik.touched.ending_location && formik.errors.ending_location
                  ? true
                  : false
              }
              className={"w-full placeholder:text-sm "}
              inputClassName="!text-sm "
              label="What is the ending location?"
              onChange={(e) => {
                formik.handleChange(e);
                setItineraries((prev) => {
                  const newItineraries = [...prev];
                  newItineraries[realIndex].transports[index].ending_location =
                    e.target.value;
                  return newItineraries;
                });
              }}
            ></Input>
            {formik.touched.ending_location && formik.errors.ending_location ? (
              <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                {formik.errors.ending_location}
              </span>
            ) : null}

            {index > 0 && (
              <div className="mt-0.5 flex justify-between items-center">
                <div></div>
                <span
                  onClick={() => {
                    setItineraries((prev) => {
                      const newItineraries = [...prev];
                      newItineraries[realIndex].transports.splice(index, 1);
                      return newItineraries;
                    });
                  }}
                  className="text-sm text-red-600 cursor-pointer font-bold py-1"
                >
                  remove
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-2"></div>
      </form>
    </div>
  );
}

Transport.propTypes = {};

export default Transport;
