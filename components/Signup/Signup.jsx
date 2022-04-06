import React from "react";
import PropTypes from "prop-types";
import SigninLayout from "../SigninLayout/SigninLayout";
import SignupForm from "./SignupForm";

function Signup(props) {
  return (
    <SigninLayout
      className="md:!w-[50%] lg:!w-[60%]"
      childrenClassName="md:!w-[50%] lg:w-[40%] !py-6"
    >
      <SignupForm></SignupForm>
    </SigninLayout>
  );
}

Signup.propTypes = {};

export default Signup;
