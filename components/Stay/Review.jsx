import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Rating from "../ui/Rating";
import moment from "moment";

const Review = ({ isSafari, review }) => {
  const text =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio fugiat eius quasi fugit iusto quibusdam enim commodi totam pariatur minima, eum ratione, maiores, aliquam quod nobis blanditiis mollitia sequi nihil. Quis hic a autem reprehenderit labore quibusdam voluptatum neque qui illo, error nihil, soluta aliquid nobis quaerat eius ipsa vel cupiditate. Inventore maxime sit ad tempora magni quibusdam eum? Sapiente doloremque facilis dolore perspiciatis soluta mollitia?";

  const [showText, setShowText] = useState(false);
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-3">
        {review.profile_pic && (
          <div className="relative w-10 h-10 rounded-full">
            <Image
              layout="fill"
              alt="profile image of a user"
              className="object-cover rounded-full"
              src={review.profile_pic}
              unoptimized={true}
              priority
            ></Image>
          </div>
        )}

        {!review.profile_pic && (
          <div className="relative w-10 h-10 rounded-full bg-[#303960] text-white font-bold flex items-center text-lg justify-center">
            {review.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-bold">{review.name}</span>
          <span className="text-sm">
            {moment(review.date_posted).format("MMM Do YYYY")}
          </span>
          <div className="flex items-center">
            <Rating
              fontSize={!isSafari ? 20 : 15}
              rating={review.rate}
            ></Rating>
            <div className="font-bold text-xs ml-1 mt-1">{review.rate}</div>
          </div>
        </div>
      </div>
      <div className="font-bold mt-2">{'"' + review.title + '"'}</div>
      {review.message.length > 250 && (
        <div className="mt-4 md:hidden">
          {!showText && <span>{review.message.slice(0, 250)}</span>}
          {showText && <span>{review.message}</span>}

          {!showText && (
            <div
              onClick={() => {
                setShowText(true);
              }}
              className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer mb-1"
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

          {showText && (
            <div
              onClick={() => {
                setShowText(false);
              }}
              className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer mb-1"
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
      {review.message.length <= 250 && (
        <div className="mt-4 md:hidden">{review.message}</div>
      )}

      {review.message.length > 500 && (
        <div className="mt-4 hidden md:block">
          {!showText && <span>{review.message.slice(0, 500)}</span>}
          {showText && <span>{review.message}</span>}

          {!showText && (
            <div
              onClick={() => {
                setShowText(true);
              }}
              className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer mb-1"
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

          {showText && (
            <div
              onClick={() => {
                setShowText(false);
              }}
              className="font-bold text-blue-700 mt-2 flex items-center gap-0.5 cursor-pointer mb-1"
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
      {review.message.length <= 500 && (
        <div className="mt-4 hidden md:block">{review.message}</div>
      )}
    </div>
  );
};

Review.propTypes = {};

export default Review;
