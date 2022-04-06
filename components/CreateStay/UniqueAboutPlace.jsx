import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import styles from "../../styles/Stay.module.css";

const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
});

const UniqueAboutPlace = (props) => {
  const formik = useFormik({
    initialValues: {
      uniqueAboutPlace: "",
    },
  });

  return (
    <div className="px-6">
      <div
        className={styles.describesHeader + " !text-xl font-medium md:hidden"}
      >
        Tell your guest what makes your place unique
      </div>
      <div className="!h-[400px] mt-12">
        <ReactQuill
          theme="snow"
          name="uniqueAboutPlace"
          placeholder="Unique about place"
          value={formik.values.uniqueAboutPlace}
          className="h-full"
          onChange={(value) => formik.setFieldValue("uniqueAboutPlace", value)}
        ></ReactQuill>
      </div>
    </div>
  );
};

UniqueAboutPlace.propTypes = {};

export default UniqueAboutPlace;
