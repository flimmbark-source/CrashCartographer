import { Faction, MapNode, NodeNarrative, Region } from "./types";

const FACTIONS: Faction[] = [
  {
    id: "vega_syndicate",
    name: "Vega Syndicate",
    shortDescription: "Corporate raiders who brand every haul in teal",
    color: "#43d2e8",
  },
  {
    id: "rustbelt_miners",
    name: "Rustbelt Miner Union",
    shortDescription: "Co-ops that leave their rigs patched with orange plate",
    color: "#f69d3c",
  },
  {
    id: "old_navy",
    name: "Terran Remnant Navy",
    shortDescription: "Retired warships in faded blue-gray livery",
    color: "#6fa2ff",
  },
  {
    id: "heliophage",
    name: "Heliophage Cult",
    shortDescription: "Sun-worshippers who etch glyphs into reactor housings",
    color: "#d85ad9",
  },
  {
    id: "beacon_guild",
    name: "Free Beacon Guild",
    shortDescription: "Independent relayers and refitters",
    color: "#b4f5c4",
  },
];

const REGIONS: Region[] = [
  {
    id: "outer_belt",
    name: "Outer Belt",
    description: "Loose rubble fields and derelict convoys",
  },
  {
    id: "nebulae_line",
    name: "Nebulae Line",
    description: "Ionized dust lanes that hide signals",
  },
  {
    id: "silent_corridor",
    name: "Silent Corridor",
    description: "Abandoned patrol route patrolled only by echoes",
  },
];

const NODE_NARRATIVES: Record<NodeType, NodeNarrative[]> = {
  BASE: [
    {
      nodeType: "BASE",
      title: "Cartographer Dock",
      shortFlavor: "Your crew quarters and contract office tucked inside an old carrier hull.",
      factionId: "beacon_guild",
      regionId: "outer_belt",
    },
  ],
  EXIT: [
    {
      nodeType: "EXIT",
      title: "Exit Gate",
      shortFlavor: "A cracked relay gate humming with borrowed power, pointed back to port.",
      factionId: "beacon_guild",
      regionId: "silent_corridor",
    },
  ],
  WRECK: [
    {
      nodeType: "WRECK",
      title: "Syndicate Bulk Freighter",
      shortFlavor: "Teal cargo pods torn open; corporate seals still flicker on the hull.",
      factionId: "vega_syndicate",
      regionId: "outer_belt",
    },
    {
      nodeType: "WRECK",
      title: "Old Navy Frigate",
      shortFlavor: "Blue-gray plating, compartments vented; targeting arrays still intact.",
      factionId: "old_navy",
      regionId: "silent_corridor",
    },
    {
      nodeType: "WRECK",
      title: "Union Mining Barge",
      shortFlavor: "Patchwork harvest arms frozen mid-swing, hazard beacons long dead.",
      factionId: "rustbelt_miners",
      regionId: "outer_belt",
    },
  ],
  ANOMALY: [
    {
      nodeType: "ANOMALY",
      title: "Heliophage Ritual Node",
      shortFlavor: "Glyph-scarred panels orbit a dim sun-core; sensors fail in patterned bursts.",
      factionId: "heliophage",
      regionId: "nebulae_line",
    },
    {
      nodeType: "ANOMALY",
      title: "Gravitic Echo",
      shortFlavor: "The wreckage rings like a bell, warping pings into ghost signals.",
      factionId: "old_navy",
      regionId: "silent_corridor",
    },
    {
      nodeType: "ANOMALY",
      title: "Miner Survey Residue",
      shortFlavor: "Residual scanners paint the void in rust-orange grids that stutter and loop.",
      factionId: "rustbelt_miners",
      regionId: "nebulae_line",
    },
  ],
  PIRATE: [
    {
      nodeType: "PIRATE",
      title: "Corsair Net",
      shortFlavor: "Junk clusters lashed together; hidden cutters flare when you ping them.",
      factionId: "vega_syndicate",
      regionId: "outer_belt",
    },
    {
      nodeType: "PIRATE",
      title: "Drifter Ambush",
      shortFlavor: "A scarred navy tender gone privateer, running cold until you close in.",
      factionId: "old_navy",
      regionId: "silent_corridor",
    },
    {
      nodeType: "PIRATE",
      title: "Tithe Collectors",
      shortFlavor: "Heliophage fanatics demand offerings; their signal math is improvised and sharp.",
      factionId: "heliophage",
      regionId: "nebulae_line",
    },
  ],
  BEACON: [
    {
      nodeType: "BEACON",
      title: "Guild Waypoint",
      shortFlavor: "An independent relay broadcasting safe lanes and barter codes.",
      factionId: "beacon_guild",
      regionId: "silent_corridor",
    },
    {
      nodeType: "BEACON",
      title: "Union Rest Stop",
      shortFlavor: "Miners left tools and spare tanks bolted to a spinning platform.",
      factionId: "rustbelt_miners",
      regionId: "outer_belt",
    },
    {
      nodeType: "BEACON",
      title: "Syndicate Forward Post",
      shortFlavor: "Sleek refitter ring that trades fuel for silence and signatures.",
      factionId: "vega_syndicate",
      regionId: "nebulae_line",
    },
  ],
};

function pickFromList<T>(list: T[], seed: number): T {
  return list[seed % list.length];
}

export function getNodeNarrative(node: MapNode): NodeNarrative {
  const pool = NODE_NARRATIVES[node.type] ?? [];
  if (pool.length === 0) {
    return {
      nodeType: node.type,
      title: `${node.type} Site`,
      shortFlavor: "A charted point of interest on this contract.",
    };
  }
  return pickFromList(pool, node.id);
}

export function getFactionById(id: string): Faction | undefined {
  return FACTIONS.find((f) => f.id === id);
}

export function getRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export const factions = FACTIONS;
export const regions = REGIONS;
