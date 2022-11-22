import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MobileModal from "../../components/ui/MobileModal";
import Rating from "../ui/Rating";
import Input from "../ui/Input";
import TextArea from "../ui/TextArea";
import Button from "../ui/Button";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import axios from "axios";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import * as Yup from "yup";
import InputStarRating from "../ui/InputStarRating";

const CreateReview = ({ show, setShowCreateReview }) => {
  const [isSafari, setIsSafari] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewValue, setReviewValue] = useState(0);
  const [reviewError, setReviewError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("This field is required"),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (reviewValue === 0) {
        setReviewError(true);
        return;
      }

      try {
        setLoading(true);
        await axios.post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${router.query.slug}/create-review/`,
          {
            rate: reviewValue,
            message: values.description,
            title: values.title,
          },
          {
            headers: {
              Authorization: "Token " + Cookies.get("token"),
            },
          }
        );
        location.reload();
      } catch (error) {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    setReviewError(false);
  }, [reviewValue]);

  return (
    <MobileModal
      showModal={show}
      closeModal={() => {
        setShowCreateReview(false);
      }}
      containerHeight={90}
      title="Add a Review"
      className="md:w-[650px]"
    >
      <div className="mt-6 flex flex-col items-center">
        <h1 className="text-gray-500 text-center">
          Your overall rating for this place
        </h1>
        <InputStarRating
          value={reviewValue}
          setValue={setReviewValue}
        ></InputStarRating>
        {reviewError && (
          <h1 className="text-red-600 font-bold text-center">
            Please rate the place
          </h1>
        )}
      </div>
      {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque nihil doloribus, molestiae modi perspiciatis officiis distinctio, commodi dolor ex odit voluptatibus, ipsum ullam! Sunt magnam, nemo quos ex praesentium ab.
      Eligendi cumque, ratione culpa a dignissimos quis esse, eveniet enim, corrupti odio reiciendis tenetur eum officia fuga corporis quod delectus. Ratione maiores repellendus voluptate veritatis quas dolore, qui rerum praesentium!
      Iusto eos voluptates libero optio delectus culpa modi quod fugiat, qui necessitatibus repudiandae fugit blanditiis odio doloremque facilis earum perspiciatis, incidunt possimus adipisci maxime ipsam tempora sed. Assumenda, veniam in?
      Reprehenderit id at aperiam fuga velit odit numquam ea eveniet, laboriosam voluptatum! Itaque vero nostrum iure quia! Architecto qui reiciendis saepe, inventore nam eligendi? A perspiciatis omnis deserunt quidem sed?
      Blanditiis, repellendus debitis. Ex ab fugiat aliquam rerum nihil eligendi libero a? Eos doloremque quos laudantium beatae ipsa, labore deserunt! Iusto maxime in aperiam voluptates impedit natus cupiditate, maiores delectus. */}

      <div className="px-4">
        <div className="mt-6 flex flex-col">
          <Input
            placeholder="Title"
            name="title"
            type="text"
            label="Set a title for your review"
            className={"w-full "}
            errorStyle={
              formik.touched.title && formik.errors.title ? true : false
            }
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title.slice(0, 100)}
          ></Input>
          {formik.touched.title && formik.errors.title ? (
            <span className="text-sm mt-1 font-bold text-red-400">
              {formik.errors.title}
            </span>
          ) : null}
        </div>

        <div className="text-sm mt-1 text-gray-400">
          {100 - formik.values.title.slice(0, 100).length} Characters left
        </div>
        <div className="mt-6 flex flex-col">
          <TextArea
            placeholder="Description"
            name="title"
            label="What do you like or dislike?"
            className={"w-full "}
            {...formik.getFieldProps("description")}
          ></TextArea>
        </div>
        <Button
          type="submit"
          onClick={formik.handleSubmit}
          disabled={loading ? true : false}
          className={
            "mt-5 w-full px-5 flex items-center gap-2 !py-3 !bg-[#303960] hover:!bg-[#202642] !rounded-full !text-base " +
            (loading ? "opacity-60" : "")
          }
        >
          <span>Review</span>
          <div>
            {loading ? (
              <LoadingSpinerChase width={20} height={20}></LoadingSpinerChase>
            ) : (
              ""
            )}
          </div>
        </Button>
      </div>
    </MobileModal>
  );
};

CreateReview.propTypes = {};

export default CreateReview;
