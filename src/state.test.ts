import { Turn, calculateMyMoves, Move, Grow } from "./state";
import { seed155 } from "./testData";

describe("calculateMyMoves", () => {
  describe("seed155.json", () => {
    it("should have 'SEED 15 5'", () => {
      const seedMoves = calculateMyMoves(seed155).filter(
        (move) => move._type === "seed"
      );
      const actual = seedMoves.find(
        (move) =>
          move._type === "seed" && move.sourceIdx === 15 && move.targetIdx === 5
      );
      expect(seedMoves.length).toBe(17);
      expect(actual).not.toBeNull();
    });
  });
  describe("GROW", () => {
    function isGrow(move: Move): move is Grow {
      return move._type === "grow";
    }
    const cases = [
      { filename: "./testData/grow.json", expected: [22, 34, 35] },
      { filename: "./testData/grow2.json", expected: [10, 20, 23] },
      { filename: "./testData/grow3.json", expected: [20, 23] },
    ];

    it.each(
      cases.flatMap(({ filename, expected }) =>
        expected.map((i) => [filename, i])
      )
    )("%s should have 'GROW %i'", (dataFile, expected) => {
      const state: Turn = require(dataFile);
      const actual = calculateMyMoves(state)
        .filter(isGrow)
        .map((grow) => grow.cellIdx);
      expect(actual).toContain(expected);
    });
  });
});
