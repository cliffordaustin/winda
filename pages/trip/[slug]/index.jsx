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
import { Icon } from "@iconify/react";

function TripDetail({ userProfile, userTrips, trip }) {
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

  const [showMoreExperiences, setShowMoreExperiences] = useState(false);

  const [showMoreActivities, setShowMoreActivities] = useState(false);

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

  const totalPrice = () => {
    return (
      (trip.stay ? trip.stay.price_non_resident : 0) +
      (trip.activity ? trip.activity.price_non_resident : 0) +
      (trip.transport ? trip.transport.price_per_day : 0)
    );
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
          <div className="mt-1">
            <div className="text-sm text-gray-600 flex gap-0.5 items-center">
              <div className="text-sm mr-0.5 font-bold">
                <Price stayPrice={totalPrice()}></Price>
              </div>
              <div className="mt-0.5">avg/night/non-resident</div>
            </div>
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
            <div className="text-sm text-gray-600 flex gap-0.5 items-center">
              <div className="text-sm mr-0.5 font-bold">
                <Price stayPrice={totalPrice()}></Price>
              </div>
              <div className="mt-0.5">avg/night/non-resident</div>
            </div>
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
                  {trip.stay.description.slice(0, 500)}
                  {trip.stay.description.length > 500 && "..."}
                </p>
              )}
              {showAllDescription && (
                <p className="font-medium text-gray-600">
                  {trip.stay.description}
                </p>
              )}
              {!showAllDescription && trip.stay.description.length > 500 && (
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

          <div className="mb-6">
            <h1 className="text-xl font-bold mb-4">Trip highlights</h1>

            <div className="flex flex-col gap-2">
              {trip.trip_highlights.map((highlight, index) => (
                <ListItem key={index}>{highlight.highlight}</ListItem>
              ))}
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

                  {!showMoreExperiences && (
                    <div className="flex flex-wrap gap-2 px-2">
                      {trip.stay.extras_included
                        .slice(0, 5)
                        .map((experience, index) => (
                          <div key={index} className="w-[48%]">
                            <ListItem>{experience.name}</ListItem>
                          </div>
                        ))}
                    </div>
                  )}

                  {showMoreExperiences && (
                    <div className="flex flex-wrap gap-2 px-2">
                      {trip.stay.extras_included.map((experience, index) => (
                        <div key={index} className="w-[48%]">
                          <ListItem>{experience.name}</ListItem>
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

                  {showMoreExperiences && trip.stay.extras_included.length > 5 && (
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

                  <div name="policies" className={"w-full mt-8 mb-4 "}>
                    <h1 className="font-bold text-2xl mb-2">Policies</h1>

                    {trip.stay.cancellation_policy && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Cancellation Policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p className="whitespace-pre-line">
                            {trip.stay.cancellation_policy}
                          </p>
                        </div>
                      </div>
                    )}
                    {trip.stay.cancellation_policy_by_provider && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Cancellation Policy by Provider
                          </span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.stay.cancellation_policy_by_provider}</p>
                        </div>
                      </div>
                    )}

                    {trip.stay.health_and_safety_policy && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">
                            Health and safety policy
                          </span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.stay.health_and_safety_policy}</p>
                        </div>
                      </div>
                    )}
                    {trip.stay.damage_policy_by_provider && (
                      <div className="mt-4">
                        <div className="py-2 px-2 border-b border-gray-100">
                          <span className="font-semibold">Damage policy</span>
                        </div>

                        <div className="mt-2 ml-2">
                          <p>{trip.stay.damage_policy_by_provider}</p>
                        </div>
                      </div>
                    )}
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

                  {trip.activity.type_of_activities.length > 0 && (
                    <dv
                      name="experiences"
                      className="flex flex-col md:flex-row gap-3 justify-between pt-10 "
                    >
                      <div className="border pb-2 h-fit border-gray-200 rounded-xl overflow-hidden w-full order-2 md:order-1 mt-4 md:mt-0">
                        <div className="py-2 bg-gray-200 mb-2">
                          <span className="font-bold text-xl ml-6">
                            Experiences
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
                          The following enquipments will be provided to by this
                          place
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

                      {trip.activity.enquipment_required_by_user.length > 0 && (
                        <h3 className="mb-2 mt-2 ml-4 font-semibold">
                          You are required to bring the following enquipments
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
                title={`${trip.transport.vehicle_make.toLowerCase()} - Transportation`}
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
                    className="md:!h-[440px] md:!w-[420px] rounded-lg"
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

                  <div className="mt-2 mb-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-lg font-semibold w-full text-gray-700 truncate">
                        {trip.transport.vehicle_make}
                      </div>

                      <div className="flex">
                        <Price stayPrice={trip.transport.price_per_day}></Price>
                        <div className="text-xs mt-2">/day</div>
                      </div>
                    </div>

                    <div className="text-sm ml-1 capitalize font-bold">
                      {trip.transport.type_of_car.toLowerCase()}
                    </div>

                    <div className="py-2 border-t border-b border-gray-400 px-2 my-2 text-sm text-gray-600 flex justify-between items-center">
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="carbon:user-filled" />
                        <p>{trip.transport.capacity}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon className="w-4 h-4" icon="bi:bag-fill" />
                        <p>{trip.transport.bags}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon
                          className="w-4 h-4"
                          icon="icon-park-solid:manual-gear"
                        />
                        <p className="capitalize">
                          {trip.transport.transmission.toLowerCase()}
                        </p>
                      </div>
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

                    {trip.transport.driver_operates_within.length > 0 && (
                      <h1 className="font-bold text-lg mb-2">
                        Car operates within
                      </h1>
                    )}
                    {trip.transport.driver_operates_within.map(
                      (item, index) => (
                        <ListItem key={index}>{item.city}</ListItem>
                      )
                    )}

                    {trip.transport.included_in_price.length > 0 && (
                      <h1 className="font-bold text-lg mb-2 mt-4">
                        Included in price
                      </h1>
                    )}
                    {trip.transport.included_in_price.map((item, index) => (
                      <ListItem key={index}>{item.included_in_price}</ListItem>
                    ))}

                    {trip.transport.policy && (
                      <h1 className="mt-4 font-bold">Please take note</h1>
                    )}

                    {trip.transport.policy && (
                      <p className="mt-2">{trip.transport.policy}</p>
                    )}
                  </div>

                  <div
                    className="mb-6 mt-5 cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/transport/?transportSlug=${trip.transport.slug}`
                      );
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
