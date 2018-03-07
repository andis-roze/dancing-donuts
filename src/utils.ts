import { Coords } from "./types";

export function getRandomColor() {
    const digits = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += digits[Math.floor(Math.random() * 16)];
    }

    return color;
}

export function getAngle(center: Coords, point: Coords) {
    return Math.atan2(point.y - center.y, point.x - center.x);
}

export function atan2Arc(angle: number): number {
    return angle < 0 ? 2 * Math.PI + angle : angle;
}

export function getDistance(p1: Coords, p2: Coords): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function reduceAngle(angle: number, decimals = 1): number {
    const doublePI = 2 * Math.PI;
    return Math.round(
        10 ** decimals * (
            angle > doublePI
                ? angle - doublePI
                : angle < 0
                    ? angle + doublePI
                    : angle
        )
    ) / 10 ** decimals;
}
