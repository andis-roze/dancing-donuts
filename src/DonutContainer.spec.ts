import { DonutContainer } from "./DonutContainer";

describe("DonutContainer", () => {
    const getMouseClickEvent = ({ pageX, pageY } : { pageX: number, pageY: number }) => {
        const clickEvent = new MouseEvent("click");
        Object.defineProperties(clickEvent, {
            pageX: {
                value: pageX,
            },
            pageY: {
                value: pageY,
            },
        });
        return clickEvent;
    };
    let canvas: HTMLCanvasElement;
    let donutContainer: DonutContainer;

    beforeEach(() => {
        canvas = document.createElement("canvas");
    });

    describe("When donut slice is less than 180 degrees", () => {
        describe("both angles are above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                    startAngle: Math.PI + 0.1,
                    endAngle: 2 * Math.PI - 0.1,
                });
            });

            it("should detect click inside visible part of donut", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 10, pageY: 10 }));
                expect(donutContainer.lastDonutHit).toBeDefined();

                if (donutContainer.lastDonutHit) {
                    const newProps = donutContainer.lastDonutHit.donut.getProps();
                    expect(newProps.clockWise).toEqual(-1);
                    expect(newProps.color).not.toEqual(initialProps.color);
                }
            });

            it("should ignore click outside outer radius", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 1, pageY: 22.6 }));
                expect(donutContainer.lastDonutHit).toBeUndefined();
            });

            it("should ignore click inside inner radius", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 15.3, pageY: 22.6 }));
                expect(donutContainer.lastDonutHit).toBeUndefined();
            });
        });

        describe("start angle is above x axis and end angle is on x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                    startAngle: Math.PI + 1.01,
                    endAngle: 2 * Math.PI,
                });
            });

            it("should detect click inside visible part of donut", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 49.9, pageY: 24.9 }));
                expect(donutContainer.lastDonutHit).toBeDefined();

                if (donutContainer.lastDonutHit) {
                    const newProps = donutContainer.lastDonutHit.donut.getProps();
                    expect(newProps.clockWise).toEqual(-1);
                    expect(newProps.color).not.toEqual(initialProps.color);
                }
            });

            it("should ignore click outside outer radius", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 50, pageY: 25 }));
                expect(donutContainer.lastDonutHit).toBeUndefined();
            });

            it("should ignore click inside inner radius", () => {
                const initialProps = donutContainer.donuts[0][0].getProps();
                expect(initialProps.clockWise).toEqual(1);
                expect(donutContainer.lastDonutHit).toBeUndefined();
                canvas.dispatchEvent(getMouseClickEvent({ pageX: 34.7, pageY: 22.6 }));
                expect(donutContainer.lastDonutHit).toBeUndefined();
            });
        });

        describe("start angle is above x axis and end angle is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                    startAngle: Math.PI + 1.01,
                    endAngle: 2 * Math.PI + 0.99,
                });
            });

            it("should detect click", () => {});
        });

        describe("start angle is on x axis and end angle is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is below x axis and end angle is on x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is below x axis and end angle is above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is on x axis and end angle is above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });
    });

    describe("When donut slice is equal to 180 degrees", () => {
        describe("both angles are on x axis, donut is above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is above x axis and end angle is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are on x axis, donut is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is below x axis and end angle is above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });
    });

    describe("When donut slice is greater than 180 degrees", () => {
        describe("both angles are below x axis, donut is above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        }
    );

        describe("start angle is on x axis, end angle is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is above x axis, end angle is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is above x axis, end angle is on x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are above x axis, donut is below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("start angle is below x axis, end angle is on x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });
    });

    describe("When donut slice is equal to 360 degrees", () => {
        describe("both angles are above x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are on x axis (right)", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are below x axis", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });

        describe("both angles are on x axis (left)", () => {
            beforeEach(() => {
                donutContainer = new DonutContainer(canvas, {
                    donutCountX: 2,
                    donutCountY: 2,
                });
            });

            it("should detect click", () => {});

            it("should ignore click", () => {});
        });
    });
});
