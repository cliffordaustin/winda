import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

function ServerError(props) {
  return (
    <div>
      <div className="fixed top-0 w-full bg-white z-50">
        <div className="bg-white sm:px-12 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="relative w-28 h-9 cursor-pointer">
                <Image
                  layout="fill"
                  alt="Logo"
                  src="/images/winda_logo/horizontal-blue-font.png"
                  priority
                ></Image>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-24 px-4 md:px-8">
        <div className="shadow-md border-t-8 px-6 pb-8 rounded-md border-red-500">
          <div className="flex items-center gap-3 mb-2">
            <Icon icon="akar-icons:info-fill" className="text-red-600" />
            <div className="font-bold">Something went wrong</div>
          </div>

          <div className="text-gray-400 text-sm">
            Unfortunately, a server error prevented your request from being
            completed. Winda may be undergoing maintenance or your connection
            may have timed out. Please refresh the page or try again.
          </div>
        </div>
      </div>
    </div>
  );
}

ServerError.propTypes = {};

export default ServerError;
