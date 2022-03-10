import React, { useState } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const SelectInput = ({
  instanceId,
  options,
  selectedOption,
  setSelectedOption,
  className,
}) => {
  return (
    <div>
      <Select
        isClearable
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        className={"text-sm outline-none " + className}
        instanceId={instanceId}
        options={options}
      />
    </div>
  );
};

SelectInput.propTypes = {
  instanceId: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectInput;
