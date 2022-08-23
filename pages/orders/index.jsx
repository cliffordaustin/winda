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

function Orders({
  userProfile,
  stayOrders,
  activitiesOrders,
  transportOrders,
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

  const [newPrice, setNewPrice] = useState(null);

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToKES && priceConversionRate) {
        setNewPrice(priceConversionRate * price);
      } else {
        setNewPrice(price);
      }
    } else {
      return null;
    }
  };

  const priceOfTransportCart = (item) => {
    let price = 0;
    if (Cookies.get("token")) {
      if (!item.number_of_days) {
        price +=
          ((item.distance * 0.001).toFixed(1) / 10) * item.transport.price +
          (item.user_need_a_driver
            ? item.transport.additional_price_with_a_driver
            : 0);
      } else if (item.number_of_days) {
        price +=
          item.number_of_days * item.transport.price_per_day +
          (item.user_need_a_driver
            ? item.transport.additional_price_with_a_driver *
              item.number_of_days
            : 0);
      }
    } else if (!Cookies.get("token") && Cookies.get("cart")) {
      if (!item.number_of_days) {
        price +=
          ((item.distance * 0.001).toFixed(1) / 10) * item.price +
          (item.user_need_a_driver ? item.additional_price_with_a_driver : 0);
      } else if (item.number_of_days) {
        price +=
          item.number_of_days * item.price_per_day +
          (item.user_need_a_driver
            ? item.additional_price_with_a_driver * item.number_of_days
            : 0);
      }
    }
    return price;
  };

  return (
    <>
      <div>
        {stayOrders.length === 0 &&
          activitiesOrders.length === 0 &&
          transportOrders.length === 0 && (
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
                  Your orders
                </div>
                <div className="flex flex-col items-center mb-12">
                  <div className="w-[90%] sm:w-[80%] md:w-[480px] h-[20rem] relative">
                    <Image
                      className="w-full h-full rounded-xl"
                      layout="fill"
                      src="/images/nocart-illustration.jpeg"
                      unoptimized={true}
                      alt="Image"
                    ></Image>
                  </div>
                  <div className="text-center mt-4 font-bold">
                    No item in here. Don&apos;t worry.
                  </div>
                  <Link href="/stays">
                    <a className="font-bold text-center text-blue-800 hover:text-blue-900 transition-all duration-300">
                      check these listings out
                    </a>
                  </Link>
                </div>
              </div>
              <Footer></Footer>
            </div>
          )}
      </div>

      <div>
        {(stayOrders.length > 0 ||
          activitiesOrders.length > 0 ||
          transportOrders.length > 0) && (
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
              {stayOrders.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Stays - Your Orders({stayOrders.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 justify-between">
                {stayOrders.map((item, index) => {
                  return (
                    <div key={index} className="md:w-[50%] w-full">
                      <CartItem
                        cartId={item.id}
                        stay={item.stay}
                        from_date={item.from_date}
                        to_date={item.to_date}
                        num_of_adults={item.num_of_adults}
                        num_of_children={item.num_of_children}
                        num_of_children_non_resident={
                          item.num_of_children_non_resident
                        }
                        num_of_adults_non_resident={
                          item.num_of_adults_non_resident
                        }
                        plan={item.plan}
                        stayPage={true}
                        forOrder={true}
                      ></CartItem>
                    </div>
                  );
                })}
              </div>

              {activitiesOrders.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Experiences - Your Orders({activitiesOrders.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 justify-between">
                {activitiesOrders.map((item, index) => (
                  <div key={index} className="md:w-[50%] w-full">
                    <CartItem
                      cartId={item.id}
                      from_date={item.from_date}
                      number_of_people={item.number_of_people}
                      number_of_people_non_resident={
                        item.number_of_people_non_resident
                      }
                      number_of_sessions={item.number_of_sessions}
                      number_of_sessions_non_resident={
                        item.number_of_sessions_non_resident
                      }
                      number_of_groups={item.number_of_groups}
                      number_of_groups_non_resident={
                        item.number_of_groups_non_resident
                      }
                      pricing_type={item.pricing_type}
                      activity={item.activity}
                      activitiesPage={true}
                      forOrder={true}
                    ></CartItem>
                  </div>
                ))}
              </div>

              {transportOrders.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Transport - Your Orders({transportOrders.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 justify-between">
                {transportOrders.map((item, index) => (
                  <div key={index} className="md:w-[50%] w-full">
                    <CartItem
                      cartId={item.id}
                      transport={item.transport}
                      transportPage={true}
                      transportDistance={item.distance}
                      transportFromDate={item.from_date}
                      numberOfDays={item.number_of_days}
                      userNeedADriver={item.user_need_a_driver}
                      transportDestination={item.destination}
                      transportStartingPoint={item.starting_point}
                      transportPrice={priceOfTransportCart(item)}
                      forOrder={true}
                    ></CartItem>
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

Orders.propTypes = {};

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
      `${process.env.NEXT_PUBLIC_baseURL}/user-orders/paid/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const activitiesOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/paid/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const transportOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-orders/paid/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        stayOrders: data.results,
        activitiesOrders: activitiesOrders.data.results,
        transportOrders: transportOrders.data.results,
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
          activitiesOrders: [],
          transportOrders: [],
          stayOrders: [],
        },
      };
    }
  }
}

export default Orders;
