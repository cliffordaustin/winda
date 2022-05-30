import React, { useRef, useState, useEffect } from "react";
import styles from "../../styles/StickyHeader.module.css";
import { motion, AnimatePresence } from "framer-motion";

function StickyHeader({
  children,
  setIsStickyBody = () => {},
  className = "",
}) {
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
          setIsStickyBody(true);
        } else {
          setIsSticky(false);
          setIsStickyBody(false);
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
    exit: {
      opacity: 0,
      y: -15,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {},
    },
  };

  return (
    <div>
      <motion.header
        variants={variants}
        animate={isSticky ? "show" : ""}
        initial="hide"
        exit="exit"
        id="myHeader"
        className={
          isSticky ? ` ${className} ${styles.stick}` : " invisible fixed"
        }
        ref={ref}
      >
        {children}
      </motion.header>
    </div>
  );
}

export default StickyHeader;
