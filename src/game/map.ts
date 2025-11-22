import { MapFragment, MapNode, NodeType } from "./types";

export function generateMapFragment(): MapFragment {
  const nodeCount = 8;
  const nodes: MapNode[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 28 + Math.random() * 10; // percent
    const centerX = 50;
    const centerY = 50;
    const x = centerX + Math.cos(angle) * radius + (Math.random() * 6 - 3);
    const y = centerY + Math.sin(angle) * radius + (Math.random() * 6 - 3);

    let type: NodeType = "WRECK";
    if (i === 0) type = "BASE";
    else {
      const r = Math.random();
      if (r < 0.25) type = "WRECK";
      else if (r < 0.45) type = "ANOMALY";
      else if (r < 0.65) type = "PIRATE";
      else if (r < 0.85) type = "BEACON";
      else type = "EXIT"; // occasional exit gate that also cashes out loot
    }

    const danger = type === "BASE" || type === "EXIT" ? 0 : 1 + Math.floor(Math.random() * 3);

    nodes.push({ id: i, x, y, type, danger });
  }

  return { nodes };
}
