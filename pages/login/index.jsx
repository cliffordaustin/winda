import Head from "next/head";
import React, { useState } from "react";
import LoginForm from "../../components/Login/Login";

function Login() {
  return (
    <div>
      <Head>
        <title>Winda.guide | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <LoginForm></LoginForm>
    </div>
  );
}

export default Login;
