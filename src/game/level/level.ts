import type { Position } from "../../render/rectangle.ts";
import { loadImage } from "../../util.ts";
import type { Platform } from "../platform/platform.ts";

export type Tile = " " | "1" | "2" | "3" | "4" | "g";
export type LevelData = {
  name: string;
  bgUrl: string;
  tiles: Tile[][];
};

export class Level {
  name: string;
  bgImage: HTMLImageElement;

  spawnPoints: Position[];
  platforms: Platform[];

  constructor(public levelData: LevelData) {
    this.name = this.levelData.name;
    this.bgImage = document.createElement("img");

    this.spawnPoints = [];
    this.platforms = [];
  }

  async load(ctx: CanvasRenderingContext2D) {
    // loading screen?
    ctx;

    this.bgImage = await loadImage(this.levelData.bgUrl);
  }

  draw(camera: Position, ctx: CanvasRenderingContext2D) {
    const scale = 0.5,
      imgScale = 5,
      width = this.bgImage.width * imgScale,
      height = this.bgImage.height * imgScale;

    ctx.save();
    ctx.translate(-width / 2, -height / 2);
    ctx.translate(camera[0], camera[1]);
    ctx.scale(scale, scale);
    ctx.translate(-camera[0], -camera[1]);
    ctx.translate(width / 2, height / 2);
    ctx.drawImage(this.bgImage, 0, 0, width, height);
    ctx.restore();
  }
}
