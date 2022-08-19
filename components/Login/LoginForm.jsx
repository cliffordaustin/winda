import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

import { useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import { responseGoogle, failureResponseGoogle } from "../../lib/socialSignin";
import { login, signinWithGoogle } from "../../redux/actions/auth";
import Link from "next/link";
import dynamic from "next/dynamic";

// const { gapi } = dynamic(import("gapi-script"), {
//   ssr: false,
// });

export default function Login(props) {
  const [state, setState] = useState({
    showPassword: false,
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const { loginError } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await dispatch(
        login({
          data: {
            email: values.email,
            password: values.password,
          },
          router: router,
        })
      );
      setLoading(false);
    },
  });

  const errorMessage = {
    show: {
      opacity: 1,
      y: 0,
    },

    hide: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 60,
      },
    },
  };

  const [loading, setLoading] = useState(false);

  const changeShowPasswordToFalse = () => {
    setState({ ...state, showPassword: false });
  };

  const changeShowPasswordToTrue = () => {
    setState({ ...state, showPassword: true });
  };

  const socialLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => (
      setLoading(true),
      dispatch(
        signinWithGoogle(
          {
            access_token: tokenResponse.access_token,
          },
          router
        )
      )
    ),
    onFailure: (tokenResponse) => (
      setLoading(false), failureResponseGoogle(tokenResponse)
    ),
  });
  return (
    <div className="flex flex-col relative items-center sm:px-16 md:px-6 px-6 justify-center pb-6 h-full">
      {loginError ? (
        <motion.div
          variants={errorMessage}
          animate="show"
          initial="hide"
          className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold"
        >
          We couldn’t find an account matching the email or password you
          entered. Please check your email or password and try again.
        </motion.div>
      ) : null}

      <h1 className="text-black font-bold text-center w-full text-3xl font-Merriweather self-start">
        Login
      </h1>
      <div className="py-4 rounded-xl flex w-full flex-col mt-8">
        <form onSubmit={formik.handleSubmit}>
          <Input
            name="email"
            type="email"
            errorStyle={
              formik.touched.email && formik.errors.email ? true : false
            }
            placeholder="Email"
            label="Email"
            {...formik.getFieldProps("email")}
          ></Input>
          {formik.touched.email && formik.errors.email ? (
            <span className="text-sm mt-3 font-bold text-red-400">
              {formik.errors.email}
            </span>
          ) : null}
          <div className="mb-4"></div>
          <Input
            name="password"
            type={state.showPassword ? "text" : "password"}
            errorStyle={
              formik.touched.password && formik.errors.password ? true : false
            }
            placeholder="Password"
            label="Password"
            {...formik.getFieldProps("password")}
            showPassword={state.showPassword}
            changeShowPasswordToFalse={changeShowPasswordToFalse}
            changeShowPasswordToTrue={changeShowPasswordToTrue}
          ></Input>
          {formik.touched.password && formik.errors.password ? (
            <span className="text-sm mt-3 font-bold text-red-400">
              {formik.errors.password}
            </span>
          ) : null}
          <Button
            type="submit"
            disabled={loading}
            className={
              "mt-5 w-full px-5 flex items-center gap-2 !py-3 !bg-[#303960] hover:!bg-[#202642] !rounded-full !text-base " +
              (loading ? "opacity-70 cursor-not-allowed" : "")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Login</span>
            <div>
              {loading ? (
                <LoadingSpinerChase width={20} height={20}></LoadingSpinerChase>
              ) : (
                ""
              )}
            </div>
          </Button>
        </form>
        {/* <div className="mt-10 flex gap-4 items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="text-sm font-bold text-center">Or</div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <Button
          onClick={socialLogin}
          type="submit"
          disabled={loading}
          className={
            "mt-8 w-full !py-3 !text-black !bg-white hover:!bg-gray-100 !border !border-gray-300 flex justify-center items-center gap-2 " +
            (loading ? "!cursor-not-allowed" : "")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            width="24px"
            height="24px"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          <span>Sign in with Google</span>
        </Button> */}

        <h3 className="mt-6 font-bold text-center">
          Don&apos;t have an account?{" "}
          <div
            onClick={() => {
              router.replace({
                pathname: "/signup",
                query: { redirect: `${router.query.redirect || "/"}` },
              });
            }}
            className="text-blue-500 inline cursor-pointer"
          >
            Sign up
          </div>
        </h3>
      </div>
    </div>
  );
}
