interface DonutProps {
    startAngle?: number;
    endAngle?: number;
    color: string;
    ctx: CanvasRenderingContext2D | null;
    center: {
        x: number;
        y: number;
    };
    innerRadius: number;
    outerRadius: number;
}

interface DonutRenderProps {
    startAngle: number;
    endAngle: number;
}

export class Donut {
    private props: DonutProps;

    public constructor(props: DonutProps) {
        this.props = props;
    }

    public render({ startAngle, endAngle }: DonutRenderProps): void {
        const { ctx, center, outerRadius, innerRadius } = this.props;

        this.props = {
            ...this.props,
            startAngle,
            endAngle,
        };

        if (ctx) {
            ctx.save();
            ctx.clearRect(
                center.x - outerRadius,
                center.y - outerRadius,
                2 * outerRadius,
                2 * outerRadius
            );
            ctx.strokeStyle = "black";
            ctx.fillStyle = this.props.color;
            ctx.beginPath();
            ctx.arc(center.x, center.y, outerRadius, startAngle, endAngle, false); // Outer: counter clockwise
            ctx.arc(center.x, center.y, innerRadius, endAngle, startAngle, true); // Inner: clockwise
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    public setColor(color: string): void {
        this.props.color = color;
    }
}
