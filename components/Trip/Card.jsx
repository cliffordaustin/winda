import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Button from "../ui/Button";
import { Mixpanel } from "../../lib/mixpanelconfig";
import Carousel from "../ui/Carousel";
import Price from "../Stay/Price";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Dialogue from "../Home/Dialogue";
import DaysAccordion from "./DaysAccordion";
import RequestInfo from "./RequestInfo";

const Card = ({ listing, isSecondTrip }) => {
  const router = useRouter();

  const sortedImages = isSecondTrip
    ? listing.curated_trip_images.sort((x, y) => y.main - x.main)
    : listing.single_trip_images.sort((x, y) => y.main - x.main);

  const images = sortedImages.map((image) => {
    return image.image;
  });

  const userIsFromKenya = useSelector((state) => state.home.userIsFromKenya);

  const totalPrice = () => {
    return userIsFromKenya
      ? listing.price
      : listing.price_non_resident || listing.price;
  };

  const totalPriceForSecondTrip = () => {
    return userIsFromKenya
      ? listing.plan_a_price.price
      : listing.plan_a_price.price_non_resident;
  };

  const totalOldPriceForSecondTrip = () => {
    return listing.plan_a_price && listing.plan_a_price.old_price;
  };

  const [showDialogue, setShowDialogue] = useState(false);

  const [showRequestInfo, setShowRequestInfo] = useState(false);

  const [showResquestInfoPopup, setShowRequestInfoPopup] = useState(false);

  return (
    <div className="flex border relative overflow-hidden stepWebkitSetting flex-col max-h-[460px] xl:flex-row w-full md:w-[48%] bg-white xl:h-[250px] mb-6 rounded-md">
      <div className="xl:w-[320px] h-[230px] xl:h-full">
        <Carousel
          images={images}
          imageClass="xl:rounded-bl-md xl:rounded-tl-md"
        ></Carousel>
      </div>

      <Dialogue
        isOpen={showDialogue}
        closeModal={() => {
          setShowDialogue(false);
        }}
        dialoguePanelClassName="!max-w-3xl max-h-[600px] !relative !p-0 !rounded-lg"
        outsideDialogueClass="!px-2 sm:!px-4"
      >
        <div className="flex flex-col h-[600px] md:h-full !overflow-y-scroll relative">
          <div className="flex justify-between py-3 md:py-0 h-[70px] bg-white border-b px-4 items-center">
            <div className="font-bold text-lg">Quick view</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowDialogue(false);
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

          <div className="bg-gray-50 w-full flex flex-col md:flex-row flex-grow">
            <div className="w-full md:w-[50%] h-[330px] md:h-[530px] md:sticky left-0 top-[70px]">
              <Carousel images={images} imageClass=""></Carousel>
            </div>

            <div className="w-full md:w-[50%] md:h-[530px] px-3 mt-2 relative overflow-y-auto">
              <div className="flex items-center gap-1 text-gray-700 text-sm">
                <Icon icon="akar-icons:clock" />
                {listing.total_number_of_days}{" "}
                {listing.total_number_of_days > 1 ? "days" : "day"}
              </div>
              <div className="text-xl text-gray-800 font-bold">
                {listing.name}
              </div>

              <p className="mt-2 text-sm text-gray-700">
                {listing.description}
              </p>

              <div className="mt-4 mb-20">
                <div className="font-bold text-lg">Itinerary</div>

                <div className="mt-3">
                  <div className="mt-4">
                    {listing.itineraries.map((itinerary, index) => (
                      <DaysAccordion
                        key={index}
                        title={itinerary.day}
                        showAccordionByDefault={index === 0 ? true : false}
                        className="text-sm text-gray-700"
                        accordionClassName="text-sm"
                      >
                        {itinerary.description}
                      </DaysAccordion>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white fixed bottom-0 right-0 h-14 w-full md:w-[50%] border-t px-2">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-700 flex gap-0.5 items-center">
                    <div className="text-xl mr-0.5 font-bold flex gap-1">
                      {listing.old_price && (
                        <Price
                          stayPrice={listing.old_price}
                          className="!text-sm line-through self-end mb-0.5 text-red-500"
                        ></Price>
                      )}
                      <Price
                        stayPrice={totalPrice()}
                        className="!text-base"
                      ></Price>
                    </div>
                    <div className="mt-0.5 mb-1.5 font-bold">.</div>
                    <div className=" font-bold">pp</div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <Link href={`/trip/${listing.slug}`}>
                    <a className="w-full">
                      <Button
                        onClick={() => {
                          Mixpanel.track("User opened a trip", {
                            name_of_trip: listing.name,
                          });
                        }}
                        className="w-fit !px-4 !bg-transparent font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                      >
                        view trip
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialogue>

      <Dialogue
        isOpen={showRequestInfo}
        closeModal={() => {
          setShowRequestInfo(false);
        }}
        dialoguePanelClassName="!max-w-2xl max-h-[600px] !overflow-y-scroll !relative !p-0 !rounded-lg"
        outsideDialogueClass="!px-2 sm:!px-4"
      >
        <div className="">
          <div className="flex justify-between py-3 md:py-0 h-[70px] bg-white border-b px-4 items-center">
            <div className="font-bold text-lg">Request more info</div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowRequestInfo(false);
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

          <div className="bg-gray-50 px-3 md:px-6 w-full pt-4">
            <div className="flex flex-col sm:flex-row sm:h-[180px] gap-3 w-full">
              <div className="sm:h-full h-[150px] sm:w-[40%]">
                <Carousel images={images} imageClass=""></Carousel>
              </div>

              <div className="sm:w-[60%]">
                <div className="flex items-center gap-1 text-gray-700 text-sm">
                  <Icon icon="akar-icons:clock" />
                  {listing.total_number_of_days}{" "}
                  {listing.total_number_of_days > 1 ? "days" : "day"}
                </div>
                <div className="text-base text-gray-700 font-bold">
                  {listing.name}
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {listing.description && listing.description.substring(0, 150)}
                  ...
                </p>

                <div className="md:mt-4">
                  <div className="text-sm text-gray-700 flex gap-0.5 items-center">
                    <div className="text-xl mr-0.5 font-bold flex gap-1">
                      {listing.old_price && (
                        <Price
                          stayPrice={listing.old_price}
                          className="!text-sm line-through self-end mb-0.5 text-red-500"
                        ></Price>
                      )}
                      <Price
                        stayPrice={
                          isSecondTrip
                            ? totalPriceForSecondTrip()
                            : totalPrice()
                        }
                        className="!text-base"
                      ></Price>
                    </div>
                    <div className="mt-0.5 mb-1.5 font-bold">.</div>
                    <div className="mt-0.5 font-bold">/per person/trip</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex gap-4 w-full">
                <RequestInfo
                  tripSlug={listing.slug}
                  submitCompleteFunc={setShowRequestInfoPopup}
                  showInfo={setShowRequestInfo}
                  isSecondTrip={isSecondTrip}
                  name={listing.name}
                ></RequestInfo>
              </div>
            </div>
          </div>
        </div>
      </Dialogue>

      <Dialogue
        isOpen={showResquestInfoPopup}
        closeModal={() => {
          setShowRequestInfoPopup(false);
          router.reload();
        }}
        dialoguePanelClassName="!max-w-md !max-h-[245px]"
        title={"Thanks for requesting about this trip!"}
        dialogueTitleClassName="!font-bold text-xl !font-OpenSans mb-3"
      >
        <div>
          We&apos;ll get back to you in 24 hours confirming your request by a
          professional travel expert at winda.
        </div>

        <div className="flex gap-2 w-full">
          <Button
            onClick={() => {
              setShowRequestInfoPopup(false);
              router.reload();
            }}
            className="flex w-full mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
          >
            <span>Close</span>
          </Button>
        </div>
      </Dialogue>

      <div className="px-3 py-2 xl:w-[200px] flex-grow relative">
        <div className="flex items-center gap-1 text-gray-700 text-sm">
          <Icon icon="akar-icons:clock" />
          {listing.total_number_of_days}{" "}
          {listing.total_number_of_days > 1 ? "days" : "day"}
        </div>
        <div className="text-base text-gray-700 font-bold truncate">
          {listing.name}
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {listing.description && listing.description.substring(0, 150)}...
        </p>

        <div className="mt-1 mb-10 xl:mb-0">
          <div className="text-sm text-gray-700 flex flex-wrap gap-0.5 items-center">
            <div className="text-xl mr-0.5 font-bold flex gap-1">
              {listing.old_price && (
                <Price
                  stayPrice={listing.old_price}
                  className="!text-sm line-through self-end mb-0.5 text-red-500"
                ></Price>
              )}
              {totalOldPriceForSecondTrip() && (
                <Price
                  stayPrice={totalOldPriceForSecondTrip()}
                  className="!text-sm line-through self-end mb-0.5 text-red-500"
                ></Price>
              )}
              <Price
                stayPrice={
                  isSecondTrip ? totalPriceForSecondTrip() : totalPrice()
                }
                className="!text-lg"
              ></Price>
            </div>
            {/* <div className="mt-0.5 mb-1.5 font-bold">.</div> */}
            <div className="font-bold">/per person/trip</div>
          </div>
        </div>

        <div className="flex mt-0.5 justify-between items-center absolute bottom-2 w-full right-0 px-2">
          <div
            onClick={() => {
              setShowRequestInfo(true);
            }}
            className="underline text-sm font-bold cursor-pointer"
          >
            Request more info
          </div>
          <div>
            <Link
              href={
                isSecondTrip
                  ? `/trip/u/${listing.slug}`
                  : `/trip/${listing.slug}`
              }
            >
              <a className="w-full">
                <Button
                  onClick={() => {
                    Mixpanel.track("User opened a trip", {
                      name_of_trip: listing.name,
                    });
                  }}
                  className="w-fit !px-3 !bg-transparent font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
                >
                  view trip
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {};

export default Card;
