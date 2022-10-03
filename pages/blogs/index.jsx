import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getToken from "../../lib/getToken";
import Navbar from "../../components/Home/Navbar";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "../../components/Home/UserDropdown";

function Blogs({ blogs, userProfile }) {
  let doc = "";
  let text = "";
  let image = "";

  if (process.browser) {
    doc = new DOMParser().parseFromString(blogs[0].content, "text/html");
    doc = [...doc.getElementsByTagName("p")].map(
      (text, index) => text.textContent
    );
    text = doc.join(" ");
  }

  if (process.browser) {
    image = new DOMParser().parseFromString(blogs[0].content, "text/html");
    image = [...image.getElementsByTagName("img")][0].src;
  }

  return (
    <div>
      <div className="sticky border-b top-0 w-full bg-white z-50">
        <div className="bg-white sm:px-12 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-1">
            <div className="relative w-[40px] h-[60px]">
              <Image
                layout="fill"
                alt="Logo"
                src="/images/winda_logo/winda-logo.png"
                priority
              ></Image>
            </div>
            <div className="text-xl self-end py-2 text-slate-700">
              <h1 className="uppercase font-normal">Winda blog</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserDropdown
              userProfile={userProfile}
              isHomePage={true}
            ></UserDropdown>
          </div>
        </div>
      </div>
      <div className="px-4 mt-8 !max-w-[900px] mx-auto flex flex-col gap-3">
        {blogs.map((blog, index) => (
          <div key={index}>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="flex gap-2">
                <div
                  className={"flex flex-col " + (image ? "w-[80%]" : "w-full")}
                >
                  <h1 className="font-bold text-xl">{blog.name}</h1>
                  <p className="mt-4">{text.slice(0, 250)}...</p>
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

                {image && (
                  <div className="relative w-[20%] h-[150px]">
                    <Image
                      layout="fill"
                      alt="Logo"
                      src={image}
                      objectFit={"cover"}
                      className="rounded-lg"
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