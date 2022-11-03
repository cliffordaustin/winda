import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/ui/Button";
import { usePaystackPayment } from "react-paystack";

function TestPayment(props) {
  const config = {
    reference: new Date().getTime().toString(),
    email: "ndiko@winda.guide",
    amount: 10000,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    currency: "KES",
    channels: ["card", "mobile_money"],
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    console.log("success");
  };
  return (
    <div className="flex items-center flex-col justify-center mt-6">
      <h1 className="text-xl font-black">Test Payment</h1>

      <Button
        onClick={() => {
          initializePayment(onSuccess);
        }}
        className="flex w-fit items-center gap-1 !px-4 !py-2 mt-6 font-bold !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 !text-white"
      >
        <span>Test payment</span>
      </Button>
    </div>
  );
}

TestPayment.propTypes = {};

export default TestPayment;
