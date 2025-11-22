import React from "react";
import { ItemSlot, SalvageOption } from "../game/types";

type ShipSalvageViewProps = {
  options: SalvageOption[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

type SlotZone = {
  slot: ItemSlot;
  label: string;
  style: React.CSSProperties;
};

const SLOT_ZONES: SlotZone[] = [
  {
    slot: "CORE",
    label: "Core",
    style: { left: "44%", top: "42%", width: "12%", height: "16%" },
  },
  {
    slot: "ENGINE",
    label: "Engine",
    style: { left: "42%", top: "60%", width: "16%", height: "16%" },
  },
  {
    slot: "HULL",
    label: "Hull",
    style: { left: "30%", top: "34%", width: "16%", height: "20%" },
  },
  {
    slot: "SCANNER",
    label: "Scanner",
    style: { left: "58%", top: "28%", width: "14%", height: "18%" },
  },
  {
    slot: "UTILITY1",
    label: "Utility 1",
    style: { left: "20%", top: "52%", width: "16%", height: "18%" },
  },
  {
    slot: "UTILITY2",
    label: "Utility 2",
    style: { left: "64%", top: "52%", width: "16%", height: "18%" },
  },
];

function slotOptionLookup(options: SalvageOption[]) {
  const indexBySlot: Partial<Record<ItemSlot, number>> = {};
  options.forEach((opt, idx) => {
    if (indexBySlot[opt.slot] == null) {
      indexBySlot[opt.slot] = idx;
    }
  });
  return indexBySlot;
}

export const ShipSalvageView: React.FC<ShipSalvageViewProps> = ({
  options,
  selectedIndex,
  onSelect,
}) => {
  const optionIndexBySlot = slotOptionLookup(options);

  return (
    <div className="w-full rounded-lg border border-sky-500/60 bg-slate-950/70 p-3 shadow-inner">
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-md bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <svg className="absolute inset-0 h-full w-full text-slate-800/60" viewBox="0 0 200 130" role="presentation">
          <defs>
            <linearGradient id="shipGlow" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M98 6 L102 6 L116 20 L116 36 L140 46 L140 84 L116 94 L116 112 L102 124 L98 124 L84 112 L84 94 L60 84 L60 46 L84 36 L84 20 Z"
            fill="url(#shipGlow)"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          <path
            d="M100 16 L110 26 L110 44 L130 52 L130 78 L110 86 L110 108 L100 116 L90 108 L90 86 L70 78 L70 52 L90 44 L90 26 Z"
            fill="none"
            stroke="#1f2937"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        </svg>

        {SLOT_ZONES.map((zone) => {
          const optionIndex = optionIndexBySlot[zone.slot];
          const option = optionIndex != null ? options[optionIndex] : null;
          const isSelected = optionIndex != null && optionIndex === selectedIndex;
          const isActive = Boolean(option);
          return (
            <button
              key={zone.slot}
              disabled={!isActive}
              onClick={() => isActive && onSelect(optionIndex as number)}
              style={zone.style}
              className={`absolute flex flex-col items-center justify-center rounded-md border text-[10px] uppercase tracking-wide transition-all ${
                isActive
                  ? "cursor-pointer border-sky-400/60 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20"
                  : "cursor-not-allowed border-slate-700 bg-slate-900/60 text-slate-600"
              } ${isSelected ? "ring-2 ring-sky-400/80 shadow-[0_0_14px_rgba(56,189,248,0.35)]" : ""}`}
            >
              <span className="text-[9px] font-semibold">{zone.label}</span>
              {option ? (
                <>
                  <span className="text-[10px] text-slate-50 line-clamp-1">{option.item.name}</span>
                  <span className="text-[9px] text-sky-200">
                    Salvage {Math.round(option.successChance * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-[9px] text-slate-500">No part</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
