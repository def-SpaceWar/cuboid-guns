import type { Environment } from "../../main.ts";
import type { Color } from "../../render/color.ts";
import type { Platform } from "../platform/platform.ts";
import type { Player } from "../player/player.ts";

export type GameState = {
  players: Player[];
  platforms: Platform[];
  env: Environment;
};

export interface Gamemode {
  gameState: GameState;
  gameOver(): boolean;
  winner(): [whoOrMessage: string, color: Color];
  update(dt: number): void;
}
