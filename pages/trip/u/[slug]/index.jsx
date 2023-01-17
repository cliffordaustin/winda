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

  return (
    <div>
      <GlobalStyle></GlobalStyle>
      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        {/* <Head>
          <title>{trip.name}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head> */}

        {/* <Navbar userProfile={userProfile}></Navbar> */}
      </div>

      {/* <div className="relative md:!h-[540px] !h-[300px] w-full">
        <ImageGallery
          images={trip.curated_trip_images}
          stayType={""}
          className="!h-full !mt-0"
        ></ImageGallery>
      </div> */}

      {/* <div className="h-[60px] border-b border-gray-200 w-[100%] px-3 lg:px-10">
        <ScrollToNavigation></ScrollToNavigation>
      </div> */}

      <div className="w-[30%] h-[350px] hidden md:block">
        <CuratedTripMap slug={trip.slug}></CuratedTripMap>
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
