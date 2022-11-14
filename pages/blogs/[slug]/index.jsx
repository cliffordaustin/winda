import React from "react";
import { createGlobalStyle } from "styled-components";
import PropTypes from "prop-types";
import axios from "axios";
import getToken from "../../../lib/getToken";
import parse from "html-react-parser";
import Navbar from "../../../components/Home/Navbar";
import Image from "next/image";
import UserDropdown from "../../../components/Home/UserDropdown";
import Head from "next/head";

function Blog({ blog, userProfile }) {
  const GlobalStyle = createGlobalStyle`
    // img {
    //      width: 100%;
    //     //  height: 577px;
    //     //  object-fit: cover;

    //      @media (max-width: 640px) {
    //         height: 420px;
    //         width: 100vw;
    //       }
    // }
`;

  let doc = "";
  if (process.browser) {
    doc = new DOMParser().parseFromString(blog.content, "text/html");
    doc = doc.body.innerHTML;
  }
  return (
    <div>
      <Head>
        <title>{blog.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
      <GlobalStyle></GlobalStyle>
      <article className="prose !leading-6 !text-base mt-5 translate-x-0 lg:prose-xl px-4 !w-full !max-w-[900px] mx-auto">
        <h2 className="text-center font-black">{blog.name}</h2>
        {parse(doc)}
      </article>
    </div>
  );
}

Blog.propTypes = {};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/blogs/${context.query.slug}/`
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
          blog: data,
          userProfile: response.data[0],
        },
      };
    }

    return {
      props: {
        blog: data,
        userProfile: "",
      },
    };
  } catch (error) {
    return {
      props: {
        blog: {},
        userProfile: "",
      },
    };
  }
}

export default Blog;
