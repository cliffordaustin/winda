import Head from "next/head";
import React, { useState } from "react";
import SignupForm from "../../components/Signup/Signup";

export default function Signup() {
  return (
    <div>
      <Head>
        <title>Winda.guide | Signup</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SignupForm></SignupForm>
    </div>
  );
}
