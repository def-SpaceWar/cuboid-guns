import { Environment } from "../../main";
import { PlayerEnvironment } from "../player/player";

export type GameState = {
    env: Environment;
    pEnv: PlayerEnvironment;
}

// figure out how to implement this!
// there are many ways to go about it
// and I need to do the right one for maintainability
export interface Gamemode {
    gameState: GameState;
    gameOver(): boolean;
    //? start(): void;
    //? update(): void;
    //? draw(): void;
}