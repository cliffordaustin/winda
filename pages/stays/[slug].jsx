import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

// import { getServerSideProps } from "../../lib/getServerSideProps";
import Navbar from "../../components/Stay/Navbar";
import ImageGallery from "../../components/Stay/ImageGallery";
import Price from "../../components/Stay/Price";
import Button from "../../components/ui/Button";
import getToken from "../../lib/getToken";

const StaysDetail = ({ userProfile, stay }) => {
  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const dispatch = useDispatch();

  const priceConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/kes",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.USD,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    priceConversionRate();
  });

  return (
    <div>
      <Navbar
        showDropdown={state.showDropdown}
        currentNavState={state.currentNavState}
        userProfile={userProfile}
        showSearchModal={() => {
          setState({ ...state, showSearchModal: true });
        }}
        setCurrentNavState={(currentNavState) => {
          setState({
            ...state,
            currentNavState: currentNavState,
            showCheckOutDate: false,
            showCheckInDate: false,
            showPopup: false,
          });
        }}
        changeShowDropdown={() =>
          setState({
            ...state,
            showDropdown: !state.showDropdown,
          })
        }
      ></Navbar>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setState({ ...state, showSearchModal: true });
        }}
        className={"w-5/6 mx-auto lg:hidden cursor-pointer "}
      >
        <div className="flex items-center justify-center gap-2 !px-2 !py-2 !bg-gray-100 w-full rounded-full text-center ml-1 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
              clipRule="evenodd"
            />
          </svg>
          <div>Nairobi</div>
        </div>
      </div>
      <div className="w-[85%] mx-auto">
        <ImageGallery
          images={stay.stay_images}
          stayType={stay.type_of_stay}
        ></ImageGallery>
        <div className="flex px-10 mt-4">
          <div className="flex flex-col w-[70%]">
            <div className="text-2xl font-bold">{stay.name}</div>
            <div className="text-lg font-medium">{stay.location}</div>
            <div className="text-gray-500 flex gap-2 text-sm truncate mt-3 flex-wrap">
              {stay.capacity && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                    />
                    <path
                      fill="currentColor"
                      d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                    />
                    <path
                      fill="currentColor"
                      d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                    />
                    <path
                      fill="currentColor"
                      d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                    />
                    <circle
                      cx="17.87"
                      cy="13.45"
                      r="4.47"
                      fill="currentColor"
                    />
                    <path
                      fill="currentColor"
                      d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  <span>{stay.capacity} Guests</span>
                </div>
              )}
              {stay.rooms && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                    />
                  </svg>

                  <span>{stay.rooms} rm</span>
                </div>
              )}

              {stay.beds && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
                  </svg>
                  <span>{stay.beds} bd</span>
                </div>
              )}

              {stay.bathrooms && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                  </svg>{" "}
                  <span>{stay.bathrooms} ba</span>
                </div>
              )}
            </div>
          </div>
          <div className="w-[30%]">
            <div className="flex flex-col items-end">
              <Price stayPrice={stay.price}></Price>
              <div className="flex items-center mt-2 justify-between self-start w-full">
                <Button className="!bg-blue-800 !w-[80px] !border-2 border-blue-800">
                  Book
                </Button>
                <Button className="!bg-transparent !w-[185px] !text-black !border-2 border-blue-800">
                  Add to cart
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StaysDetail.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const stay = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${context.query.slug}/`
    );

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
          stay: stay.data,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        stay: stay.data,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          stay: "",
        },
      };
    }
  }
}

export default StaysDetail;