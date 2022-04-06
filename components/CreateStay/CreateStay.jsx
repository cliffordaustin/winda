import React from "react";
import { useDispatch, useSelector } from "react-redux";

import SigninLayout from "../SigninLayout/SigninLayout";
import Stay from "./Stay";

function CreateStay() {
  const stayImage = useSelector((state) => state.stay.typeOfStayImage);
  return (
    <SigninLayout
      text="What is your type of stay?"
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
