import { Color } from "../../render/color.ts";
import type { Gamemode, GameState } from "./gamemode.ts";

// TODO: Teams at some point
export class LastStanding implements Gamemode {
  lives: number;
  lifeMap: Map<number, number>;

  constructor(public gameState: GameState) {
    this.lives = Number(localStorage.getItem("lives")) || 1;

    this.lifeMap = new Map<number, number>();
    gameState.players.map((p) => {
      this.lifeMap.set(p.playerNum, this.lives);
    });
  }

  gameOver(): boolean {
    let amountAlive = 0;
    this.lifeMap.forEach((v) => {
      if (v > 0) amountAlive++;
    });
    return amountAlive <= 1;
  }

  winner(): [whoOrWhat: string, color: Color] {
    return ["Unimplemented", Color.random()];
  }

  update(): void {
    this.gameState.players.map((p) => {
      if (!p.dead) return;

      const livesLeft = this.lifeMap.get(p.playerNum) || 0;
      if (livesLeft <= 0) return;
      this.lifeMap.set(p.playerNum, livesLeft - 1);

      if (livesLeft <= 1) return;
      // TODO: respawn magic
    });
  }
}
