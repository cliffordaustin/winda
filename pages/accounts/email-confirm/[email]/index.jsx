import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../../../../components/ui/Button";

import axios from "axios";
import LoadingSpinerChase from "../../../../components/ui/LoadingSpinerChase";
import Link from "next/link";
import Image from "next/image";

import { wrapper } from "../../../../redux/store";
import { useRouter } from "next/router";

const EmailVerification = ({ error, badRequest }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  function wait(seconds) {
    return new Promise(() => {
      setTimeout(() => {
        setShowVerificationMessage(false);
      }, seconds * 1000);
    });
  }

  const resend = async () => {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_baseURL}/sendconfirmationemail/`, {
        email: Buffer.from(router.query.email, "base64").toString("binary"),
      })
      .then((res) => {
        setLoading(false);
        setShowVerificationMessage(true);
        setTimeout(() => {
          setShowVerificationMessage(false);
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <div className="relative">
      {(error || !badRequest) && (
        <div>
          <div className="mt-8 w-full flex items-center justify-center">
            <Link href="/">
              <a className="relative w-28 h-9 cursor-pointer">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </a>
            </Link>
          </div>
          <div className="mx-auto max-w-[500px] px-4 py-2 mt-8 rounded-xl shadow-lg">
            <h1 className="text-center font-bold text-xl">Already verified</h1>
            <p className="mt-4">
              It looks like you have already verified your email
            </p>
          </div>
        </div>
      )}

      {!error && badRequest && (
        <div>
          <div className="mt-8 w-full flex items-center justify-center">
            <Link href="/">
              <a className="relative w-28 h-9 cursor-pointer">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </a>
            </Link>
          </div>
          <div className="mx-auto max-w-[500px] px-4 py-2 mt-8 rounded-xl shadow-lg">
            <h1 className="text-center font-bold text-xl">
              Confirm your email
            </h1>
            <p className="mt-4">
              Please check your email for confirmation mail. Click link in email
              to verify your account.
            </p>

            <div className="mt-12 flex flex-col items-center gap-2">
              <p className="text-gray-500 text-sm">
                Didn&apos;t get confirmation mail?
              </p>
              <Button
                onClick={() => {
                  resend();
                }}
                className="font-bold !bg-blue-600 flex gap-2"
              >
                <span>Resend email confirmation</span>

                {loading && (
                  <div>
                    <LoadingSpinerChase
                      width={14}
                      height={14}
                    ></LoadingSpinerChase>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showVerificationMessage && (
        <div className="px-6 py-2 text-center bg-blue-400 text-sm text-white font-bold fixed top-0 w-full left-0 right-0">
          Verification message has been resent!
        </div>
      )}
    </div>
  );
};

EmailVerification.propTypes = {};

export const getServerSideProps = wrapper.getServerSideProps(
  (context) =>
    async ({ req, res, query, resolvedUrl }) => {
      let notFound = false;
      let badRequest = false;
      let serverErr = false;
      await axios
        .post(`${process.env.NEXT_PUBLIC_baseURL}/checkconfirmationemail/`, {
          email: Buffer.from(query.email, "base64").toString("binary"),
        })
        .then((res) => {})
        .catch((error) => {
          if (error.response.status === 404) {
            notFound = true;
          } else if (error.response.status === 400) {
            badRequest = true;
          } else {
            serverErr = true;
          }
        });

      if (notFound) {
        return {
          notFound: true,
        };
      }

      if (badRequest) {
        return {
          props: {
            badRequest: true,
          },
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

export default EmailVerification;
