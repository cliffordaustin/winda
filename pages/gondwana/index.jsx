import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Cookies } from "js-cookie";
import { Mixpanel } from "../../lib/mixpanelconfig";

import getToken from "../../lib/getToken";

import UserDropdown from "../../components/Home/UserDropdown";
import CarouselAutoPlay from "../../components/ui/CarouselAutoplay";
import { useRouter } from "next/router";
import Listings from "../../components/Lodging/Listings";
import Carousel from "../../components/ui/Carousel";
import Price from "../../components/Stay/Price";
import ContactBanner from "../../components/Home/ContactBanner";
import Dialogue from "../../components/Home/Dialogue";

function RequestTrip({ userProfile, stays }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showFAQ, setShowFAQ] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [eventDetails, setEventDetails] = useState(false);

  const getStandardRoomPrice = (stay) => {
    const standardRoom = stay.type_of_rooms.find(
      (room) => room.is_standard === true
    );
    return standardRoom.price;
  };

  const carouselImages = [
    "/images/gondwana_img6.jpg",
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

      <div className="lg:hidden relative h-[400px] sm:h-[500px] mt-[120px]">
        {/* <Carousel
          images={carouselImages}
          imageClass="!w-full rounded-none"
          objectPosition="top"
          layout="intrinsic"
        ></Carousel> */}

        <Image
          className={"w-full "}
          src={"/images/gondwana_img6.jpg"}
          alt="Image Gallery"
          layout="fill"
          objectFit="cover"
          objectPosition={"left"}
          unoptimized={true}
        />
      </div>
      <div className="flex lg:bg-gray-100 gap-2 mt-[20px] lg:mt-[110px] relative">
        <div className="hidden lg:block h-[86.7vh] mt-0 sticky top-[80px] w-[45%] xl:w-[55%]">
          {/* <Carousel
            images={carouselImages}
            imageClass="!w-full rounded-none"
            objectPosition="top"
          ></Carousel> */}

          <Image
            className={"w-full "}
            src={"/images/gondwana_img6.jpg"}
            alt="Image Gallery"
            layout="fill"
            objectFit="cover"
            objectPosition={"left"}
            unoptimized={true}
          />

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
          className="w-full relative mb-10 sm:w-[80%] flex flex-col gap-2 sm:mx-auto lg:w-[55%] xl:w-[45%] px-4
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

                <div className="py-2 md:px-0 px-2 w-full">
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
                        <div
                          onClick={() => {
                            Mixpanel.track("Event accommodation opened", {
                              name_of_accommodation: stay.name,
                            });
                          }}
                          className="w-fit cursor-pointer mr-3 absolute md:static bottom-0 right-0 px-3 py-1.5 gap-0.5 rounded-md flex items-center justify-center bg-blue-500 text-white"
                        >
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
          <div className="flex gap-4 items-center px-8 lg:px-4 border-t fixed bottom-0 right-0 w-full lg:w-[55.3%] xl:w-[45%] bg-white h-[40px]">
            <div
              onClick={() => {
                setShowFAQ(true);
              }}
              className="underline font-bold cursor-pointer"
            >
              FAQ
            </div>
            <Dialogue
              isOpen={showFAQ}
              closeModal={() => {
                setShowFAQ(false);
              }}
              title="FAQ"
              dialogueTitleClassName="!font-bold mb-6"
              dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              outsideDialogueClass="!p-1"
            >
              <h1 className="mt-4 font-bold">
                What accommodation is being offered?
              </h1>

              <p className="mt-2">
                Winda.guide has organised the best rates for Kilima Camp and
                Kibo camp as accommodation for Dwana in the wild.{" "}
              </p>

              <h1 className="mt-4 font-bold">
                Is there transport for people staying in other non-recommended
                accommodation?
              </h1>

              <p className="mt-2">
                No, unfortunately we have not organised transport to other
                non-recommended accommodations from Nairobi & between said
                accommodation and the event site (Kilima Safari Camp).
              </p>

              <h1 className="mt-4 font-bold">
                Can we stay in Amboseli National Park?
              </h1>

              <p className="mt-2">
                We highly recommend you do not stay at any properties within
                Amboseli NP. This is because you will not be able to leave the
                park after 6pm or enter the park before 6am as the gates are
                shut due to wildlife security.{" "}
              </p>

              <h1 className="font-bold mt-4">What are the event timings?</h1>

              <p className="mt-2">
                Dwana in the wild will start Saturday 8th October 4pm- 2 am &
                Sunday 9th October 3pm-2am.
              </p>

              <h1 className="font-bold mt-4">
                Can I bring alcohol and food from outside the accommodation,
                inside?
              </h1>

              <p className="mt-2">
                No, you are not allowed to bring food or alcohol from outside.
                There will be a cash bar serving drinks for the duration of the
                event at Kilima Camp. Accommodation at Kilima camp is also full
                board and there will be food to purchase for those not staying
                at Kilima.{" "}
              </p>

              <p className="mt-2">
                Kibo Camp also has a cash bar and full board accommodation
                (breakfast, lunch & dinner) included with the price.{" "}
              </p>

              <h1 className="font-bold mt-4">
                Is there transportation from Nairobi to the accommodation around
                Amboseli?
              </h1>

              <p className="mt-2">
                Yes , we have arranged a bus transport with two pickups in
                Nairobi on Saturday 8th October and two drop-offs on Monday
                October 10th. These are available to add when you book your
                accommodation
              </p>

              <h1 className="font-bold mt-4">What Should I wear?</h1>

              <p className="mt-2">
                It is likely to be hot in the day and cold at night, please
                dress accordingly. Also, we recommend you wear suitable footwear
                as they ground might be uneven.{" "}
              </p>

              <div className="fixed top-3 right-4 flex flex-col">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFAQ(false);
                  }}
                  className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </Dialogue>
            <div
              onClick={() => {
                setShowTerms(true);
              }}
              className="underline font-bold cursor-pointer"
            >
              Terms and condition
            </div>
            <Dialogue
              isOpen={showTerms}
              closeModal={() => {
                setShowTerms(false);
              }}
              title="Terms and condition"
              outsideDialogueClass="!p-1"
              dialogueTitleClassName="!font-bold mb-6"
              dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
            >
              <h1 className="text-center underline">
                Dwana in the Wild Amboseli
              </h1>
              <h1 className="text-center underline">Accommodation Details</h1>

              <p className="font-bold">Tentative event times</p>
              <p className="font-bold">Saturday 8th October 4 pm - 2 am</p>

              <p className="font-bold">Sunday 9th October 3 pm - 2 am</p>
              <p className="font-bold">
                Kilima Safari camp is the site at which Dwana in the Wild will
                take place.
              </p>

              <h1 className="underline mt-6">Kilima Safari Camp</h1>
              <p className="font-bold mt-2">
                This is the event location for Dwana in the Wild
              </p>
              <p className="mt-2">
                Included in the Rates for AA Safari camp is full board
                accommodation (Breakfast, Lunch and Dinner) with tea, coffee &
                purified drinking water, any additional beverages are extra.
                Amenities include: swimming pool, ensuite rooms, wi-fi, bar &
                restaurant.
              </p>
              <p className="underline mt-6">Kibo Camp</p>
              <p className="mt-2">
                Included in the rates for Kibo Camp; full board accommodation
                (Breakfast, Lunch and Dinner) with tea, coffee & purified
                drinking water , any additional beverages are extra. Amenities
                include: bar, wi-fi, swimming pool & spa (any treatments are
                additional)
              </p>
              <h1 className="font-bold mt-2 underline">
                Transfers options from Nairobi
              </h1>
              <p className="mb-2">
                Transfers by bus from Nairobi to Amboseli and back are charged
                at KES 4,000 per person.
              </p>
              <p className="mb-2">There will be two pickups within Nairobi:</p>
              <div className="ml-4">
                <p>1. Saturday, October 8th; Westlands at 8 am.</p>
                <p>2. Capital Centre 9 am.</p>
              </div>
              <p className="mt-2">
                If you choose the bus transfer option your details will be
                shared with the transfer company and they will communicate with
                you directly.
              </p>
              <h1 className="font-bold mt-4 underline">Event Transfers</h1>
              <p className="mt-4">
                We have organized transfers between Kibo Camp and Kilima Safari
                Camp for KES 2,000 per person for the weekend. This will include{" "}
                <span className="font-bold">transfers</span> to and from your
                accommodation (if not staying at Kilima Safari Camp) and the
                event location (Kilima Safari Camp). This will be paid at the
                event.
              </p>
              <p className="mt-2 font-bold">
                Transfer times will be confirmed closer to the time of the event
              </p>
              <h1 className="font-bold mt-4">Disclaimer</h1>
              <p className="mt-2">
                Winda.Guide accepts no responsibility for loss or damage to
                client’s property, health or loss of life.
              </p>
              <p className="mt-2">
                Please note that all damages inflicted on the accommodation are
                the responsibility of the clients to settle with said
                accommodation.
              </p>
              <div className="font-bold mt-4">
                Please note we do not recommend staying in a lodge within
                Amboseli NP , as you will not be able to exit the park after 6
                pm and return before 6 am.
              </div>
              <p className="mt-4">Landing Page Note:</p>
              <p className="mt-2">
                Please book extra activities such as game drives, bushwalks &
                sundowners with your accommodation directly. N.B. not all
                accommodation offers all stated activities.
              </p>
              <p className="mt-4">Dress-code</p>
              <p className="mt-2">
                Please be sensible and appreciate it will get cold in the night
                and possibly very warm in the day. Rain is also a possibility,
                dress accordingly. We also highly recommend adequate supportive
                footwear as the ground may be uneven.
              </p>
              <p className="mt-4">Cancellation Policy</p>
              <p className="mt-2">
                There will be no refunds for any accommodation booked and no
                transfer of names associated with bookings. All sales are final.
              </p>

              <div className="fixed top-3 right-4 flex flex-col">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTerms(false);
                  }}
                  className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </Dialogue>

            <div
              onClick={() => {
                setEventDetails(true);
              }}
              className="underline font-bold cursor-pointer"
            >
              Event details
            </div>
            <Dialogue
              isOpen={eventDetails}
              closeModal={() => {
                setEventDetails(false);
              }}
              title="Event details"
              outsideDialogueClass="!p-1"
              dialogueTitleClassName="!font-bold !py-3 !px-4 bg-gray-100"
              dialoguePanelClassName="max-h-[600px] !p-0 max-w-2xl overflow-y-scroll remove-scroll"
            >
              <div className="relative w-full h-[600px]">
                <Image
                  className={"w-full h-full "}
                  src={"/images/DISCLAIMER-event.jpg"}
                  alt="Image Gallery"
                  layout="fill"
                  unoptimized={true}
                />
              </div>

              <div className="w-full mt-6"></div>

              <div className="relative w-full h-[500px]">
                <Image
                  className={"w-full h-full "}
                  src={"/images/bus-schedule-event.jpg"}
                  alt="Image Gallery"
                  layout="fill"
                  unoptimized={true}
                />
              </div>

              <div className="w-full mt-6"></div>

              <div className="relative w-full h-[500px]">
                <Image
                  className={"w-full h-full "}
                  src={"/images/INTERNAL-COMMUTE-event.jpg"}
                  alt="Image Gallery"
                  layout="fill"
                  unoptimized={true}
                />
              </div>
            </Dialogue>
          </div>
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
