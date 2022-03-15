import React, { useEffect, useState } from "react";
import Card from "../ui/Card";
import styles from "../../styles/Listing.module.css";
import Rating from "../ui/Rating";
import Badge from "../ui/Badge";

function Listing({ listing }) {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (process.browser) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      setIsSafari(isSafari);
    }
  }, []);
  return (
    <div className="!w-47p !relative">
      <Card
        imagePaths={listing.imagePaths}
        carouselClassName="h-44"
        subCarouselClassName="hidden"
        className={styles.card}
      >
        <div className="flex items-end">
          <h1 className="font-bold text-xl font-OpenSans">
            KES{listing.price.toLocaleString()}
          </h1>
          <p className="mb-0.5 inline-block">/night</p>
        </div>
        <div className="font-bold text-sm truncate mt-1">{listing.address}</div>
        <div className="flex items-center gap-1 mt-2">
          <div className={!isSafari ? "-mb-0.5" : "-mb-1"}>
            <Badge
              className={
                listing.rating >= 4.5
                  ? "!bg-green-700"
                  : listing.rating >= 4
                  ? "!bg-green-600"
                  : listing.rating >= 3.5
                  ? "!bg-green-500"
                  : listing.rating >= 3
                  ? "!bg-yellow-500"
                  : "!bg-red-500"
              }
            >
              {listing.rating}
            </Badge>
          </div>
          <Rating
            rating={listing.rating}
            fontSize={!isSafari ? 25 : 16}
          ></Rating>
          <div className="font-medium text-sm">({listing.numRating})</div>
        </div>
      </Card>
    </div>
  );
}

export default Listing;
