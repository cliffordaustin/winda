import React, { useState } from "react";
import SelectInput from "../ui/SelectInput";
import styles from "../../styles/PriceFilter.module.css";

function PriceFilter({
  minRoomSelected,
  maxRoomSelected,
  minRoomInstanceId,
  maxRoomInstanceId,
  setMinRoomSelected,
  setMaxRoomSelected,
}) {
  const [state, setState] = useState({
    minRoomOptions: [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
    ],
    maxRoomOptions: [
      { value: "11", label: "11" },
      { value: "12", label: "12" },
      { value: "13", label: "13" },
      { value: "14", label: "14" },
      { value: "15", label: "15" },
      { value: "16", label: "16" },
      { value: "17", label: "17" },
      { value: "18", label: "18" },
      { value: "19", label: "19" },
      { value: "20", label: "20" },
    ],
  });
  return (
    <div className="flex items-center justify-between gap-2">
      {/* xsmall:w-32 xssMax:w-36 w-40 sm:w-72 md:w-48 */}
      <SelectInput
        options={state.minRoomOptions}
        selectedOption={minRoomSelected}
        instanceId={minRoomInstanceId}
        setSelectedOption={setMinRoomSelected}
        className={styles.input + " !w-full"}
        placeholder="Min Rooms"
        isSearchable={false}
      ></SelectInput>
      <div> - </div>
      <SelectInput
        options={state.maxRoomOptions}
        selectedOption={maxRoomSelected}
        instanceId={maxRoomInstanceId}
        setSelectedOption={setMaxRoomSelected}
        className={styles.input + " !w-full"}
        placeholder="Max Rooms"
        isSearchable={false}
      ></SelectInput>
    </div>
  );
}

export default PriceFilter;
