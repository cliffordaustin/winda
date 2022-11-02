import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getToken from "../../lib/getToken";
import Navbar from "../../components/ui/Navbar";
import Listing from "../../components/SavedListings/Listing";
import { useRouter } from "next/router";

function Partner({ userProfile, stays }) {
  const router = useRouter();
  return (
    <div>
      <Navbar userProfile={userProfile}></Navbar>

      <div className="px-6 mt-4">
        <h1 className="font-black text-2xl">
          Welcome {userProfile.first_name}
        </h1>

        {stays.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1>These are your stays</h1>
          </div>
        )}

        <div className="flex flex-wrap my-5 gap-4">
          {stays.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  router.push(`/partner/${item.slug}`);
                }}
                className="md:w-[31%] w-full"
              >
                <Listing
                  stayPage={true}
                  stay={item}
                  stayId={item.id}
                  partnerPage={true}
                ></Listing>
              </div>
            );
          })}
        </div>

        {stays.length === 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">
              You currently have no stays. Contact us if you want your stay to
              be live on Winda
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

Partner.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    if (response.data[0].is_partner) {
      const userStays = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-stays/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          stays: userStays.data.results,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login?redirect=/partner",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stays: [],
        },
      };
    }
  }
}

export default Partner;
