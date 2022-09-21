import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Cookies } from "js-cookie";

import getToken from "../../lib/getToken";

import UserDropdown from "../../components/Home/UserDropdown";
import CarouselAutoPlay from "../../components/ui/CarouselAutoplay";
import { useRouter } from "next/router";
import Listings from "../../components/Lodging/Listings";
import Carousel from "../../components/ui/Carousel";
import Price from "../../components/Stay/Price";
import ContactBanner from "../../components/Home/ContactBanner";

function RequestTrip({ userProfile, stays }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [userLatLng, setUserLatLng] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const getLatLng = async () => {
      const latlng = await axios.get(
        `https://ipinfo.io?token=${process.env.NEXT_PUBLIC_ipInfoToken}`
      );

      const lat = latlng.data.loc.split(",")[0];
      const lng = latlng.data.loc.split(",")[1];

      setUserLatLng({
        ...userLatLng,
        longitude: lng,
        latitude: lat,
      });
    };
    getLatLng();
  }, []);

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1); // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  const getStandardRoomPrice = (stay) => {
    const standardRoom = stay.type_of_rooms.find(
      (room) => room.is_standard === true
    );
    return standardRoom.price;
  };

  const carouselImages = [
    "/images/gondwana_img5.jpg",
    "/images/gondwana_img1.jpg",
    "/images/gondwana_img2.jpg",
    "/images/gondwana_img3.jpg",
  ];

  return (
    <div>
      <div className="fixed top-0 w-full bg-white z-50">
        <ContactBanner></ContactBanner>
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
            <UserDropdown userProfile={userProfile}></UserDropdown>
          </div>
        </div>
      </div>

      <div className="md:hidden h-[400px] mt-[110px]">
        <Carousel
          images={carouselImages}
          imageClass="!w-full rounded-none"
          objectPosition="top"
        ></Carousel>
      </div>
      <div className="flex md:bg-gray-100 gap-2 mt-[20px] md:mt-[110px] relative">
        <div className="hidden md:block h-[91vh] mt-0 sticky top-[80px] w-[45%] xl:w-[55%]">
          <Carousel
            images={carouselImages}
            imageClass="!w-full rounded-none"
            objectPosition="top"
          ></Carousel>

          <div className="flex flex-col absolute bottom-16 left-4 z-40">
            {/* <div className="font-mono text-2xl mb-1 text-white">
              INTRODUCING
            </div>
            <div className="font-bold text-white font-lobster text-6xl">
              Dwana in the Wild: Amboseli Edition
            </div> */}

            {/* <p className="font-mono text-2xl mt-1 text-white">
              These are our select partner lodges for Dwana in the Wild and we
              have the best rates for them.
            </p> */}
          </div>
        </div>
        <div
          className="w-full sm:w-[80%] flex flex-col gap-2 sm:mx-auto md:w-[55%] xl:w-[45%] px-4
         py-3 h-full"
        >
          {stays.map((stay, index) => {
            const sortedImages = stay.stay_images.sort(
              (x, y) => y.main - x.main
            );

            const images = sortedImages.map((image) => {
              return image.image;
            });
            return (
              <div
                key={index}
                className="w-full md:h-[185px] flex md:flex-row flex-col gap-3 bg-white rounded-md overflow-hidden border"
              >
                <div className="md:h-full w-full h-[200px] md:w-[200px]">
                  <Carousel
                    images={images}
                    imageClass="rounded-t-md md:rounded-t-none md:rounded-l-md"
                  ></Carousel>
                </div>

                <div className="py-2 md:px-0 px-2 md:w-[400px]">
                  <div className="uppercase text-xs text-gray-600 truncate">
                    {stay.location}
                  </div>
                  <div className="text-xl font-bold truncate">{stay.name}</div>

                  <div className="flex items-center gap-2 mt-2">
                    {stay.wifi && (
                      <div className="flex gap-2 items-center">
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
                            strokeWidth="2"
                          >
                            <path d="M2 10c6-6.667 14-6.667 20 0M6 14c3.6-4 8.4-4 12 0" />
                            <circle cx="12" cy="18" r="1" />
                          </g>
                        </svg>
                      </div>
                    )}
                    {stay.swimming_pool && (
                      <div className="flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          className="w-5 h-5"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="19.003"
                            cy="6.002"
                            r="2.002"
                            fill="currentColor"
                          />
                          <path
                            fill="currentColor"
                            d="M18.875 13.219c-.567.453-.978.781-1.878.781c-.899 0-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219c-1.601 0-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 12.676 3.6 12 2 12v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219zM16.997 19c-.899 0-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219c-1.601 0-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 17.676 3.6 17 2 17v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219c-.567.453-.978.781-1.878.781zM11 5.419l2.104 2.104l-2.057 2.57c.286-.056.596-.093.947-.093c1.602 0 2.447.676 3.127 1.219c.588.47.977.781 1.876.781c.9 0 1.311-.328 1.878-.781c.132-.105.274-.217.423-.326l-2.096-2.09l.005-.005l-5.5-5.5a.999.999 0 0 0-1.414 0l-4 4l1.414 1.414L11 5.419z"
                          />
                        </svg>
                      </div>
                    )}

                    {stay.gym && (
                      <div className="flex gap-2 items-center">
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
                            <path d="M7.4 7H4.6a.6.6 0 0 0-.6.6v8.8a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6Zm12 0h-2.8a.6.6 0 0 0-.6.6v8.8a.6.6 0 0 0 .6.6h2.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6Z" />
                            <path d="M1 14.4V9.6a.6.6 0 0 1 .6-.6h1.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H1.6a.6.6 0 0 1-.6-.6Zm22 0V9.6a.6.6 0 0 0-.6-.6h-1.8a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6h1.8a.6.6 0 0 0 .6-.6ZM8 12h8" />
                          </g>
                        </svg>
                      </div>
                    )}

                    {stay.spa && (
                      <div className="flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          className="w-5 h-5"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M20.787 9.023c-.125.027-1.803.418-3.953 1.774c-.323-1.567-1.279-4.501-4.108-7.485L12 2.546l-.726.767C8.435 6.308 7.483 9.25 7.163 10.827C5.005 9.448 3.34 9.052 3.218 9.024L2 8.752V10c0 7.29 3.925 12 10 12c5.981 0 10-4.822 10-12V8.758l-1.213.265zM8.999 12.038c.002-.033.152-3.1 3.001-6.532C14.814 8.906 14.999 12 15 12v.125a18.933 18.933 0 0 0-3.01 3.154a19.877 19.877 0 0 0-2.991-3.113v-.128zM12 20c-5.316 0-7.549-4.196-7.937-8.564c1.655.718 4.616 2.426 7.107 6.123l.841 1.249l.825-1.26c2.426-3.708 5.425-5.411 7.096-6.122C19.534 15.654 17.304 20 12 20z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {stay.distance_from_venue && (
                    <div className="text-gray-700 text-xs mt-2">
                      {stay.distance_from_venue.toLocaleString()}
                      KM{" "}
                      <span className="text-gray-500">away from the venue</span>
                    </div>
                  )}

                  <div className="flex justify-between relative">
                    <div className="mt-2 flex flex-col">
                      <div className="flex gap-1">
                        <span className="uppercase text-xs text-gray-500 self-end mb-1">
                          From
                        </span>
                        <Price
                          currency="KES"
                          stayPrice={getStandardRoomPrice(stay)}
                          className="text-2xl"
                        ></Price>
                      </div>
                      <p className="text-gray-500 text-xs">per night</p>
                      {/* {stay.car_transfer_price && (
                        <div className="text-gray-500 text-xs mt-1 underline flex gap-1">
                          <Price
                            currency="KES"
                            stayPrice={
                              getStandardRoomPrice(stay) +
                              stay.car_transfer_price
                            }
                            className="!text-xs !font-normal"
                          ></Price>
                          <span>with car transfer</span>
                        </div>
                      )} */}
                      {/* {!stay.car_transfer_price && stay.bus_transfer_price && (
                        <div className="text-gray-500 text-xs mt-1 underline flex gap-1">
                          <Price
                            currency="KES"
                            stayPrice={
                              getStandardRoomPrice(stay) +
                              stay.bus_transfer_price
                            }
                            className="!text-xs"
                          ></Price>
                          <span>with bus transfer</span>
                        </div>
                      )} */}
                    </div>

                    <Link href={`/stays/${stay.slug}`}>
                      <a className="self-end">
                        <div className="w-fit cursor-pointer mr-3 absolute md:static bottom-0 right-0 px-3 py-1.5 gap-0.5 rounded-md flex items-center justify-center bg-blue-500 text-white">
                          <span className="font-bold">view</span>
                          <Icon icon="akar-icons:chevron-right" />
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const stays = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/events/`);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const stays = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/events/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stays: stays.data.results,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        stays: stays.data.results,
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
          stays: [],
        },
      };
    }
  }
}

RequestTrip.propTypes = {};

export default RequestTrip;