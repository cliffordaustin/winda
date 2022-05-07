import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Carousel from "./Carousel";

function Card({
  imagePaths,
  subText,
  header,
  children,
  className = "",
  carouselClassName = "",
  subCarouselClassName = "",
  childrenClass = "",
}) {
  return (
    <div className={"w-full rounded-2xl overflow-hidden bg-white " + className}>
      <div className={"w-full relative " + carouselClassName}>
        <Carousel
          images={imagePaths}
          imageClass="rounded-tl-2xl rounded-tr-2xl"
        ></Carousel>
      </div>
      <div className={"mt-2 px-4 h-auto pb-2 " + subCarouselClassName}>
        {header && (
          <h1 className="font-OpenSans text-lg font-bold">{header}</h1>
        )}
        {subText && <p className="mt-2 text-sm">{subText}</p>}
      </div>
      {children && (
        <div className={"mt-4 px-3 mb-2 " + childrenClass}>{children}</div>
      )}
    </div>
  );
}

Card.propTypes = {
  imagePaths: PropTypes.array.isRequired,
  header: PropTypes.string,
  subText: PropTypes.string,
  className: PropTypes.string,
};

export default Card;
