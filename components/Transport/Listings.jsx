import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

import Listing from "./Listing";
import ClientOnly from "../ClientOnly";

function Listings({ userProfile, transports }) {
  const [slugIsCorrect, setSlugIsCorrect] = useState(false);

  const router = useRouter();

  const checkSlug = async () => {
    const token = Cookies.get("token");

    if (token) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`, {
          headers: {
            Authorization: "Token " + token,
          },
        })
        .then((res) => {
          setSlugIsCorrect(true);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setSlugIsCorrect(false);
          }
        });
    } else {
      setSlugIsCorrect(false);
    }
  };

  useEffect(() => {
    if (router.query.trip) {
      checkSlug();
    }
  }, []);

  return (
    <ClientOnly>
      <div className="w-full flex px-3 md:px-6 smUpdate:justify-center md:justify-start md:ml-0 flex-wrap gap-4">
        {transports.map((transport, index) => (
          <Listing
            slugIsCorrect={slugIsCorrect}
            key={index}
            listing={transport}
            userProfile={userProfile}
          ></Listing>
        ))}
      </div>
    </ClientOnly>
  );
}

export default Listings;
