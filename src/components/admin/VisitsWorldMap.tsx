'use client';

import React, { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';

const geoUrl = "/world-countries.json";

interface VisitsWorldMapProps {
  data: { country: string; visits: number }[];
  title?: string;
}

const VisitsWorldMap = ({ data, title }: VisitsWorldMapProps) => {
  const maxVisits = useMemo(() => Math.max(...data.map(d => d.visits), 1), [data]);
  
  const colorScale = scaleLinear<string>()
    .domain([0, maxVisits])
    .range(["#2A2A25", "#e6c467"]);

  return (
    <div className="bg-black-soft border border-gold-dim p-6 rounded-2xl w-full h-full flex flex-col">
      {title && <h3 className="text-cream-dim text-sm uppercase tracking-wider mb-4">{title}</h3>}
      <div className="flex-1 w-full relative" style={{ minHeight: '300px' }}>
        <ComposableMap
          projectionConfig={{ scale: 145, center: [0, 15] }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto", maxHeight: "400px" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const d = data.find((s) => s.country === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.visits) : "#1a1a16"}
                    stroke="#4a4a40"
                    strokeWidth={0.5}
                    data-tooltip-id="map-tooltip"
                    data-tooltip-content={`${geo.properties.name}: ${d ? d.visits : 0} visits`}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#c9a227", outline: "none", cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <Tooltip id="map-tooltip" style={{ backgroundColor: '#1a1a16', color: '#e6c467', border: '1px solid #8a742a', zIndex: 100 }} />
      </div>
    </div>
  );
};

export default memo(VisitsWorldMap);
