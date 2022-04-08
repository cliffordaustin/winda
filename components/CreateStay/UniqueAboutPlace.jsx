import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import styles from "../../styles/Stay.module.css";

import { useDispatch, useSelector } from "react-redux";

import { updateUniqueAboutPlace } from "../../redux/actions/stay";

const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
});

const UniqueAboutPlace = (props) => {
  const dispatch = useDispatch();

  const uniqueAboutPlace = useSelector((state) => state.stay.uniqueAboutPlace);

  //   const formik = useFormik({
  //     initialValues: {
  //       uniqueAboutPlace: "",
  //     },
  //   });

  return (
    <div className="lg:px-6 px-4">
      <div
        className={styles.describesHeader + " !text-xl font-medium md:hidden"}
      >
        Tell your guest what makes your place unique
      </div>
      <div className="!h-[250px] md:!h-[400px] mt-12">
        <ReactQuill
          theme="snow"
          name="uniqueAboutPlace"
          placeholder="Unique about place"
          value={uniqueAboutPlace}
          className="h-full"
          onChange={(value) => dispatch(updateUniqueAboutPlace(value))}
        ></ReactQuill>
      </div>
    </div>
  );
};

UniqueAboutPlace.propTypes = {};

export default UniqueAboutPlace;
