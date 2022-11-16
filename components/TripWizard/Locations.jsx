import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";

function Locations(props) {
  const router = useRouter();

  const [location, setLocation] = useState("");

  const [showKenyaLocations, setShowKenyaLocations] = useState(true);
  const [showTanzaniaLocations, setShowTanzaniaLocations] = useState(false);
  const [showUgandaLocations, setShowUgandaLocations] = useState(false);
  const [showRwandaLocations, setShowRwandaLocations] = useState(false);

  const kenyaDefaultLocations = [
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

  const ugandaDefaultLocations = [
    {
      name: "Kampala",
      tag: "kampala",
      desc: "Kampala is Uganda's national and commercial capital bordering Lake Victoria, Africa's largest lake.",
      imagePath: "/images/uganda/kampala.webp",
      imageAlt: "Image of Kampala",
    },
    {
      name: "Bwindi Impenetrable Forest National Park",
      tag: "bwindi_impenetrable_forest_national_park",
      desc: "The Bwindi Impenetrable Forest is a large primeval forest located in south-western Uganda in the Kanungu District.",
      imagePath: "/images/uganda/bwindi.webp",
      imageAlt: "Image of Bwindi Impenetrable Forest National Park",
    },

    {
      name: "Jinja",
      tag: "jinja",
      desc: "Jinja is a town in southern Uganda, on the shore of Lake Victoria. ",
      imagePath: "/images/uganda/jinja.jpg",
      imageAlt: "Image of Jinja",
    },
    {
      name: "Murchison Falls National Park",
      tag: "murchison_falls_national_park",
      desc: "Murchison Falls National Park sits on the shore of Lake Albert, in northwest Uganda.",
      imagePath: "/images/uganda/murchison.jpg",
      imageAlt: "Image of Murchison Falls National Park",
    },

    {
      name: "Queen Elizabeth National Park",
      tag: "queen_elizabeth_national_park",
      desc: "The park is home to 618 bird species which is the 6th highest diversity in the world and the highest in Africa making it a perfect destination for Uganda.",
      imagePath: "/images/uganda/queen-elizabeth-park.webp",
      imageAlt: "Image of Queen Elizabeth National Park, Uganda",
    },
    {
      name: "Lake Mburo National Park",
      tag: "lake_mburo_national_park",
      desc: "Lake Mburo National Park is a national park located in Nyabushozi County, Kiruhura District near Mbarara in Uganda.",
      imagePath: "/images/uganda/lake-mburo.webp",
      imageAlt: "Image of Lake Mburo National Park",
    },
    {
      name: "Kidepo Valley National Park",
      tag: "kidepo_valley_national_park",
      desc: "Kidepo Valley National Park is a 1,442 square kilometres national park in the Karamoja region in northeast Uganda.",
      imagePath: "/images/uganda/kidepo.webp",
      imageAlt: "Image of Kidepo Valley National Park",
    },
    {
      name: "Kibale Forest",
      tag: "kibale_forest",
      desc: "Kibale National Park is a national park in western Uganda, protecting moist evergreen rainforest.",
      imagePath: "/images/uganda/kibale.jpg",
      imageAlt: "Image of Kibale Forest",
    },
  ];

  const tanzaniaDefaultLocations = [
    {
      name: "Arusha",
      tag: "arusha",
      desc: "Arusha is a city in East Africa's Tanzania, located at the base of volcanic Mt. Meru. It's a gateway to Africa's highest peak, Mt. Kilimanjaro. ",
      imagePath: "/images/tanzania/arusha.jpg",
      imageAlt: "Image of Arusha",
    },
    {
      name: "Lake Manyara National Park",
      tag: "lake_manyara_national_park",
      desc: "Lake Manyara National Park is a protected area in Tanzania's Arusha and Manyara Regions, situated between Lake Manyara and the Great Rift Valley.",
      imagePath: "/images/tanzania/manyara.jpg",
      imageAlt: "Image of Lake Manyara National Park",
    },
    {
      name: "Ngorongoro Crater",
      tag: "ngorongoro_crater",
      desc: "Measuring an area of 260 square kilometres and extending about 20km in diameter, the crater is actually a huge caldera of a volcano that collapsed to a depth of 610m about three million years ago.",
      imagePath: "/images/tanzania/ngorongoro.jpg",
      imageAlt: "Image of Ngorongoro Crater",
    },
    {
      name: "Serengeti National Park",
      tag: "serengeti_national_park",
      desc: "The Serengeti ecosystem is a geographical region in Africa, spanning northern Tanzania. The protected area within the region includes approximately 30,000 km² of land.",
      imagePath: "/images/tanzania/serengeti.jpg",
      imageAlt: "Image of Serengeti National Park",
    },
    {
      name: "Tarangire National Park",
      tag: "tarangire_national_park",
      desc: "Tarangire National Park is a national park in Tanzania's Manyara Region. The name of the park originates from the Tarangire River that crosses the park.",
      imagePath: "/images/tanzania/tarangire.jpg",
      imageAlt: "Image of Tarangire National Park",
    },
    {
      name: "Ruaha National Park",
      tag: "ruaha_national_park",
      desc: "Ruaha National Park is a national park in Tanzania. The addition of the Usangu Game Reserve and other important wetlands to the park in 2008 increased its size to about 20,226 km2 (7,809 sq mi). ",
      imagePath: "/images/tanzania/ruaha.jpg",
      imageAlt: "Image of Ruaha National Park",
    },
    {
      name: "Selous Game Reserve",
      tag: "selous_game_reserve",
      desc: "The Selous Game Reserve is a protected area in southern Tanzania. It covers a total area of 50,000 km² and has additional buffer zones. ",
      imagePath: "/images/tanzania/selous.jpg",
      imageAlt: "Image of Selous Game Reserve",
    },
    {
      name: "Dar-es-Salaam",
      tag: "dar_es_salaam",
      desc: "Dar es Salaam, a major city and commercial port on Tanzania’s Indian Ocean coast, grew from a fishing village. ",
      imagePath: "/images/tanzania/dar-es-Salaam.jpg",
      imageAlt: "Image of Dar-es-Salaam",
    },
  ];

  const rwandaDefaultLocations = [
    {
      name: "Kigali",
      tag: "kigali",
      desc: "Kigali is the capital city of Rwanda, roughly in the center of the country. It sprawls across numerous hills, ridges and valleys, and has a vibrant restaurant and nightlife scene. ",
      imagePath: "/images/rwanda/kigali.jpg",
      imageAlt: "Image of Kigali",
    },
    {
      name: "Akagera National Park",
      tag: "akagera_national_park",
      desc: "Akagera National Park lies in eastern Rwanda, hugging the border with Tanzania. It's characterized by woodland, swamps, low mountains and savannah. ",
      imagePath: "/images/rwanda/akagera.jpg",
      imageAlt: "Image of Akagera National Park",
    },
    {
      name: "Volcanoes National Park",
      tag: "volcanoes_national_park",
      desc: "Volcanoes National Park is a national park in northwestern Rwanda. It covers 160 km² of rainforest and encompasses five of the eight volcanoes in the Virunga Mountains.",
      imagePath: "/images/rwanda/volcanoes.jpg",
      imageAlt: "Image of Volcanoes National Park",
    },
    {
      name: "Lake Kivu",
      tag: "lake_kivu",
      desc: "Lake Kivu is one of the African Great Lakes. It lies on the border between the Democratic Republic of the Congo and Rwanda, and is in the Albertine Rift, the western branch of the East African Rift.  ",
      imagePath: "/images/rwanda/kivu.jpg",
      imageAlt: "Image of Lake Kivu",
    },
    {
      name: "Nyungwe Forest National Park",
      tag: "nyungwe_forest_national_park",
      desc: "Nyungwe National Park lies in southwest Rwanda, partly abutting the Burundi border. It's a vast area of mountain rainforest, home to many species of chimpanzees, plus owl-faced and colobus monkeys.",
      imagePath: "/images/rwanda/nyungwe.jpg",
      imageAlt: "Image of Nyungwe Forest National Park",
    },
  ];

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleCheck = (event) => {
    var updatedList = [...currentOptions];
    if (event.target.checked) {
      updatedList = [...currentOptions, event.target.value];
      let allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      // in case the location = 0(not sure), if the user checks a different location, then the location should
      // be updated to the new location and remove the previous location(location = 0)
      // comma is added because if a user checks a location after checking a 'not sure' the output becomes "0,location2"
      // so we need to remove the comma and the 0
      allOptions = allOptions.replace("0,", "");

      router.replace(
        {
          query: {
            ...router.query,
            location: allOptions,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.replace(
        {
          query: {
            ...router.query,
            location: allOptions,
          },
        },
        undefined,
        { shallow: true }
      );
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.location) {
      setCurrentOptions(router.query.location.split(","));
    } else {
      setCurrentOptions([]);
    }
  }, [router.query.location]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  return (
    <div className="flex flex-wrap justify-between mt-4 gap-3">
      <div className="flex items-center flex-wrap gap-3 w-full justify-center mb-3">
        <div
          onClick={() => {
            setShowUgandaLocations(false);
            setShowKenyaLocations(true);
            setShowTanzaniaLocations(false);
            setShowRwandaLocations(false);
          }}
          className={
            "px-4 rounded-3xl py-2 cursor-pointer font-bold text-sm " +
            (showKenyaLocations
              ? "bg-gray-700 text-white border-2 border-gray-700"
              : "border-2 border-gray-700")
          }
        >
          Kenya
        </div>
        <div
          onClick={() => {
            setShowUgandaLocations(true);
            setShowKenyaLocations(false);
            setShowTanzaniaLocations(false);
            setShowRwandaLocations(false);
          }}
          className={
            "px-4 cursor-pointer rounded-3xl py-2 font-bold text-sm " +
            (showUgandaLocations
              ? "bg-gray-700 text-white border-2 border-gray-700"
              : "border-2 border-gray-700")
          }
        >
          Uganda
        </div>
        <div
          onClick={() => {
            setShowUgandaLocations(false);
            setShowKenyaLocations(false);
            setShowTanzaniaLocations(true);
            setShowRwandaLocations(false);
          }}
          className={
            "px-4 rounded-3xl py-2 cursor-pointer font-bold text-sm " +
            (showTanzaniaLocations
              ? "bg-gray-700 text-white border-2 border-gray-700"
              : "border-2 border-gray-700")
          }
        >
          Tanzania
        </div>
        <div
          onClick={() => {
            setShowUgandaLocations(false);
            setShowKenyaLocations(false);
            setShowTanzaniaLocations(false);
            setShowRwandaLocations(true);
          }}
          className={
            "px-4 rounded-3xl py-2 cursor-pointer font-bold text-sm " +
            (showRwandaLocations
              ? "bg-gray-700 text-white border-2 border-gray-700"
              : "border-2 border-gray-700")
          }
        >
          Rwanda
        </div>
      </div>
      {showKenyaLocations &&
        kenyaDefaultLocations.map((location, index) => (
          <label
            key={index}
            className={
              "w-full md:w-[47%] relative cursor-pointer flex border-2 overflow-hidden rounded-md max-h-[150px] " +
              (containsOption(location.tag) ||
              (!router.query.location && index === 0)
                ? "border-blue-500"
                : "border-gray-200")
            }
          >
            <Checkbox
              checked={containsOption(location.tag)}
              value={location.tag}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

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
                    (containsOption(location.tag) ||
                    (!router.query.location && index === 0)
                      ? "text-blue-600"
                      : "text-gray-200")
                  }
                />
              </div>
            </div>
          </label>
        ))}

      {showUgandaLocations &&
        ugandaDefaultLocations.map((location, index) => (
          <label
            key={index}
            className={
              "w-full md:w-[47%] relative cursor-pointer flex border-2 overflow-hidden rounded-md max-h-[150px] " +
              (containsOption(location.tag)
                ? "border-blue-500"
                : "border-gray-200")
            }
          >
            <Checkbox
              checked={containsOption(location.tag)}
              value={location.tag}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

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
                    (containsOption(location.tag)
                      ? "text-blue-600"
                      : "text-gray-200")
                  }
                />
              </div>
            </div>
          </label>
        ))}

      {showTanzaniaLocations &&
        tanzaniaDefaultLocations.map((location, index) => (
          <label
            key={index}
            className={
              "w-full md:w-[47%] relative cursor-pointer flex border-2 overflow-hidden rounded-md max-h-[150px] " +
              (containsOption(location.tag)
                ? "border-blue-500"
                : "border-gray-200")
            }
          >
            <Checkbox
              checked={containsOption(location.tag)}
              value={location.tag}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

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
                    (containsOption(location.tag)
                      ? "text-blue-600"
                      : "text-gray-200")
                  }
                />
              </div>
            </div>
          </label>
        ))}

      {showRwandaLocations &&
        rwandaDefaultLocations.map((location, index) => (
          <label
            key={index}
            className={
              "w-full md:w-[47%] relative cursor-pointer flex border-2 overflow-hidden rounded-md max-h-[150px] " +
              (containsOption(location.tag)
                ? "border-blue-500"
                : "border-gray-200")
            }
          >
            <Checkbox
              checked={containsOption(location.tag)}
              value={location.tag}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

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
                    (containsOption(location.tag)
                      ? "text-blue-600"
                      : "text-gray-200")
                  }
                />
              </div>
            </div>
          </label>
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
