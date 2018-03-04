import { ClockWise, Coords } from "./types";
import { reduceAngle } from "./utils";

export interface DonutProps {
    clockWise: ClockWise;
    startAngle: number;
    endAngle: number;
    color: string;
    center: Coords;
    innerRadius: number;
    outerRadius: number;
}

type Angles = Pick<DonutProps, "startAngle" | "endAngle">;

export class Donut {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private props: DonutProps;

    public constructor(props: DonutProps) {
        const { startAngle, endAngle } = props;
        this.props = props;
        this.updateAngles({ startAngle, endAngle });
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("width", `${2 * props.outerRadius}`);
        this.canvas.setAttribute("height", `${2 * props.outerRadius}`);

        this.initialRender({ startAngle: props.startAngle, endAngle: props.endAngle });
    }

    public rotate(angle: number) {
        if (this.ctx) {
            this.updateAngles({
                startAngle: this.props.startAngle + angle,
                endAngle: this.props.endAngle + angle
            });

            this.ctx.save();
            this.ctx.translate(this.props.center.x, this.props.center.y);
            this.ctx.rotate(angle);
            this.ctx.restore();
        }
    }

    public getProps(): DonutProps & { canvas: HTMLCanvasElement } {
        return {
            ...this.props,
            canvas: this.canvas,
        };
    }

    public setColor(color: string): void {
        this.props = { ...this.props, color };
    }

    public toggleClockwise(): void {
        this.props.clockWise = this.props.clockWise > 0 ? -1 : 1;
    }

    private initialRender({ startAngle, endAngle }: Angles): void {
        const { center, outerRadius, innerRadius } = this.props;

        this.updateAngles({ startAngle, endAngle });

        if (this.ctx) {
            this.ctx.strokeStyle = "black";
            this.ctx.fillStyle = this.props.color;
            this.ctx.beginPath();
            this.ctx.arc(center.x, center.y, outerRadius, startAngle, endAngle, false); // Outer: counter clockwise
            this.ctx.arc(center.x, center.y, innerRadius, endAngle, startAngle, true); // Inner: clockwise
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    private updateAngles({ startAngle, endAngle }: Angles): void {
        this.props = {
            ...this.props,
            startAngle: reduceAngle(startAngle),
            endAngle: reduceAngle(endAngle),
        };
    }
}
