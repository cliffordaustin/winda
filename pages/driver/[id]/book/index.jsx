import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createGlobalStyle } from "styled-components";
import { Transition } from "@headlessui/react";

import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../../../components/ui/Button";
import TextArea from "../../../../components/ui/TextArea";
import Input from "../../../../components/ui/Input";
import PulseLoader from "react-spinners/PulseLoader";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/router";
import moment from "moment/moment";

function BookTripCalendar({ userProfile }) {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    min-width: 20px !important;
    min-height: 20px !important;
  }
  .rdp-button {
    border-radius: 100px !important;
    font-size: 0.8rem !important;
  }
  .rdp-months {
    width: 100% !important;
  }
  .rdp-day_range_middle {
    opacity: 0.5 !important;
  }
`;

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");

  const [invalidPhone, setInvalidPhone] = useState(false);

  const [date, setDate] = useState(null);

  const formik = useFormik({
    initialValues: {
      location: "",
      note: "",
      agent_name: "",
      email: "",
      passengers: "",
      amount_due: "",
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .max(200, "This field has a max length of 200")
        .required("This field is required"),
      agent_name: Yup.string().max(200, "This field has a max length of 200"),
      email: Yup.string().email("Invalid email address"),
      passengers: Yup.number().min(1, "This field has a min value of 1"),
      amount_due: Yup.number().min(1, "This field has a min value of 1"),
    }),
    onSubmit: async (values) => {
      if (isValidPhoneNumber(phone || "")) {
        setLoading(true);
        axios
          .post(`${process.env.NEXT_PUBLIC_baseURL}/create-agent-request/`, {
            location: values.location,
            note: values.note,
            agent_name: values.agent_name,
            agent_email: values.email,
            amount_due: values.amount_due,
            number_of_guests: values.passengers,
            agent_phone: phone,
            partner_id: router.query.id,
            date: moment(date).format("YYYY-MM-DD"),
            from_agent: true,
            accepted: false,
          })
          .then((res) => {
            setLoading(false);
            router.reload();
          })
          .catch((err) => {
            setLoading(false);
            console.log(err.response);
          });
      } else if (!isValidPhoneNumber(phone || "")) {
        setLoading(false);
        setInvalidPhone(true);
      }
    },
  });

  const override = {
    display: "block",
    margin: "0 auto",
    marginTop: "3px",
  };

  return (
    <div className="">
      <GlobalStyle></GlobalStyle>
      <div className="max-w-[800px] mx-auto p-4 mt-6 mb-3 md:rounded-lg md:shadow-lg">
        <div className="flex flex-col gap-1">
          <h1 className="font-black">Book a date</h1>

          <p className="text-sm text-gray-600">
            Driver&apos;s ({userProfile.first_name}) Calendar
          </p>
        </div>

        <div className="mt-5 hidden md:block">
          <DayPicker
            mode="single"
            selected={date}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
            onSelect={(date) => {
              if (date) {
                setDate(date);
              }
            }}
            className="!w-full p-4"
          />
        </div>

        <div className="mt-5 md:hidden mx-auto w-full">
          <DayPicker
            mode="single"
            selected={date}
            numberOfMonths={1}
            disabled={{ before: new Date() }}
            onSelect={(date) => {
              if (date) {
                setDate(date);
              }
            }}
            className="!w-full p-4"
          />
        </div>

        <div className="h-[1px] w-full bg-gray-200 mt-3 mb-4"></div>

        <h1 className="font-black">Your booking details</h1>

        <div className="md:px-5 mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full relative">
              <Input
                name="location"
                type="text"
                value={formik.values.location}
                placeholder="Location"
                errorStyle={
                  formik.touched.location && formik.errors.location
                    ? true
                    : false
                }
                {...formik.getFieldProps("location")}
                className={"w-full placeholder:text-sm "}
                inputClassName="!text-sm "
                label="Name of location?"
              ></Input>
              {formik.touched.location && formik.errors.location ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.location}
                </span>
              ) : null}
            </div>
            <div className="flex md:gap-0 gap-2 md:flex-row flex-col items-start justify-between mt-2">
              <div className="w-full md:w-[58%] relative">
                <Input
                  name="agent_name"
                  type="text"
                  value={formik.values.agent_name}
                  placeholder="Name"
                  errorStyle={
                    formik.touched.agent_name && formik.errors.agent_name
                      ? true
                      : false
                  }
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Your name"
                  {...formik.getFieldProps("agent_name")}
                ></Input>
                {formik.touched.agent_name && formik.errors.agent_name ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.agent_name}
                  </span>
                ) : null}
              </div>

              <div className="w-full md:w-[38%] relative">
                <Input
                  name="passengers"
                  type="number"
                  value={formik.values.passengers}
                  placeholder="Passengers"
                  errorStyle={
                    formik.touched.passengers && formik.errors.passengers
                      ? true
                      : false
                  }
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Number of passengers"
                  {...formik.getFieldProps("passengers")}
                ></Input>
                {formik.touched.passengers && formik.errors.passengers ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.passengers}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex md:gap-0 gap-2 md:flex-row flex-col items-start justify-between mt-4">
              <div className="w-full md:w-[50%] relative">
                <Input
                  name="email"
                  type="email"
                  value={formik.values.email}
                  placeholder="Email"
                  errorStyle={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  className={"w-full placeholder:text-sm "}
                  inputClassName="!text-sm "
                  label="Email"
                  {...formik.getFieldProps("email")}
                ></Input>
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>

              <div className="w-full md:w-[46%] relative">
                <label className="block text-sm font-bold mb-2">
                  Cell phone number
                </label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="KE"
                />

                {invalidPhone && (
                  <p className="text-sm mt-1 text-red-500">
                    Invalid phone number.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full relative mt-3">
              <Input
                name="amount_due"
                type="number"
                value={formik.values.amount_due}
                placeholder="Price"
                errorStyle={
                  formik.touched.amount_due && formik.errors.amount_due
                    ? true
                    : false
                }
                className={"w-full placeholder:text-sm "}
                inputClassName="!text-sm "
                label="Amount you will pay"
                {...formik.getFieldProps("amount_due")}
              ></Input>
              {formik.touched.amount_due && formik.errors.amount_due ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.amount_due}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col mt-2">
              <TextArea
                placeholder="Note"
                name="note"
                value={formik.values.note}
                label="Enter a note"
                errorStyle={
                  formik.touched.note && formik.errors.note ? true : false
                }
                className={"w-full !text-sm placeholder:text-sm "}
                {...formik.getFieldProps("note")}
              ></TextArea>

              {formik.touched.note && formik.errors.note ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.note}
                </span>
              ) : null}
            </div>
            <div className="mt-4 mb-3 flex justify-between">
              <div></div>
              <Button
                type="submit"
                className="!bg-blue-600 flex items-center gap-1 w-fit !px-8 !outline-none !font-bold"
              >
                <span>Save</span>
                <PulseLoader
                  color={"#ffffff"}
                  loading={loading}
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
    </div>
  );
}

BookTripCalendar.propTypes = {};

export default BookTripCalendar;

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/get-user/${context.query.id}/`
    );

    if (response.data.is_partner) {
      return {
        props: {
          userProfile: response.data,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
