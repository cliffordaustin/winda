import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getToken from "../../../../lib/getToken";
import Navbar from "../../../../components/ui/Navbar";
import ImageGallery from "../../../../components/Stay/ImageGallery";
import { Icon } from "@iconify/react";
import TripImageGallery from "../../../../components/Trip/ImageGallery";
import DaysAccordion from "../../../../components/Trip/DaysAccordion";
import Carousel from "../../../../components/ui/Carousel";
import CuratedTripMap from "../../../../components/Trip/CuratedTripMap";
import Price from "../../../../components/Stay/Price";
import moment from "moment/moment";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function CuratedTripDetail({ trip, userProfile }) {
  const totalNumberOfBreakfasts = () => {
    let total = 0;

    trip.itineraries.forEach((itinerary) => {
      total += itinerary.breakfast_included ? 1 : 0;
    });

    return total;
  };

  const router = useRouter();

  const totalNumberOfLunches = () => {
    let total = 0;

    trip.itineraries.forEach((itinerary) => {
      total += itinerary.lunch_included ? 1 : 0;
    });

    return total;
  };

  const totalNumberOfDinners = () => {
    let total = 0;

    trip.itineraries.forEach((itinerary) => {
      total += itinerary.dinner_included ? 1 : 0;
    });

    return total;
  };

  const hasCarTransport = () => {
    let carTransport = false;

    trip.itineraries.forEach((itinerary) => {
      carTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "CAR"
      );
    });

    return carTransport;
  };

  const hasBusTransport = () => {
    let busTransport = false;

    trip.itineraries.forEach((itinerary) => {
      busTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "BUS"
      );
    });

    return busTransport;
  };

  const hasFlightTransport = () => {
    let flightTransport = false;

    trip.itineraries.forEach((itinerary) => {
      flightTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "FLIGHT"
      );
    });

    return flightTransport;
  };

  const hasTrainTransport = () => {
    let trainTransport = false;

    trip.itineraries.forEach((itinerary) => {
      trainTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "TRAIN"
      );
    });

    return trainTransport;
  };

  const tripSortedImages = trip.curated_trip_images.sort(
    (x, y) => y.main - x.main
  );

  const tripImages = tripSortedImages.map((image) => {
    return image.image;
  });

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const [datePricing, setDatePricing] = useState([]);

  const getDateAndPricing = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/curated-trips/${trip.slug}/date-pricing/`
      );
      setDatePricing(data.results);
    } catch (error) {}
  };

  useEffect(() => {
    getDateAndPricing();
  }, []);

  const planAPrice = () => {
    return userIsFromKenya
      ? trip.plan_a_price.price
      : trip.plan_a_price.price_non_resident;
  };

  const planAOldPrice = () => {
    return trip.plan_a_price.old_price;
  };

  const planBPrice = () => {
    return userIsFromKenya
      ? trip.plan_b_price.price
      : trip.plan_b_price.price_non_resident;
  };

  const planBOldPrice = () => {
    return trip.plan_b_price.old_price;
  };

  const planCPrice = () => {
    return userIsFromKenya
      ? trip.plan_c_price.price
      : trip.plan_c_price.price_non_resident;
  };

  const planCOldPrice = () => {
    return trip.plan_c_price.old_price;
  };

  return (
    <div>
      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <Navbar userProfile={userProfile}></Navbar>
      </div>

      <div className="relative md:!h-[540px] !h-[300px] w-full">
        <ImageGallery
          images={trip.curated_trip_images}
          stayType={""}
          className="!h-full !mt-0"
        ></ImageGallery>
      </div>

      <div className="px-4 mt-4">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl lg:text-4xl font-black">{trip.name}</h1>
          </div>

          <div className="w-full flex items-start gap-2">
            <div className="flex flex-wrap w-[70%] gap-8 mt-8">
              <div className="flex w-[30%] flex-col items-center h-fit justify-center gap-1.5">
                <div className="flex gap-1 items-center">
                  <Icon
                    icon="clarity:calendar-solid-badged"
                    className="w-7 h-7"
                  />
                  <h1 className="font-bold">Days</h1>
                </div>

                <div className="font-bold">
                  {trip.total_number_of_days} days
                </div>
              </div>

              <div className="flex w-[30%] flex-col items-center h-fit justify-center gap-1.5">
                <div className="flex gap-1 items-center">
                  <Icon icon="bx:world" className="w-7 h-7" />
                  <h1 className="font-bold">Country</h1>
                </div>

                <div className="font-bold">
                  {trip.number_of_countries}{" "}
                  {trip.number_of_countries > 1 ? "countries" : "country"}
                </div>
              </div>

              <div className="flex w-[30%] flex-col items-center h-fit justify-center gap-1.5">
                <div className="flex gap-1 items-center">
                  <Icon icon="bxs:group" className="w-7 h-7" />
                  <h1 className="font-bold">Max group size</h1>
                </div>
                <div className="font-bold">
                  Maximum of {trip.max_number_of_people} people
                </div>
              </div>

              <div className="flex w-[30%] flex-col items-center h-fit justify-center gap-1.5">
                <div className="flex gap-1 items-center">
                  <Icon icon="dashicons:food" className="w-7 h-7" />
                  <h1 className="font-bold">Meals</h1>
                </div>
                <div className="font-bold">
                  {totalNumberOfBreakfasts() > 0
                    ? `${totalNumberOfBreakfasts()} ${
                        totalNumberOfBreakfasts() > 1
                          ? " breakfasts"
                          : "breakfast"
                      }`
                    : ""}

                  {totalNumberOfLunches() > 0
                    ? ` | ${totalNumberOfLunches()} ${
                        totalNumberOfLunches() > 1 ? " lunches" : " lunch"
                      }`
                    : ""}

                  {totalNumberOfDinners() > 0
                    ? ` | ${totalNumberOfDinners()} ${
                        totalNumberOfDinners() > 1 ? " dinners" : " dinner"
                      }`
                    : ""}
                </div>
              </div>

              <div className="flex w-[30%] flex-col items-center h-fit justify-center gap-1.5">
                <div className="flex gap-1 items-center">
                  <Icon
                    icon="simple-icons:transportforlondon"
                    className="w-7 h-7"
                  />
                  <h1 className="font-bold">Transport</h1>
                </div>
                <div className="font-bold">
                  {hasCarTransport() ? `Car` : ""}

                  {hasTrainTransport() ? ` | Train` : ""}

                  {hasFlightTransport() ? ` | Flight` : ""}

                  {hasBusTransport() ? ` | Bus` : ""}
                </div>
              </div>
              {trip.trip_is_carbon_neutral && (
                <div className="flex w-[30%] flex-col h-fit items-center bg-green-300 py-2 px-2 rounded-md">
                  <Icon
                    icon="fluent:earth-leaf-24-filled"
                    className="w-7 h-7 text-green-900"
                  />
                  <h1 className="font-bold text-green-900">
                    Trip is carbon neutral
                  </h1>
                </div>
              )}
              <div className="w-full">{trip.description}</div>
            </div>
            <div className="w-[30%] h-[350px]">
              <CuratedTripMap locations={trip.locations}></CuratedTripMap>
            </div>
          </div>

          {trip.essential_information && (
            <div className="mb-6 mt-12">
              <h1 className="font-bold text-2xl text-gray-700 font-OpenSans mb-2">
                Essential information
              </h1>

              <div className="font-medium text-gray-600">
                {trip.essential_information}
              </div>
            </div>
          )}

          <div name="gallery" className="mt-6 mb-12">
            <h1 className="font-bold text-2xl text-gray-700 font-OpenSans mb-4">
              Gallery
            </h1>

            <div className="h-[300px]">
              <TripImageGallery
                images={[...tripImages]}
                className="!h-[340px] !w-full md:!w-[50%]"
              ></TripImageGallery>
            </div>
          </div>

          <div className="mt-6 mb-12">
            <h1 className="font-bold text-2xl text-gray-700 font-OpenSans mb-4">
              Itinerary
            </h1>

            <div className="mt-4 flex flex-col gap-2">
              {trip.itineraries.map((itinerary, index) => {
                return (
                  <DaysAccordion
                    key={index}
                    title={
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 px-4 py-2">
                          <h1 className="font-black">Day {itinerary.day}</h1>
                        </div>
                        <div className="text-lg font-bold">
                          {itinerary.title}
                        </div>
                      </div>
                    }
                    accordionClassName="!px-0 !py-0"
                    accordionContentClassName="px-2 py-1.5"
                    titleContainerClassName="!p-0"
                    showAccordionByDefault={index === 0 ? true : false}
                  >
                    {itinerary.itinerary_locations.map((location, index) => (
                      <div key={index} className="flex flex-col gap-2 mt-2">
                        <div className="flex gap-3 items-center">
                          <Icon icon="eva:pin-fill" className="w-8 h-8" />
                          <h1 className="font-bold text-lg">
                            {location.location}
                          </h1>
                        </div>
                        <p className="ml-12">{location.description}</p>
                      </div>
                    ))}

                    <div className="my-4 w-full h-[1px] bg-gray-200"></div>

                    <DaysAccordion
                      title={
                        <div className="bg-gray-100 px-4 py-2">
                          <h1>Accommodation</h1>
                        </div>
                      }
                      accordionClassName="!px-0 !py-0"
                      accordionContentClassName="px-2 py-1.5"
                      titleContainerClassName="!p-0 border-b"
                      showAccordionByDefault={false}
                    >
                      <div className="mt-4 flex gap-3">
                        {itinerary.itinerary_accommodations.map(
                          (accommodation, index) => {
                            const sortedImages =
                              accommodation.stay.stay_images.sort(
                                (x, y) => y.main - x.main
                              );

                            const images = sortedImages.map((image) => {
                              return image.image;
                            });

                            const stay = accommodation.stay;

                            return (
                              <div
                                key={index}
                                className="flex flex-col w-[350px] h-fit rounded-lg shadow-lg"
                              >
                                <div className="h-[200px] w-full">
                                  <Carousel
                                    images={images}
                                    imageClass="rounded-tl-lg rounded-tr-lg"
                                  ></Carousel>
                                </div>
                                <div className="px-2 py-2">
                                  <span className="font-bold text-lg mb-1 block">
                                    {stay.name}(or similar)
                                  </span>
                                  {stay.description.slice(0, 200)}
                                  <div className="w-fit px-2 py-1 mt-1 text-sm text-gray-600 rounded-md bg-gray-100 border font-bold">
                                    2 nights
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </DaysAccordion>

                    <DaysAccordion
                      title={
                        <div className="bg-gray-100 px-4 py-2">
                          <h1>Included activities</h1>
                        </div>
                      }
                      accordionClassName="!px-0 !py-0 !mt-4"
                      accordionContentClassName="px-2 py-1.5"
                      titleContainerClassName="!p-0 border-b"
                      showAccordionByDefault={false}
                    >
                      <div className="mt-4 flex gap-3">
                        {itinerary.itinerary_activities.map(
                          (itinerary_activity, index) => {
                            const sortedImages =
                              itinerary_activity.activity.activity_images.sort(
                                (x, y) => y.main - x.main
                              );

                            const images = sortedImages.map((image) => {
                              return image.image;
                            });

                            const activity = itinerary_activity.activity;

                            return (
                              <div
                                key={index}
                                className="flex flex-col w-[350px] h-fit rounded-lg shadow-lg"
                              >
                                <div className="h-[200px] w-full">
                                  <Carousel
                                    images={images}
                                    imageClass="rounded-tl-lg rounded-tr-lg"
                                  ></Carousel>
                                </div>
                                <div className="px-2 py-2">
                                  <span className="font-bold text-lg mb-1 block">
                                    {activity.name}
                                  </span>
                                  {activity.description.slice(0, 200)}
                                  <div className="w-fit px-2 py-1 mt-1 text-sm text-gray-600 rounded-md bg-gray-100 border font-bold">
                                    2 nights
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </DaysAccordion>

                    <DaysAccordion
                      title={
                        <div className="bg-gray-100 px-4 py-2">
                          <h1>Optional activities</h1>
                        </div>
                      }
                      accordionClassName="!px-0 !py-0 !mt-4"
                      accordionContentClassName="px-2 py-1.5"
                      titleContainerClassName="!p-0 border-b"
                      showAccordionByDefault={false}
                    >
                      <div className="flex flex-col gap-2 mt-2 ml-2">
                        {itinerary.optional_activities.map(
                          (itinerary_activity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <Icon icon="ant-design:plus-outlined" />
                              <span>{itinerary_activity.activity}</span>
                            </div>
                          )
                        )}
                      </div>
                    </DaysAccordion>

                    <DaysAccordion
                      title={
                        <div className="bg-gray-100 px-4 py-2">
                          <h1>Transport</h1>
                        </div>
                      }
                      accordionClassName="!px-0 !py-0 !mt-4 mb-6"
                      accordionContentClassName="px-2 py-1.5"
                      titleContainerClassName="!p-0 border-b"
                      showAccordionByDefault={false}
                    >
                      <div className="flex flex-col gap-2 mt-2 ml-2">
                        {itinerary.itinerary_transports.map(
                          (itinerary_transports, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="h-10 w-12 rounded-lg flex items-center justify-center bg-gray-200">
                                {itinerary_transports.transport_type ===
                                  "CAR" && (
                                  <Icon
                                    className="w-7 h-7 text-gray-500"
                                    icon="fa6-solid:car"
                                  />
                                )}

                                {itinerary_transports.transport_type ===
                                  "BUS" && (
                                  <Icon
                                    className="w-7 h-7 text-gray-500"
                                    icon="fa6-solid:bus"
                                  />
                                )}

                                {itinerary_transports.transport_type ===
                                  "FLIGHT" && (
                                  <Icon
                                    className="w-7 h-7 text-gray-500"
                                    icon="ic:twotone-flight"
                                  />
                                )}

                                {itinerary_transports.transport_type ===
                                  "TRAIN" && (
                                  <Icon
                                    className="w-7 h-7 text-gray-500"
                                    icon="fe:train"
                                  />
                                )}
                              </div>
                              <div>
                                {!itinerary_transports.all_round_trip && (
                                  <span className="font-bold">
                                    From{" "}
                                    {itinerary_transports.starting_location} to{" "}
                                    {itinerary_transports.ending_location}
                                  </span>
                                )}

                                {itinerary_transports.all_round_trip && (
                                  <span className="font-bold">
                                    To all locations around this trip(for this
                                    day)
                                  </span>
                                )}
                                {itinerary_transports.driver_included_in_car && (
                                  <div className="text-sm text-gray-700">
                                    Driver included in car
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </DaysAccordion>
                  </DaysAccordion>
                );
              })}
            </div>
          </div>

          <div className="mb-12 flex flex-col gap-2">
            <h1 className="font-bold text-2xl text-gray-700 font-OpenSans text-center mb-9">
              <span>Pick a </span>
              <span className="text-red-600">plan </span>
              <span>that fits your budget</span>
            </h1>

            <div className="mt-8 flex items-center gap-6 mx-auto w-[80%] justify-center">
              <div className="h-fit px-3 py-3 bg-gray-100 rounded-2xl w-[30%]">
                <h3 className="font-bold uppercase text-sm text-center">
                  Basic plan
                </h3>

                <div className="mt-2 flex justify-center gap-1">
                  {planAOldPrice() && (
                    <Price
                      stayPrice={planAOldPrice()}
                      className="!text-sm line-through self-end mb-0.5 text-red-500"
                    ></Price>
                  )}
                  <Price stayPrice={planAPrice()}></Price>
                </div>

                <div className="mt-4 flex gap-2 flex-col">
                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-green-400"
                    />
                    <h4 className="font-bold text-sm">
                      All the stays in this trip
                    </h4>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-gray-300"
                    />
                    <h4 className="font-bold text-sm text-gray-400 line-through">
                      All the activities in this trip
                    </h4>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-gray-300"
                    />
                    <h4 className="font-bold text-sm text-gray-400 line-through">
                      All transports included
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-8">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: `/trip/u/${trip.slug}/book`,
                        query: {
                          plan: "1",
                        },
                      });
                    }}
                    className="flex items-center gap-0.5 px-4 py-2 !bg-gradient-to-r from-blue-500 via-blue-500 !rounded-3xl to-blue-600"
                  >
                    <span className="ml-2 text-white text-sm font-bold cursor-pointer">
                      Select this plan
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-[30%] flex items-center relative flex-col">
                <div className="border border-gray-300 absolute font-bold -top-[30px] h-[30px] rounded-t-lg flex items-center justify-center text-sm px-2">
                  Most popular
                </div>
                <div className="h-fit px-3 py-3 bg-blue-500 w-full rounded-2xl">
                  <h3 className="font-bold uppercase text-sm text-white text-center">
                    Standard plan
                  </h3>

                  <div className="mt-2 flex justify-center gap-1">
                    {planBOldPrice() && (
                      <Price
                        stayPrice={planBOldPrice()}
                        className="!text-sm line-through self-end mb-0.5 text-red-500"
                      ></Price>
                    )}
                    <Price
                      stayPrice={planBPrice()}
                      className="text-white"
                    ></Price>
                  </div>

                  <div className="mt-4 flex gap-2 text-white flex-col">
                    <div className="flex gap-2 items-center">
                      <Icon
                        icon="fluent:checkbox-checked-16-filled"
                        className="text-green-400"
                      />
                      <h4 className="font-bold text-sm">
                        All the stays in this trip
                      </h4>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Icon
                        icon="fluent:checkbox-checked-16-filled"
                        className="text-green-400"
                      />
                      <h4 className="font-bold text-sm">
                        All the activities in this trip
                      </h4>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Icon
                        icon="fluent:checkbox-checked-16-filled"
                        className="text-white"
                      />
                      <h4 className="font-bold text-sm line-through">
                        All transports included
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-8">
                    <div
                      onClick={() => {
                        router.push({
                          pathname: `/trip/u/${trip.slug}/book`,
                          query: {
                            plan: "2",
                          },
                        });
                      }}
                      className="flex items-center gap-0.5 px-4 py-2 !bg-gradient-to-r from-pink-500 via-red-500 !rounded-3xl to-yellow-500"
                    >
                      <span className="ml-2 text-white text-sm font-bold cursor-pointer">
                        Select this plan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-fit px-3 py-3 bg-gray-100 rounded-2xl w-[30%]">
                <h3 className="font-bold uppercase text-sm text-center">
                  Ultimate plan
                </h3>

                <div className="mt-2 flex justify-center gap-1">
                  {planCOldPrice() && (
                    <Price
                      stayPrice={planCOldPrice()}
                      className="!text-sm line-through self-end mb-0.5 text-red-500"
                    ></Price>
                  )}
                  <Price stayPrice={planCPrice()}></Price>
                </div>

                <div className="mt-4 flex gap-2 flex-col">
                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-green-400"
                    />
                    <h4 className="font-bold text-sm">
                      All the stays in this trip
                    </h4>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-green-400"
                    />
                    <h4 className="font-bold text-sm">
                      All the activities in this trip
                    </h4>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Icon
                      icon="fluent:checkbox-checked-16-filled"
                      className="text-green-400"
                    />
                    <h4 className="font-bold text-sm">
                      All transports included
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-8">
                  <div
                    onClick={() => {
                      router.push({
                        pathname: `/trip/u/${trip.slug}/book`,
                        query: {
                          plan: "3",
                        },
                      });
                    }}
                    className="flex items-center gap-0.5 px-4 py-2 !bg-gradient-to-r from-blue-500 via-blue-500 !rounded-3xl to-blue-600"
                  >
                    <span className="ml-2 text-white text-sm font-bold cursor-pointer">
                      Select this plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CuratedTripDetail.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const { data } = await axios.get(
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
          trip: data,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        trip: data,
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

export default CuratedTripDetail;
