import { Item, ItemSlot, NodeType, RunStats } from "./types";
import { ITEMS } from "./items";

export const NODE_COLORS: Record<NodeType, string> = {
  BASE: "#4ade80", // green
  EXIT: "#38bdf8", // blue
  WRECK: "#f97316", // orange
  ANOMALY: "#a855f7", // purple
  PIRATE: "#ef4444", // red
  BEACON: "#eab308", // yellow
};

export const NODE_LABELS: Record<NodeType, string> = {
  BASE: "Base",
  EXIT: "Exit",
  WRECK: "Wreck",
  ANOMALY: "Anomaly",
  PIRATE: "Pirate",
  BEACON: "Beacon",
};

export const HIT_RADIUS = 6; // distance in viewBox units to "hit" a node (tuned for easier hits)
export const FUEL_PER_UNIT = 0.08; // fuel cost per unit of path length

export const INITIAL_STATS: RunStats = {
  hull: 3,
  maxHull: 3,
  fuel: 8,
  maxFuel: 8,
  scrap: 0,
};

export const INITIAL_EQUIPPED: Record<ItemSlot, Item> = {
  CORE: {
    id: "core_scout",
    name: "Scout Core",
    slot: "CORE",
    rarity: "COMMON",
    description: "Light frame tuned for fuel efficiency.",
    nodeAffinity: "BASE",
  },
  ENGINE: ITEMS.find((i) => i.id === "engine_basic")!,
  HULL: ITEMS.find((i) => i.id === "hull_standard")!,
  SCANNER: ITEMS.find((i) => i.id === "scanner_basic")!,
  UTILITY1: ITEMS.find((i) => i.id === "util_risk_recyclers") || ITEMS[0],
  UTILITY2: ITEMS.find((i) => i.id === "util_signal_bender") || ITEMS[0],
};
