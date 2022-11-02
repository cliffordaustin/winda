import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "../ui/Button";
import Card from "../ui/Card";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import styles from "../../styles/Listing.module.css";
import Price from "../Stay/Price";
import ClientOnly from "../ClientOnly";

const Listing = ({
  stay,
  activity,
  transport,
  stayPage,
  transportPage,
  activitiesPage,
  stayId,
  transportId,
  activityId,
  partnerPage,
}) => {
  const sortedImages = stayPage
    ? stay.stay_images.sort((x, y) => y.main - x.main)
    : transportPage
    ? transport.transportation_images.sort((x, y) => y.main - x.main)
    : activity.activity_images.sort((x, y) => y.main - x.main);
  const images = sortedImages.map((image) => {
    return image.image;
  });

  const price = () => {
    return stayPage
      ? stay.price_non_resident ||
          stay.price ||
          stay.per_house_price ||
          stay.deluxe_price_non_resident ||
          stay.deluxe_price ||
          stay.family_room_price_non_resident ||
          stay.family_room_price ||
          stay.executive_suite_room_price_non_resident ||
          stay.executive_suite_room_price ||
          stay.presidential_suite_room_price_non_resident ||
          stay.presidential_suite_room_price ||
          stay.emperor_suite_room_price_non_resident ||
          stay.emperor_suite_room_price
      : transportPage
      ? transport.price_per_day
      : activity.price;
  };

  const getStandardRoomPrice = (stay) => {
    const standardRoom = stay.type_of_rooms.find(
      (room) => room.is_standard === true
    );
    return standardRoom.price;
  };

  const [loading, setLoading] = React.useState(false);

  const unsave = (e) => {
    e.stopPropagation();
    setLoading(true);
    if (stayPage) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/user-saved-stays/${stayId}/`,
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (activitiesPage) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/user-saved-activities/${activityId}/`,
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (transportPage) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_baseURL}/user-saved-transports/${transportId}/`,
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then(() => {
          location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="relative">
      <Card
        imagePaths={images}
        carouselClassName="h-44"
        subCarouselClassName="hidden"
        className={styles.card + ""}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-500 truncate">
            {activitiesPage ? activity.name : stayPage ? stay.name : ""}
          </h1>
          {transportPage && (
            <div className="text-gray-500 capitalize flex gap-[3px]">
              <h1>{transport.vehicle_make.toLowerCase()}</h1>
              <span className="-mt-[5px] font-bold text-lg text-black">.</span>
              <h1>{transport.type_of_car.toLowerCase()}</h1>
            </div>
          )}
          <div className="flex">
            {!stay.is_an_event && <Price stayPrice={price()}></Price>}
            {stay.is_an_event && (
              <Price stayPrice={getStandardRoomPrice(stay)}></Price>
            )}
            <span className="mt-[4.5px] text-gray-500 text-sm">
              {!stay.is_an_event &&
                (stay.per_house
                  ? "/per property/per night"
                  : "/per person/per night")}
            </span>

            {stayPage && <div className="text-sm mt-1.5">/night</div>}
            {activitiesPage && <div className="text-sm mt-1.5">/person</div>}
            {transportPage && <div className="text-sm mt-1.5">/day</div>}
          </div>
        </div>

        <ClientOnly>
          {stayPage && (
            <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
              {stay.capacity && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                    />
                    <path
                      fill="currentColor"
                      d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                    />
                    <path
                      fill="currentColor"
                      d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                    />
                    <path
                      fill="currentColor"
                      d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                    />
                    <circle
                      cx="17.87"
                      cy="13.45"
                      r="4.47"
                      fill="currentColor"
                    />
                    <path
                      fill="currentColor"
                      d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  <span>{stay.capacity} Guests</span>
                </div>
              )}
              {stay.rooms && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                    />
                  </svg>

                  <span>{stay.rooms} rm</span>
                </div>
              )}
            </div>
          )}
        </ClientOnly>

        <ClientOnly>
          {activitiesPage && (
            <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
              {activity.capacity && (
                <div className="flex items-center gap-0.5">
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill="currentColor"
                      d="M12 16.14h-.87a8.67 8.67 0 0 0-6.43 2.52l-.24.28v8.28h4.08v-4.7l.55-.62l.25-.29a11 11 0 0 1 4.71-2.86A6.59 6.59 0 0 1 12 16.14Z"
                    />
                    <path
                      fill="currentColor"
                      d="M31.34 18.63a8.67 8.67 0 0 0-6.43-2.52a10.47 10.47 0 0 0-1.09.06a6.59 6.59 0 0 1-2 2.45a10.91 10.91 0 0 1 5 3l.25.28l.54.62v4.71h3.94v-8.32Z"
                    />
                    <path
                      fill="currentColor"
                      d="M11.1 14.19h.31a6.45 6.45 0 0 1 3.11-6.29a4.09 4.09 0 1 0-3.42 6.33Z"
                    />
                    <path
                      fill="currentColor"
                      d="M24.43 13.44a6.54 6.54 0 0 1 0 .69a4.09 4.09 0 0 0 .58.05h.19A4.09 4.09 0 1 0 21.47 8a6.53 6.53 0 0 1 2.96 5.44Z"
                    />
                    <circle
                      cx="17.87"
                      cy="13.45"
                      r="4.47"
                      fill="currentColor"
                    />
                    <path
                      fill="currentColor"
                      d="M18.11 20.3A9.69 9.69 0 0 0 11 23l-.25.28v6.33a1.57 1.57 0 0 0 1.6 1.54h11.49a1.57 1.57 0 0 0 1.6-1.54V23.3l-.24-.3a9.58 9.58 0 0 0-7.09-2.7Z"
                    />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                  <span>{activity.capacity} Guests</span>
                </div>
              )}
            </div>
          )}
        </ClientOnly>

        <div className="font-bold text-sm truncate mt-1">
          {activitiesPage ? activity.location : stayPage ? stay.location : ""}
        </div>

        {!partnerPage && (
          <div className="mt-2">
            <Button
              onClick={(e) => {
                unsave(e);
              }}
              className="!bg-red-500 !py-1 flex gap-2 !px-1.5"
            >
              <span className="text-white text-sm">Unsave</span>

              {loading && (
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
      </Card>
    </div>
  );
};

Listing.propTypes = {};

export default Listing;
