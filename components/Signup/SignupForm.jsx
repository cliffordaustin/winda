import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { failureResponseGoogle } from "../../lib/socialSignin";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { useDispatch, useStore } from "react-redux";
import { signup, signinWithGoogle } from "../../redux/actions/auth";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";

import * as Yup from "yup";

import Link from "next/link";

export default function Signup(props) {
  const [state, setState] = useState({
    showPassword: false,
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const store = useStore();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password1: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      last_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("This field is required"),
      password1: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      setLoading(true);
      await dispatch(
        signup({
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password1: values.password1,
            password2: values.password1,
          },
          router,
        })
      );
      setLoading(false);
      const errorVals = {
        first_name: "",
        last_name: "",
        email: "",
        password1: "",
      };
      setErrors({ ...errorVals, ...store.getState().auth.signupErrors });
    },
  });

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
    <div className="flex flex-col relative items-center sm:px-16 md:px-6 px-6 justify-center py-2 h-full">
      <h1 className="text-black font-bold text-center w-full text-3xl font-Merriweather self-start">
        Register
      </h1>
      <div className="py-4 rounded-xl flex w-full flex-col mt-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex items-center gap-4 w-full">
            <div className="w-full relative">
              <Input
                name="first_name"
                type="text"
                placeholder="First name"
                errorStyle={
                  formik.touched.first_name && formik.errors.first_name
                    ? true
                    : false
                }
                className={"w-full "}
                label="First name"
                {...formik.getFieldProps("first_name")}
              ></Input>
              {formik.touched.first_name && formik.errors.first_name ? (
                <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                  {formik.errors.first_name}
                </span>
              ) : null}
            </div>
            <div className="w-full relative">
              <Input
                name="last_name"
                type="text"
                placeholder="Last name"
                label="Last name"
                className={"w-full "}
                errorStyle={
                  formik.touched.last_name && formik.errors.last_name
                    ? true
                    : false
                }
                {...formik.getFieldProps("last_name")}
              ></Input>
              {formik.touched.last_name && formik.errors.last_name ? (
                <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                  {formik.errors.last_name}
                </span>
              ) : null}
            </div>
          </div>
          <div
            className={
              "mb-4 " +
              (formik.errors.last_name || formik.errors.first_name
                ? "mb-[32px]"
                : "")
            }
          ></div>
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
            name="password1"
            type={state.showPassword ? "text" : "password"}
            errorStyle={
              formik.touched.password1 && formik.errors.password1 ? true : false
            }
            placeholder="Password"
            label="Password"
            {...formik.getFieldProps("password1")}
            showPassword={state.showPassword}
            changeShowPasswordToFalse={changeShowPasswordToFalse}
            changeShowPasswordToTrue={changeShowPasswordToTrue}
          ></Input>
          {formik.touched.password1 && formik.errors.password1 ? (
            <span className="text-sm mt-3 font-bold text-red-400">
              {formik.errors.password1}
            </span>
          ) : null}
          {/* <h3 className="mt-3 font-bold">
            By clicking Register, you agree to the job finder{" "}
            <span className="text-blue-500">Terms and condition</span>
          </h3> */}
          <Button
            type="submit"
            disabled={loading}
            className={
              "mt-5 w-full px-5 flex items-center gap-2 !py-3 !bg-[#303960] hover:!bg-[#202642] !rounded-full !text-base " +
              (loading ? "opacity-60 cursor-not-allowed" : "")
            }
          >
            <span>Register</span>
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
          <span>Sign up with Google</span>
        </Button> */}
        <h3 className="mt-6 font-bold text-center">
          Already on Winda?{" "}
          <div
            onClick={() => {
              router.replace({
                pathname: "/login",
                query: { redirect: `${router.query.redirect || "/"}` },
              });
            }}
            className="text-blue-500 inline cursor-pointer"
          >
            Login
          </div>
        </h3>
      </div>
    </div>
  );
}
