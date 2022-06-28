import React, { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

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

function TripDetail({ userProfile, userTrips, trip }) {
  const router = useRouter();

  const [showDropdown, changeShowDropdown] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);

  const [stayAccordion, setStayAccordion] = useState(true);

  const [activityAccordion, setActivityAccordion] = useState(false);
  const [transportAccordion, setTransportAccordion] = useState(false);
  const [showAllStayDescription, setShowAllStayDescription] = useState(false);

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

  const addToTrip = async () => {
    setLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
        {
          stay_id: trip.stay ? trip.stay.id : null,
          activity_id: trip.activity ? trip.activity.id : null,
          transport_id: trip.transport ? trip.transport.id : null,
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

  return (
    <div>
      <div className="fixed top-0 w-full bg-white z-50">
        <div className="bg-white sm:px-12 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="relative w-28 h-9 cursor-pointer">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                if (Cookies.get("token")) {
                  router.push("/trip/plan");
                } else {
                  router.push({
                    pathname: "/login",
                    query: {
                      redirect: "/trip/plan",
                    },
                  });
                }
              }}
              className="!px-1 !py-1 !bg-blue-600"
            >
              <span>my trip</span>
            </Button>

            <UserDropdown
              userProfile={userProfile}
              changeShowDropdown={() => {
                changeShowDropdown(!showDropdown);
              }}
              showDropdown={showDropdown}
              numberOfTrips={userTrips.length}
            ></UserDropdown>
          </div>
          <ClientOnly>
            {Cookies.get("token") && (
              <div className="bg-white shadow-md absolute text-sm font-bold top-[15%] right-[90px] sm:right-[126px] w-5 h-5 rounded-full flex items-center justify-center">
                {userTrips.length}
              </div>
            )}
          </ClientOnly>
        </div>
      </div>

      <div className="xl:w-[1200px] mt-[72px] w-full mx-auto">
        <div className="relative">
          <ImageGallery
            images={trip.single_trip_images}
            stayType={""}
            className="md:!h-[540px] xl:rounded-xl"
          ></ImageGallery>
        </div>

        <div
          className={
            "w-full z-10 px-2 md:hidden flex justify-between items-center fixed bottom-0 safari-bottom left-0 right-0 bg-white py-1 "
          }
        >
          <div>
            <span className="text-gray-600 font-bold">
              $120 <span className="font-normal text-sm">/person/day</span>
            </span>
          </div>

          <div className="">
            <Button
              onClick={() => {
                if (Cookies.get("token")) {
                  if (userTrips.length > 0) {
                    setShowAddToTripPopup(!showAddToTripPopup);
                  } else {
                    addToTrip();
                  }
                } else {
                  router.push({
                    pathname: "/login",
                    query: {
                      redirect: router.asPath,
                    },
                  });
                }
              }}
              className="!bg-blue-500 !px-6"
            >
              <span>Add to trip</span>

              <div
                className={
                  " " + (loading && !showAddToTripPopup ? "ml-1.5 " : " hidden")
                }
              >
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="white"
                ></LoadingSpinerChase>
              </div>

              {userTrips.length > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        <div className="px-2 md:px-6">
          <div className="mt-4">
            <span className="text-gray-600 font-bold">
              $120 <span className="font-normal text-sm">/person/day</span>
            </span>
          </div>
          <div className="">
            <div className="text-2xl font-bold">{trip.name}</div>
          </div>

          <div className="flex mt-2">
            <div className="w-6 ">
              <div className="h-3 w-3 border rounded-full mx-auto"></div>
              <div className="w-3 h-[70%] border-r"></div>
              <div className="h-3 w-3 rounded-full mx-auto border"></div>
            </div>
            <div className="">
              {trip.stay && (
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 16 16"
                  >
                    <g fill="currentColor" fillRule="evenodd">
                      <path d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                      <path d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207L1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
                    </g>
                  </svg>
                  <span className="text-sm">{trip.stay.name}</span>
                </div>
              )}

              {trip.activity && (
                <div className="flex items-center mt-2 gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="w-5 h-5"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    >
                      <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                      <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                      <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                    </g>
                  </svg>
                  <span className="text-sm">{trip.activity.name}</span>
                </div>
              )}
              {trip.transport && (
                <div className="flex items-center mt-2 gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    className="w-5 h-5"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="currentColor"
                      d="M6 9a.749.749 0 1 1-1.498 0A.749.749 0 0 1 6 9Zm4.749.749a.749.749 0 1 0 0-1.498a.749.749 0 0 0 0 1.498ZM3.034 6.074L3.044 6H2.5a.5.5 0 0 1 0-1h.673l.162-1.256A2 2 0 0 1 5.32 2h5.36a2 2 0 0 1 1.984 1.747L12.823 5h.677a.5.5 0 0 1 0 1h-.549l.01.072A1.5 1.5 0 0 1 14 7.5v3a1.5 1.5 0 0 1-1.5 1.5h-.003v1.25a.75.75 0 1 1-1.5 0V12H5v1.25a.75.75 0 0 1-1.5 0V12A1.5 1.5 0 0 1 2 10.5v-3a1.5 1.5 0 0 1 1.034-1.426Zm1.293-2.202L4.052 6h7.891l-.272-2.127A1 1 0 0 0 10.68 3H5.32a1 1 0 0 0-.992.872ZM12.5 11a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h9Z"
                    />
                  </svg>
                  <span className="text-sm lowercase">
                    {trip.transport.type_of_car}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 hidden md:block">
            <Button
              onClick={() => {
                if (Cookies.get("token")) {
                  if (userTrips.length > 0) {
                    setShowAddToTripPopup(!showAddToTripPopup);
                  } else {
                    addToTrip();
                  }
                } else {
                  router.push({
                    pathname: "/login",
                    query: {
                      redirect: router.asPath,
                    },
                  });
                }
              }}
              className="!bg-blue-500 !px-6"
            >
              <span>Add to trip</span>

              <div
                className={
                  " " + (loading && !showAddToTripPopup ? "ml-1.5 " : " hidden")
                }
              >
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="white"
                ></LoadingSpinerChase>
              </div>

              {userTrips.length > 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </Button>
          </div>

          <div className="mt-10 mb-6">
            <h1 className="text-2xl font-bold">About this trip</h1>
            <div className="mt-2">
              {!showAllDescription && (
                <p className="font-medium text-gray-600">
                  {trip.description.slice(0, 700)}...
                </p>
              )}
              {showAllDescription && (
                <p className="font-medium text-gray-600">{trip.description}</p>
              )}
              {!showAllDescription && (
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
          </div>

          <div className="mt-10 mb-6">
            <h1 className="text-2xl font-bold mb-4">Trip overview</h1>

            {trip.stay && (
              <Accordion
                title={`${trip.stay.name} - Stay`}
                accordion={stayAccordion}
                changeStateFunc={() => {
                  setStayAccordion(!stayAccordion);
                  setActivityAccordion(false);
                  setTransportAccordion(false);
                }}
                className="border-none shadow-md md:shadow-lg rounded-lg"
              >
                <div className="relative">
                  <ImageGallery
                    images={trip.stay.stay_images}
                    stayType={""}
                    className="md:!h-[540px] rounded-lg"
                  ></ImageGallery>
                </div>

                <div className="mt-4 md:px-4">
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

                  <div className="mt-1 flex">
                    <Price
                      stayPrice={trip.stay.price}
                      className="text-gray-600 text-lg"
                    ></Price>
                    <span className="mt-1.5 text-sm">/night</span>
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
                    {!showAllStayDescription && (
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

                  <div
                    name="amenities"
                    className="flex flex-col md:flex-row gap-3 justify-between pt-10"
                  >
                    <div className="w-full">
                      <div className="mb-3">
                        <span className="font-bold text-xl">Amenities</span>
                      </div>

                      <Amenities amenities={trip.stay}></Amenities>
                    </div>
                  </div>

                  <div name="policies" className={"w-full mt-8 mb-4 "}>
                    <h1 className="font-bold text-2xl mb-2">Policies</h1>
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">Refund Policy</span>
                    </div>

                    {!trip.stay.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this property is non-refundable.</p>
                      </div>
                    )}

                    {trip.stay.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this property is refundable.</p>
                        <div className="mt-6">{trip.stay.refund_policy}</div>
                      </div>
                    )}

                    {trip.stay.damage_policy && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Damage Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.stay.damage_policy}</p>
                        </div>
                      </div>
                    )}

                    {trip.stay.covid_19_compliance && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Covid-19 Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.stay.covid_19_compliance_details}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="py-2 px-2 border-b border-gray-100">
                        <span className="font-semibold">Listing Rules</span>

                        <div className="flex items-center gap-6 ml-4">
                          {trip.stay.check_in_time && (
                            <div className="flex items-center mt-2">
                              <span className="font-bold mr-1 hidden sm:block">
                                Checkin at:
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 sm:hidden text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                              </svg>
                              {moment(
                                trip.stay.check_in_time,
                                "HH:mm:ss"
                              ).format("hh:mm a")}
                            </div>
                          )}
                          {trip.stay.check_out_time && (
                            <div className="flex items-center mt-2">
                              <span className="font-bold mr-1 hidden sm:block">
                                Checkout at:
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 sm:hidden text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              {moment(
                                trip.stay.check_out_time,
                                "HH:mm:ss"
                              ).format("hh:mm a")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 ml-2">
                        <div className="flex flex-wrap gap-4 justify-between">
                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Children allowed:{" "}
                              <span className="font-bold">
                                {trip.stay.children_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Pets allowed:{" "}
                              <span className="font-bold">
                                {trip.stay.pets_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Smoking allowed:{" "}
                              <span className="font-bold">
                                {trip.stay.smoking_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Events allowed:{" "}
                              <span className="font-bold">
                                {trip.stay.events_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mb-6 mt-5 cursor-pointer"
                    onClick={() => {
                      router.push({
                        pathname: `/stays/${trip.stay.slug}`,
                      });
                    }}
                  >
                    <div className="px-8 py-3 border text-center rounded-md">
                      <span className="font-bold">Show more</span>
                    </div>
                  </div>
                </div>
              </Accordion>
            )}

            {trip.activity && (
              <Accordion
                accordion={activityAccordion}
                changeStateFunc={() => {
                  setStayAccordion(false);
                  setActivityAccordion(!activityAccordion);
                  setTransportAccordion(false);
                }}
                title={`${trip.activity.name} - Experience`}
                className="border-none shadow-md md:shadow-lg rounded-lg mt-4"
              >
                <div className="relative">
                  <ImageGallery
                    images={trip.activity.activity_images}
                    stayType={""}
                    className="md:!h-[540px] rounded-lg"
                  ></ImageGallery>
                </div>

                <div className="mt-4 md:px-4">
                  <h1 className="font-bold text-2xl">Quick facts</h1>

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

                  <div className="mt-1 flex">
                    <Price
                      stayPrice={trip.activity.price}
                      className="text-gray-600 text-lg"
                    ></Price>
                    <span className="mt-1.5 text-sm">/person</span>
                  </div>

                  <h1 className="text-sm text-gray-600 mt-2">
                    This experience has a duration of{" "}
                    {moment
                      .duration(trip.activity.duration_of_activity, "minutes")
                      .humanize()}
                  </h1>

                  <div className="mt-4">
                    {!showAllActivityDescription && (
                      <p className="font-medium text-gray-600">
                        {trip.activity.description.slice(0, 500)}...
                      </p>
                    )}
                    {showAllActivityDescription && (
                      <p className="font-medium text-gray-600">
                        {trip.activity.description}
                      </p>
                    )}
                    {!showAllActivityDescription && (
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

                  {(trip.activity.equipments_provided.length > 0 ||
                    trip.activity.equipments_required_by_user_to_bring.length >
                      0) && (
                    <div className={"w-full order-1 md:order-2 mt-6 "}>
                      <h1 className="font-bold text-2xl mb-2">Essentials</h1>

                      {trip.activity.equipments_provided.length > 0 && (
                        <h3 className="mb-2 ml-4 font-semibold">
                          The following enquipments will be provided to by this
                          place
                        </h3>
                      )}

                      <div className="flex flex-col gap-2 px-2">
                        {trip.activity.equipments_provided.map(
                          (enquipment, index) => (
                            <ListItem key={index}>{enquipment}</ListItem>
                          )
                        )}
                      </div>

                      {trip.activity.equipments_required_by_user_to_bring
                        .length === 0 && (
                        <h3 className="mt-2 font-medium ml-4 underline">
                          You are not required to bring extra equipment
                        </h3>
                      )}

                      {trip.activity.equipments_required_by_user_to_bring
                        .length > 0 && (
                        <h3 className="mb-2 mt-2 ml-4 font-semibold">
                          You are required to bring the following enquipments
                        </h3>
                      )}

                      <div className="flex flex-col gap-2 px-2">
                        {trip.activity.equipments_required_by_user_to_bring.map(
                          (enquipment, index) => (
                            <ListItem key={index}>{enquipment}</ListItem>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className={"w-full mt-6 "}>
                    <h1 className="font-bold text-2xl mb-2">Policies</h1>
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">Refund Policy</span>
                    </div>
                    {!trip.activity.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this experience is non-refundable.</p>
                      </div>
                    )}

                    {trip.activity.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this experience is refundable.</p>
                        <div className="mt-6">
                          {trip.activity.refund_policy}
                        </div>
                      </div>
                    )}

                    {trip.activity.damage_policy && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Damage Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.activity.damage_policy}</p>
                        </div>
                      </div>
                    )}

                    {trip.activity.covid_19_compliance && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Covid-19 Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.activity.covid_19_compliance_details}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="py-2 px-2 border-b border-gray-100">
                        <span className="font-semibold">Listing Rules</span>

                        <div className="flex items-center gap-6 ml-4">
                          {trip.activity.check_in_time && (
                            <div className="flex items-center mt-2">
                              <span className="font-bold mr-1 hidden sm:block">
                                Checkin at:
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 sm:hidden text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                              </svg>
                              {moment(
                                trip.activity.check_in_time,
                                "HH:mm:ss"
                              ).format("hh:mm a")}
                            </div>
                          )}
                          {trip.activity.check_out_time && (
                            <div className="flex items-center mt-2">
                              <span className="font-bold mr-1 hidden sm:block">
                                Checkout at:
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1 sm:hidden text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              {moment(
                                trip.activity.check_out_time,
                                "HH:mm:ss"
                              ).format("hh:mm a")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 ml-2">
                        <div className="flex flex-wrap gap-4 justify-between">
                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Children allowed:{" "}
                              <span className="font-bold">
                                {trip.activity.children_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Pets allowed:{" "}
                              <span className="font-bold">
                                {trip.activity.pets_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Smoking allowed:{" "}
                              <span className="font-bold">
                                {trip.activity.smoking_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mb-6 mt-5 cursor-pointer"
                    onClick={() => {
                      router.push({
                        pathname: `/experiences/${trip.activity.slug}`,
                      });
                    }}
                  >
                    <div className="px-8 py-3 border text-center rounded-md">
                      <span className="font-bold">Show more</span>
                    </div>
                  </div>
                </div>
              </Accordion>
            )}

            {trip.transport && (
              <Accordion
                title={`${trip.transport.vehicle_make.toLowerCase()} ${trip.transport.type_of_car.toLowerCase()} - Transportation`}
                accordion={transportAccordion}
                changeStateFunc={() => {
                  setStayAccordion(false);
                  setActivityAccordion(false);
                  setTransportAccordion(!transportAccordion);
                }}
                className="border-none shadow-md md:shadow-lg rounded-lg mt-4"
              >
                <div className="relative">
                  <ImageGallery
                    images={trip.transport.transportation_images}
                    stayType={""}
                    className="md:!h-[540px] rounded-lg"
                  ></ImageGallery>
                </div>

                <div className="mt-4 md:px-4">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold capitalize text-xl">
                      {trip.transport.vehicle_make.toLowerCase()}
                    </h1>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    {trip.transport.price_per_day && (
                      <div className="flex gap-0.5">
                        <Price
                          stayPrice={trip.transport.price_per_day}
                          className="text-gray-600 text-lg"
                        ></Price>
                        <div className="text-xs mt-2">{"/day"}</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <div>
                      <div className="mt-2 ml-2 flex flex-col gap-2">
                        <h1 className="font-semibold mb-2 ">Comfort</h1>

                        {trip.transport.has_air_condition && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M20 10q-.425 0-.712-.288Q19 9.425 19 9t.288-.713Q19.575 8 20 8t.712.287Q21 8.575 21 9t-.288.712Q20.425 10 20 10Zm-9 12q-.425 0-.712-.288Q10 21.425 10 21v-2.6l-1.9 1.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l3.3-3.3V14H8.4l-3.3 3.3q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7L5.6 14H3q-.425 0-.712-.288Q2 13.425 2 13t.288-.713Q2.575 12 3 12h2.6l-1.9-1.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L8.4 12H10v-1.6L6.7 7.1q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275L10 7.6V5q0-.425.288-.713Q10.575 4 11 4t.713.287Q12 4.575 12 5v2.6l1.9-1.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L12 10.4V12h7q.425 0 .712.287q.288.288.288.713t-.288.712Q19.425 14 19 14h-2.6l1.9 1.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L13.6 14H12v1.6l3.3 3.3q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275L12 18.4V21q0 .425-.287.712Q11.425 22 11 22Zm9-15q-.425 0-.712-.287Q19 6.425 19 6V3q0-.425.288-.713Q19.575 2 20 2t.712.287Q21 2.575 21 3v3q0 .425-.288.713Q20.425 7 20 7Z"
                              />
                            </svg>

                            <span>Air conditioning</span>
                          </div>
                        )}

                        {trip.transport.open_roof && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m16 6l-1 .75L17.5 10h-4V8.5H12V10H3c-1.11 0-2 .89-2 2v3h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-3c0-1.11-.89-2-2-2h-2l-3-4M6 13.5A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5Z"
                              />
                            </svg>
                            <span>Open roof</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 ml-2 flex flex-col gap-2">
                        <h1 className="font-semibold mb-2 ">Entertainment</h1>

                        {trip.transport.fm_radio && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m20.25 5.025l-7.898-2.962l-.703 1.873L14.484 5H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.018-.767-1.85-1.75-1.975zM4 19v-7h16v-2H4V7h16l.001 12H4z"
                              />
                              <circle
                                cx="16.5"
                                cy="15.5"
                                r="2.5"
                                fill="currentColor"
                              />
                              <path fill="currentColor" d="M6 15h4.999v2H6z" />
                            </svg>

                            <span>FM</span>
                          </div>
                        )}

                        {trip.transport.cd_player && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 48 48"
                            >
                              <mask id="svgIDa">
                                <g fill="none" stroke="#fff" strokeWidth="4">
                                  <circle cx="24" cy="24" r="18" />
                                  <path
                                    strokeLinecap="round"
                                    d="M13 24c0-6.075 4.925-11 11-11"
                                  />
                                  <circle cx="24" cy="24" r="5" fill="#fff" />
                                </g>
                              </mask>
                              <path
                                fill="currentColor"
                                d="M0 0h48v48H0z"
                                mask="url(#svgIDa)"
                              />
                            </svg>
                            <span>CD</span>
                          </div>
                        )}

                        {trip.transport.bluetooth && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m5 7l12 10l-6 5V2l6 5L5 17"
                              />
                            </svg>
                            <span>Bluetooth</span>
                          </div>
                        )}

                        {trip.transport.audio_input && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M11 4V3c0-.55.45-1 1-1s1 .45 1 1v1h-2m2 5V5h-2v4H9v6c0 1.3.84 2.4 2 2.82V22h2v-4.18c1.16-.42 2-1.52 2-2.82V9h-2Z"
                              />
                            </svg>
                            <span>Audio Input</span>
                          </div>
                        )}

                        {trip.transport.cruise_control && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M22 15c0 2.6-1.2 4.9-3.1 6.3l-.5-.5l-2.1-2.1l1.4-1.4l1.2 1.2c.5-.7.9-1.6 1-2.5H18v-2h1.9c-.2-.9-.5-1.7-1-2.5l-1.2 1.2l-1.4-1.4l1.2-1.2c-.7-.5-1.6-.9-2.5-1V11h-2V9.1c-.9.2-1.7.5-2.5 1l3 3c.2 0 .3-.1.5-.1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-.2 0-.3.1-.5l-3-3c-.5.7-.9 1.6-1 2.5H10v2H8.1c.2.9.5 1.7 1 2.5l1.2-1.2l1.4 1.4l-2.6 2.6C7.2 19.9 6 17.6 6 15a8 8 0 0 1 8-8a8 8 0 0 1 8 8M6.7 5.3L3.4 2L2 3.4l3.3 3.3L4 8h4V4L6.7 5.3Z"
                              />
                            </svg>

                            <span>Cruise Control</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 ml-2 flex flex-col gap-2">
                        <h1 className="font-semibold mb-2 ">Safety</h1>

                        {trip.transport.overhead_passenger_airbag && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M14 8a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5m-3.54 7.55L13 18.03l-2 .02l-3.5 3.53L6 20.09l4.46-4.54M17 2c1.08 0 2 .88 2 2c0 1.08-.88 2-2 2c-1.08 0-2-.88-2-2c0-1.08.89-2 2-2m-2.59 13h-2.82l5.7 5.71l1.42-1.42l-4.3-4.29m.71-.71l4.29 4.3l.22.21c.23-.38.37-.8.37-1.3v-8A2.5 2.5 0 0 0 17.5 7A2.5 2.5 0 0 0 15 9.5v4.67l.12.12Z"
                              />
                            </svg>

                            <span>Overhead passenger airbag</span>
                          </div>
                        )}

                        {trip.transport.side_airbag && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 640 512"
                            >
                              <path
                                fill="currentColor"
                                d="M176 8c6.6 0 12.4 3.1 14.9 10.09l29.4 73.96l76.1-23.12c6.3-1.9 13.1.21 17.2 5.34c.5.58.9 1.18 1.3 1.81c-17.1 8.24-32.2 20.85-43.5 37.22l-41 59.2c-27.3 8.9-49.8 31-57.8 60.9l-19.9 74l-35.3 32.5c-4.8 4.5-11.9 5.5-17.76 2.7c-5.91-2.9-9.48-9-9.02-15.6l5.59-79.4l-78.65-12.2c-6.48-1-11.689-5.8-13.147-12.2c-1.459-6.4 1.127-13.1 6.527-16.8l65.56-45.1l-39.49-69.12a15.991 15.991 0 0 1 1.39-17.91a15.986 15.986 0 0 1 17.15-5.34l76.15 23.12l29.4-73.96C163.6 11.1 169.4 8 176 8zm208.2 91.67l135.6 35.43c32.7 9.6 56.3 38 59 71.7l6.9 83.9c17.2 13.5 25.6 36.3 19.6 58.7l-35.2 131.4c-4.6 17-23 26.3-39.2 22.6l-15.4-4.1c-17.1-4.6-27.2-22.2-22.7-39.2l8.3-31l-247.3-66.2l-8.2 30.9c-5.5 17.1-22.2 27.2-39.2 22.6l-15.5-4.1c-17.1-4.6-27.2-22.1-22.6-39.2l35.2-131.4c6-22.4 24.7-37.9 46.3-41l47.9-69.2c19.2-27.9 53.9-40.58 86.5-31.83zm-16.5 61.83c-6.6-1.8-13.5.8-17.3 6.3l-32.3 46.7l201.5 54l-4.6-57.4c-.5-5.9-5.2-11.5-11.8-13.3l-135.5-36.3zm-99.4 147.3c12.8 3.4 26-4.2 29.4-17c3.5-12.8-4.1-25.9-16.9-29.4c-13.7-3.4-26 4.2-29.4 17c-3.5 12.8 4.1 26 16.9 29.4zM528 328.7c-12.8-3.4-25.9 4.2-29.4 17c-3.4 12.8 4.2 25.9 17 29.4c12.8 3.4 26-4.2 29.4-17c3.4-12.8-4.2-26-17-29.4z"
                              />
                            </svg>

                            <span>Side airbag</span>
                          </div>
                        )}

                        {trip.transport.power_windows && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M20.253 4.004c.966 0 1.75.784 1.75 1.75V18.25a1.75 1.75 0 0 1-1.75 1.75h-7.248a1.79 1.79 0 0 1-.255-.018V4.023a1.79 1.79 0 0 1 .255-.019h7.248Zm-2.081 5.411a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Zm-7.167-5.413c.084 0 .166.006.246.017V19.98c-.08.011-.162.017-.246.017H3.758a1.75 1.75 0 0 1-1.75-1.75V5.752c0-.967.783-1.75 1.75-1.75h7.247ZM7.172 9.415a.75.75 0 0 0-1.342 0l-2.25 4.5a.75.75 0 0 0 .67 1.086h4.5a.75.75 0 0 0 .672-1.086l-2.25-4.5Z"
                              />
                            </svg>

                            <span>Power windows</span>
                          </div>
                        )}

                        {trip.transport.power_locks && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Power locks</span>
                          </div>
                        )}

                        {trip.transport.power_mirrors && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              className="w-6 h-6"
                              preserveAspectRatio="xMidYMid meet"
                              viewBox="0 0 24 24"
                            >
                              <g fill="currentColor">
                                <path d="M5 8h14v6h-3v2h5V6H3v10h5v-2H5V8Z" />
                                <path d="M16.33 19L12 13l-4.33 6h8.66Z" />
                              </g>
                            </svg>
                            <span>Power mirrors</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4">
                    <div className="mt-6 mb-6">
                      <h1 className="font-bold mb-2">Safety tools</h1>
                      <div className="flex">
                        {trip.transport.safety_tools.map(
                          (safety_tool, index) => (
                            <div
                              key={index}
                              className="bg-red-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                            >
                              {safety_tool}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="mt-6 mb-6">
                      <h1 className="font-bold mb-2">Car operates within</h1>
                      <div className="flex">
                        {trip.transport.dropoff_city
                          .split(",")
                          .map((city, index) => (
                            <div
                              key={index}
                              className="bg-blue-500 text-sm mt-0.5 text-white px-2 py-1 mr-1 rounded-full"
                            >
                              {city}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className={"w-full mt-6 px-2 "}>
                    <h1 className="font-bold text-2xl mb-2">Policies</h1>
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">Refund Policy</span>
                    </div>
                    {!trip.transport.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this transport is non-refundable.</p>
                      </div>
                    )}

                    {trip.transport.refundable && (
                      <div className="mt-2 ml-2">
                        <p>Bookings at this transport is refundable.</p>
                        <div className="mt-6">
                          {trip.transport.refund_policy}
                        </div>
                      </div>
                    )}

                    {trip.transport.damage_policy && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Damage Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.transport.damage_policy}</p>
                        </div>
                      </div>
                    )}

                    {trip.transport.covid_19_compliance && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Covid-19 Policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.transport.covid_19_compliance_details}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="py-2 px-2 border-b border-gray-100">
                        <span className="font-semibold">Rules</span>
                      </div>

                      <div className="mt-2 ml-2">
                        <div className="flex flex-wrap gap-4 justify-between">
                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Children allowed:{" "}
                              <span className="font-bold">
                                {trip.transport.children_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>

                          <div className="md:w-[48%] w-full">
                            <ListItem>
                              Pets allowed:{" "}
                              <span className="font-bold">
                                {trip.transport.pets_allowed ? "yes" : "no"}
                              </span>
                            </ListItem>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mb-6 mt-5 cursor-pointer"
                    onClick={() => {
                      router.push({
                        pathname: `/transport/${trip.transport.slug}`,
                      });
                    }}
                  >
                    <div className="px-8 py-3 border text-center rounded-md">
                      <span className="font-bold">Show more</span>
                    </div>
                  </div>
                </div>
              </Accordion>
            )}
          </div>
          <div className="mt-4">
            <h1 className="text-xl font-bold mb-4">Best month to go</h1>

            <div className="flex flex-col gap-2">
              {trip.months
                .sort((a, b) => a.month - b.month)
                .map((month, index) => (
                  <ListItem key={index}>
                    {filterArrayOfObjects(months, month.month.toString())
                      .length > 0 &&
                      filterArrayOfObjects(months, month.month.toString())[0]
                        .label}
                  </ListItem>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        showModal={showAddToTripPopup}
        closeModal={() => {
          setShowAddToTripPopup(false);
        }}
        title="add to a trip"
        className="!overflow-y-scroll max-w-[500px] !h-[700px]"
      >
        <div className="px-4 mt-2 h-full relative">
          {userTrips.map((singleTrip, index) => {
            return (
              <SingleTrip
                key={index}
                trip={singleTrip}
                isRecommendedPage={true}
                selectedData={{
                  stay_id: trip.stay ? trip.stay.id : null,
                  activity_id: trip.activity ? trip.activity.id : null,
                  transport_id: trip.transport ? trip.transport.id : null,
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
      </Modal>

      <div className="mt-6 mb-6 md:mb-0">
        <Footer></Footer>
      </div>
    </div>
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
          destination: "/login",
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
