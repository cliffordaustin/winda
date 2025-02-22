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
import NavbarCurrency from "./NavbarCurrency";

function Navbar({ userProfile, showTripWizard = false }) {
  const [curatedTripsHover, setCuratedTripsHover] = useState(true);
  const [showLocationsHover, setShowLocationsHover] = useState(false);
  const [showBeachLocationsHover, setShowBeachLocationsHover] = useState(false);
  const [eventHover, setEventHover] = useState(false);
  const [staysHover, setStaysHover] = useState(false);
  const [activitiesHover, setActivitiesHover] = useState(false);

  const [isShowingExplore, setIsShowingExplore] = useState(false);
  const [isShowingEvents, setIsShowingEvents] = useState(false);
  const [isShowingLocations, setIsShowingLocations] = useState(false);
  const [isShowingLocationsBeach, setIsShowingLocationsBeach] = useState(false);
  const [openBurger, setOpenBurger] = useState(false);

  const router = useRouter();

  function Item({ title, subText, icon, href, safariAndBeach = false }) {
    const [showIcon, setShowIcon] = useState(false);

    return (
      <Link href={href}>
        <a
          className={
            "hover:bg-gray-100 transition-colors duration-500 rounded-lg " +
            (safariAndBeach ? "w-full md:w-[46%]" : "w-full md:w-[46%]")
          }
        >
          <div
            onClick={() => {
              if (safariAndBeach) {
                Mixpanel.track("Safari and beach selected", {
                  location: title,
                });
              } else {
                Mixpanel.track(
                  "Selected a tag for travel theme from homepage",
                  {
                    tag: title,
                  }
                );
              }
            }}
            onMouseEnter={() => {
              setShowIcon(true);
            }}
            onMouseLeave={() => {
              setShowIcon(false);
            }}
            className="flex w-full py-2 px-2 gap-2 items-center cursor-pointer"
          >
            <div
              className={
                "w-12 h-10 flex items-center justify-center rounded-lg bg-opacity-30 " +
                (safariAndBeach ? "bg-red-600" : "bg-red-600")
              }
            >
              <Icon
                icon={icon}
                className={
                  "w-7 h-7 " +
                  (safariAndBeach ? "text-red-700" : "text-red-700")
                }
              />
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

  const settings = {
    spaceBetween: 10,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const [swiper, setSwiper] = useState(null);

  const slideto = (index) => {
    if (swiper) {
      swiper.slideToLoop(index);
    }
  };

  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <div>
      <div className="flex items-center border-b justify-between sm:px-8 px-6 md:px-6 lg:px-12 py-5">
        <div className="flex items-center md:gap-2 lg:gap-12">
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
          <div className="flex items-center lg:gap-2">
            {/* <Popover className={"hidden md:block"}>
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
            </Popover> */}

            {/* <Popover className={"hidden md:block"}>
              <Popover.Button className={"outline-none "}>
                <div
                  onMouseEnter={() => {
                    setIsShowingLocations(true);
                  }}
                  onMouseLeave={() => {
                    setIsShowingLocations(false);
                  }}
                  onClick={() => {
                    setIsShowingLocations(!isShowingLocations);
                  }}
                  className="items-center flex gap-3"
                >
                  <div
                    className={
                      "font-bold cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-linear rounded-3xl px-2 py-2 !text-base flex items-center gap-1 " +
                      styles.link
                    }
                  >
                    <span>Safari</span>
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
                show={isShowingLocations}
                onMouseEnter={() => setIsShowingLocations(true)}
                onMouseLeave={() => setIsShowingLocations(false)}
              >
                <Popover.Panel
                  className={
                    "absolute z-[30] bg-white rounded-xl border-4 border-gray-100 md:right-0 shadow-md md:left-[20px] lg:left-[60px] mt-2 max-w-xl overflow-hidden"
                  }
                >
                  <div className="flex">
                    <div className="w-full relative px-2 py-2">
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
                        <div className="flex w-full flex-wrap items-center justify-between gap-1">
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Amboseli"
                            subText=""
                            href="/trip?location=amboseli"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Rwanda"
                            subText=""
                            href="/trip?location=rwanda"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Uganda"
                            subText=""
                            href="/trip?location=uganda"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Tanzania"
                            subText=""
                            href="/trip?location=tanzania"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Mara"
                            subText=""
                            href="/trip?location=mara"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Naivasha"
                            subText=""
                            href="/trip?location=naivasha"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Nakuru"
                            subText=""
                            href="/trip?location=nakuru"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Ol Pejeta"
                            subText=""
                            href="/trip?location=ol pejeta"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Samburu"
                            subText=""
                            href="/trip?location=samburu"
                          ></Item>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            <Popover className={"hidden md:block"}>
              <Popover.Button className={"outline-none "}>
                <div
                  onMouseEnter={() => {
                    setIsShowingLocationsBeach(true);
                  }}
                  onMouseLeave={() => {
                    setIsShowingLocationsBeach(false);
                  }}
                  onClick={() => {
                    setIsShowingLocationsBeach(!isShowingLocationsBeach);
                  }}
                  className="items-center flex gap-3"
                >
                  <div
                    className={
                      "font-bold cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-linear rounded-3xl px-2 py-2 !text-base flex items-center gap-1 " +
                      styles.link
                    }
                  >
                    <span>Beach</span>
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
                show={isShowingLocationsBeach}
                onMouseEnter={() => setIsShowingLocationsBeach(true)}
                onMouseLeave={() => setIsShowingLocationsBeach(false)}
              >
                <Popover.Panel
                  className={
                    "absolute z-[30] bg-white rounded-xl border-4 border-gray-100 md:right-0 shadow-md md:left-[20px] lg:left-[60px] mt-2 max-w-xl overflow-hidden"
                  }
                >
                  <div className="flex">
                    <div className="w-full relative px-2 py-2">
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
                        <div className="flex w-full flex-wrap items-center justify-between gap-1">
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Diani"
                            subText=""
                            href="/trip?location=diani"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Watamu"
                            subText=""
                            href="/trip?location=watamu"
                          ></Item>
                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Kilifi"
                            subText=""
                            href="/trip?location=kilifi"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Lamu"
                            subText=""
                            href="/trip?location=lamu"
                          ></Item>

                          <Item
                            icon="ic:sharp-location-on"
                            safariAndBeach={true}
                            title="Zanzibar"
                            subText=""
                            href="/trip?location=zanzibar"
                          ></Item>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

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
                    <span>Travel theme</span>
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
                    "absolute z-[30] bg-white rounded-xl border-4 border-gray-100 md:right-0 shadow-md md:left-[20px] lg:left-[60px] mt-2 w-fit overflow-hidden"
                  }
                >
                  <div className="flex">
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
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            <Popover className={"hidden md:block"}>
              <Popover.Button className={"outline-none "}>
                <div
                  onMouseEnter={() => {
                    setIsShowingEvents(true);
                  }}
                  onMouseLeave={() => {
                    setIsShowingEvents(false);
                  }}
                  onClick={() => {
                    setIsShowingEvents(!isShowingEvents);
                  }}
                  className="items-center flex gap-3"
                >
                  <div
                    className={
                      "font-bold cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-linear rounded-3xl px-2 py-2 !text-base flex items-center gap-1 " +
                      styles.link
                    }
                  >
                    <span>Events</span>
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
                show={isShowingEvents}
                onMouseEnter={() => setIsShowingEvents(true)}
                onMouseLeave={() => setIsShowingEvents(false)}
              >
                <Popover.Panel
                  className={
                    "absolute z-[30] bg-white rounded-xl border-4 border-gray-100 md:right-0 shadow-md md:left-[200px] lg:left-[380px] mt-2 w-fit overflow-hidden"
                  }
                >
                  <div className="flex">
                    <div className="w-[300px] flex-col gap-3 relative px-2 py-2">
                      <div className="flex w-full flex-wrap items-center justify-between gap-3">
                        <Link href="/events/kaleidoscope">
                          <a className="flex flex-col px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 w-full gap-2">
                            <h1 className="text-base font-bold">
                              Kakeidoscope
                            </h1>
                            <div className="px-2 rounded-2xl text-sm font-bold w-fit bg-green-400 text-white">
                              Available
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover> */}

            {/* <Link href="/blogs">
              <a className="hidden md:block">
                <div
                  className={
                    "font-bold cursor-pointertransition-all duration-300 cursor-pointer ease-linear rounded-3xl py-2 !text-base flex items-center gap-1 " +
                    styles.link
                  }
                >
                  Blog
                </div>
              </a>
            </Link> */}
          </div>
        </div>
        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Transition
              enter="transition-all ease-in duration-150"
              leave="transition-all ease-out duration-150"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
              show={showTripWizard}
            >
              <div
                onClick={() => {
                  router.push("/trip-wizard");
                  Mixpanel.track("Clicked on trip wizard");
                }}
                className="flex items-center gap-0.5 px-2 lg:px-4 py-2 cursor-pointer border-gradient"
              >
                <span className="text-black text-sm font-bold">
                  Trip wizard
                </span>
              </div>
            </Transition>

            <div
              onClick={() => {
                setShowCalendly(true);
                Mixpanel.track("Clicked on travel concierge");
              }}
              className="flex items-center gap-0.5 px-2 lg:px-4 py-3 cursor-pointer !bg-gradient-to-r from-pink-500 via-red-500 !rounded-3xl to-yellow-500"
            >
              <span className="text-white text-sm font-bold">Contact Us</span>
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

          {/* <div className="md:hidden">
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
                        "w-full transform bg-white screen-height-safari text-left border-t align-middle shadow-xl transition-all !rounded-none relative "
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
                        // preventInteractionOnTransition={true}
                        // allowTouchMove={false}
                        {...settings}
                        onSwiper={(swiper) => {
                          setSwiper(swiper);
                        }}
                        onSlideChange={(swiper) => {}}
                        className="!h-full !overflow-y-scroll"
                        autoHeight={true}
                      >
                        <SwiperSlide className="h-full">
                          <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <div className="px-2 mt-2">
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
                                      Find an activity that suits your budget
                                      and taste.
                                    </p>
                                  </div>

                                  <Icon
                                    icon="bx:chevron-right"
                                    className="w-8 h-8"
                                  />
                                </div>
                              </div>
                            </div>
                          </Transition.Child>
                        </SwiperSlide>

                        <SwiperSlide className="!h-full">
                          <div
                            onClick={() => {
                              slideto(0);
                            }}
                            className="bg-white mt-3 ml-3 swiper-button-prev cursor-pointer flex items-center gap-1 !overflow-y-scroll"
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
                          <div className="px-4 mt-3">
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
          </div> */}

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
                        "w-full transform bg-white screen-height-safari text-left border-t align-middle shadow-xl transition-all !rounded-none relative "
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
                      {/* <Swiper
                        // preventInteractionOnTransition={true}
                        // allowTouchMove={false}
                        {...settings}
                        onSwiper={(swiper) => {
                          setSwiper(swiper);
                        }}
                        onSlideChange={(swiper) => {}}
                        // className="!h-full"
                        autoHeight={true}
                      >
                        <SwiperSlide className="!overflow-y-scroll">
                          <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <div className="px-2 mt-2">
                              <div className="px-2 py-3 bg-gray-100 rounded-md flex flex-col">
                                <div className="py-2 border-b">
                                  <h1 className="font-bold">
                                    Explore on winda
                                  </h1>
                                </div>

                                <div
                                  onClick={() => {
                                    slideto(1);
                                    setCuratedTripsHover(true);
                                    setShowLocationsHover(false);
                                    setShowBeachLocationsHover(false);
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
                                    setShowLocationsHover(true);
                                    setShowBeachLocationsHover(false);
                                  }}
                                  className="flex items-center justify-between mt-3 cursor-pointer"
                                >
                                  <div className="flex flex-col gap-1">
                                    <h1 className="font-bold">Safari</h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                      Find safari and beach trips that will make
                                      a lasting impression.
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
                                    setShowLocationsHover(false);
                                    setShowBeachLocationsHover(true);
                                  }}
                                  className="flex items-center justify-between mt-3 cursor-pointer"
                                >
                                  <div className="flex flex-col gap-1">
                                    <h1 className="font-bold">Beach</h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                      Find beach trips that will make a lasting
                                      impression.
                                    </p>
                                  </div>

                                  <Icon
                                    icon="bx:chevron-right"
                                    className="w-8 h-8"
                                  />
                                </div>
                              </div>
                            </div>
                          </Transition.Child>
                        </SwiperSlide>

                        <SwiperSlide className="">
                          <div
                            onClick={() => {
                              slideto(0);
                            }}
                            className="bg-white mt-3 ml-3 swiper-button-prev cursor-pointer flex items-center gap-1"
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
                          <div className="px-4 mt-3 h-[500px] overflow-y-scroll">
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

                            {showLocationsHover && (
                              <div className="flex w-full flex-wrap items-center justify-between gap-1">
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Amboseli"
                                  subText=""
                                  href="/trip?location=amboseli"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Rwanda"
                                  subText=""
                                  href="/trip?location=rwanda"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Uganda"
                                  subText=""
                                  href="/trip?location=uganda"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Tanzania"
                                  subText=""
                                  href="/trip?location=tanzania"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Mara"
                                  subText=""
                                  href="/trip?location=mara"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Naivasha"
                                  subText=""
                                  href="/trip?location=naivasha"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Nakuru"
                                  subText=""
                                  href="/trip?location=nakuru"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Ol Pejeta"
                                  subText=""
                                  href="/trip?location=ol pejeta"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Samburu"
                                  subText=""
                                  href="/trip?location=samburu"
                                ></Item>
                              </div>
                            )}

                            {showBeachLocationsHover && (
                              <div className="flex w-full flex-wrap items-center justify-between gap-1">
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Diani"
                                  subText=""
                                  href="/trip?location=diani"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Watamu"
                                  subText=""
                                  href="/trip?location=watamu"
                                ></Item>
                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Kilifi"
                                  subText=""
                                  href="/trip?location=kilifi"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Lamu"
                                  subText=""
                                  href="/trip?location=lamu"
                                ></Item>

                                <Item
                                  icon="ic:sharp-location-on"
                                  safariAndBeach={true}
                                  title="Zanzibar"
                                  subText=""
                                  href="/trip?location=zanzibar"
                                ></Item>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      </Swiper> */}
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
            title="Contact Us"
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

          <NavbarCurrency></NavbarCurrency>
        </div>
      </div>
    </div>
  );
}

Navbar.propTypes = {};

export default Navbar;
