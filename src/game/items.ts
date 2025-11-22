import { Item, NodeType } from "./types";

export const ITEMS: Item[] = [
  // Engines (Wreck/Beacon/Anomaly)
  {
    id: "engine_basic",
    name: "Basic Engine",
    slot: "ENGINE",
    rarity: "COMMON",
    description: "Standard drive with no special properties.",
    nodeAffinity: "BASE",
  },
  {
    id: "engine_extended_tanks",
    name: "Extended Tanks",
    slot: "ENGINE",
    rarity: "COMMON",
    description: "+2 Max Fuel.",
    nodeAffinity: "WRECK",
    effect: { maxFuelDelta: 2 },
  },
  {
    id: "engine_long_spine",
    name: "Long Spine",
    slot: "ENGINE",
    rarity: "UNCOMMON",
    description: "First edge each map costs 0 Fuel.",
    nodeAffinity: "BEACON",
  },
  {
    id: "engine_drift_thrusters",
    name: "Drift Thrusters",
    slot: "ENGINE",
    rarity: "UNCOMMON",
    description: "-1 Fuel cost on edges touching Anomalies (min 1).",
    nodeAffinity: "ANOMALY",
  },
  // Hull
  {
    id: "hull_standard",
    name: "Standard Plating",
    slot: "HULL",
    rarity: "COMMON",
    description: "No bonus.",
    nodeAffinity: "BASE",
  },
  {
    id: "hull_reinforced_bulkhead",
    name: "Reinforced Bulkhead",
    slot: "HULL",
    rarity: "COMMON",
    description: "+1 Max Hull.",
    nodeAffinity: "WRECK",
    effect: { maxHullDelta: 1 },
  },
  // Scanner
  {
    id: "scanner_basic",
    name: "Basic Scanner",
    slot: "SCANNER",
    rarity: "COMMON",
    description: "No bonus.",
    nodeAffinity: "BASE",
  },
  {
    id: "scanner_graveyard_mapper",
    name: "Graveyard Mapper",
    slot: "SCANNER",
    rarity: "UNCOMMON",
    description: "Wreck nodes reveal a highlighted part.",
    nodeAffinity: "WRECK",
  },
  {
    id: "scanner_pattern_solver",
    name: "Pattern Solver",
    slot: "SCANNER",
    rarity: "UNCOMMON",
    description: "+5% anomaly success per Anomaly visited (this run).",
    nodeAffinity: "ANOMALY",
  },
  // Utility
  {
    id: "util_risk_recyclers",
    name: "Risk Recyclers",
    slot: "UTILITY1",
    rarity: "UNCOMMON",
    description: "When you lose Hull at a Wreck, gain +1 Scrap.",
    nodeAffinity: "WRECK",
  },
  {
    id: "util_pirate_codebreaker",
    name: "Pirate Codebreaker",
    slot: "UTILITY1",
    rarity: "UNCOMMON",
    description: "First Pirate node each map can be paid off with Scrap instead of Hull.",
    nodeAffinity: "PIRATE",
  },
  {
    id: "util_signal_bender",
    name: "Signal Bender",
    slot: "UTILITY2",
    rarity: "UNCOMMON",
    description: "Once per map, treat 1 Pirate node as Neutral.",
    nodeAffinity: "PIRATE",
  },
  {
    id: "util_graviton_seed",
    name: "Graviton Seed",
    slot: "UTILITY2",
    rarity: "RARE",
    description: "+5% scan quality per Anomaly visited (this run).",
    nodeAffinity: "ANOMALY",
  },
];

export function itemsForNodeType(nodeType: NodeType): Item[] {
  return ITEMS.filter((i) => i.nodeAffinity === nodeType);
}
