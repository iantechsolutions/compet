'use client';

import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapsProps {
	lat: number;
	lng: number;
    zoom: number;
}

export default function GoogleMaps({ lat, lng,zoom }: GoogleMapsProps) {
	const mapRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		const initializeMap = async () => {
			const loader = new Loader({
				apiKey: process.env.GOOGLE_MAPS_API_KEY as string,
				version: 'quarterly',
			});

			const { Map } = await loader.importLibrary('maps');

			const locationInMap = {
				lat: lat,
				lng: lng,
			};

			// MARKER
			const { Marker } = (await loader.importLibrary(
				'marker'
			)) as google.maps.MarkerLibrary;

			const options: google.maps.MapOptions = {
				center: locationInMap,
				zoom: zoom,
				mapId: 'NEXT_MAPS_TUTS',
			};

			const map = new Map(mapRef.current as HTMLDivElement, options);

			// add the marker in the map
			const marker = new Marker({
				map: map,
				position: locationInMap,
			});
		};

		initializeMap();
	}, [lat, lng]);

	return <div className="h-[500px] w-[700px] rounded-md" ref={mapRef} />;
}
