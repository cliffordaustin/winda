import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Checkbox from "../ui/Checkbox";

function TripCategories(props) {
  const router = useRouter();

  const [currentOptions, setCurrentOptions] = useState([]);

  const handleCheck = (event) => {
    var updatedList = [...currentOptions];
    if (event.target.checked) {
      updatedList = [...currentOptions, event.target.value];
      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.replace(
        {
          query: {
            ...router.query,
            tag: allOptions,
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
            tag: allOptions,
          },
        },
        undefined,
        { shallow: true }
      );
    }
    setCurrentOptions(updatedList);
  };

  useEffect(() => {
    if (router.query.tag) {
      setCurrentOptions(router.query.tag.split(","));
    } else {
      setCurrentOptions([]);
    }
  }, [router.query.tag]);

  const containsOption = (option) => {
    return currentOptions.includes(option);
  };

  const categories = [
    {
      name: "Weekend getaway",
      tag: "weekend_getaway",
      icon_name: "bi:calendar-week",
    },
    {
      name: "Family",
      tag: "family",
      icon_name: "carbon:pedestrian-family",
    },
    {
      name: "Group getaway",
      tag: "group_getaway",
      icon_name: "akar-icons:people-group",
    },
    {
      name: "Romantic",
      tag: "romantic",
      icon_name: "icon-park-outline:oval-love-two",
    },
    {
      name: "Honeymoon",
      tag: "honeymoon",
      icon_name: "fluent-mdl2:vacation",
    },
    {
      name: "Beach",
      tag: "beach",
      icon_name: "fluent:beach-16-regular",
    },
    {
      name: "Safari",
      tag: "safari",
      icon_name: "tabler:brand-safari",
    },
    {
      name: "Walking/Hiking",
      tag: "hiking",
      icon_name: "la:hiking",
    },
    {
      name: "Road trip",
      tag: "road_trip",
      icon_name: "bx:trip",
    },
    {
      name: "Wellness",
      tag: "wellness",
      icon_name: "iconoir:yoga",
    },
    {
      name: "Cultural",
      tag: "cultural",
      icon_name: "carbon:agriculture-analytics",
    },

    {
      name: "Sustainable",
      tag: "sustainable",
      icon_name: "icon-park-outline:green-new-energy",
    },
    {
      name: "Culinary",
      tag: "culinary",
      icon_name: "tabler:tools-kitchen-2",
    },
    {
      name: "Community owned",
      tag: "community_owned",
      icon_name: "majesticons:community-line",
    },
    {
      name: "Off grid",
      tag: "off_grid",
      icon_name: "ic:outline-emoji-nature",
    },
    {
      name: "Night game drives",
      tag: "night_game_drives",
      icon_name: "fontisto:night-clear",
    },
    {
      name: "Short getaways",
      tag: "short_getaways",
      icon_name: "entypo:time-slot",
    },

    {
      name: "Lake",
      tag: "lake",
      icon_name: "iconoir:sea-and-sun",
    },
    {
      name: "Solo getaway",
      tag: "solo_getaway",
      icon_name: "akar-icons:person",
    },

    {
      name: "Shopping",
      tag: "shopping",
      icon_name: "akar-icons:shopping-bag",
    },

    {
      name: "Art",
      tag: "art",
      icon_name: "emojione-monotone:artist-palette",
    },
    {
      name: "Watersports",
      tag: "watersports",
      icon_name: "ic:baseline-surfing",
    },
    {
      name: "Sailing",
      tag: "sailing",
      icon_name: "ic:outline-sailing",
    },
    {
      name: "All female",
      tag: "all_female",
      icon_name: "la:female",
    },
    {
      name: "Luxury",
      tag: "luxury",
      icon_name: "cil:diamond",
    },
    {
      name: "Budget",
      tag: "budget",
      icon_name: "tabler:report-money",
    },

    {
      name: "Mid-range",
      tag: "mid_range",
      icon_name: "material-symbols:price-change-outline-sharp",
    },
  ];
  return (
    <div className="flex flex-wrap md:justify-center mt-4 gap-3 px-3 md:px-0">
      {categories.map((category, index) => (
        <label
          key={index}
          className={
            "w-[47%] md:w-[150px] relative cursor-pointer flex flex-col items-center justify-center gap-1 border-2 overflow-hidden rounded-md h-[70px] " +
            (containsOption(category.tag) || (!router.query.tag && index == 0)
              ? "border-blue-600"
              : "border-gray-200")
          }
        >
          <Checkbox
            checked={containsOption(category.tag)}
            value={category.tag}
            onChange={handleCheck}
            hideInput={true}
          ></Checkbox>

          <Icon className="w-6 h-6" icon={category.icon_name} />
          <p className="font-bold text-sm">{category.name}</p>

          <div className="absolute top-1 right-2">
            <Icon
              icon="mdi:checkbox-marked-circle"
              className={
                " " +
                (containsOption(category.tag) ||
                (!router.query.tag && index == 0)
                  ? "text-blue-600"
                  : "text-gray-200")
              }
            />
          </div>
        </label>
      ))}
    </div>
  );
}

TripCategories.propTypes = {};

export default TripCategories;
