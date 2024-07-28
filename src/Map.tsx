import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Papa from 'papaparse';
import { Feature, FeatureCollection, LineString, Point } from 'geojson';

interface Location {
  latitude: number;
  longitude: number;
}
const isNumber = (value: number): value is number => typeof value === 'number' && !isNaN(value);

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    // CSVファイルの読み込み
    Papa.parse('/data/locations.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data as Array<{ latitude: string, longitude: string }>;
        const parsedLocations = data
          .map(item => ({
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }))
          .filter(item => isNumber(item.latitude) && isNumber(item.longitude) );
        setLocations(parsedLocations);
      },
    });
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_MAP_API_KEY;
    const mapName = import.meta.env.VITE_MAP_NAME;
    const region = import.meta.env.VITE_MAP_REGION;

    if (!apiKey || !mapName || !region) {
      console.error('APIキー、地図名、リージョンの設定が不足しています。');
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: [139.72060923874457, 35.687888202426414], // 初期の中心座標
      zoom: 16,
      transformRequest: (url, ) => {
        if (url.startsWith(`https://maps.geo.${region}.amazonaws.com/maps/v0/maps/`)) {
          return {
            url: url,
          };
        }
        return { url };
      },
    });

    map.on('load', () => {
      // CSVデータをGeoJSON形式に変換
      console.log(locations);
      const geojson: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: locations.map(location => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
        })),
      };

      // GeoJSONソースを追加
      map.addSource('points', {
        type: 'geojson',
        data: geojson,
      });

      // ポイントレイヤーを追加
      map.addLayer({
        id: 'points',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 3,
          'circle-color': 'red',
        },
      });

      // ラインレイヤーを追加（任意）
      if (locations.length > 1) {
        const lineGeojson: Feature<LineString> = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: locations.map(location => [location.longitude, location.latitude]),
          },
        };

        map.addSource('route', {
          type: 'geojson',
          data: lineGeojson,
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'red',
            'line-width': 4,
          },
        });
      }
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, [locations]);

  return <div ref={mapContainerRef} style={{ width: '90vw', height: '90vh' }} />;
};

export default Map;
