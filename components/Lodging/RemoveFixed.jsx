import React, { useRef, useState, useEffect } from "react";
import styles from "../../styles/StickyHeader.module.css";
import { motion, AnimatePresence } from "framer-motion";

function StickyHeader({ isFixed, setIsFixed, className = "" }) {
  const ref = useRef();
  useEffect(() => {
    if (process.browser) {
      window.onscroll = function () {
        scroll();
      };

      var header = document.getElementById("myHeader");

      const scroll = () => {
        var isVisible =
          header.getBoundingClientRect().top >= 0 &&
          header.getBoundingClientRect().bottom <= window.innerHeight;
        if (isVisible) {
          setIsFixed(false);
        } else {
          setIsFixed(true);
        }
      };
    }
  }, []);
  return (
    <div
      id="myHeader"
      // className="bg-green-500 py-10 z-50"
      //   className={
      //     isSticky ? ` ${className} ${styles.stick}` : " invisible fixed"
      //   }
      ref={ref}
    ></div>
  );
}

export default StickyHeader;
