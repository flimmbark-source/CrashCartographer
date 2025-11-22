import React from "react";
import { RunStats } from "../game/types";

const LabelRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div className="text-[10px] uppercase text-slate-400">{label}</div>
    {children}
  </div>
);

type StatsBarProps = {
  stats: RunStats;
  onErasePath: () => void;
  onNewMap: () => void;
};

export const StatsBar: React.FC<StatsBarProps> = ({ stats, onErasePath, onNewMap }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between w-full max-w-md bg-slate-900/70 rounded-xl p-3 border border-slate-700">
      <div className="flex gap-4 text-sm">
        <LabelRow label="Hull">
          <div className="flex items-center gap-1">
            <span>
              {"❤ ".repeat(Math.max(0, stats.hull))}
              <span className="text-slate-600">
                {"❤ ".repeat(Math.max(0, stats.maxHull - stats.hull))}
              </span>
            </span>
            <span className="text-[11px] text-slate-300">
              ({Math.max(0, stats.hull)}/{stats.maxHull})
            </span>
          </div>
        </LabelRow>
        <LabelRow label="Fuel">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400"
                style={{ width: `${Math.max(0, (stats.fuel / stats.maxFuel) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-300">
              {stats.fuel.toFixed(1)}/{stats.maxFuel}
            </span>
          </div>
        </LabelRow>
        <LabelRow label="Scrap">
          <div className="text-sm">⛭ {stats.scrap}</div>
        </LabelRow>
      </div>
      <div className="flex gap-2 mt-1 sm:mt-0">
        <button
          onClick={onErasePath}
          className="px-2 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
        >
          Erase Path
        </button>
        <button
          onClick={onNewMap}
          className="px-2 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
        >
          New Map
        </button>
      </div>
    </div>
  );
};
