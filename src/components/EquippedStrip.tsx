import React from "react";
import { Item, ItemSlot } from "../game/types";

type EquippedStripProps = {
  equipped: Record<ItemSlot, Item>;
};

export const EquippedStrip: React.FC<EquippedStripProps> = ({ equipped }) => {
  return (
    <div className="w-full max-w-md bg-slate-900/70 rounded-xl p-3 border border-slate-700 text-[10px] flex flex-col gap-1">
      <div className="text-slate-400 uppercase tracking-wide mb-1">Equipped Ship Parts</div>
      <div className="grid grid-cols-2 gap-1">
        {(["CORE", "ENGINE", "HULL", "SCANNER", "UTILITY1", "UTILITY2"] as ItemSlot[]).map(
          (slot) => (
            <div key={slot} className="flex flex-col bg-slate-950/60 rounded-md px-2 py-1">
              <span className="text-[9px] text-slate-500">{slot}</span>
              <span className="text-[11px] text-slate-100 truncate">
                {equipped[slot]?.name ?? "Empty"}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};
