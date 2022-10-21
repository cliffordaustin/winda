import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import Link from "next/link";

function WhatsappBanner(props) {
  return (
    <div className="flex justify-between text-white px-4 py-2 bg-white border-b">
      {/* <div></div> */}

      <div className="flex justify-between w-full items-center text-black gap-4">
        <div className="font-bold">Contact us directly on{""}</div>

        <Link href="https://api.whatsapp.com/send?phone=+254757629101&text=Hi winda">
          <a target="_blank" className="flex items-center gap-0.5 underline">
            <div>
              <Icon icon="logos:whatsapp-icon" className="w-5 h-5" />
            </div>
            <span className="ml-2 text-black text-sm font-bold cursor-pointer">
              +254757629101
            </span>
          </a>
        </Link>
      </div>
    </div>
  );
}

WhatsappBanner.propTypes = {};

export default WhatsappBanner;
