import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import axios from "axios";
import * as Yup from "yup";
import Image from "next/image";
import { useFormik } from "formik";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { usePaystackPayment } from "react-paystack";
import Select from "react-select";
import "react-phone-number-input/style.css";

import getToken from "../../../lib/getToken";
import Navbar from "../../../components/Home/InHeaderNavbar";
import ContactBanner from "../../../components/Home/ContactBanner";
import { useRouter } from "next/router";
import Button from "../../../components/ui/Button";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Price from "../../../components/Stay/Price";
import Dialogue from "../../../components/Home/Dialogue";
import Input from "../../../components/ui/Input";

function Transport({ userProfile }) {
  const router = useRouter();

  const [passengers, setPassengers] = useState(1);

  const [phone, setPhone] = useState("");

  const [invalidPhone, setInvalidPhone] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingForPaystack, setLoadingForPaystack] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const [showCheckoutResponseModal, setShowCheckoutResponseModal] =
    useState(false);

  const [message, setMessage] = useState("");

  const totalPrice = () => {
    return (
      (transportType && transportType.value === 1
        ? 35_000
        : transportType.value === 2
        ? 50_000
        : transportType.value === 3
        ? 40_000
        : 58_000) * passengers
    );
  };

  const [transportType, setTransportType] = useState({
    label: "Car(for 2 days)",
    value: 1,
  });

  const transportTypes = [
    {
      label: "Car(for 2 days)",
      value: 1,
    },
    {
      label: "Car(for 3 days)",
      value: 2,
    },
    {
      label: "Van(for 2 days)",
      value: 3,
    },
    {
      label: "Van(for 3 days)",
      value: 4,
    },
  ];

  const formik = useFormik({
    initialValues: {
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
      confirmation_code: "",
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

      confirmation_code: Yup.string()
        .required("This field is required")
        .max(10, "This field has a max length of 10")
        .min(10, "This field has a max length of 10"),
    }),
    onSubmit: async (values) => {
      if (isValidPhoneNumber(phone || "")) {
        setLoading(true);
        axios
          .post(`${process.env.NEXT_PUBLIC_baseURL}/event/create-transport/`, {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            message: message,
            type_of_transport: transportType.label,
            confirmation_code: values.confirmation_code,
            phone: phone,
            passengers: passengers,
          })
          .then((res) => {
            setLoading(false);
            setShowCheckoutResponseModal(true);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else if (!isValidPhoneNumber(phone || "")) {
        setLoading(false);
        setInvalidPhone(true);
      }
    },
  });

  const total = () => {
    let price = totalPrice() + totalPrice() * 0.035;

    return parseInt(
      (Math.floor(price * 100) / 100).toFixed(2).replace(".", ""),
      10
    );
  };

  const config = {
    reference: new Date().getTime().toString(),
    email: formik.values.email,
    amount: total(),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: "GHS",
  };

  const onSuccess = (reference) => {
    if (isValidPhoneNumber(phone || "")) {
      setLoadingForPaystack(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_baseURL}/event/create-transport/`, {
          first_name: formik.values.first_name,
          last_name: formik.values.last_name,
          email: formik.values.email,
          message: message,
          type_of_transport: transportType.label,
          confirmation_code: "CARD",
          phone: phone,
          passengers: passengers,
        })
        .then((res) => {
          setLoadingForPaystack(false);
          setShowCheckoutResponseModal(true);
        })
        .catch((err) => {
          setLoadingForPaystack(false);
        });
    } else if (!isValidPhoneNumber(phone || "")) {
      setLoadingForPaystack(false);
      setInvalidPhone(true);
    }
  };

  const initializePayment = usePaystackPayment(config);

  const maxPassenger =
    transportType && (transportType.value === 3 || transportType.value === 4)
      ? 9
      : 5;

  return (
    <div>
      <div className="sticky md:fixed top-0 w-full bg-white z-20">
        <div className="hidden md:block">
          <ContactBanner></ContactBanner>
        </div>

        <Navbar
          userProfile={userProfile}
          isHomePage={true}
          logoImage="/images/winda_logo/horizontal-blue-font.png"
        ></Navbar>
      </div>

      <div className="mt-5 md:mt-[140px] max-w-[1080px] mx-auto">
        <div className="flex md:flex-row flex-col gap-4 px-4">
          <div className="md:w-[40%] md:px-2 md:h-[90vh] mt-0 md:sticky top-[80px]">
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
              <div className="flex h-28 gap-2">
                <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={
                      transportType &&
                      (transportType.value === 3 || transportType.value === 4)
                        ? "/images/van-img.jpg"
                        : "/images/car-img.png"
                    }
                    unoptimized={true}
                    alt="Image of a car"
                  ></Image>
                </div>

                <div className="flex flex-col gap-1">
                  <h1 className="text-gray-600 text-xs uppercase">
                    Up to{" "}
                    {transportType &&
                    (transportType.value === 3 || transportType.value === 4)
                      ? 9
                      : 5}{" "}
                    passengers
                  </h1>
                  <h1 className="font-bold">
                    {transportType &&
                    (transportType.value === 3 || transportType.value === 4)
                      ? "Van"
                      : "Car"}{" "}
                    transfer
                  </h1>
                  {/* <h1 className="text-sm">
                        {stay.type_of_rooms[Number(router.query.room_type)] &&
                          stay.type_of_rooms[Number(router.query.room_type)]
                            .name}
                      </h1> */}
                  <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                    <Icon icon="akar-icons:clock" />{" "}
                    {transportType &&
                    (transportType.value === 2 || transportType.value === 4)
                      ? 3
                      : 2}{" "}
                    days
                  </p>
                  {/* {trip.starting_location && (
                        <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                          Starting from {trip.starting_location}
                        </p>
                      )} */}
                </div>
              </div>

              <div className="h-[0.6px] w-full bg-gray-500 mt-10 mb-4"></div>
              <h1 className="font-bold text2xl font-OpenSans">Breakdown</h1>

              <div className="flex flex-col gap-4 mt-4 justify-between w-full items-center">
                <div className="text-gray-600 flex items-center w-full justify-between">
                  <div className="flex gap-1.5 text-sm items-center w-[70%]">
                    Price per passenger
                  </div>

                  <div className="text-sm font-bold">
                    <Price
                      currency="KES"
                      stayPrice={totalPrice() / passengers}
                      className="!text-sm !text-gray-600"
                    ></Price>
                  </div>
                </div>

                <div className="text-gray-600 flex items-center w-full justify-between">
                  <div className="flex gap-1.5 text-sm items-center w-[70%]">
                    Price for {passengers}{" "}
                    {passengers > 1 ? "passengers" : "passenger"}
                  </div>

                  <div className="text-sm font-bold">
                    <Price
                      currency="KES"
                      stayPrice={totalPrice()}
                      className="!text-sm !text-gray-600"
                    ></Price>
                  </div>
                </div>
              </div>

              <div className="h-[0.4px] my-4 w-[100%] bg-gray-400"></div>

              <div className="text-gray-600 flex items-center w-full justify-between">
                <div className="flex gap-1.5 items-center">Total price</div>

                <Price
                  currency="KES"
                  stayPrice={totalPrice()}
                  className="!text-sm !text-gray-600"
                ></Price>
              </div>
            </div>
          </div>

          <div className="md:w-[60%] w-full md:pl-4">
            <div className="h-[0.4px] w-[100%] my-4 bg-gray-400 md:hidden"></div>

            {/* <h1 className="font-bold text-2xl mb-4 font-OpenSans">
              Transport details
            </h1> */}

            <div className="my-4 flex flex-col">
              <div className="flex flex-col gap-2">
                <p className="font-bold">Select a transport</p>
                <Select
                  defaultValue={transportType}
                  onChange={(value) => {
                    setTransportType(value);
                    setPassengers(1);
                  }}
                  className={
                    "text-sm outline-none border border-gray-300 pl-2 rounded-md "
                  }
                  instanceId={transportTypes}
                  placeholder="Select a type of transport"
                  options={transportTypes}
                  isSearchable={false}
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <h1 className="font-bold">Passengers</h1>

                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      if (passengers > 1) {
                        setPassengers(passengers - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
                  >
                    {" "}
                    -{" "}
                  </div>

                  <div className="text-sm font-bold">{passengers}</div>
                  <div
                    onClick={() => {
                      if (passengers < maxPassenger) {
                        setPassengers(passengers + 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full cursor-pointer border flex items-center justify-center shadow-lg font-bold"
                  >
                    +
                  </div>
                </div>
              </div>
            </div>

            <h1 className="font-bold text-2xl mb-4 font-OpenSans">
              Your details
            </h1>

            <div className="my-4 flex flex-col">
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
                      Please give us the name of one of the people staying in
                      this room.
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
                    <p className="text-sm mt-1 text-red-500">
                      Invalid phone number.
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className="mt-6">
              <div className="h-[0.4px] w-[100%] bg-gray-400 my-6"></div>

              <div className="flex items-center justify-between mt-4">
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

              <div className="h-[0.4px] w-[100%] bg-gray-400 my-6"></div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl mb-2">Pay with Mpesa</h1>
                  <div className="relative w-20 h-16">
                    <Image
                      className="w-full h-full"
                      layout="fill"
                      unoptimized={true}
                      objectFit="fit"
                      alt="Image"
                      src="/images/128px-M-PESA_LOGO-01.svg.png"
                    ></Image>
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-4">
                  <h1 className="text-lg text-center">
                    Please enter the following for payment
                  </h1>
                  <div className="flex justify-between items-center">
                    <h1 className="font-bold">Paybill Number</h1>
                    <p>329329</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <h1 className="font-bold">Account Number</h1>
                    <p>0102479992200</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <h1 className="font-bold">Amount to Pay</h1>
                    <Price
                      currency="KES"
                      stayPrice={totalPrice()}
                      className="!text-base"
                    ></Price>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm">
                    The account name is{" "}
                    <span className="font-bold">
                      C2B Standard Chartered Bank
                    </span>{" "}
                    for account 0102479992200
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex flex-col gap-1">
                    <Input
                      name="confirmation_code"
                      type="text"
                      errorStyle={
                        formik.touched.confirmation_code &&
                        formik.errors.confirmation_code
                          ? true
                          : false
                      }
                      placeholder="Confirmation code"
                      label="Please type in the mpesa confirmation code"
                      {...formik.getFieldProps("confirmation_code")}
                    ></Input>
                    {formik.touched.confirmation_code &&
                    formik.errors.confirmation_code ? (
                      <span className="text-sm mt-1 font-bold text-red-400">
                        {formik.errors.confirmation_code}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <Dialogue
                isOpen={showMessage}
                closeModal={() => {
                  setShowMessage(false);
                }}
                dialoguePanelClassName="!max-w-md !h-[400px]"
                title={"Add a message"}
                dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
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

              <Dialogue
                isOpen={showCheckoutResponseModal}
                closeModal={() => {
                  setShowCheckoutResponseModal(false);
                  router.back();
                }}
                dialoguePanelClassName="!max-w-md !h-[265px]"
                title={"Thanks for booking this stay"}
                dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
              >
                <div>
                  Thank you for booking!!!🥳. We&apos;ll get back to you in less
                  than 24 hours. We are confirming all the details of the stay.
                </div>

                <div className="mt-4">Meanwhile...</div>

                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => {
                      router.replace("/gondwana");
                    }}
                    className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                  >
                    <span>Back to Gondwana</span>
                  </Button>

                  <Button
                    onClick={() => {
                      router.replace("/");
                    }}
                    className="flex w-[40%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
                  >
                    <span>Check out Winda</span>
                  </Button>
                </div>
              </Dialogue>

              <div className="mt-8">
                <Button
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  className="flex w-full md:w-[210px] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                >
                  <span>Book this stay with mpesa</span>

                  <div className={" " + (loading ? "ml-1.5 " : " hidden")}>
                    <LoadingSpinerChase
                      width={13}
                      height={13}
                      color="white"
                    ></LoadingSpinerChase>
                  </div>
                </Button>
              </div>

              <div className="mt-4 flex gap-4 items-center">
                <div className="flex-grow h-px bg-gray-300"></div>
                <div className="text-sm font-bold text-center">
                  Or pay with card
                </div>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              <div className="flex justify-between items-center">
                <h1 className="font-bold">Price</h1>

                <Price
                  currency="KES"
                  stayPrice={totalPrice()}
                  className="!text-base"
                ></Price>
              </div>

              <div className="flex justify-between mt-3 items-center">
                <h1 className="font-bold">Card processing fees (3.5%)</h1>

                <Price
                  currency="KES"
                  stayPrice={totalPrice() * 0.035}
                  className="!text-base"
                ></Price>
              </div>

              <div className="flex justify-between mt-3 items-center">
                <h1 className="font-bold">Total price</h1>
                <Price
                  currency="KES"
                  stayPrice={totalPrice() + totalPrice() * 0.035}
                  className="!text-base"
                ></Price>
              </div>

              <div className="mt-4 mb-3">
                <Button
                  onClick={() => {
                    formik.setTouched({
                      first_name: true,
                      last_name: true,
                      email: true,
                      confirmation_code: false,
                    });
                    if (isValidPhoneNumber(phone || "")) {
                      setInvalidPhone(true);
                      formik.validateForm().then(() => {
                        initializePayment(onSuccess);
                      });
                    } else {
                      setInvalidPhone(true);
                    }
                  }}
                  type="submit"
                  className="flex w-full mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-blue-600 !text-white"
                >
                  <span>Use a card</span>
                  <Icon icon="bxs:lock-alt" className="w-5 h-5" />

                  <div
                    className={
                      " " + (loadingForPaystack ? "ml-1.5 " : " hidden")
                    }
                  >
                    <LoadingSpinerChase
                      width={13}
                      height={13}
                      color="white"
                    ></LoadingSpinerChase>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Transport.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

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
        },
      };
    }

    return {
      props: {
        userProfile: "",
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
    } else {
      return {
        props: {
          userProfile: "",
        },
      };
    }
  }
}

export default Transport;
