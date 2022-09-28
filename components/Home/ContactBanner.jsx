import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

function ContactBanner(props) {
  return (
    <div className="flex justify-between text-white px-4 py-2 bg-blue-600">
      {/* <div></div> */}

      <div className="flex items-center text-white gap-4">
        <div>
          Incase of any issues, please call us directly on{""}
          <spna
            className="ml-2 text-white text-sm font-bold underline cursor-pointer"
            onClick={() => {
              window.open("tel:+254725052346", "_self");
            }}
          >
            +254 725 052 346
          </spna>{" "}
          or only whatsapp at{""}
          <span className="ml-2 text-white text-sm font-bold cursor-pointer">
            +254757629101
          </span>
        </div>
      </div>
    </div>
  );
}

ContactBanner.propTypes = {};

export default ContactBanner;
