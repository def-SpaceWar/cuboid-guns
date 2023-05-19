import type { Vector2D } from "../util.ts";
import type { Color } from "./color.ts";

export type Position = Vector2D;
export type Dimensions = Vector2D;

export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public color: Color,
    public rotation = 0,
  ) {}

  get position(): Position {
    return [this.x, this.y]
  }
  set position(pos: Position) {
    this.x = pos[0];
    this.y = pos[1];
  }

  get dimensions(): Dimensions {
    return [this.w, this.h];
  }
  set dimensions(dim: Dimensions) {
    this.w = dim[0];
    this.h = dim[1];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color.toString();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.rotate(this.rotation);
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
  }
}
