import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Element } from "react-scroll";
import { createGlobalStyle } from "styled-components";
import { Transition } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { useFormik } from "formik";
import { usePaystackPayment } from "react-paystack";
import * as Yup from "yup";
import { Mixpanel } from "../../../lib/mixpanelconfig";
import { Link as ReactScrollLink } from "react-scroll";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Navbar from "../../../components/ui/Navbar";
import ImageGallery from "../../../components/Stay/ImageGallery";
import Price from "../../../components/Stay/Price";
import Button from "../../../components/ui/Button";
import getToken from "../../../lib/getToken";
import Map from "../../../components/Stay/Map";
import ListItem from "../../../components/ui/ListItem";
import ReviewOverview from "../../../components/Stay/ReviewOverview";
import Reviews from "../../../components/Stay/Reviews";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Share from "../../../components/Stay/Share";
import getCart from "../../../lib/getCart";
import Footer from "../../../components/Home/Footer";
import ScrollTo from "../../../components/Stay/ScrollTo";
import moment from "moment";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import "swiper/css";
import "swiper/css/thumbs";
import Amenities from "../../../components/Stay/Amenities";
import Dialogue from "../../../components/Home/Dialogue";
import PopoverBox from "../../../components/ui/Popover";
import ReactPaginate from "react-paginate";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Carousel from "../../../components/ui/Carousel";
import Input from "../../../components/ui/Input";

const StaysDetail = ({ userProfile, stay }) => {
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
  .BeaconFabButtonFrame {
    @media (max-width: 768px) {
      bottom: 70px !important;
    }
  }
  .hsds-beacon .eTCLra {
    @media (max-width: 768px) {
      bottom: 70px !important;
    }
  }
`;

  const router = useRouter();

  const [showAllDescription, setShowAllDescription] = useState(false);
  const [showAllUniqueFeature, setShowAllUniqueFeature] = useState(false);

  const [showAllReviews, setShowAllReviews] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [filteredReviews, setFilteredReviews] = useState(null);

  const [reviewLoading, setReviewLoading] = useState(false);

  const [liked, setLiked] = useState(stay.has_user_saved);

  const [showShare, setShowShare] = useState(false);

  const [reviewCount, setReviewCount] = useState(0);

  const [reviewPageSize, setReviewPageSize] = useState(0);

  const [filterRateVal, setFilterRateVal] = useState(0);

  const [scrollRef, inView, entry] = useInView({
    rootMargin: "70px 0px",
  });

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

  const [guestPopup, setGuestPopup] = useState(false);

  const [showMessage, setShowMessage] = useState(false);

  const [message, setMessage] = useState("");

  const [showCheckoutResponseModal, setShowCheckoutResponseModal] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingForPaystack, setLoadingForPaystack] = useState(false);

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
      if (isValidPhoneNumber(phone || "")) {
        setLoading(true);
        axios
          .post(
            `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/create-event/`,
            {
              first_name: values.first_name,
              last_name: values.last_name,
              email: values.email,
              message: message,
              type_of_room:
                stay.type_of_rooms[Number(router.query.room_type)].name,
              confirmation_code: values.confirmation_code,
              phone: phone,
              adults: Number(router.query.adults),
              rooms: stay.type_of_rooms[Number(router.query.room_type)]
                .is_tented_camp
                ? 0
                : Number(router.query.rooms),
              passengers: Number(router.query.passengers) || 0,
              from_date: new Date(router.query.starting_date),
              to_date: new Date(router.query.end_date),
              transport: Number(router.query.transport) || 0,
            }
          )
          .then((res) => {
            Mixpanel.track("Event accommodation paid", {
              name_of_accommodation: stay.name,
            });
            setLoading(false);
            setShowCheckoutResponseModal(true);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else if (!isValidPhoneNumber(phone || "")) {
        setLoading(false);
        setInvalidPhone(true);
      }
    },
  });

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
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

  const getDisabledDates = () => {
    return stay.unavailable_dates
      ? stay.unavailable_dates.map((date) => {
          return new Date(date);
        })
      : [];
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
    from: router.query.starting_date
      ? new Date(router.query.starting_date)
      : new Date(),
    to: router.query.end_date
      ? new Date(router.query.end_date)
      : new Date().setDate(new Date().getDate() + 1),
  });

  function SelectDate({ close }) {
    return (
      <div className="w-full">
        <DayPicker
          mode="range"
          disabled={[{ before: new Date() }, ...getDisabledDates()]}
          selected={eventDate}
          onSelect={(date) => {
            if (date) {
              setEventDate(date);
            }
          }}
          numberOfMonths={2}
          className="rounded-lg !w-full p-4"
        />
      </div>
    );
  }

  const checkAvailabilityForOptions = () => {
    router.replace(
      {
        query: {
          ...router.query,
          starting_date: moment(eventDate.from).format("YYYY-MM-DD"),
          end_date: moment(eventDate.to).format("YYYY-MM-DD"),
        },
      },
      undefined,
      { scroll: false }
    );
  };

  function OptionBreakDown() {
    const nights =
      new Date(router.query.end_date).getDate() -
      new Date(router.query.starting_date).getDate();
    const adults = Number(router.query.adults);

    return nights + (nights > 1 ? " nights" : " night");
  }

  useEffect(() => {
    if (process.browser) {
      window.Beacon("init", process.env.NEXT_PUBLIC_BEACON_ID);
    }
  }, []);

  const lodgeOnlyBtnClicked = () => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date:
          (router.query.starting_date &&
            moment(new Date(router.query.starting_date)).format(
              "YYYY-MM-DD"
            )) ||
          moment(new Date()).format("YYYY-MM-DD"),
        end_date:
          (router.query.end_date &&
            moment(new Date(router.query.end_date)).format("YYYY-MM-DD")) ||
          moment(new Date().setDate(new Date().getDate() + 1)).format(
            "YYYY-MM-DD"
          ),
        checkout_page: 2,
        option: 1,
      },
    });
  };

  const FullBoardPackageBtnClicked = () => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date:
          (router.query.starting_date &&
            moment(new Date(router.query.starting_date)).format(
              "YYYY-MM-DD"
            )) ||
          moment(new Date()).format("YYYY-MM-DD"),
        end_date:
          (router.query.end_date &&
            moment(new Date(router.query.end_date)).format("YYYY-MM-DD")) ||
          moment(new Date().setDate(new Date().getDate() + 1)).format(
            "YYYY-MM-DD"
          ),
        checkout_page: 2,
        option: 3,
      },
    });
  };

  const GamePackageBtnClicked = () => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date:
          (router.query.starting_date &&
            moment(new Date(router.query.starting_date)).format(
              "YYYY-MM-DD"
            )) ||
          moment(new Date()).format("YYYY-MM-DD"),
        end_date:
          (router.query.end_date &&
            moment(new Date(router.query.end_date)).format("YYYY-MM-DD")) ||
          moment(new Date().setDate(new Date().getDate() + 1)).format(
            "YYYY-MM-DD"
          ),
        checkout_page: 2,
        option: 2,
      },
    });
  };

  const allInclusiveBtnClicked = () => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date:
          (router.query.starting_date &&
            moment(new Date(router.query.starting_date)).format(
              "YYYY-MM-DD"
            )) ||
          moment(new Date()).format("YYYY-MM-DD"),
        end_date:
          (router.query.end_date &&
            moment(new Date(router.query.end_date)).format("YYYY-MM-DD")) ||
          moment(new Date().setDate(new Date().getDate() + 1)).format(
            "YYYY-MM-DD"
          ),
        checkout_page: 2,
        option: 4,
      },
    });
  };

  const otherOptionBtnClicked = (index) => {
    router.push({
      query: {
        ...router.query,
        adults: Number(router.query.adults) || 1,
        rooms: Number(router.query.rooms) || 1,
        starting_date:
          (router.query.starting_date &&
            moment(new Date(router.query.starting_date)).format(
              "YYYY-MM-DD"
            )) ||
          moment(new Date()).format("YYYY-MM-DD"),
        end_date:
          (router.query.end_date &&
            moment(new Date(router.query.end_date)).format("YYYY-MM-DD")) ||
          moment(new Date().setDate(new Date().getDate() + 1)).format(
            "YYYY-MM-DD"
          ),
        checkout_page: 2,
        option: 5,
        other_option: index,
      },
    });
  };

  const numberOfNights =
    new Date(router.query.end_date).getDate() -
      new Date(router.query.starting_date).getDate() || 1;

  const getFullBoardPackageImage = () => {
    const sortedImages = stay.private_safari
      ? stay.private_safari.private_safari_images.sort(
          (x, y) => y.main - x.main
        )
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getStayImages = () => {
    const sortedImages = stay.stay_images.sort((x, y) => y.main - x.main);

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getGamePackageImages = () => {
    const sortedImages = stay.shared_safari
      ? stay.shared_safari.shared_safari_images.sort((x, y) => y.main - x.main)
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getAllInclusiveImages = () => {
    const sortedImages = stay.all_inclusive
      ? stay.all_inclusive.all_inclusive_images.sort((x, y) => y.main - x.main)
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getOtherOptionImages = (option) => {
    const sortedImages = option
      ? option.other_option_images.sort((x, y) => y.main - x.main)
      : [];

    const images = sortedImages.map((image) => {
      return image.image;
    });
    return images;
  };

  const getAllOtherOptionImages = () => {
    const sortedImages = [];

    stay.other_options.forEach((option) => {
      const options = option.other_option_images.map((image) => {
        return image.image;
      });
      sortedImages.push(...options);
    });

    return sortedImages;
  };

  const FullBoardPackageCard = () => {
    const images = getFullBoardPackageImage();
    return (
      <div className="w-full sm:w-[280px] h-fit pb-2 border rounded-2xl shadow-lg">
        <div className={"w-full relative h-[170px] "}>
          <Carousel
            images={images}
            imageClass="rounded-tl-2xl rounded-tr-2xl"
          ></Carousel>
        </div>

        <div className="px-2 mt-2">
          <h1 className="font-black">Full board package </h1>

          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

          <div className="flex justify-between mt-2">
            <div className="flex flex-col w-full gap-0.5">
              <h1 className="text-gray-600">accommodation and all meals</h1>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

          <div className="mt-2">
            <Button
              onClick={() => {
                FullBoardPackageBtnClicked();
              }}
              className="btn-gradient !rounded-full font-bold w-full mt-2"
            >
              Book now -{"  "}
              <Price
                className="!font-bold !text-sm ml-1 mr-0.5"
                stayPrice={stay.private_safari.price * numberOfNights}
              ></Price>{" "}
              <div className="text-sm ">
                ({numberOfNights} {numberOfNights > 1 ? "nights" : "night"} )
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const GamePackageCard = () => {
    const images = getGamePackageImages();
    return (
      <div className="w-full sm:w-[280px] h-fit pb-2 border rounded-2xl shadow-lg">
        <div className={"w-full relative h-[170px] "}>
          <Carousel
            images={images}
            imageClass="rounded-tl-2xl rounded-tr-2xl"
          ></Carousel>
        </div>

        <div className="px-2 mt-2">
          <h1 className="font-black">Game package</h1>

          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

          <div className="flex justify-between mt-2">
            <div className="flex flex-col w-full gap-0.5">
              <h1 className="text-gray-600">
                accommodation, all meals, and game drives
              </h1>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>
          <div className="mt-2">
            <Button
              onClick={() => {
                GamePackageBtnClicked();
              }}
              className="btn-gradient !rounded-full font-bold w-full mt-2"
            >
              Book now -{"  "}
              <Price
                className="!font-bold !text-sm ml-1 mr-0.5"
                stayPrice={stay.shared_safari.price * numberOfNights}
              ></Price>
              <div className="text-sm ">
                ({numberOfNights} {numberOfNights > 1 ? "nights" : "night"} )
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const AllInclusive = () => {
    const images = getAllInclusiveImages();
    return (
      <div className="w-full sm:w-[280px] h-fit pb-2 border rounded-2xl shadow-lg">
        <div className={"w-full relative h-[170px] "}>
          <Carousel
            images={images}
            imageClass="rounded-tl-2xl rounded-tr-2xl"
          ></Carousel>
        </div>

        <div className="px-2 mt-2">
          <h1 className="font-black">All Inclusive</h1>

          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

          <div className="flex justify-between mt-2">
            <div className="flex flex-col w-full gap-0.5">
              <h1 className="text-gray-600">
                accommodation, all meals, game drives, and drinks ie. sodas,
                juice, tea coffee, and some alcoholic drinks
              </h1>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>
          <div className="mt-2">
            <Button
              onClick={() => {
                allInclusiveBtnClicked();
              }}
              className="btn-gradient !rounded-full font-bold w-full mt-2"
            >
              Book now -{"  "}
              <Price
                className="!font-bold !text-sm ml-1 mr-0.5"
                stayPrice={stay.all_inclusive.price * numberOfNights}
              ></Price>
              <div className="text-sm ">
                ({numberOfNights} {numberOfNights > 1 ? "nights" : "night"} )
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const OtherOption = ({ option, index }) => {
    const images = getOtherOptionImages(option);
    return (
      <div className="w-full sm:w-[280px] h-fit pb-2 border rounded-2xl shadow-lg">
        <div className={"w-full relative h-[170px] "}>
          <Carousel
            images={images}
            imageClass="rounded-tl-2xl rounded-tr-2xl"
          ></Carousel>
        </div>

        <div className="px-2 mt-2">
          <h1 className="font-black">{option.title}</h1>

          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>

          <div className="flex justify-between mt-2">
            <div className="flex flex-col w-full gap-0.5">
              <h1 className="text-gray-600">{option.about}</h1>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-200 mt-2"></div>
          <div className="mt-2">
            <Button
              onClick={() => {
                otherOptionBtnClicked(index);
              }}
              className="btn-gradient !rounded-full font-bold w-full mt-2"
            >
              Book now -{"  "}
              <Price
                className="!font-bold !text-sm ml-1 mr-0.5"
                stayPrice={option.price * numberOfNights}
              ></Price>
              <div className="text-sm ">
                ({numberOfNights} {numberOfNights > 1 ? "nights" : "night"} )
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const getOptionPrice = () => {
    return router.query.option === "2"
      ? stay.shared_safari.price
      : router.query.option === "3"
      ? stay.private_safari.price
      : router.query.option === "4"
      ? stay.all_inclusive.price
      : router.query.option === "5"
      ? stay.other_options[Number(router.query.other_option)].price
      : 0;
  };

  const formatOptionPrice = () => {
    let price =
      getOptionPrice() * numberOfNights +
      getOptionPrice() * numberOfNights * 0.038;

    price = !userIsFromKenya ? price : price * priceConversionRate;

    return parseInt(
      (Math.floor(price * 100) / 100).toFixed(2).replace(".", ""),
      10
    );
  };

  const currency = process.env.NODE_ENV === "development" ? "GHS" : "USD";

  const optionConfig = {
    reference: new Date().getTime().toString(),
    email: formik.values.email,
    amount: formatOptionPrice(),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: userIsFromKenya ? "KES" : currency,
    channels: ["card", "mobile_money"],
  };

  const initializePaymentForOption = usePaystackPayment(optionConfig);

  const optionOnSuccess = (reference) => {
    if (isValidPhoneNumber(phone || "")) {
      setLoadingForPaystack(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/create-lodge-package/`,
          {
            first_name: formik.values.first_name,
            last_name: formik.values.last_name,
            email: formik.values.email,
            message: message,
            type_of_package:
              router.query.option === "2"
                ? "Game package"
                : router.query.option === "3"
                ? "Full board"
                : router.query.option === "4"
                ? "All inclusive"
                : router.query.option === "5"
                ? stay.other_options[Number(router.query.other_option)].title
                : "Lodge only",
            phone: phone,
            from_date: new Date(router.query.starting_date),
            to_date: new Date(router.query.end_date),
            paid: true,
          }
        )
        .then((res) => {
          Mixpanel.track("Lodge package paid", {
            name_of_lodge: stay.name,
          });
          setLoadingForPaystack(false);
          setShowCheckoutResponseModal(true);
        })
        .catch((err) => {
          setLoadingForPaystack(false);
        });
    } else if (!isValidPhoneNumber(phone || "")) {
      setLoadingForPaystack(false);
      setInvalidPhone(true);
    }
  };

  const [dontShowBookBtn, setDontShowBookBtn] = useState(false);

  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const showAllPhotosBtn = () => {
    setShowAllPhotos(true);
  };

  const getAllImages = () => {
    const images = [
      ...getStayImages(),
      ...getFullBoardPackageImage(),
      ...getGamePackageImages(),
      ...getAllInclusiveImages(),
      ...getAllOtherOptionImages(),
    ];

    return images;
  };

  const installmentPrice = () => {
    let price = (getOptionPrice() * numberOfNights) / 3;
    return price;
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
          <title>{stay.property_name || stay.name}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <GlobalStyle></GlobalStyle>

        <div className="sticky md:fixed top-0 w-full bg-white z-20">
          <div className="sticky bg-white top-0 left-0 right-0 z-50">
            <Navbar userProfile={userProfile} showBookNowBtn={false}></Navbar>
          </div>

          {router.query.checkout_page !== "1" &&
            router.query.checkout_page !== "2" && (
              <Transition
                enter="transition-all ease-in duration-150"
                leave="transition-all ease-out duration-150"
                enterFrom="opacity-0 scale-50"
                enterTo="opacity-100 scale-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-50"
                show={!inView}
                className={
                  "h-[60px] bg-white z-20 px-4 border-t border-b left-0 right-0 flex w-full "
                }
              >
                <ScrollTo
                  guestPopup={guestPopup}
                  stay={stay}
                  setDontShowBookBtn={setDontShowBookBtn}
                ></ScrollTo>
              </Transition>
            )}
        </div>

        {router.query.checkout_page !== "1" &&
          router.query.checkout_page !== "2" && (
            <div className="flex flex-col relative md:flex-row justify-around h-full w-full">
              <div className={"w-full"}>
                <div className="!relative" name="about">
                  <div className={"mt-4 md:mt-[98px] px-3"}>
                    <div className="text-sm text-gray-600 font-medium flex items-center">
                      <div>
                        <div className="inline transition-colors duration-200 ease-in-out">
                          {stay.country}
                        </div>{" "}
                        <span className="mx-1">/</span>
                      </div>
                      <div>
                        <div className="inline transition-colors duration-200 ease-in-out">
                          {stay.city}
                        </div>{" "}
                        <span className="mx-1">/</span>{" "}
                      </div>
                      <div className="inline transition-colors duration-200 ease-in-out">
                        {stay.location}
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {stay.name || stay.property_name}
                    </div>
                  </div>

                  <div className={"-ml-8 -mr-0"}>
                    <ImageGallery
                      allSortedImages={getAllImages()}
                    ></ImageGallery>

                    <div className="flex absolute bg-white px-3 rounded-3xl py-1 top-[80px] right-3 gap-2 items-center">
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

                    <div
                      onClick={() => {
                        showAllPhotosBtn();
                      }}
                      className="px-2 cursor-pointer text-sm font-bold absolute top-[350px] sm:top-[400px] md:top-[450px] rounded-lg right-3 z-10 py-1.5 bg-white border flex items-center justify-center gap-1"
                    >
                      <Icon className="w-6 h-6" icon="gg:menu-grid-o" />
                      <h1>Show all photos</h1>
                    </div>
                  </div>

                  <div
                    className={
                      (guestPopup ? " !z-0 " : " ") +
                      (stay.is_an_event
                        ? "h-[60px] bg-white z-10 border-t border-b flex left-0 right-0 "
                        : "h-[60px] border-b border-gray-200 w-[100%] px-3 lg:px-10 ") +
                      (isSafari
                        ? "top-[68px] md:top-[108px]"
                        : "md:top-[115.25px] top-[72.25px]")
                    }
                    ref={scrollRef}
                  >
                    <ScrollTo
                      guestPopup={guestPopup}
                      stay={stay}
                      setDontShowBookBtn={setDontShowBookBtn}
                    ></ScrollTo>
                  </div>

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

                  <Dialogue
                    isOpen={showAllPhotos}
                    closeModal={() => {
                      setShowAllPhotos(false);
                    }}
                    outsideDialogueClass="!p-0"
                    dialoguePanelClassName={
                      "!p-0 !rounded-none overflow-y-scroll h-[100vh] bg-white !min-w-full "
                    }
                  >
                    <div className="py-4 px-4 flex items-center gap-4 border-b">
                      <div
                        onClick={() => {
                          setShowAllPhotos(false);
                        }}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer border border-black bg-white flex items-center justify-center"
                      >
                        <Icon icon="iconoir:cancel" className="w-6 h-6" />
                      </div>
                      <h1 className="font-black text-xl">{stay.name}</h1>
                    </div>

                    <div className="my-6">
                      <h1 className="font-black ml-8 text-2xl">All photos</h1>

                      <div className="lg:px-8 w-full gap-2 mt-6 flex flex-wrap justify-between">
                        {getAllImages().map((image, index) => (
                          <div
                            key={index}
                            className="w-full sm:w-[49%] h-[300px] relative"
                          >
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={image}
                              alt="Image of the lodge and it's various options"
                            ></Image>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Dialogue>

                  {/* about */}

                  <div className={"mt-4 "}>
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
                          </div>
                        )}
                      </div>

                      <Transition
                        enter="transition-opacity duration-75"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        show={!dontShowBookBtn}
                      >
                        <div
                          className={
                            "w-full z-10 px-4 md:px-12 border-t md:hidden fixed bottom-0 safari-bottom left-0 right-0 bg-white py-1 "
                          }
                        >
                          <div className="flex justify-between items-center gap-2">
                            <ReactScrollLink
                              className="cursor-pointer w-full flex items-center justify-center text-sm btn-gradient px-2 py-2 text-white font-bold rounded-md"
                              to="options"
                              spy={true}
                              smooth={true}
                              offset={-400}
                              duration={500}
                            >
                              <span>Book now</span>
                            </ReactScrollLink>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <div className={"mt-6 px-4"}>
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
                    <div className={"pt-10 px-4"}>
                      <h1 className="font-black text-xl mb-5">
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
                      "flex flex-col md:flex-row gap-3 justify-between pt-10 px-4"
                    }
                  >
                    <div className="">
                      {stay.inclusions.length > 0 && (
                        <>
                          <div className="mb-3">
                            <span className="font-black text-xl">
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
                        <span className="font-black text-lg">Extras</span>
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

                      {!showMoreActivities &&
                        stay.extras_included.length > 5 && (
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

                      {showMoreActivities &&
                        stay.extras_included.length > 5 && (
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
                    "flex flex-col md:flex-row gap-3 justify-between pt-10 px-4"
                  }
                >
                  <div className="w-full">
                    <div className="mb-3">
                      <span className="font-black text-xl">Amenities</span>
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

                {stay.has_options && (
                  <Element name="options" className="mt-6">
                    <div className="flex flex-col gap-3 pt-10 px-4">
                      <h1 className="font-black text-xl">
                        Pick an option that suits you
                      </h1>

                      <div className="my-2 flex flex-wrap gap-3">
                        <div className="">
                          <PopoverBox
                            btnPopover={
                              <div className="border cursor-pointer border-gray-600 flex items-center gap-2 px-3 py-2">
                                <Icon
                                  icon="fontisto:date"
                                  className="w-6 h-6"
                                />
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
                            checkAvailabilityForOptions();
                          }}
                          className="px-3 flex py-4 cursor-pointer self-start items-center justify-center btn-gradient w-fit text-white font-bold rounded-md"
                        >
                          Check availability
                        </div>
                      </div>

                      <div className="flex flex-col mt-4 items-center gap-8">
                        <div className="flex flex-wrap w-full gap-6">
                          {stay.private_safari && (
                            <FullBoardPackageCard></FullBoardPackageCard>
                          )}
                          {stay.shared_safari && (
                            <GamePackageCard></GamePackageCard>
                          )}

                          {stay.all_inclusive && <AllInclusive></AllInclusive>}

                          {stay.other_options.map((option, index) => (
                            <OtherOption
                              option={option}
                              index={index}
                              key={index}
                            ></OtherOption>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Element>
                )}

                <Element name="policies" className={"w-full pt-12 px-4"}>
                  <h1 className="font-black text-xl mb-2">Policies</h1>

                  <div className="mt-4">
                    <div className="py-2 px-2 border-b border-gray-100">
                      <span className="font-semibold">Cancellation Policy</span>
                    </div>

                    <div className="mt-2 ml-2 flex flex-col gap-2">
                      <ListItem>
                        You should have CV-19 travel insurance
                      </ListItem>
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
                        The guest is liable for any damages caused by them
                        during their stay.
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
                  <div className={"px-4"}>
                    <div className="text-xl font-black">Map</div>
                    <div className="mt-1 mb-4 text-sm text-gray-600">
                      Detailed location provided after booking
                    </div>
                  </div>
                  <Map
                    longitude={stay.longitude}
                    latitude={stay.latitude}
                  ></Map>
                </Element>

                {/* reviews */}
                <Element name="reviews" className={"pt-24 px-4"}>
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
            </div>
          )}

        {router.query.checkout_page === "2" && (
          <div className="mt-5 md:mt-[70px] py-5 max-w-[1080px] mx-auto">
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
                        src={
                          router.query.option === "2"
                            ? getGamePackageImages()[0]
                            : router.query.option === "3"
                            ? getFullBoardPackageImage()[0]
                            : router.query.option === "4"
                            ? getAllInclusiveImages()[0]
                            : router.query.option === "5"
                            ? getOtherOptionImages(
                                stay.other_options[
                                  Number(router.query.other_option)
                                ]
                              )[0]
                            : stay.stay_images.length > 0
                            ? stay.stay_images[0].image
                            : ""
                        }
                        alt="Main image of the order"
                      ></Image>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="text-gray-600 text-xs uppercase">
                        {stay.location}
                      </h1>
                      <h1 className="font-bold">
                        {stay.property_name || stay.name}
                      </h1>
                      <h1 className="text-sm">
                        {router.query.option === "2"
                          ? "Game package"
                          : router.query.option === "3"
                          ? "Full board"
                          : router.query.option === "4"
                          ? "All inclusive"
                          : router.query.option === "5"
                          ? stay.other_options[
                              Number(router.query.other_option)
                            ].title
                          : "Lodge only"}
                      </h1>
                      <p className="mt-0.5 text-sm text-gray-600 flex items-center gap-1">
                        <Icon icon="akar-icons:clock" />{" "}
                        {new Date(router.query.end_date).getDate() -
                          new Date(router.query.starting_date).getDate()}{" "}
                        nights
                      </p>
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

                    <span className="lowercase hidden">
                      {stay.location && stay.country ? " " : ""}
                    </span>

                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="text-sm font-bold underline">
                        <OptionBreakDown></OptionBreakDown>
                      </div>
                    </div>

                    <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                    <div className="flex flex-col gap-3 justify-between w-full items-center">
                      <div className="text-gray-600 flex items-center w-full justify-between">
                        <div className="flex gap-1.5 text-sm items-center w-[70%]">
                          Price per night
                        </div>

                        <div className="text-sm font-bold">
                          <Price
                            stayPrice={getOptionPrice()}
                            className="!text-sm !text-gray-600"
                          ></Price>
                        </div>
                      </div>
                    </div>

                    <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

                    <div className="text-gray-600 flex items-center w-full justify-between">
                      <div className="flex gap-1.5 items-center">
                        Total price
                      </div>

                      <Price
                        stayPrice={getOptionPrice() * numberOfNights}
                        className="!text-black !text-base"
                      ></Price>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-[60%] w-full md:pl-4">
                <div className="h-[0.4px] w-[100%] my-4 bg-gray-400 md:hidden"></div>

                <h1 className="font-bold font-SourceSans text-2xl mb-4">
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
                    title={"Thanks for booking this lodge"}
                    dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
                  >
                    <div>
                      Thank you for booking!!!🥳. We&apos;ll get back to you in
                      less than 24 hours. We are confirming all the details of
                      the lodge.
                    </div>

                    <div className="mt-4">Meanwhile...</div>

                    <div className="flex gap-2 w-full">
                      <Button
                        onClick={() => {
                          router.back();
                        }}
                        className="flex w-[40%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
                      >
                        <span>Go back</span>
                      </Button>

                      <Button
                        onClick={() => {
                          router.replace("/");
                        }}
                        className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold btn-gradient !text-white"
                      >
                        <span>Check out Winda</span>
                      </Button>
                    </div>
                  </Dialogue>

                  <div className="flex justify-between items-center">
                    <h1 className="font-bold">Price</h1>

                    <Price
                      stayPrice={getOptionPrice() * numberOfNights}
                      className="!text-base"
                    ></Price>
                  </div>

                  <div className="flex justify-between mt-3 items-center">
                    <h1 className="font-bold">Card processing fees (3.8%)</h1>

                    <Price
                      stayPrice={getOptionPrice() * numberOfNights * 0.038}
                      className="!text-base"
                    ></Price>
                  </div>

                  <div className="flex justify-between mt-3 items-center">
                    <h1 className="font-bold">Total price</h1>

                    <Price
                      stayPrice={
                        getOptionPrice() * numberOfNights +
                        getOptionPrice() * numberOfNights * 0.038
                      }
                      className="!text-base"
                    ></Price>
                  </div>

                  <div className="mt-4 mb-3">
                    <Button
                      onClick={() => {
                        formik.setTouched({
                          first_name: true,
                          last_name: true,
                          email: true,
                          confirmation_code: false,
                        });
                        if (isValidPhoneNumber(phone || "")) {
                          setInvalidPhone(false);
                          formik.validateForm().then(() => {
                            initializePaymentForOption(optionOnSuccess);
                          });
                        } else {
                          setInvalidPhone(true);
                        }
                      }}
                      type="submit"
                      className="flex w-full mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold btn-gradient !text-white"
                    >
                      <span>Pay now</span>
                      <Icon icon="bxs:lock-alt" className="w-5 h-5" />

                      <div
                        className={
                          " " + (loadingForPaystack ? "ml-1.5 " : " hidden")
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

                  {/* <div className="mt-4 flex justify-between items-center w-full">
                    <div className="w-[47%] h-[1px] bg-gray-200"></div>
                    <h1 className="text-sm font-bold">Or</h1>
                    <div className="w-[47%] h-[1px] bg-gray-200"></div>
                  </div>

                  <div className="mt-4">
                    <h1 className="font-bold font-SourceSans text-2xl">
                      Pay in installment
                    </h1>

                    <div className="flex justify-between items-center">
                      <h1 className="font-bold">Total Price</h1>

                      <Price
                        stayPrice={getOptionPrice() * numberOfNights}
                        className="!text-base"
                      ></Price>
                    </div>

                    <div className="flex justify-between mt-3 items-center">
                      <h1 className="font-bold">Amount to pay now</h1>

                      <Price
                        stayPrice={installmentPrice() * 0.038}
                        className="!text-base"
                      ></Price>
                    </div>

                    <div className="flex justify-between mt-3 items-center">
                      <h1 className="font-bold">Card processing fees (3.8%)</h1>

                      <Price
                        stayPrice={getOptionPrice() * numberOfNights * 0.038}
                        className="!text-base"
                      ></Price>
                    </div>
                  </div> */}
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
