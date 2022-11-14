import React, { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Select from "../ui/Select";

function Months(props) {
  const router = useRouter();

  const months = [
    {
      name: "January",
      num: "0",
    },
    {
      name: "February",
      num: "1",
    },
    {
      name: "March",
      num: "2",
    },
    {
      name: "April",
      num: "3",
    },
    { name: "May", num: "4" },
    {
      name: "June",
      num: "5",
    },
    {
      name: "July",
      num: "6",
    },
    {
      name: "August",
      num: "7",
    },
    {
      name: "September",
      num: "8",
    },
    {
      name: "October",
      num: "9",
    },
    {
      name: "November",
      num: "10",
    },
    {
      name: "December",
      num: "11",
    },
  ];

  const getCurrentMonth = new Date().getMonth();

  const years = [
    {
      name: "2022",
    },
    {
      name: "2023",
    },
    {
      name: "2024",
    },
  ];

  const [selected, setSelected] = useState(
    router.query.year
      ? {
          name: router.query.year,
        }
      : years[0]
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 px-4 mt-2">
        <h1 className="font-bold">Select a year</h1>
        <Select
          data={years}
          selected={selected}
          setSelected={(item) => {
            setSelected(item);
            router.replace(
              {
                query: {
                  ...router.query,
                  year: item.name,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        ></Select>
      </div>
      <div className="flex flex-wrap mt-4 gap-3 px-4">
        {months.map((month, index) => (
          <div
            key={index}
            onClick={() => {
              router.replace(
                {
                  query: {
                    ...router.query,
                    month: month.num,
                    year: selected.name,
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
            className={
              "px-3 cursor-pointer text-sm font-black py-1.5 rounded-lg border-2 " +
              (router.query.month == month.num ||
              (month.num == getCurrentMonth && !router.query.month)
                ? "border-blue-500"
                : "border-gray-300")
            }
          >
            {month.name}
          </div>
        ))}
      </div>
    </div>
  );
}

Months.propTypes = {};

export default Months;
