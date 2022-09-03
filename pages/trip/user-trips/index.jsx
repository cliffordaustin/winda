import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import UserDropdown from "../../../components/Home/UserDropdown";
import getToken from "../../../lib/getToken";
import { useRouter } from "next/router";
import Price from "../../../components/Stay/Price";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";
import PopoverBox from "../../../components/ui/Popover";
import moment from "moment";
import Footer from "../../../components/Home/Footer";

const UserTrips = ({ userTrips, userProfile }) => {
  const router = useRouter();

  const totalPrice = (trip) => {
    return (
      trip.trip.price_non_resident * trip.non_residents +
      trip.trip.price * trip.guests
    );
  };
  return (
    <div className="relative">
      <div className="mb-24">
        <div className="w-full bg-white border-b border-gray-100 z-50">
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

              <div className="sm:flex mt-1 ml-4 hover:text-blue-700 items-center gap-8 hidden">
                <div
                  onClick={(event) => {
                    router.push("/trip");
                  }}
                  className={"cursor-pointer md:!text-base "}
                >
                  Curated trips
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/trip/request-trip">
                <a>
                  <div className="rounded-3xl !border-none px-1 sm:px-3 py-1 glass-effect font-bold text-xs sm:text-sm cursor-pointer !bg-gradient-to-r from-pink-600 via-red-600 to-yellow-500 !text-white">
                    Custom trip
                  </div>
                </a>
              </Link>
              <UserDropdown
                userProfile={userProfile}
                numberOfTrips={userTrips.length}
              ></UserDropdown>
            </div>
          </div>
        </div>
        {userTrips.length > 0 && (
          <>
            <div>
              <div className="px-2 xl:w-[1100px] mx-auto sm:px-16 md:px-20 lg:px-16">
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Your trips
                </div>

                <div className="flex justify-between flex-wrap">
                  {userTrips.map((trip, index) => (
                    <div
                      key={index}
                      className="h-fit mt-5 shadow-lg relative w-full lg:w-[48%] border px-4 py-4 rounded-lg"
                    >
                      <div className="flex h-28 gap-2">
                        <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={
                              trip.trip.single_trip_images.length > 0
                                ? trip.trip.single_trip_images[0].image
                                : ""
                            }
                            unoptimized={true}
                            alt="Main image of trip"
                          ></Image>
                        </div>

                        <div className="flex flex-col gap-1">
                          <h1 className="font-bold">{trip.trip.name}</h1>
                          <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                            <Icon icon="akar-icons:clock" />{" "}
                            {trip.trip.total_number_of_days} days trip
                          </p>
                          {trip.trip.starting_location && (
                            <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                              Starting from {trip.trip.starting_location}
                            </p>
                          )}

                          <div
                            onClick={() => {
                              router.push({
                                pathname: `/trip/${trip.trip.slug}`,
                              });
                            }}
                            className="text-blue-500 underline text-sm cursor-pointer"
                          >
                            View this curated trip
                          </div>
                        </div>
                      </div>
                      <div className="h-[0.6px] w-full bg-gray-500 mt-10 mb-4"></div>
                      <h1 className="font-bold text-2xl font-OpenSans">
                        Trip breakdown
                      </h1>

                      <div className="mt-6 flex flex-col items-center gap-6">
                        {trip.starting_date && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[75%]">
                              <span className="truncate">Starting date</span>
                            </div>

                            <div className="text-sm font-bold">
                              {moment(trip.starting_date).format("Do MMM YYYY")}
                            </div>
                          </div>
                        )}
                        {trip.trip.stay && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[75%]">
                              <span className="truncate">
                                {trip.trip.stay.name}
                              </span>
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is a{" "}
                                    <span className="lowercase">
                                      {trip.trip.stay.type_of_stay
                                        ? trip.trip.stay.type_of_stay
                                        : "stay"}
                                    </span>{" "}
                                    in{" "}
                                    <span className="lowercase">
                                      {trip.trip.stay.location}
                                      {""}
                                      {trip.trip.stay.location &&
                                      trip.trip.stay.country
                                        ? ", "
                                        : ""}{" "}
                                      {trip.trip.stay.country}
                                    </span>{" "}
                                    .You will be staying here for 2 nights
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.trip.nights} nights
                            </div>
                          </div>
                        )}

                        {trip.trip.activity && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[75%]">
                              <span className="truncate">
                                {trip.trip.activity.name}
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
                                      {trip.trip.activity.location}
                                      {""}
                                      {trip.trip.activity.location &&
                                      trip.trip.activity.country
                                        ? ", "
                                        : ""}{" "}
                                      {trip.trip.activity.country}
                                    </span>{" "}
                                    .You will be coming with{" "}
                                    {trip.guests + trip.non_residents}{" "}
                                    {trip.guests + trip.non_residents > 1
                                      ? "guests"
                                      : "guest"}{" "}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.guests + trip.non_residents}{" "}
                              {trip.guests + trip.non_residents > 1
                                ? "guests"
                                : "guest"}
                            </div>
                          </div>
                        )}

                        {trip.trip.transport && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[70%]">
                              {trip.trip.transport.vehicle_make && (
                                <span className="truncate capitalize">
                                  {trip.trip.transport.vehicle_make.toLowerCase()}
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
                                    {trip.trip.transport.type_of_car && (
                                      <span className="lowercase">
                                        It is a{" "}
                                        {trip.trip.transport.type_of_car} car
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.trip.transport.type_of_car && (
                                <div className="text-sm ml-1 capitalize font-bold">
                                  {trip.trip.transport.type_of_car.toLowerCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {trip.trip.flight && (
                          <div className="text-gray-600 flex items-center w-full justify-between">
                            <div className="flex gap-1.5 items-center w-[70%]">
                              Flight transfer
                              <PopoverBox
                                btnPopover={<Icon icon="bx:help-circle" />}
                                btnClassName="flex items-center justify-center"
                                panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -right-[80px] w-[180px]"
                              >
                                <div className="text-sm text-gray-500">
                                  <span>
                                    This is your flight from{" "}
                                    {trip.trip.flight.starting_point} to{" "}
                                    {trip.trip.flight.destination}
                                  </span>
                                </div>
                              </PopoverBox>
                            </div>

                            <div className="text-sm font-bold">
                              {trip.guests + trip.non_residents}{" "}
                              {trip.guests + trip.non_residents > 1
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
                            {moment(new Date(trip.starting_date))
                              .add(trip.trip.total_number_of_days, "days")
                              .format("DD MMM YYYY")}
                          </div>
                        </div>

                        <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                        {trip.message && (
                          <div className="text-gray-600 w-full">
                            <div className="">
                              <span className="truncate font-bold">
                                Message
                              </span>
                            </div>

                            <div className="text-sm mt-2">{trip.message}</div>
                          </div>
                        )}

                        {trip.message && (
                          <div className="h-[0.4px] w-[100%] bg-gray-400"></div>
                        )}

                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 items-center">
                            Total price
                          </div>

                          <Price
                            className="!text-sm !font-bold"
                            stayPrice={totalPrice(trip)}
                          ></Price>
                        </div>
                      </div>

                      {trip.reviewing && (
                        <div className="absolute top-0 left-0 w-fit px-1 rounded-tl-md font-bold text-sm py-0.5 bg-yellow-500">
                          Reviewing
                        </div>
                      )}

                      {trip.email_sent && (
                        <div className="absolute top-0 left-0 w-fit px-1 rounded-tl-md font-bold text-sm py-0.5 bg-yellow-500">
                          Email sent
                        </div>
                      )}

                      {trip.cancelled && (
                        <div className="absolute top-0 left-0 text-white  w-fit px-1 rounded-tl-md font-bold text-sm py-0.5 bg-red-500">
                          Cancelled
                        </div>
                      )}

                      {trip.paid && (
                        <div className="absolute top-0 left-0 w-fit px-1 rounded-tl-md font-bold text-sm py-0.5 bg-green-500">
                          Paid
                        </div>
                      )}
                    </div>
                    // <div
                    //   key={index}
                    //   className="border flex h-[230px] mb-6 shadow-md rounded-2xl w-full lg:w-[48%]"
                    // >
                    //   <div className="w-[180px] md:w-[240px] lg:w-[180px] relative ">
                    //     <Carousel
                    //       images={trip.trip.single_trip_images
                    //         .sort((x, y) => y.main - x.main)
                    //         .map((image) => {
                    //           return image.image;
                    //         })}
                    //       imageClass="rounded-bl-2xl rounded-tl-2xl"
                    //     ></Carousel>

                    //     {trip.reviewing && (
                    //       <div className="absolute top-2 left-2 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
                    //         Reviewing
                    //       </div>
                    //     )}

                    //     {trip.email_sent && (
                    //       <div className="absolute top-2 left-2 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-yellow-500">
                    //         Email sent
                    //       </div>
                    //     )}

                    //     {trip.cancelled && (
                    //       <div className="absolute top-2 text-white left-2 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-red-500">
                    //         Cancelled
                    //       </div>
                    //     )}

                    //     {trip.paid && (
                    //       <div className="absolute top-2 left-2 w-fit px-1 rounded-md font-bold text-sm py-0.5 bg-green-500">
                    //         Paid
                    //       </div>
                    //     )}
                    //   </div>

                    //   <div className="px-3 py-2 w-[200px] flex-grow relative">
                    //     <div className="text-base text-gray-700 font-bold">
                    //       {trip.trip.name}
                    //     </div>

                    //     <div className="mt-1 mb-0">
                    //       <div className="text-sm text-gray-700 flex gap-0.5 items-center">
                    //         <div className="text-xl font-bold">
                    //           <Price stayPrice={totalPrice(trip)}></Price>
                    //         </div>
                    //       </div>
                    //     </div>

                    //     <div className="font-bold">
                    //       {trip.non_residents && (
                    //         <span className="text-sm inline">
                    //           {trip.non_residents} non-resident
                    //         </span>
                    //       )}

                    //       {trip.guests && (
                    //         <span className="text-sm inline">
                    //           {", "}
                    //           {trip.guests} resident
                    //         </span>
                    //       )}
                    //     </div>

                    //     <div className="mt-1">
                    //       {trip.trip.stay && (
                    //         <div className="flex items-center mt-1 gap-1">
                    //           <svg
                    //             xmlns="http://www.w3.org/2000/svg"
                    //             aria-hidden="true"
                    //             role="img"
                    //             width="1em"
                    //             height="1em"
                    //             preserveAspectRatio="xMidYMid meet"
                    //             viewBox="0 0 16 16"
                    //           >
                    //             <g fill="currentColor" fillRule="evenodd">
                    //               <path d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
                    //               <path d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207L1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
                    //             </g>
                    //           </svg>
                    //           <span className="text-sm w-full lowercase truncate">
                    //             {trip.trip.stay.name}
                    //           </span>
                    //         </div>
                    //       )}

                    //       {trip.trip.activity && (
                    //         <div className="flex items-center mt-1 gap-1">
                    //           <svg
                    //             xmlns="http://www.w3.org/2000/svg"
                    //             aria-hidden="true"
                    //             role="img"
                    //             className="w-5 h-5"
                    //             preserveAspectRatio="xMidYMid meet"
                    //             viewBox="0 0 24 24"
                    //           >
                    //             <g
                    //               fill="none"
                    //               stroke="currentColor"
                    //               strokeLinecap="round"
                    //               strokeLinejoin="round"
                    //               strokeWidth="1.5"
                    //             >
                    //               <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                    //               <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                    //               <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                    //             </g>
                    //           </svg>
                    //           <span className="text-sm truncate">
                    //             {trip.trip.activity.name}
                    //           </span>
                    //         </div>
                    //       )}
                    //       {trip.trip.transport && (
                    //         <div className="flex items-center mt-1 gap-1">
                    //           <svg
                    //             xmlns="http://www.w3.org/2000/svg"
                    //             aria-hidden="true"
                    //             role="img"
                    //             className="w-5 h-5"
                    //             preserveAspectRatio="xMidYMid meet"
                    //             viewBox="0 0 16 16"
                    //           >
                    //             <path
                    //               fill="currentColor"
                    //               d="M6 9a.749.749 0 1 1-1.498 0A.749.749 0 0 1 6 9Zm4.749.749a.749.749 0 1 0 0-1.498a.749.749 0 0 0 0 1.498ZM3.034 6.074L3.044 6H2.5a.5.5 0 0 1 0-1h.673l.162-1.256A2 2 0 0 1 5.32 2h5.36a2 2 0 0 1 1.984 1.747L12.823 5h.677a.5.5 0 0 1 0 1h-.549l.01.072A1.5 1.5 0 0 1 14 7.5v3a1.5 1.5 0 0 1-1.5 1.5h-.003v1.25a.75.75 0 1 1-1.5 0V12H5v1.25a.75.75 0 0 1-1.5 0V12A1.5 1.5 0 0 1 2 10.5v-3a1.5 1.5 0 0 1 1.034-1.426Zm1.293-2.202L4.052 6h7.891l-.272-2.127A1 1 0 0 0 10.68 3H5.32a1 1 0 0 0-.992.872ZM12.5 11a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h9Z"
                    //             />
                    //           </svg>
                    //           <div className="text-sm w-full lowercase truncate">
                    //             {trip.trip.transport.type_of_car}
                    //           </div>
                    //         </div>
                    //       )}

                    //       {trip.trip.flight && (
                    //         <div className="flex items-center mt-2 gap-1">
                    //           <svg
                    //             xmlns="http://www.w3.org/2000/svg"
                    //             className="w-5 h-5 text-gray-500"
                    //             preserveAspectRatio="xMidYMid meet"
                    //             viewBox="0 0 24 24"
                    //           >
                    //             <path
                    //               fill="currentColor"
                    //               d="M3.414 13.778L2 15.192l4.949 2.121l2.122 4.95l1.414-1.414l-.707-3.536L13.091 14l3.61 7.704l1.339-1.339l-1.19-10.123l2.828-2.829a2 2 0 1 0-2.828-2.828l-2.903 2.903L3.824 6.297L2.559 7.563l7.644 3.67l-3.253 3.253l-3.536-.708z"
                    //             />
                    //           </svg>
                    //           <div className="text-sm w-full lowercase truncate">
                    //             from {trip.trip.flight.starting_point} to{" "}
                    //             {trip.trip.flight.destination}
                    //           </div>
                    //         </div>
                    //       )}
                    //     </div>

                    //     <div className="flex mt-0.5 justify-between absolute bottom-2 w-full right-0 px-2">
                    //       <Button
                    //         onClick={() => {
                    //           router.push({
                    //             pathname: `/trip/${trip.trip.slug}`,
                    //           });
                    //         }}
                    //         className="w-full !px-0 !bg-white font-bold !border !border-gray-300 !text-black hover:!bg-gray-200"
                    //       >
                    //         view trip
                    //       </Button>
                    //     </div>
                    //   </div>
                    // </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {userTrips.length === 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="mt-20 font-bold text-2xl text-center">
              Nothing in your trip.
            </div>
            <div>
              Check out our{" "}
              <span
                onClick={() => {
                  router.push("/trip");
                }}
                className="text-blue-500 hover:text-blue-800 cursor-pointer"
              >
                curated trips
              </span>
            </div>
            {!Cookies.get("token") && (
              <div>
                <span
                  onClick={() => {
                    router.push({
                      pathname: "/login",
                      query: { redirect: `${router.asPath}` },
                    });
                  }}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Login
                </span>{" "}
                to your account if you already have a trip created
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

UserTrips.propTypes = {};

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

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/booked-trips/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          userTrips: data || [],
        },
      };
    }

    return {
      props: {
        userProfile: "",
        userTrips: [],
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else if (error.response && error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          userTrips: [],
        },
      };
    }
  }
}

export default UserTrips;
