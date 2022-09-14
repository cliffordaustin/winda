import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";

function CookiesMessage(props) {
  const [showCookiesMessage, setShowCookiesMessage] = React.useState(
    Cookies.get("cookiesMessage") !== "true"
  );
  const closeCookiesMessage = () => {
    Cookies.set("cookiesMessage", "true", { expires: 365 });
  };
  return (
    <>
      {showCookiesMessage && (
        <div className="md:w-[700px] sm:w-[400px] w-[90%] py-4 flex md:flex-row flex-col items-center gap-4 md:gap-8 px-6 bg-gray-100 z-40 shadow-2xl rounded-lg fixed bottom-5 md:bottom-10 left-[50%] -translate-x-2/4">
          {/* <div className="relative w-[100px] h-[100px]">
            <Image
              className=""
              layout="fill"
              src={"/images/cookie-svgrepo-com.svg"}
              unoptimized={true}
              // objectFit="cover"
              alt="Image"
            />
          </div> */}

          <div>
            <h1 className="text-3xl hidden md:block font-bold text-center md:text-left">
              Cookies!
            </h1>
            <p className="md:mt-2 text-center md:text-left">
              Winda uses cookies to ensure you get the best experience on our
              website.
            </p>
          </div>

          <div className="flex md:flex-col gap-2 md:w-[200px]">
            <div
              onClick={() => {
                setShowCookiesMessage(false);
                closeCookiesMessage();
              }}
              className="px-5 flex items-center cursor-pointer justify-center py-1.5 text-white font-bold bg-gray-700"
            >
              <span>Okay</span>
            </div>
            <Link href="/privacy-policy">
              <a>
                <div className="px-5 flex items-center font-bold cursor-pointer justify-center py-1.5 border border-gray-700">
                  <span className="truncate">Privacy policy</span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

CookiesMessage.propTypes = {};

export default CookiesMessage;
