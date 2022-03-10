import React, { useRef, useState, useEffect } from "react";
import styles from "../../styles/StickyHeader.module.css";
import { motion, AnimatePresence } from "framer-motion";

function StickyHeader({ children, className = "" }) {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (process.browser) {
      window.onscroll = function () {
        scroll();
      };

      var header = document.getElementById("myHeader");
      var sticky = header.offsetTop;

      const scroll = () => {
        if (window.pageYOffset > sticky) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };
    }
  }, []);

  const variants = {
    hide: {
      opacity: 0,
      y: -15,
      transition: {},
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {},
    },
  };

  return (
    <motion.header
      variants={variants}
      animate={isSticky ? "show" : ""}
      initial="hide"
      exit="hide"
      id="myHeader"
      className={isSticky ? ` ${className} ${styles.stick}` : " invisible"}
      ref={ref}
    >
      {children}
    </motion.header>
  );
}

export default StickyHeader;
