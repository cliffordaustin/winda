import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OrderCard from "./OrderCard";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";
import { Icon } from "@iconify/react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import SwiperCore from "swiper";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/Listing.module.css";

import "swiper/css/effect-creative";
import "swiper/css";
import Button from "../ui/Button";
import Card from "../ui/Card";
import TripTransportCard from "./TripTransportCard";
import TransportTrip from "./TransportTrip";
import TripStayCard from "./TripStayCard";
import TripActivityCard from "./TripActivityCard";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import DatePicker from "../ui/DatePickerRange";
import DatePickerSingle from "../ui/DatePickerOpen";
import OpenModal from "../ui/Modal";
import Dropdown from "../ui/Dropdown";
import Select from "react-select";
import Checkbox from "../ui/Checkbox";
import { stayPriceOfPlanLower } from "../../lib/pricePlan";
import Modal from "../../components/ui/MobileModal";
import Price from "../Stay/Price";
import Search from "../Trip/Search";
import Switch from "../ui/Switch";

import {
  priceOfAdultResident,
  priceOfAdultNonResident,
  priceOfChildrenResident,
  priceOfChildrenNonResident,
  priceOfSingleAdultResident,
  priceOfSingleAdultNonResident,
  priceOfSingleChildResident,
  priceOfSingleChildNonResident,
} from "../../lib/pricePlan";

import {
  activityPricePerPersonResident,
  activityPricePerPersonNonResident,
} from "../../lib/pricePlan";
import Dialogue from "../Home/Dialogue";

const Trip = ({
  nights,
  index,
  order,
  setInfoPopup,
  setShowInfo,
  trip,
  tripId,
  tripSlug,
  startingDestination,
}) => {
  const [days, setDays] = useState();

  const [transport, setTransport] = useState([]);

  const [activities, setActivities] = useState([]);

  const [stays, setStays] = useState([]);

  const router = useRouter();

  const dispatch = useDispatch();

  const rangeBetweenTwoNumbers = (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  };

  const calcDays = () => {
    const formattedDays = 0;

    rangeBetweenTwoNumbers(0, index).forEach((item) => {
      formattedDays += order[item].days;
    });

    setDays(formattedDays);
  };

  useEffect(() => {
    calcDays();
  }, []);

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    showNavigation: false,
    showEdit: false,
    showStaysEdit: false,
    showActivitiesEdit: false,
  });

  const settings = {
    spaceBetween: 10,
    slidesPerView: "auto",

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const setCartId = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setInfoPopup(false);
    router.push({ query: { ...router.query, order_id: index } }).then(() => {
      setInfoPopup(true);
    });

    setShowInfo(true);
  };

  const variants = {
    hide: {
      scale: 0.5,
      x: -20,
    },
    show: {
      x: 0,
      scale: 1,
    },
    exit: {
      scale: 0.8,
      x: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const [numOfNight, setNumOfNight] = useState(trip.nights);

  const [numOfNightLoading, setNumOfNightLoading] = useState(false);

  const [numOfPeopleLoading, setNumOfPeopleLoading] = useState(false);

  const updateStayNights = async () => {
    const token = Cookies.get("token");
    setNumOfNightLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          nights: numOfNight,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setNumOfNightLoading(false);
        console.log(err.response.data);
      });
  };

  const updateStayPeople = async () => {
    const token = Cookies.get("token");
    setNumOfPeopleLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          number_of_people: numOfPeople,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setNumOfNightLoading(false);
        console.log(err.response.data);
      });
  };

  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false);

  const deleteTrip = async () => {
    setDeleteButtonLoading(true);
    const token = Cookies.get("token");
    await axios
      .delete(`${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`, {
        headers: {
          Authorization: "Token " + token,
        },
      })
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setDeleteButtonLoading(false);
        console.log(err.response.data);
      });
  };

  const [checkinDate, setCheckinDate] = useState("");

  const [showCheckInDate, setShowCheckInDate] = useState(false);

  const [checkInDateLoading, setCheckInDateLoading] = useState(false);

  const [guestsLoading, setGuestsLoading] = useState(false);

  const [activityGuestsLoading, setActivityGuestsLoading] = useState(false);

  const [showActivityCheckInDate, setShowActivityCheckInDate] = useState(false);

  const [activityCheckinDate, setActivityCheckinDate] = useState("");

  const [activityCheckInDateLoading, setActivityCheckInDateLoading] =
    useState(false);

  const updateActivityDate = async () => {
    const token = Cookies.get("token");
    setActivityCheckInDateLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          activity_from_date: activityCheckinDate,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        setActivityCheckInDateLoading(false);
        console.log(err.response);
      });
  };

  const containsActivityOption = (option) => {
    const options = router.query.dontShowActivity
      ? router.query.dontShowActivity.split(",")
      : [];

    return options.includes(option);
  };

  const containsStayOption = (option) => {
    const options = router.query.dontShowStay
      ? router.query.dontShowStay.split(",")
      : [];

    return options.includes(option);
  };

  const containsTransportOption = (option) => {
    const options = router.query.dontShowTransport
      ? router.query.dontShowTransport.split(",")
      : [];

    return options.includes(option);
  };

  const containsBudgetOption = (option) => {
    const options = router.query.budgeOptions
      ? router.query.budgeOptions.split(",")
      : [];

    return options.includes(option);
  };

  const containsMidRangeOption = (option) => {
    const options = router.query.midRangeOptions
      ? router.query.midRangeOptions.split(",")
      : [];

    return options.includes(option);
  };

  const containsHighEndOption = (option) => {
    const options = router.query.highEndOptions
      ? router.query.highEndOptions.split(",")
      : [];

    return options.includes(option);
  };

  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/transport/`)
      .then((res) => {
        setTransport(res.data.results);
      })
      .catch((err) => console.log(err.response));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_baseURL}/activities/`)
      .then((res) => {
        setActivities(res.data.results.slice(0, 5));
      })
      .catch((err) => console.log(err.response));
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/?max_price=${
          containsBudgetOption(`${index}`)
            ? "6000"
            : containsMidRangeOption(`${index}`)
            ? "18000"
            : containsHighEndOption(`${index}`)
            ? ""
            : ""
        }&min_price=${
          containsBudgetOption(`${index}`)
            ? "0"
            : containsMidRangeOption(`${index}`)
            ? "6000"
            : containsHighEndOption(`${index}`)
            ? "18000"
            : ""
        }`
      )
      .then((res) => {
        setStays(res.data.results.slice(0, 5));
      })
      .catch((err) => console.log(err.response));
  }, [
    router.query.budgeOptions,
    router.query.midRangeOptions,
    router.query.highEndOptions,
  ]);

  const priceOfTransportCart = (item) => {
    let price = 0;
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
          ? item.transport.additional_price_with_a_driver * item.number_of_days
          : 0);
    }
    return price;
  };

  const [addToCartDate, setAddToCartDate] = useState({
    from: "",
    to: "",
  });

  const [typeOfLodge, setTypeOfLodge] = useState([]);

  useEffect(() => {
    const availableOptions = [];
    if (trip.stay && trip.stay.standard) {
      availableOptions.push("Standard");
    }

    if (trip.stay && trip.stay.deluxe) {
      availableOptions.push("Deluxe");
    }

    if (trip.stay && trip.stay.family_room) {
      availableOptions.push("Family Room");
    }
    if (trip.stay && trip.stay.presidential_suite_room) {
      availableOptions.push("Presidential Suite Room");
    }

    if (trip.stay && trip.stay.executive_suite_room) {
      availableOptions.push("Executive Suite Room");
    }
    if (trip.stay && trip.stay.emperor_suite_room) {
      availableOptions.push("Emperor Suite Room");
    }

    availableOptions.forEach((e) => {
      setTypeOfLodge((prev) => [...prev, { label: e, value: e }]);
    });
  }, []);

  const [currentTypeOfLodge, setCurrentTypeOfLodge] = useState({
    label: "Standard",
    value: "Standard",
  });

  const [numOfAdults, setNumOfAdults] = useState(1);

  const [numOfAdultsNonResident, setNumOfAdultsNonResident] = useState(0);

  const [numOfChildren, setNumOfChildren] = useState(0);

  const [numOfChildrenNonResident, setNumOfChildrenNonResident] = useState(0);

  const [nonResident, setNonResident] = useState(false);

  const [activityNonResident, setActivityNonResident] = useState(false);

  const [guestPopup, setGuestPopup] = useState(false);

  const [activityGuestPopup, setActivityGuestPopup] = useState(false);

  const [numOfPeople, setNumOfPeople] = useState(0);

  const [numOfPeopleNonResident, setNumOfPeopleNonResident] = useState(
    (trip.activity && trip.activity.min_capacity) || 1
  );

  const [numOfSession, setNumOfSession] = useState(0);

  const [numOfSessionNonResident, setNumOfSessionNonResident] = useState(0);

  const [numOfGroups, setNumOfGroups] = useState(0);

  const [numOfGroupsNonResident, setNumOfGroupsNonResident] = useState(0);

  const [priceType, setPriceType] = useState([]);

  const [currentPrice, setCurrentPrice] = useState({
    label: "per person",
    value: "per person",
  });

  useEffect(() => {
    const availableOptions = [];

    if (trip.activity && trip.activity.price_per_person) {
      availableOptions.push("per person");
    }
    if (trip.activity && trip.activity.price_per_session) {
      availableOptions.push("per session");
    }
    if (trip.activity && trip.activity.price_per_group) {
      availableOptions.push("per group");
    }

    availableOptions.forEach((e) => {
      setPriceType((prev) => [...prev, { label: e, value: e }]);
    });
  }, []);

  const updateDate = async () => {
    const token = Cookies.get("token");
    setCheckInDateLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          from_date: addToCartDate.from,
          to_date: addToCartDate.to,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setCheckInDateLoading(false);
        console.log(err.response.data);
      });
  };

  const updateActivityGuest = async () => {
    const token = Cookies.get("token");
    setActivityGuestsLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          activity_number_of_people: numOfPeople,
          activity_number_of_people_non_resident: numOfPeopleNonResident,
          activity_number_of_sessions: numOfSession,
          activity_number_of_sessions_non_resident: numOfSessionNonResident,
          activity_number_of_groups: numOfGroups,
          activity_number_of_groups_non_resident: numOfGroupsNonResident,
          pricing_type:
            currentPrice.value === "per person"
              ? "PER PERSON"
              : currentPrice.value === "per session"
              ? "PER SESSION"
              : currentPrice.value === "per group"
              ? "PER GROUP"
              : "PER PERSON",
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setActivityGuestsLoading(false);
        console.log(err.response.data);
      });
  };

  const updateGuest = async () => {
    const token = Cookies.get("token");
    setGuestsLoading(true);
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          stay_num_of_adults: numOfAdults,
          stay_num_of_children: numOfChildren,
          stay_num_of_adults_non_resident: numOfAdultsNonResident,
          stay_num_of_children_non_resident: numOfChildrenNonResident,
          stay_plan: currentTypeOfLodge.value.toUpperCase(),
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setGuestsLoading(false);
        console.log(err.response.data);
      });
  };

  const updateTransportInfo = async () => {
    const token = Cookies.get("token");
    setTransportEditLoading(true);

    await axios
      .put(
        `${process.env.NEXT_PUBLIC_baseURL}/trip/${trip.slug}/`,
        {
          transport_number_of_days: numberOfDays,
          starting_point: searchLocation,
          transport_from_date: startingDate,
          user_need_a_driver: needADriver,
        },
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      )
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        setTransportEditLoading(false);
        console.log(err.response.data);
      });
  };

  const changeTransport = () => {
    router.push({
      pathname: "/transport",
      query: {
        trip: trip.slug,
        group_trip: router.query.slug,
      },
    });
  };

  const changeStay = () => {
    router.push({
      pathname: "/stays",
      query: {
        trip: trip.slug,
        group_trip: router.query.slug,
      },
    });
  };

  const changeExperiences = () => {
    router.push({
      pathname: "/experiences",
      query: {
        trip: trip.slug,
        group_trip: router.query.slug,
      },
    });
  };

  const [numberOfDays, setNumberOfDays] = useState(
    trip.transport_number_of_days
  );

  const [startingDate, setStartingDate] = useState(
    new Date(trip.transport_from_date)
  );

  const [editTransportPopup, setEditTransportPopup] = useState(false);

  const [transportEditLoading, setTransportEditLoading] = useState(false);

  const [searchLocation, setSearchLocation] = useState(
    trip.starting_point || ""
  );

  const [needADriver, setNeedADriver] = useState(trip.user_need_a_driver);

  const maxGuests = trip.activity && trip.activity.capacity;

  const minGuests = trip.activity && trip.activity.min_capacity;

  const priceOfResident = activityPricePerPersonResident(
    currentPrice.value.toUpperCase(),
    trip.activity
  );

  const priceOfNonResident = activityPricePerPersonNonResident(
    currentPrice.value.toUpperCase(),
    trip.activity
  );

  const priceAdultResident = priceOfAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceAdultNonResident = priceOfAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceChildResident = priceOfChildrenResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceChildNonResident = priceOfChildrenNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceSingleAdultNonResident = priceOfSingleAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceSingleAdultResident = priceOfSingleAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceSingleChildNonResident = priceOfSingleChildNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceSingleChildResident = priceOfSingleChildResident(
    currentTypeOfLodge.value.toUpperCase(),
    trip.stay
  );

  const priceOfPlan = stayPriceOfPlanLower(
    currentTypeOfLodge.value,
    nonResident,
    trip.stay
  );

  const activityMaxGuests =
    trip.activity &&
    (currentPrice.value === "Price per person"
      ? trip.activity.max_number_of_people
      : currentPrice.value === "Price per session"
      ? trip.activity.max_number_of_sessions
      : currentPrice.value === "Price per group"
      ? trip.activity.max_number_of_groups
      : "");

  const activityPriceOfPlan =
    trip.activity &&
    (currentPrice.value === "Price per person" && !activityNonResident
      ? trip.activity.price
      : currentPrice.value === "Price per person" && activityNonResident
      ? trip.activity.price_non_resident
      : currentPrice.value === "Price per session" && !activityNonResident
      ? trip.activity.session_price
      : currentPrice.value === "Price per session" && activityNonResident
      ? trip.activity.session_price_non_resident
      : currentPrice.value === "Price per group" && !activityNonResident
      ? trip.activity.group_price
      : currentPrice.value === "Price per group" && activityNonResident
      ? trip.activity.group_price_non_resident
      : trip.activity.price);

  return (
    <div className="border relative border-gray-200 px-2 py-2 rounded-lg">
      {!trip.transport && !containsTransportOption(`${index}`) && (
        <div className="px-2 mt-1 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32h181.2c40.8 0 77.1 25.78 90.6 64.29l35.2 100.51c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.33 32-32 32H32c-17.67 0-32-14.3-32-32V256c0-26.7 16.36-49.6 39.61-59.2zm69.49-4.8h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4L109.1 192zM96 256c-17.67 0-32 14.3-32 32s14.33 32 32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32zm320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
                />
              </svg>
            </div>
            <div>
              {index === 0 && startingDestination && (
                <p className="text-sm font-medium">
                  From {startingDestination}
                </p>
              )}
              {index === 0 && !startingDestination && (
                <p className="text-sm font-medium text-red-500">
                  No starting location chosen
                </p>
              )}

              {index > 0 && (
                <p className="text-sm font-medium">
                  From{" "}
                  {order[index - 1].stay && order[index - 1].stay.location
                    ? order[index - 1].stay.location
                    : order[index - 1].activity &&
                      order[index - 1].activity.location
                    ? order[index - 1].activity.location
                    : ""}
                </p>
              )}

              <h1 className="font-bold">Transportation</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No transportation added
              </h1>
            </div>
          </div>

          <div className="absolute top-1 right-2 flex gap-2 items-center">
            <div
              onClick={() => {
                changeTransport();
              }}
              className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              onClick={() => {
                if (!containsTransportOption(`${index}`)) {
                  router.push({
                    query: {
                      ...router.query,
                      dontShowTransport:
                        (router.query.dontShowTransport
                          ? router.query.dontShowTransport + ","
                          : "") + index,
                    },
                  });
                }
              }}
              className="w-7 h-7 cursor-pointer bg-red-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {trip.transport && (
        <div className="px-2 mt-1 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="w-6 h-6 fill-current text-gray-500"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M39.61 196.8L74.8 96.29C88.27 57.78 124.6 32 165.4 32h181.2c40.8 0 77.1 25.78 90.6 64.29l35.2 100.51c23.2 9.6 39.6 32.5 39.6 59.2v192c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-48H96v48c0 17.7-14.33 32-32 32H32c-17.67 0-32-14.3-32-32V256c0-26.7 16.36-49.6 39.61-59.2zm69.49-4.8h293.8l-26.1-74.6c-4.5-12.8-16.6-21.4-30.2-21.4H165.4c-13.6 0-25.7 8.6-30.2 21.4L109.1 192zM96 256c-17.67 0-32 14.3-32 32s14.33 32 32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32zm320 64c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"
                  />
                </svg>
              </div>
              <div>
                {trip.starting_point && (
                  <p className="text-sm font-medium">
                    From {trip.starting_point}
                  </p>
                )}
                {!trip.starting_point && (
                  <p className="text-sm font-medium text-red-500">
                    No starting location chosen
                  </p>
                )}

                <h1 className="font-bold">Transportation</h1>

                {!trip.transport_from_date && (
                  <p className="text-sm font-medium text-red-500">
                    No starting date chosen
                  </p>
                )}

                {trip.transport_from_date && (
                  <p className="text-sm font-medium">
                    {moment(trip.transport_from_date).format("Do MMMM YYYY")}
                  </p>
                )}
              </div>
            </div>
            <div
              onClick={() => {
                setEditTransportPopup(!editTransportPopup);
              }}
              className="self-start"
            >
              <Icon
                className="cursor-pointer w-6 h-6 text-gray-600"
                icon="akar-icons:edit"
              />
            </div>
          </div>
          <div>
            <Dialogue
              isOpen={editTransportPopup}
              closeModal={() => {
                setEditTransportPopup(false);
              }}
              dialogueTitleClassName="!font-bold"
              dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-white overflow-y-scroll"
              >
                <div>
                  <Search
                    location={searchLocation}
                    setLocation={setSearchLocation}
                  ></Search>
                </div>

                {trip.transport.driver_operates_within.length > 0 && (
                  <div className="mt-1 mb-2">
                    <h1 className="font-semibold mb-1 text-sm">
                      Car operates within
                    </h1>
                    <div className="flex flex-wrap">
                      {trip.transport.driver_operates_within.map(
                        (location, index) => (
                          <div
                            key={index}
                            className="bg-blue-500 text-xs mt-0.5 text-white px-1 font-bold py-1 mr-1 rounded-full"
                          >
                            {location.city}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center mt-2">
                  {/* {startingDate && (
                  <span className="text-sm font-bold text-blue-600">
                    {moment(startingDate).format("Do MMMM YYYY")}
                  </span>
                )} */}

                  <span className="text-lg font-bold text-gray-600">
                    selected a starting date
                  </span>
                </div>

                <DatePickerSingle
                  date={startingDate}
                  setDate={setStartingDate}
                  disableDate={new Date()}
                  className="!w-[400px] !top-[46px]"
                ></DatePickerSingle>

                <div className="mb-1 font-semibold">
                  How long do you need this car?
                </div>

                <div className="flex gap-3 items-center mt-2">
                  <div
                    onClick={() => {
                      if (numberOfDays > 1) {
                        setNumberOfDays(numberOfDays - 1);
                      }
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-gray-100 shadow-lg font-bold"
                  >
                    -
                  </div>

                  <div className="font-bold">
                    {numberOfDays} {numberOfDays > 1 ? "days" : "day"}
                  </div>
                  <div
                    onClick={() => {
                      setNumberOfDays(numberOfDays + 1);
                    }}
                    className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-gray-100 shadow-lg font-bold"
                  >
                    +
                  </div>
                </div>

                <div className="mt-1 font-semibold">Do you need a driver?</div>
                <div className="flex gap-2 items-center">
                  <Switch
                    switchButton={needADriver}
                    changeSwitchButtonState={() => {
                      setNeedADriver(!needADriver);
                    }}
                    switchButtonContainer="!w-[55px] !h-6"
                    switchButtonCircle="!w-5 !h-5 !bg-blue-500"
                    slideColorClass="!bg-blue-200"
                  ></Switch>
                  {!needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(true);
                      }}
                      className="cursor-pointer text-sm mb-1"
                    >
                      no
                    </div>
                  )}
                  {needADriver && (
                    <div
                      onClick={() => {
                        setNeedADriver(false);
                      }}
                      className="cursor-pointer text-sm mb-1"
                    >
                      yes
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-3 mb-2">
                  <div></div>
                  <div className="flex gap-2">
                    <div
                      onClick={() => {
                        setEditTransportPopup(false);
                        document.body.classList.remove("h-screen");
                        document.body.classList.remove("overflow-y-hidden");
                      }}
                      className="!bg-white text-black border !rounded-3xl px-4 text-sm cursor-pointer py-2"
                    >
                      Close
                    </div>
                    <Button
                      disabled={!startingDate || !searchLocation}
                      onClick={() => {
                        updateTransportInfo();
                      }}
                      className={
                        "!bg-blue-700 flex gap-2 items-center !rounded-3xl " +
                        (!startingDate || !searchLocation
                          ? "opacity-50 cursor-not-allowed"
                          : "")
                      }
                    >
                      <span>Update</span>

                      {transportEditLoading && (
                        <div>
                          <LoadingSpinerChase
                            width={16}
                            height={16}
                          ></LoadingSpinerChase>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Dialogue>
          </div>

          <div className="mt-2">
            <OrderCard
              orderId={trip.id}
              orderSlug={trip.slug}
              transport={trip.transport}
              transportPage={true}
              transportDistance={trip.distance}
              numberOfDays={
                trip.transport_number_of_days
                  ? trip.transport_number_of_days
                  : 1
              }
              userNeedADriver={trip.user_need_a_driver}
              // transportDestination={trip.destination}
              transportStartingPoint={trip.starting_point}
              transportPrice={
                trip.transport.price_per_day *
                  (trip.transport_number_of_days
                    ? trip.transport_number_of_days
                    : 1) +
                (trip.user_need_a_driver
                  ? trip.transport.additional_price_with_a_driver *
                    trip.transport_number_of_days
                  : 0)
              }
              checkoutInfo={true}
            ></OrderCard>
          </div>

          <div
            onClick={() => {
              changeTransport();
            }}
            className="px-3 cursor-pointer text-sm py-1 w-fit text-black border bg-white rounded-md"
          >
            Change
          </div>
        </div>
      )}

      {!trip.stay && !containsStayOption(`${index}`) && (
        <div className="flex justify-between px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M224 115.5V208a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.5a16 16 0 0 1 5.2-11.8l80-72.7a16 16 0 0 1 21.6 0l80 72.7a16 16 0 0 1 5.2 11.8Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-500">
                Select a stay to show location
              </p>
              <h1 className="font-bold">Stay</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No stay added
              </h1>
            </div>
          </div>

          <div className="self-start flex gap-2 items-center">
            <div
              onClick={() => {
                changeStay();
              }}
              className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              onClick={() => {
                if (!containsStayOption(`${index}`)) {
                  router.push({
                    query: {
                      ...router.query,
                      dontShowStay:
                        (router.query.dontShowStay
                          ? router.query.dontShowStay + ","
                          : "") + index,
                    },
                  });
                }
              }}
              className="w-7 h-7 cursor-pointer bg-red-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>

          <>
            {/* {!trip.stay && (
              <div
                onMouseLeave={() =>
                  setState({ ...state, showNavigation: false })
                }
                onMouseEnter={() =>
                  setState({ ...state, showNavigation: true })
                }
                className={!state.showStaysEdit ? "hidden" : ""}
              >
                <div className="flex gap-1 mt-2">
                  <div
                    onClick={() => {
                      if (!containsBudgetOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            budgeOptions:
                              (router.query.budgeOptions
                                ? router.query.budgeOptions + ","
                                : "") + index,
                            highEndOptions:
                              router.query.highEndOptions &&
                              router.query.highEndOptions.replace(
                                `${index}`,
                                ""
                              ),
                            midRangeOptions:
                              router.query.midRangeOptions &&
                              router.query.midRangeOptions.replace(
                                `${index}`,
                                ""
                              ),
                          },
                        });
                      } else if (containsBudgetOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            budgeOptions: router.query.budgeOptions.replace(
                              `${index}`,
                              ""
                            ),
                          },
                        });
                      }
                    }}
                    className={
                      "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                      (containsBudgetOption(`${index}`)
                        ? "!bg-blue-500 !text-white"
                        : "")
                    }
                  >
                    Budget
                  </div>
                  <div
                    onClick={() => {
                      if (!containsMidRangeOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            midRangeOptions:
                              (router.query.midRangeOptions
                                ? router.query.midRangeOptions + ","
                                : "") + index,

                            highEndOptions:
                              router.query.highEndOptions &&
                              router.query.highEndOptions.replace(
                                `${index}`,
                                ""
                              ),
                            budgeOptions:
                              router.query.budgeOptions &&
                              router.query.budgeOptions.replace(`${index}`, ""),
                          },
                        });
                      } else if (containsMidRangeOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            midRangeOptions:
                              router.query.midRangeOptions.replace(
                                `${index}`,
                                ""
                              ),
                          },
                        });
                      }
                    }}
                    className={
                      "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                      (containsMidRangeOption(`${index}`)
                        ? "!bg-blue-500 !text-white"
                        : "")
                    }
                  >
                    Mid-range
                  </div>
                  <div
                    onClick={() => {
                      if (!containsHighEndOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            highEndOptions:
                              (router.query.highEndOptions
                                ? router.query.highEndOptions + ","
                                : "") + index,

                            budgeOptions:
                              router.query.budgeOptions &&
                              router.query.budgeOptions.replace(`${index}`, ""),
                            midRangeOptions:
                              router.query.midRangeOptions &&
                              router.query.midRangeOptions.replace(
                                `${index}`,
                                ""
                              ),
                          },
                        });
                      } else if (containsHighEndOption(`${index}`)) {
                        router.push({
                          query: {
                            ...router.query,
                            highEndOptions: router.query.highEndOptions.replace(
                              `${index}`,
                              ""
                            ),
                          },
                        });
                      }
                    }}
                    className={
                      "py-1 px-2 rounded-3xl text-sm bg-blue-100 cursor-pointer " +
                      (containsHighEndOption(`${index}`)
                        ? "!bg-blue-500 !text-white"
                        : "")
                    }
                  >
                    High-end
                  </div>
                </div>
                <Swiper
                  {...settings}
                  onSwiper={(swiper) => {
                    setState({
                      ...state,
                      allowSlideNext: swiper.allowSlideNext,
                    });
                  }}
                  onSlideChange={(swiper) => {
                    setState({
                      ...state,
                      swiperIndex: swiper.realIndex,
                      endOfSlide: swiper.isEnd,
                    });
                  }}
                  className={"!w-full mt-4 relative"}
                >
                  {stays.map((item, index) => {
                    const sortedImages = item.stay_images.sort(
                      (x, y) => y.main - x.main
                    );

                    const images = sortedImages.map((image) => {
                      return image.image;
                    });
                    return (
                      <SwiperSlide key={index} className="!w-[240px]">
                        <TripStayCard
                          tripId={tripId}
                          tripSlug={tripSlug}
                          images={images}
                          stay={item}
                        ></TripStayCard>
                      </SwiperSlide>
                    );
                  })}

                  <motion.div
                    variants={variants}
                    animate={state.showNavigation ? "show" : ""}
                    initial="hide"
                    exit="exit"
                    className={
                      "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                      (state.swiperIndex === 0 || !state.showNavigation
                        ? "invisible"
                        : "")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    variants={variants}
                    animate={state.showNavigation ? "show" : ""}
                    initial="hide"
                    exit="exit"
                    className={
                      "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                      (state.endOfSlide || !state.showNavigation
                        ? "invisible"
                        : "")
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                </Swiper>
              </div>
            )} */}
          </>
        </div>
      )}

      {trip.stay && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              {trip.from_date && trip.to_date && (
                <>
                  <span className="text-gray-500 font-extrabold text-lg">
                    {new Date(trip.to_date).getDate() -
                      new Date(trip.from_date).getDate()}
                  </span>
                  <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                    nights
                  </span>
                </>
              )}

              {(!trip.from_date || !trip.to_date) && (
                <Icon className="w-6 h-6 text-gray-500" icon="bx:home-alt-2" />
              )}
            </div>
            <div>
              <div className="">
                {trip.stay && (
                  <h1 className="font-bold">{trip.stay.location}</h1>
                )}
              </div>
              <div className="">
                {trip.stay && <h1>{trip.stay.country}</h1>}
              </div>

              <div className="text-sm">
                {trip && trip.from_date && trip.to_date && (
                  <div className="flex items-center">
                    <span className="font-bold">
                      {moment(trip.from_date).format("MMMM Do")}
                    </span>
                    <span className="font-bold mx-1"> - </span>
                    <span className="font-bold">
                      {moment(trip.to_date).format("MMMM Do")}
                    </span>
                  </div>
                )}

                {trip && (!trip.from_date || !trip.to_date) && (
                  <span className="text-red-400">Please select a date</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <OrderCard
              checkoutInfo={true}
              orderSlug={trip.slug}
              stay={trip.stay}
              orderId={trip.id}
              orderDays={trip.days}
              plan={trip.stay_plan}
              itemType="order"
              stayPage={true}
              num_of_children_non_resident={
                trip.stay_num_of_children_non_resident
              }
              num_of_adults_non_resident={trip.stay_num_of_adults_non_resident}
              num_of_adults={trip.stay_num_of_adults}
              num_of_children={trip.stay_num_of_children}
            ></OrderCard>
          </div>

          <div>
            {/* <div className="flex mt-4 mb-1 items-center gap-4">
            <div className="flex gap-3 items-center">
              <div
                onClick={() => {
                  if (numOfNight > 1) {
                    setNumOfNight(numOfNight - 1);
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg font-bold"
              >
                -
              </div>

              <div className="font-bold">{numOfNight} nights</div>
              <div
                onClick={() => {
                  setNumOfNight(numOfNight + 1);
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg font-bold"
              >
                +
              </div>
            </div>
            <div
              onClick={() => {
                updateStayNights();
              }}
              className="font-bold flex items-center bg-blue-200 cursor-pointer px-2 py-0.5 rounded-md"
            >
              <span className="text-blue-600 font-bold mr-1">update</span>
              <div className={" " + (!numOfNightLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="blue"
                ></LoadingSpinerChase>
              </div>
            </div>
          </div> */}
          </div>

          <div className="absolute top-1 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              onClick={() => {
                setShowCheckInDate(!showCheckInDate);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <Dialogue
              isOpen={showCheckInDate}
              closeModal={() => {
                setShowCheckInDate(false);
              }}
              dialogueTitleClassName="!font-bold"
              dialoguePanelClassName="max-h-[600px] max-w-lg overflow-y-scroll remove-scroll"
            >
              <div>
                {addToCartDate && !addToCartDate.from && !addToCartDate.to && (
                  <div className="text-xl ml-2 font-bold">Select a date</div>
                )}
                {!addToCartDate && (
                  <div className="text-xl ml-2 font-bold">Select a date</div>
                )}
                {addToCartDate && addToCartDate.from && !addToCartDate.to && (
                  <div className="text-xl ml-2 font-bold">
                    Select checkout date
                  </div>
                )}
              </div>

              {
                <DatePicker
                  setDate={setAddToCartDate}
                  date={addToCartDate}
                  className="!sticky !bg-white !border-none !rounded-none"
                  disableDate={new Date()}
                ></DatePicker>
              }
              {addToCartDate && (addToCartDate.from || addToCartDate.to) && (
                <div
                  className="my-2 cursor-pointer text-sm ml-4 underline"
                  onClick={() => {
                    setAddToCartDate({ ...addToCartDate, from: "", to: "" });
                  }}
                >
                  clear date
                </div>
              )}

              <div className="mt-2 z-50 px-3 flex gap-2">
                <Button
                  onClick={() => {
                    setShowCheckInDate(false);
                    document.body.classList.remove("h-screen");
                    document.body.classList.remove("overflow-y-hidden");
                  }}
                  className="flex text-lg !bg-transparent border border-black !w-[40%] !py-2 !text-black"
                >
                  <span className="mr-2 font-bold">Close</span>
                </Button>
                <Button
                  onClick={() => {
                    updateDate();
                  }}
                  disabled={
                    !addToCartDate || (addToCartDate && !addToCartDate.to)
                  }
                  className={
                    "flex text-lg !bg-blue-600 !w-[60%] !py-2 " +
                    (!addToCartDate || (addToCartDate && !addToCartDate.to)
                      ? " !opacity-70 cursor-not-allowed"
                      : "")
                  }
                >
                  <span className="mr-2 font-bold">Update</span>

                  {checkInDateLoading && (
                    <div>
                      <LoadingSpinerChase
                        width={18}
                        height={18}
                      ></LoadingSpinerChase>
                    </div>
                  )}
                </Button>
              </div>
            </Dialogue>
          </div>

          <div className="w-full flex gap-2">
            <div
              onClick={() => {
                changeStay();
              }}
              className="px-3 cursor-pointer text-sm py-1 w-fit text-black border bg-white rounded-md"
            >
              Change
            </div>
            <div
              onClick={() => {
                setGuestPopup(!guestPopup);
              }}
              className="px-3 cursor-pointer text-sm py-1 w-fit text-white bg-blue-500 rounded-md"
            >
              add a guest
            </div>

            <div>
              <Dialogue
                isOpen={guestPopup}
                closeModal={() => {
                  setGuestPopup(false);
                }}
                dialoguePanelClassName="max-h-[600px] max-w-xl overflow-y-scroll remove-scroll"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white"
                >
                  <div className="mb-2">
                    <Price
                      stayPrice={
                        (numOfAdults === 1
                          ? priceSingleAdultResident
                          : priceAdultResident) *
                          numOfAdults +
                        (numOfAdultsNonResident === 1
                          ? priceSingleAdultNonResident
                          : priceAdultNonResident) *
                          numOfAdultsNonResident +
                        (numOfChildren === 1
                          ? priceSingleChildResident
                          : priceChildResident) *
                          numOfChildren +
                        (numOfChildrenNonResident === 1
                          ? priceSingleChildNonResident
                          : priceChildNonResident) *
                          numOfChildrenNonResident
                      }
                    ></Price>
                  </div>
                  <Select
                    defaultValue={currentTypeOfLodge}
                    onChange={(value) => {
                      setCurrentTypeOfLodge(value);
                      setNumOfAdults(1);
                      setNumOfAdultsNonResident(0);
                      setNumOfChildren(0);
                      setNumOfChildrenNonResident(0);
                    }}
                    className={"text-sm outline-none border border-gray-500"}
                    instanceId={typeOfLodge}
                    placeholder="Type of room"
                    options={typeOfLodge}
                    isSearchable={true}
                  />

                  {currentTypeOfLodge.value === "Standard" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for a
                      simple, clean, and affordable room.
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Emperor Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Presidential Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}
                  {currentTypeOfLodge.value === "Executive Suite Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the very best and well decorated room this place has to
                      offer
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Deluxe" && (
                    <div className="text-sm text-gray-500 mt-2">
                      This is the perfect room for you if you are looking for
                      the best this place has to offer.
                    </div>
                  )}

                  {currentTypeOfLodge.value === "Family Room" && (
                    <div className="text-sm text-gray-500 mt-2">
                      If you just want to spend sometime with the family, this
                      is the room for you.
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfAdults}{" "}
                          {numOfAdults > 1
                            ? "Residents Adult"
                            : "Resident Adult"}
                        </span>
                        <span>(18+)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (
                              (numOfAdults > 1 || numOfAdultsNonResident > 0) &&
                              numOfAdults > 0
                            ) {
                              setNumOfAdults(numOfAdults - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfAdults(numOfAdults + 1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {trip.stay.conservation_or_park &&
                      trip.stay.conservation_or_park_price && (
                        <div className="text-sm underline mt-1">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> resident adult
                          costs{" "}
                          <Price
                            stayPrice={trip.stay.conservation_or_park_price}
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfAdultsNonResident}{" "}
                          {numOfAdultsNonResident > 1
                            ? "Non-Residents Adult"
                            : "Non-Resident Adult"}
                        </span>
                        <span>(18+)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (
                              (numOfAdultsNonResident > 1 || numOfAdults > 0) &&
                              numOfAdultsNonResident > 0
                            ) {
                              setNumOfAdultsNonResident(
                                numOfAdultsNonResident - 1
                              );
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfAdultsNonResident(
                              numOfAdultsNonResident + 1
                            );
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {trip.stay.conservation_or_park &&
                      trip.stay.conservation_or_park_price_non_resident && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> non-resident
                          adult costs{" "}
                          <Price
                            stayPrice={
                              trip.stay.conservation_or_park_price_non_resident
                            }
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfChildren}{" "}
                          {numOfChildren > 1
                            ? "Resident Children"
                            : "Resident Child"}
                        </span>
                        <span>(0 - 17)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfChildren > 0) {
                              setNumOfChildren(numOfChildren - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfChildren(numOfChildren + 1);
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                    {trip.stay.conservation_or_park &&
                      trip.stay.conservation_or_park_children_price && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> resident child
                          costs{" "}
                          <Price
                            stayPrice={
                              trip.stay.conservation_or_park_children_price
                            }
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  <div>
                    <div className="flex justify-between mt-6">
                      <div className="flex gap-1 text-sm text-gray-600">
                        <span>
                          {numOfChildrenNonResident}{" "}
                          {numOfChildrenNonResident > 1
                            ? "Non-Resident Children"
                            : "Non-Resident Child"}
                        </span>
                        <span>(0 - 17)</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfChildrenNonResident > 0) {
                              setNumOfChildrenNonResident(
                                numOfChildrenNonResident - 1
                              );
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            setNumOfChildrenNonResident(
                              numOfChildrenNonResident + 1
                            );
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>

                    {trip.stay.conservation_or_park &&
                      trip.stay
                        .conservation_or_park_children_price_non_resident && (
                        <div className="text-sm mt-1 underline">
                          Park/Conservation fees for{" "}
                          <span className="font-bold">each</span> non-resident
                          child costs{" "}
                          <Price
                            stayPrice={
                              trip.stay
                                .conservation_or_park_children_price_non_resident
                            }
                            className="text-sm inline font-bold"
                          ></Price>
                        </div>
                      )}
                  </div>

                  {(numOfAdults > 1 ||
                    numOfChildren > 0 ||
                    numOfAdultsNonResident > 0 ||
                    numOfChildrenNonResident > 0) && (
                    <div
                      className="mt-2 cursor-pointer text-sm underline"
                      onClick={() => {
                        setNumOfAdults(1);
                        setNumOfChildren(0);
                        setNumOfAdultsNonResident(0);
                        setNumOfChildrenNonResident(0);
                      }}
                    >
                      clear data
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <div></div>
                    <div className="flex gap-2">
                      <div
                        onClick={() => {
                          setGuestPopup(false);
                          document.body.classList.remove("h-screen");
                          document.body.classList.remove("overflow-y-hidden");
                        }}
                        className="!bg-white text-black border !rounded-3xl px-4 text-sm cursor-pointer py-2"
                      >
                        Close
                      </div>
                      <Button
                        onClick={() => {
                          updateGuest();
                        }}
                        className="!bg-blue-700 flex gap-2 items-center !rounded-3xl"
                      >
                        <span>Update</span>

                        {guestsLoading && (
                          <div>
                            <LoadingSpinerChase
                              width={16}
                              height={16}
                            ></LoadingSpinerChase>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Dialogue>
            </div>
          </div>

          {/* <div
            onClick={(e) => {
              setCartId(e);

              dispatch({
                type: "SET_CURRENT_CART_ITEM_NAME",
                payload: trip.stay
                  ? trip.stay.name
                  : trip.activity
                  ? trip.activity.name
                  : "",
              });
            }}
            className="w-8 h-8 shadow-md cursor-pointer bg-white flex items-center justify-center rounded-full absolute top-1 right-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="w-6 h-6"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.4 7.34L16.66 4.6A2 2 0 0 0 14 4.53l-9 9a2 2 0 0 0-.57 1.21L4 18.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 20h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71ZM9.08 17.62l-3 .28l.27-3L12 9.32l2.7 2.7ZM16 10.68L13.32 8l1.95-2L18 8.73Z"
              />
            </svg>
          </div> */}
        </div>
      )}

      {!trip.activity && !containsActivityOption(`${index}`) && (
        <div className="flex justify-between px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="w-6 h-6 fill-current text-gray-500"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="m14.571 15.004l.858 1.845s3.857.819 3.857 2.767C19.286 21 17.57 21 17.57 21H13l-2.25-1.25" />
                  <path d="m9.429 15.004l-.857 1.845s-3.858.819-3.858 2.767C4.714 21 6.43 21 6.43 21H8.5l2.25-1.25L13.5 18" />
                  <path d="M3 15.926s2.143-.461 3.429-.922C7.714 8.546 11.57 9.007 12 9.007c.429 0 4.286-.461 5.571 5.997c1.286.46 3.429.922 3.429.922M12 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z" />
                </g>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-500">
                Select an experience to show location
              </p>
              <h1 className="font-bold">Experience</h1>

              <h1 className="font-medium mt-2 text-sm text-red-600">
                No experience added
              </h1>
            </div>
          </div>

          <div className="self-start flex gap-2 items-center">
            <div
              onClick={() => {
                changeExperiences();
              }}
              className="w-7 h-7 cursor-pointer bg-blue-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div
              onClick={() => {
                if (!containsActivityOption(`${index}`)) {
                  router.push({
                    query: {
                      ...router.query,
                      dontShowActivity:
                        (router.query.dontShowActivity
                          ? router.query.dontShowActivity + ","
                          : "") + index,
                    },
                  });
                }
              }}
              className="w-7 h-7 cursor-pointer bg-red-200 flex items-center justify-center rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>

          <>
            {/* {!trip.activity && (
            <div
              onMouseLeave={() => setState({ ...state, showNavigation: false })}
              onMouseEnter={() => setState({ ...state, showNavigation: true })}
            >
              <Swiper
                {...settings}
                onSwiper={(swiper) => {
                  setState({
                    ...state,
                    allowSlideNext: swiper.allowSlideNext,
                  });
                }}
                onSlideChange={(swiper) => {
                  setState({
                    ...state,
                    swiperIndex: swiper.realIndex,
                    endOfSlide: swiper.isEnd,
                  });
                }}
                className={
                  "!w-full mt-4 relative " +
                  (!state.showActivitiesEdit ? "hidden" : "")
                }
              >
                {activities.map((item, index) => {
                  const sortedImages = item.activity_images.sort(
                    (x, y) => y.main - x.main
                  );

                  const images = sortedImages.map((image) => {
                    return image.image;
                  });
                  return (
                    <SwiperSlide key={index} className="!w-[240px]">
                      <TripActivityCard
                        tripId={tripId}
                        images={images}
                        activity={item}
                        tripSlug={tripSlug}
                      ></TripActivityCard>
                    </SwiperSlide>
                  );
                })}

                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute flex cursor-pointer items-center justify-center top-2/4 z-10 left-3 -translate-y-2/4 swiper-pagination swiper-button-prev w-8 -mt-4 h-8 rounded-full bg-white shadow-lg " +
                    (state.swiperIndex === 0 || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  variants={variants}
                  animate={state.showNavigation ? "show" : ""}
                  initial="hide"
                  exit="exit"
                  className={
                    "absolute cursor-pointer flex items-center justify-center top-[40%] z-10 right-3 -translate-y-2/4 swiper-pagination swiper-button-next w-8 h-8 mb-4 rounded-full bg-white shadow-lg " +
                    (state.endOfSlide || !state.showNavigation
                      ? "invisible"
                      : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </Swiper>
            </div>
          )} */}
          </>
        </div>
      )}

      {trip.activity && (
        <div className="px-2 mt-4 relative bg-gray-100 py-1 rounded-lg">
          <div className="flex gap-2">
            <div className="w-12 h-12 my-auto bg-gray-200 rounded-lg flex items-center flex-col justify-center">
              {trip.activity_pricing_type === "PER PERSON" && (
                <>
                  <span className="text-gray-500 font-extrabold text-lg">
                    {trip.activity_number_of_people +
                      trip.activity_number_of_people_non_resident}
                  </span>
                  <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                    {trip.activity_number_of_people +
                      trip.activity_number_of_people_non_resident >
                    1
                      ? "people"
                      : "person"}
                  </span>
                </>
              )}
              {trip.activity_pricing_type === "PER SESSION" && (
                <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                  <span className="text-gray-500 font-extrabold text-lg">
                    {trip.activity_number_of_sessions}
                  </span>
                  <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                    {trip.activity_number_of_sessions > 1
                      ? "sessions"
                      : "session"}
                  </span>
                </span>
              )}
              {trip.activity_pricing_type === "PER GROUP" && (
                <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                  <span className="text-gray-500 font-extrabold text-lg">
                    {trip.activity_number_of_groups}
                  </span>
                  <span className="text-gray-500 -mt-1.5 font-extrabold text-xs">
                    {trip.activity_number_of_groups > 1 ? "groups" : "group"}
                  </span>
                </span>
              )}

              {!trip.activity_number_of_people && (
                <Icon icon="iconoir:yoga" className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <div className="">
                {trip.activity && (
                  <h1 className="font-bold">{trip.activity.location}</h1>
                )}
              </div>
              <div className="">
                {trip.activity && <h1>{trip.activity.country}</h1>}
              </div>

              <div className="text-sm">
                {trip.activity_from_date && (
                  <div>
                    <span className="font-bold">
                      {moment(trip.activity_from_date).format("MMMM Do")}
                    </span>
                  </div>
                )}
                {!trip.activity_from_date && (
                  <span className="text-red-400">Please select a date</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <OrderCard
              checkoutInfo={true}
              orderSlug={trip.slug}
              activity={trip.activity}
              orderId={trip.id}
              orderDays={trip.days}
              pricing_type={trip.activity_pricing_type}
              number_of_people={trip.activity_number_of_people}
              number_of_people_non_resident={
                trip.activity_number_of_people_non_resident
              }
              number_of_sessions={trip.activity_number_of_sessions}
              number_of_sessions_non_resident={
                trip.activity_number_of_sessions_non_resident
              }
              number_of_groups={trip.activity_number_of_groups}
              number_of_groups_non_resident={
                trip.activity_number_of_groups_non_resident
              }
              itemType="order"
              activitiesPage={true}
            ></OrderCard>
          </div>

          <div>
            {/* <div className="flex mt-4 mb-1 items-center gap-4">
            <div className="flex gap-3 items-center">
              <div
                onClick={() => {
                  if (numOfPeople > 1) {
                    setNumOfPeople(numOfPeople - 1);
                  }
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg font-bold"
              >
                -
              </div>

              <div className="font-bold">
                {numOfPeople} {numOfPeople > 1 ? "People" : "Person"}
              </div>
              <div
                onClick={() => {
                  setNumOfPeople(numOfPeople + 1);
                }}
                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg font-bold"
              >
                +
              </div>
            </div>
            <div
              onClick={() => {
                updateStayPeople();
              }}
              className="font-bold bg-blue-200 flex items-center cursor-pointer px-2 py-0.5 rounded-md"
            >
              <span className="text-blue-600 font-bold">update</span>
              <div className={" " + (!numOfPeopleLoading ? "hidden" : "")}>
                <LoadingSpinerChase
                  width={13}
                  height={13}
                  color="blue"
                ></LoadingSpinerChase>
              </div>
            </div>
          </div> */}
          </div>

          <div className="absolute top-1 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              onClick={() => {
                setShowActivityCheckInDate(!showActivityCheckInDate);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div>
            <Dialogue
              isOpen={showActivityCheckInDate}
              closeModal={() => {
                setShowActivityCheckInDate(false);
              }}
              dialoguePanelClassName="max-h-[600px] max-w-lg overflow-y-scroll remove-scroll"
            >
              <div>
                <div>
                  {!activityCheckinDate && (
                    <div className="text-base ml-2 mt-2 font-bold">
                      Select the date you will be coming
                    </div>
                  )}
                </div>
                <DatePickerSingle
                  setDate={(date, modifiers = {}) => {
                    if (!modifiers.disabled) {
                      setActivityCheckinDate(date);
                    }
                  }}
                  date={activityCheckinDate}
                  showDate={showActivityCheckInDate}
                  className="!sticky !bg-white !border-none !rounded-none"
                  disableDate={new Date()}
                ></DatePickerSingle>

                {activityCheckinDate && (
                  <div
                    className="my-2 cursor-pointer text-sm ml-4 underline"
                    onClick={() => {
                      setActivityCheckinDate("");
                    }}
                  >
                    clear date
                  </div>
                )}

                <div className="my-2 z-50 px-3 flex gap-2">
                  <Button
                    onClick={() => {
                      setShowActivityCheckInDate(false);
                      document.body.classList.remove("h-screen");
                      document.body.classList.remove("overflow-y-hidden");
                    }}
                    className="flex text-lg !bg-transparent border border-black !w-[40%] !py-2 !text-black"
                  >
                    <span className="mr-2 font-bold">Close</span>
                  </Button>
                  <Button
                    onClick={() => {
                      updateActivityDate();
                    }}
                    disabled={!activityCheckinDate}
                    className={
                      "flex text-lg !bg-blue-600 !w-[60%] !py-2 " +
                      (!activityCheckinDate
                        ? " !opacity-70 cursor-not-allowed"
                        : "")
                    }
                  >
                    <span className="mr-2">Update</span>

                    {activityCheckInDateLoading && (
                      <div>
                        <LoadingSpinerChase
                          width={18}
                          height={18}
                        ></LoadingSpinerChase>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </Dialogue>
          </div>

          <div className="w-full flex gap-2">
            <div
              onClick={() => {
                changeExperiences();
              }}
              className="px-3 cursor-pointer text-sm py-1 w-fit text-black border bg-white rounded-md"
            >
              Change
            </div>
            <div
              onClick={() => {
                setActivityGuestPopup(!activityGuestPopup);
              }}
              className="px-3 cursor-pointer text-sm py-1 w-fit text-white bg-blue-500 rounded-md"
            >
              add a guest
            </div>
            <div>
              <Dialogue
                isOpen={activityGuestPopup}
                closeModal={() => {
                  setActivityGuestPopup(false);
                }}
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white"
                >
                  <div className="mb-2">
                    <Price
                      stayPrice={
                        priceOfResident *
                          (currentPrice.value === "per person"
                            ? numOfPeople
                            : currentPrice.value === "per session"
                            ? numOfSession
                            : currentPrice.value === "per group"
                            ? numOfGroups
                            : 1) +
                        priceOfNonResident *
                          (currentPrice.value === "per person"
                            ? numOfPeopleNonResident
                            : currentPrice.value === "per session"
                            ? numOfSessionNonResident
                            : currentPrice.value === "per group"
                            ? numOfGroupsNonResident
                            : 1)
                      }
                    ></Price>
                  </div>
                  <Select
                    defaultValue={currentPrice}
                    onChange={(value) => {
                      setCurrentPrice(value);
                      setNumOfPeople(1);
                      setNumOfPeopleNonResident(0);
                      setNumOfGroups(0);
                      setNumOfGroupsNonResident(0);
                      setNumOfSession(0);
                      setNumOfSessionNonResident(0);
                    }}
                    className={"text-sm outline-none border border-gray-500"}
                    instanceId={priceType}
                    placeholder="Type of room"
                    options={priceType}
                    isSearchable={true}
                  />

                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    {currentPrice && (
                      <>
                        <span className="text-gray-600 block text-sm">
                          Minimum number of guests is {minGuests}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    {currentPrice && (
                      <>
                        <span className="text-gray-600 block text-sm">
                          Maximum number of guests is {maxGuests}
                        </span>
                      </>
                    )}
                  </div>

                  {currentPrice.value === "per person" && (
                    <>
                      <div className="flex justify-between mt-6">
                        <div className="flex flex-col text-sm text-gray-600 items-center">
                          <span>
                            {numOfPeopleNonResident}{" "}
                            {numOfPeopleNonResident > 1
                              ? "Non-Residents"
                              : "Non-Resident"}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (
                                (numOfPeopleNonResident > minGuests ||
                                  numOfPeople + numOfPeopleNonResident >
                                    minGuests) &&
                                numOfPeopleNonResident > 0
                              ) {
                                setNumOfPeopleNonResident(
                                  numOfPeopleNonResident - 1
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (numOfPeopleNonResident < maxGuests) {
                                setNumOfPeopleNonResident(
                                  numOfPeopleNonResident + 1
                                );
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <div className="flex flex-col text-sm text-gray-600 items-center">
                          <span>
                            {numOfPeople}{" "}
                            {numOfPeople > 1 ? "Residents" : "Resident"}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (
                                (numOfPeople > 1 ||
                                  numOfPeopleNonResident > 0) &&
                                numOfPeople + numOfPeopleNonResident > minGuests
                              ) {
                                setNumOfPeople(numOfPeople - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (numOfPeople < maxGuests) {
                                setNumOfPeople(numOfPeople + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {currentPrice.value === "per session" && (
                    <div className="flex justify-between mt-6">
                      <div className="flex flex-col text-sm text-gray-600 items-center">
                        <span>
                          {numOfSession}{" "}
                          {numOfSession > 1 ? "Sessions" : "Session"}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfSession > 0) {
                              setNumOfSession(numOfSession - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            if (numOfSession < maxGuests) {
                              setNumOfSession(numOfSession + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  )}

                  {currentPrice.value === "per group" && (
                    <div className="flex justify-between mt-6">
                      <div className="flex flex-col text-sm text-gray-600 items-center">
                        <span>
                          {numOfGroups} {numOfGroups > 1 ? "Groups" : "Group"}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <div
                          onClick={() => {
                            if (numOfGroups > 0) {
                              setNumOfGroups(numOfGroups - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                        >
                          -
                        </div>

                        <div
                          onClick={() => {
                            if (numOfGroups < maxGuests) {
                              setNumOfGroups(numOfGroups + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  )}

                  {(numOfPeople > 1 || numOfSession > 0 || numOfGroups > 0) && (
                    <div
                      className="mt-2 cursor-pointer text-sm underline"
                      onClick={() => {
                        setNumOfPeople(1);
                        setNumOfPeopleNonResident(0);
                        setNumOfGroups(1);
                        setNumOfGroupsNonResident(0);
                        setNumOfSession(1);
                        setNumOfSessionNonResident(0);
                      }}
                    >
                      clear data
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <div></div>
                    <div className="flex gap-2">
                      <div
                        onClick={() => {
                          setActivityGuestPopup(false);
                          document.body.classList.remove("h-screen");
                          document.body.classList.remove("overflow-y-hidden");
                        }}
                        className="!bg-white text-black border !rounded-3xl px-4 text-sm cursor-pointer py-2"
                      >
                        Close
                      </div>
                      <Button
                        onClick={() => {
                          updateActivityGuest();
                        }}
                        className="!bg-blue-700 flex gap-2 items-center !rounded-3xl"
                      >
                        <span>Update</span>

                        {activityGuestsLoading && (
                          <div>
                            <LoadingSpinerChase
                              width={16}
                              height={16}
                            ></LoadingSpinerChase>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Dialogue>
            </div>
          </div>
        </div>
      )}

      {containsStayOption(`${index}`) && (
        <div className="mt-4">
          <Button
            onClick={() => {
              const exist = router.query.dontShowStay
                ? router.query.dontShowStay.split(",")
                : [];
              let newFilter = exist.filter((e) => e !== `${index}`);

              newFilter = newFilter
                .toString()
                .replace("[", "")
                .replace("]", "")
                .trim();

              router.push({
                query: {
                  ...router.query,
                  dontShowStay: newFilter,
                },
              });
            }}
            className="!w-full !bg-blue-100 hover:!bg-blue-200 py-2 flex items-center gap-1"
          >
            <div className="font-bold text-blue-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Stay</span>
            </div>
          </Button>
        </div>
      )}

      {containsActivityOption(`${index}`) && (
        <div className="mt-2">
          <Button
            onClick={() => {
              const exist = router.query.dontShowActivity
                ? router.query.dontShowActivity.split(",")
                : [];
              let newFilter = exist.filter((e) => e !== `${index}`);

              newFilter = newFilter
                .toString()
                .replace("[", "")
                .replace("]", "")
                .trim();

              router.push({
                query: {
                  ...router.query,
                  dontShowActivity: newFilter,
                },
              });
            }}
            className="!w-full !bg-blue-100 hover:!bg-blue-200 py-2 flex items-center gap-1"
          >
            <div className="font-bold text-blue-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Experiences</span>
            </div>
          </Button>
        </div>
      )}

      {containsTransportOption(`${index}`) && (
        <div className="mt-2">
          <Button
            onClick={() => {
              const exist = router.query.dontShowTransport
                ? router.query.dontShowTransport.split(",")
                : [];
              let newFilter = exist.filter((e) => e !== `${index}`);

              newFilter = newFilter
                .toString()
                .replace("[", "")
                .replace("]", "")
                .trim();

              router.push({
                query: {
                  ...router.query,
                  dontShowTransport: newFilter,
                },
              });
            }}
            className="!w-full !bg-blue-100 hover:!bg-blue-200 py-2 flex items-center gap-1"
          >
            <div className="font-bold text-blue-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Transport</span>
            </div>
          </Button>
        </div>
      )}

      {/* <div className="mt-2">
        <Button
          onClick={() => {
            deleteTrip();
          }}
          className="!w-full !bg-red-500 hover:!bg-red-600 py-2 flex items-center gap-1"
        >
          <span className="font-bold">Delete</span>
          <div className={" " + (!deleteButtonLoading ? "hidden" : "")}>
            <LoadingSpinerChase
              width={16}
              height={16}
              color="white"
            ></LoadingSpinerChase>
          </div>
        </Button>
      </div> */}

      <div
        onClick={() => {
          setShowDeleteDropdown(!showDeleteDropdown);
        }}
        className="w-8 h-8 hover:bg-gray-200 cursor-pointer transition-all duration-300 ease-linear rounded-full flex items-center justify-center absolute -top-9 right-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      <div className="flex items-center">
        <Dropdown
          showDropdown={showDeleteDropdown}
          className="absolute top-0.5 right-1 w-56"
        >
          <div
            onClick={() => {
              deleteTrip();
            }}
            className="hover:bg-gray-100 flex gap-2 items-center transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
          >
            <span>Delete this section</span>
            <div className={" " + (!deleteButtonLoading ? "hidden" : "")}>
              <LoadingSpinerChase
                width={16}
                height={16}
                color="black"
              ></LoadingSpinerChase>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

Trip.propTypes = {};

export default Trip;
