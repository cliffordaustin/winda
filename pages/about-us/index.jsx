import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";

const AboutUs = ({ userProfile }) => {
  return (
    <div className="">
      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <div className="mb-24">
        <div className="text-center font-bold text-3xl">About Us</div>

        <div className="mt-6 mb-10 px-16">
          <div>
            Traveling in Africa can be challenging and complex without relying
            on someone to guide you. A lot or the (me the opons vou det are
            Inflexible and don t necessarl meet vour preferences - until now.
          </div>

          <div className="mt-4">
            Winda.quide has curated trips that consist of 3 core elements of
            travel: stays, activities, and transport. Go to our curated trips
            and pick the one you love the most. If you want to tweak something
            let us know and we&apos;ll make it happen. Take charge of your own
            journey and build the trip of your dreams.
          </div>

          <div className="mt-4">
            You can also choose and book a travel service from accommodation,
            activities led by local guides, and transport for hire or transfers.
            We&apos;ve partnered with hundreds or quality-vetted service
            providers In travel to make sure vou get the best experlen.
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

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

AboutUs.propTypes = {};

export default AboutUs;
