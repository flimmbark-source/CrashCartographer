import React, { useMemo, useState } from "react";
import { NODE_COLORS, NODE_LABELS } from "../game/constants";
import { MapFragment, PathPoint, Phase } from "../game/types";

type MapViewProps = {
  fragment: MapFragment;
  phase: Phase;
  pathPoints: PathPoint[];
  currentPathIndex: number;
  shipPosition: PathPoint;
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
  onLaunch: () => void;
};

export const MapView: React.FC<MapViewProps> = ({
  fragment,
  phase,
  pathPoints,
  currentPathIndex,
  shipPosition,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onLaunch,
}) => {
  const width = 360;
  const height = 360;

  const [erroredIcons, setErroredIcons] = useState<Record<number, boolean>>({});

  const travelledPoints = pathPoints.slice(0, currentPathIndex + 1);
  const remainingPoints = pathPoints.slice(currentPathIndex);

  const travelledPolyline = travelledPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const remainingPolyline = remainingPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const iconPaths = useMemo(
    () => ({
      BASE: "/assets/icons/node-base.svg",
      EXIT: "/assets/icons/node-exit.svg",
      WRECK: "/assets/icons/node-wreck.svg",
      ANOMALY: "/assets/icons/node-anomaly.svg",
      PIRATE: "/assets/icons/node-pirate.svg",
      BEACON: "/assets/icons/node-beacon.svg",
    }),
    []
  );

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md bg-slate-900/70 rounded-xl p-3 border border-slate-700">
      <div className="flex justify-between items-center w-full mb-1 gap-2">
        <div className="text-[11px] text-slate-400">
          <span className="font-semibold text-slate-200 mr-1">1.</span>
          Draw from Base.
          <span className="font-semibold text-slate-200 mx-1">2.</span>
          Launch.
          <span className="font-semibold text-slate-200 mx-1">3.</span>
          Salvage at nodes; continue or redraw.
        </div>
        <button
          onClick={onLaunch}
          className={`px-3 py-1 text-[11px] rounded-lg font-medium border transition-colors ${
            phase === "planning"
              ? "bg-sky-600/80 border-sky-400 hover:bg-sky-500"
              : "bg-slate-800 border-slate-600 text-slate-300 cursor-default"
          }`}
        >
          Launch
        </button>
      </div>

      <div
        className="bg-slate-950 rounded-xl border border-slate-700 overflow-hidden touch-none"
        style={{ width, height }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Remaining route (future path) */}
          {remainingPoints.length > 1 && (
            <polyline
              points={remainingPolyline}
              fill="none"
              stroke="#64748b"
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          )}

          {/* Travelled path */}
          {travelledPoints.length > 1 && (
            <polyline
              points={travelledPolyline}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          )}

          {/* Nodes */}
          {fragment.nodes.map((node) => {
            const isBase = node.type === "BASE";
            const isExit = node.type === "EXIT";
            const iconHref = iconPaths[node.type];
            const showIcon = iconHref && !erroredIcons[node.id];
            const nodeRadius = 4.6;

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={NODE_COLORS[node.type]}
                  fillOpacity={showIcon ? 0.3 : 1}
                  stroke={isBase ? "#e5e7eb" : isExit ? "#bae6fd" : "#020617"}
                  strokeWidth={isBase || isExit ? 1.8 : 1.2}
                />

                {showIcon ? (
                  <image
                    href={iconHref}
                    width={9}
                    height={9}
                    x={node.x - 4.5}
                    y={node.y - 4.5}
                    preserveAspectRatio="xMidYMid meet"
                    onError={() => setErroredIcons((prev) => ({ ...prev, [node.id]: true }))}
                  />
                ) : (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={3.3}
                    fill={NODE_COLORS[node.type]}
                    stroke="#0f172a"
                    strokeWidth={0.9}
                  />
                )}

                <text
                  x={node.x}
                  y={node.y - 5.6}
                  textAnchor="middle"
                  fontSize={3}
                  fill="#e5e7eb"
                >
                  {NODE_LABELS[node.type][0]}
                </text>
                {node.danger > 0 && node.type !== "BASE" && node.type !== "EXIT" && (
                  <text
                    x={node.x}
                    y={node.y + 6}
                    textAnchor="middle"
                    fontSize={2.6}
                    fill="#f97316"
                  >
                    {"!".repeat(node.danger)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Ship marker at current position */}
          {shipPosition && (
            <g>
              <circle
                cx={shipPosition.x}
                cy={shipPosition.y}
                r={2.4}
                fill="#e5e7eb"
                stroke="#38bdf8"
                strokeWidth={1.2}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Legend + phase indicator */}
      <div className="flex flex-col gap-2 w-full mt-1">
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-3 rounded-full border border-slate-800"
                style={{ backgroundColor: color }}
              />
              <span>{NODE_LABELS[type as keyof typeof NODE_LABELS]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="text-[11px] text-slate-400">
            Phase: <span className="text-slate-200 capitalize">{phase}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
