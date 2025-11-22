import { randomInt } from "./math";
import { FailurePopup, NodeType } from "./types";

export function randomFailureFor(nodeType: NodeType): FailurePopup {
  if (nodeType === "WRECK") {
    const failures: Omit<FailurePopup, "apply">[] = [
      {
        id: "wreck_shard_burst",
        title: "Shard Burst",
        description: "The hull ruptures under a cloud of spinning debris.",
        consequence: "-1 Hull.",
        nodeType,
      },
      {
        id: "wreck_cascade",
        title: "Cascade Collapse",
        description: "The wreck's spine gives way, slamming into your side.",
        consequence: "-1 Hull and -1 Fuel.",
        nodeType,
      },
    ];
    const base = failures[randomInt(failures.length)];
    return {
      ...base,
      apply: (prev) => {
        let next = { ...prev };
        if (base.id === "wreck_shard_burst") {
          next.hull -= 1;
        } else {
          next.hull -= 1;
          next.fuel = Math.max(0, next.fuel - 1);
        }
        return next;
      },
    };
  }

  if (nodeType === "PIRATE") {
    const failures: Omit<FailurePopup, "apply">[] = [
      {
        id: "pirate_ambush",
        title: "Pirate Ambush",
        description: "A hidden wing of raiders knifes in from the dark.",
        consequence: "-2 Hull.",
        nodeType,
      },
      {
        id: "pirate_boarding",
        title: "Boarding Attempt",
        description: "You repel boarders, but not before they fire a few shots.",
        consequence: "-1 Hull and lose 1 Scrap.",
        nodeType,
      },
    ];
    const base = failures[randomInt(failures.length)];
    return {
      ...base,
      apply: (prev) => {
        let next = { ...prev };
        if (base.id === "pirate_ambush") {
          next.hull -= 2;
        } else {
          next.hull -= 1;
          next.scrap = Math.max(0, next.scrap - 1);
        }
        return next;
      },
    };
  }

  if (nodeType === "ANOMALY") {
    const failures: Omit<FailurePopup, "apply">[] = [
      {
        id: "anomaly_shear",
        title: "Gravitic Shear",
        description: "Sections of the ship tug in different directions at once.",
        consequence: "-1 Hull and -1 Fuel.",
        nodeType,
      },
      {
        id: "anomaly_phase_skip",
        title: "Phase Skip",
        description: "You flicker sideways in time, systems coughing on restart.",
        consequence: "-2 Fuel.",
        nodeType,
      },
    ];
    const base = failures[randomInt(failures.length)];
    return {
      ...base,
      apply: (prev) => {
        let next = { ...prev };
        if (base.id === "anomaly_shear") {
          next.hull -= 1;
          next.fuel = Math.max(0, next.fuel - 1);
        } else {
          next.fuel = Math.max(0, next.fuel - 2);
        }
        return next;
      },
    };
  }

  if (nodeType === "BEACON") {
    const failures: Omit<FailurePopup, "apply">[] = [
      {
        id: "beacon_overcharge",
        title: "Refuel Overcharge",
        description: "Cheap fuel gums up your intake lines.",
        consequence: "-1 Fuel.",
        nodeType,
      },
      {
        id: "beacon_shoddy_work",
        title: "Shoddy Repairs",
        description: "Dockside welders leave microfractures in your hull.",
        consequence: "-1 Hull.",
        nodeType,
      },
    ];
    const base = failures[randomInt(failures.length)];
    return {
      ...base,
      apply: (prev) => {
        let next = { ...prev };
        if (base.id === "beacon_overcharge") {
          next.fuel = Math.max(0, next.fuel - 1);
        } else {
          next.hull -= 1;
        }
        return next;
      },
    };
  }

  return {
    id: "generic_mishap",
    title: "Mishap",
    description: "Something rattles loose in the chaos.",
    consequence: "-1 Hull.",
    nodeType,
    apply: (prev) => ({ ...prev, hull: prev.hull - 1 }),
  };
}

export function scrapSuccessChanceFor(nodeType: NodeType): number {
  switch (nodeType) {
    case "WRECK":
      return 0.85;
    case "PIRATE":
      return 0.75;
    case "ANOMALY":
      return 0.8;
    case "BEACON":
      return 0.95;
    default:
      return 0.8;
  }
}

export function scrapRewardFor(nodeType: NodeType): number {
  switch (nodeType) {
    case "WRECK":
      return 2;
    case "PIRATE":
      return 2;
    case "ANOMALY":
      return 3;
    case "BEACON":
      return 1;
    default:
      return 1;
  }
}
