import React from "react";
import Image from "next/image";
import Button from "../ui/Button";

function TeamExperience() {
  return (
    <div className="mt-2">
      {/* <h1 className="font-bold text-2xl md:text-3xl font-OpenSans mb-5">
        Team Experiences
      </h1> */}
      <div className="w-full h-600 relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:rounded-3xl before:opacity-60">
        <Image
          className={"rounded-3xl sm:w-full md:w-full"}
          layout="fill"
          objectFit="cover"
          src="/images/team-experience.JPG"
          sizes="380"
          alt="Image Gallery"
          priority
        />
        <div className="absolute flex flex-col items-center justify-center top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-20 w-fit px-6 md:px-0">
          <div>
            <h1 className="font-black font-SourceSans mb-2 text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-white uppercase text-center">
              Team Experiences
            </h1>
            <h1 className="font-bold font-OpenSans mb-8 text-base sm:text-xl text-white text-center">
              Explore our virtual and in-person experiences curated for teams
              like yours
            </h1>
          </div>
          <Button className="flex items-center gap-2 w-50 !py-3 !rounded-full">
            <span className="font-bold">Book Experiences</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TeamExperience;
