import React, { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import Image from "next/image";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Head from "next/head";

const AboutUs = ({ userProfile }) => {
  let fullName = userProfile.first_name + " " + userProfile.last_name;

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showPassword1, setShowPassword1] = useState(false);

  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

  const [showImageSizeError, setShowImageSizeError] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [loadingImage, setLoadingImage] = useState(false);

  const uploadImage = () => {
    setLoadingImage(true);
    const formData = new FormData();
    formData.append("profile_pic", selectedImage, selectedImage.name);
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_baseURL}/user/${userProfile.id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      )
      .then(() => {
        setLoadingImage(false);
        router.reload();
      })
      .catch((err) => {
        console.log(err.response);
        setLoadingImage(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password1: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("This field is required"),
      password1: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      setLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/rest-auth/password/change/`,
          {
            old_password: values.oldPassword,
            new_password1: values.password1,
            new_password2: values.password1,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then((res) => {
          setLoading(false);

          setShowChangePasswordPopup(true);

          values.oldPassword = "";
          values.password1 = "";

          setTimeout(() => {
            setShowChangePasswordPopup(false);
          }, 4000);
        })
        .catch((err) => {
          setLoading(false);
          setErrors({
            oldPassword: err.response.data.old_password
              ? err.response.data.old_password[0]
              : "",
            password1: err.response.data.new_password2
              ? err.response.data.new_password2[0]
              : "",
          });
        });
    },
  });
  return (
    <div className="relative">
      <Head>
        <title>Winda.guide | Your account</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {showChangePasswordPopup && (
        <div className="absolute z-30 top-0 left-0 right-0 flex items-center justify-center py-2 px-3 bg-green-100">
          <span className="text-green-700 font-bold">
            You have successfully changed your password.
          </span>
        </div>
      )}

      {showImageSizeError && (
        <div className="absolute z-30 top-0 left-0 right-0 flex items-center justify-between py-2 px-3 bg-red-100">
          <div className="text-red-700 w-full flex justify-center items-center font-bold">
            Your image is greater than 1MB.
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              setShowImageSizeError(false);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <div className="max-w-[1100px] px-6 md:px-12 xl:px-0 mx-auto mt-6">
        <div className="flex md:flex-row flex-col items-center gap-3">
          {!userProfile && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[100px] h-[100px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {userProfile && userProfile.profile_pic && (
            <div className="relative w-[100px] h-[100px] rounded-full">
              <Image
                layout="fill"
                alt="profile image of a user"
                className="object-cover rounded-full"
                src={userProfile.profile_pic}
                unoptimized={true}
                objectPosition="center"
                objectFit="cover"
                priority
              ></Image>
            </div>
          )}

          {userProfile && !userProfile.profile_pic && userProfile.avatar_url && (
            <div className="relativew-[100px] h-[100px] rounded-full">
              <Image
                layout="fill"
                alt="profile image of a user"
                className="object-cover rounded-full"
                src={userProfile.avatar_url}
                unoptimized={true}
                objectFit="cover"
                priority
              ></Image>
            </div>
          )}

          {!userProfile.profile_pic && userProfile && !userProfile.avatar_url && (
            <div className="relative w-[100px] h-[100px] rounded-full !bg-slate-800 text-white font-bold flex items-center text-2xl justify-center">
              {fullName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </div>
          )}

          <div className="flex flex-col items-center md:items-start">
            <div className="font-bold text-2xl capitalize">{fullName}</div>
            <div className="truncate">{userProfile.email}</div>
            <input
              type="file"
              onChange={(event) => {
                const mb = event.target.files[0].size / 1048576;

                if (mb > 1) {
                  setShowImageSizeError(true);
                  setSelectedImage(null);
                } else {
                  setShowImageSizeError(false);
                  setSelectedImage(event.target.files[0]);
                }
              }}
              name="ImageProfile"
              id="ImageProfile"
              className="hidden"
            />
            <label
              htmlFor="ImageProfile"
              className="cursor-pointer inline w-full truncate"
            >
              <span className="underline text-blue-600">
                Change Profile Picture
              </span>{" "}
              <span className="text-black no-underline">
                {!selectedImage && "(max size of 1MB)"}
                {selectedImage &&
                  ` - ${selectedImage.name.slice(
                    0,
                    8
                  )}...${selectedImage.name.slice(
                    selectedImage.name.length - 8,
                    selectedImage.name.length
                  )}`}
              </span>
            </label>

            {selectedImage && (
              <Button
                onClick={() => {
                  uploadImage();
                }}
                className="mt-1 md:mt-0 !py-1 !px-1.5 md:!py-0.5 flex items-center gap-1 md:!px-1 !bg-blue-200 !text-blue-600 !text-sm w-fit"
              >
                <span>update</span>
                {loadingImage && (
                  <div>
                    <LoadingSpinerChase
                      color="blue"
                      width={12}
                      height={12}
                    ></LoadingSpinerChase>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h1 className="font-bold text-xl mb-4">Change password</h1>

          <form onSubmit={formik.handleSubmit}>
            <div className="sm:w-[70%] md:w-[40%] flex flex-col gap-4 w-full">
              <div>
                <Input
                  name="oldPassword"
                  type={showPassword ? "text" : "password"}
                  errorStyle={
                    formik.touched.oldPassword && formik.errors.oldPassword
                      ? true
                      : false
                  }
                  placeholder="Old password"
                  label="Old password"
                  {...formik.getFieldProps("oldPassword")}
                  showPassword={showPassword}
                  changeShowPasswordToFalse={() => {
                    setShowPassword(false);
                  }}
                  changeShowPasswordToTrue={() => {
                    setShowPassword(true);
                  }}
                ></Input>
                {formik.touched.oldPassword && formik.errors.oldPassword ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.oldPassword}
                  </span>
                ) : null}
              </div>

              <div>
                <Input
                  name="password1"
                  type={showPassword1 ? "text" : "password"}
                  errorStyle={
                    formik.touched.password1 && formik.errors.password1
                      ? true
                      : false
                  }
                  placeholder="New password"
                  label="New password"
                  {...formik.getFieldProps("password1")}
                  showPassword={showPassword1}
                  changeShowPasswordToFalse={() => {
                    setShowPassword1(false);
                  }}
                  changeShowPasswordToTrue={() => {
                    setShowPassword1(true);
                  }}
                ></Input>
                {formik.touched.password1 && formik.errors.password1 ? (
                  <span className="text-sm font-bold text-red-400">
                    {formik.errors.password1}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="w-full flex justify-between mt-5">
              <Button
                type="submit"
                disabled={loading}
                className={
                  "w-fit px-5 flex items-center gap-2 !py-3 !font-bold !bg-slate-800 !rounded-lg !text-base " +
                  (loading ? "opacity-60 cursor-not-allowed" : "")
                }
              >
                <span>Change password</span>
                <div>
                  {loading ? (
                    <LoadingSpinerChase
                      width={20}
                      height={20}
                    ></LoadingSpinerChase>
                  ) : (
                    ""
                  )}
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="md:fixed bottom-0 left-0 right-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

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

    return {
      props: {
        userProfile: response.data[0],
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login?redirect=/account",
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
