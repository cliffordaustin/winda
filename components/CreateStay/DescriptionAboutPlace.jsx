import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import styles from "../../styles/Stay.module.css";

import { useDispatch, useSelector } from "react-redux";

import { updateDescriptionAboutPlace } from "../../redux/actions/stay";

const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
});

const DescriptioneAboutPlace = (props) => {
  const dispatch = useDispatch();

  const descriptionAboutPlace = useSelector(
    (state) => state.stay.descriptionAboutPlace
  );

  // const formik = useFormik({
  //   initialValues: {
  //     descriptionAboutPlace: "",
  //   },
  // });

  return (
    <div className="lg:px-6 px-4">
      <div
        className={styles.describesHeader + " !text-xl font-medium md:hidden"}
      >
        Describe your place to your guest
      </div>
      <div className="!h-[250px] md:!h-[400px] mt-12">
        <ReactQuill
          theme="snow"
          name="descriptionAboutPlace"
          placeholder="Description about place"
          value={descriptionAboutPlace}
          className="h-full"
          onChange={(value) => dispatch(updateDescriptionAboutPlace(value))}
        ></ReactQuill>
      </div>
    </div>
  );
};

DescriptioneAboutPlace.propTypes = {};

export default DescriptioneAboutPlace;
