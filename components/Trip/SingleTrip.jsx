import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../ui/Button";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";

const SingleTrip = ({ trip, isRecommendedPage, selectedData }) => {
  const [deleteTripLoading, setDeleteTripLoading] = useState(false);

  const [addToYourTripLoading, setAddToYourTripLoading] = useState(false);

  const router = useRouter();
  const deleteTrip = (slug) => {
    setDeleteTripLoading(true);
    axios
      .delete(`${process.env.NEXT_PUBLIC_baseURL}/trips/${slug}/delete-trip/`, {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      })
      .then(() => {
        router.reload();
      })
      .catch((err) => {
        console.log(err.response);
        setDeleteTripLoading(false);
      });
  };

  const addToYourTrip = (slug) => {
    if (selectedData) {
      setAddToYourTripLoading(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/trips/${slug}/create-trip/`,
          {
            stay_id: selectedData.stay_id,
            activity_id: selectedData.activity_id,
            transport_id: selectedData.transport_id,
          },
          {
            headers: {
              Authorization: `Token ${Cookies.get("token")}`,
            },
          }
        )
        .then((res) => {
          router.push({
            pathname: `/trip/plan/${slug}`,
          });
        })
        .catch((err) => {
          console.log(err.response);
          setAddToYourTripLoading(false);
        });
    }
  };
  return (
    <div className="py-2 my-4 border bg-white rounded-xl px-2">
      <h1 className="font-bold text-lg mb-2">{trip.name}</h1>
      <div className="my-1 text-sm font-bold text-blue-600">
        {trip.trip.length} {trip.trip.length > 1 ? "items" : "item"} in this
        trip
      </div>

      <p className="text-sm">Created {moment(trip.created_at).fromNow()}</p>

      {!isRecommendedPage && (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => {
              router.push(`/trip/plan/${trip.slug}`);
            }}
            className="!bg-blue-500"
          >
            <span>View</span>
          </Button>

          <Button
            onClick={() => {
              deleteTrip(trip.slug);
            }}
            className="!bg-red-500"
          >
            <span>Delete</span>

            <div className={" " + (!deleteTripLoading ? "hidden" : " ml-1")}>
              <LoadingSpinerChase
                width={13}
                height={13}
                color="white"
              ></LoadingSpinerChase>
            </div>
          </Button>
        </div>
      )}

      {isRecommendedPage && (
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => {
              addToYourTrip(trip.slug);
            }}
            className="!bg-blue-500"
          >
            <span>Add to this trip</span>

            <div className={" " + (!addToYourTripLoading ? "hidden" : " ml-1")}>
              <LoadingSpinerChase
                width={13}
                height={13}
                color="white"
              ></LoadingSpinerChase>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

SingleTrip.propTypes = {};

export default SingleTrip;
