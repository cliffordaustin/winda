import React, { useState } from "react";
import PropTypes from "prop-types";
import PhotoGallery from "react-photo-gallery";
import Image from "next/image";

const ImageGallery = ({ images, stayType }) => {
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
      className="px-20 mt-8 relative flex w-full h-[550px] overflow-hidden mx-auto rounded-3xl"
    >
      <div
        className={
          "absolute w-[70%] left-0 h-full transition-all duration-200 ease-linear " +
          (scaleImages ? "scale-105" : "")
        }
      >
        <Image layout="fill" alt="Logo" src={mainImage.image} priority></Image>
      </div>
      <div className="w-[30%] h-full absolute right-0 flex flex-col rounded-tr-3xl rounded-br-3xl justify-between">
        {cleanedImages.map((image, index) => (
          <div
            key={index}
            className={
              "relative w-[100%] h-[50%] transition-all duration-200 ease-linear " +
              (scaleImages ? "scale-[1.03]" : "")
            }
          >
            <Image layout="fill" alt="Logo" src={image} priority></Image>
          </div>
        ))}
      </div>
      {stayType === "LODGE" && (
        <div className="absolute top-2 left-6 z-10 px-2 rounded-md bg-green-600 text-white">
          Lodge
        </div>
      )}
      {stayType === "HOUSE" && (
        <div className="absolute top-2 left-6 z-10 px-2 rounded-md bg-green-600 text-white">
          House
        </div>
      )}
      {stayType === "UNIQUE SPACE" && (
        <div className="absolute top-2 left-6 z-10 px-2 rounded-md bg-green-600 text-white">
          Unique space
        </div>
      )}
      {stayType === "CAMPSITE" && (
        <div className="absolute top-2 left-6 z-10 px-2 rounded-md bg-green-600 text-white">
          Campsite
        </div>
      )}
      {stayType === "BOUTIQUE HOTEL" && (
        <div className="absolute top-2 left-6 z-10 px-2 rounded-md bg-green-600 text-white">
          Boutique hotel
        </div>
      )}
    </div>
  );
};

ImageGallery.propTypes = {};

export default ImageGallery;
