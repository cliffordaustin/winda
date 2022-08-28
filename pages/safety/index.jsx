import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import ListItem from "../../components/ui/ListItem";
import Link from "next/link";

const Safety = ({ userProfile }) => {
  return (
    <div>
      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <div className="text-center font-bold text-3xl">Winda Guide Safety</div>

      <div className="mt-6 mb-10 px-10">
        <div className="text-2xl font-bold">Emergency contact information</div>
        <div className="mt-3 ml-2">
          <div>
            Police contacts: <span className="font-bold">999/911/112</span>
          </div>
          <div>Rescue medical and security emergency</div>
          <div>
            evacuation: <span className="font-bold">0714 911 911 </span>
          </div>
          <div>
            AMREF emergency medical evacuation:{" "}
            <span className="font-bold">0730 811 811/ 0709 962 811 </span>
          </div>
          <div>
            Embassies & Consulates:{" "}
            <Link href="https://www.embassy-worldwide.com">
              <a target="_blank">
                <div className="text-blue-500 underline inline">here</div>
              </a>
            </Link>
          </div>
        </div>

        <div className="text-2xl font-bold mt-8">Health</div>
        <div className="mt-3 ml-2">
          Stay up to date on general health and safety guidelines for COVID-19
          safety per WHO. Familiarize yourself and continuously monitor
          applicable government travel restrictions and advisories, and follow
          all national and local laws and guidelines. You will need a CV-19
          vaccine certificate to enter the country. There will be no paper
          verification of COVID-19 test results and vaccination certificates
          upon arrival in Kenya. You should ensure that you have uploaded both
          documents into global haven before boarding via www.globalhaven.org.
          Additionally, you will be required to fill in the passenger locator
          form on the ‘jitenge’ platform{" "}
          <Link href="https://ears.health.go.ke/local_airline_registration/">
            <a target="_blank">
              <div className="text-blue-500 underline inline">here</div>
            </a>
          </Link>
        </div>

        <div className="text-2xl font-bold mt-8">
          Special Travel Considerations{" "}
        </div>
        <div className="mt-3 ml-2">
          Any travelers with disabilities, older travelers, or LGBTQ travelers
          should inform us beforehand to ensure we find you the right places,
          activities, and forms of transportation.
        </div>

        <div className="text-2xl font-bold mt-8">Money</div>
        <div className="mt-3 ml-2">
          You can pay using cash (KES) in most places around Kenya. Mpesa - the
          mobile money option is used countrywide. You would need to get a local
          Safaricom sim card and register your telephone number in order to use
          Mpesa. Credit/debit cards are also used mostly in bigger cities and in
          lodges around the country. As in many bigger cities, be aware of your
          surrounding while moving around and handling money.
        </div>

        <div className="text-2xl font-bold mt-8">Damages</div>
        <div className="mt-3 ml-2">
          Guests are responsible for any damages incurred on their trips or
          activities. Winda.guide holds no responsibility for said damages.
        </div>

        <div className="text-xl font-bold mt-10">
          In case of any other questions, contact us:
        </div>
        <div className="mt-3 ml-2">
          <div>
            Via WhatsApp or direct call on{" "}
            <span
              onClick={() => {
                window.open("tel:+254757629101", "_self");
              }}
              className="text-blue-500 underline cursor-pointer"
            >
              +254 757 629 101
            </span>
          </div>
          <div>Via email: info@winda.guide</div>
        </div>
      </div>

      <div>
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

Safety.propTypes = {};

export default Safety;
