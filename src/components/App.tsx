import React from "react";
import { EquippedStrip } from "./EquippedStrip";
import { FailurePopup } from "./FailurePopup";
import { LogPanel } from "./LogPanel";
import { MapView } from "./MapView";
import { RouteDecisionPopup } from "./RouteDecisionPopup";
import { SalvagePopup } from "./SalvagePopup";
import { StatsBar } from "./StatsBar";
import { useGameState } from "../hooks/useGameState";

const App: React.FC = () => {
  const {
    fragment,
    stats,
    phase,
    log,
    pathPoints,
    currentPathIndex,
    salvageUI,
    failurePopup,
    postEventDecisionNeeded,
    equipped,
    shipPosition,
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
    resetPathAndFuel,
    handleNewMap,
  } = useGameState();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 flex flex-col items-center py-4 px-2">
      <div className="w-full max-w-3xl flex flex-col items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight text-slate-50">
          Crash Cartographers: Freepath Salvage
        </h1>
        <p className="text-[11px] text-slate-400 max-w-xl text-center">
          Draw risky routes through drifting wrecks, anomalies, pirates, and beacons. Spend fuel to
          chart your path, then launch your ship and decide what to salvage along the way.
        </p>

        <StatsBar stats={stats} onErasePath={resetPathAndFuel} onNewMap={handleNewMap} />
        <EquippedStrip equipped={equipped} />

        <MapView
          fragment={fragment}
          phase={phase}
          pathPoints={pathPoints}
          currentPathIndex={currentPathIndex}
          shipPosition={shipPosition}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onLaunch={handleLaunch}
        />

        <SalvagePopup
          phase={phase}
          salvageUI={salvageUI}
          failurePopup={failurePopup}
          postEventDecisionNeeded={postEventDecisionNeeded}
          nodes={fragment.nodes}
          onSelectOption={handleSelectSalvageOption}
          onSalvage={handleSalvageConfirm}
          onScrap={handleScrapConfirm}
          onIgnore={handleSalvageIgnore}
        />

        <FailurePopup popup={failurePopup} onConfirm={handleFailureConfirm} />
        <RouteDecisionPopup
          show={postEventDecisionNeeded && !failurePopup && !salvageUI}
          onDecision={handleRouteDecision}
        />

        <LogPanel phase={phase} log={log} />
      </div>
    </div>
  );
};

export default App;
