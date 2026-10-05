"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const geoUrl = "/india-states.json";

type HeatMapItem = {
  state: string;
  scams: number;
};

type ScamMapProps = {
  data: HeatMapItem[];
};

function normalizeStateName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .replace(/[.,'()-]/g, "");
}

function stateNamesMatch(
  mapState: string,
  dataState: string
): boolean {
  const mapName = normalizeStateName(mapState);
  const dataName = normalizeStateName(dataState);

  if (mapName === dataName) {
    return true;
  }

  const aliases: Record<string, string[]> = {
    "delhi": [
      "nct of delhi",
      "national capital territory of delhi",
      "new delhi",
    ],

    "nct of delhi": [
      "delhi",
      "national capital territory of delhi",
      "new delhi",
    ],

    "uttarakhand": [
      "uttaranchal",
    ],

    "uttaranchal": [
      "uttarakhand",
    ],

    "odisha": [
      "orissa",
    ],

    "orissa": [
      "odisha",
    ],

    "jammu and kashmir": [
      "jammu kashmir",
      "jammu & kashmir",
    ],

    "jammu kashmir": [
      "jammu and kashmir",
      "jammu & kashmir",
    ],

    "puducherry": [
      "pondicherry",
    ],

    "pondicherry": [
      "puducherry",
    ],

    "tamil nadu": [
      "tamilnadu",
    ],

    "andhra pradesh": [
      "andhrapradesh",
    ],

    "uttar pradesh": [
      "uttarpradesh",
    ],

    "west bengal": [
      "westbengal",
    ],

    "himachal pradesh": [
      "himachalpradesh",
    ],

    "madhya pradesh": [
      "madhyapradesh",
    ],

    "arunachal pradesh": [
      "arunachalpradesh",
    ],
  };

  const mapAliases = aliases[mapName] ?? [];
  const dataAliases = aliases[dataName] ?? [];

  return (
    mapAliases.includes(dataName) ||
    dataAliases.includes(mapName)
  );
}

export default function ScamMap({
  data,
}: ScamMapProps) {
  return (
    <div className="mt-6 w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4">

      {/* India Map */}
      <div className="flex w-full justify-center">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [82, 22],
            scale: 780,
          }}
          className="h-auto w-full max-w-4xl"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = String(
                  geo.properties?.NAME_1 ||
                    geo.properties?.st_nm ||
                    geo.properties?.name ||
                    ""
                );

                const stateData = data.find(
                  (item) =>
                    stateNamesMatch(
                      stateName,
                      item.state
                    )
                );

                const scams = stateData?.scams ?? 0;

                let fill = "#334155";

                if (scams >= 100) {
                  fill = "#ef4444";
                } else if (scams >= 75) {
                  fill = "#f97316";
                } else if (scams >= 50) {
                  fill = "#eab308";
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="text-sm font-semibold text-white">
          Scam Activity Legend
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Number of reported scam cases
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Very High */}
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="h-5 w-5 rounded bg-red-500" />

            <div>
              <p className="text-sm font-semibold text-white">
                Very High
              </p>

              <p className="text-xs text-slate-500">
                100+ reports
              </p>
            </div>
          </div>

          {/* High */}
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="h-5 w-5 rounded bg-orange-500" />

            <div>
              <p className="text-sm font-semibold text-white">
                High
              </p>

              <p className="text-xs text-slate-500">
                75–99 reports
              </p>
            </div>
          </div>

          {/* Medium */}
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="h-5 w-5 rounded bg-yellow-500" />

            <div>
              <p className="text-sm font-semibold text-white">
                Medium
              </p>

              <p className="text-xs text-slate-500">
                50–74 reports
              </p>
            </div>
          </div>

          {/* Low */}
          <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <div className="h-5 w-5 rounded bg-slate-700" />

            <div>
              <p className="text-sm font-semibold text-white">
                Low
              </p>

              <p className="text-xs text-slate-500">
                0–49 reports
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}