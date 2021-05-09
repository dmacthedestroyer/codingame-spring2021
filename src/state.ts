import { getReachable } from "./grid";
import { counter, toMap } from "./util";

export type Cell = {
  cellIndex: number;
  richness: number;
};

export type Tree = {
  cellIndex: number; // location of this tree
  size: number; // size of this tree: 0-3
  isMine: boolean; // 1 if this is your tree
  isDormant: boolean; // 1 if this tree is dormant
};

export type Turn = {
  day: number; // the game lasts 24 days: 0-23
  nutrients: number; // the base score you gain from the next COMPLETE action
  sun: number; // your sun points
  score: number; // your current score
  oppSun: number; // opponent's sun points
  oppScore: number; // opponent's score
  oppIsWaiting: boolean; // whether your opponent is asleep until the next day
  cells: Cell[];
  trees: Tree[];
};

export type Grow = {
  _type: "grow";
  cellIdx: number;
};
export type Seed = {
  _type: "seed";
  sourceIdx: number;
  targetIdx: number;
};
export type Complete = {
  _type: "complete";
  cellIdx: number;
};
export type Wait = { _type: "wait" };
export type Move = Grow | Seed | Complete | Wait;

export function calculateMyMoves(turn: Turn): Move[] {
  const moves: Move[] = [];

  const myTrees = turn.trees.filter((tree) => tree.isMine);
  const treesByCellIndex = toMap(turn.trees, (tree) => tree.cellIndex);
  // SEED moves
  const seedableTrees = myTrees.filter(
    (tree) => !tree.isDormant && tree.size > 0
  );
  const seedCount = myTrees.filter((tree) => tree.size === 0).length;
  if (seedCount <= turn.sun) {
    seedableTrees.forEach((tree) => {
      const reachableCells = getReachable(tree.cellIndex, tree.size);
      for (const targetIdx of reachableCells) {
        if (
          turn.cells[targetIdx].richness > 0 &&
          !treesByCellIndex.has(targetIdx)
        ) {
          moves.push({
            _type: "seed",
            sourceIdx: tree.cellIndex,
            targetIdx,
          });
        }
      }
    });
  }

  // GROW moves
  const treeCountsBySize = counter(myTrees.map((t) => t.size));
  const growableTrees = myTrees.filter((tree) => !tree.isDormant);
  for (const tree of growableTrees) {
    let growCost: number;
    switch (tree.size) {
      // Growing a seed into a size 1 tree costs 1 sun point + the number of size 1 trees you already own.
      case 0:
        growCost = 1 + (treeCountsBySize.get(1) ?? 0);
        break;
      // Growing a size 1 tree into a size 2 tree costs 3 sun points + the number of size 2 trees you already own.
      case 1:
        growCost = 3 + (treeCountsBySize.get(2) ?? 0);
        break;
      // Growing a size 2 tree into a size 3 tree costs 7 sun points + the number of size 3 trees you already own.
      case 2:
        growCost = 7 + (treeCountsBySize.get(3) ?? 0);
        break;
      // any other size is invalid
      default:
        growCost = Number.MAX_VALUE;
        break;
    }
    if (growCost <= turn.sun) {
      moves.push({ _type: "grow", cellIdx: tree.cellIndex });
    }
  }

  // COMPLETE moves
  if (turn.sun >= 4) {
    const completableTrees = myTrees.filter(
      (tree) => tree.size === 3 && !tree.isDormant
    );
    for (const tree of completableTrees) {
      moves.push({ _type: "complete", cellIdx: tree.cellIndex });
    }
  }

  // WAIT moves
  moves.push({ _type: "wait" });

  return moves;
}
