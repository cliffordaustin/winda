import React from "react";
import { useDispatch, useSelector } from "react-redux";

import SigninLayout from "../SigninLayout/SigninLayout";
import Stay from "./Stay";

function CreateStay() {
  const stayImage = useSelector((state) => state.stay.typeOfStayImage);
  const currentSwiperIndex = useSelector(
    (state) => state.stay.currentSwiperIndex
  );
  return (
    <SigninLayout
      text={
        currentSwiperIndex === 2
          ? "Describe your stay"
          : currentSwiperIndex === 3
          ? "Drag the map to pin your exact location"
          : currentSwiperIndex === 4
          ? "Give a detail about your stay"
          : currentSwiperIndex === 5
          ? "What ammenities do you have in your stay?"
          : currentSwiperIndex === 6
          ? "Let your guests know what makes your place unique"
          : currentSwiperIndex === 7
          ? "Give a description about your stay"
          : currentSwiperIndex === 8
          ? "Select your pricing plan"
          : currentSwiperIndex === 9
          ? "Introduce your stay through your images"
          : "What is your type of stay?"
      }
      className="md:!w-[50%] lg:!w-[60%]"
      childrenClassName="md:!w-[50%] lg:w-[40%] overflow-y-scroll md:!py-6"
      mainClassName="h-screen overflow-y-scroll"
      imagePath={stayImage}
    >
      <Stay></Stay>
    </SigninLayout>
  );
}

export default CreateStay;
