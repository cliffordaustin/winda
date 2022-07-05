import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Carousel from "./Carousel";

function SecondCard({
  imagePaths,
  subText,
  header,
  children,
  className = "",
  carouselClassName = "",
  subCarouselClassName = "",
  childrenClassName = "",
  subCarouselContainerClassName = "",
}) {
  return (
    <div
      className={
        "w-full flex gap-2 rounded-2xl overflow-hidden bg-white " + className
      }
    >
      <div className={"w-2/5 relative " + carouselClassName}>
        <Carousel
          images={imagePaths}
          imageClass="rounded-bl-2xl rounded-tl-2xl"
        ></Carousel>
      </div>
      <div className={"w-[60%] " + subCarouselContainerClassName}>
        <div className={"mt-2 px-4 h-auto pb-2 " + subCarouselClassName}>
          {header && (
            <h1 className="font-OpenSans text-lg font-bold">{header}</h1>
          )}
          {subText && <p className="mt-2 text-sm">{subText}</p>}
        </div>
        {children && (
          <div className={"mt-4 px-3 mb-2 " + childrenClassName}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

SecondCard.propTypes = {
  imagePaths: PropTypes.array.isRequired,
  header: PropTypes.string,
  subText: PropTypes.string,
  className: PropTypes.string,
};

export default SecondCard;
