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
      { value: "KES10k", label: "KES10k" },
      { value: "KES20k", label: "KES20k" },
      { value: "KES30k", label: "KES30k" },
      { value: "KES40k", label: "KES40k" },
      { value: "KES50k", label: "KES50k" },
      { value: "KES60k", label: "KES60k" },
      { value: "KES70k", label: "KES70k" },
      { value: "KES80k", label: "KES80k" },
      { value: "KES90k", label: "KES90k" },
      { value: "KES100k", label: "KES100k" },
    ],
    maxPriceOptions: [
      { value: "KES110k", label: "KES110k" },
      { value: "KES120k", label: "KES120k" },
      { value: "KES130k", label: "KES130k" },
      { value: "KES140k", label: "KES140k" },
      { value: "KES150k", label: "KES150k" },
      { value: "KES160k", label: "KES160k" },
      { value: "KES170k", label: "KES170k" },
      { value: "KES180k", label: "KES180k" },
      { value: "KES190k", label: "KES190k" },
      { value: "KES200k", label: "KES200k" },
    ],
  });
  return (
    <div className="flex items-center justify-between gap-2">
      <SelectInput
        options={state.minPriceOptions}
        selectedOption={minPriceSelected}
        instanceId={minPriceInstanceId}
        setSelectedOption={setMinPriceSelected}
        className={styles.input + " !w-full"}
        placeholder="Min price"
      ></SelectInput>
      <div> - </div>
      <SelectInput
        options={state.maxPriceOptions}
        selectedOption={maxPriceSelected}
        instanceId={maxPriceInstanceId}
        setSelectedOption={setMaxPriceSelected}
        className={styles.input + " !w-full"}
        placeholder="Max price"
      ></SelectInput>
    </div>
  );
}

export default PriceFilter;
