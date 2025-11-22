import React from "react";

type RouteDecisionPopupProps = {
  show: boolean;
  onDecision: (action: "continue" | "redraw") => void;
};

export const RouteDecisionPopup: React.FC<RouteDecisionPopupProps> = ({ show, onDecision }) => {
  if (!show) return null;
  return (
    <div className="w-full max-w-md bg-slate-900/90 rounded-xl p-3 border border-slate-500 text-xs flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-slate-100">Route decision</span>
      </div>
      <p className="text-slate-300 mb-1">
        Your ship holds at this waypoint. Stay on the plotted line or stop and draw a new path
        from here?
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onDecision("continue")}
          className="rounded-lg border border-slate-600 bg-slate-800/80 hover:bg-slate-700 p-2 text-left"
        >
          <div className="font-semibold mb-1">Continue route</div>
          <div className="text-[11px] text-slate-300">Keep following the current line.</div>
        </button>
        <button
          onClick={() => onDecision("redraw")}
          className="rounded-lg border border-sky-500/70 bg-slate-800/80 hover:bg-slate-700 p-2 text-left"
        >
          <div className="font-semibold mb-1">Draw new path</div>
          <div className="text-[11px] text-slate-300">Stop here and switch back to planning.</div>
        </button>
      </div>
    </div>
  );
};
