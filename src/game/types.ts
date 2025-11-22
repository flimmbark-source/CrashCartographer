export type NodeType = "BASE" | "EXIT" | "WRECK" | "ANOMALY" | "PIRATE" | "BEACON";

export type Faction = {
  id: string;
  name: string;
  shortDescription: string;
  color?: string;
  iconHint?: string;
};

export type Region = {
  id: string;
  name: string;
  description: string;
};

export type NodeNarrative = {
  nodeType: NodeType;
  title: string;
  shortFlavor: string;
  factionId?: string;
  regionId?: string;
};

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

export type ItemRarity = "COMMON" | "UNCOMMON" | "RARE" | "ARTIFACT";

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
  tags?: string[];
  tier?: number;
  effect?: ItemEffect;
};

export type ShipLoadout = Record<ItemSlot, Item>;

export type CargoItem = {
  id: string;
  name: string;
  rarity: ItemRarity;
  description: string;
  tags?: string[];
  tier?: number;
  effect?: ItemEffect;
  quantity?: number;
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
