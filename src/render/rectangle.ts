import { Color } from "./color";

export class Rectangle {
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number,
        public color: Color,
        public rotation = 0
    ) { }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color.toString();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }
}
