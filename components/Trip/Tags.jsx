// Import Swiper React components
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import Checkbox from "../ui/Checkbox";

const Tags = () => {
  const settings = {
    spaceBetween: 10,
    navigation: {
      nextEl: ".slideNext-btn",
      prevEl: ".slidePrev-btn",
    },
  };
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

      router.push({ query: { ...router.query, tag: allOptions } });
    } else {
      updatedList.splice(currentOptions.indexOf(event.target.value), 1);

      const allOptions = updatedList
        .toString()
        .replace("[", "") // remove [
        .replace("]", "") // remove ]
        .trim(); // remove all white space

      router.push({ query: { ...router.query, tag: allOptions } });
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

  return (
    <div className="w-[100%] relative sm:!w-[80%] lg:!w-[80%] h-full flex items-center">
      <Swiper
        {...settings}
        slidesPerView={"auto"}
        freeMode={true}
        watchSlidesProgress={true}
        onSlideChange={() => {}}
        onSwiper={(swiper) => {}}
        modules={[FreeMode, Navigation, Thumbs]}
        className={"!w-full relative "}
      >
        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("weekend_getaway")}
              value={"weekend_getaway"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="bi:calendar-week" />
            <div className="text-sm">Weekend getaway</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("weekend_getaway") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("day_trips")}
              value={"day_trips"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="fluent:clipboard-day-20-regular" />
            <div className="text-sm">Day trips</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("day_trips") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("family")}
              value={"family"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="carbon:pedestrian-family" />
            <div className="text-sm">Family</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("family") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("groups")}
              value={"groups"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="akar-icons:people-group" />
            <div className="text-sm">Group getaway</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("groups") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("romantic")}
              value={"romantic"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="icon-park-outline:oval-love-two" />
            <div className="text-sm">Romantic</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("romantic") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("beach")}
              value={"beach"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="fluent:beach-16-regular" />
            <div className="text-sm">Beach</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("beach") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("unconventional_safaris")}
              value={"unconventional_safaris"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="tabler:brand-safari" />
            <div className="text-sm">Unconventional Safaris</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("unconventional_safaris") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("walking_hiking")}
              value={"walking_hiking"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="la:hiking" />
            <div className="text-sm">Walking/Hiking</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("walking_hiking") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("road_trip")}
              value={"road_trip"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="bx:trip" />
            <div className="text-sm">Road trip</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("road_trip") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("park_conservancies")}
              value={"park_conservancies"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="emojione-monotone:national-park" />
            <div className="text-sm">Park & conservancies</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("park_conservancies") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("day_game_drives")}
              value={"day_game_drives"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="icon-park-outline:game-emoji" />
            <div className="text-sm">Day game drives</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("day_game_drives") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("wellness")}
              value={"wellness"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="iconoir:yoga" />
            <div className="text-sm">Wellness</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("wellness") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("cultural")}
              value={"cultural"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="carbon:agriculture-analytics" />
            <div className="text-sm">Cultural</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("cultural") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("sustainable")}
              value={"sustainable"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon
              className="w-6 h-6"
              icon="icon-park-outline:green-new-energy"
            />
            <div className="text-sm">Sustainable safari</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("sustainable") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("culinary")}
              value={"culinary"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="tabler:tools-kitchen-2" />
            <div className="text-sm">Culinary</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("culinary") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("community_owned")}
              value={"community_owned"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="majesticons:community-line" />
            <div className="text-sm">Community owned</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("community_owned") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("off_grid")}
              value={"off_grid"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="ic:outline-emoji-nature" />
            <div className="text-sm">Off-grid</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("off_grid") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("night_game_drives")}
              value={"night_game_drives"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="fontisto:night-clear" />
            <div className="text-sm">Night game drives</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("night_game_drives") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("solo_getaway")}
              value={"solo_getaway"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="akar-icons:person" />
            <div className="text-sm">Solo getaway</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("solo_getaway") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("shopping")}
              value={"shopping"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="akar-icons:shopping-bag" />
            <div className="text-sm">Shopping</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("shopping") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("art")}
              value={"art"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="emojione-monotone:artist-palette" />
            <div className="text-sm">Art</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("art") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("watersports")}
              value={"watersports"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="ic:baseline-surfing" />
            <div className="text-sm">Watersports</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("watersports") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("sailing")}
              value={"sailing"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="ic:outline-sailing" />
            <div className="text-sm">Sailing</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("sailing") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("all_female")}
              value={"all_female"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="la:female" />
            <div className="text-sm">All-female</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("all_female") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("luxury")}
              value={"luxury"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="cil:diamond" />
            <div className="text-sm">Luxury</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("luxury") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("budget")}
              value={"budget"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="tabler:report-money" />
            <div className="text-sm">Budget</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("budget") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("mid_range")}
              value={"mid_range"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon
              className="w-6 h-6"
              icon="material-symbols:price-change-outline-sharp"
            />
            <div className="text-sm">Mid-range</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("mid_range") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("short_getaways")}
              value={"short_getaways"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="entypo:time-slot" />
            <div className="text-sm">Short getaway</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("short_getaways") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>

        <SwiperSlide className="!w-fit flex justify-center flex-col items-center">
          <label
            className={
              "flex flex-col items-center justify-center px-2 cursor-pointer"
            }
          >
            <Checkbox
              checked={containsOption("lake")}
              value={"lake"}
              onChange={handleCheck}
              hideInput={true}
            ></Checkbox>

            <Icon className="w-6 h-6" icon="iconoir:sea-and-sun" />
            <div className="text-sm">Lakes</div>
            <div
              className={
                "w-[20px] rounded-full h-1 mt-0.5 " +
                (containsOption("lake") ? "bg-gray-700" : "")
              }
            ></div>
          </label>
        </SwiperSlide>
      </Swiper>
      <div
        className={
          "hidden absolute h-12 w-12 -left-14 md:flex items-center justify-end "
        }
      >
        <div className="cursor-pointer h-8 w-8 slidePrev-btn rounded-full border flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>

      <div
        className={"hidden absolute h-12 w-12 -right-14 md:flex items-center "}
      >
        <div className="cursor-pointer h-8 w-8 slideNext-btn rounded-full border flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Tags;
