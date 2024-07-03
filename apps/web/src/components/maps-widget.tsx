// import React, {useEffect} from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
// import { env } from '~/env';

// export function Map(){
//     const mapRef = React.useRef(null);

//     useEffect(() => {
//         const initMap = async () => {
//         const loader = new Loader({
//             apiKey: env.GOOGLE_MAPS_API_KEY,
//             version: 'weekly'
//         });
//         const {Map} = await loader.importLibrary('maps');
//         const {Marker} = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

//         const position = {
//             lat: 43.213,
//             long: 43.123,
//         }

//         const mapOptions: google.maps.options = {
//             center:position,
//             zoom:17,
//             mapId: 'MY_NEXT_JS_MAP_ID'
//         }
//         const map = new Map(mapRef.current, mapOptions);

//         const marker = new Marker({
//             map:map,
//             position:position,
//         })
//         }
//         initMap();
//     }   ,[]);

//     return(
//         <div ref={mapRef}></div>
//     )

// }
