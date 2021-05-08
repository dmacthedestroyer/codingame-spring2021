import { getReachable } from "./grid";

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
  const treesByCellIndex = turn.trees.reduce((arr, tree) => {
    arr[tree.cellIndex] = tree;
    return arr;
  }, new Array<Tree>());
  // seed moves
  const seedableTrees = turn.trees.filter(tree => tree.isMine && !tree.isDormant && tree.size > 0);
  const seedCount = turn.trees.filter(tree => tree.isMine && tree.size === 0).length;
  if (seedCount <= turn.sun) {
    seedableTrees.forEach(tree => {
      const reachableCells = getReachable(tree.cellIndex, tree.size);
      for (const targetIdx of reachableCells) {
        if (turn.cells[targetIdx].richness > 0 && treesByCellIndex[targetIdx] === undefined) {
          moves.push({
            _type: "seed",
            sourceIdx: tree.cellIndex,
            targetIdx
          });
        }
      }
    });
  }

  return moves;
}
