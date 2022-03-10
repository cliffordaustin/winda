import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function LoadingCardSkeleton() {
  return (
    <div className="w-full sm:w-80">
      <Skeleton className="!rounded-t-2xl h-48"></Skeleton>
      <Skeleton className="h-8 mt-1"></Skeleton>
      <div className="mt-3">
        <Skeleton className="h-4" count={3}></Skeleton>
      </div>
    </div>
  );
}

export default LoadingCardSkeleton;
