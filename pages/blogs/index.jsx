import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getToken from "../../lib/getToken";
import Navbar from "../../components/ui/Navbar";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "../../components/Home/UserDropdown";
import Head from "next/head";

function Blogs({ blogs, userProfile }) {
  let doc = "";
  let image = "";

  const getText = (index) => {
    let text = "";
    if (process.browser) {
      doc = new DOMParser().parseFromString(blogs[index].content, "text/html");
      doc = [...doc.getElementsByTagName("p")].map(
        (text, index) => text.textContent
      );
      text = doc.join(" ");
    }

    return text;
  };

  if (process.browser) {
    image = new DOMParser().parseFromString(blogs[0].content, "text/html");
    image = [...image.getElementsByTagName("img")][0].src;
  }

  return (
    <div>
      <Head>
        <title>Winda.guide | Blog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="sticky top-0 w-full bg-white z-50">
        <Navbar userProfile={userProfile}></Navbar>
      </div>
      <div className="px-4 mt-8 !max-w-[900px] mx-auto flex flex-col gap-3">
        {blogs.map((blog, index) => (
          <div key={index}>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="flex md:flex-row flex-col gap-2">
                <div
                  className={
                    "flex flex-col md:order-1 order-2 " +
                    (blog.header_image_src ? "w-full md:w-[80%]" : "w-full")
                  }
                >
                  <h1 className="font-bold text-xl">{blog.name}</h1>
                  <p className="mt-4">{getText(index).slice(0, 250)}...</p>
                  <div className="mt-4 flex gap-2 items-center">
                    <div className="bg-gray-100 py-1 px-3 rounded-3xl">
                      {blog.category}
                    </div>
                    <div className="w-[1px] h-[60%] bg-gray-300">&nbsp;</div>
                    <div className="text-sm text-gray-600">
                      {blog.estimated_minute_read} min read
                    </div>
                  </div>
                </div>

                {blog.header_image_src && (
                  <div className="relative md:order-2 order-1 w-full h-[200px] md:w-[20%] md:h-[150px]">
                    <Image
                      layout="fill"
                      alt="Logo"
                      src={blog.header_image_src}
                      objectFit={"cover"}
                      objectPosition={"center"}
                      className="rounded-none"
                      priority
                    ></Image>
                  </div>
                )}
              </a>
            </Link>

            <div className="w-full mt-4 h-[0.5px] bg-gray-400">&nbsp;</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Blogs.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/blogs/`
    );

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
          blogs: data.results,
          userProfile: response.data[0],
        },
      };
    }

    return {
      props: {
        blogs: data.results,
        userProfile: "",
      },
    };
  } catch (error) {
    return {
      props: {
        blogs: [],
        userProfile: "",
      },
    };
  }
}

export default Blogs;
