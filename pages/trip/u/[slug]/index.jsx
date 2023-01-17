import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { createGlobalStyle } from "styled-components";
import getToken from "../../../../lib/getToken";
import Navbar from "../../../../components/ui/Navbar";
import ImageGallery from "../../../../components/Stay/ImageGallery";
import { Icon } from "@iconify/react";
import TripImageGallery from "../../../../components/Trip/ImageGallery";
import DaysAccordion from "../../../../components/Trip/DaysAccordion";
import Carousel from "../../../../components/ui/Carousel";
import CuratedTripMap from "../../../../components/Trip/TripsMap";
import Price from "../../../../components/Stay/Price";
import moment from "moment/moment";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ScrollToNavigation from "../../../../components/Trip/ScrollToNavigations";
import { Transition } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { Link as ReactScrollLink } from "react-scroll";
import Head from "next/head";
import MapBox from "../../../../components/Trip/Map";

function CuratedTripDetail({ trip, userProfile }) {
  const router = useRouter();

  const GlobalStyle = createGlobalStyle`
  .mapboxgl-map {
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
    @media (min-width: 768px) {
      border-radius: 0rem !important;
    }
  }
  .mapboxgl-popup-content {
    background: none;
    box-shadow: none !important;
  }
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    border-top-color: transparent !important;
    border: none !important;
  }
`;

  const hasCarTransport = () => {
    let carTransport = false;

    trip.itineraries.forEach((itinerary) => {
      carTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "CAR TRANSFER"
      );
    });

    return carTransport;
  };

  const hasCarHireTransport = () => {
    let carHireTransport = false;

    trip.itineraries.forEach((itinerary) => {
      carHireTransport = itinerary.itinerary_transports.some(
        (transport) => transport.transport_type === "CAR HIRE"
      );
    });

    return carHireTransport;
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

  // const [scrollRef, inView, entry] = useInView({
  //   rootMargin: "0px 0px",
  // });

  // const [planRef, planInView, planEntry] = useInView({
  //   rootMargin: "-70px 0px",
  // });

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

  const orderedItineraries = trip.itineraries.sort(
    (x, y) => x.start_day - y.start_day
  );

  return (
    <div>
      <GlobalStyle></GlobalStyle>
      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <Head>
          <title>{trip.name}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Navbar userProfile={userProfile}></Navbar>
      </div>

      <div className="relative md:!h-[540px] !h-[300px] w-full">
        <ImageGallery
          images={trip.curated_trip_images}
          stayType={""}
          className="!h-full !mt-0"
        ></ImageGallery>
      </div>

      {/* <div className="h-[60px] border-b border-gray-200 w-[100%] px-3 lg:px-10">
        <ScrollToNavigation></ScrollToNavigation>
      </div> */}

      <div className="w-[30%] h-[350px] hidden md:block">
        <CuratedTripMap></CuratedTripMap>
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
