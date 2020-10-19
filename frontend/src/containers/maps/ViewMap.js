import React, {useState, useCallback, useRef, useEffect} from 'react';
import Nav from '../../components/mainPageComponents/Nav';
import mapStyle from './../../customCss/mapStyle';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,

} from '@react-google-maps/api';
import { formatRelative } from "date-fns";

import usePlacesAutoComplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";


import{
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
import '../../customCss/map.css';



const libraries = ['places'];

const mapContainerStyle = {
    width: '100vw',
    height: '84vh',
};

const center = {
    lat: 40.7128,
    lng: -74.0060,
};

const options  = {
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: true,

};



const ViewMap = (props) => {

    const prepPinRender = (prd) => {
        console.log('prd', prd)
        return prd.map((pr, i) => {
            console.log('inMap', pr)
            return {
                lat: pr.pins[0].lat, 
                lng: pr.pins[0].lng, 
                id: i,
                subPins: pr.pins,
                playlist: pr.playlist
            }
        })
    }

    useEffect(() => {

        fetch('http://localhost:3000/api/v1/play_routes')
        .then(r => r.json() )
        .then(playRoutes => {
             let allPins = prepPinRender(playRoutes);

            console.log('pins', allPins)
            setMarkers((current)=>[
                ...current,
                ...allPins
            ])
        })
    
    }
    ,[])



const mapRef = useRef();

const onMapLoad= useCallback((map)=>{
    mapRef.current=map; 
},[])

const panTo = useCallback(({lat, lng})=> {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
},[]);

const [markers, setMarkers] = useState([])
const [selected, setSelected] = useState(null)

const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDyHRdd4NQOPirfP_EtTiiK7TTHn1ySYZg',
    libraries
});


if (loadError) return 'Error Loading Maps';
if (!isLoaded) return 'Loading Maps';

    return (
        <div>
            <Nav createMode={false} logOutHandler={props.logOutHandler} />
            {
                props.user ? 
                (
                    <h1 id = 'mapHeader'>
                        Our App{" "} <span role='img' aria-label='arm'>🦾</span> 
                    </h1>
                )
                :
                (
                    null
                )
            }
            
            <Search  panTo={panTo} />
            <Locate panTo={panTo}/> 
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
                options={options}
                onLoad={onMapLoad}
                   
            >
                {markers.map(marker => (
                    
                <Marker 
                key={marker.id} 
                position={{lat: marker.lat, lng: marker.lng}} 
                icon={{
                    url:'/Sound-Wave-Headphones.svg', 
                    scaledSize: new window.google.maps.Size(30,30), 
                    origin: new window.google.maps.Point(0,0), 
                    anchor: new window.google.maps.Point(15,15),
                    draggable: true, 
                }}
                onClick={()=>{
                    setSelected(marker);
                    console.log('s',marker)
                    props.setPlayer(marker.playlist)
                    }}
                  />
                ))}

                {selected ? 
                (
                <InfoWindow 
                    position={{lat: selected.lat, lng: selected.lng }} 
                    onCloseClick={()=>{ 
                    setSelected(null);  
                     }}>
                    <div>
                        <h2> 
                            cords:
                        </h2>
                            <p>lat: 
                                {selected.lat}, lng:{selected.lng} 
                                <br></br>
                                URI: {selected.playlist}
                            </p>
                            
                             subcords: 
                            <ul>
                                   <li>
                                       {selected.subPins.map((p, i) => {
                                            if (i > 1) return `SubCord ${i}: lat: ${p.lat} lng: ${p.lng} `
                                        })}
                                    </li> 
                            </ul>
                    </div>
                </InfoWindow>) : null}
            </GoogleMap>
        </div>
    );
}


const Locate= ({panTo}) =>{
    return (
    <button className="locate" onClick={()=>{
        navigator.geolocation.getCurrentPosition((position)=>{
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }, () => null, options);
    }}>
        <img src="compass.svg" alt="compass - locate me"/>
    </button>
    );
} 

const Search = ({panTo}) =>{
    const {
        ready,
        value, 
        suggestions:{status, data}, 
        setValue, 
        clearSuggestions,
    } = usePlacesAutoComplete({
        requestOptions:{
            location: { lat: () => 40.7128 , lng: () => -74.0060},
            
            radius: 200 * 1000,
// check vid at about 28 min
        }
    });

    return (
        <div className="search">
        <Combobox onSelect={async(address) => {
            setValue(address, false);
            clearSuggestions()
            try {
            const results = await getGeocode({address});
            const { lat, lng } = await getLatLng(results[0]);
            panTo({lat, lng})
            } catch(err ) {
                console.log("error!")
            }
      console.log(address)}}
        >
            <ComboboxInput value={value} onChange={(e) => {
                setValue(e.target.value)
            }}
            
            disabled={!ready}
            placeholder = "Enter an address"
            />
            <ComboboxPopover>
                <ComboboxList> 
                {status === "OK" && data.map(({id,description})=>(
                    <ComboboxOption key={id} value={description}/>
                ))}
                 </ComboboxList>
            </ComboboxPopover>
        </Combobox>
        </div>
        
    )



}
export default ViewMap