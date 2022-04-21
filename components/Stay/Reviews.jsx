import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Review from "./Review";
import axios from "axios";

const Reviews = ({ slug }) => {
  const [isSafari, setIsSafari] = useState(false);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  useEffect(() => {
    const getReview = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${slug}/reviews/`
        );

        setReviews(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    getReview();
  });
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Review isSafari={isSafari} key={review.id} review={review}></Review>
      ))}
    </div>
  );
};

Reviews.propTypes = {};

export default Reviews;
