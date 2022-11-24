import React from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../ui/Input";

function OptionalActivities({ activity, index, setItineraries, realIndex }) {
  const formik = useFormik({
    initialValues: {
      name: activity.name,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(200, "This field has a max length of 200"),
    }),
    onSubmit: async (values) => {},
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="border rounded-md bg-[#f5f3f4] shadow-md flex flex-col gap-3 px-3 py-2 w-full relative">
        <Input
          name="name"
          type="text"
          value={formik.values.name}
          placeholder="Optional activities"
          errorStyle={formik.touched.name && formik.errors.name ? true : false}
          className={"w-full placeholder:text-sm "}
          inputClassName="!text-sm "
          label="What are the optional activities?"
          onChange={(e) => {
            formik.handleChange(e);
            setItineraries((prev) => {
              const newItineraries = [...prev];
              newItineraries[realIndex].optional_activities[index].name =
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

        {index > 0 && (
          <div className="mt-0.5 flex justify-between items-center">
            <div></div>
            <span
              onClick={() => {
                setItineraries((prev) => {
                  const newItineraries = [...prev];

                  newItineraries[realIndex].optional_activities.splice(
                    index,
                    1
                  );
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
  );
}

OptionalActivities.propTypes = {};

export default OptionalActivities;
