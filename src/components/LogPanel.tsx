import React from "react";
import { Phase, ResolutionLog } from "../game/types";

type LogPanelProps = {
  phase: Phase;
  log: ResolutionLog[];
};

export const LogPanel: React.FC<LogPanelProps> = ({ phase, log }) => {
  return (
    <div className="w-full max-w-md bg-slate-900/70 rounded-xl p-3 border border-slate-700 text-xs max-h-48 overflow-auto">
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-300 font-medium">Expedition Log</span>
        <span className="text-[10px] text-slate-500">
          {phase === "planning" && "Planning path"}
          {phase === "resolving" && "Ship in transit"}
          {phase === "choice" && "Awaiting your decision"}
          {phase === "complete" && "Run complete"}
        </span>
      </div>
      {log.length === 0 ? (
        <div className="text-slate-500">No events yet. Draw a path and launch.</div>
      ) : (
        <ul className="space-y-1">
          {log.map((entry, idx) => (
            <li key={idx} className="text-slate-200">
              {entry.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
