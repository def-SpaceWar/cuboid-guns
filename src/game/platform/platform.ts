import { Player } from "../player/player";

export interface Platform {
    x: number;
    y: number;
    w: number;
    h: number;
    playersTouching: Player[];
    phaseable: boolean;

    isCollided(player: Player): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
}
