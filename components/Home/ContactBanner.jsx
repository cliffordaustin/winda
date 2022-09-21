import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

function ContactBanner(props) {
  return (
    <div className="flex justify-between px-4 py-2 bg-gray-200">
      <div></div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Icon className="text-black w-6 h-6" icon="fluent:call-16-filled" />
          <div
            className="ml-2 text-black text-sm font-bold underline cursor-pointer"
            onClick={() => {
              window.open("tel:+254725052346", "_self");
            }}
          >
            +254 725 052 346
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Icon
            className="text-black w-6 h-6"
            icon="akar-icons:whatsapp-fill"
          />
          <div className="ml-2 text-black text-sm font-bold cursor-pointer">
            +254757629101
          </div>
        </div>
      </div>
    </div>
  );
}

ContactBanner.propTypes = {};

export default ContactBanner;
