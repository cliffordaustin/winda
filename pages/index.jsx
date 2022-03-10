import { useState } from "react";
import Navbar from "../components/Home/Navbar";
import Search from "../components/Home/Search";
import TransportSearch from "../components/Home/TransportSearch";
import Image from "next/image";
import ActivitiesSearch from "../components/Home/ActivitiesSearch";
import { motion, AnimatePresence } from "framer-motion";
import Main from "../components/Home/Main";
import Footer from "../components/Home/Footer";
import Button from "../components/ui/Button";
import SearchSelect from "../components/Home/SearchSelect";

export default function Home() {
  const [state, setState] = useState({
    showDropdown: false,
    location: "",
    activityLocation: "",
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
  });

  const turnOffAllPopup = {
    showDropdown: false,
    showCheckInDate: false,
    showCheckOutDate: false,
    showPopup: false,
    showTransportDate: false,
    showPassengerPopup: false,
    showActivityDate: false,
    showTravelersPopup: false,
    showNeedADriver: false,
  };

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

  const [typeOfCar, setTypeOfCar] = useState(null);
  return (
    <div
      className="overflow-x-hidden"
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
        });
      }}
    >
      <div className="">
        <Navbar
          showDropdown={state.showDropdown}
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
        ></Navbar>
        <div className="sm:hidden flex justify-center">
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
                location={state.location}
                guests={state.guests}
                checkin={state.checkin}
                selectedSearchItem={state.selectedSearchItem}
                clearInput={() => {
                  setState({ ...state, location: "" });
                }}
                clearCheckInDate={() => {
                  setState({ ...state, checkin: "" });
                }}
                clearCheckOutDate={() => {
                  setState({ ...state, checkout: "" });
                }}
                clearShowPopup={() => {
                  setState({ ...state, guests: 0 });
                }}
                changeShowCheckInDate={() => {
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showCheckInDate: !state.showCheckInDate,
                    selectedSearchItem: state.selectedSearchItem === 2 ? 0 : 2,
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
                    selectedSearchItem: state.selectedSearchItem === 3 ? 0 : 3,
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
                changeShowPopup={() => {
                  setState({
                    ...state,
                    ...turnOffAllPopup,
                    showPopup: !state.showPopup,
                    selectedSearchItem: state.selectedSearchItem === 4 ? 0 : 4,
                  });
                }}
                onChange={(event) => {
                  setState({ ...state, location: event.target.value });
                }}
                numOfAdults={state.numOfAdults}
                numOfChildren={state.numOfChildren}
                numOfInfants={state.numOfInfants}
                addToAdults={() => {
                  console.log("add");
                  setState({ ...state, numOfAdults: state.numOfAdults + 1 });
                }}
                addToChildren={() => {
                  setState({
                    ...state,
                    numOfChildren: state.numOfChildren + 1,
                  });
                }}
                addToInfants={() => {
                  setState({ ...state, numOfInfants: state.numOfInfants + 1 });
                }}
                removeFromAdults={() => {
                  state.numOfAdults > 0
                    ? setState({ ...state, numOfAdults: state.numOfAdults - 1 })
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
                selectedTransportSearchItem={state.selectedTransportSearchItem}
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
                    ? setState({ ...state, passengers: state.passengers - 1 })
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
                activityLocation={state.activityLocation}
                travelers={state.travelers}
                activityDate={state.activityDate}
                onChange={(event) => {
                  setState({ ...state, activityLocation: event.target.value });
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
                  setState({ ...state, activityLocation: "" });
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
      </div>
      <div className="px-6 mb-12 select-none">
        <div className="w-full h-600 relative mt-12 before:absolute before:h-full before:w-full before:bg-black before:z-20 before:rounded-3xl before:opacity-30">
          <Image
            className={"rounded-3xl sm:w-full md:w-full"}
            layout="fill"
            objectFit="cover"
            src="/images/header-image.jpeg"
            sizes="380"
            alt="Image Gallery"
            priority
          />
          <div className="absolute flex flex-col items-center justify-center bottom-28 left-2/4 -translate-x-2/4 z-20 w-fit px-6 md:px-0">
            <div>
              <h1 className="font-black font-Merriweather mb-2 text-2xl sm:text-4xl text-white">
                Travel in Kenya made easy
              </h1>
              <h1 className="font-bold font-OpenSans mb-8 text-base sm:text-2xl text-white">
                Winda finds you happiness in unexpected places
              </h1>
            </div>
            <Button className="flex items-center gap-4 w-36 !py-3 !rounded-full">
              <span className="font-bold">Explore</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-14 mb-8">
        <Main></Main>
      </div>
      <div className="mt-14">
        <Footer></Footer>
      </div>
    </div>
  );
}
