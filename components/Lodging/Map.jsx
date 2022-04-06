import React from "react";
import Map, { Source, Layer } from "react-map-gl";
import Image from "next/image";

function MapBox() {
  const [viewState, setViewState] = React.useState({
    longitude: 36.8172449,
    latitude: -1.2832533,
    zoom: 14,
  });

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [36.8172449, -1.2832533] },
      },
    ],
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };

  // const markers = useMemo(() => vehicles.map(vehicle => (
  //   <Marker key={vehicle.id}
  //     longitude={vehicle.coordinates[0]}
  //     latitude={vehicle.coordinates[1]}>
  //     <svg>
  //       // vehicle icon
  //     </svg>
  //   </Marker>)
  // )}, [vehicles]);

  return (
    <Map
      reuseMaps
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      style={{ width: "100vw", height: "100vh" }}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      // mapStyle="mapbox://styles/cliffaustin/cl0psgnss008714n29bmcpx68"
    >
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
}

export default MapBox;
