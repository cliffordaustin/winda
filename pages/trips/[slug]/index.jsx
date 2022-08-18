import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import getToken from "../../../lib/getToken";

const UserTrip = ({ userProfile, userTrips }) => {
  return <div>{userProfile.first_name}</div>;
};

UserTrip.propTypes = {};

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

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-trips/${context.query.slug}/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        userTrips: data,
      },
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    } else if (error.response && error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          userTrips: [],
        },
      };
    }
  }
}

export default UserTrip;
