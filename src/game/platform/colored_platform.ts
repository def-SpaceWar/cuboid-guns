import { Color } from "../../render/color";
import { Rectangle } from "../../render/rectangle";
import { Player } from "../player/player";
import { Platform } from "./platform";

export class ColoredPlatform implements Platform {
    rect: Rectangle;

    get x() { return this.rect.x };
    set x(n) { this.rect.x = n };
    get y() { return this.rect.y };
    set y(n) { this.rect.y = n };
    get w() { return this.rect.w };
    set w(n) { this.rect.w = n };
    get h() { return this.rect.h };
    set h(n) { this.rect.h = n };

    playersTouching: Player[] = [];

    constructor(
        x: number, y: number,
        w: number, h: number,
        color: Color,
        public phaseable = true
    ) {
        this.rect = new Rectangle(x, y, w, h, color);
    }


    isCollided(player: Player): boolean {
        return (player.x + player.w > this.x) && (player.x < this.x + this.w)
            && (player.y + player.h > this.y) && (player.y < this.y + player.h / 2);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.rect.draw(ctx);
        ctx.restore();
    }

    update(dt: number): void { dt; }
}
