import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import CartItem from "../Cart/CartItem";
import Input from "../ui/Input";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import DatePickerRange from "../ui/DatePickerRange";
import { differenceInDays } from "date-fns";
import moment from "moment";
import Button from "../ui/Button";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

const OrderItem = ({ cartIndex, userProfile, order, setShowInfo }) => {
  const cartId = useSelector((state) => state.home.currentCartItemId);
  const cartItems = useSelector((state) => state.stay.currentCartItems);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState({
    from: new Date(order.from_date),
    to: new Date(order.to_date),
  });

  const formik = useFormik({
    initialValues: {
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      last_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const updateInfo = async () => {
    setLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/${
          order.stay ? "user-orders" : "user-activities-orders"
        }/${order.id}/`,
        {
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          from_date: new Date(date.from),
          to_date: new Date(date.to),
        },
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      )
      .then((res) => {
        location.reload();
      })
      .catch((err) => {
        console.log(err.response);
      });
    setShowInfo(false);
  };

  return (
    <div
      className={
        "w-full " +
        (router.query.order_id === cartIndex.toString() ? "" : "hidden")
      }
    >
      <div className="w-full relative">
        <Input
          name="first_name"
          type="text"
          placeholder="First name"
          errorStyle={
            formik.touched.first_name && formik.errors.first_name ? true : false
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
      <div className="w-full relative mt-4">
        <Input
          name="last_name"
          type="text"
          placeholder="Last name"
          label="Last name"
          className={"w-full "}
          errorStyle={
            formik.touched.last_name && formik.errors.last_name ? true : false
          }
          {...formik.getFieldProps("last_name")}
        ></Input>
        {formik.touched.last_name && formik.errors.last_name ? (
          <span className="text-sm absolute -bottom-6 font-bold text-red-400">
            {formik.errors.last_name}
          </span>
        ) : null}
      </div>
      <div>
        <h1 className="mt-2 font-bold">Select a booking date</h1>
        <DatePickerRange
          showDate={true}
          date={date}
          setDate={setDate}
          className="mt-4"
        ></DatePickerRange>
      </div>
      <div className="flex mt-4 justify-center">
        <Button
          onClick={() => {
            updateInfo();
          }}
          className="w-full !py-3 text-lg !bg-blue-900 !text-primary-blue-200"
        >
          <span className="font-bold mr-2">Update</span>
          <div className={" " + (!loading ? "hidden" : "")}>
            <LoadingSpinerChase width={20} height={20}></LoadingSpinerChase>
          </div>
        </Button>
      </div>
    </div>
  );
};

OrderItem.propTypes = {};

export default OrderItem;
