export class Color {
    static random() {
        return new Color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        );
    }

    static blend(c1: Color, c2: Color, amount = 0.5) {
        return new Color(
            c1.r * amount + c2.r * (1 - amount),
            c1.g * amount + c2.g * (1 - amount),
            c1.b * amount + c2.b * (1 - amount)
        );
    }

    static damage = new Color(255, 50, 100);
    static regen = new Color(50, 255, 100);

    constructor(public r: number, public g: number, public b: number) {}

    darken(amount: number) {
        return new Color(this.r / amount, this.g / amount, this.b / amount);
    }

    lighten(amount: number) {
        return new Color(
            Math.max(this.r * amount, 255),
            Math.max(this.g * amount, 255),
            Math.max(this.b * amount, 255)
        );
    }

    pulse(from: Color, time: number) {
        const differenceR = this.r - from.r,
            differenceG = this.g - from.g,
            differenceB = this.b - from.b;

        this.r = from.r;
        this.g = from.g;
        this.b = from.b;

        const animationSteps = 100;
        let step = 0;
        const interval = setInterval(() => {
            if (step >= animationSteps) {
                clearInterval(interval);
            } else {
                this.r += differenceR / animationSteps;
                this.g += differenceG / animationSteps;
                this.b += differenceB / animationSteps;
                step++;
            }
        }, time * 1000 / animationSteps);
    }

    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    copy() {
        return new Color(this.r, this.g, this.b);
    }
}
