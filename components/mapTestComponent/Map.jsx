import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ReactMapGL, { Marker } from "react-map-gl";
import useSuperCluster from "use-supercluster";
import Supercluster from "supercluster";

import axios from "axios";

function Map(props) {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    longitude: -1.131592,
    latitude: 52.629729,
    zoom: 12,
  });
  const mapRef = useRef(null);

  const [crimes, setCrime] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10"
      )
      .then((res) => {
        setCrime(res.data.slice(0, 100));
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  }, []);

  const points = crimes.map((crime) => ({
    type: "Feature",
    properties: {
      category: crime.category,
      crimeId: crime.id,
      cluster: false,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(crime.location.longitude),
        parseFloat(crime.location.latitude),
      ],
    },
  }));

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  const { clusters, supercluster } = useSuperCluster({
    points,
    zoom: viewport.zoom,
    bounds: bounds,
    options: {
      radius: 75,
      maxZoom: 20,
    },
  });

  const newClusters = new Supercluster({
    radius: 40,
    maxZoom: 16,
  });

  newClusters.load(points);

  newClusters.getClusters([bounds], viewport.zoom);

  return (
    <div className="h-screen w-screen">
      <ReactMapGL
        {...viewport}
        maxZoom={20}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(evt) => setViewport(evt.viewState)}
        onViewportChange={(newViewport) => {
          setViewport({ ...newViewport });
        }}
        ref={mapRef}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={latitude}
                longitude={longitude}
              >
                <div
                  className="w-10 h-10 p-2 text-base font-bold flex items-center justify-center rounded-full bg-blue-500"
                  style={{
                    width: `${30 + (pointCount / points.length) * 40}px`,
                    height: `${30 + (pointCount / points.length) * 40}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );

                    setViewport({
                      ...viewport,
                      latitude,
                      longitude,
                      zoom: expansionZoom,
                      transitionDuration: 1000,
                    });
                    console.log(longitude, latitude);
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`crime-${cluster.properties.crimeId}`}
              latitude={latitude}
              longitude={longitude}
            >
              <svg
                className="w-8 h-8 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 15 15"
              >
                <path
                  fill="currentColor"
                  d="M3.5 1v13H12V1H3.5zm6 1H11v3.5H9.5V2zm-5 .055H6V7H4.5V2.055zm2.5 0h1.5V7H7V2.055zM10.25 6.5a.75.75 0 0 1 0 1.5a.75.75 0 0 1 0-1.5zM7 8h1.473l.027 5H7.027L7 8zm-2.5.166H6V13H4.5V8.166zM9.5 9H11v4H9.5V9z"
                />
              </svg>
            </Marker>
          );
        })}
      </ReactMapGL>
    </div>
    // <ReactMapGL
    //   {...viewport}
    //   mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
    //   mapStyle="mapbox://styles/mapbox/streets-v11"
    //   ref={mapRef}
    //   onMove={(evt) => setViewport(evt.viewState)}
    //   maxZoom={20}
    // >
    //   {clusters.map((cluster) => {
    //     const [longitude, latitude] = cluster.geometry.coordinates;
    //     const { cluster: isCluster, point_count: pointCount } =
    //       cluster.properties;

    //     if (isCluster) {
    //       return (
    //         <Marker key={cluster.id} latitude={latitude} longitude={longitude}>
    //           <div
    //             style={{
    //               width: `${30 + (pointCount / points.length) * 100}px`,
    //               height: `${30 + (pointCount / points.length) * 100}px`,
    //             }}
    //             className="w-10 h-10 p-2 text-base font-bold flex items-center justify-center rounded-full bg-blue-500"
    //             onClick={() => {
    //               const expansionZoom = Math.min(
    //                 supercluster.getClusterExpansionZoom(cluster.id),
    //                 20
    //               );

    //               setViewport({
    //                 ...viewport,
    //                 latitude,
    //                 longitude,
    //                 zoom: expansionZoom,
    //                 transitionDuration: 1000,
    //               });

    //               mapRef.current.flyTo({
    //                 center: [longitude, latitude],
    //                 zoom: expansionZoom,
    //                 duration: 1000,
    //               });
    //             }}
    //           >
    //             {pointCount}
    //           </div>
    //         </Marker>
    //       );
    //     }
    //     return (
    //       <Marker
    //         longitude={longitude}
    //         latitude={latitude}
    //         key={cluster.properties.crimeId}
    //       >
    //         <svg
    //           className="w-8 h-8 text-red-600"
    //           xmlns="http://www.w3.org/2000/svg"
    //           aria-hidden="true"
    //           role="img"
    //           preserveAspectRatio="xMidYMid meet"
    //           viewBox="0 0 15 15"
    //         >
    //           <path
    //             fill="currentColor"
    //             d="M3.5 1v13H12V1H3.5zm6 1H11v3.5H9.5V2zm-5 .055H6V7H4.5V2.055zm2.5 0h1.5V7H7V2.055zM10.25 6.5a.75.75 0 0 1 0 1.5a.75.75 0 0 1 0-1.5zM7 8h1.473l.027 5H7.027L7 8zm-2.5.166H6V13H4.5V8.166zM9.5 9H11v4H9.5V9z"
    //           />
    //         </svg>
    //       </Marker>
    //     );
    //   })}
    // </ReactMapGL>
  );
}

Map.propTypes = {};

export default Map;
