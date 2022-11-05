import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import ReactPaginate from "react-paginate";

import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Search from "../../components/Trip/Search";
import Footer from "../../components/Home/Footer";
import UserDropdown from "../../components/Home/UserDropdown";
import Button from "../../components/ui/Button";

import { getRecommendeTripUrl } from "../../lib/url";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import AllTrips from "../../components/Trip/Trips";
import Cookies from "js-cookie";
import getToken from "../../lib/getToken";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import SingleTrip from "../../components/Trip/SingleTrip";

import { Icon } from "@iconify/react";
import Dropdown from "../../components/ui/Dropdown";
import Tags from "../../components/Trip/Tags";
import Dialogue from "../../components/Home/Dialogue";
import PopularLocationsDropdown from "../../components/Lodging/PopularLocationsDropdown";
import ContactBanner from "../../components/Home/ContactBanner";
import Navbar from "../../components/ui/Navbar";
import TravelConciergeBanner from "../../components/Home/TravelConciergeBanner";
import { is } from "date-fns/locale";

const Trips = ({
  userProfile,
  recommendedTrips,
  secondTrips,
  userTrips,
  pageSize,
  count,
  nextLink,
  previousLink,
  totalPages,
}) => {
  const dispatch = useDispatch();

  const [location, setLocation] = useState("");

  const [autoComplete, setAutoComplete] = useState([]);

  const router = useRouter();

  const [showAddToTripPopup, setShowAddToTripPopup] = useState(false);

  const [selectedData, setSelectedData] = useState(null);

  const [addToYourNewTripLoading, setAddToYourNewTripLoading] = useState(false);

  const [showLocation, setShowLocation] = useState(false);

  const priceConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/usd",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch({
        type: "SET_PRICE_CONVERSION",
        payload: data.rates.KES,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    priceConversionRate();
  });

  const addToANewTrip = async () => {
    if (selectedData) {
      setAddToYourNewTripLoading(true);
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/create-trip/`,
          {
            stay_id: selectedData.stay_id,
            activity_id: selectedData.activity_id,
            transport_id: selectedData.transport_id,
            flight_id: selectedData.flight_id,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          router.push({
            pathname: `/trip/plan/${res.data.slug}`,
          });
        })
        .catch((err) => {
          console.log(err.response);
          setAddToYourNewTripLoading(false);
        });
    }
  };

  const [showPricePopup, setShowPricePopup] = useState(false);

  const search = (location) => {
    router.push({
      query: {
        ...router.query,
        location: location,
        page: "",
      },
    });
  };

  const handlePageClick = (event) => {
    router.push({
      query: {
        ...router.query,
        page: event.selected + 1,
      },
    });
  };

  const keyDownSearch = (event) => {
    if (event.key === "Enter") {
      if (location !== "") {
        router.push({
          query: {
            ...router.query,
            location: location,
            page: "",
          },
        });
      }
    }
  };

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleUnCheck = (value) => {
    var updatedList = [...currentOptions];

    updatedList.splice(currentOptions.indexOf(value), 1);

    const allOptions = updatedList
      .toString()
      .replace("[", "") // remove [
      .replace("]", "") // remove ]
      .trim(); // remove all white space

    router.push({ query: { ...router.query, tag: allOptions } });

    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.tag) {
      setCurrentOptions(router.query.tag.split(","));
    } else {
      setCurrentOptions([]);
    }
  }, [router.query.tag]);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  const isHolidayTrip = router.query.holiday === "1" ? true : false;

  return (
    <div
      onClick={() => {
        setShowLocation(false);
      }}
    >
      <div className="sticky bg-white top-0 left-0 right-0 z-50">
        <div className="md:hidden">
          <TravelConciergeBanner></TravelConciergeBanner>
        </div>
        <Navbar userProfile={userProfile}></Navbar>
      </div>

      {!isHolidayTrip && (
        <div className="">
          <div className="w-full h-500 relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
            <Image
              className={"w-full md:w-full"}
              layout="fill"
              objectFit="cover"
              src="/images/image-header.jpg"
              sizes="380"
              alt="Image Gallery"
              priority
            />

            <div className="absolute flex flex-col items-center justify-center top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 w-full px-6 md:px-0">
              <div>
                <h1 className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase text-center">
                  {router.query.holiday === "1"
                    ? "Special Holiday Offers"
                    : "Your Journey simplified"}
                </h1>

                <h1 className="font-bold font-OpenSans mb-8 text-base sm:text-xl text-white text-center">
                  {router.query.holiday === "1"
                    ? "Here are some special rates for our very special customers. Explore them below!"
                    : "Here are some inspirational trips to get you started"}
                </h1>
              </div>
            </div>

            <div className="absolute z-[30] flex bottom-20 w-[95%] md:w-[600px] lg:w-[700px] left-2/4 -translate-x-2/4 h-14 bg-white rounded-lg">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLocation(!showLocation);
                  setShowPricePopup(false);
                }}
                className="w-[60%] relative md:w-[70%] flex items-center h-full rounded-tl-lg rounded-bl-lg bg-white border-r border-gray-300"
              >
                <Search
                  inputBoxClassName="border-0 "
                  searchClass="w-full"
                  location={location}
                  handlePropagation={() => {}}
                  placeholder="Search for a place"
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
                    className="w-[100%]"
                  ></PopularLocationsDropdown>
                )}
              </div>
              <div className="w-[40%] md:w-[30%] flex">
                <div
                  onClick={() => {
                    setShowPricePopup(!showPricePopup);
                  }}
                  className="w-full relative cursor-pointer pl-3 gap-2 h-full bg-white rounded-tr-lg rounded-br-lg flex items-center"
                >
                  <Icon
                    className="w-6 h-6 text-gray-500"
                    icon="material-symbols:price-change-outline-rounded"
                  />
                  <div className="text-sm text-gray-500">
                    {router.query.price === "1"
                      ? "Reasonable"
                      : router.query.price === "2"
                      ? "Mid Range"
                      : router.query.price === "3"
                      ? "Luxury"
                      : "Filter by price"}
                  </div>

                  <Dropdown
                    showDropdown={showPricePopup}
                    className="absolute -left-20 sm:-left-0 md:-left-10 !z-30 lg:left-[5%] top-full mt-2 w-56"
                  >
                    <div
                      onClick={() => {
                        router.push({
                          query: {
                            ...router.query,
                            price: "1",
                          },
                        });
                      }}
                      className={
                        "w-full py-3 px-2 font-bold text-sm " +
                        (router.query.price === "1"
                          ? "bg-gray-700 text-white"
                          : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                      }
                    >
                      Reasonable
                    </div>
                    <div
                      onClick={() => {
                        router.push({
                          query: {
                            ...router.query,
                            price: "2",
                          },
                        });
                      }}
                      className={
                        "w-full py-3 px-2 font-bold text-sm " +
                        (router.query.price === "2"
                          ? "bg-gray-700 text-white"
                          : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                      }
                    >
                      Mid Range
                    </div>
                    <div
                      onClick={() => {
                        router.push({
                          query: {
                            ...router.query,
                            price: "3",
                          },
                        });
                      }}
                      className={
                        "w-full py-3 px-2 font-bold text-sm " +
                        (router.query.price === "3"
                          ? "bg-gray-700 text-white"
                          : " hover:bg-gray-200 transition-all duration-300 ease-linear")
                      }
                    >
                      Luxury
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full pb-20 -mb-6 bg-gray-50">
        <div
          className={
            "h-[80px] sticky bg-white z-20 border-t border-b left-0 right-0 flex justify-center items-center " +
            (isSafari
              ? "md:top-[84.2px] top-[137.2px]"
              : "top-[137.2px] md:top-[84.2px]")
          }
        >
          <Tags></Tags>
        </div>
        <div className="flex justify-between relative mt-7 h-full w-full">
          <div className="h-full mx-auto w-full px-4 xl:w-[1300px] lg:w-[900px] ">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <div className="flex items-center flex-wrap">
                {currentOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 flex items-center gap-2 rounded-3xl text-white bg-blue-500 mr-2"
                  >
                    <span className="text-sm font-semibold">
                      {option.split("_").join(" ")}
                    </span>
                    <Icon
                      onClick={() => {
                        handleUnCheck(option);
                      }}
                      className="cursor-pointer"
                      icon="ci:off-close"
                    />
                  </div>
                ))}
              </div>

              {router.query.location && (
                <div className="px-2 flex gap-2 items-center py-1 rounded-3xl text-white bg-green-500">
                  <span className="text-sm font-semibold">
                    {router.query.location}
                  </span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          location: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}

              {router.query.price && (
                <div className="px-2 flex gap-2 items-center py-1 rounded-3xl text-white bg-green-500">
                  <span className="text-sm font-semibold">
                    {router.query.price === "1"
                      ? "Reasonable"
                      : router.query.price === "2"
                      ? "Mid Range"
                      : router.query.price === "3"
                      ? "Luxury"
                      : ""}
                  </span>
                  <Icon
                    onClick={() => {
                      router.push({
                        query: {
                          ...router.query,
                          price: "",
                        },
                      });
                    }}
                    className="cursor-pointer"
                    icon="ci:off-close"
                  />
                </div>
              )}
            </div>
            <AllTrips
              userProfile={userProfile}
              trips={userTrips}
              userTrips={userTrips}
              isSecondTrip={true}
              recommendedTrips={secondTrips}
              setSelectedData={setSelectedData}
              setShowAddToTripPopup={setShowAddToTripPopup}
              showAddToTripPopup={showAddToTripPopup}
            ></AllTrips>
            <AllTrips
              userProfile={userProfile}
              trips={userTrips}
              userTrips={userTrips}
              recommendedTrips={recommendedTrips}
              setSelectedData={setSelectedData}
              setShowAddToTripPopup={setShowAddToTripPopup}
              showAddToTripPopup={showAddToTripPopup}
            ></AllTrips>

            {recommendedTrips.length > 0 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel={<Icon icon="bx:chevron-right" className="w-7 h-7" />}
                disabledClassName="text-gray-300"
                onPageChange={handlePageClick}
                forcePage={parseInt(router.query.page) - 1 || 0}
                pageRangeDisplayed={pageSize}
                pageCount={totalPages}
                previousLabel={
                  <Icon icon="bx:chevron-left" className="w-7 h-7" />
                }
                activeLinkClassName="bg-gray-700 text-white font-bold"
                renderOnZeroPageCount={null}
                containerClassName="flex flex-wrap gap-2 justify-center items-center mt-4"
                pageLinkClassName="bg-white h-8 w-8 font-bold flex justify-center items-center cursor-pointer hover:border border-gray-200 rounded-full text-sm"
              />
            )}
          </div>
        </div>
      </div>

      <Dialogue
        isOpen={showAddToTripPopup}
        closeModal={() => {
          setShowAddToTripPopup(false);
        }}
        title="Add to Trip"
        dialogueTitleClassName="!font-bold"
        dialoguePanelClassName="!overflow-y-scroll !p-4 max-h-[500px] !max-w-lg"
      >
        <div className="h-full relative">
          {userTrips.map((trip, index) => {
            return (
              <SingleTrip
                key={index}
                trip={trip}
                isRecommendedPage={true}
                selectedData={selectedData}
              ></SingleTrip>
            );
          })}

          <div className="flex justify-between mt-8">
            <div></div>
            <Button
              onClick={() => {
                addToANewTrip();
              }}
              className="flex w-full items-center gap-1 !px-0 !py-2 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
            >
              <span>Add to a new trip</span>

              <div
                className={
                  " " + (!addToYourNewTripLoading ? "hidden" : " ml-1")
                }
              >
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="white"
                ></LoadingSpinerChase>
              </div>
            </Button>
          </div>
        </div>
      </Dialogue>

      <div className="">
        <Footer></Footer>
      </div>
    </div>
  );
};

Trips.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const url = getRecommendeTripUrl(context);

    const seconTripUrl = getRecommendeTripUrl(context, true);

    const secondTrips = await axios.get(`${seconTripUrl}`);

    const trips = await axios.get(`${url}`);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
          recommendedTrips: trips.data.results,
          secondTrips: secondTrips.data.results,
          userTrips: data || [],
          nextLink: trips.data.next,
          previousLink: trips.data.previous,
          pageSize: trips.data.page_size,
          totalPages: trips.data.total_pages,
          count: trips.data.count,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        recommendedTrips: trips.data.results,
        secondTrips: secondTrips.data.results,
        userTrips: [],
        nextLink: trips.data.next,
        previousLink: trips.data.previous,
        pageSize: trips.data.page_size,
        totalPages: trips.data.total_pages,
        count: trips.data.count,
      },
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
          recommendedTrips: [],
          secondTrips: [],
          userTrips: [],
          nextLink: "",
          previousLink: "",
          pageSize: 0,
          totalPages: 0,
          count: 0,
        },
      };
    }
  }
}

export default Trips;
