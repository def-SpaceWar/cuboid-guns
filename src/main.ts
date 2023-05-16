import startGame from './start_game.ts';
import './style.css';

const canvas = document.getElementById("app")!.appendChild(document.createElement("canvas")),
    resize = () => {
        [canvas.width, canvas.height] = [
            window.innerWidth,
            window.innerHeight
        ]
    },
    ctx = canvas.getContext("2d")!;
resize(); addEventListener("resize", resize);

const keys: string[] = [];
document.addEventListener("keydown", ({ key }) => {
    if (keys.indexOf(key) != -1) return;
    keys.push(key);
});
document.addEventListener("keyup", ({ key }) => {
    const index = keys.indexOf(key);
    if (index == -1) return;
    keys.splice(index, 1);
});

export type Environment = {
    ctx: CanvasRenderingContext2D;
    keys: string[];
    loop: number;
}

const env: Environment = {
    ctx,
    keys,
    loop: 0
};

env.loop = startGame(env);
