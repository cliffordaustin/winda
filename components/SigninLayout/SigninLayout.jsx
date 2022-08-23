import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";

function SigninLayout({
  className,
  childrenClassName,
  children,
  text = "Start your journey right from here.",
  imagePath = "/images/signin-image3.jpg",
  mainClassName = "",
}) {
  return (
    <div className={"flex " + mainClassName}>
      <div
        className={
          `py-6 lg:px-4 min-h-screen relative w-[50%] hidden md:block ` +
          className
        }
      >
        <div className="absolute w-28 h-9 left-10 top-8 z-20">
          <Link href="/">
            <a className="block text-xl relative w-28 h-9 z-30 cursor-pointer">
              <Image
                layout="fill"
                alt="Logo"
                className="z-30"
                src="/images/winda_logo/horizontal-white-font.png"
                quality={10}
                priority
              ></Image>
            </a>
          </Link>
        </div>
        <div className="w-[85%] font-bold lg:text-6xl md:text-5xl font-Merriweather text-white leading-tight z-20 absolute top-2/4 inline-block left-2/4 -translate-x-2/4 -translate-y-2/4">
          {text}
        </div>
        <div className="w-full h-full relative shadow-xl rounded-tr-3xl rounded-br-3xl lg:rounded-3xl before:rounded-tr-3xl before:rounded-br-3xl before:absolute before:lg:rounded-3xl before:h-full before:w-full before:bg-black before:opacity-40">
          <Image
            layout="fill"
            alt="Image of a car and a lion"
            src={imagePath}
            className="object-cover rounded-tr-3xl rounded-br-3xl lg:rounded-3xl -z-10"
            unoptimized={true}
            priority
          ></Image>
        </div>
      </div>
      <div className={"w-full " + childrenClassName}>{children}</div>
    </div>
  );
}

SigninLayout.propTypes = {
  className: PropTypes.string,
  childrenClassName: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.any.isRequired,
  mainClassName: PropTypes.string,
  imagePath: PropTypes.string,
};

export default SigninLayout;
