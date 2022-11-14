import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Button from "../ui/Button";

function Successful({ email }) {
  return (
    <div className="flex flex-col relative h-full py-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-[80px] h-[80px]">
          <Image
            className="w-full h-full"
            layout="fill"
            src="/images/success.png"
            unoptimized={true}
            objectFit="cover"
            alt="Image"
          />
        </div>

        <h1 className="font-black text-indigo-600">
          Request sent successfully.
        </h1>
      </div>

      <div className="mt-4 px-4 text-gray-600">
        Thank you for your request!!!. We&apos;ll get back to you in less than
        24 hours. We are confirming all the details of the trip. We will send a
        feedback to your email:{" "}
        <span className="font-bold underline">{email}</span>
      </div>

      <div className="absolute bottom-2 items-center flex gap-2 w-full px-3">
        <Button
          onClick={() => {
            router.replace("/trip");
          }}
          className="flex w-[60%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
        >
          <span>Checkout our curated trips</span>
        </Button>

        <Button
          onClick={() => {
            router.replace("/");
          }}
          className="flex w-[40%] mt-3 mb-3 items-center gap-1 !px-0 !py-3 font-bold !bg-transparent hover:!bg-gray-200 !border !border-gray-400 !text-black"
        >
          <span>Check out Winda</span>
        </Button>
      </div>
    </div>
  );
}

Successful.propTypes = {};

export default Successful;
