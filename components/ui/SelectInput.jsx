import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const SelectInput = ({
  instanceId,
  options,
  selectedOption,
  setSelectedOption,
  className = "",
  placeholder,
}) => {
  return (
    <div>
      <Select
        isClearable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        className={"text-sm outline-none " + className}
        instanceId={instanceId}
        placeholder={placeholder}
        options={options}
      />
    </div>
  );
};

SelectInput.propTypes = {
  instanceId: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default SelectInput;
