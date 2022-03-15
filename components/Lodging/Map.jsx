import React from "react";
import Map, { Marker } from "react-map-gl";
import Image from "next/image";

function MapBox() {
  return (
    <Map
      initialViewState={{
        longitude: 36.8172449,
        latitude: -1.2832533,
        zoom: 14,
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
    >
      {/* <Marker longitude={36.8172449} latitude={-1.2832533} anchor="bottom">
        <div className="relative w-16 h-16"></div>
        <Image layout="fill" src="/img.png" alt="" />
      </Marker> */}
    </Map>
  );
}

export default MapBox;
