import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";
import axios from "axios";
import getToken from "../lib/getToken";
import { useRouter } from "next/router";

import Navbar from "../components/Home/InHeaderNavbar";
import Search from "../components/Home/Search";
import TransportSearch from "../components/Home/TransportSearch";
import ActivitiesSearch from "../components/Home/ActivitiesSearch";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";
import Button from "../components/ui/Button";

import SearchSelect from "../components/Home/SearchSelect";

import MobileModal from "../components/ui/MobileModal";

import PopoverBox from "../components/ui/Popover";

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

  const searchRef = useRef(null);

  const turnOffAllPopup = {
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
  };

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

  const [autoCompleteFromSearch, setAutoCompleteFromSearch] = useState([]);

  const [location, setLocation] = useState("");

  const [activityLocation, setActivityLocation] = useState("");

  const [showSearchLoader, setShowSearchLoader] = useState(false);

  const [showActivityLoader, setShowActivityLoader] = useState(false);

  const [autoCompleteFromActivitySearch, setAutoCompleteFromActivitySearch] =
    useState([]);

  const onChange = (event) => {
    setLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromSearch(response.data.features);
      });
  };

  const onActivityChange = (event) => {
    setActivityLocation(event.target.value);

    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&autocomplete=true&country=ke,ug,tz,rw,bi,tz,ug,tz,sa,gh`
      )
      .then((response) => {
        setAutoCompleteFromActivitySearch(response.data.features);
      });
  };

  const locationFromSearch = (item) => {
    setLocation(item.place_name);
    setAutoCompleteFromSearch([]);
  };

  const locationFromActivitySearch = (item) => {
    setActivityLocation(item.place_name);
    setAutoCompleteFromActivitySearch([]);
  };

  const apiSearchResult = () => {
    if (location !== "") {
      setShowSearchLoader(true);
      router
        .push({
          pathname: "/stays",
          query: { search: location },
        })
        .then(() => {
          setShowSearchLoader(false);
          router.reload();
        });
    }
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromSearch.length > 0) {
        setLocation(autoCompleteFromSearch[0].place_name);

        setAutoCompleteFromSearch([]);

        if (location !== "") {
          setShowSearchLoader(true);
          router
            .push({
              pathname: "/stays",
              query: { search: autoCompleteFromSearch[0].place_name },
            })
            .then(() => {
              setShowSearchLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const apiActivitySearchResult = () => {
    if (activityLocation !== "") {
      setShowActivityLoader(true);
      router
        .push({
          pathname: "/experiences",
          query: { search: activityLocation },
        })
        .then(() => {
          setShowActivityLoader(false);
          router.reload();
        });
    }
  };

  const keyDownActivitySearch = (event) => {
    if (event.key === "Enter") {
      if (autoCompleteFromActivitySearch.length > 0) {
        setActivityLocation(autoCompleteFromActivitySearch[0].place_name);

        setAutoCompleteFromActivitySearch([]);

        if (activityLocation !== "") {
          setShowActivityLoader(true);
          router
            .push({
              pathname: "/experiences",
              query: { search: autoCompleteFromActivitySearch[0].place_name },
            })
            .then(() => {
              setShowActivityLoader(false);
              router.reload();
            });
        }
      }
    }
  };

  const [typeOfCar, setTypeOfCar] = useState(null);

  const [showBookServiceDropdown, setShowBookServiceDropdown] = useState(false);
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
      }}
    >
      <div className="">
        <Head>
          <title>Winda.guide | online travel booking in Kenya</title>
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
      {state.windowSize < 768 && (
        <div>
          <MobileModal
            showModal={state.showSearchModal}
            closeModal={() => {
              setState({
                ...state,
                ...turnOffAllPopup,
                showSearchModal: false,
              });
            }}
            containerHeight={90}
            closeAllPopups={() => {
              setState({ ...state, ...turnOffAllPopup });
            }}
            title="Search"
          >
            <div className="flex justify-center mb-3 mt-6">
              <SearchSelect
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
              ></SearchSelect>
            </div>
            <div className="mt-1 w-full flex md:justify-center md:px-0 px-4">
              {state.currentNavState === 1 && (
                <motion.div
                  variants={variants}
                  animate={state.currentNavState === 1 ? "show" : ""}
                  initial="hide"
                  className="lg:w-4/6 md:w-11/12 w-full"
                >
                  <Search
                    location={location}
                    checkin={state.checkin}
                    onKeyDown={keyDownSearch}
                    showSearchLoader={showSearchLoader}
                    apiSearchResult={apiSearchResult}
                    locationFromSearch={(item) => {
                      locationFromSearch(item);
                    }}
                    selectedSearchItem={state.selectedSearchItem}
                    clearInput={() => {
                      setLocation("");
                    }}
                    clearCheckInDate={() => {
                      setState({ ...state, checkin: "" });
                    }}
                    clearCheckOutDate={() => {
                      setState({ ...state, checkout: "" });
                    }}
                    changeShowCheckInDate={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showCheckInDate: !state.showCheckInDate,
                        selectedSearchItem:
                          state.selectedSearchItem === 2 ? 0 : 2,
                      });
                    }}
                    setCheckInDate={(date) => {
                      state.checkout > date
                        ? setState({ ...state, checkin: date })
                        : setState({ ...state, checkout: "", checkin: date });
                    }}
                    showCheckInDate={state.showCheckInDate}
                    checkout={state.checkout}
                    changeShowCheckOutDate={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showCheckOutDate: !state.showCheckOutDate,
                        selectedSearchItem:
                          state.selectedSearchItem === 3 ? 0 : 3,
                      });
                    }}
                    changeSelectedSearchItem={(num) => {
                      setState({ ...state, selectedSearchItem: num });
                    }}
                    setCheckOutDate={(date) => {
                      setState({ ...state, checkout: date });
                    }}
                    showCheckOutDate={state.showCheckOutDate}
                    showPopup={state.showPopup}
                    autoCompleteFromSearch={autoCompleteFromSearch}
                    changeShowPopup={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showPopup: !state.showPopup,
                        selectedSearchItem:
                          state.selectedSearchItem === 4 ? 0 : 4,
                      });
                    }}
                    onChange={(event) => {
                      onChange(event);
                    }}
                    numOfAdults={state.numOfAdults}
                    numOfChildren={state.numOfChildren}
                    numOfInfants={state.numOfInfants}
                    addToAdults={() => {
                      console.log("add");
                      setState({
                        ...state,
                        numOfAdults: state.numOfAdults + 1,
                      });
                    }}
                    addToChildren={() => {
                      setState({
                        ...state,
                        numOfChildren: state.numOfChildren + 1,
                      });
                    }}
                    addToInfants={() => {
                      setState({
                        ...state,
                        numOfInfants: state.numOfInfants + 1,
                      });
                    }}
                    removeFromAdults={() => {
                      state.numOfAdults > 0
                        ? setState({
                            ...state,
                            numOfAdults: state.numOfAdults - 1,
                          })
                        : null;
                    }}
                    removeFromChildren={() => {
                      state.numOfChildren > 0
                        ? setState({
                            ...state,
                            numOfChildren: state.numOfChildren - 1,
                          })
                        : null;
                    }}
                    removeFromInfants={() => {
                      state.numOfInfants > 0
                        ? setState({
                            ...state,
                            numOfInfants: state.numOfInfants - 1,
                          })
                        : null;
                    }}
                    clearGuests={() => {
                      setState({
                        ...state,
                        numOfChildren: 0,
                        numOfInfants: 0,
                        numOfAdults: 0,
                      });
                    }}
                  ></Search>
                </motion.div>
              )}
              {state.currentNavState === 2 && (
                <motion.div
                  variants={variants}
                  animate={state.currentNavState === 2 ? "show" : ""}
                  initial="hide"
                  className="lg:w-4/6 md:w-11/12 w-full"
                >
                  <TransportSearch
                    typeOfCar={typeOfCar}
                    setTypeOfCar={setTypeOfCar}
                    transportDate={state.transportDate}
                    changeShowTransportDate={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showTransportDate: !state.showTransportDate,
                        selectedTransportSearchItem:
                          state.selectedTransportSearchItem === 1 ? 0 : 1,
                      });
                    }}
                    setTransportDate={(date) => {
                      setState({ ...state, transportDate: date });
                    }}
                    showTransportDate={state.showTransportDate}
                    showPassengerPopup={state.showPassengerPopup}
                    changeShowPassengerPopup={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showPassengerPopup: !state.showPassengerPopup,
                        selectedTransportSearchItem:
                          state.selectedTransportSearchItem === 2 ? 0 : 2,
                      });
                    }}
                    showNeedADriver={state.showNeedADriver}
                    changeShowNeedADriver={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showNeedADriver: !state.showNeedADriver,
                        selectedTransportSearchItem:
                          state.selectedTransportSearchItem === 3 ? 0 : 3,
                      });
                    }}
                    selectedTransportSearchItem={
                      state.selectedTransportSearchItem
                    }
                    clearTransportDate={() => {
                      setState({ ...state, transportDate: "" });
                    }}
                    clearPassengers={() => {
                      setState({ ...state, passengers: 0 });
                    }}
                    clearNeedADriver={() => {
                      setState({ ...state, needADriver: false });
                    }}
                    needADriver={state.needADriver}
                    changeNeedADriver={() => {
                      setState({
                        ...state,
                        needADriver: !state.needADriver,
                      });
                    }}
                    passengers={state.passengers}
                    addPassenger={() => {
                      setState({ ...state, passengers: state.passengers + 1 });
                    }}
                    removePassenger={() => {
                      state.passengers > 0
                        ? setState({
                            ...state,
                            passengers: state.passengers - 1,
                          })
                        : null;
                    }}
                  ></TransportSearch>
                </motion.div>
              )}
              {state.currentNavState === 3 && (
                <motion.div
                  variants={variants}
                  animate={state.currentNavState === 3 ? "show" : ""}
                  initial="hide"
                  className="lg:w-4/6 md:w-11/12 w-full"
                >
                  <ActivitiesSearch
                    autoCompleteFromActivitySearch={
                      autoCompleteFromActivitySearch
                    }
                    onKeyDown={keyDownActivitySearch}
                    showActivityLoader={showActivityLoader}
                    locationFromActivitySearch={(item) => {
                      locationFromActivitySearch(item);
                    }}
                    apiActivitySearchResult={apiActivitySearchResult}
                    activityLocation={activityLocation}
                    travelers={state.travelers}
                    activityDate={state.activityDate}
                    onChange={(event) => {
                      onActivityChange(event);
                    }}
                    changeSelectedActivitiesSearchItem={(num) => {
                      setState({ ...state, selectedActivitiesSearchItem: num });
                    }}
                    changeActivityDate={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showActivityDate: !state.showActivityDate,
                        selectedActivitiesSearchItem:
                          state.selectedActivitiesSearchItem === 2 ? 0 : 2,
                      });
                    }}
                    setActivityDate={(date) => {
                      setState({ ...state, activityDate: date });
                    }}
                    showActivityDate={state.showActivityDate}
                    showTravelersPopup={state.showTravelersPopup}
                    changeShowTravelersPopup={() => {
                      setState({
                        ...state,
                        ...turnOffAllPopup,
                        showTravelersPopup: !state.showTravelersPopup,
                        selectedActivitiesSearchItem:
                          state.selectedActivitiesSearchItem === 3 ? 0 : 3,
                      });
                    }}
                    selectedActivitiesSearchItem={
                      state.selectedActivitiesSearchItem
                    }
                    clearLocationInput={() => {
                      setActivityLocation("");
                    }}
                    clearActivityDate={() => {
                      setState({ ...state, activityDate: "" });
                    }}
                    clearTravelers={() => {
                      setState({ ...state, travelers: 0 });
                    }}
                    addTraveler={() => {
                      setState({ ...state, travelers: state.travelers + 1 });
                    }}
                    removeTraveler={() => {
                      state.travelers > 0
                        ? setState({ ...state, travelers: state.travelers - 1 })
                        : null;
                    }}
                  ></ActivitiesSearch>
                </motion.div>
              )}
            </div>
          </MobileModal>
        </div>
      )}
      <div className="mb-12 select-none relative">
        <div className="w-full h-[600px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
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
            <div>
              <div className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase text-center">
                Control your journey
              </div>
              <h1 className="font-bold font-OpenSans mb-8 text-base sm:text-xl text-white text-center">
                Plan and book your trip easily anywhere across Africa.
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  router.push("/trip");
                }}
                className="flex items-center gap-4 w-36 !py-3 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
              >
                <span className="font-bold">Curated trips</span>
              </Button>

              <PopoverBox
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
              </PopoverBox>
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
