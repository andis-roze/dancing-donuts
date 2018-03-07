import * as subject from "./utils";

describe("utils", () => {
    describe("normalizeAngle", () => {
        it("should reduce angle if it is greater than 2 * PI", () => {
                expect(subject.reduceAngle(2 * Math.PI + 0.1)).toBe(0.1);
        });

        it("should not reduce angle if it is equal to 2 * PI", () => {
            expect(subject.reduceAngle(2 * Math.PI)).toBe(6.3);
        });

        it("should not reduce angle if it is equal to 0", () => {
            expect(subject.reduceAngle(0)).toBe(0);
        });

        it("should increase angle if it is less than 0", () => {
            expect(subject.reduceAngle(-0.1)).toBe(6.2);
        });
    });
});
