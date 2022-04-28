import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import MobileModal from "../../components/ui/MobileModal";
import Review from "./Review";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";

import InfiniteScroll from "react-infinite-scroller";
import { useRouter } from "next/router";
import axios from "axios";

const AllReviews = ({
  showAllReviews,
  setShowAllReviews,
  filteredReviews,
  filterRateVal,
  reviewPageSize,
  reviewCount,
}) => {
  const [isSafari, setIsSafari] = useState(false);

  const [allReviews, setAllReviews] = useState([]);

  const [next, setNext] = useState(null);

  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const loadMoreReviewData = async (page) => {
    if (page <= Math.ceil(reviewCount / reviewPageSize)) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/reviews/?page=${page}`
        );

        setAllReviews([...allReviews, ...res.data.results]);
        setNext(res.data.next);
      } catch (error) {
        console.log(error);
      }
    } else {
      setHasMore(false);
    }
  };

  const loadMoreFilteredReviewData = async (page) => {
    if (page <= Math.ceil(reviewCount / reviewPageSize)) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/reviews/?page=${page}&rate=${filterRateVal}`
        );

        setAllReviews([...allReviews, ...res.data.results]);
        setNext(res.data.next);
      } catch (error) {
        console.log(error);
      }
    } else {
      setHasMore(false);
    }
  };

  const container = useRef();

  return (
    <>
      <MobileModal
        showModal={showAllReviews}
        closeModal={() => {
          setShowAllReviews(false);
        }}
        containerHeight={70}
        title="All Reviews"
        className="md:w-[650px]"
        myref={container}
      >
        {!filteredReviews && (
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreReviewData}
            hasMore={hasMore}
            getScrollParent={() => container.current}
            useWindow={false}
            loader={
              <div
                className="loader w-full flex items-center justify-center mt-4 mb-2"
                key={0}
              >
                <LoadingSpinerChase
                  width={25}
                  height={25}
                  color="#000"
                ></LoadingSpinerChase>
              </div>
            }
          >
            <div className="flex flex-col gap-4 px-3">
              {allReviews.map((review) => (
                <Review
                  isSafari={isSafari}
                  key={review.id}
                  review={review}
                ></Review>
              ))}
            </div>
          </InfiniteScroll>
        )}
        {filteredReviews && (
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreFilteredReviewData}
            hasMore={hasMore}
            getScrollParent={() => container.current}
            useWindow={false}
            loader={
              <div
                className="loader w-full flex items-center justify-center mt-4 mb-2"
                key={0}
              >
                <LoadingSpinerChase
                  width={25}
                  height={25}
                  color="#000"
                ></LoadingSpinerChase>
              </div>
            }
          >
            <div className="flex flex-col gap-4 px-3">
              {allReviews.map((review) => (
                <Review
                  isSafari={isSafari}
                  key={review.id}
                  review={review}
                ></Review>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </MobileModal>
    </>
  );
};

AllReviews.propTypes = {};

export default AllReviews;
