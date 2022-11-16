import React, { useState } from "react";
import PropTypes from "prop-types";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Input from "../ui/Input";

function UserForm({
  formik,
  phone,
  setPhone,
  people,
  setPeople,
  invalidPhone,
}) {
  return (
    <div className="md:w-[70%] px-4 md:px-0 mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="font-black">How many people are coming?</h1>
        <div className="flex gap-5 items-center">
          <div
            onClick={() => {
              if (people > 1) {
                setPeople(people - 1);
              }
            }}
            className="w-10 h-10 cursor-pointer font-bold rounded-full border flex items-center justify-center"
          >
            {" "}
            -{" "}
          </div>
          <h1 className="font-black"> {people} </h1>
          <div
            onClick={() => {
              setPeople(people + 1);
            }}
            className="w-10 h-10 cursor-pointer font-bold rounded-full border flex items-center justify-center"
          >
            {" "}
            +{" "}
          </div>
        </div>

        <div className="my-2">
          <hr />
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex md:flex-row flex-col items-center gap-4 w-full">
            <div className="w-full relative">
              <label className="block text-sm font-bold mb-2">First name</label>

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
                {...formik.getFieldProps("first_name")}
              ></Input>

              {formik.touched.first_name && formik.errors.first_name ? (
                <span className="text-sm  font-bold text-red-400">
                  {formik.errors.first_name}
                </span>
              ) : null}
              <p className="text-gray-500 text-sm mt-1">
                Please give us the name of someone coming for this trip.
              </p>
            </div>
            <div className="w-full self-start relative">
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
                ? "mb-4"
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
          <p className="text-gray-500 text-sm mt-1">
            We’ll send your confirmation email to this address. Please make sure
            it&apos;s valid.
          </p>

          <div className="mt-4">
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
              <p className="text-sm mt-1 font-bold text-red-500">
                Invalid phone number.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

UserForm.propTypes = {};

export default UserForm;
