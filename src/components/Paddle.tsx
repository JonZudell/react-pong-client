class Paddle {
    public width: number;
    public height: number;
    public x: number;
    public y: number;

    constructor(width: number, height: number, x: number, y: number) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    // Add any additional methods or properties here
    draw(context: CanvasRenderingContext2D) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }

}

export default Paddle;