import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { assignIn } from "lodash";

import ImageThumb from "./ImageThumb";

function ImageUpload() {
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const router = useRouter();

  const removeImageThumb = (file) => {
    const filterFiles = files.filter(
      (filterFile) => filterFile.path !== file.path
    );

    setFiles(filterFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accepts: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        files.concat(
          acceptedFiles.map((file, index) =>
            Object.assign(file, {
              id: index,
              preview: URL.createObjectURL(file),
              completedPercent: 0,
            })
          )
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <ImageThumb
      file={file}
      key={file.path}
      filterFile={() => removeImageThumb(file)}
    ></ImageThumb>
  ));

  return (
    <div className="px-6">
      <div className="mx-auto mt-8 max-w-3xl bg-white rounded-lg max-h-600 overflow-y-scroll sm:px-12 px-6 py-8">
        <h1 className="font-bold text-center text-2xl text-gray-600">
          Upload your images
        </h1>
        <div
          {...getRootProps({
            className:
              "mt-6 rounded-lg flex flex-col items-center justify-center py-10 box-dashed border-purple-600",
          })}
        >
          <input {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            className="h-32 w-32 text-purple-600"
          >
            <path
              d="M20 5h-9.586L8.707 3.293A.997.997 0 0 0 8 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z"
              fill="currentColor"
            />
          </svg>
          <h3 className="text-gray-400">Drag & Drop or click to upload</h3>
        </div>
        <div className="flex flex-col gap-8 items-center mt-6">
          {files.length > 0 ? (
            <h3 className="text-gray-400">All files</h3>
          ) : null}

          {thumbs}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
