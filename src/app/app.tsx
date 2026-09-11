import { GameShell } from "@/features/game/ui/GameShell";

/** RS-002: thin composition — no routing needed for M1, GameShell is the whole product. */
export function App() {
  return <GameShell />;
}
