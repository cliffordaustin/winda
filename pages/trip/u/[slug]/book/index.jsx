import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import getToken from "../../../../../lib/getToken";
import axios from "axios";
import Button from "../../../../../components/ui/Button";
import LoadingSpinerChase from "../../../../../components/ui/LoadingSpinerChase";
import Dialogue from "../../../../../components/Home/Dialogue";
import { Icon } from "@iconify/react";
import Price from "../../../../../components/Stay/Price";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Input from "../../../../../components/ui/Input";
import Image from "next/image";
import Navbar from "../../../../../components/ui/Navbar";
import moment from "moment/moment";
import { useRouter } from "next/router";

import { useFormik } from "formik";
import { usePaystackPayment } from "react-paystack";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import PopoverBox from "../../../../../components/ui/Popover";
import DatePicker from "../../../../../components/ui/DatePickerOpen";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Mixpanel } from "../../../../../lib/mixpanelconfig";

function BookTrip({ trip, userProfile }) {
  const tripSortedImages = trip.curated_trip_images.sort(
    (x, y) => y.main - x.main
  );

  const router = useRouter();

  const tripImages = tripSortedImages.map((image) => {
    return image.image;
  });

  const [adults, setAdults] = useState(1);

  const startingLocation =
    trip.locations.length > 0 ? trip.locations[0].location : "";

  const endingLocation =
    trip.locations.length > 0
      ? trip.locations[trip.locations.length - 1].location
      : "";

  const [price, setPrice] = useState();

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const getResidentPrice = () => {
    const pricePlan = router.query.plan;

    if (pricePlan === "2") {
      return trip.plan_b_price.price;
    } else if (pricePlan === "3") {
      return trip.plan_c_price.price;
    } else {
      return trip.plan_a_price.price;
    }
  };

  const getNonResidentPrice = () => {
    const pricePlan = router.query.plan;

    if (pricePlan === "2") {
      return trip.plan_b_price.price_non_resident;
    } else if (pricePlan === "3") {
      return trip.plan_c_price.price_non_resident;
    } else {
      return trip.plan_a_price.price_non_resident;
    }
  };

  useEffect(() => {
    setPrice(userIsFromKenya ? getResidentPrice() : getNonResidentPrice());
  }, []);

  const [phone, setPhone] = useState("");

  const [invalidPhone, setInvalidPhone] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingForPaystack, setLoadingForPaystack] = useState(false);

  const [message, setMessage] = useState("");

  const [startingDate, setStartingDate] = useState(null);

  const [showMessage, setShowMessage] = useState(false);

  const [startingDateError, setStartingDateError] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
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
    }),
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/${router.query.slug}/create-booked-trip/`,
          {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            starting_date: moment(startingDate).format("YYYY-MM-DD"),
            phone: phone,
            adults: adults,
            message: message,
            booking_request: true,
          }
        )
        .then((res) => {
          setLoading(false);

          Mixpanel.track("User requested to book trip", {
            name_of_trip: trip.name,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            adults: adults,
          });
        })
        .catch((err) => {
          setLoading(false);
        });
    },
  });

  function StartingDate({ close }) {
    return (
      <div className="w-full">
        <DatePicker
          date={startingDate}
          setDate={(date) => {
            setStartingDate(date);
            setStartingDateError(false);
            close();
          }}
          disableDate={new Date()}
        ></DatePicker>
      </div>
    );
  }

  const currency = Cookies.get("currency");

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const total = () => {
    let totalPrice = price * adults + price * adults * 0.035;

    totalPrice = !userIsFromKenya
      ? totalPrice
      : totalPrice * priceConversionRate;

    return parseInt(
      (Math.floor(totalPrice * 100) / 100).toFixed(2).replace(".", ""),
      10
    );
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: formik.values.email,
    amount: total(),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: userIsFromKenya ? "KES" : "USD",
    channels: ["card", "mobile_money"],
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    setLoadingForPaystack(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/${router.query.slug}/create-booked-trip/`,
        {
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          email: formik.values.email,
          starting_date: moment(startingDate).format("YYYY-MM-DD"),
          phone: phone,
          adults: adults,
          message: message,
          paid: true,
          booking_request: false,
        }
      )
      .then((res) => {
        setLoadingForPaystack(false);

        Mixpanel.track("User paid for trip", {
          name_of_trip: trip.name,
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          email: formik.values.email,
          adults: adults,
        });
      })
      .catch((err) => {
        setLoadingForPaystack(false);
        console.log(err.response);
      });
  };

  return (
    <div>
      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <Navbar userProfile={userProfile}></Navbar>
      </div>
      <div className=" max-w-[1080px] mt-5 mx-auto">
        <div className="flex gap-4 px-4">
          <div className="md:w-[40%] px-2 hidden md:block h-[90vh] mt-0 sticky top-[100px]">
            <div
              onClick={() => {
                router.back();
              }}
              className="flex gap-1 mb-3 font-bold cursor-pointer items-center text-black"
            >
              <Icon className="w-6 h-6" icon="bx:chevron-left" />
              <span>Back</span>
            </div>
            <div className="h-fit shadow-lg border px-4 py-4 w-full rounded-lg">
              <h1 className="font-black text-lg font-OpenSans mb-5">
                Trip breakdown
              </h1>
              <div className="flex h-[80px] gap-2">
                <div className="relative h-full bg-gray-300 w-32 rounded-md overflow-hidden">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={tripImages[0]}
                    unoptimized={true}
                    alt="Main image of trip"
                  ></Image>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="font-black">{trip.name}</h1>
                  <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                    <Icon icon="akar-icons:clock" /> {trip.total_number_of_days}{" "}
                    days trip
                  </p>
                  {trip.starting_location && (
                    <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                      Starting from {trip.starting_location}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <div className="flex flex-col w-[48%] gap-1 border-r">
                  <div className="flex items-center gap-2">
                    <Icon icon="ant-design:calendar-filled" />
                    <p className="text-xs uppercase text-gray-500">
                      Trip start
                    </p>
                  </div>
                  <h1 className="font-bold text-sm">
                    {startingDate
                      ? moment(startingDate).format("Do MMM YYYY")
                      : "Not set"}
                  </h1>
                  <p className="text-sm text-gray-600">{startingLocation}</p>
                </div>

                <div className="flex flex-col w-[48%] gap-1">
                  <div className="flex items-center gap-2 ">
                    <Icon icon="ant-design:calendar-filled" />
                    <p className="text-xs uppercase text-gray-500">Trip end</p>
                  </div>
                  <h1 className="font-bold text-sm">
                    {startingDate
                      ? moment(startingDate)
                          .add(trip.total_number_of_days, "days")
                          .format("Do MMM YYYY")
                      : "Add a starting date"}
                  </h1>
                  <p className="text-sm text-gray-600">{endingLocation}</p>
                </div>
              </div>

              <div className="my-4 h-[1px] w-full bg-gray-300"></div>

              <div className="flex justify-between items-center">
                <h1 className="font-bold">Passengers</h1>
                <h1 className="text-sm font-bold">
                  {adults} {adults > 1 ? " Adults" : "Adult"}
                </h1>
              </div>

              <div className="flex justify-between mt-2 items-center">
                <h1 className="font-bold">Per adult</h1>
                <Price
                  className="!text-sm !text-gray-700"
                  stayPrice={price}
                ></Price>
              </div>

              <div className="my-4 h-[1px] w-full bg-gray-300"></div>

              <div className="flex justify-between mt-2 items-center">
                <h1 className="font-bold">Total</h1>
                <Price
                  className="!text-sm !text-gray-700"
                  stayPrice={price * adults}
                ></Price>
              </div>
            </div>
          </div>

          <div className="md:w-[60%] w-full md:pl-4">
            <div className="px-4 py-2 mb-4 text-sm bg-gray-100">
              <span className="font-bold">Note:</span>{" "}
              <span>
                You may be required for more information after booking
              </span>
            </div>
            <div className="px-4 py-3 border rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon icon="bxs:user" />
                <h1 className="text-sm font-bold">Adults</h1>
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    if (adults > 1) {
                      setAdults(adults - 1);
                    }
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border font-black text-lg cursor-pointer"
                >
                  {" "}
                  -{" "}
                </div>
                <h1 className="text-sm font-bold">
                  {adults} {adults > 1 ? " Adults" : " Adult"}
                </h1>
                <div
                  onClick={() => {
                    setAdults(adults + 1);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border font-black text-lg cursor-pointer"
                >
                  {" "}
                  +{" "}
                </div>
              </div>
            </div>

            <div
              className={
                "px-4 py-2 border rounded-lg mb-2 flex items-center justify-between " +
                (startingDateError ? "border-red-500" : "")
              }
            >
              <div className="flex flex-col gap-2">
                <div className="font-bold">Starting date</div>
                <div className="text-sm text-gray-600">
                  {startingDate
                    ? moment(startingDate).format("DD MMM YYYY")
                    : "Select a starting date"}
                </div>
              </div>

              <PopoverBox
                btnPopover={
                  <div className="w-9 h-9 rounded-full cursor-pointer border-transparent border flex items-center justify-center hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-linear">
                    <Icon className="w-5 h-5" icon="clarity:pencil-solid" />
                  </div>
                }
                btnClassName=""
                popoverClassName="flex items-center justify-center"
                panelClassName="h-fit !max-w-[400px] md:!w-[400px] rounded-lg bg-white right-0 border shadow-lg mt-1 top-full"
              >
                <StartingDate></StartingDate>
              </PopoverBox>
            </div>

            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex flex-col gap-2">
                <div className="font-bold">Send a message</div>
                {!message && (
                  <div className="text-sm text-gray-600">
                    Let us know of any additional information you have
                  </div>
                )}

                {message && (
                  <div className="text-sm text-gray-600">{message}</div>
                )}
              </div>

              <div
                onClick={() => {
                  setShowMessage(!showMessage);
                }}
                className="p-2 rounded-full cursor-pointer border-transparent border flex items-center justify-center hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-linear"
              >
                {!message && (
                  <Icon className="w-5 h-5" icon="fluent:add-16-filled" />
                )}
                {message && (
                  <Icon className="w-5 h-5" icon="clarity:pencil-solid" />
                )}
              </div>
            </div>
            <div className="font-black text-lg">Lead guest detail</div>

            <div className="mb-4 mt-4 flex flex-col">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex md:flex-row flex-col items-center gap-4 w-full">
                  <div className="w-full relative">
                    <label className="block text-sm font-bold mb-2">
                      First name
                    </label>

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
                  We’ll send your confirmation email to this address. Please
                  make sure it&apos;s valid.
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

            <div className="mt-8 flex gap-4 items-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <div className="text-sm font-bold text-center">Payment</div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-bold">Price</h1>
              <Price
                className="!text-sm !font-bold"
                stayPrice={price * adults}
              ></Price>
            </div>

            <div className="flex justify-between mt-3 items-center">
              <h1 className="font-bold">Processing fees (3.5%)</h1>
              <Price
                className="!text-sm !font-bold"
                stayPrice={price * adults * 0.035}
              ></Price>
            </div>

            <div className="flex justify-between mt-3 items-center">
              <h1 className="font-bold">Total price</h1>
              <Price
                className="!text-sm !font-bold"
                stayPrice={price * adults + price * adults * 0.035}
              ></Price>
            </div>

            <div className="mt-4 mb-3">
              <Button
                onClick={() => {
                  formik.setTouched({
                    first_name: true,
                    last_name: true,
                    email: true,
                  });

                  if (isValidPhoneNumber(phone || "") && startingDate) {
                    setInvalidPhone(false);
                    formik.validateForm().then(() => {
                      initializePayment(onSuccess);
                    });
                  } else if (!isValidPhoneNumber(phone || "") && startingDate) {
                    setInvalidPhone(true);
                  } else if (isValidPhoneNumber(phone || "") && !startingDate) {
                    setInvalidPhone(false);
                    setStartingDateError(true);
                  } else {
                    setInvalidPhone(true);
                    setStartingDateError(true);
                  }
                }}
                type="submit"
                className="flex w-full mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 !text-white"
              >
                <span>Pay now</span>
                <Icon icon="bxs:lock-alt" className="w-5 h-5" />

                <div
                  className={" " + (loadingForPaystack ? "ml-1.5 " : " hidden")}
                >
                  <LoadingSpinerChase
                    width={13}
                    height={13}
                    color="white"
                  ></LoadingSpinerChase>
                </div>
              </Button>
            </div>

            <div className="mt-8 flex gap-4 items-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <div className="text-sm font-bold text-center">
                Don&apos;t want to pay now?
              </div>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => {
                  formik.setTouched({
                    first_name: true,
                    last_name: true,
                    email: true,
                  });
                  if (isValidPhoneNumber(phone || "") && startingDate) {
                    setInvalidPhone(false);
                    formik.handleSubmit();
                  } else if (!isValidPhoneNumber(phone || "") && startingDate) {
                    setInvalidPhone(true);
                  } else if (isValidPhoneNumber(phone || "") && !startingDate) {
                    setInvalidPhone(false);
                    setStartingDateError(true);
                  } else {
                    setInvalidPhone(true);
                    setStartingDateError(true);
                  }
                }}
                className="flex w-full mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-blue-600 !text-white"
              >
                <span>Request to book</span>

                <div className={" " + (loading ? "ml-1.5 " : " hidden")}>
                  <LoadingSpinerChase
                    width={13}
                    height={13}
                    color="white"
                  ></LoadingSpinerChase>
                </div>
              </Button>
            </div>

            <Dialogue
              isOpen={showMessage}
              closeModal={() => {
                setShowMessage(false);
              }}
              dialoguePanelClassName="!max-w-md !h-[400px]"
              title={"Add a message"}
              dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3 "
            >
              <div>
                <textarea
                  className="w-full h-[220px] p-2 border rounded-lg resize-none outline-none"
                  placeholder="Add a message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                ></textarea>

                <div
                  onClick={() => {
                    setMessage("");
                  }}
                  className="text-sm underline cursor-pointer mt-2"
                >
                  Clear message
                </div>

                <div
                  onClick={() => {
                    setShowMessage(false);
                  }}
                  className="font-bold w-full py-3 cursor-pointer mt-2 bg-gray-700 rounded-lg text-center text-white"
                >
                  Save
                </div>
              </div>
            </Dialogue>
          </div>
        </div>
      </div>
    </div>
  );
}

BookTrip.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const trip = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/${context.query.slug}/`
    );

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          trip: trip.data,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        trip: trip.data,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else if (error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          trip: [],
        },
      };
    }
  }
}

export default BookTrip;
