import { calculateMyMoves } from "./state";
import { seed155 } from "./testData";

describe("calculateMyMoves", () => {
  describe("examples", () => {
    it("should have 'SEED 15 5'", () => {
      const seedMoves = calculateMyMoves(seed155).filter(move => move._type === "seed");
      const actual = seedMoves.find(move => move._type === "seed" && move.sourceIdx === 15 && move.targetIdx === 5);
      expect(seedMoves.length).toBe(17);
      expect(actual).not.toBeNull();
    });
  });
});
