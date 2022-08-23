import React, { useState } from "react";
import PropTypes from "prop-types";
import PhotoGallery from "react-photo-gallery";
import Image from "next/image";

const ImageGallery = ({ images }) => {
  const [scaleImages, setScaleImages] = useState(false);

  const sortedImages = images.sort((x, y) => y.main - x.main);

  const cleanedImages = sortedImages.slice(1, 3).map((image, index) => {
    return image.image;
  });

  let mainImage = sortedImages.find((image) => image.main);
  return (
    <div
      onMouseEnter={() => {
        setScaleImages(true);
      }}
      onMouseLeave={() => {
        setScaleImages(false);
      }}
      className="px-20 mt-8 relative flex w-full h-[160px] overflow-hidden stepWebkitSetting mx-auto rounded-t-3xl"
    >
      <div
        className={
          "absolute w-full md:w-[60%] left-0 h-full transition-all duration-200 ease-linear " +
          (scaleImages ? "scale-105" : "")
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
            src={sortedImages[0].image}
            unoptimized={true}
            objectFit="cover"
            priority
          ></Image>
        )}
      </div>
      <div className="w-[40%] hidden h-full absolute right-0 md:flex flex-col rounded-tr-3xl justify-between">
        {cleanedImages.map((image, index) => (
          <div
            key={index}
            className={
              "relative w-[100%] h-[50%] transition-all duration-200 ease-linear " +
              (scaleImages ? "scale-[1.03]" : "")
            }
          >
            <Image
              layout="fill"
              alt=""
              objectFit="cover"
              unoptimized={true}
              src={image}
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
