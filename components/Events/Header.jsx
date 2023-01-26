import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

function Header() {
  return (
    <div className="w-full flex flex-col items-center h-[500px] md:h-[600px] relative before:absolute before:h-full before:w-full before:bg-black sm:before:rounded-[10px] before:z-20 before:opacity-10">
      <Image
        className={"w-full sm:rounded-[10px]"}
        layout="fill"
        objectFit="cover"
        src="/images/kaleidoscope_image.png"
        alt="Image of a boat on the water"
        priority
      />

      <div className="absolute h-[70px] inset-0 w-full flex gap-4 items-center justify-center">
        <div className="relative w-28 h-9 z-40 cursor-pointer">
          <Image
            layout="fill"
            alt="Logo"
            src="/images/winda_logo/horizontal-blue-font.png"
            priority
          ></Image>
        </div>

        <div className="h-[45px] w-[1px] z-40 bg-gray-400"></div>

        <h1 className="uppercase font-OpenSans mt-3 text-lg text-[#D31567] tracking-widest z-40">
          kaleidoscope
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center absolute w-[90%] text-center top-[50%] gap-4 md:top-[40%] z-20 px-6 md:px-0">
        <div className="flex flex-col items-center">
          <h1 className="font-black font-SourceSans  mb-2 text-5xl uppercase sm:text-4xl md:text-8xl xl:text-9xl text-[#D31567] text-center">
            kaleidoscope
          </h1>
        </div>

        <div className="w-auto h-[60px] md:h-[80px] mt-4 font-Poppins text-white rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md font-bold text-xl sm:text-3xl md:text-4xl xl:text-5xl flex items-center justify-center px-5 bg-[#04BDED]">
          April 14-16 & 21-23
        </div>
      </div>

      <div className="h-[80px] absolute inset-0 flex items-center justify-center w-full bg-white z-20 blur-md"></div>
    </div>
  );
}

Header.propTypes = {};

export default Header;
