import React, { useEffect, useMemo, useState } from "react";
import { generateMapFragment } from "../game/map";
import { itemsForNodeType } from "../game/items";
import {
  FailurePopup,
  Item,
  ItemSlot,
  MapFragment,
  MapNode,
  PathPoint,
  Phase,
  ResolutionLog,
  RunStats,
  SalvageUIState,
} from "../game/types";
import {
  HIT_RADIUS,
  FUEL_PER_UNIT,
  INITIAL_EQUIPPED,
  INITIAL_STATS,
} from "../game/constants";
import { distancePointToSegment, distancePoints, pickSome } from "../game/math";
import { randomFailureFor, scrapRewardFor, scrapSuccessChanceFor } from "../game/failures";
import { getNodeNarrative } from "../game/narrative";

export function useGameState() {
  const [fragment, setFragment] = useState<MapFragment>(() => generateMapFragment());
  const [stats, setStats] = useState<RunStats>({ ...INITIAL_STATS });
  const [phase, setPhase] = useState<Phase>("planning");
  const [log, setLog] = useState<ResolutionLog[]>([]);

  const [pathPoints, setPathPoints] = useState<PathPoint[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [visitedNodeIds, setVisitedNodeIds] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [anomalyVisits, setAnomalyVisits] = useState(0);

  const [equipped, setEquipped] = useState<Record<ItemSlot, Item>>({ ...INITIAL_EQUIPPED });

  const [salvageUI, setSalvageUI] = useState<SalvageUIState | null>(null);
  const [failurePopup, setFailurePopup] = useState<FailurePopup | null>(null);
  const [postEventDecisionNeeded, setPostEventDecisionNeeded] = useState(false);
  const [signalBenderUsed, setSignalBenderUsed] = useState(false);

  const baseNode = useMemo(
    () => fragment.nodes.find((n) => n.type === "BASE") ?? fragment.nodes[0],
    [fragment]
  );

  const shipPosition: PathPoint = useMemo(() => {
    if (pathPoints.length === 0) {
      return { x: baseNode.x, y: baseNode.y };
    }
    if (phase === "planning") {
      return pathPoints[pathPoints.length - 1];
    }
    return pathPoints[Math.min(currentPathIndex, pathPoints.length - 1)];
  }, [phase, pathPoints, currentPathIndex, baseNode]);

  function pushLog(entry: ResolutionLog) {
    setLog((prev) => [...prev, entry]);
  }

  function applyEquipEffects(prevStats: RunStats, oldItem: Item | null, newItem: Item | null): RunStats {
    let s = { ...prevStats };

    if (oldItem && oldItem.effect) {
      if (oldItem.effect.maxHullDelta) {
        s.maxHull -= oldItem.effect.maxHullDelta;
        s.hull = Math.min(s.hull, s.maxHull);
      }
      if (oldItem.effect.maxFuelDelta) {
        s.maxFuel -= oldItem.effect.maxFuelDelta;
        s.fuel = Math.min(s.fuel, s.maxFuel);
      }
    }

    if (newItem && newItem.effect) {
      if (newItem.effect.maxHullDelta) {
        s.maxHull += newItem.effect.maxHullDelta;
        s.hull = Math.min(s.hull, s.maxHull);
      }
      if (newItem.effect.maxFuelDelta) {
        s.maxFuel += newItem.effect.maxFuelDelta;
        s.fuel = Math.min(s.fuel, s.maxFuel);
      }
    }

    return s;
  }

  function equipItem(slot: ItemSlot, item: Item) {
    setEquipped((prevEq) => {
      const oldItem = prevEq[slot];
      const nextEq = { ...prevEq, [slot]: item };
      setStats((prevStats) => applyEquipEffects(prevStats, oldItem, item));
      pushLog({ nodeId: null, message: `Equipped ${item.name} in ${slot}.` });
      return nextEq;
    });
  }

  function resetPathAndFuel() {
    setPathPoints([]);
    setCurrentPathIndex(0);
    setVisitedNodeIds([]);
    setSalvageUI(null);
    setFailurePopup(null);
    setPostEventDecisionNeeded(false);
    setPhase("planning");
    setLog([]);
    setStats((prev) => ({ ...prev, fuel: prev.maxFuel, scrap: 0 }));
  }

  function handleNewMap() {
    setFragment(generateMapFragment());
    setPathPoints([]);
    setCurrentPathIndex(0);
    setVisitedNodeIds([]);
    setSalvageUI(null);
    setFailurePopup(null);
    setPostEventDecisionNeeded(false);
    setPhase("planning");
    setLog([]);
    setStats({ ...INITIAL_STATS });
    setAnomalyVisits(0);
    setSignalBenderUsed(false);
  }

  function svgPointFromEvent(e: React.PointerEvent<SVGSVGElement>): PathPoint {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }

  function tryAddPathPoint(point: PathPoint) {
    if (phase !== "planning") return;
    if (stats.fuel <= 0) {
      pushLog({ nodeId: null, message: "Out of fuel – erase the path to try again." });
      return;
    }

    let added = false;
    let cost = 0;

    setPathPoints((prev) => {
      const next = [...prev];

      if (next.length === 0) {
        next.push({ x: baseNode.x, y: baseNode.y });
      }

      const last = next[next.length - 1];
      const dist = distancePoints(last, point);
      if (dist < 0.5) {
        return prev;
      }

      const engine = equipped.ENGINE;
      const isFirstSegment = next.length === 1;
      if (!(engine && engine.id === "engine_long_spine" && isFirstSegment)) {
        cost = dist * FUEL_PER_UNIT;
        if (stats.fuel - cost < 0) {
          return prev;
        }
      }

      added = true;
      next.push(point);
      return next;
    });

    if (added && cost > 0) {
      setStats((prev) => ({ ...prev, fuel: Math.max(0, prev.fuel - cost) }));
    } else if (!added && stats.fuel <= 0) {
      pushLog({ nodeId: null, message: "Out of fuel – erase the path to try again." });
    }
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (phase !== "planning") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const p = svgPointFromEvent(e);
    tryAddPathPoint(p);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing || phase !== "planning") return;
    const p = svgPointFromEvent(e);
    tryAddPathPoint(p);
  }

  function handlePointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  function handleLaunch() {
    if (phase !== "planning") return;
    if (pathPoints.length < 2) {
      pushLog({ nodeId: null, message: "Draw a path from Base before launching." });
      return;
    }

    const startPos = pathPoints[0] ?? { x: baseNode.x, y: baseNode.y };
    const startNode =
      fragment.nodes.find((n) => distancePoints(n, startPos) <= HIT_RADIUS) ?? baseNode;

    setPhase("resolving");
    setCurrentPathIndex(0);
    setVisitedNodeIds([startNode.id]);
    setSalvageUI(null);
    setFailurePopup(null);
    setPostEventDecisionNeeded(false);
    setLog([
      {
        nodeId: startNode.id,
        message: startNode.type === "BASE" ? "Launch from Base." : "Launch from waypoint.",
      },
    ]);
  }

  function openSalvageUI(node: MapNode) {
    const pool = itemsForNodeType(node.type);
    const sampled = pickSome(pool, 3);

    let anomalyBonus = 0;
    if (node.type === "ANOMALY") {
      if (equipped.SCANNER && equipped.SCANNER.id === "scanner_pattern_solver") {
        anomalyBonus += 0.05 * anomalyVisits;
      }
      if (equipped.UTILITY2 && equipped.UTILITY2.id === "util_graviton_seed") {
        anomalyBonus += 0.05 * anomalyVisits;
      }
    }

    const options = sampled.map((item) => {
      const slot: ItemSlot = item.slot;
      const baseChanceMap = {
        COMMON: 0.8,
        UNCOMMON: 0.6,
        RARE: 0.4,
        ARTIFACT: 0.35,
      } as const;
      const baseChance = baseChanceMap[item.rarity];
      const bonus = node.type === "ANOMALY" ? anomalyBonus : 0;
      const successChance = Math.min(0.95, baseChance + bonus);
      return { slot, item, successChance };
    });

    let scrapChance = scrapSuccessChanceFor(node.type);
    if (node.type === "ANOMALY") {
      scrapChance = Math.min(0.95, scrapChance + anomalyBonus);
    }

    if (options.length === 0) {
      setSalvageUI({
        nodeId: node.id,
        nodeType: node.type,
        options: [],
        selectedIndex: null,
        scrapSuccessChance: scrapChance,
      });
      return;
    }

    setSalvageUI({
      nodeId: node.id,
      nodeType: node.type,
      options,
      selectedIndex: 0,
      scrapSuccessChance: scrapChance,
    });
  }

  function stepAlongPath() {
    if (phase !== "resolving") return;
    if (pathPoints.length < 2) {
      setPhase("complete");
      pushLog({ nodeId: null, message: "No path to follow." });
      setStats((prev) => ({ ...prev, scrap: 0 }));
      return;
    }

    const nextIndex = currentPathIndex + 1;

    if (nextIndex >= pathPoints.length) {
      const finalPos = pathPoints[pathPoints.length - 1];
      const distToBase = distancePoints(finalPos, baseNode);
      if (distToBase <= HIT_RADIUS) {
        pushLog({ nodeId: baseNode.id, message: "Path ends at Base. Salvage secured." });
      } else {
        pushLog({ nodeId: null, message: "Path ends away from Base. Salvage lost." });
        setStats((prev) => ({ ...prev, scrap: 0 }));
      }
      setCurrentPathIndex(pathPoints.length - 1);
      setPhase("complete");
      return;
    }

    const prevPos = pathPoints[currentPathIndex];
    const pos = pathPoints[nextIndex];

    const nodeHit = fragment.nodes.find((n) => {
      if (visitedNodeIds.includes(n.id)) return false;
      const d = distancePointToSegment(n, prevPos, pos);
      return d <= HIT_RADIUS;
    });

    setCurrentPathIndex(nextIndex);

    if (!nodeHit) return;

    setVisitedNodeIds((prev) => [...prev, nodeHit.id]);

    const narrative = getNodeNarrative(nodeHit);
    pushLog({ nodeId: nodeHit.id, message: narrative.title });
    pushLog({ nodeId: nodeHit.id, message: narrative.shortFlavor });

    switch (nodeHit.type) {
      case "WRECK":
      case "ANOMALY":
      case "BEACON": {
        if (nodeHit.type === "ANOMALY") {
          setAnomalyVisits((v) => v + 1);
        }
        openSalvageUI(nodeHit);
        setPhase("choice");
        break;
      }
      case "PIRATE": {
        if (
          equipped.UTILITY2 &&
          equipped.UTILITY2.id === "util_signal_bender" &&
          !signalBenderUsed
        ) {
          setSignalBenderUsed(true);
          pushLog({
            nodeId: nodeHit.id,
            message: "Signal Bender spoofs this Pirate node to neutral.",
          });
          break;
        }
        openSalvageUI(nodeHit);
        setPhase("choice");
        break;
      }
      case "EXIT": {
        pushLog({ nodeId: nodeHit.id, message: "Exit gate reached. You route back to Base." });
        setPhase("complete");
        break;
      }
      case "BASE": {
        pushLog({ nodeId: nodeHit.id, message: "Docked at Base. Salvage secured." });
        setPhase("complete");
        break;
      }
      default:
        break;
    }
  }

  function handleSelectSalvageOption(index: number) {
    if (!salvageUI) return;
    setSalvageUI({ ...salvageUI, selectedIndex: index });
  }

  function resolvePostEventDecisionNeeded() {
    setPostEventDecisionNeeded(true);
  }

  function handleFailureConfirm() {
    if (!failurePopup) return;
    const popup = failurePopup;
    setFailurePopup(null);
    setStats((prev) => {
      const next = popup.apply(prev);
      if (
        popup.nodeType === "WRECK" &&
        equipped.UTILITY1 &&
        equipped.UTILITY1.id === "util_risk_recyclers"
      ) {
        next.scrap += 1;
      }
      return next;
    });
    pushLog({ nodeId: null, message: `${popup.title}: ${popup.consequence}` });
    if (
      popup.nodeType === "WRECK" &&
      equipped.UTILITY1 &&
      equipped.UTILITY1.id === "util_risk_recyclers"
    ) {
      pushLog({ nodeId: null, message: "Risk Recyclers: +1 Scrap from Wreck damage." });
    }
    resolvePostEventDecisionNeeded();
  }

  function handleSalvageConfirm() {
    if (!salvageUI) return;
    const { selectedIndex, options, nodeType } = salvageUI;
    if (selectedIndex == null || !options[selectedIndex]) return;

    const option = options[selectedIndex];
    const roll = Math.random();
    if (roll <= option.successChance) {
      equipItem(option.slot, option.item);
      setStats((prev) => ({ ...prev, scrap: prev.scrap + 1 }));
      pushLog({
        nodeId: salvageUI.nodeId,
        message: `You salvage ${option.item.name} (${Math.round(option.successChance * 100)}%).`,
      });
      setSalvageUI(null);
      resolvePostEventDecisionNeeded();
    } else {
      if (
        nodeType === "PIRATE" &&
        equipped.UTILITY1 &&
        equipped.UTILITY1.id === "util_pirate_codebreaker" &&
        stats.scrap > 0
      ) {
        setStats((prev) => ({ ...prev, scrap: Math.max(0, prev.scrap - 1) }));
        pushLog({
          nodeId: salvageUI.nodeId,
          message: "You pay off the pirates with Scrap instead of taking damage.",
        });
        setSalvageUI(null);
        resolvePostEventDecisionNeeded();
        return;
      }
      const failure = randomFailureFor(nodeType);
      setFailurePopup(failure);
      setSalvageUI(null);
    }
  }

  function handleScrapConfirm() {
    if (!salvageUI) return;
    const { nodeType, scrapSuccessChance } = salvageUI;
    const roll = Math.random();
    if (roll <= scrapSuccessChance) {
      const reward = scrapRewardFor(nodeType);
      setStats((prev) => ({ ...prev, scrap: prev.scrap + reward }));
      pushLog({ nodeId: salvageUI.nodeId, message: `You strip the site for scrap (+${reward}).` });
      setSalvageUI(null);
      resolvePostEventDecisionNeeded();
    } else {
      if (
        nodeType === "PIRATE" &&
        equipped.UTILITY1 &&
        equipped.UTILITY1.id === "util_pirate_codebreaker" &&
        stats.scrap > 0
      ) {
        setStats((prev) => ({ ...prev, scrap: Math.max(0, prev.scrap - 1) }));
        pushLog({
          nodeId: salvageUI.nodeId,
          message: "You pay off the pirates with Scrap instead of taking damage.",
        });
        setSalvageUI(null);
        resolvePostEventDecisionNeeded();
        return;
      }
      const failure = randomFailureFor(nodeType);
      setFailurePopup(failure);
      setSalvageUI(null);
    }
  }

  function handleSalvageIgnore() {
    if (!salvageUI) return;
    pushLog({ nodeId: salvageUI.nodeId, message: "You leave the site untouched." });
    setSalvageUI(null);
    resolvePostEventDecisionNeeded();
  }

  function handleRouteDecision(action: "continue" | "redraw") {
    if (action === "continue") {
      setPostEventDecisionNeeded(false);
      setPhase("resolving");
      return;
    }
    setPostEventDecisionNeeded(false);
    setPhase("planning");
    setPathPoints((prev) => prev.slice(0, currentPathIndex + 1));
    pushLog({ nodeId: null, message: "You hold position and begin plotting a new path." });
  }

  useEffect(() => {
    if (phase !== "resolving") return;
    if (salvageUI || failurePopup || postEventDecisionNeeded) return;
    if (pathPoints.length < 2) return;

    const id = window.setInterval(() => {
      stepAlongPath();
    }, 260);

    return () => window.clearInterval(id);
  }, [
    phase,
    salvageUI,
    failurePopup,
    postEventDecisionNeeded,
    pathPoints,
    currentPathIndex,
    visitedNodeIds,
    equipped,
    signalBenderUsed,
    fragment,
    baseNode,
  ]);

  return {
    fragment,
    stats,
    phase,
    log,
    pathPoints,
    currentPathIndex,
    visitedNodeIds,
    salvageUI,
    failurePopup,
    postEventDecisionNeeded,
    equipped,
    signalBenderUsed,
    baseNode,
    shipPosition,
    resetPathAndFuel,
    handleNewMap,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleLaunch,
    handleSelectSalvageOption,
    handleSalvageConfirm,
    handleScrapConfirm,
    handleSalvageIgnore,
    handleFailureConfirm,
    handleRouteDecision,
  };
}
