import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import Head from "next/head";

const ContactUs = ({ userProfile }) => {
  return (
    <div>
      <Head>
        <title>Winda.guide | Contact us</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <div className="mt-12 px-6 sm:px-10">
        <div className="md:text-5xl text-3xl font-OpenSans font-thin relative before:absolute before:w-[10%] before:h-2 before:rounded-3xl before:-bottom-3 before:left-0 before:bg-blue-900">
          Contact us
        </div>

        <div className="mt-10">
          <div>
            <span className="font-bold">Email:</span>
            <span
              onClick={() => {
                window.open("mailto:info@winda.guide", "_self");
              }}
              className="ml-2 text-blue-600 underline cursor-pointer"
            >
              info@winda.guide
            </span>
          </div>

          <div className="mt-4">
            <span className="font-bold">Phone:</span>
            <span
              className="ml-2 text-blue-600 underline cursor-pointer"
              onClick={() => {
                window.open("tel:+254757629101", "_self");
              }}
            >
              +254 757 629 101
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

ContactUs.propTypes = {};

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
      // statusCode: error.response.statusCode,
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
        // statusCode: error.response.statusCode,
      };
    }
  }
}

export default ContactUs;
