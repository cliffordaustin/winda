import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { usePaystackPayment } from "react-paystack";
import * as Yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Link as ReactScrollLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

import getToken from "../../../lib/getToken";
import Link from "next/link";
import Image from "next/image";
import Button from "../../../components/ui/Button";
import UserDropdown from "../../../components/Home/UserDropdown";
import ClientOnly from "../../../components/ClientOnly";
import ImageGallery from "../../../components/Stay/ImageGallery";
import Accordion from "../../../components/ui/Accordion";
import Price from "../../../components/Stay/Price";
import Amenities from "../../../components/Stay/Amenities";
import ListItem from "../../../components/ui/ListItem";
import moment from "moment";
import Footer from "../../../components/Home/Footer";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Modal from "../../../components/ui/LargeFullscreenPopup";
import SingleTrip from "../../../components/Trip/SingleTrip";
import { Icon } from "@iconify/react";
import DaysAccordion from "../../../components/Trip/DaysAccordion";
import TripImageGallery from "../../../components/Trip/ImageGallery";
import Dialogue from "../../../components/Home/Dialogue";
import MapBox from "../../../components/Trip/Map";
import { checkFlightPrice } from "../../../lib/flightLocations";
import PopoverBox from "../../../components/ui/Popover";
import DatePicker from "../../../components/ui/DatePickerOpen";
import ServerError from "../../../components/Error/ServerError";
import ContactBanner from "../../../components/Home/ContactBanner";
import Input from "../../../components/ui/Input";
import { Mixpanel } from "../../../lib/mixpanelconfig";
import Navbar from "../../../components/ui/Navbar";
import TravelConciergeBanner from "../../../components/Home/TravelConciergeBanner";

function TripDetail({ userProfile, userTrips, trip }) {
  const GlobalStyle = createGlobalStyle`
  .BeaconFabButtonFrame {
    @media (max-width: 768px) {
      bottom: 70px !important;
    }
  }
  .hsds-beacon .eTCLra {
    @media (max-width: 768px) {
      bottom: 70px !important;
    }
  }
`;
  const router = useRouter();

  const [showDropdown, changeShowDropdown] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const [stayAccordion, setStayAccordion] = useState(true);

  const [activityAccordion, setActivityAccordion] = useState(false);
  const [transportAccordion, setTransportAccordion] = useState(false);
  const [showAllStayDescription, setShowAllStayDescription] = useState(false);
  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [showAllActivityDescription, setShowAllActivityDescription] =
    useState(false);

  const months = [
    {
      label: "January",
      value: "1",
    },
    {
      label: "February",
      value: "2",
    },
    {
      label: "March",
      value: "3",
    },
    {
      label: "April",
      value: "4",
    },
    {
      label: "May",
      value: "5",
    },
    {
      label: "June",
      value: "6",
    },
    {
      label: "July",
      value: "7",
    },
    {
      label: "August",
      value: "8",
    },
    {
      label: "September",
      value: "9",
    },
    {
      label: "October",
      value: "10",
    },
    {
      label: "November",
      value: "11",
    },
    {
      label: "December",
      value: "12",
    },
  ];

  const filterArrayOfObjects = (array, value) => {
    return array.filter((obj) => obj.value === value);
  };

  const [listingIsInTrip, setListingIsInTrip] = useState(false);

  const [showAddToTripPopup, setShowAddToTripPopup] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showMoreStay, setShowMoreStay] = useState(false);

  const [showMoreActivities, setShowMoreActivities] = useState(false);

  const [showMoreExperiences, setShowMoreExperiences] = useState(false);

  const [showMoreTransport, setShowMoreTransport] = useState(false);

  const addToTrip = async () => {
    setLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
        {
          stay_id: trip.stay ? trip.stay.id : null,
          activity_id: trip.activity ? trip.activity.id : null,
          transport_id: trip.transport ? trip.transport.id : null,
          flight_id: trip.flight ? trip.flight.id : null,
        },
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      )
      .then((res) => {
        router.push({
          pathname: `/trip/plan/${res.data.slug}`,
        });
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  const totalPrice = () => {
    return trip.price_non_resident || trip.price;
  };

  const tripSortedImages = trip.single_trip_images.sort(
    (x, y) => y.main - x.main
  );

  const tripImages = tripSortedImages.map((image) => {
    return image.image;
  });

  const staySortedImages = trip.stay
    ? trip.stay.stay_images.sort((x, y) => y.main - x.main)
    : [];

  const stayImages = staySortedImages.map((image) => {
    return image.image;
  });

  const activitySortedImages = trip.activity
    ? trip.activity.activity_images.sort((x, y) => y.main - x.main)
    : [];

  const activityImages = activitySortedImages.map((image) => {
    return image.image;
  });

  const [startDate, setStartDate] = useState(new Date());

  const [guest, setGuest] = useState(0);

  const [nonResidentGuest, setNonResidentGuest] = useState(1);

  const [showMap, setShowMap] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const [message, setMessage] = useState("");

  const [pageError, setPageError] = useState(false);

  const [showCheckoutResponseModal, setShowCheckoutResponseModal] =
    useState(false);

  const bookTrip = () => {
    if (Cookies.get("token")) {
      setLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.slug}/create-booked-trip/`,
          {
            starting_date: router.query.starting_date,
            guests: Number(router.query.guests)
              ? Number(router.query.guests)
              : null,
            non_residents: Number(router.query.non_resident)
              ? Number(router.query.non_resident)
              : null,
            message: message,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setShowCheckoutResponseModal(true);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  const [showDatePopup, setShowDatePopup] = useState(false);

  function Child({ close }) {
    return (
      <div className="w-full">
        <DatePicker
          date={new Date(router.query.starting_date) || new Date()}
          setDate={(date) => {
            router.replace(
              {
                query: {
                  ...router.query,
                  starting_date: moment(date).format("YYYY-MM-DD"),
                },
              },
              undefined,
              { shallow: true }
            );
            close();
          }}
          disableDate={new Date()}
        ></DatePicker>
      </div>
    );
  }

  const checkStartingDateInUrl = () => {
    if (moment(router.query.starting_date.replace(/-/g, "/")).isValid()) {
      return true;
    } else {
      setPageError(true);
    }
  };

  const checkGuestsInUrl = () => {
    if (Number(router.query.non_resident) + Number(router.query.guests) > 0) {
      return true;
    } else {
      setPageError(true);
    }
  };

  const checkNonResidentGuestsInUrl = () => {
    if (Number(router.query.non_resident) + Number(router.query.guests) > 0) {
      return true;
    } else {
      setPageError(true);
    }
  };

  useEffect(() => {
    if (router.query.checkout_page === "1") {
      checkStartingDateInUrl();
      checkNonResidentGuestsInUrl();
      checkGuestsInUrl();
    }
  }, [router.query]);

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  const [loadingForPaystack, setLoadingForPaystack] = useState(false);

  const [phone, setPhone] = useState("");

  const [invalidPhone, setInvalidPhone] = useState(false);

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
      if (isValidPhoneNumber(phone || "")) {
        setLoading(true);
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.slug}/create-booked-trip/`,
            {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              starting_date: router.query.starting_date,
              phone: phone,
              guests: Number(router.query.guests)
                ? Number(router.query.guests)
                : null,
              non_residents: Number(router.query.non_resident)
                ? Number(router.query.non_resident)
                : null,
              message: message,
              booking_request: true,
            }
          )
          .then((res) => {
            setLoading(false);
            setShowCheckoutResponseModal(true);
            Mixpanel.track("User requested to book trip", {
              name_of_trip: trip.name,
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              residents: Number(router.query.guests)
                ? Number(router.query.guests)
                : 0,
              non_residents: Number(router.query.non_resident)
                ? Number(router.query.non_resident)
                : 0,
            });
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
    let price =
      trip.price * Number(router.query.guests) +
      totalPrice() * Number(router.query.non_resident) +
      (trip.price * Number(router.query.guests) +
        totalPrice() * Number(router.query.non_resident)) *
        0.035;

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
    currency: process.env.NODE_ENV === "production" ? "USD" : "KES",
    mobile_money: {
      phone: "+254725052346",
      provider: "mtn",
    },
  };

  const [
    showCheckoutResponseModalForPayment,
    setShowCheckoutResponseModalForPayment,
  ] = useState(false);

  const onSuccess = (reference) => {
    if (isValidPhoneNumber(phone || "")) {
      setLoadingForPaystack(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.slug}/create-booked-trip/`,
          {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            email: formik.values.email,
            starting_date: router.query.starting_date,
            phone: phone,
            guests: Number(router.query.guests)
              ? Number(router.query.guests)
              : null,
            non_residents: Number(router.query.non_resident)
              ? Number(router.query.non_resident)
              : null,
            message: message,
            paid: true,
          }
        )
        .then((res) => {
          setLoadingForPaystack(false);
          setShowCheckoutResponseModalForPayment(true);
          Mixpanel.track("User paid for trip", {
            name_of_trip: trip.name,
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            email: formik.values.email,
            residents: Number(router.query.guests)
              ? Number(router.query.guests)
              : 0,
            non_residents: Number(router.query.non_resident)
              ? Number(router.query.non_resident)
              : 0,
          });
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

  return (
    <>
      {!pageError && (
        <div className="relative">
          <div className="sticky bg-white top-0 left-0 right-0 z-50">
            <div className="md:hidden">
              <TravelConciergeBanner></TravelConciergeBanner>
            </div>

            <Navbar userProfile={userProfile}></Navbar>
          </div>
          {router.query.checkout_page !== "1" && (
            <>
              <GlobalStyle></GlobalStyle>
              <div className="w-full mx-auto">
                <div className="relative">
                  <ImageGallery
                    images={trip.single_trip_images}
                    stayType={""}
                    className="md:!h-[540px] !mt-0 !h-[300px]"
                  ></ImageGallery>
                </div>
              </div>
              <div className="flex gap-4 px-4">
                <div className="md:w-[40%] lg:w-[30%] hidden md:block h-[90vh] mt-0 sticky top-[80px]">
                  <div className="w-full h-[200px] mt-4">
                    <MapBox trip={trip}></MapBox>
                  </div>

                  <div className="flex flex-col items-center border border-gray-300 rounded-md mt-4">
                    <PopoverBox
                      btnPopover={
                        <>
                          <div className="px-2 py-2 flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-300">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm self-start font-bold">
                                Starting date
                              </span>
                              <span className="text-sm text-gray-500">
                                {moment(startDate).format("Do MMM YYYY")}
                              </span>
                            </div>

                            <Icon icon="bxs:chevron-down" className="w-5 h-5" />
                          </div>
                        </>
                      }
                      btnClassName="w-full"
                      popoverClassName="w-full"
                      panelClassName="h-fit w-fit rounded-lg bg-white -top-10 border shadow-lg mt-2"
                    >
                      <div className="w-full">
                        <DatePicker
                          date={startDate}
                          setDate={setStartDate}
                          disableDate={new Date()}
                        ></DatePicker>
                      </div>
                    </PopoverBox>
                    <div className="h-[1px] w-[90%] bg-gray-300"></div>
                    <div className="px-2 py-2 flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-300">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold self-start">
                          Non-resident guest
                        </span>
                        <span className="text-sm text-gray-500">
                          {nonResidentGuest}{" "}
                          {nonResidentGuest > 1
                            ? "Non-resident guests"
                            : "Non-resident guest"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <div
                          onClick={() => {
                            if (guest + nonResidentGuest > 1) {
                              setNonResidentGuest(nonResidentGuest - 1);
                            }
                          }}
                          className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          {" "}
                          -{" "}
                        </div>

                        <div
                          onClick={() => {
                            setNonResidentGuest(nonResidentGuest + 1);
                          }}
                          className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          +
                        </div>
                      </div>
                    </div>
                    <div className="h-[1px] w-[90%] bg-gray-300"></div>
                    <div className="px-2 py-2 flex items-center justify-between w-full rounded-xl cursor-pointer transition-all duration-300">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold self-start">
                          Resident guests
                        </span>
                        <span className="text-sm text-gray-500">
                          {guest} {guest > 1 ? "guests" : "guest"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <div
                          onClick={() => {
                            if (guest + nonResidentGuest > 1) {
                              setGuest(guest - 1);
                            }
                          }}
                          className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          {" "}
                          -{" "}
                        </div>

                        <div
                          onClick={() => {
                            setGuest(guest + 1);
                          }}
                          className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-800 flex gap-0.5 items-center">
                      <Price
                        className="!text-sm !font-bold"
                        stayPrice={totalPrice()}
                      ></Price>

                      <div> x </div>
                      <div className="!text-sm">
                        {nonResidentGuest}{" "}
                        {nonResidentGuest > 1
                          ? "Non-resident guests"
                          : "Non-resident guest"}
                      </div>
                    </div>
                    <Price
                      className="!text-sm !font-bold"
                      stayPrice={totalPrice() * nonResidentGuest}
                    ></Price>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-800 flex gap-0.5 items-center">
                      <Price
                        className="!text-sm !font-bold"
                        stayPrice={trip.price}
                      ></Price>

                      <div> x </div>
                      <div className="!text-sm">
                        {guest}{" "}
                        {guest > 1 ? "resident guests" : "resident guest"}
                      </div>
                    </div>
                    <Price
                      className="!text-sm !font-bold"
                      stayPrice={trip.price * guest}
                    ></Price>
                  </div>

                  <div className="h-[0.4px] w-[100%] my-2 bg-gray-400"></div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-800 font-bold flex gap-0.5 items-center">
                      Total
                    </div>
                    <Price
                      className="!text-sm !font-bold"
                      stayPrice={
                        trip.price * guest + totalPrice() * nonResidentGuest
                      }
                    ></Price>
                  </div>

                  <Button
                    onClick={() => {
                      Mixpanel.track("User clicked on the book trip button", {
                        name_of_trip: trip.name,
                      });
                      router.push({
                        query: {
                          ...router.query,
                          starting_date: moment(startDate).format("YYYY-MM-D"),
                          guests: guest,
                          non_resident: nonResidentGuest,
                          checkout_page: 1,
                        },
                      });
                    }}
                    className="flex w-full mt-3 items-center gap-1 !px-0 !py-2 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                  >
                    <span>Book trip</span>
                  </Button>
                </div>
                <div className="md:w-[60%] lg:w-[70%] w-full md:pl-4">
                  <Element name="overview" className="md:px-0 relative">
                    <div className="h-16 w-full bg-gray-50 flex ">
                      <div className="w-[60%] flex flex-col justify-center items-center border-r">
                        <span className="font-bold text-xs font-SourceSans">
                          FROM
                        </span>
                        <div className="text-sm text-gray-800 flex gap-0.5 items-center">
                          <div className="mr-0.5 font-bold flex">
                            <Price
                              className="!text-base sm:!text-xl md:!text-3xl"
                              stayPrice={totalPrice()}
                            ></Price>
                            <span className="mt-1 md:mt-3">
                              /per non-resident/trip
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-[40%] flex flex-col justify-center items-center">
                        <span className="font-bold text-xs font-SourceSans">
                          DAYS
                        </span>
                        <h1 className="font-bold text-gray-800 !text-base sm:!text-xl md:!text-3xl">
                          {trip.total_number_of_days}
                        </h1>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-2xl font-bold text-gray-800">
                        {trip.name}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mb-6 mt-4">
                      <div className="flex gap-3 md:gap-3">
                        <span className="font-bold">Starting location</span>
                        <span> - </span>
                        <span>{trip.starting_location}</span>
                      </div>

                      {trip.stop_at && trip.stop_at.length > 0 && (
                        <driver_operates_within>
                          <div className="font-bold">Stop at</div>
                          <div className="ml-1 mt-1">
                            {trip.stop_at.map((stop, index) => (
                              <ListItem key={index}>{stop}</ListItem>
                            ))}
                          </div>
                        </driver_operates_within>
                      )}

                      <div className="flex gap-3 md:gap-3 mt-1">
                        <span className="font-bold">Finish location</span>
                        <span> - </span>
                        <span>{trip.ending_location}</span>
                      </div>
                    </div>

                    <div className="w-full md:hidden z-40 flex justify-between bg-white fixed bottom-0 left-0 right-0 px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-sm">Starting date</div>
                        <div
                          onClick={() => {
                            setShowDatePopup(true);
                          }}
                          className="text-sm text-gray-600 underline cursor-pointer"
                        >
                          {moment(startDate).format("Do MMM YYYY")}
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          Mixpanel.track(
                            "User clicked on the book trip button",
                            {
                              name_of_trip: trip.name,
                            }
                          );
                          router.push({
                            query: {
                              ...router.query,
                              starting_date:
                                moment(startDate).format("YYYY-MM-D"),
                              guests: guest,
                              non_resident: nonResidentGuest,
                              checkout_page: 1,
                            },
                          });
                        }}
                        className="flex w-fit items-center gap-1 !px-2 !py-0.5 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                      >
                        <span>Book trip</span>
                      </Button>
                    </div>

                    <Dialogue
                      isOpen={showDatePopup}
                      closeModal={() => {
                        setShowDatePopup(false);
                      }}
                      title="Select starting date"
                      dialogueTitleClassName="!font-bold"
                      dialoguePanelClassName="!overflow-y-scroll md:hidden !p-4 max-h-[500px] !max-w-lg"
                    >
                      <div className="w-full">
                        <DatePicker
                          date={startDate}
                          setDate={setStartDate}
                          disableDate={new Date()}
                        ></DatePicker>
                      </div>
                    </Dialogue>

                    {trip.description && (
                      <div className="mt-10 mb-6">
                        <h1 className="font-bold text-2xl text-gray-700 font-OpenSans">
                          About this trip
                        </h1>
                        {trip.description && (
                          <div className="mt-2">
                            {!showAllDescription && (
                              <p className="font-medium text-gray-600">
                                {trip.description.slice(0, 500)}
                                {trip.description.length > 500 && "..."}
                              </p>
                            )}
                            {showAllDescription && (
                              <p className="font-medium text-gray-600">
                                {trip.description}
                              </p>
                            )}
                            {!showAllDescription &&
                              trip.description.length > 500 && (
                                <div
                                  onClick={() => {
                                    setShowAllDescription(true);
                                  }}
                                  className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>Read more</span>{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mt-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            {showAllDescription && (
                              <div
                                onClick={() => {
                                  setShowAllDescription(false);
                                }}
                                className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>Read less</span>{" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mt-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {trip.essential_information && (
                      <div className="mb-6">
                        <h1 className="font-bold text-2xl text-gray-700 font-OpenSans mb-2">
                          Essential information
                        </h1>

                        <div className="font-medium text-gray-600">
                          {trip.essential_information}
                        </div>
                      </div>
                    )}
                  </Element>

                  <Element name="gallery" className="mt-6 mb-12">
                    <h1 className="font-bold text-2xl text-gray-700 font-OpenSans mb-2">
                      Gallery
                    </h1>

                    <div className="h-[300px]">
                      <TripImageGallery
                        images={[
                          ...tripImages,
                          ...stayImages,
                          ...activityImages,
                        ]}
                        className="!h-[340px] !w-full md:!w-[50%]"
                      ></TripImageGallery>
                    </div>
                  </Element>

                  <Element name="itinerary">
                    <div className="font-bold text-2xl text-gray-700 font-OpenSans">
                      Detailed itinerary
                    </div>

                    <div className="mt-4">
                      {trip.itineraries.map((itinerary, index) => (
                        <DaysAccordion
                          key={index}
                          title={itinerary.day}
                          showAccordionByDefault={index === 0 ? true : false}
                        >
                          {itinerary.description}
                        </DaysAccordion>
                      ))}
                    </div>
                  </Element>

                  <Element name="inclusions">
                    <div className="font-bold mt-6 mb-7 text-2xl text-gray-700 font-OpenSans">
                      Inclusions
                    </div>

                    {trip.stay && (
                      <div className="flex gap-6 items-center">
                        <div>
                          <Icon
                            icon="fluent:bed-24-filled"
                            className="w-10 h-10 text-gray-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                            Stay
                          </h1>
                          <span>{trip.stay.name}</span>
                          <div className="text-gray-500 flex gap-1 text-sm truncate mt-1 flex-wrap">
                            {trip.stay.capacity && (
                              <div className="flex items-center gap-0.5">
                                <svg
                                  className="w-3 h-3"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  role="img"
                                  width="1em"
                                  height="1em"
                                  preserveAspectRatio="xMidYMid meet"
                                  viewBox="0 0 36 36"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                                  />
                                  <circle
                                    cx="17.87"
                                    cy="13.45"
                                    r="4.47"
                                    fill="currentColor"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                                  />
                                  <path fill="none" d="M0 0h36v36H0z" />
                                </svg>
                                <span>{trip.stay.capacity} Guests</span>
                              </div>
                            )}
                            {trip.stay.rooms && (
                              <div className="flex items-center gap-0.5">
                                <svg
                                  className="w-3 h-3"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  role="img"
                                  width="1em"
                                  height="1em"
                                  preserveAspectRatio="xMidYMid meet"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                                  />
                                </svg>

                                <span>{trip.stay.rooms} rm</span>
                              </div>
                            )}

                            {trip.stay.type_of_stay && (
                              <div className="text-gray-600 capitalize">
                                {/* <div className="text-gray-600 text-2xl inline">.</div> */}
                                <span> - </span>
                                {trip.stay.type_of_stay.toLowerCase()}
                              </div>
                            )}
                          </div>

                          <div
                            onClick={() => {
                              Mixpanel.track(
                                "User clicked on view more stays for curated trips",
                                {
                                  name_of_trip: trip.name,
                                }
                              );
                              setShowMoreStay(true);
                            }}
                            className="font-medium hover:underline cursor-pointer text-blue-600"
                          >
                            View more
                          </div>
                        </div>
                      </div>
                    )}

                    {trip.activity && (
                      <div className="flex gap-6 items-center mt-6">
                        <div>
                          <Icon
                            icon="fa6-solid:person-hiking"
                            className="w-10 h-10 text-gray-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                            Activity
                          </h1>
                          <span>{trip.activity.name}</span>

                          <div
                            onClick={() => {
                              Mixpanel.track(
                                "User clicked on view more activities for curated trips",
                                {
                                  name_of_trip: trip.name,
                                }
                              );
                              setShowMoreActivities(true);
                            }}
                            className="font-medium hover:underline cursor-pointer text-blue-600"
                          >
                            View more
                          </div>
                        </div>
                      </div>
                    )}

                    {trip.transport && (
                      <div className="flex gap-6 items-center mt-6">
                        <div>
                          <Icon
                            icon="fa6-solid:car"
                            className="w-10 h-10 text-gray-500"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                            Transport
                          </h1>
                          {trip.transport.type_of_car && (
                            <span className="text-sm capitalize">
                              {trip.transport.type_of_car.toLowerCase()}
                            </span>
                          )}

                          <div
                            onClick={() => {
                              Mixpanel.track(
                                "User clicked on view more transport for curated trips",
                                {
                                  name_of_trip: trip.name,
                                }
                              );
                              setShowMoreTransport(true);
                            }}
                            className="font-medium hover:underline cursor-pointer text-blue-600"
                          >
                            View more
                          </div>
                        </div>
                      </div>
                    )}

                    {trip.flight && (
                      <div className="flex gap-6 items-center mt-6">
                        <div>
                          <Icon
                            className="w-10 h-10 text-gray-500"
                            icon="bxs:plane-alt"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                            Flight Transfer
                          </h1>
                          <span className="text-sm capitalize">
                            From {trip.flight.starting_point} to{" "}
                            {trip.flight.destination}
                          </span>
                          <div className="text-sm font-bold mt-1">
                            For {trip.flight.number_of_people}{" "}
                            {trip.flight.number_of_people > 1
                              ? "people"
                              : "person"}
                          </div>
                        </div>
                      </div>
                    )}

                    {trip.general_transfer && (
                      <div className="flex gap-6 items-center mt-6">
                        <div>
                          {trip.general_transfer.is_train && (
                            <Icon
                              className="w-10 h-10 text-gray-500"
                              icon="bi:train-front"
                            />
                          )}

                          {!trip.general_transfer.is_train && (
                            <Icon
                              icon="fa-solid:taxi"
                              className="w-10 h-10 text-gray-500"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          {trip.general_transfer.is_train && (
                            <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                              Train Transfer
                            </h1>
                          )}

                          {!trip.general_transfer.is_train && (
                            <h1 className="mb-1 font-bold text-gray-700 font-OpenSans text-2xl">
                              Car Transfer
                            </h1>
                          )}
                          <span className="text-sm capitalize">
                            From {trip.general_transfer.starting_point} to{" "}
                            {trip.general_transfer.destination}
                          </span>
                        </div>
                      </div>
                    )}
                  </Element>

                  {/* <div className="my-6 w-full flex justify-center">
                <div className="border-2 border-gray-700 px-3 py-2 rounded-3xl cursor-pointer">
                  Request more info
                </div>
              </div> */}

                  <div className="w-full h-[250px] mt-4 md:hidden">
                    <MapBox trip={trip}></MapBox>
                  </div>

                  {trip.faqs.length > 0 && (
                    <Element name="faq">
                      <div className="font-bold mt-6 mb-7 text-2xl text-gray-700 font-OpenSans">
                        Frequently asked questions
                      </div>

                      {trip.faqs.map((faq, index) => (
                        <DaysAccordion
                          key={index}
                          title={faq.question}
                          showAccordionByDefault={index === 0 ? true : false}
                        >
                          {faq.answer}
                        </DaysAccordion>
                      ))}
                    </Element>
                  )}
                </div>
              </div>

              <div className="mt-6 mb-6 md:mb-0">
                <Footer></Footer>
              </div>

              {trip.stay && (
                <Dialogue
                  isOpen={showMoreStay}
                  closeModal={() => {
                    setShowMoreStay(false);
                  }}
                  dialoguePanelClassName="max-h-[500px] max-w-xl overflow-y-scroll remove-scroll !p-4"
                >
                  <div className="md:px-4">
                    <h1 className="font-bold text-2xl">Quick facts</h1>
                    <div className="flex">
                      <div className="flex flex-col w-full">
                        <div className="text-gray-500 flex gap-2 text-sm truncate mt-1 flex-wrap">
                          {trip.stay.capacity && (
                            <div className="flex items-center gap-0.5">
                              <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                width="1em"
                                height="1em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 36 36"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                                />
                                <circle
                                  cx="17.87"
                                  cy="13.45"
                                  r="4.47"
                                  fill="currentColor"
                                />
                                <path
                                  fill="currentColor"
                                  d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                                />
                                <path fill="none" d="M0 0h36v36H0z" />
                              </svg>
                              <span>{trip.stay.capacity} Guests</span>
                            </div>
                          )}
                          {trip.stay.rooms && (
                            <div className="flex items-center gap-0.5">
                              <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                width="1em"
                                height="1em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                                />
                              </svg>

                              <span>{trip.stay.rooms} rm</span>
                            </div>
                          )}

                          {trip.stay.beds && (
                            <div className="flex items-center gap-0.5">
                              <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                              >
                                <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
                              </svg>
                              <span>{trip.stay.beds} bd</span>
                            </div>
                          )}

                          {trip.stay.bathrooms && (
                            <div className="flex items-center gap-0.5">
                              <svg
                                className="w-3 h-3"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                              </svg>{" "}
                              <span>{trip.stay.bathrooms} ba</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {!showAllStayDescription && (
                        <p className="font-medium text-gray-600">
                          {trip.stay.description.slice(0, 500)}...
                        </p>
                      )}
                      {showAllStayDescription && (
                        <p className="font-medium text-gray-600">
                          {trip.stay.description}
                        </p>
                      )}
                      {!showAllStayDescription &&
                        trip.stay.description.length > 500 && (
                          <div
                            onClick={() => {
                              setShowAllStayDescription(true);
                            }}
                            className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Read more</span>{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mt-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      {showAllStayDescription && (
                        <div
                          onClick={() => {
                            setShowAllStayDescription(false);
                          }}
                          className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Read less</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className={"mt-4"}>
                      <h1 className="font-bold text-2xl mb-5">
                        What makes this listing unique
                      </h1>
                      {!showAllUniqueFeature && (
                        <p className="ml-2 font-medium">
                          {trip.stay.unique_about_place.slice(0, 500)}
                        </p>
                      )}
                      {showAllUniqueFeature && (
                        <p className="ml-2 font-medium">
                          {trip.stay.unique_about_place}
                        </p>
                      )}
                      {!showAllUniqueFeature &&
                        trip.stay.unique_about_place.length > 500 && (
                          <div
                            onClick={() => {
                              setShowAllUniqueFeature(true);
                            }}
                            className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                          >
                            <span>Read more</span>{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mt-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      {showAllUniqueFeature && (
                        <div
                          onClick={() => {
                            setShowAllUniqueFeature(false);
                          }}
                          className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                        >
                          <span>Read less</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {trip.stay.inclusions.length > 0 && (
                      <>
                        <div className="mb-3 mt-4">
                          <span className="font-bold text-xl">
                            Included activities
                          </span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {trip.stay.inclusions.map((inclusion, index) => (
                            <div key={index} className="w-full md:w-[48%]">
                              <ListItem>{inclusion.name}</ListItem>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mb-3 mt-4">
                      <span className="font-bold text-lg">Extras</span>
                    </div>

                    {!showMoreActivities && (
                      <div className="flex flex-wrap gap-2 px-2">
                        {trip.stay.extras_included
                          .slice(0, 5)
                          .map((activity, index) => (
                            <div key={index} className="w-[48%]">
                              <ListItem>{activity.name}</ListItem>
                            </div>
                          ))}
                      </div>
                    )}

                    {showMoreExperiences && (
                      <div className="flex flex-wrap gap-2 px-2">
                        {trip.stay.extras_included.map((activity, index) => (
                          <div key={index} className="w-[48%]">
                            <ListItem>{activity.name}</ListItem>
                          </div>
                        ))}
                      </div>
                    )}

                    {!showMoreExperiences &&
                      trip.stay.extras_included.length > 5 && (
                        <div
                          onClick={() => {
                            setShowMoreExperiences(true);
                          }}
                          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                        >
                          <span>Read more</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                    {showMoreExperiences &&
                      trip.stay.extras_included.length > 5 && (
                        <div
                          onClick={() => {
                            setShowMoreExperiences(false);
                          }}
                          className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                        >
                          <span>Read less</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                    <div className="flex flex-col md:flex-row gap-3 justify-between pt-10">
                      <div className="w-full">
                        <div className="mb-3">
                          <span className="font-bold text-xl">Amenities</span>
                        </div>

                        <Amenities amenities={trip.stay}></Amenities>

                        {trip.stay.facts.length > 0 && (
                          <div className="mt-4 ml-2">
                            <div className="flex gap-2 flex-wrap">
                              {trip.stay.facts.map((fact, index) => (
                                <div key={index} className="w-full md:w-[48%]">
                                  <ListItem>{fact.name}</ListItem>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={"w-full mt-8 mb-4 "}>
                      <h1 className="font-bold text-2xl mb-2">Policies</h1>

                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Cancellation Policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2 flex flex-col gap-2">
                          <ListItem>
                            You should have CV-19 travel insurance
                          </ListItem>
                          <ListItem>
                            See the full cancellation policy more{" "}
                            <Link href="/policies">
                              <a>
                                <div className="text-blue-500 underline inline">
                                  here
                                </div>
                              </a>
                            </Link>
                          </ListItem>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Health and safety policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2 flex flex-col gap-2">
                          <ListItem>
                            This property is compliant with Winda.guide&apos;s
                            CV-19 requirements. More{" "}
                            <Link href="/safety">
                              <a>
                                <div className="text-blue-500 underline inline">
                                  here
                                </div>
                              </a>
                            </Link>
                          </ListItem>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Damage policy</span>
                        </div>

                        <div className="mt-2 ml-2 flex flex-col gap-2">
                          <ListItem>
                            The guest is liable for any damages caused by them
                            during their stay.
                          </ListItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialogue>
              )}

              {trip.activity && (
                <Dialogue
                  isOpen={showMoreActivities}
                  closeModal={() => {
                    setShowMoreActivities(false);
                  }}
                  dialoguePanelClassName="max-h-[500px] max-w-xl overflow-y-scroll remove-scroll !p-4"
                >
                  <div className="md:px-4">
                    <h1 className="font-bold text-2xl">About</h1>

                    <div className="flex flex-col w-full">
                      <div className="text-gray-500 flex gap-2 text-sm truncate mt-3 flex-wrap">
                        {trip.activity.capacity && (
                          <div className="flex items-center gap-0.5">
                            <svg
                              className="w-3 h-3"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              width="1em"
                              height="1em"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 36 36"
                            >
                              <path
                                fill="currentColor"
                                d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                              />
                              <path
                                fill="currentColor"
                                d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                              />
                              <path
                                fill="currentColor"
                                d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                              />
                              <path
                                fill="currentColor"
                                d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                              />
                              <circle
                                cx="17.87"
                                cy="13.45"
                                r="4.47"
                                fill="currentColor"
                              />
                              <path
                                fill="currentColor"
                                d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                              />
                              <path fill="none" d="M0 0h36v36H0z" />
                            </svg>
                            <span>
                              {trip.activity.capacity} Maximum number of guests
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      {!showAllActivityDescription && (
                        <p className="font-medium text-gray-600">
                          {trip.activity.description.slice(0, 500)}
                          {trip.activity.description.length > 500 && "..."}
                        </p>
                      )}
                      {showAllActivityDescription && (
                        <p className="font-medium text-gray-600">
                          {trip.activity.description}
                        </p>
                      )}

                      {!showAllActivityDescription &&
                        trip.activity.description.length > 500 && (
                          <div
                            onClick={() => {
                              setShowAllActivityDescription(true);
                            }}
                            className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Read more</span>{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mt-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      {showAllActivityDescription && (
                        <div
                          onClick={() => {
                            setShowAllActivityDescription(false);
                          }}
                          className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Read less</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {trip.activity.type_of_activities.length > 0 && (
                      <dv
                        name="activities"
                        className="flex flex-col md:flex-row gap-3 justify-between pt-10 "
                      >
                        <div className="border pb-2 h-fit border-gray-200 rounded-xl overflow-hidden w-full order-2 md:order-1 mt-4 md:mt-0">
                          <div className="py-2 bg-gray-200 mb-2">
                            <span className="font-bold text-xl ml-6">
                              Activities
                            </span>
                          </div>
                          {!showMoreActivities && (
                            <div className="flex flex-col gap-2 px-2">
                              {trip.activity.type_of_activities
                                .slice(0, 5)
                                .map((amenity, index) => (
                                  <ListItem key={index}>{amenity}</ListItem>
                                ))}
                            </div>
                          )}

                          {showMoreActivities && (
                            <div className="flex flex-col gap-2 px-2">
                              {trip.activity.type_of_activities.map(
                                (amenity, index) => (
                                  <ListItem key={index}>{amenity}</ListItem>
                                )
                              )}
                            </div>
                          )}

                          {!showMoreActivities &&
                            trip.activity.type_of_activities.length > 5 && (
                              <div
                                onClick={() => {
                                  setShowMoreActivities(true);
                                }}
                                className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                              >
                                <span>Read more</span>{" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mt-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}

                          {showMoreActivities &&
                            trip.activity.type_of_activities.length > 5 && (
                              <div
                                onClick={() => {
                                  setShowMoreActivities(false);
                                }}
                                className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                              >
                                <span>Read less</span>{" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mt-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                        </div>
                      </dv>
                    )}

                    {(trip.activity.enquipment_provided.length > 0 ||
                      trip.activity.enquipment_required_by_user.length > 0) && (
                      <div
                        name="essentials"
                        className={"w-full order-1 md:order-2 pt-10 "}
                      >
                        <h1 className="font-bold text-2xl mb-2 ml-2">
                          Essentials
                        </h1>

                        {trip.activity.enquipment_provided.length > 0 && (
                          <h3 className="mb-2 ml-4 font-semibold">
                            The following will be provided to by this place
                          </h3>
                        )}

                        <div className="flex flex-col gap-2 px-2">
                          {trip.activity.enquipment_provided.map(
                            (enquipment, index) => (
                              <ListItem key={index}>{enquipment.name}</ListItem>
                            )
                          )}
                        </div>

                        {trip.activity.enquipment_required_by_user.length ===
                          0 && (
                          <h3 className="mt-2 font-medium ml-4 underline">
                            You are not required to bring extra equipment
                          </h3>
                        )}

                        {trip.activity.enquipment_required_by_user.length >
                          0 && (
                          <h3 className="mb-2 mt-2 ml-4 font-semibold">
                            You are required to bring the following
                          </h3>
                        )}

                        <div className="flex flex-col gap-2 px-2">
                          {trip.activity.enquipment_required_by_user.map(
                            (enquipment, index) => (
                              <ListItem key={index}>{enquipment.name}</ListItem>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className={"w-full mt-8 mb-4 "}>
                      <h1 className="font-bold text-2xl mb-2">Policies</h1>

                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Cancellation Policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2 flex flex-col gap-2">
                          <ListItem>
                            You should have CV-19 travel insurance
                          </ListItem>
                          <ListItem>
                            See the full cancellation policy more{" "}
                            <Link href="/policies">
                              <a>
                                <div className="text-blue-500 underline inline">
                                  here
                                </div>
                              </a>
                            </Link>
                          </ListItem>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Health and safety policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2 flex flex-col gap-2">
                          <ListItem>
                            This property is compliant with Winda.guide&apos;s
                            CV-19 requirements. More{" "}
                            <Link href="/safety">
                              <a>
                                <div className="text-blue-500 underline inline">
                                  here
                                </div>
                              </a>
                            </Link>
                          </ListItem>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialogue>
              )}

              {trip.transport && (
                <Dialogue
                  isOpen={showMoreTransport}
                  closeModal={() => {
                    setShowMoreTransport(false);
                  }}
                  dialoguePanelClassName="max-h-[400px] max-w-lg overflow-y-scroll remove-scroll !p-4"
                >
                  <div className="md:px-4">
                    {trip.transport.vehicle_make && (
                      <div className="flex items-center gap-2">
                        <h1 className="font-bold capitalize text-xl">
                          {trip.transport.vehicle_make.toLowerCase()}
                        </h1>
                      </div>
                    )}

                    <div className="mt-2 mb-2">
                      {trip.transport.type_of_car && (
                        <div className="text-sm ml-1 capitalize font-bold">
                          {trip.transport.type_of_car.toLowerCase()}
                        </div>
                      )}

                      <div className="py-2 border-t border-b border-gray-400 px-2 my-2 text-sm text-gray-600 flex justify-between items-center">
                        <div className="flex items-center gap-0.5">
                          <Icon className="w-4 h-4" icon="carbon:user-filled" />
                          <p>{trip.transport.capacity}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Icon className="w-4 h-4" icon="bi:bag-fill" />
                          <p>{trip.transport.bags}</p>
                        </div>
                        {trip.transport.transmission && (
                          <div className="flex items-center gap-0.5">
                            <Icon
                              className="w-4 h-4"
                              icon="icon-park-solid:manual-gear"
                            />
                            <p className="capitalize">
                              {trip.transport.transmission.toLowerCase()}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-0.5">
                          <Icon
                            className="w-4 h-4"
                            icon="ic:baseline-severe-cold"
                          />
                          <p className="capitalize">
                            {trip.transport.has_air_condition ? "AC" : "No AC"}
                          </p>
                        </div>
                      </div>

                      {trip.transport.included_in_price.length > 0 && (
                        <h1 className="font-bold text-lg mb-2 mt-4">
                          Included in price
                        </h1>
                      )}
                      {trip.transport.included_in_price.map((item, index) => (
                        <ListItem key={index}>
                          {item.included_in_price}
                        </ListItem>
                      ))}

                      <div className={"w-full mt-4 mb-4 "}>
                        <h1 className="font-bold text-2xl mb-2">Policies</h1>

                        <div className="mt-4">
                          <div className="py-2 px-2 border-b border-gray-100">
                            <span className="font-semibold">
                              Cancellation Policy
                            </span>
                          </div>

                          <div className="mt-2 ml-2 flex flex-col gap-2">
                            <ListItem>
                              You should have CV-19 travel insurance
                            </ListItem>
                            <ListItem>
                              See the full cancellation policy more{" "}
                              <Link href="/policies">
                                <a>
                                  <div className="text-blue-500 underline inline">
                                    here
                                  </div>
                                </a>
                              </Link>
                            </ListItem>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="py-2 px-2 border-b border-gray-100">
                            <span className="font-semibold">
                              Health and safety policy
                            </span>
                          </div>

                          <div className="mt-2 ml-2 flex flex-col gap-2">
                            <ListItem>
                              This transport is compliant with
                              Winda.guide&apos;s CV-19 requirements. More
                              <Link href="/safety">
                                <a>
                                  <div className="text-blue-500 underline inline">
                                    here
                                  </div>
                                </a>
                              </Link>
                            </ListItem>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialogue>
              )}

              <Dialogue
                isOpen={showAddToTripPopup}
                closeModal={() => {
                  setShowAddToTripPopup(false);
                }}
                title="Add to Trip"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="!overflow-y-scroll !p-4 max-h-[500px] !max-w-lg"
              >
                <div className="mt-2 h-full relative">
                  {userTrips.map((singleTrip, index) => {
                    return (
                      <SingleTrip
                        key={index}
                        trip={singleTrip}
                        isRecommendedPage={true}
                        selectedData={{
                          stay_id: trip.stay ? trip.stay.id : null,
                          activity_id: trip.activity ? trip.activity.id : null,
                          transport_id: trip.transport
                            ? trip.transport.id
                            : null,
                          flight_id: trip.flight ? trip.flight.id : null,
                        }}
                      ></SingleTrip>
                    );
                  })}

                  <div className="flex justify-between mt-8">
                    <div></div>

                    <Button
                      onClick={() => {
                        addToTrip();
                      }}
                      className="flex w-full items-center gap-1 !px-0 !py-2 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                    >
                      <span>Add to a new trip</span>

                      <div className={" " + (!loading ? "hidden" : " ml-1")}>
                        <LoadingSpinerChase
                          width={13}
                          height={13}
                          color="white"
                        ></LoadingSpinerChase>
                      </div>
                    </Button>
                  </div>
                </div>
              </Dialogue>
            </>
          )}
          {router.query.checkout_page === "1" && (
            <div className=" max-w-[1080px] mx-auto">
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
                    <div className="flex h-28 gap-2">
                      <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={tripImages[0]}
                          unoptimized={true}
                          alt="Main image of trip"
                        ></Image>
                      </div>

                      <div className="flex flex-col gap-1">
                        <h1 className="font-bold">{trip.name}</h1>
                        <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                          <Icon icon="akar-icons:clock" />{" "}
                          {trip.total_number_of_days} days trip
                        </p>
                        {trip.starting_location && (
                          <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                            Starting from {trip.starting_location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="h-[0.6px] w-full bg-gray-500 mt-10 mb-4"></div>
                    <h1 className="font-bold text-2xl font-OpenSans">
                      Trip breakdown
                    </h1>

                    <div className="mt-6 flex flex-col items-center gap-6">
                      {trip.stay && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[75%]">
                            <span className="truncate">{trip.stay.name}</span>
                            <PopoverBox
                              btnPopover={<Icon icon="bx:help-circle" />}
                              btnClassName="flex items-center justify-center"
                              panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                            >
                              <div className="text-sm text-gray-500">
                                <span>
                                  This is a{" "}
                                  <span className="lowercase">
                                    {trip.stay.type_of_stay
                                      ? trip.stay.type_of_stay
                                      : "stay"}
                                  </span>{" "}
                                  in{" "}
                                  <span className="lowercase">
                                    {trip.stay.location}
                                    {""}
                                    {trip.stay.location && trip.stay.country
                                      ? ", "
                                      : ""}{" "}
                                    {trip.stay.country}
                                  </span>{" "}
                                  .You will be staying here for 2 nights
                                </span>
                              </div>
                            </PopoverBox>
                          </div>

                          <div className="text-sm font-bold">
                            {trip.nights} nights
                          </div>
                        </div>
                      )}

                      {trip.activity && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[75%]">
                            <span className="truncate">
                              {trip.activity.name}
                            </span>
                            <PopoverBox
                              btnPopover={<Icon icon="bx:help-circle" />}
                              btnClassName="flex items-center justify-center"
                              panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                            >
                              <div className="text-sm text-gray-500">
                                <span>
                                  This is an activity in{" "}
                                  <span className="lowercase">
                                    {trip.activity.location}
                                    {""}
                                    {trip.activity.location &&
                                    trip.activity.country
                                      ? ", "
                                      : ""}{" "}
                                    {trip.activity.country}
                                  </span>{" "}
                                  .You will be coming with{" "}
                                  {Number(router.query.guests) +
                                    Number(router.query.non_resident)}{" "}
                                  {Number(router.query.guests) +
                                    Number(router.query.non_resident) >
                                  1
                                    ? "guests"
                                    : "guest"}{" "}
                                </span>
                              </div>
                            </PopoverBox>
                          </div>

                          <div className="text-sm font-bold">
                            {Number(router.query.guests) +
                              Number(router.query.non_resident)}{" "}
                            {Number(router.query.guests) +
                              Number(router.query.non_resident) >
                            1
                              ? "guests"
                              : "guest"}
                          </div>
                        </div>
                      )}

                      {trip.transport && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[70%]">
                            {trip.transport.vehicle_make && (
                              <span className="truncate capitalize">
                                {trip.transport.vehicle_make.toLowerCase()}
                              </span>
                            )}

                            <PopoverBox
                              btnPopover={<Icon icon="bx:help-circle" />}
                              btnClassName="flex items-center justify-center"
                              panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                            >
                              <div className="text-sm text-gray-500">
                                <span>
                                  This is your transport.{" "}
                                  {trip.transport.type_of_car && (
                                    <span className="lowercase">
                                      It is a {trip.transport.type_of_car} car
                                    </span>
                                  )}
                                </span>
                              </div>
                            </PopoverBox>
                          </div>

                          <div className="text-sm font-bold">
                            {trip.transport.type_of_car && (
                              <div className="text-sm ml-1 capitalize font-bold">
                                {trip.transport.type_of_car.toLowerCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {trip.flight && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[70%]">
                            Flight transfer
                            <PopoverBox
                              btnPopover={<Icon icon="bx:help-circle" />}
                              btnClassName="flex items-center justify-center"
                              panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                            >
                              <div className="text-sm text-gray-500">
                                <span>
                                  This is your flight from{" "}
                                  {trip.flight.starting_point} to{" "}
                                  {trip.flight.destination}
                                </span>
                              </div>
                            </PopoverBox>
                          </div>

                          <div className="text-sm font-bold">
                            {Number(router.query.guests) +
                              Number(router.query.non_resident)}{" "}
                            {Number(router.query.guests) +
                              Number(router.query.non_resident) >
                            1
                              ? "passengers"
                              : "passenger"}
                          </div>
                        </div>
                      )}

                      {trip.general_transfer && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[70%]">
                            {trip.general_transfer.is_train && (
                              <p>Train Transfer</p>
                            )}

                            {!trip.general_transfer.is_train && (
                              <p>Car Transfer</p>
                            )}
                            <PopoverBox
                              btnPopover={<Icon icon="bx:help-circle" />}
                              btnClassName="flex items-center justify-center"
                              panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                            >
                              <div className="text-sm text-gray-500">
                                <span>
                                  This is your{" "}
                                  {trip.general_transfer.is_train &&
                                    "Train Transfer"}
                                  {!trip.general_transfer.is_train &&
                                    "Car Transfer"}{" "}
                                  from {trip.general_transfer.starting_point} to{" "}
                                  {trip.general_transfer.destination}
                                </span>
                              </div>
                            </PopoverBox>
                          </div>

                          <div className="text-sm font-bold">
                            {Number(router.query.guests) +
                              Number(router.query.non_resident)}{" "}
                            {Number(router.query.guests) +
                              Number(router.query.non_resident) >
                            1
                              ? "passengers"
                              : "passenger"}
                          </div>
                        </div>
                      )}

                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 items-center w-[70%]">
                          Ending date
                        </div>

                        <div className="text-sm font-bold">
                          {moment(new Date(router.query.starting_date))
                            .add(trip.total_number_of_days, "days")
                            .format("DD MMM YYYY")}
                        </div>
                      </div>

                      <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 items-center">
                          Total price
                        </div>

                        <Price
                          className="!text-sm !font-bold"
                          stayPrice={
                            trip.price * Number(router.query.guests) +
                            totalPrice() * Number(router.query.non_resident)
                          }
                        ></Price>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-[60%] w-full md:pl-4">
                  <div
                    onClick={() => {
                      router.back();
                    }}
                    className="flex gap-1 mb-3 md:hidden mt-4 font-bold cursor-pointer items-center text-black"
                  >
                    <Icon className="w-6 h-6" icon="bx:chevron-left" />
                    <span>Back</span>
                  </div>
                  <div className="flex md:hidden h-28 gap-2">
                    <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={tripImages[0]}
                        unoptimized={true}
                        alt="Main image of trip"
                      ></Image>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="font-bold">{trip.name}</h1>
                      <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                        <Icon icon="akar-icons:clock" />{" "}
                        {trip.total_number_of_days} days trip
                      </p>
                      {trip.starting_location && (
                        <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                          Starting from {trip.starting_location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="h-[0.4px] w-[100%] my-4 bg-gray-400 md:hidden"></div>

                  <h1 className="font-bold text-2xl mt-4 mb-4 font-OpenSans">
                    Book trip
                  </h1>
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="font-bold">Starting date</div>
                        <div className="text-sm text-gray-600">
                          {moment(new Date(router.query.starting_date)).format(
                            "DD MMM YYYY"
                          )}
                        </div>
                      </div>

                      <PopoverBox
                        btnPopover={
                          <div className="w-9 h-9 rounded-full cursor-pointer border-transparent border flex items-center justify-center hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-linear">
                            <Icon
                              className="w-5 h-5"
                              icon="clarity:pencil-solid"
                            />
                          </div>
                        }
                        btnClassName=""
                        popoverClassName="flex items-center justify-center"
                        panelClassName="h-fit !max-w-[400px] md:!w-[400px] rounded-lg bg-white right-0 border shadow-lg mt-1 top-full"
                      >
                        <Child></Child>
                      </PopoverBox>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <div className="flex flex-col gap-2">
                        <div className="font-bold">Non-resident guests</div>
                        <div className="text-sm text-gray-600">
                          {Number(router.query.non_resident)}{" "}
                          {Number(router.query.non_resident) > 1
                            ? "Non-resident guests"
                            : "Non-resident guest"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <div
                          onClick={() => {
                            if (
                              Number(router.query.non_resident) +
                                Number(router.query.guests) >
                              1
                            ) {
                              router.replace(
                                {
                                  query: {
                                    ...router.query,
                                    non_resident:
                                      Number(router.query.non_resident) - 1,
                                  },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }
                          }}
                          className="w-9 h-9 text-base rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          {" "}
                          -{" "}
                        </div>

                        <div
                          onClick={() => {
                            router.replace(
                              {
                                query: {
                                  ...router.query,
                                  non_resident:
                                    Number(router.query.non_resident) + 1,
                                },
                              },
                              undefined,
                              { shallow: true }
                            );
                          }}
                          className="w-9 h-9 text-base rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <div className="flex flex-col gap-2">
                        <div className="font-bold">Resident guests</div>
                        <div className="text-sm text-gray-600">
                          {Number(router.query.guests)}{" "}
                          {Number(router.query.guests) > 1
                            ? "Resident guests"
                            : "Resident guest"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ">
                        <div
                          onClick={() => {
                            if (
                              Number(router.query.non_resident) +
                                Number(router.query.guests) >
                              1
                            ) {
                              router.replace(
                                {
                                  query: {
                                    ...router.query,
                                    guests: Number(router.query.guests) - 1,
                                  },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }
                          }}
                          className="w-9 h-9 text-base rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          {" "}
                          -{" "}
                        </div>

                        <div
                          onClick={() => {
                            router.replace(
                              {
                                query: {
                                  ...router.query,
                                  guests: Number(router.query.guests) + 1,
                                },
                              },
                              undefined,
                              { shallow: true }
                            );
                          }}
                          className="w-9 h-9 text-base rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                        >
                          +
                        </div>
                      </div>
                    </div>

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
                          <Icon
                            className="w-5 h-5"
                            icon="fluent:add-16-filled"
                          />
                        )}
                        {message && (
                          <Icon
                            className="w-5 h-5"
                            icon="clarity:pencil-solid"
                          />
                        )}
                      </div>
                    </div>

                    <div className="md:hidden">
                      <div className="h-[0.6px] w-full bg-gray-500 mt-10 mb-4"></div>
                      <h1 className="font-bold text-2xl font-OpenSans">
                        Trip breakdown
                      </h1>

                      <div className="mt-6 flex flex-col items-center gap-6">
                        {trip.stay && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[75%]">
                              <span className="truncate">{trip.stay.name}</span>
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -right-[80px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is a{" "}
                                    <span className="lowercase">
                                      {trip.stay.type_of_stay
                                        ? trip.stay.type_of_stay
                                        : "stay"}
                                    </span>{" "}
                                    in{" "}
                                    <span className="lowercase">
                                      {trip.stay.location}
                                      {""}
                                      {trip.stay.location && trip.stay.country
                                        ? ", "
                                        : ""}{" "}
                                      {trip.stay.country}
                                    </span>{" "}
                                    .You will be staying here for 2 nights
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.nights} nights
                            </div>
                          </div>
                        )}

                        {trip.activity && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[75%]">
                              <span className="truncate">
                                {trip.activity.name}
                              </span>
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is an activity in{" "}
                                    <span className="lowercase">
                                      {trip.activity.location}
                                      {""}
                                      {trip.activity.location &&
                                      trip.activity.country
                                        ? ", "
                                        : ""}{" "}
                                      {trip.activity.country}
                                    </span>{" "}
                                    .You will be coming with{" "}
                                    {Number(router.query.guests) +
                                      Number(router.query.non_resident)}{" "}
                                    {Number(router.query.guests) +
                                      Number(router.query.non_resident) >
                                    1
                                      ? "guests"
                                      : "guest"}{" "}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {Number(router.query.guests) +
                                Number(router.query.non_resident)}{" "}
                              {Number(router.query.guests) +
                                Number(router.query.non_resident) >
                              1
                                ? "guests"
                                : "guest"}
                            </div>
                          </div>
                        )}

                        {trip.transport && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[70%]">
                              {trip.transport.vehicle_make && (
                                <span className="truncate capitalize">
                                  {trip.transport.vehicle_make.toLowerCase()}
                                </span>
                              )}

                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is your transport.{" "}
                                    {trip.transport.type_of_car && (
                                      <span className="lowercase">
                                        It is a {trip.transport.type_of_car} car
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.transport.type_of_car && (
                                <div className="text-sm ml-1 capitalize font-bold">
                                  {trip.transport.type_of_car.toLowerCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {trip.flight && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[70%]">
                              Flight transfer
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is your flight from{" "}
                                    {trip.flight.starting_point} to{" "}
                                    {trip.flight.destination}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {Number(router.query.guests) +
                                Number(router.query.non_resident)}{" "}
                              {Number(router.query.guests) +
                                Number(router.query.non_resident) >
                              1
                                ? "passengers"
                                : "passenger"}
                            </div>
                          </div>
                        )}

                        {trip.general_transfer && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[70%]">
                              {trip.general_transfer.is_train && (
                                <p>Train Transfer</p>
                              )}

                              {!trip.general_transfer.is_train && (
                                <p>Car Transfer</p>
                              )}
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is your{" "}
                                    {trip.general_transfer.is_train &&
                                      "Train Transfer"}
                                    {!trip.general_transfer.is_train &&
                                      "Car Transfer"}{" "}
                                    from {trip.general_transfer.starting_point}{" "}
                                    to {trip.general_transfer.destination}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {Number(router.query.guests) +
                                Number(router.query.non_resident)}{" "}
                              {Number(router.query.guests) +
                                Number(router.query.non_resident) >
                              1
                                ? "passengers"
                                : "passenger"}
                            </div>
                          </div>
                        )}

                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center w-[70%]">
                            Ending date
                          </div>

                          <div className="text-sm font-bold">
                            {moment(new Date(router.query.starting_date))
                              .add(trip.total_number_of_days, "days")
                              .format("DD MMM YYYY")}
                          </div>
                        </div>

                        <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center">
                            Total price
                          </div>

                          <Price
                            className="!text-sm !font-bold"
                            stayPrice={
                              trip.price * Number(router.query.guests) +
                              totalPrice() * Number(router.query.non_resident)
                            }
                          ></Price>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4 items-center">
                      <div className="flex-grow h-px bg-gray-300"></div>
                      <div className="text-sm font-bold text-center">
                        Your details
                      </div>
                      <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className="mb-4 mt-8 flex flex-col">
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
                                formik.touched.first_name &&
                                formik.errors.first_name
                                  ? true
                                  : false
                              }
                              className={"w-full "}
                              {...formik.getFieldProps("first_name")}
                            ></Input>

                            {formik.touched.first_name &&
                            formik.errors.first_name ? (
                              <span className="text-sm  font-bold text-red-400">
                                {formik.errors.first_name}
                              </span>
                            ) : null}
                            <p className="text-gray-500 text-sm mt-1">
                              Please give us the name of someone coming for this
                              trip.
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
                                formik.touched.last_name &&
                                formik.errors.last_name
                                  ? true
                                  : false
                              }
                              {...formik.getFieldProps("last_name")}
                            ></Input>
                            {formik.touched.last_name &&
                            formik.errors.last_name ? (
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
                            formik.touched.email && formik.errors.email
                              ? true
                              : false
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
                          We’ll send your confirmation email to this address.
                          Please make sure it&apos;s valid.
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
                      <div className="text-sm font-bold text-center">
                        Payment
                      </div>
                      <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h1 className="font-bold">Price</h1>
                      <Price
                        className="!text-sm !font-bold"
                        stayPrice={
                          trip.price * Number(router.query.guests) +
                          totalPrice() * Number(router.query.non_resident)
                        }
                      ></Price>
                    </div>

                    <div className="flex justify-between mt-3 items-center">
                      <h1 className="font-bold">Processing fees (3.5%)</h1>
                      <Price
                        className="!text-sm !font-bold"
                        stayPrice={
                          (trip.price * Number(router.query.guests) +
                            totalPrice() * Number(router.query.non_resident)) *
                          0.035
                        }
                      ></Price>
                    </div>

                    <div className="flex justify-between mt-3 items-center">
                      <h1 className="font-bold">Total price</h1>
                      <Price
                        className="!text-sm !font-bold"
                        stayPrice={
                          trip.price * Number(router.query.guests) +
                          totalPrice() * Number(router.query.non_resident) +
                          (trip.price * Number(router.query.guests) +
                            totalPrice() * Number(router.query.non_resident)) *
                            0.035
                        }
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
                          if (isValidPhoneNumber(phone || "")) {
                            setInvalidPhone(false);
                            formik.validateForm().then(() => {
                              initializePayment(onSuccess);
                            });
                          } else {
                            setInvalidPhone(true);
                          }
                        }}
                        type="submit"
                        className="flex w-full mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 !text-white"
                      >
                        <span>Pay now</span>
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
                      title={"Thanks for requesting to book this trip"}
                      dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
                    >
                      <div>
                        We&apos;ll get back to you in 24 hours confirming all
                        the details of the trip. We will send an extended
                        itinerary to your email:{" "}
                        <span className="font-bold underline">
                          {formik.values.email}
                        </span>
                      </div>

                      <div className="mt-4">Meanwhile...</div>

                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => {
                            router.replace("/trip");
                          }}
                          className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                        >
                          <span>Checkout other curated trips</span>
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

                    <Dialogue
                      isOpen={showCheckoutResponseModalForPayment}
                      closeModal={() => {
                        setShowCheckoutResponseModalForPayment(false);
                        router.back();
                      }}
                      dialoguePanelClassName="!max-w-md !h-[265px]"
                      title={"Thanks for booking this trip"}
                      dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
                    >
                      <div>
                        Thank you for booking!!!🥳. We&apos;ll get back to you
                        in less than 24 hours. We are confirming all the details
                        of the trip. We will send an extended itinerary to your
                        email:{" "}
                        <span className="font-bold underline">
                          {formik.values.email}
                        </span>
                      </div>

                      <div className="mt-4">Meanwhile...</div>

                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => {
                            router.replace("/trip");
                          }}
                          className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                        >
                          <span>Checkout other curated trips</span>
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
                          formik.handleSubmit();
                        }}
                        className="flex w-full mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-blue-600 !text-white"
                      >
                        <span>Request to book</span>

                        <div
                          className={" " + (loading ? "ml-1.5 " : " hidden")}
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
          )}
        </div>
      )}

      {pageError && (
        <div>
          <ServerError></ServerError>
        </div>
      )}
    </>
  );
}

TripDetail.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/recommended-trips/${context.query.slug}/`
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

      const userTrips = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          trip: data,
          userTrips: userTrips.data || [],
        },
      };
    }

    return {
      props: {
        userProfile: "",
        trip: data,
        userTrips: [],
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
          userTrips: [],
        },
      };
    }
  }
}

export default TripDetail;
