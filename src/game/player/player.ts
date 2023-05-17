import { Platform } from "../platform/platform.ts";

export type PlayerEnvironment = {
    players: Player[],
    platforms: Platform[],
    keys: string[]
};

export type Controls = {
    left: string,
    right: string,
    up: string,
    down: string,
    attack: string,
    special: string
}

export interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    rotation: number;

    velX: number;
    velY: number;
    
    playerNum: number;
    health: PlayerHealth;
    dead: boolean;

    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number, environment: PlayerEnvironment): void;
}

export interface PlayerHealth {
    health: number;
    maxHealth: number;
    takeDamage(amount: number): void;
    regenHealth(amount: number): void;

    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
}
