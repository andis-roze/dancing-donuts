import { ClockWise, Coords } from "./common/types";

function mapValueToInterval(
    val: number,
    fromStart: number,
    fromEnd: number,
    toStart: number,
    toEnd: number
): number {
    return (val - fromStart) * (toEnd - toStart) / (fromEnd - fromStart) + toStart;
}

export function splitHexColor(color: string): number[] {
    const intColors = [
        parseInt(color.substring(1, 3), 16),
        parseInt(color.substring(3, 5), 16),
        parseInt(color.substring(5), 16),
    ];

    return intColors.map(color => mapValueToInterval(color, 0, 255, 0, 1));
}

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

export function reduceAngle(angle: number): number {
    return angle % (2 * Math.PI);
}

export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandomDirection(): ClockWise {
    return getRandomArbitrary(-1, 1) >= 0 ? 1 : -1;
}

export function isPowerOf2(value: number) {
    // tslint:disable no-bitwise
    return (value & (value - 1)) === 0;
}

export const m3 = {
    identity: (): number[] => {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },

    projection: (width: number, height: number): number[] => {
        return [
            2.0 / width,  0.0,          0.0,
            0.0,         -2.0 / height, 0.0,
            -1.0,         1.0,          1.0
        ];
    },

    translation: (tx: number, ty: number): number[] => {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },

    rotation: (angleInRadians: number): number[] => {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        return [
            c, -s, 0,
            s,  c, 0,
            0,  0, 1,
        ];
    },

    scaling: (sx: number, sy: number): number[] => {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0,  1,
        ];
    },

    multiply: (a: number[], b: number[]): number[] => {
        const a00 = a[0 * 3 + 0];
        const a01 = a[0 * 3 + 1];
        const a02 = a[0 * 3 + 2];
        const a10 = a[1 * 3 + 0];
        const a11 = a[1 * 3 + 1];
        const a12 = a[1 * 3 + 2];
        const a20 = a[2 * 3 + 0];
        const a21 = a[2 * 3 + 1];
        const a22 = a[2 * 3 + 2];
        const b00 = b[0 * 3 + 0];
        const b01 = b[0 * 3 + 1];
        const b02 = b[0 * 3 + 2];
        const b10 = b[1 * 3 + 0];
        const b11 = b[1 * 3 + 1];
        const b12 = b[1 * 3 + 2];
        const b20 = b[2 * 3 + 0];
        const b21 = b[2 * 3 + 1];
        const b22 = b[2 * 3 + 2];

        return [
          b00 * a00 + b01 * a10 + b02 * a20,
          b00 * a01 + b01 * a11 + b02 * a21,
          b00 * a02 + b01 * a12 + b02 * a22,
          b10 * a00 + b11 * a10 + b12 * a20,
          b10 * a01 + b11 * a11 + b12 * a21,
          b10 * a02 + b11 * a12 + b12 * a22,
          b20 * a00 + b21 * a10 + b22 * a20,
          b20 * a01 + b21 * a11 + b22 * a21,
          b20 * a02 + b21 * a12 + b22 * a22,
        ];
      }
};
