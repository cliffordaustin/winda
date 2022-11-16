import React from "react";
import PropTypes from "prop-types";
import TravelConciergeBanner from "../../components/Home/TravelConciergeBanner";
import Head from "next/head";
import Navbar from "../../components/ui/Navbar";
import getToken from "../../lib/getToken";
import Review from "../../components/Reviews/Review";

function Reviews({ userProfile }) {
  return (
    <div>
      <div className="">
        <Head>
          <title>Winda.guide | Reviews</title>
          <meta
            name="description"
            content="Read reviews from our customers and see what they have to say about our services."
          ></meta>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>

      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <div className="md:hidden">
          <TravelConciergeBanner></TravelConciergeBanner>
        </div>
        <Navbar userProfile={userProfile}></Navbar>
      </div>

      <div className="mt-4 h-full mx-auto w-full px-4 xl:w-[1300px] lg:w-[900px]">
        <h1 className="text-2xl font-black">Customer Reviews</h1>

        <div className="mt-8 flex flex-col gap-4">
          <Review
            userName={"Kai Liu"}
            review="The service and the booking system were great. Great communications and the campsite was excellent!"
            bookingType="Online booking client"
          ></Review>

          <Review
            userName={"Thea Sokolowski"}
            review="Winda provided several amazing options that fit all of our needs, including pricing for the trip end to end, took care of booking, helped us arrange transport, and even contacted the lodge"
            bookingType="Custom trip client "
          ></Review>
        </div>
      </div>
    </div>
  );
}

Reviews.propTypes = {};

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
        },
      };
    }
  }
}

export default Reviews;
