export interface Coords {
    x: number;
    y: number;
}

export type ClockWise = -1 | 1;

export interface DonutState {
    coords: Coords,
    border: number,
    margin: number,
    color: string;
    outerRadius: number,
    innerRadius: number,
    startAngle: number;
    endAngle: number;
    segmentAngle: number;
    clockwise: ClockWise;
    rotationAngle: number;
    center: Coords;
}
