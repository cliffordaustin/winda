import React, { useState } from "react";
import PropTypes from "prop-types";
import PhotoGallery from "react-photo-gallery";
import Image from "next/image";

const ImageGallery = ({
  images = [],
  allSortedImages = [],
  className = "",
}) => {
  const [scaleImages, setScaleImages] = useState(false);

  const sortedImages = images.sort((x, y) => y.main - x.main);

  const otherImages = sortedImages.map((image, index) => {
    return image.image;
  });

  let allImages = [...otherImages, ...allSortedImages];

  allImages = allImages.slice(1, 3);

  let mainImage = sortedImages.find((image) => image.main);

  return (
    <div
      onMouseEnter={() => {
        setScaleImages(true);
      }}
      onMouseLeave={() => {
        setScaleImages(false);
      }}
      className={
        "mt-4 relative flex w-full h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden stepWebkitSetting mx-auto " +
        className
      }
    >
      <div
        className={
          "absolute w-full sm:w-[60%] md:w-[70%] left-0 h-full transition-all duration-200 ease-linear " +
          (scaleImages ? "scale-105" : "") +
          (allImages.length === 1 ? " sm:!w-[50%] md:!w-[50%]" : "") +
          (allImages.length === 0 ? " sm:!w-full md:!w-full" : "")
        }
      >
        {mainImage && (
          <Image
            layout="fill"
            alt="Logo"
            src={mainImage.image}
            objectFit="cover"
            unoptimized={true}
            priority
          ></Image>
        )}
        {!mainImage && (
          <Image
            layout="fill"
            alt="Logo"
            src={allSortedImages[0]}
            objectFit="cover"
            unoptimized={true}
            priority
          ></Image>
        )}
      </div>
      <div
        className={
          "sm:w-[40%] md:w-[30%] hidden h-full absolute right-0 sm:flex flex-col rounded-tr-3xl rounded-br-3xl justify-between " +
          (allImages.length === 1 ? " !h-full sm:!w-[50%] md:!w-[50%]" : "")
        }
      >
        {allImages.map((image, index) => (
          <div
            key={index}
            className={
              "relative w-[100%] h-[50%] transition-all duration-200 ease-linear " +
              (scaleImages ? "scale-[1.03]" : "") +
              (allImages.length === 1 ? " !h-full" : "")
            }
          >
            <Image
              objectFit="cover"
              layout="fill"
              alt="Logo"
              src={image}
              unoptimized={true}
              priority
            ></Image>
          </div>
        ))}
      </div>
    </div>
  );
};

ImageGallery.propTypes = {};

export default ImageGallery;
