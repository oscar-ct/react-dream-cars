import mapboxgl from "mapbox-gl";
import { useRef, useEffect } from "react";

const MapContainer = ( {lat, lon, location} ) => {

    // const [mapLon, setMapLon] = useState(lon);
    // const [mapLat, setMapLat] = useState(lat);
    // const [zoom, setZoom] = useState(9);
    const mapContainer = useRef(null);
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN


    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lon, lat],
            zoom: 9,
        });
        new mapboxgl.Marker().setLngLat([lon, lat]).setPopup(new mapboxgl.Popup().setHTML(`<span>${location}</span>`)).addTo(map);
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        return () => map.remove();
    }, [lat, location, lon]);



    return (
            // <div className="sidebar">
            //     Longitude: {mapLon} | Latitude: {mapLat} | Zoom: {zoom}
            // </div>
            <div ref={mapContainer} className={"map-container"}/>
    );
};

export default MapContainer;