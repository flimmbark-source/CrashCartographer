import React from "react";
import { FailurePopup as FailurePopupType } from "../game/types";

type FailurePopupProps = {
  popup: FailurePopupType | null;
  onConfirm: () => void;
};

export const FailurePopup: React.FC<FailurePopupProps> = ({ popup, onConfirm }) => {
  if (!popup) return null;
  return (
    <div className="w-full max-w-md bg-slate-900/95 rounded-xl p-3 border border-red-500/70 text-xs flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-red-300">{popup.title}</span>
      </div>
      <p className="text-slate-200">{popup.description}</p>
      <p className="text-red-300 text-[11px]">Consequence: {popup.consequence}</p>
      <div className="flex justify-end mt-1">
        <button
          onClick={onConfirm}
          className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-[11px] font-medium"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
