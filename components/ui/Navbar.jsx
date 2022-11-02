import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Popover, Transition, Dialog } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import styles from "../../styles/StyledLink.module.css";
import UserDropdown from "../Home/UserDropdown";
import Button from "./Button";
import PopoverBox from "./Popover";
import { Icon } from "@iconify/react";
import Burger from "./Burger";
import Dialogue from "../Home/Dialogue";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { InlineWidget } from "react-calendly";

function Navbar({ userProfile }) {
  const [curatedTripsHover, setCuratedTripsHover] = useState(true);
  const [staysHover, setStaysHover] = useState(false);
  const [activitiesHover, setActivitiesHover] = useState(false);

  const [isShowingExplore, setIsShowingExplore] = useState(false);
  const [openBurger, setOpenBurger] = useState(false);

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const router = useRouter();

  function Item({ title, subText, icon, href }) {
    const [showIcon, setShowIcon] = useState(false);

    return (
      <Link href={href}>
        <a className="w-full md:w-[46%]">
          <div
            onMouseEnter={() => {
              setShowIcon(true);
            }}
            onMouseLeave={() => {
              setShowIcon(false);
            }}
            className="flex w-full mt-2 gap-2 items-center cursor-pointer"
          >
            <div className="w-12 h-10 flex items-center justify-center rounded-lg bg-red-600 bg-opacity-30">
              <Icon icon={icon} className="w-7 h-7 text-red-700" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h1 className="font-bold">{title}</h1>
                <Transition
                  enter="transition-all duration-300"
                  enterFrom="opacity-0 scale-0"
                  enterTo="opacity-100 scale-100"
                  leave="transition-all duration-300"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-0"
                  show={showIcon}
                >
                  <Icon icon="bx:right-arrow-alt" className="mt-0.5" />
                </Transition>
              </div>
              <p className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300">
                {subText}
              </p>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  const handleCheck = (event) => {
    if (event.target.checked) {
      setOpenBurger(true);
    } else {
      setOpenBurger(false);
    }
  };

  const [swiper, setSwiper] = useState(null);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };

  const changeCurrency = (currency) => {
    Cookies.set("currency", currency);
    Cookies.set("defaultCurrency", "0");
    router.reload();
  };

  const [currency, setCurrency] = useState(Cookies.get("currency"));

  useEffect(() => {
    if (Cookies.get("defaultCurrency") !== "0") {
      setCurrency(userIsFromKenya ? "KES" : null);
    }
  }, [userIsFromKenya]);

  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <div>
      <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 py-5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <a className="relative w-28 h-9 cursor-pointer">
              <Image
                layout="fill"
                alt="Logo"
                src="/images/winda_logo/horizontal-blue-font.png"
                priority
              ></Image>
            </a>
          </Link>

          <Popover className={"hidden md:block"}>
            <Popover.Button className={"outline-none "}>
              <div
                onMouseEnter={() => {
                  setIsShowingExplore(true);
                }}
                onMouseLeave={() => {
                  setIsShowingExplore(false);
                }}
                onClick={() => {
                  setIsShowingExplore(!isShowingExplore);
                }}
                className="items-center flex gap-3"
              >
                <div
                  className={
                    "font-bold cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-linear rounded-3xl px-2 py-2 !text-base flex items-center gap-1 " +
                    styles.link
                  }
                >
                  <span>Explore our services</span>
                  <Icon icon="bx:chevron-down" className="w-6 h-6" />
                </div>
              </div>
            </Popover.Button>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              show={isShowingExplore}
              onMouseEnter={() => setIsShowingExplore(true)}
              onMouseLeave={() => setIsShowingExplore(false)}
            >
              <Popover.Panel
                className={
                  "absolute z-[30] bg-white rounded-xl border-4 border-gray-100 md:right-0 shadow-md lg:left-[60px] mt-2 md:w-full lg:w-[850px] overflow-hidden"
                }
              >
                <div className="flex">
                  <div className="w-[300px] pr-1 cursor-pointer bg-gray-100">
                    <div
                      className={
                        "px-3 py-2 rounded-lg relative swiper-button-next " +
                        (curatedTripsHover
                          ? "bg-white transition-all duration-300 ease-in-out"
                          : "")
                      }
                      onMouseOver={() => {
                        setCuratedTripsHover(true);
                        setStaysHover(false);
                        setActivitiesHover(false);
                      }}
                      onClick={() => {
                        setCuratedTripsHover(true);
                        setStaysHover(false);
                        setActivitiesHover(false);
                      }}
                    >
                      <h1 className="font-bold">Curated trips</h1>
                      <p className="mt-2 text-sm text-gray-600">
                        We created curated trips meant for you to create those
                        special moments.
                      </p>
                    </div>

                    <div
                      className={
                        "mt-3 px-3 py-2 rounded-lg " +
                        (staysHover
                          ? "bg-white transition-all duration-300 ease-in-out"
                          : "")
                      }
                      onMouseOver={() => {
                        setCuratedTripsHover(false);
                        setStaysHover(true);
                        setActivitiesHover(false);
                      }}
                      onClick={() => {
                        setCuratedTripsHover(false);
                        setStaysHover(true);
                        setActivitiesHover(false);
                      }}
                    >
                      <h1 className="font-bold">Stays</h1>
                      <p className="mt-2 text-sm text-gray-600">
                        Explore our large number of carefully selected stays.
                      </p>
                    </div>

                    <div
                      className={
                        "mt-3 px-3 py-2 rounded-lg " +
                        (activitiesHover
                          ? "bg-white transition-all duration-300 ease-in-out"
                          : "")
                      }
                      onMouseOver={() => {
                        setCuratedTripsHover(false);
                        setStaysHover(false);
                        setActivitiesHover(true);
                      }}
                      onClick={() => {
                        setCuratedTripsHover(false);
                        setStaysHover(false);
                        setActivitiesHover(true);
                      }}
                    >
                      <h1 className="font-bold">Activites</h1>
                      <p className="mt-2 text-sm text-gray-600">
                        Find an activity that suits your budget and taste.
                      </p>
                    </div>
                  </div>

                  <div className="w-[550px] relative px-6 py-2">
                    <Transition
                      as={React.Fragment}
                      enter="transition-all duration-300"
                      enterFrom="opacity-0 absolute top-[50px]"
                      enterTo="opacity-100 absolute top-[6px]"
                      leave="transition-all duration-300"
                      leaveFrom="opacity-100 absolute top-[6px]"
                      leaveTo="opacity-0 absolute top-[50px]"
                      show={curatedTripsHover}
                    >
                      <div className="flex w-full flex-wrap items-center justify-between gap-3">
                        {/* <div className="flex w-[46%] gap-2 items-center cursor-pointer">
                      <div className="w-12 h-10 flex items-center justify-center rounded-lg bg-blue-600 bg-opacity-30">
                        <Icon
                          icon="carbon:agriculture-analytics"
                          className="w-7 h-7 text-blue-700"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h1 className="font-bold">Cultural</h1>
                        <p className="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300">
                          Curated cultural trips
                        </p>
                      </div>
                    </div> */}

                        <Item
                          icon="carbon:agriculture-analytics"
                          title="Cultural"
                          subText="Curated cultural trips"
                          href="/trip?tag=cultural"
                        ></Item>

                        <Item
                          icon="icon-park-outline:oval-love-two"
                          title="Romantic"
                          subText="Curated romantic trips"
                          href="/trip?tag=romantic"
                        ></Item>

                        <Item
                          icon="bi:calendar-week"
                          title="Weekend getaway"
                          subText="Curated weekend getaway trips"
                          href="/trip?tag=weekend_getaway"
                        ></Item>

                        <Item
                          icon="fluent:clipboard-day-20-regular"
                          title="Day trip"
                          subText="Curated day trips"
                          href="/trip?tag=day_trips"
                        ></Item>

                        <Item
                          icon="carbon:pedestrian-family"
                          title="Family"
                          subText="Curated family trips"
                          href="/trip?tag=family"
                        ></Item>

                        <Item
                          icon="akar-icons:people-group"
                          title="Group"
                          subText="Curated group trips"
                          href="/trip?tag=groups"
                        ></Item>

                        <Item
                          icon="bx:trip"
                          title="Road trip"
                          subText="Curated road trips"
                          href="/trip?tag=road_trip"
                        ></Item>

                        <Item
                          icon="fe:app-menu"
                          title="View all"
                          subText="View all curated trips"
                          href="/trip"
                        ></Item>
                      </div>
                    </Transition>

                    <Transition
                      as={React.Fragment}
                      enter="transition-all duration-300"
                      enterFrom="opacity-0 absolute top-[50px]"
                      enterTo="opacity-100 absolute top-[6px]"
                      leave="transition-all duration-300"
                      leaveFrom="opacity-100 absolute top-[6px]"
                      leaveTo="opacity-0 absolute top-[50px]"
                      show={staysHover}
                    >
                      <div className="flex w-full flex-wrap items-center justify-between gap-3">
                        <Item
                          icon="bx:bed"
                          title="Lodge"
                          subText="Available lodges"
                          href="/stays?type_of_stay=LODGE"
                        ></Item>

                        <Item
                          icon="carbon:campsite"
                          title="Campsite"
                          subText="Available campsites"
                          href="/stays?type_of_stay=CAMPSITE"
                        ></Item>

                        <Item
                          icon="fontisto:tent"
                          title="Tented campsite"
                          subText="Available tented campsites"
                          href="/stays?type_of_stay=TENTED CAMP"
                        ></Item>

                        <Item
                          icon="akar-icons:star"
                          title="Unique space"
                          subText="Available unique spaces"
                          href="/stays?type_of_stay=UNIQUE SPACE"
                        ></Item>

                        <Item
                          icon="tabler:report-money"
                          title="Budget"
                          subText="Available budget stays"
                          href="/stays?pricing_type=REASONABLE"
                        ></Item>

                        <Item
                          icon="material-symbols:price-change-outline-sharp"
                          title="Mid-range"
                          subText="Available mid-range stays"
                          href="/stays?pricing_type=MID-RANGE"
                        ></Item>

                        <Item
                          icon="cil:diamond"
                          title="Luxury"
                          subText="Available luxury stays"
                          href="/stays?pricing_type=HIGH-END"
                        ></Item>

                        <Item
                          icon="fe:app-menu"
                          title="View all"
                          subText="View all stays"
                          href="/stays"
                        ></Item>
                      </div>
                    </Transition>

                    <Transition
                      as={React.Fragment}
                      enter="transition-all duration-300"
                      enterFrom="opacity-0 absolute top-[50px]"
                      enterTo="opacity-100 absolute top-[6px]"
                      leave="transition-all duration-300"
                      leaveFrom="opacity-100 absolute top-[6px]"
                      leaveTo="opacity-0 absolute top-[50px]"
                      show={activitiesHover}
                    >
                      <div className="flex w-full flex-wrap items-center justify-between gap-3">
                        <Item
                          icon="tabler:report-money"
                          title="Budget"
                          subText="Available budget activities"
                          href="/activities?pricing_type=REASONABLE"
                        ></Item>

                        <Item
                          icon="material-symbols:price-change-outline-sharp"
                          title="Mid-range"
                          subText="Available Mid-range activities"
                          href="/activities?pricing_type=MID-RANGE"
                        ></Item>

                        <Item
                          icon="cil:diamond"
                          title="Luxury"
                          subText="Available luxury activities"
                          href="/activities?pricing_type=HIGH-END"
                        ></Item>

                        <Item
                          icon="fe:app-menu"
                          title="View all"
                          subText="View all activities"
                          href="/activities"
                        ></Item>
                      </div>
                    </Transition>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <div
              onClick={() => {
                setShowCalendly(true);
              }}
              className="flex items-center gap-0.5 px-4 py-3 !bg-gradient-to-r from-pink-500 via-red-500 !rounded-3xl to-yellow-500"
            >
              <span className="ml-2 text-white text-sm font-bold cursor-pointer">
                Travel concierge
              </span>
            </div>

            <div></div>
            {/* <Link href="/trip">
              <a>
                <Button
                  onClick={() => {
                    Mixpanel.track("Clicked view all curated trips button");
                  }}
                  className="flex items-center gap-4 max-w-[360px] !py-3 !bg-gradient-to-r from-pink-500 via-red-500 !rounded-3xl to-yellow-500"
                >
                  <span className="font-bold">Explore all trips</span>
                </Button>
              </a>
            </Link>
            <Link href="/login">
              <a className="font-bold">Login</a>
            </Link> */}
          </div>

          <div className="md:hidden">
            <div
              onClick={() => {
                setOpenBurger(!openBurger);
              }}
            >
              <Burger></Burger>
            </div>

            <Transition appear as={React.Fragment} show={openBurger}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={() => {
                  setOpenBurger(false);
                }}
              >
                <div className="fixed bottom-0 left-0 right-0 overflow-y-auto">
                  <div
                    className={"flex items-end justify-center p-0 text-center "}
                  >
                    <Dialog.Panel
                      className={
                        "w-full transform overflow-hidden bg-white screen-height-safari text-left border-t align-middle shadow-xl transition-all !rounded-none relative overflow-y-scroll remove-scroll "
                      }
                    >
                      <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div
                          onClick={() => {
                            setOpenBurger(false);
                          }}
                          className="w-full py-2 bg-black text-white bg-opacity-50 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Icon
                            icon="icon-park-outline:close-one"
                            className="mt-0.5"
                          />
                          <span className="font-bold">close</span>
                        </div>
                      </Transition.Child>
                      <Swiper
                        preventInteractionOnTransition={true}
                        allowTouchMove={false}
                        onSwiper={(swiper) => {
                          setSwiper(swiper);
                        }}
                        onSlideChange={(swiper) => {}}
                        modules={[Navigation]}
                        className="!h-full"
                      >
                        <SwiperSlide className="overflow-y-scroll p-2 remove-scroll ">
                          <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <div className="px-2 py-3 bg-gray-100 rounded-md flex flex-col">
                              <div className="py-2 border-b">
                                <h1 className="font-bold">
                                  Explore our services
                                </h1>
                              </div>

                              <div
                                onClick={() => {
                                  slideto(1);
                                  setCuratedTripsHover(true);
                                  setStaysHover(false);
                                  setActivitiesHover(false);
                                }}
                                className="flex items-center justify-between mt-3 cursor-pointer"
                              >
                                <div className="flex flex-col gap-1">
                                  <h1 className="font-bold">Curated trips</h1>
                                  <p className="mt-2 text-sm text-gray-600">
                                    We created curated trips meant for you to
                                    create those special moments.
                                  </p>
                                </div>

                                <Icon
                                  icon="bx:chevron-right"
                                  className="w-8 h-8"
                                />
                              </div>

                              <div
                                onClick={() => {
                                  slideto(1);
                                  setCuratedTripsHover(false);
                                  setStaysHover(true);
                                  setActivitiesHover(false);
                                }}
                                className="flex items-center justify-between mt-5 cursor-pointer"
                              >
                                <div className="flex flex-col gap-1">
                                  <h1 className="font-bold">Stays</h1>
                                  <p className="mt-2 text-sm text-gray-600">
                                    Explore our large number of carefully
                                    selected stays.
                                  </p>
                                </div>

                                <Icon
                                  icon="bx:chevron-right"
                                  className="w-8 h-8"
                                />
                              </div>

                              <div
                                onClick={() => {
                                  slideto(1);
                                  setCuratedTripsHover(false);
                                  setStaysHover(false);
                                  setActivitiesHover(true);
                                }}
                                className="flex items-center justify-between mt-5 cursor-pointer"
                              >
                                <div className="flex flex-col gap-1">
                                  <h1 className="font-bold">Activites</h1>
                                  <p className="mt-2 text-sm text-gray-600">
                                    Find an activity that suits your budget and
                                    taste.
                                  </p>
                                </div>

                                <Icon
                                  icon="bx:chevron-right"
                                  className="w-8 h-8"
                                />
                              </div>
                            </div>
                          </Transition.Child>
                        </SwiperSlide>

                        <SwiperSlide className="overflow-y-scroll p-2 remove-scroll">
                          <div
                            onClick={() => {
                              slideto(0);
                            }}
                            className="bg-white cursor-pointer flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-black"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <h3 className="font-bold text-black">Back</h3>
                          </div>
                          <div className="px-2 mt-3">
                            {curatedTripsHover && (
                              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                                <Item
                                  icon="carbon:agriculture-analytics"
                                  title="Cultural"
                                  subText="Curated cultural trips"
                                  href="/trip?tag=cultural"
                                ></Item>

                                <Item
                                  icon="icon-park-outline:oval-love-two"
                                  title="Romantic"
                                  subText="Curated romantic trips"
                                  href="/trip?tag=romantic"
                                ></Item>

                                <Item
                                  icon="bi:calendar-week"
                                  title="Weekend getaway"
                                  subText="Curated weekend getaway trips"
                                  href="/trip?tag=weekend_getaway"
                                ></Item>

                                <Item
                                  icon="fluent:clipboard-day-20-regular"
                                  title="Day trip"
                                  subText="Curated day trips"
                                  href="/trip?tag=day_trips"
                                ></Item>

                                <Item
                                  icon="carbon:pedestrian-family"
                                  title="Family"
                                  subText="Curated family trips"
                                  href="/trip?tag=family"
                                ></Item>

                                <Item
                                  icon="akar-icons:people-group"
                                  title="Group"
                                  subText="Curated group trips"
                                  href="/trip?tag=groups"
                                ></Item>

                                <Item
                                  icon="bx:trip"
                                  title="Road trip"
                                  subText="Curated road trips"
                                  href="/trip?tag=road_trip"
                                ></Item>

                                <Item
                                  icon="fe:app-menu"
                                  title="View all"
                                  subText="View all curated trips"
                                  href="/trip"
                                ></Item>
                              </div>
                            )}

                            {staysHover && (
                              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                                <Item
                                  icon="bx:bed"
                                  title="Lodge"
                                  subText="Available lodges"
                                  href="/stays?type_of_stay=LODGE"
                                ></Item>

                                <Item
                                  icon="carbon:campsite"
                                  title="Campsite"
                                  subText="Available campsites"
                                  href="/stays?type_of_stay=CAMPSITE"
                                ></Item>

                                <Item
                                  icon="fontisto:tent"
                                  title="Tented campsite"
                                  subText="Available tented campsites"
                                  href="/stays?type_of_stay=TENTED CAMP"
                                ></Item>

                                <Item
                                  icon="akar-icons:star"
                                  title="Unique space"
                                  subText="Available unique spaces"
                                  href="/stays?type_of_stay=UNIQUE SPACE"
                                ></Item>

                                <Item
                                  icon="tabler:report-money"
                                  title="Budget"
                                  subText="Available budget stays"
                                  href="/stays?pricing_type=REASONABLE"
                                ></Item>

                                <Item
                                  icon="material-symbols:price-change-outline-sharp"
                                  title="Mid-range"
                                  subText="Available mid-range stays"
                                  href="/stays?pricing_type=MID-RANGE"
                                ></Item>

                                <Item
                                  icon="cil:diamond"
                                  title="Luxury"
                                  subText="Available luxury stays"
                                  href="/stays?pricing_type=HIGH-END"
                                ></Item>

                                <Item
                                  icon="fe:app-menu"
                                  title="View all"
                                  subText="View all stays"
                                  href="/stays"
                                ></Item>
                              </div>
                            )}

                            {activitiesHover && (
                              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                                <Item
                                  icon="tabler:report-money"
                                  title="Budget"
                                  subText="Available budget activities"
                                  href="/activities?pricing_type=REASONABLE"
                                ></Item>

                                <Item
                                  icon="material-symbols:price-change-outline-sharp"
                                  title="Mid-range"
                                  subText="Available Mid-range activities"
                                  href="/activities?pricing_type=MID-RANGE"
                                ></Item>

                                <Item
                                  icon="cil:diamond"
                                  title="Luxury"
                                  subText="Available luxury activities"
                                  href="/activities?pricing_type=HIGH-END"
                                ></Item>

                                <Item
                                  icon="fe:app-menu"
                                  title="View all"
                                  subText="View all activities"
                                  href="/activities"
                                ></Item>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </Dialog.Panel>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>

          <Dialogue
            isOpen={showCalendly}
            closeModal={() => {
              setShowCalendly(false);
            }}
            title="Travel concierge"
            dialogueTitleClassName="!font-bold !ml-4 !text-xl md:!text-2xl"
            outsideDialogueClass="!p-0"
            dialoguePanelClassName="screen-height-safari !rounded-none md:!rounded-md md:!min-h-0 md:max-h-[700px] !px-0 !max-w-6xl overflow-y-scroll remove-scroll"
          >
            <div className="">
              <InlineWidget url="https://calendly.com/ndiko/winda-guide-custom-trip" />
            </div>

            <div className="fixed top-3 right-4 flex flex-col">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendly(false);
                }}
                className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </Dialogue>

          <PopoverBox
            btnPopover={
              <>
                {(!currency || currency === "USD") && (
                  <div className="flex mt-1 items-center underline font-bold">
                    <Icon icon="fxemoji:heavydollarsign" />
                    <span className="text-sm">USD</span>
                  </div>
                )}

                {currency && currency === "KES" && (
                  <div className="flex mt-1 items-center underline font-bold">
                    <span className="text-sm">KES</span>
                  </div>
                )}
              </>
            }
            panelClassName="bg-white w-[200px] mt-0.5 py-0.5 right-0 rounded-sm shadow-md"
          >
            <div className="text-sm px-2 py-1 bg-gray-200 font-bold">
              Change currency
            </div>
            <div
              onClick={() => {
                changeCurrency("KES");
              }}
              className="px-2 py-1 hover:bg-gray-50 transition-colors duration-150 ease-linear cursor-pointer text-sm"
            >
              Kenyan shilling - KES
            </div>
            <div
              onClick={() => {
                changeCurrency("USD");
              }}
              className="px-2 py-1 hover:bg-gray-50 transition-colors duration-150 ease-linear cursor-pointer text-sm"
            >
              United States Dollar - USD
            </div>
          </PopoverBox>
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {};

export default Navbar;
