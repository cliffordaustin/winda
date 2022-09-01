import React, { useState } from "react";
import PropTypes from "prop-types";
import Accordion from "../ui/Accordion";

const DaysAccordion = ({ children, title, showAccordionByDefault = false }) => {
  const [activeAccordion, setActiveAccordion] = useState(
    showAccordionByDefault
  );
  return (
    <>
      <Accordion
        title={title}
        accordion={activeAccordion}
        changeStateFunc={() => {
          setActiveAccordion(!activeAccordion);
        }}
        className="border"
      >
        {children}
      </Accordion>
    </>
  );
};

DaysAccordion.propTypes = {};

export default DaysAccordion;