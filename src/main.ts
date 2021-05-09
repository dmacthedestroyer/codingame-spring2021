import { calculateMyMoves, Cell, Move, Tree, Turn } from "./state";

export function run() {
  const numberOfCells: number = parseInt(readline()); // 37
  const cells: Cell[] = [];
  for (let i = 0; i < numberOfCells; i++) {
    var inputs: string[] = readline().split(" ");
    const index: number = parseInt(inputs[0]); // 0 is the center cell, the next cells spiral outwards
    const richness: number = parseInt(inputs[1]); // 0 if the cell is unusable, 1-3 for usable cells
    const neigh0: number = parseInt(inputs[2]); // the index of the neighbouring cell for each direction
    const neigh1: number = parseInt(inputs[3]);
    const neigh2: number = parseInt(inputs[4]);
    const neigh3: number = parseInt(inputs[5]);
    const neigh4: number = parseInt(inputs[6]);
    const neigh5: number = parseInt(inputs[7]);
    cells.push({ cellIndex: index, richness });
  }

  // game loop
  while (true) {
    const [turn, possibleMoves] = readState(cells);
    // const chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)] ?? 'WAIT'
    const chosenMove = possibleMoves.find((m) => m !== "WAIT") ?? "WAIT";

    const actualMoves = possibleMoves.filter(
      (m) => m.indexOf("SEED") >= 0 || m.indexOf("GROW") >= 0
    );
    const calculatedMoves = calculateMyMoves(turn)
      .filter((m) => m._type === "seed" || m._type === "grow")
      .map(moveString);
    if (actualMoves.length !== calculatedMoves.length) {
      printErr(turn);
      const [calculatedDiff, actualDiff] = differences(
        calculatedMoves,
        actualMoves
      );
      calculatedDiff.sort();
      actualDiff.sort();
      printErr({
        calculated: {
          count: calculatedMoves.length,
          diff: calculatedDiff,
          all: calculatedMoves,
        },
        actual: {
          count: actualMoves.length,
          diff: actualDiff,
          all: actualMoves,
        },
      });
    }

    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    // GROW cellIdx | SEED sourceIdx targetIdx | COMPLETE cellIdx | WAIT <message>
    console.log(chosenMove);
  }
}

function readState(cells: Cell[]): [Turn, string[]] {
  const day: number = parseInt(readline()); // the game lasts 24 days: 0-23
  const nutrients: number = parseInt(readline()); // the base score you gain from the next COMPLETE action
  var inputs: string[] = readline().split(" ");
  const sun: number = parseInt(inputs[0]); // your sun points
  const score: number = parseInt(inputs[1]); // your current score
  var inputs: string[] = readline().split(" ");
  const oppSun: number = parseInt(inputs[0]); // opponent's sun points
  const oppScore: number = parseInt(inputs[1]); // opponent's score
  const oppIsWaiting: boolean = inputs[2] !== "0"; // whether your opponent is asleep until the next day
  const numberOfTrees: number = parseInt(readline()); // the current amount of trees
  const trees: Tree[] = [];
  for (let i = 0; i < numberOfTrees; i++) {
    var inputs: string[] = readline().split(" ");
    const cellIndex: number = parseInt(inputs[0]); // location of this tree
    const size: number = parseInt(inputs[1]); // size of this tree: 0-3
    const isMine: boolean = inputs[2] !== "0"; // 1 if this is your tree
    const isDormant: boolean = inputs[3] !== "0"; // 1 if this tree is dormant
    trees.push({
      cellIndex,
      size,
      isMine,
      isDormant,
    });
  }

  const numberOfPossibleMoves: number = parseInt(readline());
  const possibleMoves: string[] = [];
  for (let i = 0; i < numberOfPossibleMoves; i++) {
    const possibleMove: string = readline();
    possibleMoves.push(possibleMove);
  }

  const turn: Turn = {
    day,
    nutrients,
    sun,
    score,
    oppSun,
    oppScore,
    oppIsWaiting,
    cells,
    trees,
  };

  return [turn, possibleMoves];
}
function moveString(move: Move): string {
  switch (move._type) {
    case "complete":
      return `COMPLETE ${move.cellIdx}`;
    case "grow":
      return `GROW ${move.cellIdx}`;
    case "seed":
      return `SEED ${move.sourceIdx} ${move.targetIdx}`;
    case "wait":
      return "WAIT";
  }
}

function differences<T>(s1: T[], s2: T[]): [T[], T[]] {
  return [
    s1.filter((t1) => !s2.find((t2) => t1 === t2)),
    s2.filter((t2) => !s1.find((t1) => t2 === t1)),
  ];
}
