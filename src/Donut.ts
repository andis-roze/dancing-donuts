import { ClockWise, Coords } from "./types";
import { reduceAngle } from "./utils";

interface DonutProps {
    clockWise: ClockWise;
    startAngle: number;
    endAngle: number;
    rotationAngle: number;
    color: string;
    ctx: CanvasRenderingContext2D | null;
    center: Coords;
    innerRadius: number;
    outerRadius: number;
}

type Angles = Pick<DonutProps, "startAngle" | "endAngle">;

export class Donut {
    private props: DonutProps;
    private image: HTMLCanvasElement;
    private imageCtx: CanvasRenderingContext2D | null;

    public constructor(props: DonutProps) {
        this.props = {
            ...props,
            startAngle: reduceAngle(props.startAngle),
            endAngle: reduceAngle(props.endAngle),
            rotationAngle: reduceAngle(props.rotationAngle),
        };

        this.image = document.createElement("canvas");
        this.image.setAttribute("width", `${2 * props.outerRadius}`);
        this.image.setAttribute("height", `${2 * props.outerRadius}`);
        this.imageCtx = this.image.getContext("2d");
        this.initialRender({ startAngle: props.startAngle, endAngle: props.endAngle });
    }

    public rotate(angleDelta: number): void {
        this.props.rotationAngle += angleDelta;

        if (this.props.ctx) {
            this.props.ctx.save();
            this.props.ctx.translate(this.props.center.x, this.props.center.y);
            this.props.ctx.rotate(this.props.rotationAngle);
            this.props.ctx.drawImage(
                this.image,
                0,
                0,
                2 * this.props.outerRadius,
                2 * this.props.outerRadius,
                this.props.center.x - this.props.outerRadius,
                this.props.center.y - this.props.outerRadius,
                2 * this.props.outerRadius,
                2 * this.props.outerRadius
            );
            this.props.ctx.restore();
        }
    }

    public getProps () {
        return this.props;
    }

    public setColor(color: string): void {
        this.props = { ...this.props, color };
    }

    public toggleClockwise(): void {
        this.props.clockWise = this.props.clockWise > 0 ? -1 : 1;
    }

    private initialRender({ startAngle, endAngle }: Angles): void {
        const ctx = this.imageCtx;
        const { center, outerRadius, innerRadius } = this.props;

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
}
