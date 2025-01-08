import React, { useState } from "react";
import PropTypes from "prop-types";
import getToken from "../../lib/getToken";
import Navbar from "../../components/ui/Navbar";
import axios from "axios";
import { createGlobalStyle } from "styled-components";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";

import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

SwiperCore.use([Navigation]);

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Locations from "../../components/TripWizard/Locations";
import Months from "../../components/TripWizard/Months";
import TripCategories from "../../components/TripWizard/TripCategories";
import UserForm from "../../components/TripWizard/UserForm";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Dialogue from "../../components/Home/Dialogue";
import Successful from "../../components/TripWizard/Successful";
import Head from "next/head";

function TripWizard({ userProfile }) {
  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const GlobalStyle = createGlobalStyle`
  .BeaconFabButtonFrame {
      bottom: 70px !important;
  }
  .hsds-beacon .eTCLra {
      bottom: 70px !important;
  }
`;

  const [state, setState] = useState({
    swiperIndex: 0,
    endOfSlide: false,
    showNavigation: false,
  });

  const router = useRouter();

  const getCurrentMonth = new Date().getMonth();

  const getCurrentYear = new Date().getFullYear();

  const handleNext = () => {
    if (state.swiperIndex === 0 && !router.query.location) {
      router.replace(
        {
          query: {
            ...router.query,
            location: "nairobi",
          },
        },
        undefined,
        { shallow: true }
      );
    }

    if (state.swiperIndex === 1 && !router.query.month) {
      router.replace(
        {
          query: {
            ...router.query,
            month: getCurrentMonth,
            year: getCurrentYear,
          },
        },
        undefined,
        { shallow: true }
      );
    }

    if (state.swiperIndex === 2 && !router.query.tag) {
      router.replace(
        {
          query: {
            ...router.query,
            tag: "weekend_getaway",
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const getLocationFromUrl = () => {
    if (router.query.location) {
      if (router.query.location === "0") {
        return "Not sure";
      } else {
        const texts = router.query.location.split(",");
        const locations = texts.map((text) => {
          return text.split("_").join(" ");
        });
        return locations;
      }
    } else {
      return "Not sure";
    }
  };

  const getMonthFromUrl = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (router.query.month) {
      const month = parseInt(router.query.month);
      return monthNames[month];
    } else {
      return monthNames[getCurrentMonth];
    }
  };

  const getYearFromUrl = () => {
    if (router.query.year) {
      return router.query.year;
    } else {
      return getCurrentYear;
    }
  };

  const getTagFromUrl = () => {
    if (router.query.tag) {
      const texts = router.query.tag.split(",");
      const tags = texts.map((text) => {
        return text.split("_").join(" ");
      });
      return tags;
    } else {
      return "Weekend getaway";
    }
  };

  const [phone, setPhone] = useState("");

  const [people, setPeople] = useState(1);

  const [invalidPhone, setInvalidPhone] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modalSuccessful, setModalSuccessful] = useState(false);

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
    onSubmit: (values) => {
      if (phone && !isValidPhoneNumber(phone || "")) {
        setInvalidPhone(true);
      } else {
        setInvalidPhone(false);
        setLoading(true);
        const locations = getLocationFromUrl();

        const month = getMonthFromUrl();

        const year = getYearFromUrl();

        const tags = getTagFromUrl();

        axios
          .post(`${process.env.NEXT_PUBLIC_baseURL}/create-trip-wizard/`, {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            phone: phone,
            number_of_people: people,
            locations: locations,
            month: month,
            year: year,
            tags: tags,
          })
          .then((res) => {
            setLoading(false);
            setModalSuccessful(true);
            Mixpanel.track("Trip wizard", {
              number_of_people: people,
              month: month,
              year: year,
            });
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    },
  });

  return (
    <div>
      <Head>
        <title>Winda.guide | Trip wizard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyle></GlobalStyle>
      <div>
        <Navbar userProfile={userProfile}></Navbar>
      </div>

      <div className="max-w-[900px] mx-auto mt-10">
        <div className="h-fit px-4 md:px-0 text-center w-full flex flex-col items-center justify-center">
          <h1 className="font-black text-2xl">
            Are you thinking of going on a trip?
          </h1>
          <h1 className="font-bold mt-2 text-gray-600">
            {state.swiperIndex === 0
              ? "Where would you like to go?"
              : state.swiperIndex === 1
              ? "When would you like to go?"
              : state.swiperIndex === 2
              ? "What kind of trip would you like to go on?"
              : "Enter your details"}
          </h1>
        </div>
        <Swiper
          {...settings}
          onSlideChange={(swiper) => {
            handleNext();
            setState({
              ...state,
              swiperIndex: swiper.realIndex,
              endOfSlide: swiper.isEnd,
            });
          }}
          preventInteractionOnTransition={true}
          allowTouchMove={false}
          autoHeight={true}
          className="!h-full !py-4 !mb-[60px]"
        >
          <SwiperSlide className="h-full ">
            <div className="flex flex-col gap-2 px-4 md:px-0">
              <Locations></Locations>
            </div>
          </SwiperSlide>

          <SwiperSlide className="h-full ">
            <div className="flex w-full md:w-[70%] mx-auto flex-col gap-2 pb-12">
              <Months></Months>
            </div>
          </SwiperSlide>

          <SwiperSlide className="h-full ">
            <div className="flex flex-col gap-2">
              <TripCategories></TripCategories>
            </div>
          </SwiperSlide>

          <SwiperSlide className="h-full ">
            <div className="flex flex-col gap-2 pb-12">
              <UserForm
                formik={formik}
                phone={phone}
                setPhone={setPhone}
                people={people}
                setPeople={setPeople}
                invalidPhone={invalidPhone}
              ></UserForm>
            </div>
          </SwiperSlide>
          <div className="h-[60px] fixed bottom-0 left-0 right-0 border-t py-2 mx-auto w-full bg-white z-20 flex items-center justify-between ">
            <div className="px-4 py-2 absolute cursor-pointer flex items-center left-0 md:left-8 justify-center gap-1 text-black swiper-pagination swiper-button-prev">
              <Icon icon="bxs:left-arrow" />
              <span className="font-black">Prev</span>
            </div>

            <div
              onClick={() => {
                formik.handleSubmit();
              }}
              className={
                "flex absolute right-3 md:right-8 items-center gap-2 px-4 py-3 !bg-gradient-to-r from-pink-500 via-red-500 !rounded-md to-yellow-500 " +
                (!state.endOfSlide ? "hidden" : "")
              }
            >
              <span className="text-white text-sm font-bold cursor-pointer">
                Submit
              </span>

              {loading && (
                <LoadingSpinerChase width={12} height={12}></LoadingSpinerChase>
              )}
            </div>

            <div
              className={
                "px-4 py-2 flex items-center justify-center gap-1 absolute right-0 md:right-8 cursor-pointer text-black swiper-pagination swiper-button-next " +
                (state.endOfSlide ? "hidden" : "")
              }
            >
              <span className="font-black">Next</span>
              <Icon icon="bxs:right-arrow" />
            </div>
          </div>
        </Swiper>
      </div>

      <Dialogue
        isOpen={modalSuccessful}
        closeModal={() => {
          setModalSuccessful(false);
          router.replace("/");
        }}
        dialoguePanelClassName="!max-w-full sm:!max-w-md !h-[60vh] sm:!h-[335px] !p-0 !absolute sm:!static !bottom-0 !rounded-b-none sm:!rounded-2xl"
      >
        <Successful email={formik.values.email}></Successful>
      </Dialogue>
    </div>
  );
}

TripWizard.propTypes = {};

export default TripWizard;

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
    if (error.response?.status === 401) {
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
