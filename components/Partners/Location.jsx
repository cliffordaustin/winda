import React from "react";
import PropTypes from "prop-types";
import Input from "../ui/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import TextArea from "../ui/TextArea";

function Location({ location, index, setItineraries, realIndex }) {
  const formik = useFormik({
    initialValues: {
      name: location.name,
      description: location.description,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(200, "This field has a max length of 200")
        .required("This field is required"),
    }),
    onSubmit: async (values) => {},
  });
  return (
    <div className="border rounded-md flex flex-col bg-[#f5f3f4] shadow-md gap-3 px-3 py-2">
      <form onSubmit={formik.handleSubmit}>
        <div className="w-[60%] relative">
          <Input
            name="name"
            type="text"
            value={formik.values.name}
            placeholder="Location name"
            errorStyle={
              formik.touched.name && formik.errors.name ? true : false
            }
            className={"w-full placeholder:text-sm "}
            inputClassName="!text-sm "
            label="What is the name of this location?"
            onChange={(e) => {
              formik.handleChange(e);
              setItineraries((prev) => {
                const newItineraries = [...prev];
                newItineraries[realIndex].locations[index].name =
                  e.target.value;
                return newItineraries;
              });
            }}
          ></Input>
          {formik.touched.name && formik.errors.name ? (
            <span className="text-sm absolute -bottom-6 font-bold text-red-400">
              {formik.errors.name}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col mt-2">
          <TextArea
            placeholder="Location"
            name="description"
            value={formik.values.description}
            label="Describe your this location"
            errorStyle={
              formik.touched.description && formik.errors.description
                ? true
                : false
            }
            className={"w-full !text-sm placeholder:text-sm "}
            onChange={(e) => {
              formik.handleChange(e);
              setItineraries((prev) => {
                const newItineraries = [...prev];
                newItineraries[realIndex].locations[index].description =
                  e.target.value;
                return newItineraries;
              });
            }}
          ></TextArea>

          {formik.touched.description && formik.errors.description ? (
            <span className="text-sm font-bold text-red-400">
              {formik.errors.description}
            </span>
          ) : null}

          {index > 0 && (
            <div className="mt-0.5 flex justify-between items-center">
              <div></div>
              <span
                onClick={() => {
                  setItineraries((prev) => {
                    const newItineraries = [...prev];
                    newItineraries[realIndex].locations.splice(index, 1);
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
      </form>
    </div>
  );
}

Location.propTypes = {};

export default Location;
