import React, { useState } from "react";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import styles from "../../styles/Stay.module.css";

const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
});

const DescriptioneAboutPlace = (props) => {
  const formik = useFormik({
    initialValues: {
      descriptionAboutPlace: "",
    },
  });

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
          value={formik.values.descriptionAboutPlace}
          className="h-full"
          onChange={(value) =>
            formik.setFieldValue("descriptionAboutPlace", value)
          }
        ></ReactQuill>
      </div>
    </div>
  );
};

DescriptioneAboutPlace.propTypes = {};

export default DescriptioneAboutPlace;
