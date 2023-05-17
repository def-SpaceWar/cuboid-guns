import { Color } from "../../render/color.ts";
import { Rectangle } from "../../render/rectangle.ts";
import { PlayerEnvironment, Player, Controls, PlayerHealth } from "./player.ts";

export default class Default implements Player {
    rect: Rectangle;
    velX = 0;
    velY = 0;
    gravity = 2500;

    grounded = false;
    doubleJump = 2;
    canJump = true;
    isPhasing = false;
    phaseTimeout = 0;

    canAttack = true;
    attackCooldown = 2;
    attackTimer = 0;
    attackRange = 100;
    attackPower = 40;
    damage = 4;
    combo = 0;
    comboCooldown = 0.25;
    cooldownRectBg: Rectangle;
    cooldownRect: Rectangle;

    specialTimer = 0;
    specialCooldown = this.attackCooldown * 2;

    isSpecialCooldown = false;

    get x() { return this.rect.x; }
    set x(n) { this.rect.x = n; }
    get y() { return this.rect.y; }
    set y(n) { this.rect.y = n; }
    get w() { return this.rect.w; }
    set w(n) { this.rect.w = n; }
    get h() { return this.rect.h; }
    set h(n) { this.rect.h = n; }
    get rotation() { return this.rect.rotation; }
    set rotation(n) { this.rect.rotation = n; }

    health: DefaultHealth;
    dead = false;

    constructor(x: number, y: number, color: Color, public controls: Controls, public playerNum: number) {
        this.rect = new Rectangle(x, y, 50, 50, color);
        this.health = new DefaultHealth(this);

        this.cooldownRectBg = new Rectangle(-25, -45, 50, 8, this.health.bgRect.color);
        this.cooldownRect = new Rectangle(-25, -45, 0, 8, color);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.rect.draw(ctx);
        if (this.attackTimer > 0 || this.specialTimer > 0) {
            ctx.save();
            this.cooldownRectBg.draw(ctx);
            ctx.restore();
            ctx.save();
            this.cooldownRect.draw(ctx);
            ctx.restore();
        }
        ctx.restore();
    }

    jump() {
        if (!this.canJump) return;
        if (!this.grounded && this.doubleJump <= 0) return;

        if (this.grounded) {
            this.grounded = false;
            this.velY -= 1250;
        } else {
            this.doubleJump -= 1;
            this.velY -= 1000;
        }

        const temp = this.doubleJump;
        this.canJump = false;
        this.doubleJump = 0;
        setTimeout(() => {
            this.canJump = true;
            this.doubleJump = temp;
        }, 200);
    }

    phase() {
        this.isPhasing = true;
        this.grounded = false;

        this.phaseTimeout = setTimeout(() => this.isPhasing = false, 500);
    }

    attack(env: PlayerEnvironment) {
        if (!this.canAttack) return;

        const squaredDistance = (x: number, y: number, z: number, w: number) =>
            ((x - z) ** 2) + ((y - w) ** 2);

        let hasHit = false;

        for (let i = 0; i < env.players.length; i++) {
            if (env.players[i] == this) continue;
            if (env.players[i].dead) continue;
            const distance = squaredDistance(this.x, this.y, env.players[i].x, env.players[i].y);
            if (distance < (this.attackRange ** 2)) {
                const [kbX, kbY] = [
                    env.players[i].x - this.x,
                    env.players[i].y - this.y
                ];

                const healthRatio = Math.sqrt(1 / (env.players[i].health.health / env.players[i].health.maxHealth));
                env.players[i].velX += kbX * this.attackPower * healthRatio;
                env.players[i].velY += kbY * this.attackPower * healthRatio;

                const damage =
                    Math.min(
                        Math.max(
                            this.attackRange
                            / Math.sqrt(
                                (env.players[i].x - this.x) ** 2
                                + (env.players[i].y - this.y) ** 2
                            ) * this.damage,
                            this.damage ** 1.5
                        ), this.damage ** 2.5
                    ) * (1 + 0.5 * this.combo);

                env.players[i].health.takeDamage(damage);

                hasHit = true;
                this.combo++;
            }
        }

        if (!hasHit) this.combo = 0;
        this.canAttack = false;
        this.attackTimer = this.attackCooldown - (this.combo * this.comboCooldown);
    }

    special() {
        if (this.attackTimer > 0) return;
        if (this.specialTimer > 0) return;
        if (!this.canAttack) return;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.health.regenHealth(4);
            }, i * 1000);
        }

        this.isSpecialCooldown = true;
        this.specialTimer = this.specialCooldown;
        this.canAttack = false;
    }

    update(dt: number, environment: PlayerEnvironment): void {
        this.x += this.velX * dt;
        this.y += this.velY * dt;
        if (!this.grounded) this.velY += this.gravity * dt;

        this.velX *= Math.exp(-dt * 5);
        this.velY *= Math.exp(-dt * 5);

        if (Math.abs(this.velX) < 0.1) this.velX = 0;
        if (Math.abs(this.velY) < 0.1) this.velY = 0;

        if (!this.dead) {
            if (environment.keys.indexOf(this.controls.left) != -1) this.velX -= 2000 * dt;
            if (environment.keys.indexOf(this.controls.right) != -1) this.velX += 2000 * dt;
            if (environment.keys.indexOf(this.controls.up) != -1) this.jump();
            if (environment.keys.indexOf(this.controls.down) != -1 && !this.isPhasing) this.phase();
            if (environment.keys.indexOf(this.controls.attack) != -1) this.attack(environment);
            if (environment.keys.indexOf(this.controls.special) != -1) this.special();
        }

        if (this.velY > 0) {
            environment.platforms.forEach(platform => {
                if (this.isPhasing && platform.phaseable) return;

                if (platform.isCollided(this)) {
                    this.grounded = true;
                    if (this.isPhasing) {
                        clearTimeout(this.phaseTimeout as number);
                        this.isPhasing = false;
                    }
                    this.doubleJump = 2;
                    this.velY = 0;
                    this.y = platform.y - this.h + 1;
                    platform.playersTouching.push(this);
                }
            });
        } else if (this.grounded) {
            const platform =
                environment.platforms.find(platform =>
                    platform.playersTouching.findIndex(player => player == this) != -1
                )!;

            this.grounded = platform.isCollided(this);
        }

        this.attackTimer -= dt;
        this.specialTimer -= dt;
        if (!this.isSpecialCooldown) {
            if (this.attackTimer <= 0) this.canAttack = true;
            else this.cooldownRect.w = this.cooldownRectBg.w * (this.attackTimer / (this.attackCooldown - (this.combo * this.comboCooldown)));
        } else {
            if (this.specialTimer <= 0) {
                this.canAttack = true;
                this.isSpecialCooldown = false;
            } else {
                this.cooldownRect.w = this.cooldownRectBg.w * (this.specialTimer / this.specialCooldown);
            }
        }
    }
}

class DefaultHealth implements PlayerHealth {
    health = 100;
    animationHealth = 100;
    maxHealth = 100;

    borderRect: Rectangle;
    bgRect: Rectangle;
    rect: Rectangle;
    deadColor: Color;

    constructor(public player: Default) {
        this.borderRect = new Rectangle(0, 0, 250, 75, new Color(50, 50, 50));
        this.bgRect = new Rectangle(15, 15, 220, 45, this.player.rect.color.darken(2));
        this.rect = new Rectangle(15, 15, 110, 45, this.player.rect.color);
        this.deadColor = this.player.rect.color.darken(2);
    }

    setPosition(num: number, canvas: HTMLCanvasElement) {
        switch (num) {
            case 1:
                [this.borderRect.x, this.borderRect.y] = [50, 50];
                [this.bgRect.x, this.bgRect.y] = [65, 65];
                [this.rect.x, this.rect.y] = [65, 65];
                break;
            case 2:
                [this.borderRect.x, this.borderRect.y] = [canvas.width - 300, 50];
                [this.bgRect.x, this.bgRect.y] = [canvas.width - 285, 65];
                [this.rect.x, this.rect.y] = [canvas.width - 285, 65];
                break;
            case 3:
                [this.borderRect.x, this.borderRect.y] = [50, canvas.height - 125];
                [this.bgRect.x, this.bgRect.y] = [65, canvas.height - 110];
                [this.rect.x, this.rect.y] = [65, canvas.height - 110];
                break;
            case 4:
                [this.borderRect.x, this.borderRect.y] = [canvas.width - 300, canvas.height - 125];
                [this.bgRect.x, this.bgRect.y] = [canvas.width - 285, canvas.height - 110];
                [this.rect.x, this.rect.y] = [canvas.width - 285, canvas.height - 110];
                break;
            default:
                break;
        }
    }

    takeDamage(amount: number): void {
        if (this.player.dead) return;
        if (amount <= 0) return;
        this.health = Math.max(this.health - amount, 0);
        this.rect.color.pulse(Color.damage, 2);
        this.bgRect.color.pulse(Color.damage.darken(2), 2);
    }

    regenHealth(amount: number): void {
        if (this.player.dead) return;
        if (amount <= 0) return;
        this.health = Math.min(this.health + amount, this.maxHealth);
        this.rect.color.pulse(Color.regen, 2);
        this.bgRect.color.pulse(Color.regen.darken(2), 2);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.setPosition(this.player.playerNum, ctx.canvas);

        ctx.save();
        this.borderRect.draw(ctx);
        ctx.restore();

        ctx.save();
        this.bgRect.draw(ctx);
        ctx.restore();

        ctx.save();
        this.rect.draw(ctx);
        ctx.restore();
    }

    update(dt: number): void {
        this.rect.w = Math.max(this.bgRect.w * this.animationHealth / this.maxHealth, 0);

        const animationSpeed = 3;
        this.animationHealth = ((this.health * dt * animationSpeed) + this.animationHealth) / (1 + (dt * animationSpeed));

        if (this.health == 0) {
            this.player.dead = true;
            const temp = this.player.rect.color;
            this.player.rect.color = this.deadColor.copy();
            this.player.rect.color.pulse(temp.copy(), .5);
        }
    }
}
