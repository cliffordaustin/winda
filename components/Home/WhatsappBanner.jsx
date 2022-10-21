import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import Link from "next/link";

function WhatsappBanner(props) {
  return (
    <div className="flex justify-between text-white px-4 py-2 bg-white border-b">
      {/* <div></div> */}

      <div className="flex justify-between w-full items-center text-black gap-4">
        <div className="font-bold"></div>

        <Link href="https://api.whatsapp.com/send?phone=+254757629101&text=Hi winda">
          <a
            target="_blank"
            className="flex items-center gap-0.5 px-2 py-2 !bg-gradient-to-r from-pink-500 via-red-500 !rounded-3xl to-yellow-500"
          >
            <span className="ml-2 text-white text-sm font-bold cursor-pointer">
              Travel concierge
            </span>
          </a>
        </Link>
      </div>
    </div>
  );
}

WhatsappBanner.propTypes = {};

export default WhatsappBanner;
