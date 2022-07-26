import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

import LoginForm from "../../../../components/Login/Login";
import { wrapper } from "../../../../redux/store";

function VerificationLogin({ error }) {
  const router = useRouter();

  // useEffect(() => {
  //   axios
  //     .post(
  //       `${process.env.NEXT_PUBLIC_URL}/account-confirm-email/${router.query.verification_slug}/`,
  //       {
  //         key: router.query.verification_slug,
  //       }
  //     )
  //     .then((res) => {
  //       return {
  //         props: {},
  //       };
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       if (error.response.status === 404) {
  //         console.log("second");
  //         return {
  //           props: {},
  //         };
  //       } else {
  //         context.res.statusCode = 500;
  //         return {
  //           props: {},
  //         };
  //       }
  //     });
  // }, []);
  return (
    <>
      {!error && (
        <div className="relative">
          <div className="w-full font-bold bg-blue-400 text-center py-2 px-2 text-white">
            Your email has been confirmed. Please sign in to continue.
          </div>
          <LoginForm></LoginForm>
        </div>
      )}

      {error && (
        <div className="h-screen flex items-center justify-center">
          <span className="text-gray-600">An error has occurred</span>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query, resolvedUrl }) => {
      let notFound = false;
      let serverErr = false;
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/account-confirm-email/${query.verification_slug}/`,
          {
            key: query.verification_slug,
          }
        )
        .then((res) => {})
        .catch((error) => {
          if (error.response.status === 404) {
            notFound = true;
          } else {
            serverErr = true;
          }
        });

      if (notFound) {
        return {
          notFound: true,
        };
      }

      if (serverErr) {
        return {
          props: {
            error: true,
          },
        };
      }

      return {
        props: {},
      };
    }
);

export default VerificationLogin;
