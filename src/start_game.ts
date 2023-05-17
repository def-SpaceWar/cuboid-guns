import { LastStanding } from "./game/gamemode/last_standing.ts";
import { ColoredPlatform } from "./game/platform/colored_platform.ts";
import Default from "./game/player/default.ts";
import type { Player } from "./game/player/player.ts";
import type { Environment } from "./main.ts";
import { Color } from "./render/color.ts";
import { pause } from "./util.ts";

const startGame = (env: Environment) => {
  const camera: [x: number, y: number] = [
      env.ctx.canvas.width / 2,
      env.ctx.canvas.height / 2,
    ],
    centerCamera = (players: Player[]) => {
      const alivePlayers = players.filter((p) => !p.dead),
        averageCoord: [x: number, y: number] = alivePlayers.reduce(
          (
            avg,
            p,
          ) => [
            avg[0] + p.x / alivePlayers.length,
            avg[1] + p.y / alivePlayers.length,
          ],
          [0, 0],
        ),
        newX = env.ctx.canvas.width / 2 - averageCoord[0],
        newY = env.ctx.canvas.height / 2 - averageCoord[1];

      const lerpConstant = 9;
      camera[0] = (camera[0] * lerpConstant + newX) / (lerpConstant + 1);
      camera[1] = (camera[1] * lerpConstant + newY) / (lerpConstant + 1);
    };

  const players: Player[] = [
    new Default(
      400,
      0,
      new Color(255, 0, 0),
      {
        left: "ArrowLeft",
        right: "ArrowRight",
        up: "ArrowUp",
        down: "ArrowDown",
        attack: "/",
        special: ".",
      },
      1,
    ),
    new Default(
      -400,
      0,
      new Color(0, 127.5, 255),
      { left: "s", right: "f", up: "e", down: "d", attack: "w", special: "q" },
      2,
    ),
    //new Default(
    //    (Math.random() - 0.5) * 300, 0,
    //    new Color(0, 255, 55),
    //    { left: "", right: "", up: "", down: "", attack: "", special: "" },
    //    3
    //),
    //new Default(
    //    (Math.random() - 0.5) * 300, 0,
    //    new Color(255, 127.5, 0),
    //    { left: "", right: "", up: "", down: "", attack: "", special: "" },
    //    4
    //)
  ];

  const platforms = [
    new ColoredPlatform(-500, 800, 1000, 35, new Color(100, 100, 100), false),
    new ColoredPlatform(-500, 200, 1000, 15, Color.random(), true),
    new ColoredPlatform(-5000, 1050, 10000, 2000, Color.damage, true),
  ];

  for (let i = 0; i < 98; i++) {
    platforms.push(
      new ColoredPlatform(
        Math.random() * 3000 - 1500,
        -Math.random() * 9000 + 700,
        1000,
        15,
        Color.random(),
        true,
      ),
    );
  }

  const playerEnv = { players, platforms, keys: env.keys };
  const gamemode = new LastStanding({ players, platforms, env });
  let gameOver = false;
  let winner: [whoOrWhat: string, color: Color];

  const gameLoop = (before: number) => (now: number) => {
    env.ctx.fillStyle = "#25d3ff";
    env.ctx.fillRect(0, 0, env.ctx.canvas.width, env.ctx.canvas.height);
    env.ctx.save();
    centerCamera(players);
    env.ctx.translate(...camera);
    platforms.forEach((p) => p.draw(env.ctx));
    players.forEach((p) => p.draw(env.ctx));
    env.ctx.restore();
    players.forEach((p) => p.health.draw(env.ctx));

    const dt = (now - before) / 1000;
    gamemode.update();
    if (gamemode.gameOver() && !gameOver) {
      pause(1)
        .then(() => {
          winner = gamemode.winner();
        });

      pause(6)
        .then(() => {
          cancelAnimationFrame(env.loop);
          env.loop = startGame(env);
        });
      gameOver = true;
    }

    if (winner && gameOver) {
      winner; // display winner in-game in the right color
    }

    platforms.forEach((p) => p.update(dt));
    players.forEach((p) => p.update(dt, playerEnv));
    players.forEach((p) => {
      if (p.y > 1000) {
        p.health.takeDamage(40 * dt);
        p.y = 1000;
        p.velY = 2000;
      }
    });
    players.forEach((p) => p.health.update(dt));

    env.loop = requestAnimationFrame(gameLoop(now));
  };

  return requestAnimationFrame(gameLoop(performance.now()));
};

export default startGame;
