import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import Button from "../../components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const AboutUs = ({ userProfile }) => {
  return (
    <div className="">
      <Head>
        <title>Winda.guide | About us</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <div className="mb-24">
        <div className="w-full text-red-600 h-[500px] relative before:absolute before:h-full before:w-full before:bg-black before:z-20 before:opacity-60">
          <Image
            className={"w-full "}
            layout="fill"
            objectFit="cover"
            src="/images/about-us-img.jpg"
            objectPosition={"center"}
            sizes="380"
            alt="Image of samburu man looking at a vast landscape"
            unoptimized={true}
            priority
          />

          <div className="absolute w-full left-[0] md:left-[5%] bottom-[10%] z-20 px-6 md:px-0">
            <h1 className="font-black font-SourceSans mb-2 text-3xl sm:text-4xl md:text-5xl xl:text-7xl text-white uppercase ">
              Our Mission
            </h1>
          </div>
        </div>

        <article className="mt-6 mb-10 px-6 sm:px-16">
          <p>
            Winda.guide was borne out of a frustration around traveling within
            Africa. Outside of the mainstream tourist destinations which tend to
            have fixed packages and are overcrowded there&apos;s little
            information on where else to explore, how to get there and where you
            can stay and what you can do. We are a team of Kenyans who love to
            travel and we&apos;ve covered over 100 hundred countries between us
            across the world - the one observation with traveling in Africa is
            the over-reliance on agents or other people to give you
            recommendations on where to go. We have changed that travel
            experience. Now you can come to winda.guide. Explore the vast array
            of travel destinations, build your whole itinerary with us and book
            everything with us.
          </p>

          <p className="mt-4">
            Our mission is simple: to uncover all that Africa has to offer and
            show it to the world.
          </p>

          <p className="mt-4">
            Join us on this journey, let&apos;s discover Africa together.
          </p>

          <div className="w-full flex items-center justify-center mt-6 mb-12">
            <Link href="/">
              <a>
                <Button className="!rounded-lg h-[65%] !flex gap-1 !px-1 !py-3 !bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 items-center justify-center w-[200px]">
                  <span className="font-bold uppercase">
                    Explore with winda
                  </span>
                </Button>
              </a>
            </Link>
          </div>
        </article>
      </div>

      <div className="md:fixed bottom-0 left-0 right-0">
        <Footer></Footer>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
        },
      };
    }

    return {
      props: {
        userProfile: "",
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
        },
      };
    }
  }
}

AboutUs.propTypes = {};

export default AboutUs;
