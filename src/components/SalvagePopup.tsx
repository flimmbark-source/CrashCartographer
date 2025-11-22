import React from "react";
import { FailurePopup as FailurePopupType, Phase, SalvageUIState } from "../game/types";

type SalvagePopupProps = {
  phase: Phase;
  salvageUI: SalvageUIState | null;
  failurePopup: FailurePopupType | null;
  postEventDecisionNeeded: boolean;
  onSelectOption: (index: number) => void;
  onSalvage: () => void;
  onScrap: () => void;
  onIgnore: () => void;
};

export const SalvagePopup: React.FC<SalvagePopupProps> = ({
  phase,
  salvageUI,
  failurePopup,
  postEventDecisionNeeded,
  onSelectOption,
  onSalvage,
  onScrap,
  onIgnore,
}) => {
  if (!(phase === "choice" && salvageUI && !failurePopup && !postEventDecisionNeeded)) {
    return null;
  }

  return (
    <div className="w-full max-w-md bg-slate-900/90 rounded-xl p-3 border border-sky-500/70 text-xs flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-slate-100">
          {salvageUI.nodeType === "WRECK" && "Wreck: pick a section to strip"}
          {salvageUI.nodeType === "PIRATE" && "Pirate hull: black-market salvage"}
          {salvageUI.nodeType === "ANOMALY" && "Anomaly: strange readings"}
          {salvageUI.nodeType === "BEACON" && "Beacon: refit and refuel"}
        </span>
      </div>

      <p className="text-slate-300 mb-1">
        Tap a ship section to inspect its part, then choose to salvage, strip for raw scrap, or
        leave it.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {salvageUI.options.map((opt, idx) => {
          const isSelected = salvageUI.selectedIndex === idx;
          const failureRisk = 1 - opt.successChance;
          const riskClass =
            failureRisk < 0.25
              ? "text-emerald-400"
              : failureRisk < 0.5
              ? "text-amber-300"
              : "text-red-400";
          return (
            <button
              key={opt.item.id}
              onClick={() => onSelectOption(idx)}
              className={`rounded-lg px-2 py-2 text-left border text-[11px] transition-all ${
                isSelected
                  ? "border-sky-400 bg-slate-800 scale-[1.02]"
                  : "border-slate-700 bg-slate-900/70 hover:bg-slate-800/80"
              }`}
            >
              <div className="text-[9px] text-slate-400 mb-1">{opt.slot}</div>
              <div className="font-semibold text-slate-50 truncate mb-1">{opt.item.name}</div>
              <div className={"text-[10px] text-slate-300 " + (isSelected ? "" : "line-clamp-2")}>
                {opt.item.description}
              </div>
              <div className={`text-[9px] mt-1 ${riskClass}`}>
                Salvage: {Math.round(opt.successChance * 100)}%
              </div>
            </button>
          );
        })}

        {salvageUI.options.length === 0 && (
          <div className="text-slate-400 text-[11px] col-span-3">
            No distinct parts here, but you can still strip the site for raw scrap.
          </div>
        )}
      </div>

      {salvageUI.selectedIndex != null && salvageUI.options[salvageUI.selectedIndex] && (
        <div className="mb-2 rounded-md border border-slate-700 bg-slate-950/60 p-2 text-[11px]">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-slate-100">
              {salvageUI.options[salvageUI.selectedIndex].item.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {salvageUI.options[salvageUI.selectedIndex].slot}
            </span>
          </div>
          <p className="text-slate-300">{salvageUI.options[salvageUI.selectedIndex].item.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-1">
        <div className="text-[10px] text-slate-400">
          Scrap: {Math.round(salvageUI.scrapSuccessChance * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onSalvage}
          className="rounded-lg border border-emerald-500/70 bg-slate-800/80 hover:bg-slate-700 p-2 text-left disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={salvageUI.options.length === 0}
        >
          <div className="font-semibold mb-1">Salvage Part</div>
          <div className="text-[11px] text-slate-300">Try to cut and mount the part.</div>
        </button>
        <button
          onClick={onScrap}
          className="rounded-lg border border-amber-500/70 bg-slate-800/80 hover:bg-slate-700 p-2 text-left"
        >
          <div className="font-semibold mb-1">Strip for Scrap</div>
          <div className="text-[11px] text-slate-300">Take raw materials; risk a mishap.</div>
        </button>
        <button
          onClick={onIgnore}
          className="rounded-lg border border-slate-600 bg-slate-800/80 hover:bg-slate-700 p-2 text-left"
        >
          <div className="font-semibold mb-1">Ignore</div>
          <div className="text-[11px] text-slate-300">Leave the site and drift on.</div>
        </button>
      </div>
    </div>
  );
};
