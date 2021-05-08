const gridAdjacencies: Array<[
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null
]> = [
  [1, 2, 3, 4, 5, 6],
  [7, 8, 2, 0, 6, 18],
  [8, 9, 10, 3, 0, 1],
  [2, 10, 11, 12, 4, 0],
  [0, 3, 12, 13, 14, 5],
  [6, 0, 4, 14, 15, 16],
  [18, 1, 0, 5, 16, 17],
  [19, 20, 8, 1, 18, 36],
  [20, 21, 9, 2, 1, 7],
  [21, 22, 23, 10, 2, 8],
  [9, 23, 24, 11, 3, 2],
  [10, 24, 25, 26, 12, 3],
  [3, 11, 26, 27, 13, 4],
  [4, 12, 27, 28, 29, 14],
  [5, 4, 13, 29, 30, 15],
  [16, 5, 14, 30, 31, 32],
  [17, 6, 5, 15, 32, 33],
  [35, 18, 6, 16, 33, 34],
  [36, 7, 1, 6, 17, 35],
  [null, null, 20, 7, 36, null],
  [null, null, 21, 8, 7, 19],
  [null, null, 22, 9, 8, 20],
  [null, null, null, 23, 9, 21],
  [22, null, null, 24, 10, 9],
  [23, null, null, 25, 11, 10],
  [24, null, null, null, 26, 11],
  [11, 25, null, null, 27, 12],
  [12, 26, null, null, 28, 13],
  [13, 27, null, null, null, 29],
  [14, 13, 28, null, null, 30],
  [15, 14, 29, null, null, 31],
  [32, 15, 30, null, null, null],
  [33, 16, 15, 31, null, null],
  [34, 17, 16, 32, null, null],
  [null, 35, 17, 33, null, null],
  [null, 36, 18, 17, 34, null],
  [null, 19, 7, 18, 35, null]
];

export function getAdjacent(cellIndex: number): number[] {
  if (cellIndex >= gridAdjacencies.length) {
    return [];
  }
  return gridAdjacencies[cellIndex].filter(ix => ix !== null);
}

export function getReachable(cellIndex: number, distance: number): number[] {
  const queue: Array<{ index: number; distance: number }> = [{ index: cellIndex, distance }];
  const visited = new Set<number>();

  while (queue.length > 0) {
    const { index, distance } = queue.shift();
    if (!visited.has(index)) {
      visited.add(index);
      if (distance > 0) {
        for (const adjacentIndex of getAdjacent(index)) {
          queue.push({ index: adjacentIndex, distance: distance - 1 });
        }
      }
    }
  }

  return [...visited];
}
