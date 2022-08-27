import React, { useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Main.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Mousewheel } from "swiper";
import SwiperCore from "swiper";

import "swiper/css/effect-creative";
import "swiper/css";
import Pagination from "./Pagination";
import Image from "next/image";
import Carousel from "../ui/Carousel";
import { useRouter } from "next/router";
import Dialogue from "./Dialogue";
import Link from "next/link";

SwiperCore.use([Navigation]);

function Main() {
  const router = useRouter();

  const [state, setState] = useState({
    swiperIndex: 0,
    allowSlideNext: false,
    endOfSlide: false,
    swiperTravelIndex: 0,
    allowTravelSlideNext: false,
    endOfTravelSlide: false,
    swiperExploreLocationIndex: 0,
    allowExploreLocationSlideNext: false,
    endOfExploreLocationSlide: false,

    isEndOfSlide: false,
    isBeginningOfSlide: false,
    isEndOfExploreSlide: false,
    isBeginningOfExploreSlide: false,
  });

  const settings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    mousewheel: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };

  const roomsSettings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-room-button-next",
      prevEl: ".swiper-room-button-prev",
    },
  };

  const exploreSettings = {
    spaceBetween: 20,
    slidesPerView: "auto",
    freeMode: {
      enabled: true,
    },
    navigation: {
      nextEl: ".swiper-explore-button-next",
      prevEl: ".swiper-explore-button-prev",
    },
  };

  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="w-full">
      <h1 className="font-bold text-3xl font-OpenSans text-center">
        <span className="text-gray-600">Explore on</span>{" "}
        <span className="">winda</span>
      </h1>
      <div className="text-center mt-2">
        Take a look into what winda has to offer you.
      </div>
      <div className="px-2 sm:px-4 mt-6">
        <Swiper
          {...settings}
          modules={[FreeMode, Navigation, Mousewheel, Thumbs]}
          className=""
        >
          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-40">
              <Carousel
                images={["/images/home/cultural-trip.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Explore the culture
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  Kenya has a vast and rich culture, so we created trips
                  dedicated to exploring it.
                </p>
                <Link href="/trip?tag=cultural">
                  <a>
                    <div className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2">
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>
            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="w-[48%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/stays-location.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Nairobi
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    Nairobi is the capital of Kenya and East Africa’s most
                    cosmopolitan city, with a vibrant population of 4.5 million.
                    Unique to the city is the proximity of Nairobi National
                    Park, a true wilderness area juxtaposed against the larger
                    urban metropolis.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("nairobi-stays");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "nairobi-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Nairobi"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      Nairobi is a concrete jungle like no other, being the only
                      national park like it in the world and a real embodiment
                      of the human-wildlife conflicts that challenge many
                      African communities who must learn to cohabitate with
                      wildlife on their doorstep.
                    </p>
                    <br />
                    <p>
                      Nairobi National Park is one of the best places in Africa
                      to see rhino and also has a healthy population of lion,
                      leopard, cheetah, and plains game like giraffe and
                      antelope. Other attractions include the African Heritage
                      House, the Giraffe Center, Sheldrick’s Elephant Orphanage,
                      a visit to the African market for exquisite pieces of
                      African artefacts from the continent, there are many
                      Maasai market where you can shop for local crafts and
                      trinkets. There&apos;s also a budding restaurant scene to
                      explore, from roadside food stalls to local nyama-choma
                      (barbecue joints) to five-star dining restaurants.
                      There&apos;s a vibrant entertainment scene ranging from
                      local bars to nightclubs, live music and jazz spots. There
                      are few art galleries that you can explore and very funky
                      artistic events including Gondwana - East Africa&apos;s
                      premier
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>

              <div className="h-full w-[48%] flex flex-col gap-2">
                <div className="w-full h-[49%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/nairobi.jpg"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Stays in Nairobi
                  </div>

                  <Link href="/stays?search=Nairobi">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View stays
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="w-full h-[49%] relative self-end before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/nairobi-experience.jpg"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Experiences in Nairobi
                  </div>

                  <Link href="/experiences?search=Nairobi">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View experiences
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/romantic-trip.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Romantic mood
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  The best memories are the ones you create with your perfect
                  partner. We created curated trip meant for you to create those
                  moments.
                </p>
                <Link href="/trip?tag=romantic_getaway">
                  <a>
                    <div className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2">
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="w-[48%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/naivasha.jpg"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Naivasha
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    The vibrant town of Naivasha sits on the northeast side of
                    the lake and the rest of the lake is surrounded by small
                    farms, tourist lodges, and even an active geothermal
                    project.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("naivasha-stays");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "naivasha-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Naivasha"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      Most visitors enjoy water activities on the lake, bird
                      watching, and visits to the local flower farms; a round of
                      golf at Green Park and tea at Elsamere with their resident
                      colobus monkeys.
                    </p>
                    <br />
                    <p>
                      At an elevation of 1,883 m (6,181 ft), Lake Naivasha is
                      the highest elevation lake in the Great Rift Valley,
                      though it is fairly shallow with depths ranging from 6 -
                      30 m (20 - 100 ft). The lake itself is 139 km2 (53 mi2) in
                      size and part of an ancient pleistocene lake and volcanic
                      system. The freshwater lake is home to many species of
                      fish, birds, and a decent population of hippopotamus. It
                      has over the years been susceptible to invasive species
                      such as crayfish, carp and hyacinth.
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>

              <div className="h-full w-[48%] flex flex-col gap-2">
                <div className="w-full h-[49%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/nakuru.jpg"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Stays in Naivasha
                  </div>

                  <Link href="/stays?search=Naivasha">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View stays
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="w-full h-[49%] relative self-end before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/nakuru-experience.jpg"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Experiences in Naivasha
                  </div>

                  <Link href="/experiences?search=Naivasha">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View experiences
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[400px] sm:!h-[380px] !w-[900px] sm:!w-[1000px] md:!w-[1100px] lg:!w-[1200px] flex gap-3">
            <div className="xsmall:w-[30%] w-[35%] sm:w-[40%] h-full relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/roadtrip.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-2xl">
                Spend time on the road
              </div>

              <div className="absolute bottom-4 z-30 flex flex-col left-4">
                <p className="text-white">
                  Kenya is a country to has a lot to offer. We created curated
                  trips meant for your explore the country and enjoy your time.
                </p>

                <Link href="/trip?tag=road_trip">
                  <a>
                    <div className="px-3 cursor-pointer font-bold text-sm py-2 w-fit bg-white text-black rounded-lg mt-2">
                      View curated trips
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            <div className="xsmall:w-[70%] w-[65%] sm:w-[60%] h-full flex justify-between flex-wrap">
              <div className="w-[48%] relative rounded-2xl h-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-60">
                <Carousel
                  images={["/images/home/massai-mara.jpeg"]}
                  imageClass="rounded-2xl"
                ></Carousel>
                <div className="text-white text-shadow z-30 font-black absolute top-4 left-4 text-xl">
                  Maasai Mara
                </div>

                <div className="absolute bottom-2 z-30 flex flex-col left-2">
                  <p className="mt-1 text-sm text-white">
                    Named in honour of the Maasai people who call this corner of
                    Africa home. Spanning 1510 km2 (583 mi2) the Mara ecosystem
                    boasts of quality of wildlife viewing. It is haven for
                    photography and every year visitors come to capture the
                    spectacular wildlife. The reserve and its conservancies
                    contain some of the highest densities of predators in Africa
                    peaking during the seasonal wildebeest migration.
                  </p>
                  <div
                    onClick={() => {
                      setSelectedLocation("massai-mara-stays");
                    }}
                    className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2"
                  >
                    Show more
                  </div>
                </div>
              </div>
              <Dialogue
                isOpen={selectedLocation === "massai-mara-stays"}
                closeModal={() => {
                  setSelectedLocation("");
                }}
                title="Maasai Mara"
                dialogueTitleClassName="!font-bold"
                dialoguePanelClassName="max-h-[500px] max-w-lg overflow-y-scroll remove-scroll"
              >
                <div className="mt-2">
                  <p className="text-sm">
                    <p>
                      It overlooks sweeping savannas, riverine woodlands, and
                      forests on a deceptively flat landscape that extends
                      eastwards towards the Sekenani Hills and northwards
                      towards the Aitong Hills. The Mara is in essence the
                      northern extension of the Mara-Serengeti ecosystem and
                      plays host to one of nature&apos;s greatest phenomenons,
                      the Great Wildebeest Migration. Maasai Mara is
                      world-renowned for itss exceptional populations of lion,
                      leopard, cheetah, buffalo, black rhino, and a thriving
                      elephant population. Around July of each year, the Great
                      Migration arrives in the Maasai Mara National Reserve for
                      its annual four-month stay.
                    </p>
                    <br />
                    <p>
                      Maasai Mara is a game reserve ran by the county government
                      of Narok. Surrounding the reserve are many conservancies
                      that are privately owned and offer more exclusive
                      experiences such as night game drives and bush walks which
                      are not allowed in the reserve. This is something to
                      consider when choosing your lodge.
                    </p>
                    <br />
                    <p>
                      The conservancy approach is widely seen as the way forward
                      for wildlife conservation and eco-tourism in Kenya because
                      it not only secures vital space for wildlife but includes
                      the local population as custodians of their national
                      heritage. This has been vital not only for the
                      conservation of the whole greater Mara but also for
                      wildlife corridors and the prosperity of many hundreds of
                      Maasai families. Nearly forty tourist camps contribute to
                      employment amongst the communities and provide a presence,
                      alongside Maasai anti-poaching units, for the protection
                      of the wildlife.
                    </p>
                    <br />
                    <h1 className="text-lg font-bold mb-1">
                      The Wildebeest Migration
                    </h1>
                    <p>
                      The Great Wildebeest Migration is one of the Seven Natural
                      Wonders of the World and sees around two million animals
                      (including wildebeest, zebras and gazelles) make the
                      annual pilgrimage between the Maasai Mara and the
                      Serengeti. It is not as straightforward as a south to
                      north and return movement, but dictated by the drive to
                      the calving grounds in the southern Serengeti and rainfall
                      patterns throughout the ecosystem as the animals seek
                      fresh grazing grasses and standing water.
                    </p>
                    <br />

                    <h1 className="text-lg font-bold mb-1">Mara Triangle</h1>
                    <p>
                      West of the Mara River, beneath the Oloololo escarpment
                      and bordered by Tanzania to the south, lies the jewel of
                      this great reserve: the Mara Triangle. Not only is this
                      the most productive part of the entire Serengeti-Mara
                      ecosystem in terms of grass nutrition, but it is also
                      spectacularly scenic. The huge grassy plains are dotted
                      with widely spaced Balanites trees that give the landscape
                      an almost manicured look which, together with the
                      steep-sided escarpment and broad Mara River, provides a
                      breath-taking backdrop for wildlife photographers.
                    </p>

                    <br />

                    <p>
                      The Mara Triangle has been most efficiently managed by the
                      Mara Conservancy for the past 15 years – evidenced in the
                      guides’ discipline, successful anti-poaching efforts, and
                      impressive road infrastructure. For much of the year, the
                      Mara Triangle has the lowest density of visitors in the
                      Greater Maasai Mara, with just two lodges within its
                      perimeters and a few on the northern border.
                    </p>
                  </p>
                </div>

                <div className="fixed top-3 right-4 flex flex-col">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation("");
                    }}
                    className="flex cursor-pointer items-center justify-center w-7 h-7 rounded-full bg-white shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              </Dialogue>

              <div className="h-full w-[48%] flex flex-col gap-2">
                <div className="w-full h-[49%] relative before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/stay-maasai-mara.jpg"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Stays in Maasai Mara
                  </div>

                  <Link href="/stays?search=Maasai Mara">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View stays
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="w-full h-[49%] relative self-end before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
                  <Carousel
                    images={["/images/home/maasai-mara-loita.JPG"]}
                    imageClass="rounded-2xl"
                  ></Carousel>

                  <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                    Experiences in Maasai Mara
                  </div>

                  <Link href="/experiences?search=Maasai Mara">
                    <a>
                      <div className="absolute bottom-2 z-30 flex flex-col left-2">
                        <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                          View experiences
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Find stays that suits you</span>
      </h1>

      <div className="px-2">
        <Swiper
          {...roomsSettings}
          modules={[FreeMode, Navigation, Thumbs]}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfSlide: swiper.isEnd,
              isBeginningOfSlide: swiper.isBeginning,
            });
          }}
          className="!relative"
        >
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/lodging.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Lodge
              </div>

              <Link href="/stays?type_of_stay=LODGE">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Campsites
              </div>

              <Link href="/stays?type_of_stay=CAMPSITE">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/campsite-tented.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Tented camps
              </div>

              <Link href="/stays?type_of_stay=TENTED CAMP">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/uniquespace.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Unique spaces
              </div>

              <Link href="/stays?type_of_stay=UNIQUE SPACE">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/budget.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Budget
              </div>

              <Link href="/stays?pricing_type=REASONABLE">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/mid-range.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Mid-Range
              </div>

              <Link href="/stays?pricing_type=MID-RANGE">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/luxury.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Luxurious
              </div>

              <Link href="/stays?pricing_type=HIGH-END">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-prev rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-room-button-next rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
        </Swiper>
      </div>

      <h1 className="font-bold text-2xl font-OpenSans text-center mt-16 mb-4">
        <span className="text-gray-600">Explore all our services</span>
      </h1>

      <div className="px-2">
        <Swiper
          {...exploreSettings}
          onSwiper={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          onSlideChange={(swiper) => {
            setState({
              ...state,
              isEndOfExploreSlide: swiper.isEnd,
              isBeginningOfExploreSlide: swiper.isBeginning,
            });
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="!relative"
        >
          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/curatedtrips.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Curated trips
              </div>

              <Link href="/trip">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View curated trips
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/stays.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Stays
              </div>

              <Link href="/stays">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View stays
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/experiences.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Experiences
              </div>

              <Link href="/experiences">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View experiences
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <SwiperSlide className="!h-[320px] !w-[320px]">
            <div className="relative h-full w-full before:absolute before:h-full before:w-full before:bg-black before:rounded-2xl before:z-20 before:opacity-20">
              <Carousel
                images={["/images/home/transport.jpg"]}
                imageClass="rounded-2xl"
              ></Carousel>

              <div className="text-white text-shadow z-30 font-black absolute top-2 left-2 text-xl">
                Transport
              </div>

              <Link href="/transport">
                <a>
                  <div className="absolute bottom-2 z-30 flex flex-col left-2">
                    <div className="px-3 cursor-pointer font-bold text-sm py-1.5 w-fit bg-white text-black rounded-lg mt-2">
                      View transport
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </SwiperSlide>

          <div
            className={
              " absolute hidden md:flex h-12 w-12 z-30 left-3 top-[50%] -translate-y-2/4 items-center justify-end " +
              (state.isBeginningOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-explore-button-prev rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            className={
              " absolute hidden md:flex h-12 w-12 z-30 right-3 top-[50%] -translate-y-2/4 items-center " +
              (state.isEndOfExploreSlide ? "invisible" : "")
            }
          >
            <div className="cursor-pointer h-8 w-8 swiper-explore-button-next rounded-full border flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
        </Swiper>
      </div>
    </div>
  );
}

export default Main;
