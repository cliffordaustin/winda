import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Input from "../ui/Input";

function Locations(props) {
  const router = useRouter();

  const [location, setLocation] = useState("");

  const defaultLocations = [
    {
      name: "Nairobi",
      tag: "nairobi",
      desc: "Nairobi is Kenya’s capital city. In addition to its urban core, the city has Nairobi National Park.",
      imagePath: "/images/home/nairobi.webp",
      imageAlt: "Image of Nairobi",
    },
    {
      name: "Maasai Mara",
      tag: "maasai-mara",
      desc: "Maasai Mara is a large game reserve in south-western Kenya.",
      imagePath: "/images/home/massai-mara.webp",
      imageAlt: "Image of maasai mara",
    },
    {
      name: "Amboseli",
      tag: "amboseli",
      desc: "Amboseli National Park is a wildlife sanctuary in Kenya.",
      imagePath: "/images/home/amboseli.webp",
      imageAlt:
        "Image of Amboseli. Image by MARIOLA GROBELSKA from unsplash.com",
    },
    {
      name: "Tsavo",
      tag: "tsavo",
      desc: "Tsavo East National Park is one of the oldest and largest parks in Kenya at 13,747.",
      imagePath: "/images/home/tsavo.webp",
      imageAlt: "Image of Tsavo. Image by A P from unsplash.com",
    },
    {
      name: "Nakuru",
      tag: "nakuru",
      desc: "Nakuru is a city in the Rift Valley region of Kenya. It is the capital of Nakuru County.",
      imagePath: "/images/home/nakuru.webp",
      imageAlt:
        "Image of Nakuru. Image by Bibhash (Knapsnack.life) Banerjee from unsplash.com",
    },

    {
      name: "Naivasha",
      tag: "naivasha",
      desc: "Naivasha is a large town in Nakuru County, Kenya.",
      imagePath: "/images/home/naivasha.webp",
      imageAlt: "Image of Naivasha.",
    },
    {
      name: "Samburu",
      tag: "samburu",
      desc: "Samburu National Reserve in Kenya is one of the premier wildlife reserves in East Africa.",
      imagePath: "/images/home/samburu.webp",
      imageAlt: "Image of Samburu. Image by Photos By Beks from usplash.com",
    },

    {
      name: "Ol pejeta",
      tag: "ol-pejeta",
      desc: "Ol Pejeta is the largest black rhino sanctuary in East Africa, and home to two of the world's last remaining northern white rhinos.",
      imagePath: "/images/home/ol-pejeta.webp",
      imageAlt: "Image of ol pejeta",
    },

    {
      name: "Diani",
      tag: "diani",
      desc: "Diani Beach is a major beach on the Indian Ocean coast of Kenya.",
      imagePath: "/images/home/diani.webp",
      imageAlt: "Image of Diani. Image by Favour Anyula from usplash.com",
    },

    {
      name: "Kilifi",
      tag: "kilifi",
      desc: "Kilifi is a town on the coast of Kenya, 56 kilometres (35 mi) northeast by road of Mombasa.",
      imagePath: "/images/home/kilifi.webp",
      imageAlt: "Image of Kilifi. Image by Irewolede from usplash.com",
    },

    {
      name: "Lamu",
      tag: "lamu",
      desc: "Lamu County is located in the Northern Coast of Kenya and is one of the six Coastal Countiesin Kenya.",
      imagePath: "/images/home/lamu.webp",
      imageAlt: "Image of Lamu. Image by Photos By Beks from usplash.com",
    },
    {
      name: "Watamu",
      tag: "watamu",
      desc: "Watamu is a small town located approximately 105 km north of Mombasa and about 15 km south of Malindi on the Indian Ocean coast of Kenya.",
      imagePath: "/images/home/watamu.webp",
      imageAlt: "Image of Watamu. Image by Timothy K from usplash.com",
    },
  ];
  return (
    <div className="flex flex-wrap justify-between mt-4 gap-3">
      {defaultLocations.map((location, index) => (
        <div
          onClick={() => {
            router.replace(
              {
                query: {
                  ...router.query,
                  location: location.tag,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
          key={index}
          className={
            "w-full md:w-[47%] relative cursor-pointer flex border-2 overflow-hidden rounded-md max-h-[150px] " +
            (router.query.location == location.tag ||
            (!router.query.location && index === 0)
              ? "border-blue-500"
              : "border-gray-200")
          }
        >
          <div className="h-full w-[20%] relative">
            <Image
              className={"w-full object-cover "}
              src={location.imagePath}
              alt={location.imageAlt}
              layout={"fill"}
              objectFit="cover"
              unoptimized={true}
            />
          </div>

          <div className="flex w-[80%] justify-between">
            <div className="flex flex-col gap-1 py-1 px-2">
              <h1 className="font-black">{location.name}</h1>
              <p className="text-sm text-gray-600">{location.desc}</p>
            </div>

            <div className="absolute top-2 right-3">
              <Icon
                icon="mdi:checkbox-marked-circle"
                className={
                  " " +
                  (router.query.location == location.tag ||
                  (!router.query.location && index === 0)
                    ? "text-blue-600"
                    : "text-gray-200")
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div
        onClick={() => {
          router.replace(
            {
              query: {
                ...router.query,
                location: "0",
              },
            },
            undefined,
            { shallow: true }
          );
        }}
        className={
          "w-full md:w-[150px] justify-center relative cursor-pointer flex border-2 overflow-hidden rounded-md h-[70px] " +
          (router.query.location == "0" ? "border-blue-500" : "border-gray-200")
        }
      >
        <div className="flex items-center justify-center w-[80%]">
          <div className="flex flex-col justify-center items-center gap-1 py-1 px-2">
            <h1 className="font-black text-center">Not sure?</h1>
          </div>

          <div className="absolute top-2 right-3">
            <Icon
              icon="mdi:checkbox-marked-circle"
              className={
                " " +
                (router.query.location == "0"
                  ? "text-blue-600"
                  : "text-gray-200")
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-4 items-center w-full">
        <div className="flex-grow h-px bg-gray-300"></div>
        <div className="text-sm font-bold text-center">Or</div>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col  mt-1 gap-2 w-full md:w-[47%] relative border border-gray-300 rounded-3xl pl-3">
        <div className="absolute top-[50%] -translate-y-2/4 z-20">
          <Icon icon="charm:search" className="w-4 h-4" />
        </div>
        <Input
          placeholder={"Enter a location"}
          type="text"
          name="location"
          value={location}
          onBlur={() => {
            if (location) {
              router.replace(
                {
                  query: {
                    ...router.query,
                    location: location,
                  },
                },
                undefined,
                { shallow: true }
              );
            } else {
              router.replace(
                {
                  query: {
                    ...router.query,
                    location: "nairobi",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          }}
          onKeyPress={(e) => {
            if (location) {
              if (e.key === "Enter") {
                router.replace(
                  {
                    query: {
                      ...router.query,
                      location: location,
                    },
                  },
                  undefined,
                  { shallow: true }
                );
              }
            } else {
              router.replace(
                {
                  query: {
                    ...router.query,
                    location: "nairobi",
                  },
                },
                undefined,
                { shallow: true }
              );
            }
          }}
          className={
            "truncate !h-[50px] !w-full placeholder:text-sm !border-none placeholder:text-black pl-3 rounded-3xl "
          }
          autoComplete="off"
          onChange={(event) => {
            setLocation(event.target.value);
          }}
        ></Input>
      </div>
    </div>
  );
}

Locations.propTypes = {};

export default Locations;
