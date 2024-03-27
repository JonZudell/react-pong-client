class Ball {
    public radius: number;
    public x: number;
    public y: number;

    constructor(radius: number, x: number, y: number) {
        this.radius = radius;
        this.x = x;
        this.y = y;
    }
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

export default Ball;