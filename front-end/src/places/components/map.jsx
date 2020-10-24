import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

function Map(props) {
  const mapContainerRef = useRef(null);
  const { lat, lng } = props.location;
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [lng, lat],
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 12,
    });
    var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  }, [lat, lng]);

  return <div className="map" ref={mapContainerRef}></div>;
}

export default Map;
