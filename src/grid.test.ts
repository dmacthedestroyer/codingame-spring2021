import { getAdjacent, getReachable } from "./grid";

describe("grid", () => {
  describe("getAdjacent", () => {
    it("excludes out-of-bounds", () => {
      expect(getAdjacent(19).length).toBe(3);
    });
    it("return empty when out-of-bounds", () => {
      expect(getAdjacent(999).length).toBe(0);
    });
  });

  describe("getReachable", () => {
    it.each([-1000, -1, 0])("should return 1 element when distance=%s", (distance: number) => {
      expect(getReachable(0, distance).length).toBe(1);
    });

    it.each([
      [1, 0, 0],
      [7, 0, 1],
      [19, 0, 2],
      [37, 0, 3],
      [9, 19, 2],
      [23, 17, 3],
      [7, 15, 1]
    ])(
      "should return %d cells for cellIndex=%d and distance %d",
      (expectedLength: number, cellIndex: number, distance: number) => {
        const actual = getReachable(cellIndex, distance);
        if (actual.length !== expectedLength) {
          actual.sort();
          console.log(actual);
        }
        expect(actual.length).toBe(expectedLength);
      }
    );
  });
});
