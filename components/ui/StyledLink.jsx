import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import styles from "../../styles/StyledLink.module.css";

function StyledLink({ href, children }) {
  return (
    <Link href={href}>
      <a className={styles.link}>{children}</a>
    </Link>
  );
}

StyledLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};

export default StyledLink;
