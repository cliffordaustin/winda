import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Element } from "react-scroll";
import { createGlobalStyle } from "styled-components";
import Select from "react-select";
import { Listbox, Transition } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link as ReactScrollLink } from "react-scroll";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

// import { getServerSideProps } from "../../lib/getServerSideProps";
import Navbar from "../../components/Stay/Navbar";
import ImageGallery from "../../components/Stay/ImageGallery";
import Price from "../../components/Stay/Price";
import Button from "../../components/ui/Button";
import getToken from "../../lib/getToken";
import Map from "../../components/Stay/Map";
import ListItem from "../../components/ui/ListItem";
import DescribesStay from "../../components/Stay/DescribesStay";
import ReviewOverview from "../../components/Stay/ReviewOverview";
import Reviews from "../../components/Stay/Reviews";
import CreateReview from "../../components/Stay/CreateReview";
import LoadingSpinerChase from "../../components/ui/LoadingSpinerChase";
import Share from "../../components/Stay/Share";
import AllReviews from "../../components/Stay/AllReviews";
import getCart from "../../lib/getCart";
import ClientOnly from "../../components/ClientOnly";
import DatePicker from "../../components/ui/DatePickerRange";
import Footer from "../../components/Home/Footer";
import ScrollTo from "../../components/Stay/ScrollTo";
import { useRef } from "react";
import StickyHeader from "../../components/Home/StickyHeader";
import onScreen from "../../lib/onScreen";
import moment from "moment";
import Modal from "../../components/ui/FullScreenMobileModal";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import "swiper/css";
import "swiper/css/thumbs";
import Amenities from "../../components/Stay/Amenities";
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
import Stays from ".";
import Dialogue from "../../components/Home/Dialogue";
import PopoverBox from "../../components/ui/Popover";
import ReactPaginate from "react-paginate";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Carousel from "../../components/ui/Carousel";
import Input from "../../components/ui/Input";
import ContactBanner from "../../components/Home/ContactBanner";

const StaysDetail = ({ userProfile, stay, inCart }) => {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    width: 54px !important;
    height: 45px !important;
  }
  .rdp-months {
    width: 100% !important;
  }
  .rdp-day_range_middle {
    opacity: 0.5 !important;
  }
`;

  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const dispatch = useDispatch();

  const router = useRouter();

  const [showMoreAmenities, setShowMoreAmenities] = useState(false);

  const [showAllDescription, setShowAllDescription] = useState(false);
  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [filteredReviews, setFilteredReviews] = useState(null);

  const [showCreateReview, setShowCreateReview] = useState(false);

  const [reviewLoading, setReviewLoading] = useState(false);

  const [liked, setLiked] = useState(stay.has_user_saved);

  const [showShare, setShowShare] = useState(false);

  const [reviewCount, setReviewCount] = useState(0);

  const [reviewPageSize, setReviewPageSize] = useState(0);

  const [filterRateVal, setFilterRateVal] = useState(0);

  const [addToBasketLoading, setAddToBasketLoading] = useState(false);

  const [scrollRef, inView, entry] = useInView({
    rootMargin: "-70px 0px",
  });

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
  }, []);

  const addToBasket = async () => {
    if (stay.is_an_event) {
      router.push({
        query: {
          ...router.query,
          starting_date: moment(addToCartDate.from).format("YYYY-MM-D"),
          to_date: moment(addToCartDate.to).format("YYYY-MM-D"),
          guests: eventGuests,
          checkout_page: 1,
        },
      });
    } else {
      if (addToCartDate && addToCartDate.from && addToCartDate.to) {
        const token = Cookies.get("token");
        setAddToBasketLoading(true);
        if (token) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-cart/`,
              {
                from_date: addToCartDate.from,
                to_date: addToCartDate.to,
                num_of_adults: numOfAdults,
                num_of_children: numOfChildren,
                num_of_adults_non_resident: numOfAdultsNonResident,
                num_of_children_non_resident: numOfChildrenNonResident,
                plan:
                  currentTypeOfLodge.value === "Standard"
                    ? "STANDARD"
                    : currentTypeOfLodge.value === "Deluxe"
                    ? "DELUXE"
                    : currentTypeOfLodge.value === "Family Room"
                    ? "FAMILY ROOM"
                    : currentTypeOfLodge.value === "Presidential Suite Room"
                    ? "PRESIDENTIAL SUITE ROOM"
                    : currentTypeOfLodge.value === "Executive Suite Room"
                    ? "EXECUTIVE SUITE ROOM"
                    : currentTypeOfLodge.value === "Emperor Suite Room"
                    ? "EMPEROR SUITE ROOM"
                    : "STANDARD",
              },
              {
                headers: {
                  Authorization: "Token " + token,
                },
              }
            )
            .then(() => {
              router.push("/cart");
            })
            .catch((err) => {
              console.log(err.response);
              setAddToBasketLoading(false);
            });
        } else if (!token) {
          let cookieVal = Cookies.get("cart");
          if (cookieVal !== undefined) {
            cookieVal = JSON.parse(cookieVal);
          }
          const data = [...(cookieVal || [])];
          const exist = data.some((val) => {
            return val.slug === stay.slug;
          });
          if (!exist) {
            data.push({
              slug: stay.slug,
              itemCategory: "stays",
              from_date: addToCartDate.from,
              to_date: addToCartDate.to,
              num_of_adults: numOfAdults,
              num_of_children: numOfChildren,
              num_of_adults_non_resident: numOfAdultsNonResident,
              num_of_children_non_resident: numOfChildrenNonResident,
              plan:
                currentTypeOfLodge.value === "Standard"
                  ? "STANDARD"
                  : currentTypeOfLodge.value === "Deluxe"
                  ? "DELUXE"
                  : currentTypeOfLodge.value === "Family Room"
                  ? "FAMILY ROOM"
                  : currentTypeOfLodge.value === "Presidential Suite Room"
                  ? "PRESIDENTIAL SUITE ROOM"
                  : currentTypeOfLodge.value === "Executive Suite Room"
                  ? "EXECUTIVE SUITE ROOM"
                  : currentTypeOfLodge.value === "Emperor Suite Room"
                  ? "EMPEROR SUITE ROOM"
                  : "STANDARD",
            });
            Cookies.set("cart", JSON.stringify(data));
            router.push("/cart");
          }
        }
      }
    }
  };

  const getReview = async () => {
    setReviewLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/reviews/`
      );

      setReviews(response.data.results);
      setReviewCount(response.data.total_pages);
      setReviewPageSize(response.data.page_size);
      setReviewLoading(false);
    } catch (error) {
      setReviewLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-view/`
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getReview();
  }, []);

  const filterReview = async () => {
    setSpinner(true);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/stays/${
        stay.slug
      }/reviews/?ordering=${
        router.query.ordering ? router.query.ordering : ""
      }?page=${router.query.rate_page ? router.query.rate_page : ""}`
    );
    setFilteredReviews(data.results);
    setReviewCount(data.total_pages);
    setSpinner(false);
  };

  useEffect(() => {
    filterReview();
  }, [router.query.ordering, router.query.rate_page]);

  const [addToCartDate, setAddToCartDate] = useState({
    from: "",
    to: "",
  });

  const [slugIsCorrect, setSlugIsCorrect] = useState(false);

  const checkSlug = async () => {
    const token = Cookies.get("token");

    if (token) {
      await axios
        .get(`${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`, {
          headers: {
            Authorization: "Token " + token,
          },
        })
        .then((res) => {
          setSlugIsCorrect(true);
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setSlugIsCorrect(false);
          }
        });
    } else {
      setSlugIsCorrect(false);
    }
  };

  useEffect(() => {
    if (router.query.trip) {
      checkSlug();
    }
  }, []);

  const [addToTripLoading, setAddToTripLoading] = useState(false);

  const addToTrip = async () => {
    const token = Cookies.get("token");

    setAddToTripLoading(true);

    if (token) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_baseURL}/trip/${router.query.trip}/`,
          {
            stay_id: stay.id,
          },
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => {
          router.push({
            pathname: `/trip/plan/${router.query.group_trip}`,
          });
        })
        .catch((err) => {
          setAddToTripLoading(false);
        });
    }
  };

  const [showMobileDateModal, setShowMobileDateModal] = useState(false);

  const [typeOfLodge, setTypeOfLodge] = useState([]);

  useEffect(() => {
    const availableOptions = [];
    if (stay.standard) {
      availableOptions.push("Standard");
    }

    if (stay.deluxe) {
      availableOptions.push("Deluxe");
    }

    if (stay.family_room) {
      availableOptions.push("Family Room");
    }
    if (stay.presidential_suite_room) {
      availableOptions.push("Presidential Suite Room");
    }

    if (stay.executive_suite_room) {
      availableOptions.push("Executive Suite Room");
    }
    if (stay.emperor_suite_room) {
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

  const [numOfAdults, setNumOfAdults] = useState(stay.per_house ? 1 : 0);

  const [numOfAdultsInHome, setNumOfAdultsInHome] = useState(1);

  const [numOfChildrenInHome, setNumOfChildrenInHome] = useState(0);

  const [numOfAdultsNonResident, setNumOfAdultsNonResident] = useState(2);

  const [numOfChildren, setNumOfChildren] = useState(0);

  const [numOfChildrenNonResident, setNumOfChildrenNonResident] = useState(0);

  const [guestPopup, setGuestPopup] = useState(false);

  const [swiper, setSwiper] = useState(null);

  const [showDateForMobilePopup, setShowDateForMobilePopup] = useState(true);

  const [showGuestForMobilePopup, setShowGuestForMobilePopup] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const [message, setMessage] = useState("");

  const [showCheckoutResponseModal, setShowCheckoutResponseModal] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [eventGuests, setEventGuests] = useState(1);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showMoreActivities, setShowMoreActivities] = useState(false);

  const changeLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(false);
      axios
        .delete(`${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.id}/delete/`, {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        })
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  const changeUnLikeState = () => {
    if (Cookies.get("token")) {
      setLiked(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/save/`,
          "",
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        )
        .then(() => {})
        .catch((err) => console.log(err.response));
    } else {
      router.push({
        pathname: "/login",
        query: { redirect: `${router.asPath}` },
      });
    }
  };

  const priceAdultResident = priceOfAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceAdultNonResident = priceOfAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceChildResident = priceOfChildrenResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceChildNonResident = priceOfChildrenNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleAdultNonResident = priceOfSingleAdultNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleAdultResident = priceOfSingleAdultResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleChildNonResident = priceOfSingleChildNonResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const priceSingleChildResident = priceOfSingleChildResident(
    currentTypeOfLodge.value.toUpperCase(),
    stay
  );

  const handlePageClick = (event) => {
    router.push(
      {
        query: {
          ...router.query,
          rate_page: event.selected + 1,
        },
      },
      undefined,
      { scroll: false }
    );
  };

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const [eventDate, setEventDate] = useState({
    from:
      (router.query.starting_date && new Date(router.query.starting_date)) ||
      new Date(2022, 9, 8),
    to:
      (router.query.end_date && new Date(router.query.end_date)) ||
      new Date(2022, 9, 10),
  });

  function SelectDate({ close }) {
    return (
      <div className="w-full">
        <DayPicker
          mode="range"
          disabled={{ before: new Date(2022, 9, 8) }}
          selected={eventDate}
          onSelect={(date) => {
            if (date) {
              setEventDate(date);
            }
          }}
          defaultMonth={new Date(2022, 9)}
          numberOfMonths={2}
          className="rounded-lg !w-full p-4"
        />
      </div>
    );
  }

  const [childrenTravelers, setChildrenTravelers] = useState(
    Number(router.query.children) || 0
  );

  const [adultTravelers, setAdultTravelers] = useState(
    Number(router.query.adults) || 1
  );

  const [passengers, setPassengers] = useState(
    Number(router.query.passengers) || 0
  );

  const [rooms, setRooms] = useState(Number(router.query.rooms) || 1);

  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState(false);

  const checkAvailability = () => {
    if (eventDate.to) {
      router.replace(
        {
          query: {
            ...router.query,
            adults: adultTravelers,
            rooms: rooms,
            transport: transports.findIndex((t) => t.name === selected.name),
            starting_date: moment(eventDate.from).format("YYYY-MM-DD"),
            end_date: moment(eventDate.to).format("YYYY-MM-DD"),
            passengers: passengers,
          },
        },
        undefined,
        { scroll: false }
      );
    } else if (!eventDate.to) {
      setCheckoutErrorMessage(true);
    }
  };

  const transports = [
    {
      name: "No transport",
    },
    {
      name: "Van",
      unavailable: stay.car_transfer_price ? false : true,
      price: stay.car_transfer_price,
    },
    {
      name: "Bus",
      unavailable: stay.bus_transfer_price ? false : true,
      price: stay.bus_transfer_price,
    },
  ];

  const [selected, setSelected] = useState(
    transports[Number(router.query.transport) || 0]
  );

  function TransportType() {
    return (
      <Listbox
        value={selected}
        onChange={(value) => {
          if (value.name !== "No transport") {
            setPassengers(1);
          } else if (value.name === "No transport") {
            setPassengers(0);
          }
          setSelected(value);
        }}
      >
        <div className="relative">
          <Listbox.Button className="border cursor-pointer border-gray-600 flex items-center gap-2 px-3 py-2">
            <Icon icon="fa-solid:car-alt" className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-sm font-bold self-start">
                Select transport
              </span>
              <span className="text-gray-500 text-sm self-start">
                {/* No transport selected */}
                {selected.name}
              </span>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {transports.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    } ${item.unavailable ? " !text-gray-400" : ""}`
                  }
                  value={item}
                  disabled={item.unavailable}
                >
                  <div className="flex gap-2 items-center">
                    {selected.name == item.name ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </span>
                    ) : null}
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item.name}
                      {item.price && <span> (KES{item.price})</span>}
                    </span>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    );
  }

  function SelectTravellers() {
    return (
      <div className="w-full p-4">
        <div className="flex items-center w-full justify-between">
          <h1 className="text-sm font-bold">
            {rooms} {rooms > 1 ? "Rooms" : "Room"}
          </h1>
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (rooms > 1) {
                  setRooms(rooms - 1);
                }
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              -{" "}
            </div>
            <div
              onClick={() => {
                setRooms(rooms + 1);
                if (rooms >= adultTravelers) {
                  setAdultTravelers(adultTravelers + 1);
                }
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              +{" "}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 justify-between">
          <h1 className="text-sm font-bold">
            {adultTravelers} {adultTravelers > 1 ? "Adults" : "Adult"}
          </h1>
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (adultTravelers > 1) {
                  setAdultTravelers(adultTravelers - 1);
                }
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              -{" "}
            </div>
            <div
              onClick={() => {
                setAdultTravelers(adultTravelers + 1);
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              +{" "}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 justify-between">
          <h1 className="text-sm font-bold">
            {passengers} {passengers > 1 ? "Passengers" : "Passenger"}
            {(selected.name == "No transport" || !selected.name) && (
              <span>(select a transport first)</span>
            )}
          </h1>
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (passengers > 1) {
                  setPassengers(passengers - 1);
                }
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              -{" "}
            </div>
            <div
              onClick={() => {
                if (selected.name !== "No transport") {
                  setPassengers(passengers + 1);
                }
              }}
              className="md:w-[40px] w-[30px] h-[30px] cursor-pointer md:h-[40px] rounded-full border flex items-center justify-center font-bold"
            >
              {" "}
              +{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function reserve(index) {
    router.push({
      query: {
        ...router.query,
        room_type: index,
        adults: adultTravelers,
        rooms: rooms,
        transport: transports.findIndex((t) => t.name === selected.name),
        starting_date: moment(eventDate.from).format("YYYY-MM-DD"),
        end_date: moment(eventDate.to).format("YYYY-MM-DD"),
        passengers: passengers,
        checkout_page: 1,
      },
    });
  }

  function BreakDown() {
    const nights =
      new Date(router.query.end_date).getDate() -
      new Date(router.query.starting_date).getDate();
    const rooms = Number(router.query.rooms);
    const adults = Number(router.query.adults);

    return (
      nights +
      (nights > 1 ? " nights" : " night") +
      ", " +
      rooms +
      (rooms > 1 ? " rooms" : " room") +
      ", " +
      adults +
      (adults > 1 ? " adults" : " adult")
    );
  }

  const totalPriceOfStay = (price) => {
    const nights =
      new Date(router.query.end_date).getDate() -
      new Date(router.query.starting_date).getDate();
    const rooms = Number(router.query.rooms);
    const passengers = Number(router.query.passengers);
    const total =
      price * nights * rooms +
      (selected.name.toLowerCase() == "van"
        ? stay.car_transfer_price * passengers
        : selected.name.toLowerCase() == "bus"
        ? stay.bus_transfer_price * passengers
        : 0);
    return total;
  };

  const [phone, setPhone] = useState("");

  const [invalidPhone, setInvalidPhone] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
      confirmation_code: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      last_name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("This field is required"),

      confirmation_code: Yup.string()
        .required("This field is required")
        .max(10, "This field has a max length of 10")
        .min(10, "This field has a max length of 10"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      if (isValidPhoneNumber(phone)) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/create-event/`,
            {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              message: message,
              confirmation_code: values.confirmation_code,
              phone: phone,
              adults: Number(router.query.adults),
              rooms: Number(router.query.rooms),
              passengers: Number(router.query.passengers),
              from_date: new Date(router.query.starting_date),
              to_date: new Date(router.query.end_date),
              transport: Number(router.query.transport),
            }
          )
          .then((res) => {
            setLoading(false);
            setShowCheckoutResponseModal(true);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else if (!isValidPhoneNumber("phone")) {
        setInvalidPhone(true);
      }
    },
  });

  const getStandardRoomPrice = (stay) => {
    const standardRoom = stay.type_of_rooms.find(
      (room) => room.is_standard === true
    );
    return standardRoom.price;
  };

  const [showMobileRoomDateModal, setShowMobileRoomDateModal] = useState(false);

  const MobileRoomDatePopup = () => {
    return (
      <Dialogue
        isOpen={showMobileRoomDateModal}
        closeModal={() => setShowMobileRoomDateModal(false)}
        dialoguePanelClassName={
          " !h-[100vh] !rounded-none relative overflow-y-scroll !p-0 remove-scroll "
        }
        outsideDialogueClass="!p-0"
      >
        <div className="h-[100px] flex flex-col justify-between border-b border-b-gray-300 py-2 px-2 sticky top-0 left-0 right-0 bg-white">
          <div
            onClick={() => setShowMobileRoomDateModal(false)}
            className="bg-white cursor-pointer border w-8 h-8 rounded-full flex items-center justify-center shadow-md text-lg font-bold"
          >
            <span>x</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-lg font-bold">
              {eventDate.from
                ? moment(eventDate.from).format("Do MMM")
                : "Select check-in date"}
            </div>
            <Icon icon="ant-design:arrow-right-outlined" className="w-6 h-6" />
            <div className="text-lg font-bold">
              {eventDate.from && !eventDate.to
                ? "Select check-out date"
                : moment(eventDate.to).format("Do MMM")}
            </div>
          </div>
        </div>
        <div className="p-4">
          <DayPicker
            mode="range"
            disabled={{ before: new Date(2022, 9, 8) }}
            selected={eventDate}
            onSelect={(date) => {
              if (date) {
                setEventDate(date);
              }
            }}
            defaultMonth={new Date(2022, 9)}
            // numberOfMonths={14}
            reverseMonths={true}
            // dir="ltr"
            className="rounded-lg !w-full p-4"
          />
        </div>

        <div className="h-[80px] flex flex-col items-center justify-center border-t border-t-gray-300 py-2 px-2 sticky bottom-0 left-0 right-0 bg-white">
          <div
            onClick={() => {
              checkAvailability();
            }}
            className="w-[90%] px-3 cursor-pointer flex items-center justify-center text-sm bg-blue-600 py-3 text-white font-bold rounded-3xl"
          >
            Check availability
          </div>
        </div>
      </Dialogue>
    );
  };

  return (
    <div
      className={
        "relative " + (router.query.checkout_page === "1" ? "" : "bg-gray-50")
      }
    >
      <div
        onClick={(e) => {
          setGuestPopup(false);
        }}
      >
        <Head>
          <title>{stay.name}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <GlobalStyle></GlobalStyle>
        <div className="fixed top-0 w-full bg-white z-20">
          {stay.is_an_event && <ContactBanner></ContactBanner>}
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
        </div>

        {router.query.checkout_page !== "1" && (
          <div className="flex flex-col relative md:px-4 md:flex-row justify-around h-full w-full">
            <div
              className={
                stay.is_an_event
                  ? "w-full md:!max-w-[1000px] !mx-auto !border-none px-4"
                  : "md:w-[56%] lg:w-[63%] md:border-r md:border-gray-200 md:absolute md:mt-0 mt-10 left-0 md:block top-10"
              }
            >
              <div className="!relative" name="about">
                <div className={stay.is_an_event ? "mt-[135px]" : "mt-10 px-3"}>
                  <div className="text-sm text-gray-600 font-medium flex items-center">
                    <div>
                      <div
                        onClick={() => {
                          router.push({
                            pathname: "/stays",
                            query: {
                              d_search: stay.country,
                            },
                          });
                        }}
                        className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                      >
                        {stay.country}
                      </div>{" "}
                      <span className="mx-1">/</span>
                    </div>
                    <div>
                      <div
                        onClick={() => {
                          router.push({
                            pathname: "/stays",
                            query: {
                              d_search: stay.city,
                            },
                          });
                        }}
                        className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                      >
                        {stay.city}
                      </div>{" "}
                      <span className="mx-1">/</span>{" "}
                    </div>
                    <div
                      onClick={() => {
                        router.push({
                          pathname: "/stays",
                          query: {
                            d_search: stay.location,
                          },
                        });
                      }}
                      className="cursor-pointer hover:text-blue-600 inline transition-colors duration-200 ease-in-out"
                    >
                      {stay.location}
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stay.name}</div>
                </div>

                <div
                  className={stay.is_an_event ? "-ml-8 -mr-4 " : " -ml-8 -mr-0"}
                >
                  <ImageGallery images={stay.stay_images}></ImageGallery>

                  <div className="flex absolute bg-white px-3 rounded-3xl py-1 top-4 right-3 gap-2 items-center">
                    <div className="cursor-pointer">
                      {!liked && (
                        <svg
                          width="28px"
                          height="28px"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-black text-opacity-50 cursor-pointer"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeUnLikeState();
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      )}
                      {liked && (
                        <svg
                          width="28px"
                          height="28px"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#e63946"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeLikeState();
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShare(true);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>
                </div>

                <div
                  className={
                    (guestPopup ? " !z-0 " : " ") +
                    (stay.is_an_event
                      ? "h-[60px] bg-white z-10 border-t border-b flex left-0 right-0 "
                      : "h-12 border-b border-gray-200 w-[100%] px-3 lg:px-10 bg-slate-100 sticky left-0 right-0") +
                    (isSafari ? "top-[108px]" : "top-[115.25px]")
                  }
                  ref={scrollRef}
                >
                  <ScrollTo guestPopup={guestPopup} stay={stay}></ScrollTo>
                </div>
                <Transition
                  enter="transition-all ease-in duration-150"
                  leave="transition-all ease-out duration-150"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-50"
                  show={!inView}
                  className={
                    (stay.is_an_event
                      ? "h-[60px] fixed bg-white z-10 border-t border-b left-0 right-0 flex w-full "
                      : "h-[60px] fixed bg-white z-10 border-t border-b left-0 flex w-full md:w-[56%] px-3 lg:w-[63%] ") +
                    (isSafari ? "top-[108px]" : "top-[115.25px]")
                  }
                >
                  <ScrollTo guestPopup={guestPopup} stay={stay}></ScrollTo>
                </Transition>

                <div className="flex flex-wrap gap-1 mt-4">
                  {stay.tags &&
                    stay.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 bg-blue-300 rounded-3xl text-xs capitalize"
                      >
                        {tag}
                      </div>
                    ))}
                </div>

                {/* about */}

                <div className={"mt-4 " + (!stay.is_an_event ? "px-4" : "")}>
                  <div className="flex">
                    <div className="flex flex-col w-full">
                      {!stay.is_an_event && (
                        <div className="text-gray-500 flex justify-between md:justify-start gap-4 md:gap-2 text-sm truncate mt-3 flex-wrap">
                          {stay.room_type && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Type of room
                              </h1>
                              <div className="text-gray-600 capitalize">
                                {stay.room_type.toLowerCase()}
                              </div>
                            </div>
                          )}
                          {stay.type_of_stay && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Type of stay
                              </h1>
                              <div className="text-gray-600 capitalize">
                                {stay.type_of_stay.toLowerCase()}
                              </div>
                            </div>
                          )}
                          {stay.capacity && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Capacity
                              </h1>
                              <div className="text-gray-600">
                                {stay.capacity} max
                              </div>
                            </div>
                          )}
                          {stay.rooms && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Rooms
                              </h1>
                              <div className="text-gray-600">
                                {stay.rooms} rooms
                              </div>
                            </div>
                          )}
                          {stay.beds && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Beds
                              </h1>
                              <div className="text-gray-600">
                                {stay.beds} bedrooms
                              </div>
                            </div>
                          )}
                          {stay.bathrooms && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Bathrooms
                              </h1>
                              <div className="text-gray-600">
                                {stay.bathrooms} baths
                              </div>
                            </div>
                          )}
                          {stay.views > 0 && (
                            <div className="px-4 border-l w-[45%] md:w-fit flex flex-col items-center md:gap-1">
                              <h1 className="font-bold text-base md:text-lg text-gray-800">
                                Views
                              </h1>
                              <div className="text-gray-600">
                                {stay.views} views
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {slugIsCorrect && (
                        <div className="mt-2">
                          <Button
                            onClick={() => {
                              addToTrip();
                            }}
                            className={"!bg-blue-500 flex gap-2 !text-white "}
                          >
                            <span className="text-white text-sm">
                              Add to trip
                            </span>

                            {addToTripLoading && (
                              <div>
                                <LoadingSpinerChase
                                  width={14}
                                  height={14}
                                ></LoadingSpinerChase>
                              </div>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        "w-full z-10 px-2 border-t md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-white py-1 "
                      }
                    >
                      <div className="flex justify-between items-center gap-2">
                        {!stay.is_an_event && (
                          <div>
                            <div className="flex items-center">
                              <Price
                                stayPrice={
                                  stay.is_an_event
                                    ? stay.event_price
                                    : !stay.per_house
                                    ? (numOfAdults === 1
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
                                    : stay.per_house
                                    ? stay.per_house_price
                                    : null
                                }
                              ></Price>
                              <span className="mt-1">/night</span>

                              {addToCartDate &&
                                addToCartDate.from &&
                                addToCartDate.to && (
                                  <div className="mx-1 mb-1 font-bold">.</div>
                                )}

                              {addToCartDate &&
                                addToCartDate.from &&
                                addToCartDate.to && (
                                  <span className="text-sm font-bold mt-1.5">
                                    {moment(addToCartDate.from).format(
                                      "MMM DD"
                                    )}{" "}
                                    -{" "}
                                    {moment(addToCartDate.to).format("MMM DD")}
                                  </span>
                                )}
                            </div>

                            {!stay.per_house && (
                              <div className="text-gray-600 text-sm flex flex-wrap self-end">
                                {numOfAdultsNonResident > 0 && (
                                  <>
                                    <span>
                                      {numOfAdultsNonResident}{" "}
                                      {numOfAdultsNonResident > 1
                                        ? "Non-Resident Adults"
                                        : "Non-Resident Adult"}
                                    </span>
                                  </>
                                )}
                                {numOfAdults > 0 && (
                                  <>
                                    <span className="font-bold mx-0.5 ">,</span>
                                    <span>
                                      {numOfAdults}{" "}
                                      {numOfAdults > 1
                                        ? "Resident Adults"
                                        : "Resident Adult"}
                                    </span>
                                  </>
                                )}
                                {numOfChildren > 0 && (
                                  <>
                                    <span className="font-bold mx-0.5 ">,</span>
                                    <span>
                                      {numOfChildren}{" "}
                                      {numOfChildren > 1
                                        ? "Resident Children"
                                        : "Resident Child"}
                                    </span>
                                  </>
                                )}

                                {numOfChildrenNonResident > 0 && (
                                  <>
                                    <span className="font-bold mx-0.5 ">,</span>
                                    <span>
                                      {numOfChildrenNonResident}{" "}
                                      {numOfChildrenNonResident > 1
                                        ? "Non-Resident Children"
                                        : "Non-Resident Child"}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}

                            {stay.per_house && (
                              <div className="text-gray-600 text-sm flex flex-wrap self-end">
                                {numOfAdults > 0 && (
                                  <>
                                    <span>
                                      {numOfAdults}{" "}
                                      {numOfAdults > 1 ? "Adults" : "Adult"}
                                    </span>
                                  </>
                                )}

                                {numOfChildren > 0 && (
                                  <>
                                    <span className="font-bold mx-0.5 ">,</span>
                                    <span>
                                      {numOfChildren}{" "}
                                      {numOfChildren > 1 ? "Children" : "Child"}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {stay.is_an_event && (
                          <div>
                            <Price
                              currency="KES"
                              stayPrice={getStandardRoomPrice(stay)}
                              className="text-2xl"
                            ></Price>
                          </div>
                        )}
                        {!stay.is_an_event && (
                          <Button
                            onClick={() => {
                              setShowMobileDateModal(true);
                            }}
                            className={
                              "!bg-gradient-to-r !px-2 from-pink-500 via-red-500 to-yellow-500 !text-white " +
                              (!inCart ? "" : "")
                            }
                          >
                            {!inCart && !stay.is_an_event
                              ? "Add to basket"
                              : !inCart && stay.is_an_event
                              ? "Book now"
                              : "Add again"}
                            <div
                              className={
                                " " + (!addToBasketLoading ? "hidden" : "ml-2")
                              }
                            >
                              <LoadingSpinerChase
                                width={16}
                                height={16}
                                color="#fff"
                              ></LoadingSpinerChase>
                            </div>
                          </Button>
                        )}

                        {stay.is_an_event && (
                          <ReactScrollLink
                            className="cursor-pointer flex items-center justify-center text-sm bg-blue-600 px-2 py-2 text-white font-bold rounded-md"
                            to="rooms"
                            spy={true}
                            smooth={true}
                            offset={-400}
                            duration={500}
                          >
                            <span>Reserve a room</span>
                          </ReactScrollLink>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!stay.per_house && (
                  <Modal
                    showModal={showMobileDateModal}
                    closeModal={() => {
                      setShowMobileDateModal(!showMobileDateModal);
                    }}
                    className="md:!hidden overflow-y-auto"
                    title="Book this stay"
                  >
                    <div className="px-2 mt-2">
                      {!showDateForMobilePopup && (
                        <div
                          onClick={() => {
                            setShowDateForMobilePopup(true);
                            setShowGuestForMobilePopup(false);
                          }}
                          className="cursor-pointer flex items-center justify-between px-4 py-4 rounded-2xl mt-6 border border-gray-200"
                        >
                          <div className="font-bold">Date</div>
                          {addToCartDate &&
                            addToCartDate.from &&
                            addToCartDate.to && (
                              <span className="text-sm font-bold mt-1.5">
                                {moment(addToCartDate.from).format("MMM DD")} -{" "}
                                {moment(addToCartDate.to).format("MMM DD")}
                              </span>
                            )}
                          {((addToCartDate && !addToCartDate.to) ||
                            !addToCartDate) && (
                            <div className="text-sm text-gray-500">
                              Add a date +
                            </div>
                          )}
                        </div>
                      )}

                      {showDateForMobilePopup && (
                        <div
                          className={
                            " h-full bg-white py-2 border border-gray-200 rounded-2xl w-full mx-auto xl:ml-2 order-1 md:order-2 "
                          }
                        >
                          {addToCartDate &&
                            !addToCartDate.from &&
                            !addToCartDate.to && (
                              <div className="text-lg ml-4 font-bold">
                                Select a date
                              </div>
                            )}
                          {!addToCartDate && (
                            <div className="text-lg ml-4 font-bold">
                              Select a date
                            </div>
                          )}
                          {addToCartDate &&
                            addToCartDate.from &&
                            !addToCartDate.to && (
                              <div className="text-lg ml-4 font-bold">
                                Select checkout date
                              </div>
                            )}
                          <DatePicker
                            setDate={setAddToCartDate}
                            date={addToCartDate}
                            disableDate={new Date()}
                          ></DatePicker>
                          {addToCartDate &&
                            (addToCartDate.from || addToCartDate.to) && (
                              <div
                                className="mb-2 cursor-pointer text-sm ml-4 underline"
                                onClick={() => {
                                  setAddToCartDate({
                                    ...addToCartDate,
                                    from: "",
                                    to: "",
                                  });
                                }}
                              >
                                clear date
                              </div>
                            )}
                        </div>
                      )}

                      {!showGuestForMobilePopup && (
                        <div
                          onClick={() => {
                            setShowGuestForMobilePopup(true);
                            setShowDateForMobilePopup(false);
                          }}
                          className="flex cursor-pointer items-center justify-between px-4 py-4 rounded-2xl mt-6 border border-gray-200"
                        >
                          <div className="font-bold">Guests</div>
                          <div className="text-gray-600 text-sm  flex flex-wrap self-end justify-end">
                            {numOfAdultsNonResident > 0 && (
                              <>
                                <span>
                                  {numOfAdultsNonResident}{" "}
                                  {numOfAdultsNonResident > 1
                                    ? "Non-Resident Adults"
                                    : "Non-Resident Adult"}
                                </span>
                              </>
                            )}
                            {numOfAdults > 0 && (
                              <>
                                <span className="font-bold mx-0.5 ">,</span>
                                <span>
                                  {numOfAdults}{" "}
                                  {numOfAdults > 1
                                    ? "Resident Adults"
                                    : "Resident Adult"}
                                </span>
                              </>
                            )}
                            {numOfChildren > 0 && (
                              <>
                                <span className="font-bold mx-0.5 ">,</span>
                                <span>
                                  {numOfChildren}{" "}
                                  {numOfChildren > 1
                                    ? "Resident Children"
                                    : "Resident Child"}
                                </span>
                              </>
                            )}

                            {numOfChildrenNonResident > 0 && (
                              <>
                                <span className="font-bold mx-0.5 ">,</span>
                                <span>
                                  {numOfChildrenNonResident}{" "}
                                  {numOfChildrenNonResident > 1
                                    ? "Non-Resident Children"
                                    : "Non-Resident Child"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {showGuestForMobilePopup && (
                        <div className="px-4 mt-4 py-4 bg-white border border-gray-200 rounded-2xl w-full">
                          <div>
                            <Select
                              defaultValue={currentTypeOfLodge}
                              onChange={(value) => {
                                setCurrentTypeOfLodge(value);
                                setNumOfAdults(1);
                                setNumOfChildren(0);
                              }}
                              className={
                                "text-sm outline-none border border-gray-500 "
                              }
                              instanceId={typeOfLodge}
                              placeholder="Type of room"
                              options={typeOfLodge}
                              isSearchable={false}
                            />
                          </div>

                          {currentTypeOfLodge.value === "Standard" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for a simple, clean, and affordable room.
                            </div>
                          )}

                          {currentTypeOfLodge.value ===
                            "Emperor Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}

                          {currentTypeOfLodge.value ===
                            "Presidential Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}
                          {currentTypeOfLodge.value ===
                            "Executive Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}

                          {currentTypeOfLodge.value === "Deluxe" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the best this place has to offer.
                            </div>
                          )}

                          {currentTypeOfLodge.value === "Family Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              If you just want to spend sometime with the
                              family, this is the room for you.
                            </div>
                          )}

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
                                      (numOfAdultsNonResident > 1 ||
                                        numOfAdults > 0) &&
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_price_non_resident && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  non-resident adult costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_price_non_resident
                                    }
                                    className="!text-sm inline"
                                  ></Price>
                                </div>
                              )}
                          </div>

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
                                      (numOfAdults > 1 ||
                                        numOfAdultsNonResident > 0) &&
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_price && (
                                <div className="text-sm underline mt-1">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  resident adult costs{" "}
                                  <Price
                                    stayPrice={stay.conservation_or_park_price}
                                    className="!text-sm inline"
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_children_price_non_resident && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  non-resident child costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_children_price_non_resident
                                    }
                                    className="!text-sm inline"
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
                            {stay.conservation_or_park &&
                              stay.conservation_or_park_children_price && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  resident child costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_children_price
                                    }
                                    className="!text-sm inline"
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
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        "w-full z-10 px-2 md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-gray-100 border-t border-gray-200 py-1 "
                      }
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div>
                          <div className="flex items-center">
                            <Price
                              stayPrice={
                                stay.is_an_event
                                  ? stay.event_price
                                  : !stay.per_house
                                  ? (numOfAdults === 1
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
                                  : stay.per_house
                                  ? stay.per_house_price
                                  : null
                              }
                            ></Price>
                            <span className="mt-1">/night</span>

                            {addToCartDate &&
                              addToCartDate.from &&
                              addToCartDate.to && (
                                <div className="mx-1 mb-1 font-bold">.</div>
                              )}

                            {addToCartDate &&
                              addToCartDate.from &&
                              addToCartDate.to && (
                                <span className="text-sm font-bold mt-1.5">
                                  {moment(addToCartDate.from).format("MMM DD")}{" "}
                                  - {moment(addToCartDate.to).format("MMM DD")}
                                </span>
                              )}
                          </div>

                          {!inCart && (
                            <div className="text-gray-600 text-sm flex flex-wrap self-end">
                              {numOfAdultsNonResident > 0 && (
                                <>
                                  <span>
                                    {numOfAdultsNonResident}{" "}
                                    {numOfAdultsNonResident > 1
                                      ? "Non-Resident Adults"
                                      : "Non-Resident Adult"}
                                  </span>
                                </>
                              )}
                              {numOfAdults > 0 && (
                                <>
                                  <span className="font-bold mx-0.5 ">,</span>
                                  <span>
                                    {numOfAdults}{" "}
                                    {numOfAdults > 1
                                      ? "Resident Adults"
                                      : "Resident Adult"}
                                  </span>
                                </>
                              )}
                              {numOfChildren > 0 && (
                                <>
                                  <span className="font-bold mx-0.5 ">,</span>
                                  <span>
                                    {numOfChildren}{" "}
                                    {numOfChildren > 1
                                      ? "Resident Children"
                                      : "Resident Child"}
                                  </span>
                                </>
                              )}

                              {numOfChildrenNonResident > 0 && (
                                <>
                                  <span className="font-bold mx-0.5 ">,</span>
                                  <span>
                                    {numOfChildrenNonResident}{" "}
                                    {numOfChildrenNonResident > 1
                                      ? "Non-Resident Children"
                                      : "Non-Resident Child"}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => {
                            addToBasket();
                          }}
                          disabled={
                            !addToCartDate ||
                            (addToCartDate && !addToCartDate.to)
                          }
                          className={
                            "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                            (!addToCartDate ||
                            (addToCartDate && !addToCartDate.to)
                              ? " !opacity-70 cursor-not-allowed"
                              : "")
                          }
                        >
                          {!inCart ? "Book" : "Book again"}
                          <div
                            className={
                              " " + (!addToBasketLoading ? "hidden" : "ml-2")
                            }
                          >
                            <LoadingSpinerChase
                              width={16}
                              height={16}
                              color="#fff"
                            ></LoadingSpinerChase>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </Modal>
                )}

                {stay.per_house && (
                  <Dialogue
                    isOpen={showMobileDateModal}
                    closeModal={() => setShowMobileDateModal(false)}
                    dialoguePanelClassName={
                      "max-h-[600px] max-w-sm overflow-y-scroll remove-scroll "
                    }
                  >
                    <div>
                      <div className="flex items-center mb-4 text-sm gap-2 text-gray-600">
                        <Icon icon="akar-icons:people-group" />
                        <span>
                          Maximum number of guests allowed is{" "}
                          <span className="font-bold">{stay.capacity}</span>
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfAdults} {numOfAdults > 1 ? "Adults" : "Adult"}
                          </span>
                          <span>(18+)</span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div
                            onClick={() => {
                              if (numOfAdults > 1) {
                                setNumOfAdults(numOfAdults - 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                          >
                            -
                          </div>

                          <div
                            onClick={() => {
                              if (stay.capacity) {
                                if (
                                  numOfAdults + numOfChildren <
                                  stay.capacity
                                ) {
                                  setNumOfAdults(numOfAdults + 1);
                                }
                              } else {
                                setNumOfAdults(numOfAdults + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>
                            {numOfChildren}{" "}
                            {numOfChildren > 1 ? "Children" : "Child"}
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
                              if (stay.capacity) {
                                if (
                                  numOfAdults + numOfChildren <
                                  stay.capacity
                                ) {
                                  setNumOfChildren(numOfChildren + 1);
                                }
                              } else {
                                setNumOfChildren(numOfChildren + 1);
                              }
                            }}
                            className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialogue>
                )}

                <div className={"mt-6 " + (!stay.is_an_event ? "px-4" : "")}>
                  {!showAllDescription && (
                    <p className="font-medium text-gray-600">
                      {stay.description.slice(0, 500)}
                      {stay.description.length > 500 && "..."}
                    </p>
                  )}
                  {showAllDescription && (
                    <p className="font-medium text-gray-600">
                      {stay.description}
                    </p>
                  )}
                  {!showAllDescription && stay.description.length > 500 && (
                    <div
                      onClick={() => {
                        setShowAllDescription(true);
                      }}
                      className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Read more</span>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1"
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
                  )}
                  {showAllDescription && (
                    <div
                      onClick={() => {
                        setShowAllDescription(false);
                      }}
                      className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Read less</span>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {stay.unique_about_place && (
                  <div
                    className={
                      "pt-10 " +
                      (reviews.length > 0 ? "" : "") +
                      (!stay.is_an_event ? "px-4" : "")
                    }
                  >
                    <h1 className="font-bold text-2xl mb-5">
                      What makes this listing unique
                    </h1>
                    {!showAllUniqueFeature && (
                      <p className="ml-2 font-medium">
                        {stay.unique_about_place.slice(0, 500)}
                      </p>
                    )}
                    {showAllUniqueFeature && (
                      <p className="ml-2 font-medium">
                        {stay.unique_about_place}
                      </p>
                    )}
                    {!showAllUniqueFeature &&
                      stay.unique_about_place.length > 500 && (
                        <div
                          onClick={() => {
                            setShowAllUniqueFeature(true);
                          }}
                          className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                        >
                          <span>Read more</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-1"
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
                      )}
                    {showAllUniqueFeature && (
                      <div
                        onClick={() => {
                          setShowAllUniqueFeature(false);
                        }}
                        className="font-bold text-blue-700 flex items-center gap-0.5 cursor-pointer ml-2"
                      >
                        <span>Read less</span>{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mt-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {stay.extras_included.length > 0 && (
                <Element
                  name="activities"
                  className={
                    "flex flex-col md:flex-row gap-3 justify-between pt-10 " +
                    (!stay.is_an_event ? "px-4" : "")
                  }
                >
                  <div className="">
                    {stay.inclusions.length > 0 && (
                      <>
                        <div className="mb-3">
                          <span className="font-bold text-xl">
                            Included activities
                          </span>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {stay.inclusions.map((inclusion, index) => (
                            <div key={index} className="w-full md:w-[48%]">
                              <ListItem>{inclusion.name}</ListItem>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mb-3 mt-4">
                      <span className="font-bold text-lg">Extras</span>
                    </div>

                    {!showMoreActivities && (
                      <div className="flex flex-wrap gap-2 px-2">
                        {stay.extras_included
                          .slice(0, 5)
                          .map((activity, index) => (
                            <div key={index} className="w-[48%]">
                              <ListItem>{activity.name}</ListItem>
                            </div>
                          ))}
                      </div>
                    )}

                    {showMoreActivities && (
                      <div className="flex flex-wrap gap-2 px-2">
                        {stay.extras_included.map((activity, index) => (
                          <div key={index} className="w-[48%]">
                            <ListItem>{activity.name}</ListItem>
                          </div>
                        ))}
                      </div>
                    )}

                    {!showMoreActivities && stay.extras_included.length > 5 && (
                      <div
                        onClick={() => {
                          setShowMoreActivities(true);
                        }}
                        className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                      >
                        <span>Read more</span>{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mt-1"
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
                    )}

                    {showMoreActivities && stay.extras_included.length > 5 && (
                      <div
                        onClick={() => {
                          setShowMoreActivities(false);
                        }}
                        className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer ml-2 mb-1"
                      >
                        <span>Read less</span>{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mt-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Element>
              )}

              {/* ammenities */}
              <Element
                name="amenities"
                className={
                  "flex flex-col md:flex-row gap-3 justify-between pt-10 " +
                  (!stay.is_an_event ? "px-4" : "")
                }
              >
                <div className="w-full">
                  <div className="mb-3">
                    <span className="font-bold text-xl">Amenities</span>
                  </div>

                  <Amenities amenities={stay}></Amenities>

                  {stay.facts.length > 0 && (
                    <div className="mt-4 ml-2">
                      <div className="flex gap-2 flex-wrap">
                        {stay.facts.map((fact, index) => (
                          <div key={index} className="w-full md:w-[48%]">
                            <ListItem>{fact.name}</ListItem>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Element>

              {stay.is_an_event && (
                <Element name="rooms" className="mt-6">
                  <div className="w-full">
                    <h1 className="mb-3 text-lg font-bold">Choose your room</h1>
                  </div>
                  <div className="my-4 flex gap-3">
                    <div className="hidden md:block">
                      <PopoverBox
                        btnPopover={
                          <div className="border cursor-pointer border-gray-600 flex items-center gap-2 px-3 py-2">
                            <Icon icon="fontisto:date" className="w-6 h-6" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold self-start">
                                Select a date
                              </span>
                              <span className="text-gray-500 text-sm">
                                {eventDate.from &&
                                  eventDate.to &&
                                  moment(eventDate.from).format("Do MMM") +
                                    " - " +
                                    moment(eventDate.to).format("Do MMM")}

                                {!eventDate.from && (
                                  <span className="text-gray-500 text-sm">
                                    Select check-in date
                                  </span>
                                )}

                                {eventDate.from && !eventDate.to && (
                                  <span className="text-gray-500 text-sm">
                                    Select check-out date
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        }
                        panelClassName="h-fit rounded-lg bg-white left-0 border shadow-lg mt-1 top-full"
                      >
                        <SelectDate></SelectDate>
                      </PopoverBox>

                      {!eventDate.to && (
                        <div className="text-sm text-red-500">
                          please select a checkout date
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setShowMobileRoomDateModal(true);
                      }}
                      className="md:hidden"
                    >
                      <div className="border cursor-pointer border-gray-600 flex items-center gap-2 px-1 py-2">
                        <Icon icon="fontisto:date" className="w-6 h-6" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold self-start">
                            Select a date
                          </span>
                          <span className="text-gray-500 text-sm">
                            {eventDate.from &&
                              eventDate.to &&
                              moment(eventDate.from).format("Do MMM") +
                                " - " +
                                moment(eventDate.to).format("Do MMM")}

                            {!eventDate.from && (
                              <span className="text-gray-500 text-sm">
                                Select check-in date
                              </span>
                            )}

                            {eventDate.from && !eventDate.to && (
                              <span className="text-gray-500 text-sm">
                                Select check-out date
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <MobileRoomDatePopup></MobileRoomDatePopup>

                      {!eventDate.to && (
                        <div className="text-sm text-red-500">
                          please select a checkout date
                        </div>
                      )}
                    </div>
                    <PopoverBox
                      btnPopover={
                        <div className="border cursor-pointer border-gray-600 flex items-center gap-2 px-1 md:px-3 py-2">
                          <Icon icon="bxs:user" className="w-6 h-6" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold self-start">
                              People
                            </span>
                            <span className="text-gray-500 text-sm">
                              {rooms} rooms, {adultTravelers}{" "}
                              {adultTravelers > 1 ? "adults" : "adult"}
                            </span>
                          </div>
                        </div>
                      }
                      panelClassName="h-fit !max-w-[400px] md:!w-[400px] rounded-lg bg-white right-0 md:left-0 border shadow-lg mt-1 top-full"
                    >
                      <SelectTravellers></SelectTravellers>
                    </PopoverBox>

                    <div className="hidden md:block">
                      <TransportType></TransportType>
                    </div>

                    <div
                      onClick={() => {
                        checkAvailability();
                      }}
                      className="px-3 hidden md:flex py-4 cursor-pointer self-start items-center justify-center bg-blue-600 w-fit text-white font-bold rounded-md"
                    >
                      Check availability
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      checkAvailability();
                    }}
                    className="px-3 cursor-pointer flex md:hidden items-center justify-center text-sm bg-blue-600 w-full sm:w-[70%] py-2 mb-4 text-white font-bold rounded-md"
                  >
                    Check availability
                  </div>
                  {selected.name !== "No transport" && (
                    <div className="w-full my-3 px-2 py-2 bg-yellow-100 text-yellow-600 flex gap-2 items-center">
                      <Icon icon="bx:bx-info-circle" className="w-6 h-6" />
                      <span>
                        This transport is a {selected.name.toLowerCase()} from{" "}
                        {selected.name === "Van"
                          ? stay.car_transfer_starting_location
                          : selected.name === "Bus"
                          ? stay.bus_transfer_starting_location
                          : ""}{" "}
                        to{" "}
                        {selected.name === "Van"
                          ? stay.car_transfer_end_location
                          : selected.name === "Bus"
                          ? stay.bus_transfer_end_location
                          : ""}
                        .{" "}
                        <span className="font-bold">
                          More details will be sent to you after booking.
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="flex md:flex-row flex-col items-start flex-wrap gap-3">
                    {stay.type_of_rooms.map((room, index) => {
                      const sortedImages = room.type_of_room_images.sort(
                        (x, y) => y.main - x.main
                      );

                      const images = sortedImages.map((image) => {
                        return image.image;
                      });
                      return (
                        <div
                          key={room.id}
                          className="w-full md:w-[32%] overflow-hidden border rounded-2xl"
                        >
                          <div>
                            <div className={"w-full relative h-[170px] "}>
                              <Carousel
                                images={images}
                                imageClass="rounded-tl-2xl rounded-tr-2xl"
                              ></Carousel>
                            </div>
                          </div>

                          <div className="px-3 mt-3 flex flex-col gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Icon icon="heroicons:users-20-solid" />
                              <span>sleeps {room.sleeps}</span>
                            </div>
                          </div>

                          <div className="mt-2 px-2">
                            <h1 className="mb-3 text-base font-bold">
                              {room.name}
                            </h1>

                            <p className="mt-3 text-sm text-gray-600">
                              {room.short_description}
                            </p>

                            <div className="mt-2 mb-2">
                              <div className="flex justify-between items-center w-full">
                                <div className="">
                                  <Price
                                    currency="KES"
                                    stayPrice={
                                      room.price *
                                        (new Date(
                                          router.query.end_date
                                        ).getDate() -
                                          new Date(
                                            router.query.starting_date
                                          ).getDate() || 1) *
                                        (Number(router.query.rooms) || 1) +
                                      (selected.name.toLowerCase() == "van"
                                        ? stay.car_transfer_price
                                        : selected.name.toLowerCase() == "bus"
                                        ? stay.bus_transfer_price
                                        : 0) *
                                        Number(passengers)
                                    }
                                  ></Price>
                                </div>

                                {Number(router.query.rooms || 1) <=
                                  room.available_rooms &&
                                  (Number(router.query.adults) || 1) <=
                                    room.sleeps && (
                                    <div
                                      onClick={() => {
                                        reserve(index);
                                      }}
                                      className="px-3 text-sm cursor-pointer bg-blue-600 w-fit py-1.5 text-white font-bold rounded-md"
                                    >
                                      Reserve{" "}
                                      {Number(router.query.rooms) > 1
                                        ? Number(router.query.rooms) + " rooms"
                                        : ""}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2">
                            <hr />
                          </div>

                          {Number(router.query.rooms || 1) <=
                            room.available_rooms &&
                            (Number(router.query.adults) || 1) <=
                              room.sleeps && (
                              <div className="text-sm text-gray-600 font-bold border-l-8 border-blue-100 px-3 py-2">
                                <div>
                                  for {Number(router.query.rooms || 1)}{" "}
                                  {Number(router.query.rooms || 1) > 1
                                    ? "rooms"
                                    : "room"}
                                  , {Number(router.query.adults || 1)}{" "}
                                  {Number(router.query.adults || 1) > 1
                                    ? "people"
                                    : "person"}{" "}
                                </div>

                                <div className="mt-1 lowercase">
                                  with {selected.name}{" "}
                                  {passengers > 0 && (
                                    <span>
                                      ({passengers}{" "}
                                      {passengers > 1
                                        ? "passengers"
                                        : "passenger"}
                                      )
                                    </span>
                                  )}
                                </div>

                                {router.query.starting_date &&
                                  router.query.end_date && (
                                    <div className="mt-1">
                                      from{" "}
                                      {moment(
                                        router.query.starting_date
                                      ).format("Do MMM")}{" "}
                                      -{" "}
                                      {moment(router.query.end_date).format(
                                        "Do MMM"
                                      )}{" "}
                                      (
                                      {new Date(
                                        router.query.end_date
                                      ).getDate() -
                                        new Date(
                                          router.query.starting_date
                                        ).getDate()}{" "}
                                      {new Date(
                                        router.query.end_date
                                      ).getDate() -
                                        new Date(
                                          router.query.starting_date
                                        ).getDate() >
                                      1
                                        ? "nights"
                                        : "night"}{" "}
                                      )
                                    </div>
                                  )}

                                {!router.query.starting_date &&
                                  !router.query.end_date && (
                                    <div className="mt-1">
                                      from{" "}
                                      {moment(new Date(2022, 9, 8)).format(
                                        "Do MMM"
                                      )}{" "}
                                      -{" "}
                                      {moment(new Date(2022, 9, 10)).format(
                                        "Do MMM"
                                      )}{" "}
                                      (2 nights)
                                    </div>
                                  )}
                              </div>
                            )}
                          {(Number(router.query.rooms || 1) >
                            room.available_rooms ||
                            (Number(router.query.adults) || 1) >
                              room.sleeps) && (
                            <div className="font-bold text-red-600 px-3 py-2 text-sm">
                              Not available
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Element>
              )}

              <Element
                name="policies"
                className={"w-full pt-12 " + (!stay.is_an_event ? "px-4" : "")}
              >
                <h1 className="font-bold text-2xl mb-2">Policies</h1>

                <div className="mt-4">
                  <div className="py-2 px-2 border-b border-gray-100">
                    <span className="font-semibold">Cancellation Policy</span>
                  </div>

                  <div className="mt-2 ml-2 flex flex-col gap-2">
                    <ListItem>You should have CV-19 travel insurance</ListItem>
                    <ListItem>
                      See the full cancellation policy more{" "}
                      <Link href="/policies">
                        <a>
                          <div className="text-blue-500 underline inline">
                            here
                          </div>
                        </a>
                      </Link>
                    </ListItem>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="py-2 px-2 border-b border-gray-100">
                    <span className="font-semibold">
                      Health and safety policy
                    </span>
                  </div>

                  <div className="mt-2 ml-2 flex flex-col gap-2">
                    <ListItem>
                      This property is compliant with Winda.guide&apos;s CV-19
                      requirements. More{" "}
                      <Link href="/safety">
                        <a>
                          <div className="text-blue-500 underline inline">
                            here
                          </div>
                        </a>
                      </Link>
                    </ListItem>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="py-2 px-2 border-b border-gray-100">
                    <span className="font-semibold">Damage policy</span>
                  </div>

                  <div className="mt-2 ml-2 flex flex-col gap-2">
                    <ListItem>
                      The guest is liable for any damages caused by them during
                      their stay.
                    </ListItem>
                  </div>
                </div>
              </Element>

              <Element
                name="map"
                className={
                  "h-[350px] md:h-[450px] relative pt-12 " +
                  (stay.is_an_event ? "" : "-ml-0 -mr-0") +
                  (reviews.length > 0 ? "" : " mb-16 md:mb-24")
                }
              >
                <div className={"" + (!stay.is_an_event ? "px-4" : "")}>
                  <div className="text-2xl font-bold">Map</div>
                  <div className="mt-1 mb-4 text-sm text-gray-600">
                    Detailed location provided after booking
                  </div>
                </div>
                <Map longitude={stay.longitude} latitude={stay.latitude}></Map>
              </Element>

              {/* reviews */}
              <Element
                name="reviews"
                className={"pt-24 " + (!stay.is_an_event ? "px-4" : "")}
              >
                {!reviewLoading && reviews.length > 0 && (
                  <div className="mb-16 md:mb-24">
                    <div className="max-w-[750px] mb-10">
                      <h1 className="font-bold text-2xl mb-5">Reviews</h1>
                      <ReviewOverview
                        reviews={reviews}
                        filterReview={filterReview}
                        stay={stay}
                        setFilterRateVal={setFilterRateVal}
                      ></ReviewOverview>
                      <div className="flex justify-between gap-2">
                        <div className="hidden md:block"></div>
                        <PopoverBox
                          btnPopover={
                            <div className="flex float-left items-center gap-1 text-blue-600 border-gray-200 cursor-pointer px-2 w-fit mt-4">
                              <div>
                                Sort by{" "}
                                {router.query.ordering === "-date_posted"
                                  ? "Most Recent"
                                  : router.query.ordering === "-rate"
                                  ? "Most Favorable"
                                  : router.query.ordering === "+rate"
                                  ? "Most Critical"
                                  : ""}
                              </div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
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
                          panelClassName="shadow-all w-[150px] mt-1 w-56 bg-white rounded-lg overflow-hidden"
                        >
                          <div
                            onClick={() => {
                              router.push(
                                {
                                  query: {
                                    ...router.query,
                                    ordering: "-date_posted",
                                  },
                                },
                                undefined,
                                { scroll: false }
                              );
                            }}
                            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                          >
                            Most Recent
                          </div>
                          <div
                            onClick={() => {
                              router.push(
                                {
                                  query: {
                                    ...router.query,
                                    ordering: "-rate",
                                  },
                                },
                                undefined,
                                { scroll: false }
                              );
                            }}
                            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                          >
                            Most Favorable
                          </div>
                          <div
                            onClick={() => {
                              router.push(
                                {
                                  query: {
                                    ...router.query,
                                    ordering: "+rate",
                                  },
                                },
                                undefined,
                                { scroll: false }
                              );
                            }}
                            className="hover:bg-gray-100 transition-colors duration-300 cursor-pointer ease-in-out px-2 py-2"
                          >
                            Most Critical
                          </div>
                        </PopoverBox>

                        {/* {filteredReviews && (
                      <div
                        onClick={() => {
                          getReview();
                          setFilteredReviews(null);
                        }}
                        className="flex gap-1 border border-gray-200 cursor-pointer rounded-md px-2 py-2 w-fit mt-4"
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
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>Clear Filter</div>
                      </div>
                    )} */}
                      </div>
                    </div>

                    <div className="mb-16">
                      <Reviews
                        reviews={reviews}
                        spinner={spinner}
                        filteredReviews={filteredReviews}
                        setShowAllReviews={setShowAllReviews}
                        count={reviewCount}
                      ></Reviews>
                    </div>
                  </div>
                )}
                {reviewLoading && (
                  <div className="flex items-center justify-center mb-16 mt-16">
                    <LoadingSpinerChase
                      width={35}
                      height={35}
                      color="#000"
                    ></LoadingSpinerChase>
                  </div>
                )}

                {reviews.length > 0 && (
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel={
                      <Icon icon="bx:chevron-right" className="w-7 h-7" />
                    }
                    disabledClassName="text-gray-300"
                    onPageChange={handlePageClick}
                    forcePage={parseInt(router.query.rate_page) - 1 || 0}
                    pageRangeDisplayed={reviewPageSize}
                    pageCount={reviewCount}
                    previousLabel={
                      <Icon icon="bx:chevron-left" className="w-7 h-7" />
                    }
                    activeLinkClassName="bg-gray-700 text-white font-bold"
                    containerClassName="flex flex-wrap gap-2 justify-center items-center mt-4"
                    pageLinkClassName="bg-white h-8 w-8 font-bold flex justify-center items-center cursor-pointer hover:border border-gray-200 rounded-full text-sm"
                  />
                )}
              </Element>

              <div>
                <Share
                  showShare={showShare}
                  type_of_stay={stay.type_of_stay}
                  setShowShare={setShowShare}
                ></Share>
              </div>

              <div className="mt-12 hidden md:block absolute bottom-0 left-0 right-0">
                <Footer></Footer>
              </div>
            </div>

            {!stay.is_an_event && (
              <div className="md:fixed hidden lg:flex flex-col right-2 md:w-[42%] h-full md:pl-2 lg:px-0 lg:w-[35%] top-20 bottom-0 overflow-y-scroll md:block">
                <div className="flex h-fit justify-between">
                  {
                    <div>
                      {addToCartDate &&
                        !addToCartDate.from &&
                        !addToCartDate.to && (
                          <div className="text-xl ml-2 font-bold">
                            Select a date
                          </div>
                        )}
                      {!addToCartDate && (
                        <div className="text-xl ml-2 font-bold">
                          Select a date
                        </div>
                      )}
                      {addToCartDate &&
                        addToCartDate.from &&
                        !addToCartDate.to && (
                          <div className="text-xl ml-2 font-bold">
                            Select checkout date
                          </div>
                        )}
                    </div>
                  }
                  <div className="flex flex-col">
                    <div className="flex self-end">
                      <Price
                        stayPrice={
                          stay.is_an_event
                            ? stay.event_price
                            : !stay.per_house
                            ? (numOfAdults === 1
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
                            : stay.per_house
                            ? stay.per_house_price
                            : null
                        }
                      ></Price>
                      <span className="mt-1">/night</span>
                    </div>
                    {addToCartDate && addToCartDate.from && addToCartDate.to && (
                      <span className="text-gray-600 text-sm font-bold self-end">
                        {moment(addToCartDate.from).format("MMM DD")} -{" "}
                        {moment(addToCartDate.to).format("MMM DD")}
                      </span>
                    )}
                    {!stay.per_house && !stay.is_an_event && (
                      <div className="text-gray-600 text-sm flex flex-wrap self-end justify-end">
                        {numOfAdultsNonResident > 0 && (
                          <>
                            <span>
                              {numOfAdultsNonResident}{" "}
                              {numOfAdultsNonResident > 1
                                ? "Non-Resident Adults"
                                : "Non-Resident Adult"}
                            </span>
                          </>
                        )}
                        {numOfAdults > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfAdults}{" "}
                              {numOfAdults > 1
                                ? "Resident Adults"
                                : "Resident Adult"}
                            </span>
                          </>
                        )}
                        {numOfChildren > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfChildren}{" "}
                              {numOfChildren > 1
                                ? "Resident Children"
                                : "Resident Child"}
                            </span>
                          </>
                        )}

                        {numOfChildrenNonResident > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfChildrenNonResident}{" "}
                              {numOfChildrenNonResident > 1
                                ? "Non-Resident Children"
                                : "Non-Resident Child"}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {stay.per_house && (
                      <div className="text-gray-600 text-sm flex flex-wrap self-end justify-end">
                        {numOfAdults > 0 && (
                          <>
                            <span>
                              {numOfAdults}{" "}
                              {numOfAdults > 1 ? "Adults" : "Adult"}
                            </span>
                          </>
                        )}

                        {numOfChildren > 0 && (
                          <>
                            <span className="font-bold mx-0.5 ">,</span>
                            <span>
                              {numOfChildren}{" "}
                              {numOfChildren > 1 ? "Children" : "Child"}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={
                    " h-fit w-full lg:w-fit mx-auto xl:ml-auto order-1 md:order-2 "
                  }
                >
                  <div className="">
                    {
                      <DatePicker
                        setDate={setAddToCartDate}
                        date={addToCartDate}
                        disableDate={new Date()}
                      ></DatePicker>
                    }
                  </div>

                  {addToCartDate && (addToCartDate.from || addToCartDate.to) && (
                    <div
                      className="my-2 cursor-pointer text-sm ml-4 underline"
                      onClick={() => {
                        setAddToCartDate({
                          ...addToCartDate,
                          from: "",
                          to: "",
                        });
                      }}
                    >
                      clear date
                    </div>
                  )}

                  <div className=" mt-4 relative">
                    {!stay.is_an_event && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuestPopup(!guestPopup);
                        }}
                        className="py-3 bg-blue-600 rounded-md bg-opacity-10 gap-1 flex cursor-pointer font-bold items-center justify-center text-blue-800 mb-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          className="w-5 h-5"
                          preserveAspectRatio="xMidYMid meet"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
                          />
                        </svg>
                        <span>Add Guests</span>
                      </div>
                    )}

                    {stay.is_an_event && (
                      <div className="flex mt-2 mb-3 justify-between items-center">
                        <span className="font-bold">Add guests</span>

                        <div className="flex items-center gap-2 ">
                          <div
                            onClick={() => {
                              if (eventGuests > 1) {
                                setEventGuests(eventGuests - 1);
                              }
                            }}
                            className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                          >
                            {" "}
                            -{" "}
                          </div>

                          <div className="font-bold text-sm">{eventGuests}</div>

                          <div
                            onClick={() => {
                              setEventGuests(eventGuests + 1);
                            }}
                            className="w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center focus:shadow-inner font-bold"
                          >
                            +
                          </div>
                        </div>
                      </div>
                    )}

                    <Dialogue
                      isOpen={guestPopup}
                      closeModal={() => setGuestPopup(false)}
                      dialoguePanelClassName={
                        "max-h-[600px] overflow-y-scroll remove-scroll " +
                        (stay.per_house ? "!max-w-sm" : "!max-w-xl")
                      }
                    >
                      {!stay.per_house && (
                        <>
                          <Select
                            defaultValue={currentTypeOfLodge}
                            onChange={(value) => {
                              setCurrentTypeOfLodge(value);
                              setNumOfAdults(1);
                              setNumOfAdultsNonResident(0);
                              setNumOfChildren(0);
                              setNumOfChildrenNonResident(0);
                            }}
                            className={
                              "text-sm outline-none border border-gray-500"
                            }
                            instanceId={typeOfLodge}
                            placeholder="Type of room"
                            options={typeOfLodge}
                            isSearchable={false}
                          />

                          {currentTypeOfLodge.value === "Standard" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for a simple, clean, and affordable room.
                            </div>
                          )}

                          {currentTypeOfLodge.value ===
                            "Emperor Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}

                          {currentTypeOfLodge.value ===
                            "Presidential Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}
                          {currentTypeOfLodge.value ===
                            "Executive Suite Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the very best and well decorated room
                              this place has to offer
                            </div>
                          )}

                          {currentTypeOfLodge.value === "Deluxe" && (
                            <div className="text-sm text-gray-500 mt-2">
                              This is the perfect room for you if you are
                              looking for the best this place has to offer.
                            </div>
                          )}

                          {currentTypeOfLodge.value === "Family Room" && (
                            <div className="text-sm text-gray-500 mt-2">
                              If you just want to spend sometime with the
                              family, this is the room for you.
                            </div>
                          )}

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
                                      (numOfAdultsNonResident > 1 ||
                                        numOfAdults > 0) &&
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_price_non_resident && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  non-resident adult costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_price_non_resident
                                    }
                                    className="!text-sm inline"
                                  ></Price>
                                </div>
                              )}
                          </div>

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
                                      (numOfAdults > 1 ||
                                        numOfAdultsNonResident > 0) &&
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_price && (
                                <div className="text-sm underline mt-1">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  resident adult costs{" "}
                                  <Price
                                    stayPrice={stay.conservation_or_park_price}
                                    className="!text-sm inline"
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

                            {stay.conservation_or_park &&
                              stay.conservation_or_park_children_price_non_resident && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  non-resident child costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_children_price_non_resident
                                    }
                                    className="!text-sm inline"
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
                            {stay.conservation_or_park &&
                              stay.conservation_or_park_children_price && (
                                <div className="text-sm mt-1 underline">
                                  Park/Conservation fees for{" "}
                                  <span className="font-bold">each</span>{" "}
                                  resident child costs{" "}
                                  <Price
                                    stayPrice={
                                      stay.conservation_or_park_children_price
                                    }
                                    className="!text-sm inline"
                                  ></Price>
                                </div>
                              )}
                          </div>

                          {(numOfAdultsNonResident > 1 ||
                            numOfChildren > 0 ||
                            numOfAdults > 0 ||
                            numOfChildrenNonResident > 0) && (
                            <div
                              className="mt-2 cursor-pointer text-sm underline"
                              onClick={() => {
                                setNumOfAdults(0);
                                setNumOfChildren(0);
                                setNumOfAdultsNonResident(1);
                                setNumOfChildrenNonResident(0);
                              }}
                            >
                              clear data
                            </div>
                          )}

                          <div className="flex justify-between mt-6">
                            <div></div>
                            <Button
                              onClick={() => {
                                setGuestPopup(false);
                              }}
                              className="!bg-blue-700 !rounded-3xl"
                            >
                              <span>Done</span>
                            </Button>
                          </div>
                        </>
                      )}
                      {stay.per_house && (
                        <div>
                          <div className="flex items-center mb-4 text-sm gap-2 text-gray-600">
                            <Icon icon="akar-icons:people-group" />
                            <span>
                              Maximum number of guests allowed is{" "}
                              <span className="font-bold">{stay.capacity}</span>
                            </span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div className="flex gap-1 text-sm text-gray-600">
                              <span>
                                {numOfAdults}{" "}
                                {numOfAdults > 1 ? "Adults" : "Adult"}
                              </span>
                              <span>(18+)</span>
                            </div>

                            <div className="flex gap-3 items-center">
                              <div
                                onClick={() => {
                                  if (numOfAdults > 1) {
                                    setNumOfAdults(numOfAdults - 1);
                                  }
                                }}
                                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center  bg-white shadow-lg text-gray-600"
                              >
                                -
                              </div>

                              <div
                                onClick={() => {
                                  if (stay.capacity) {
                                    if (
                                      numOfAdults + numOfChildren <
                                      stay.capacity
                                    ) {
                                      setNumOfAdults(numOfAdults + 1);
                                    }
                                  } else {
                                    setNumOfAdults(numOfAdults + 1);
                                  }
                                }}
                                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                              >
                                +
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between mt-6">
                            <div className="flex gap-1 text-sm text-gray-600">
                              <span>
                                {numOfChildren}{" "}
                                {numOfChildren > 1 ? "Children" : "Child"}
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
                                  if (stay.capacity) {
                                    if (
                                      numOfAdults + numOfChildren <
                                      stay.capacity
                                    ) {
                                      setNumOfChildren(numOfChildren + 1);
                                    }
                                  } else {
                                    setNumOfChildren(numOfChildren + 1);
                                  }
                                }}
                                className="w-8 h-8 rounded-full flex items-center cursor-pointer justify-center bg-white shadow-lg text-gray-600"
                              >
                                +
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dialogue>
                  </div>
                  <div className="flex justify-around gap-2 mb-24">
                    {inCart && (
                      <Button
                        onClick={() => {
                          router.push({ pathname: "/cart" });
                        }}
                        className={
                          "!bg-transparent !w-[48%] !text-black relative border-2 border-pink-500 "
                        }
                      >
                        View in basket
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          version="1.1"
                        >
                          <title>bag</title>
                          <desc>Created with Sketch.</desc>
                          <defs />
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Artboard-4"
                              transform="translate(-620.000000, -291.000000)"
                            >
                              <g
                                id="94"
                                transform="translate(620.000000, 291.000000)"
                              >
                                <rect
                                  id="Rectangle-40"
                                  stroke="#333333"
                                  strokeWidth="2"
                                  x="4"
                                  y="7"
                                  width="16"
                                  height="16"
                                  rx="1"
                                />
                                <path
                                  d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                                  id="Oval-21"
                                  stroke="#333333"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <rect
                                  id="Rectangle-41"
                                  fill="#333333"
                                  x="5"
                                  y="18"
                                  width="14"
                                  height="2"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </Button>
                    )}

                    {
                      <Button
                        onClick={addToBasket}
                        disabled={
                          !addToCartDate || (addToCartDate && !addToCartDate.to)
                        }
                        className={
                          "!bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white " +
                          (!inCart ? "!w-full" : "!w-[48%]") +
                          (!addToCartDate ||
                          (addToCartDate && !addToCartDate.to)
                            ? " !opacity-70 cursor-not-allowed"
                            : "")
                        }
                      >
                        {!inCart && !stay.is_an_event
                          ? "Add to basket"
                          : !inCart && stay.is_an_event
                          ? "Book now"
                          : "Add again"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white ml-2"
                          viewBox="0 0 24 24"
                          version="1.1"
                        >
                          <title>bag</title>
                          <desc>Created with Sketch.</desc>
                          <defs />
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Artboard-4"
                              transform="translate(-620.000000, -291.000000)"
                            >
                              <g
                                id="94"
                                transform="translate(620.000000, 291.000000)"
                              >
                                <rect
                                  id="Rectangle-40"
                                  stroke="#fff"
                                  strokeWidth="2"
                                  x="4"
                                  y="7"
                                  width="16"
                                  height="16"
                                  rx="1"
                                />
                                <path
                                  d="M16,10 L16,5 C16,2.790861 14.209139,1 12,1 C9.790861,1 8,2.790861 8,5 L8,10"
                                  id="Oval-21"
                                  stroke="#fff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <rect
                                  id="Rectangle-41"
                                  fill="#fff"
                                  x="5"
                                  y="18"
                                  width="14"
                                  height="2"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <div
                          className={
                            " " + (!addToBasketLoading ? "hidden" : "ml-2")
                          }
                        >
                          <LoadingSpinerChase
                            width={16}
                            height={16}
                            color="#fff"
                          ></LoadingSpinerChase>
                        </div>
                      </Button>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {router.query.checkout_page === "1" && (
          <div className="mt-[120px] md:mt-[140px] max-w-[1080px] mx-auto">
            <div className="flex md:flex-row flex-col gap-4 px-4">
              <div className="md:w-[40%] md:px-2 md:h-[90vh] mt-0 md:sticky top-[80px]">
                <div
                  onClick={() => {
                    router.back();
                  }}
                  className="flex gap-1 mb-3 font-bold cursor-pointer items-center text-black"
                >
                  <Icon className="w-6 h-6" icon="bx:chevron-left" />
                  <span>Back</span>
                </div>
                <div className="h-fit shadow-lg border px-4 py-4 w-full rounded-lg">
                  <div className="flex h-28 gap-2">
                    <div className="relative h-full bg-gray-300 w-32 rounded-xl overflow-hidden">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={stay.stay_images[0].image}
                        unoptimized={true}
                        alt="Main image of the order"
                      ></Image>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="text-gray-600 text-xs uppercase">
                        {stay.location}
                      </h1>
                      <h1 className="font-bold">{stay.name}</h1>
                      <h1 className="text-sm">
                        {stay.type_of_rooms[Number(router.query.room_type)] &&
                          stay.type_of_rooms[Number(router.query.room_type)]
                            .name}
                      </h1>
                      <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                        <Icon icon="akar-icons:clock" />{" "}
                        {new Date(router.query.end_date).getDate() -
                          new Date(router.query.starting_date).getDate()}{" "}
                        nights
                      </p>
                      {/* {trip.starting_location && (
                        <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                          Starting from {trip.starting_location}
                        </p>
                      )} */}
                    </div>
                  </div>
                  <div className="h-[0.6px] w-full bg-gray-500 mt-10 mb-4"></div>
                  <h1 className="font-bold text-2xl font-OpenSans">
                    Breakdown
                  </h1>

                  <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="flex gap-1.5 items-center w-[70%]">
                        Check-in
                      </div>

                      <div className="text-sm font-bold">
                        {moment(new Date(router.query.starting_date)).format(
                          "DD MMM YYYY"
                        )}
                      </div>
                    </div>

                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="flex gap-1.5 items-center w-[70%]">
                        Check-out
                      </div>

                      <div className="text-sm font-bold">
                        {moment(new Date(router.query.end_date)).format(
                          "DD MMM YYYY"
                        )}
                      </div>
                    </div>

                    {router.query.transport !== "0" && (
                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 items-center w-[70%]">
                          <span>
                            Transport({router.query.passengers}{" "}
                            {Number(router.query.passengers) > 1
                              ? "passengers"
                              : "passenger"}
                            )
                          </span>
                          <PopoverBox
                            btnPopover={<Icon icon="bx:help-circle" />}
                            btnClassName="flex items-center justify-center"
                            panelClassName="bg-gray-100 rounded-lg p-2 bottom-[100%] -left-[10px] w-[180px]"
                          >
                            <div className="text-sm text-gray-500">
                              <span>
                                This transport is a{" "}
                                {selected.name.toLowerCase()} from{" "}
                                {router.query.transport === "1"
                                  ? stay.car_transfer_starting_location
                                  : router.query.transport === "2"
                                  ? stay.bus_transfer_starting_location
                                  : ""}{" "}
                                to{" "}
                                {router.query.transport === "1"
                                  ? stay.car_transfer_end_location
                                  : router.query.transport === "2"
                                  ? stay.bus_transfer_end_location
                                  : ""}
                                .{" "}
                              </span>
                            </div>
                          </PopoverBox>
                        </div>

                        <div className="text-sm font-bold">{selected.name}</div>
                      </div>
                    )}

                    <span className="lowercase hidden">
                      {stay.location && stay.country ? " " : ""}
                    </span>

                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="text-sm font-bold underline">
                        <BreakDown></BreakDown>
                      </div>
                    </div>

                    <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                    <div className="flex flex-col gap-3 justify-between w-full items-center">
                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 text-sm items-center w-[70%]">
                          Room price per night
                        </div>

                        <div className="text-sm font-bold">
                          {stay.type_of_rooms[
                            Number(router.query.room_type)
                          ] && (
                            <Price
                              currency="KES"
                              stayPrice={
                                stay.type_of_rooms[
                                  Number(router.query.room_type)
                                ].price
                              }
                              className="!text-sm"
                            ></Price>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 text-sm items-center w-[70%]">
                          <span>
                            {Number(router.query.rooms) +
                              (Number(router.query.rooms) > 1
                                ? " rooms"
                                : " room")}
                          </span>

                          <span> x </span>

                          <span>
                            {new Date(router.query.end_date).getDate() -
                              new Date(router.query.starting_date).getDate() +
                              (new Date(router.query.end_date).getDate() -
                                new Date(router.query.starting_date).getDate() >
                              1
                                ? " nights"
                                : " night")}
                          </span>
                        </div>

                        <div className="text-sm font-bold">
                          <Price
                            currency="KES"
                            stayPrice={
                              totalPriceOfStay(
                                stay.type_of_rooms[
                                  Number(router.query.room_type)
                                ].price
                              ) -
                              (selected.name.toLowerCase() == "van"
                                ? stay.car_transfer_price * passengers
                                : selected.name.toLowerCase() == "bus"
                                ? stay.bus_transfer_price * passengers
                                : 0)
                            }
                            className="!text-sm"
                          ></Price>
                        </div>
                      </div>

                      {router.query.transport !== "0" && (
                        <div className="text-gray-600 flex items-center w-full justify-between">
                          <div className="flex gap-1.5 text-sm items-center w-[70%]">
                            Transport
                          </div>

                          <div className="text-sm font-bold">
                            <Price
                              currency="KES"
                              stayPrice={
                                selected.name.toLowerCase() == "van"
                                  ? stay.car_transfer_price *
                                    Number(router.query.passengers)
                                  : selected.name.toLowerCase() == "bus"
                                  ? stay.bus_transfer_price *
                                    Number(router.query.passengers)
                                  : 0
                              }
                              className="!text-sm"
                            ></Price>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="flex gap-1.5 items-center">
                        Total price
                      </div>

                      <Price
                        currency="KES"
                        stayPrice={totalPriceOfStay(
                          stay.type_of_rooms[Number(router.query.room_type)]
                            .price
                        )}
                        className="!text-black !text-base"
                      ></Price>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-[60%] w-full md:pl-4">
                <div className="h-[0.4px] w-[100%] my-4 bg-gray-400 md:hidden"></div>

                <h1 className="font-bold text-2xl mb-4 font-OpenSans">
                  Your details
                </h1>
                <div className="my-4 flex flex-col">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex md:flex-row flex-col items-center gap-4 w-full">
                      <div className="w-full relative">
                        <label className="block text-sm font-bold mb-2">
                          First name
                        </label>
                        <Input
                          name="first_name"
                          type="text"
                          placeholder="First name"
                          errorStyle={
                            formik.touched.first_name &&
                            formik.errors.first_name
                              ? true
                              : false
                          }
                          className={"w-full "}
                          {...formik.getFieldProps("first_name")}
                        ></Input>

                        {formik.touched.first_name &&
                        formik.errors.first_name ? (
                          <span className="text-sm  font-bold text-red-400">
                            {formik.errors.first_name}
                          </span>
                        ) : null}
                        <p className="text-gray-500 text-sm mt-1">
                          Please give us the name of one of the people staying
                          in this room.
                        </p>
                      </div>
                      <div className="w-full self-start relative">
                        <Input
                          name="last_name"
                          type="text"
                          placeholder="Last name"
                          label="Last name"
                          className={"w-full "}
                          errorStyle={
                            formik.touched.last_name && formik.errors.last_name
                              ? true
                              : false
                          }
                          {...formik.getFieldProps("last_name")}
                        ></Input>
                        {formik.touched.last_name && formik.errors.last_name ? (
                          <span className="text-sm absolute -bottom-6 font-bold text-red-400">
                            {formik.errors.last_name}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div
                      className={
                        "mb-4 " +
                        (formik.errors.last_name || formik.errors.first_name
                          ? "mb-4"
                          : "")
                      }
                    ></div>
                    <Input
                      name="email"
                      type="email"
                      errorStyle={
                        formik.touched.email && formik.errors.email
                          ? true
                          : false
                      }
                      placeholder="Email"
                      label="Email"
                      {...formik.getFieldProps("email")}
                    ></Input>
                    {formik.touched.email && formik.errors.email ? (
                      <span className="text-sm mt-3 font-bold text-red-400">
                        {formik.errors.email}
                      </span>
                    ) : null}
                    <p className="text-gray-500 text-sm mt-1">
                      We’ll send your confirmation email to this address. Please
                      make sure it&apos;s valid.
                    </p>

                    <div className="mt-4">
                      <label className="block text-sm font-bold mb-2">
                        Cell phone number
                      </label>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={setPhone}
                        defaultCountry="KE"
                      />

                      {invalidPhone && (
                        <p className="text-sm mt-1 text-red-500">
                          Invalid phone number.
                        </p>
                      )}
                    </div>
                  </form>
                </div>
                <div className="mt-6">
                  <div className="h-[0.4px] w-[100%] bg-gray-400 my-6"></div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col gap-2">
                      <div className="font-bold">Send a message</div>
                      {!message && (
                        <div className="text-sm text-gray-600">
                          Let us know of any additional information you have
                        </div>
                      )}

                      {message && (
                        <div className="text-sm text-gray-600">{message}</div>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setShowMessage(!showMessage);
                      }}
                      className="p-2 rounded-full cursor-pointer border-transparent border flex items-center justify-center hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-linear"
                    >
                      {!message && (
                        <Icon className="w-5 h-5" icon="fluent:add-16-filled" />
                      )}
                      {message && (
                        <Icon className="w-5 h-5" icon="clarity:pencil-solid" />
                      )}
                    </div>
                  </div>

                  <div className="h-[0.4px] w-[100%] bg-gray-400 my-6"></div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-bold text-xl mb-2">Pay with Mpesa</h1>
                      <div className="relative w-20 h-16">
                        <Image
                          className="w-full h-full"
                          layout="fill"
                          unoptimized={true}
                          objectFit="fit"
                          alt="Image"
                          src="/images/128px-M-PESA_LOGO-01.svg.png"
                        ></Image>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-4">
                      <h1 className="text-lg text-center">
                        Please enter the following for payment
                      </h1>
                      <div className="flex justify-between items-center">
                        <h1 className="font-bold">Paybill Number</h1>
                        <p>329329</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h1 className="font-bold">Account Number</h1>
                        <p>0102479992200</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h1 className="font-bold">Amount to Pay</h1>
                        <Price
                          currency="KES"
                          stayPrice={totalPriceOfStay(
                            stay.type_of_rooms[Number(router.query.room_type)]
                              .price
                          )}
                          className="!text-black !text-base"
                        ></Price>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex flex-col gap-1">
                        <Input
                          name="confirmation_code"
                          type="text"
                          errorStyle={
                            formik.touched.confirmation_code &&
                            formik.errors.confirmation_code
                              ? true
                              : false
                          }
                          placeholder="Confirmation code"
                          label="Please type in the mpesa confirmation code"
                          {...formik.getFieldProps("confirmation_code")}
                        ></Input>
                        {formik.touched.confirmation_code &&
                        formik.errors.confirmation_code ? (
                          <span className="text-sm mt-1 font-bold text-red-400">
                            {formik.errors.confirmation_code}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Dialogue
                    isOpen={showMessage}
                    closeModal={() => {
                      setShowMessage(false);
                    }}
                    dialoguePanelClassName="!max-w-md !h-[400px]"
                    title={"Add a message"}
                    dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
                  >
                    <div>
                      <textarea
                        className="w-full h-[220px] p-2 border rounded-lg resize-none outline-none"
                        placeholder="Add a message"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                      ></textarea>

                      <div
                        onClick={() => {
                          setMessage("");
                        }}
                        className="text-sm underline cursor-pointer mt-2"
                      >
                        Clear message
                      </div>

                      <div
                        onClick={() => {
                          setShowMessage(false);
                        }}
                        className="font-bold w-full py-3 cursor-pointer mt-2 bg-gray-700 rounded-lg text-center text-white"
                      >
                        Save
                      </div>
                    </div>
                  </Dialogue>

                  <Dialogue
                    isOpen={showCheckoutResponseModal}
                    closeModal={() => {
                      setShowCheckoutResponseModal(false);
                      router.back();
                    }}
                    dialoguePanelClassName="!max-w-md !h-[265px]"
                    title={"Thanks for booking this stay"}
                    dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
                  >
                    <div>
                      Thank you for booking!!!🥳. We&apos;ll get back to you in
                      less than 24 hours. We are confirming all the details of
                      the stay.
                    </div>

                    <div className="mt-4">Meanwhile...</div>

                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => {
                          router.replace("/gondwana");
                        }}
                        className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                      >
                        <span>Back to Gondwana</span>
                      </Button>

                      <Button
                        onClick={() => {
                          router.replace("/");
                        }}
                        className="flex w-[40%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
                      >
                        <span>Check out Winda</span>
                      </Button>
                    </div>
                  </Dialogue>

                  <div className="mt-8">
                    <Button
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                      className="flex w-[150px] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                    >
                      <span>Book this stay</span>

                      <div className={" " + (loading ? "ml-1.5 " : " hidden")}>
                        <LoadingSpinerChase
                          width={13}
                          height={13}
                          color="white"
                        ></LoadingSpinerChase>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

StaysDetail.propTypes = {};

export async function getServerSideProps(context) {
  let exist = false;
  try {
    const token = getToken(context);
    let cart = getCart(context);

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

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      exist = data.results.some((val) => {
        return val.stay.slug === context.query.slug;
      });

      const stay = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${context.query.slug}/`,
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
          inCart: exist,
        },
      };
    } else if (cart) {
      cart = JSON.parse(decodeURIComponent(cart));

      exist = cart.some((val) => {
        return val.slug === context.query.slug;
      });

      return {
        props: {
          userProfile: "",
          stay: stay.data,
          inCart: exist,
        },
      };
    }

    return {
      props: {
        userProfile: "",
        stay: stay.data,
        inCart: exist,
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
    } else if (error.response.status === 404) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          userProfile: "",
          stay: "",
          inCart: exist,
        },
      };
    }
  }
}

export default StaysDetail;
