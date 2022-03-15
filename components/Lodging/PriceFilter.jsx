import React, { useState } from "react";
import SelectInput from "../ui/SelectInput";
import styles from "../../styles/PriceFilter.module.css";

function PriceFilter({
  minPriceSelected,
  maxPriceSelected,
  minPriceInstanceId,
  maxPriceInstanceId,
  setMinPriceSelected,
  setMaxPriceSelected,
}) {
  const [state, setState] = useState({
    minPriceOptions: [
      { value: "KES10,000", label: "KES10,000" },
      { value: "KES20,000", label: "KES20,000" },
      { value: "KES30,000", label: "KES30,000" },
      { value: "KES40,000", label: "KES40,000" },
      { value: "KES50,000", label: "KES50,000" },
      { value: "KES60,000", label: "KES60,000" },
      { value: "KES70,000", label: "KES70,000" },
      { value: "KES80,000", label: "KES80,000" },
      { value: "KES90,000", label: "KES90,000" },
      { value: "KES100,000", label: "KES100,000" },
    ],
    maxPriceOptions: [
      { value: "KES110,000", label: "KES110,000" },
      { value: "KES120,000", label: "KES120,000" },
      { value: "KES130,000", label: "KES130,000" },
      { value: "KES140,000", label: "KES140,000" },
      { value: "KES150,000", label: "KES150,000" },
      { value: "KES160,000", label: "KES160,000" },
      { value: "KES170,000", label: "KES170,000" },
      { value: "KES180,000", label: "KES180,000" },
      { value: "KES190,000", label: "KES190,000" },
      { value: "KES200,000", label: "KES200,000" },
    ],
  });
  return (
    <div className="flex items-center justify-between">
      <SelectInput
        options={state.minPriceOptions}
        selectedOption={minPriceSelected}
        instanceId={minPriceInstanceId}
        setSelectedOption={setMinPriceSelected}
        className={styles.input + " w-48"}
        placeholder="Min price"
      ></SelectInput>
      <div> - </div>
      <SelectInput
        options={state.maxPriceOptions}
        selectedOption={maxPriceSelected}
        instanceId={maxPriceInstanceId}
        setSelectedOption={setMaxPriceSelected}
        className={styles.input + " w-48"}
        placeholder="Max price"
      ></SelectInput>
    </div>
  );
}

export default PriceFilter;
