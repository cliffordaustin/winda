import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Image from "next/image";

import getToken from "../../lib/getToken";
import Navbar from "../../components/Stay/Navbar";
import CartItem from "../../components/Cart/CartItem";
import Footer from "../../components/Home/Footer";
import Dialogue from "../../components/Home/Dialogue";
import FlightItem from "../../components/Cart/FlightItem";
import ContactBanner from "../../components/Home/ContactBanner";

function Orders({
  userProfile,
  stayOrders,
  activitiesOrders,
  transportOrders,
  flightCart,
}) {
  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 0,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

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

  const router = useRouter();

  return (
    <div className="relative">
      <div>
        {stayOrders.length === 0 &&
          activitiesOrders.length === 0 &&
          transportOrders.length === 0 &&
          flightCart.length === 0 && (
            <div>
              {/* <ContactBanner></ContactBanner> */}
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
            </div>
          )}
      </div>

      <div className="mb-24">
        {(stayOrders.length > 0 ||
          activitiesOrders.length > 0 ||
          transportOrders.length > 0 ||
          flightCart.length > 0) && (
          <div>
            {/* <ContactBanner></ContactBanner> */}
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
                        order={item}
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
                  Activities - Your Orders({activitiesOrders.length})
                </div>
              )}
              <div className="flex flex-wrap mb-5 justify-between">
                {activitiesOrders.map((item, index) => (
                  <div key={index} className="md:w-[50%] w-full">
                    <CartItem
                      cartId={item.id}
                      order={item}
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
                      order={item}
                      transportPage={true}
                      transportDistance={item.distance}
                      transportFromDate={item.from_date}
                      numberOfDays={item.number_of_days}
                      userNeedADriver={item.user_need_a_driver}
                      transportDestination={item.destination}
                      transportStartingPoint={item.starting_point}
                      transportPrice={priceOfTransportCart(item)}
                    ></CartItem>
                  </div>
                ))}
              </div>

              {flightCart.length > 0 && (
                <div className="mb-4 mt-2 ml-4 text-lg font-bold">
                  Flight - Your Basket({flightCart.length})
                </div>
              )}

              <div className="flex flex-wrap mb-5 justify-between">
                {flightCart.map((item, index) => (
                  <div key={index} className="md:w-[50%] w-full">
                    <FlightItem flight={item} forOrder={true}></FlightItem>
                  </div>
                ))}
              </div>

              <Dialogue
                isOpen={router.query.show_checkout_message === "1"}
                closeModal={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        show_checkout_message: "0",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                dialoguePanelClassName="!max-w-md !h-[230px]"
                title={"Thank you for booking with Winda!"}
                dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
              >
                <div>
                  We’ll get back to you via your email -{" "}
                  <span className="font-bold">{userProfile.email}</span> in{" "}
                  <span className="font-bold">24 hours</span> with confirmation
                  details.
                </div>

                <div className="mt-6">
                  &quot;Wherever you go, go with your heart. 🦒&quot;
                </div>

                <div></div>
              </Dialogue>

              <Dialogue
                isOpen={router.query.show_checkout_message === "2"}
                closeModal={() => {
                  router.replace(
                    {
                      query: {
                        ...router.query,
                        show_checkout_message: "0",
                      },
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                dialoguePanelClassName="!max-w-md !h-[230px]"
                title={"Thank you for booking with Winda!"}
                dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
              >
                <div>
                  We’ll get back to you via your email -{" "}
                  <span className="font-bold">{userProfile.email}</span> in{" "}
                  <span className="font-bold">24 hours</span> with confirmation
                  details and payment instructions.
                </div>

                <div className="mt-6">
                  &quot;Wherever you go, go with your heart. 🦒&quot;
                </div>

                <div></div>
              </Dialogue>
            </div>
          </div>
        )}
      </div>

      <div className="fixed left-0 right-0 bottom-0">
        <Footer></Footer>
      </div>
    </div>
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
      `${process.env.NEXT_PUBLIC_baseURL}/user-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const activitiesOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const transportOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-orders/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const flightCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-flight-orders/`,
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
        flightCart: flightCart.data.results,
      },
    };
  } catch (error) {
    console.log(error.response.data);
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/login?redirect=/orders",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          activitiesOrders: [],
          transportOrders: [],
          stayOrders: [],
          flightCart: [],
        },
      };
    }
  }
}

export default Orders;
