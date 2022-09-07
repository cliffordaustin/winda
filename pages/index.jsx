import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import axios from "axios";
import getToken from "../lib/getToken";
import { useRouter } from "next/router";

import Navbar from "../components/Home/InHeaderNavbar";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";
import Button from "../components/ui/Button";

import PopoverBox from "../components/ui/Popover";
import Link from "next/link";
import Search from "../components/Trip/Search";
import PopularLocationsDropdown from "../components/Lodging/PopularLocationsDropdown";

export default function Home({ userProfile }) {
  const router = useRouter();

  const [state, setState] = useState({
    showDropdown: false,
    activityDate: "",
    travelers: 0,
    passengers: 0,
    checkin: "",
    checkout: "",
    transportDate: "",
    showTransportDate: false,
    showCheckInDate: false,
    showCheckOutDate: false,
    showActivityDate: false,
    numOfAdults: 0,
    numOfChildren: 0,
    numOfInfants: 0,
    showPopup: false,
    showPassengerPopup: false,
    currentNavState: 1,
    showNeedADriver: false,
    needADriver: false,
    showTravelersPopup: false,
    selectedSearchItem: 0,
    selectedTransportSearchItem: 0,
    selectedActivitiesSearchItem: 0,
    showSearchModal: false,
    windowSize: 0,
  });

  useEffect(() => {
    if (process.browser) {
      setState({
        ...state,
        windowSize: window.innerWidth,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (process.browser) {
      window.onresize = function () {
        setState({ ...state, windowSize: window.innerWidth });
      };
    }
  }, []);

  useEffect(() => {
    if (state.windowSize >= 768) {
      setState({
        ...state,
        showSearchModal: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.windowSize]);

  const variants = {
    hide: {
      opacity: 0.2,
      y: -15,
      transition: {},
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {},
    },
  };

  const [showBookServiceDropdown, setShowBookServiceDropdown] = useState(false);

  const [location, setLocation] = useState("");

  const search = (location) => {
    router.push({
      pathname: "/trip",
      query: {
        ...router.query,
        location: location,
        page: "",
      },
    });
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (location !== "") {
        router.push({
          pathname: "/trip",
          query: {
            ...router.query,
            location: location,
            page: "",
          },
        });
      }
    }
  };

  const [showLocation, setShowLocation] = useState(false);

  return (
    <div
      className="overflow-x-hidden relative"
      onClick={() => {
        setState({
          ...state,
          showDropdown: false,
          showCheckInDate: false,
          showCheckOutDate: false,
          showPopup: false,
          showTransportDate: false,
          showPassengerPopup: false,
          showActivityDate: false,
          showTravelersPopup: false,
          selectedSearchItem: 0,
          selectedTransportSearchItem: 0,
          selectedActivitiesSearchItem: 0,
          showNeedADriver: false,
          showSearchModal: false,
        });
        setShowBookServiceDropdown(false);
        setShowLocation(false);
      }}
    >
      <div className="">
        <Head>
          <title>Winda.guide | book travel essentials in Kenya</title>
          <meta
            name="description"
            content="Search, discover, and book your travel needs in Kenya, all in one place. Try it now."
          ></meta>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
      </div>

      <div className="mb-12 select-none relative">
        <div className="w-full text-red-600 h-[600px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
          <Image
            className={"w-full"}
            layout="fill"
            objectFit="cover"
            src="/images/image-header.jpg"
            objectPosition={"bottom"}
            sizes="380"
            alt="Image of samburu man looking at a vast landscape"
            unoptimized={true}
            priority
          />

          <div className="flex flex-col items-center justify-center absolute w-full text-center top-[40%] z-20 px-6 md:px-0">
            <div className="flex flex-col items-center">
              <div className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase text-center">
                Control your journey
              </div>
              <h1 className="font-bold font-OpenSans mb-8 text-base md:hidden sm:text-xl text-white text-center">
                Plan and book your trip easily anywhere across Africa.
              </h1>

              <div className="font-bold w-[80%] font-OpenSans mb-8 text-base hidden md:block sm:text-xl text-white text-center">
                We&apos;re local travel experts who empower you to plan and book
                your trips anywhere across Kenya. Browse through our curated
                trips and book your dream trip today.
              </div>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowLocation(!showLocation);
              }}
              className="!w-[90%] sm:!w-[420px] mb-5 relative text-black"
            >
              <Search
                inputBoxClassName={
                  "!border-none !py-4 !z-[40] bg-white " +
                  (showLocation ? "!rounded-b-none " : "!rounded-md ")
                }
                searchClass="w-full"
                location={location}
                handlePropagation={() => {}}
                placeholder="Where to?"
                setLocation={setLocation}
                search={search}
                onKeyDown={keyDownSearch}
              ></Search>

              {showLocation && !location && (
                <PopularLocationsDropdown
                  setLocation={(location) => {
                    setLocation(location);
                    search(location);
                  }}
                  className="w-[100%] !text-black !z-[40] !text-left"
                ></PopularLocationsDropdown>
              )}
            </div>

            <div className="flex gap-2">
              <Link href="/trip">
                <a>
                  <Button className="flex items-center gap-4 max-w-[360px] !py-3 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                    <span className="font-bold">View all curated trips</span>
                  </Button>
                </a>
              </Link>

              {/* <PopoverBox
                btnPopover={
                  <>
                    <span className="font-bold text-black text-sm">
                      Book a service
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-black"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                }
                panelClassName="mt-2 w-[150px] text-left md:w-[250px] bg-white rounded-lg overflow-hidden"
                btnClassName="flex relative items-center gap-2 px-3 rounded-md py-3 bg-white"
              >
                <Link href="/stays">
                  <a>
                    <div className="hover:bg-gray-100 text-gray-700 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
                      Stays
                    </div>
                  </a>
                </Link>

                <Link href="/activities">
                  <a>
                    <div className="hover:bg-gray-100 text-gray-700 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
                      Activities
                    </div>
                  </a>
                </Link>

                <Link href="/transport">
                  <a>
                    <div className="hover:bg-gray-100 text-gray-700 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2">
                      Transport
                    </div>
                  </a>
                </Link>
              </PopoverBox> */}
            </div>
          </div>
        </div>
        <div className="absolute top-4 w-full z-50">
          <Navbar
            showDropdown={state.showDropdown}
            userProfile={userProfile}
            currentNavState={state.currentNavState}
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
            isHomePage={true}
          ></Navbar>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-[30]">
        <Link href="/trip/request-trip">
          <a>
            <div className="!border-none px-3 py-3 font-bold text-sm cursor-pointer !rounded-md !bg-gradient-to-r bg-slate-700 !text-white">
              Talk to a travel expert
            </div>
          </a>
        </Link>
      </div>

      <div className="md:mt-16 mb-8 2xl:w-4/6 2xl:mx-auto">
        <Main></Main>
      </div>

      <div className="mt-14">
        <Footer></Footer>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

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
        },
      };
    }

    return {
      props: {
        userProfile: "",
      },
      // statusCode: error.response.statusCode,
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
        },
        // statusCode: error.response.statusCode,
      };
    }
  }
}
