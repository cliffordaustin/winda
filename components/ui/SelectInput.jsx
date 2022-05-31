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
  isSearchable,
  clearable = true,
}) => {
  return (
    <div className="w-full">
      <Select
        isClearable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        className={"text-sm outline-none " + className}
        instanceId={instanceId}
        placeholder={placeholder}
        options={options}
        isSearchable={isSearchable}
      />
    </div>
  );
};

SelectInput.propTypes = {
  instanceId: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  isSearchable: PropTypes.bool,
};

export default SelectInput;
