import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import { MapContainer, TileLayer } from 'react-leaflet';
import CustomWMSLayer from './CustomWMSLayer';
import json from './avradio.json';
import AvisoRadioLayer from './AvisoRadioLayer';

import './style.css';

const App = () => {
  const [aviso, setAviso] = useState([]);
  const regex = /-*\d*\.*\d*,-*\d*\.*\d*/;
  let avisos = {
    type: 'FeatureCollection',
    features: [],
  };
  const avradio = () => {
    json.avisos.map((aviso) => {
      let feature = {
        type: 'Feature',
      };
      if (aviso.geometry) {
        let geometry = { type: 'Point' };
        if (aviso.geometry.startsWith('new google.maps.Marker')) {
          const latlong = aviso.geometry
            .split('LatLng')[1]
            .split('|')[0]
            .match(regex)[0]
            .split(',');
          geometry['coordinates'] = [
            parseFloat(latlong[1]),
            parseFloat(latlong[0]),
          ];
        }
        feature['geometry'] = geometry;
        feature['properties'] = {
          numero: aviso.numero,
          costa: aviso.costa,
          textoPT: aviso.textoPT,
          textoEN: aviso.textoEN,
          tipo: aviso.tipo,
        };
      }
      avisos.features.push(feature);
    });
  };

  return (
    <MapContainer center={[-17.7757265, -50.0773024]} zoom={3}>
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {avradio()}
      <AvisoRadioLayer geoJSON={avisos} />

      <CustomWMSLayer
        layers={['carta_nautica:carta_1']}
        options={{
          format: 'image/png',
          transparent: 'true',
          info_format: 'text/html',
        }}
        url="https://idem.dhn.mar.mil.br/geoserver/ows?SERVICE=WMS&"
      />
    </MapContainer>
  );
};

render(<App />, document.getElementById('root'));
