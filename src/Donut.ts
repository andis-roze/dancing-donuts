import { ClockWise, Coords } from "./types";

interface DonutProps {
    clockWise: ClockWise;
    startAngle: number;
    endAngle: number;
    color: string;
    ctx: CanvasRenderingContext2D | null;
    center: Coords;
    innerRadius: number;
    outerRadius: number;
}

type Angles = Pick<DonutProps, "startAngle" | "endAngle">;

export class Donut {
    private static normalizeAngles({ startAngle, endAngle }: Angles): Angles {
        const doublePI = 2 * Math.PI;
        return {
            startAngle: startAngle > doublePI
                ? startAngle - doublePI
                : startAngle < 0
                    ? startAngle + doublePI
                    : startAngle,
            endAngle: endAngle > doublePI
                ? endAngle - doublePI
                : endAngle < 0
                    ? endAngle + doublePI
                    : endAngle,
        };
    }

    private props: DonutProps;

    public constructor(props: DonutProps) {
        this.props = {
            ...props,
            ...Donut.normalizeAngles(props),
        };

        this.render({ startAngle: props.startAngle, endAngle: props.endAngle });
    }

    public render({ startAngle, endAngle }: Angles): void {
        const { ctx, center, outerRadius, innerRadius } = this.props;

        this.props = {
            ...this.props,
            ...Donut.normalizeAngles({ startAngle, endAngle }),
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

    public getProps () {
        return this.props;
    }

    public setColor(color: string): void {
        this.props = { ...this.props, color };
        this.render({ startAngle: this.props.startAngle, endAngle: this.props.endAngle });
    }

    public toggleClockwise(): void {
        this.props.clockWise = this.props.clockWise > 0 ? -1 : 1;
    }
}
