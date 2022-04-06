import React from "react";
import SigninLayout from "../SigninLayout/SigninLayout";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <div>
      <SigninLayout
        className="md:!w-[50%] lg:!w-[60%]"
        childrenClassName="md:!w-[50%] lg:w-[40%] !py-6"
      >
        <LoginForm></LoginForm>
      </SigninLayout>
    </div>
  );
}

export default Login;
