export type NodeType = "BASE" | "EXIT" | "WRECK" | "ANOMALY" | "PIRATE" | "BEACON";

export type MapNode = {
  id: number;
  x: number; // 0–100 (percent of width in SVG viewBox)
  y: number; // 0–100
  type: NodeType;
  danger: number; // 0–3
};

export type MapFragment = {
  nodes: MapNode[];
};

export type RunStats = {
  hull: number;
  maxHull: number;
  fuel: number;
  maxFuel: number;
  scrap: number; // salvage carried on this run
};

export type Phase = "planning" | "resolving" | "choice" | "complete";

export type ResolutionLog = {
  nodeId: number | null;
  message: string;
};

export type PathPoint = {
  x: number;
  y: number;
};

export type ItemSlot = "CORE" | "ENGINE" | "HULL" | "SCANNER" | "UTILITY1" | "UTILITY2";

export type ItemRarity = "COMMON" | "UNCOMMON" | "RARE";

export type ItemEffect = {
  maxHullDelta?: number;
  maxFuelDelta?: number;
};

export type Item = {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: ItemRarity;
  description: string;
  nodeAffinity: NodeType; // where this usually comes from
  effect?: ItemEffect;
};

export type SalvageOption = {
  slot: ItemSlot;
  item: Item;
  successChance: number; // 0–1
};

export type SalvageUIState = {
  nodeId: number;
  nodeType: NodeType;
  options: SalvageOption[];
  selectedIndex: number | null;
  scrapSuccessChance: number; // 0–1
};

export type FailurePopup = {
  id: string;
  title: string;
  description: string;
  consequence: string; // for UI
  nodeType: NodeType;
  apply: (prev: RunStats) => RunStats;
};
