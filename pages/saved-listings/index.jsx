import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";
import Steps from "rc-steps";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "rc-steps/assets/index.css";

import Input from "../../components/ui/Input";
import getToken from "../../lib/getToken";
import getTokenFromReq from "../../lib/getTokenFromReq";
import getCart from "../../lib/getCart";
import Navbar from "../../components/Stay/Navbar";
import CartItem from "../../components/Cart/CartItem";
import Button from "../../components/ui/Button";
import styles from "../../styles/Cart.module.css";
import OrderItem from "../../components/Cart/OrderItem";
import ModalPopup from "../../components/ui/ModalPopup";
import Map from "../../components/Order/Map";
import { priceConversionRateFunc } from "../../lib/PriceRate";
import ClientOnly from "../../components/ClientOnly";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import OrderItemActivities from "../../components/Cart/OrderItemActivities";
import ResponsiveModal from "../../components/ui/ResponsiveModal";
import Destination from "../../components/Order/Destination";
import { reorder } from "../../lib/random";
import Modal from "../../components/ui/MobileModal";
import TripOverview from "../../components/Order/TripOverview";
import Popup from "../../components/ui/Popup";
import moment from "moment";
import OrderCard from "../../components/Order/OrderCard";
import Trip from "../../components/Order/Trip";
import TransportTrip from "../../components/Order/TransportTrip";
import Footer from "../../components/Home/Footer";
import Listing from "../../components/SavedListings/Listing";
import PopoverBox from "../../components/ui/Popover";

function SavedListings({
  userProfile,
  savedStays,
  savedActivities,
  savedTransport,
}) {
  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const currencyToKES = useSelector((state) => state.home.currencyToKES);
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const router = useRouter();

  return (
    <>
      <div>
        {savedStays.length === 0 &&
          savedActivities.length === 0 &&
          savedTransport.length === 0 && (
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
              <div className="px-4 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
                <div className="mb-8 mt-4 ml-4 text-xl font-bold">
                  Your saved listings
                </div>
                <div className="flex flex-col items-center mb-12">
                  <div className="text-center mt-4 font-bold">
                    No item in here. Don&apos;t worry.
                  </div>
                  <PopoverBox
                    btnPopover={
                      <div className="flex gap-1 items-center justify-center text-blue-800 hover:text-blue-900 transition-all duration-300">
                        <span className="font-bold text-center">
                          explore all our services
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mt-0.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    }
                    panelClassName="mt-2 w-[230px] shadow-all md:w-[250px] bg-white rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() => {
                        router.push("/stays");
                      }}
                      className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                    >
                      Stays
                    </div>
                    <div
                      onClick={() => {
                        router.push("/experiences");
                      }}
                      className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                    >
                      Experiences
                    </div>
                    <div
                      onClick={() => {
                        router.push("/transport");
                      }}
                      className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                    >
                      Transport
                    </div>
                    <div
                      onClick={() => {
                        router.push("/trip");
                      }}
                      className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                    >
                      Curated trips
                    </div>
                  </PopoverBox>
                </div>
              </div>
              <Footer></Footer>
            </div>
          )}
      </div>

      <div>
        {(savedStays.length > 0 ||
          savedActivities.length > 0 ||
          savedTransport.length > 0) && (
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

            <div className="px-2 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
              {savedStays.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Stays - Your saved stays({savedStays.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 gap-4">
                {savedStays.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        router.push(`/stays/${item.stay.slug}`);
                      }}
                      className="md:w-[31%] w-full"
                    >
                      <Listing
                        stayPage={true}
                        stay={item.stay}
                        stayId={item.id}
                      ></Listing>
                    </div>
                  );
                })}
              </div>

              {savedActivities.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Experiences - Your saved experiences({savedActivities.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 gap-4">
                {savedActivities.map((item, index) => (
                  <div
                    onClick={() => {
                      router.push(`/experiences/${item.activity.slug}`);
                    }}
                    key={index}
                    className="md:w-[31%] w-full"
                  >
                    <Listing
                      activitiesPage={true}
                      activity={item.activity}
                      activityId={item.id}
                    ></Listing>
                  </div>
                ))}
              </div>

              {savedTransport.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Transport - Your saved transports({savedTransport.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 gap-4">
                {savedTransport.map((item, index) => (
                  <div
                    onClick={() => {
                      router.push(`/transport/${item.transport.slug}`);
                    }}
                    key={index}
                    className="md:w-[31%] w-full"
                  >
                    <Listing
                      transportPage={true}
                      transport={item.transport}
                      transportId={item.id}
                    ></Listing>
                  </div>
                ))}
              </div>
            </div>

            <Footer></Footer>
          </div>
        )}
      </div>
    </>
  );
}

SavedListings.propTypes = {};

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
      `${process.env.NEXT_PUBLIC_baseURL}/user-saved-stays/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const savedActivities = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-saved-activities/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const savedTransport = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-saved-transports/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        savedStays: data.results,
        savedActivities: savedActivities.data.results,
        savedTransport: savedTransport.data.results,
      },
    };
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          savedActivities: [],
          savedTransport: [],
          savedStays: [],
        },
      };
    }
  }
}

export default SavedListings;
