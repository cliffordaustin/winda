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
      { value: "KES1k", label: "KES1k" },
      { value: "KES2k", label: "KES2k" },
      { value: "KES3k", label: "KES3k" },
      { value: "KES4k", label: "KES4k" },
      { value: "KES5k", label: "KES5k" },
      { value: "KES6k", label: "KES6k" },
      { value: "KES7k", label: "KES7k" },
      { value: "KES8k", label: "KES8k" },
      { value: "KES9k", label: "KES9k" },
      { value: "KES10k", label: "KES10k" },
    ],
    maxPriceOptions: [
      { value: "KES100k", label: "KES100k" },
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
        isSearchable={false}
      ></SelectInput>
      <div> - </div>
      <SelectInput
        options={state.maxPriceOptions}
        selectedOption={maxPriceSelected}
        instanceId={maxPriceInstanceId}
        setSelectedOption={setMaxPriceSelected}
        className={styles.input + " !w-full"}
        placeholder="Max price"
        isSearchable={false}
      ></SelectInput>
    </div>
  );
}

export default PriceFilter;
