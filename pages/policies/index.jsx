import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import ListItem from "../../components/ui/ListItem";
import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import Link from "next/link";
import Head from "next/head";

const Policies = ({ userProfile }) => {
  return (
    <div>
      <Head>
        <title>Winda.guide | Policies</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <h1 className="text-center font-bold text-3xl">Winda Guide Policies</h1>

      <article className="mt-6 mb-10 px-6 sm:px-10">
        <h1 className="text-2xl font-bold">Trip cancellation</h1>
        <p className="mt-3 ml-2">
          You should have COVID-19 travel insurance. If you cancel more than
          60-days prior to arrival, your deposit will be refunded. Between 60
          days to 45 days prior to arrival - 50% of the reservation will be
          withheld. Less than 30 days prior to arrival and no-shows - 100% of
          the full value of the reservation is forfeited. Should a guest fail to
          join a safari, join after a set departure or leave it prior to its
          completion, no refund can be made, and full cancellation fees apply.
          For any change in the itinerary by guests whilst on safari, there will
          be no refund for any services not utilized, and all-new arrangements
          will be for the guest’s account.
        </p>

        <h1 className="text-2xl font-bold mt-8">Travel insurance</h1>
        <p className="mt-3 ml-2">
          It is required that you have comprehensive travel insurance for your
          entire trip prior to starting your trip, this must include emergency
          medical repatriation to your country of residence.
        </p>

        <h1 className="text-2xl font-bold mt-8">COVID-19</h1>
        <p className="mt-3 ml-2">
          The Republic of Kenya has a vaccination program ongoing, however,
          COVID-19 is obviously still present in the country. For covid-19
          vaccinated arrivals, you must present your vaccination certificate at
          a port health check on arrival. For unvaccinated arrivals, you must
          have a valid COVID-19 PCR test taken no longer than 48hrs prior to
          your flight to Kenya. If you become unwell and suspect having COVID-19
          it is recommended to obtain a self-test from a pharmacy (approximately
          $10).
        </p>

        <h1 className="text-2xl font-bold mt-8">
          Entry, health & visa requirements
        </h1>
        <div className="mt-3 ml-2">
          The Republic of Kenya generally requires an eVisa to be attained
          online prior to entry for entry from most countries (see{" "}
          <Link href="https://evisa.go.ke/evisa.html">
            <a target="_blank">
              <div className="text-blue-500 underline inline">here</div>
            </a>
          </Link>
          ). For exceptions to this rule (see{" "}
          <Link href="https://immigration.ecitizen.go.ke/index.php?id=6">
            <a target="_blank">
              <div className="text-blue-500 underline inline">here</div>
            </a>
          </Link>
          ) . For covid-19 vaccinated arrivals, you must present your
          vaccination certificate at a port health check on arrival. For
          unvaccinated arrivals, you must have a valid COVID-19 PCR test taken
          no longer than 48hrs prior to your flight to Kenya. It is also
          recommended that your vaccinations are up to date prior to arrival
          (Highly Recommended: Diphtheria; Hepatitis A; Poliomyelitis; Tetanus.
          Strongly recommended: Hepatitis B; Meningococcal Meningitis; Rabies;
          Typhoid; Yellow Fever). Some areas of Kenya are also Malarial zones,
          please consult your doctor prior to travelling to obtain Malarial
          prophylaxis medication. Additionally, it is highly recommended to wash
          your hands regularly, especially before eating to prevent possible
          cases of traveler’s diarrhoea.
        </div>

        <h1 className="text-2xl font-bold mt-8">Damages</h1>
        <p className="mt-3 ml-2">
          Guests are responsible for any damages incurred on their trips or
          activities. Winda.guide holds no responsibility for said damages.
        </p>

        <h1 className="text-2xl font-bold mt-8">Winda.Guide Liability</h1>
        <p className="mt-3 ml-2">
          Winda.Guide holds no responsibility for any of the scenarios below:
          <div className="mt-2 ml-2 flex flex-col gap-3">
            <ListItem>
              loss or damage to personal items, injury, illness or loss of life
              at any point whilst traveling.
            </ListItem>

            <ListItem>
              shut down/insolvency of the accommodation booked for the guest. In
              this case, Winda.guide will endeavor to refund any possible funds
              available for recourse from the accommodation.
            </ListItem>
          </div>
        </p>
      </article>

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

Policies.propTypes = {};

export default Policies;
