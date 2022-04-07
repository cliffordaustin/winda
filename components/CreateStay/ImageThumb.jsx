import React, { useState, useEffect } from "react";
import Image from "next/image";

function ImageThumb({ file, filterFile }) {
  return (
    <div className="w-full">
      <div className={"w-full bg-gray-50 rounded-md "}>
        <div className="rounded-lg flex items-center gap-4 justify-between px-6 py-1">
          <Image
            src={file.preview}
            alt="Company Image"
            width={80}
            height={56}
            className="object-cover rounded-lg"
          />
          <p className="text-gray-400 block w-2/4 truncate">{file.path}</p>
          <div className="flex justify-end gap-8 flex-grow items-center">
            <p>{(file.size / 1_048_576).toFixed(2)}MB</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={filterFile}
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {file.completedPercent > 0 ? (
          <div className="border relative border-gray-200 rounded-full w-11/12 mx-auto mt-2 h-8 overflow-hidden">
            <div
              className={"bg-red-500 h-full"}
              style={{ width: file.completedPercent + "%" }}
            ></div>
            <div className="absolute right-5 top-2/4 font-bold z-20 -translate-y-2/4">
              {file.completedPercent}%
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ImageThumb;
