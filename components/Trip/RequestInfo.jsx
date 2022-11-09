import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { useRouter } from "next/router";
import { Mixpanel } from "../../lib/mixpanelconfig";

function RequestInfo({
  tripSlug,
  submitCompleteFunc,
  showInfo,
  name,
  isSecondTrip,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
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
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/${
            isSecondTrip ? "curated-trips" : "recommended-trips"
          }/${tripSlug}/request-info/`,
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            message: values.message,
          }
        )
        .then((res) => {
          Mixpanel.track("User requested more info on trip", {
            name_of_trip: name,
          });
          setLoading(false);
          showInfo(false);
          submitCompleteFunc(true);
        })
        .catch((err) => {
          setLoading(false);
        });
    },
  });
  return (
    <div className="w-full">
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
            "mt-5 w-full px-5 flex items-center gap-2 mb-4 !py-3 !bg-[#0353a4] hover:!bg-[#023e7d] !rounded-lg !font-bold !text-base " +
            (loading ? "opacity-60 cursor-not-allowed" : "")
          }
        >
          <span>Send request</span>
          <div>
            {loading ? (
              <LoadingSpinerChase width={20} height={20}></LoadingSpinerChase>
            ) : (
              ""
            )}
          </div>
        </Button>
      </form>
    </div>
  );
}

RequestInfo.propTypes = {};

export default RequestInfo;
