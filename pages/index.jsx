import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import axios from "axios";
import getToken from "../lib/getToken";
import { useRouter } from "next/router";
import { Mixpanel } from "../lib/mixpanelconfig";

import Navbar from "../components/ui/Navbar";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";
import Button from "../components/ui/Button";

import PopoverBox from "../components/ui/Popover";
import Link from "next/link";
import Search from "../components/Trip/Search";
import PopularLocationsDropdown from "../components/Lodging/PopularLocationsDropdown";
import CookiesMessage from "../components/Home/CookiesMessage";
import ContactBanner from "../components/Home/ContactBanner";
import SearchOptions from "../components/ui/SearchOptions";
import Dialogue from "../components/Home/Dialogue";
import { Icon } from "@iconify/react";

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

  const checkSearch = (location) => {
    if (router.query.search === "2") {
      Mixpanel.track("User interated with the search to the stays");
      router.push({
        pathname: "/stays",
        query: {
          search: location,
          page: "",
        },
      });
    } else if (router.query.search === "3") {
      Mixpanel.track("User interated with the search to the activities");
      router.push({
        pathname: "/activities",
        query: {
          search: location,
          page: "",
        },
      });
    } else {
      Mixpanel.track("User interated with the search to the curated trips");
      router.push({
        pathname: "/trip",
        query: {
          location: location,
          page: "",
        },
      });
    }
  };

  const search = (location) => {
    checkSearch((location = location));
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (location !== "") {
        checkSearch((location = location));
      }
    }
  };

  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    if (process.browser) {
      setScreenWidth(window.innerWidth);
      window.onresize = () => {
        setScreenWidth(window.innerWidth);
      };
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      let iteration = 1;
      const video = document.getElementsByTagName("video")[0];
      video.addEventListener(
        "ended",
        function () {
          if (iteration < 2) {
            console.log("Played");
            this.currentTime = 0;
            this.play();
            iteration++;
          }
        },
        false
      );
    }
  }, []);

  return (
    <div
      className="relative"
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
      {/* <ContactBanner></ContactBanner> */}

      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <Navbar userProfile={userProfile}></Navbar>
      </div>

      <div className="mb-12 select-none relative">
        <div className="w-full text-red-600 h-[500px] md:h-[600px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full absolute inset-0 object-cover object-center"
            id="video"
          >
            <source src="videos/winda.webm" type="video/webm"></source>
            <source src="videos/winda.mp4" type="video/mp4"></source>
            <Image
              className={"w-full "}
              layout="fill"
              objectFit="cover"
              src="/images/image-header.jpg"
              objectPosition={"bottom"}
              sizes="380"
              alt="Image of samburu man looking at a vast landscape"
              unoptimized={true}
              priority
            />
          </video>

          <div className="flex flex-col items-center justify-center absolute w-full text-center top-[40%] md:top-[40%] z-20 px-6 md:px-0">
            <div className="flex flex-col items-center">
              <h1 className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase text-center">
                Control your journey
              </h1>
              <h3 className="font-bold font-OpenSans mb-8 text-base md:hidden sm:text-xl text-white text-center">
                Plan and book your trip easily anywhere across Africa.
              </h3>

              <h3 className="font-bold w-[80%] font-OpenSans mb-8 text-base hidden md:block sm:text-xl text-white text-center">
                We&apos;re local travel experts who empower you to plan and book
                your trips anywhere across Kenya. Browse through our curated
                trips and book your dream trip today.
              </h3>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowLocation(!showLocation);
              }}
              className="!w-[100%] sm:!max-w-[700px] mb-5 relative text-black"
            >
              <Search
                inputBoxClassName={
                  "!border-none !py-0 !h-[60px] w-full mx-auto !z-[40] bg-white " +
                  (showLocation && !location
                    ? "md:!rounded-b-none md:!rounded-t-3xl !rounded-full "
                    : "!rounded-full ")
                }
                inputClassName="!h-[60px] placeholder:text-black !rounded-full "
                autoCompleteSearchClassName="!rounded-t-3xl !rounded-b-none"
                searchClass="w-full "
                showSearchBtn={screenWidth >= 768 ? true : false}
                iconContainerClassName="!w-[60px] text-red-600"
                autoCompleteClassName="!rounded-b-3xl"
                location={location}
                handlePropagation={() => {}}
                placeholder="Where to?"
                setLocation={setLocation}
                search={search}
                onKeyDown={keyDownSearch}
                showSearchOptions={true}
              ></Search>

              {showLocation && !location && (
                <div className="bg-white hidden md:block">
                  <div className="border-t py-1.5">
                    <SearchOptions></SearchOptions>
                  </div>
                  <PopularLocationsDropdown
                    setLocation={(location) => {
                      setLocation(location);
                      search(location);
                    }}
                    className="w-[100%] !text-black rounded-b-3xl !z-[40] !text-left"
                  ></PopularLocationsDropdown>
                </div>
              )}
            </div>
          </div>
        </div>

        {screenWidth < 768 && (
          <Dialogue
            isOpen={showLocation}
            closeModal={() => {
              setShowLocation(false);
            }}
            dialogueTitleClassName="!font-bold"
            outsideDialogueClass="!p-0"
            backgroundClassName=""
            panelBackgroundClassName=""
            dialoguePanelClassName="h-screen !p-0 !rounded-none w-full overflow-y-scroll remove-scroll"
          >
            <div className="h-full">
              <div
                onClick={() => {
                  setShowLocation(false);
                }}
                className="w-full py-2 bg-black text-white bg-opacity-50 cursor-pointer flex items-center justify-center gap-1"
              >
                <Icon icon="icon-park-outline:close-one" className="mt-0.5" />
                <span className="font-bold">close</span>
              </div>

              <div className="mt-2 ">
                <Search
                  inputBoxClassName={
                    "!border !py-0 !h-[60px] w-full mx-auto !z-[40] bg-white !rounded-none "
                  }
                  inputClassName="!h-[55px] placeholder:text-black !rounded-full "
                  autoCompleteSearchClassName="!rounded-none !rounded-b-none"
                  searchClass="w-full "
                  // showSearchBtn={true}
                  iconContainerClassName="!w-[60px] text-red-600"
                  autoCompleteClassName="!rounded-b-3xl"
                  location={location}
                  handlePropagation={() => {}}
                  placeholder="Where to?"
                  setLocation={setLocation}
                  search={search}
                  onKeyDown={keyDownSearch}
                  showSearchOptions={true}
                ></Search>

                {showLocation && !location && (
                  <div className="bg-white mt-2">
                    <div className="border-t py-1.5">
                      <SearchOptions></SearchOptions>
                    </div>
                    <PopularLocationsDropdown
                      setLocation={(location) => {
                        setLocation(location);
                        search(location);
                      }}
                      className="w-[100%] !static !text-black rounded-b-3xl !z-[40] !text-left"
                    ></PopularLocationsDropdown>
                  </div>
                )}
              </div>
            </div>
          </Dialogue>
        )}

        {/* <div className="absolute top-4 w-full z-50">
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
        </div> */}
      </div>

      <div className="md:mt-16 mb-8 2xl:w-4/6 2xl:mx-auto">
        <Main></Main>
      </div>

      <div className="mt-14">
        <Footer></Footer>
      </div>

      <CookiesMessage></CookiesMessage>
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
