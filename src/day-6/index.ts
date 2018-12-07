import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

export interface Coordinate {
  x: number;
  y: number;
}

export type Location = Coordinate;

async function solveA(coordinates: Coordinate[]) {
  const xMax = _.maxBy(coordinates, 'x')!.x;
  const yMax = _.maxBy(coordinates, 'y')!.y;

  const limit = Math.max(xMax, yMax);
  const grid: string[][] = [];
  for (let x = 0; x <= limit; x++) {
    for (let y = 0; y <= limit; y++) {
      if (!grid[y]) grid[y] = [];
      grid[y][x] = findClosestCoordinate({ x, y }, coordinates);
    }
  }

  const recordKeeper: Record<string, number> = {};
  for (const coordinate of coordinates) {
    const key = `${coordinate.x}-${coordinate.y}`;
    recordKeeper[key] = 0;
  }

  await recursivelyExplore(0, 0, grid, recordKeeper);
  return _.values(recordKeeper).sort((a: number, b: number) => b - a)[0];
}

async function recursivelyExplore(x: number, y: number, grid: string[][], recordKeeper: Record<string, number>) {
  if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return;

  const point = grid[x][y];
  if (point === '-1') return;
  grid[x][y] = '-1';

  if (x - 1 < 0 || x + 1 >= grid[0].length || y - 1 < 0 || y + 1 >= grid.length) {
    delete recordKeeper[point];
  } else if (recordKeeper.hasOwnProperty(point)) {
    recordKeeper[point] = recordKeeper[point] + 1;
  }

  await recursivelyExplore(x - 1, y, grid, recordKeeper);
  await recursivelyExplore(x + 1, y, grid, recordKeeper);

  await recursivelyExplore(x, y - 1, grid, recordKeeper);
  await recursivelyExplore(x, y + 1, grid, recordKeeper);

  await recursivelyExplore(x - 1, y - 1, grid, recordKeeper);
  await recursivelyExplore(x - 1, y + 1, grid, recordKeeper);
  await recursivelyExplore(x + 1, y - 1, grid, recordKeeper);
  await recursivelyExplore(x + 1, y + 1, grid, recordKeeper);
}

function findClosestCoordinate(location: Location, coordinates: Coordinate[]) {
  const result: { coord: string, dist: number }[] = [];
  for (const coordinate of coordinates) {
    const { x, y } = coordinate;
    const dist = Math.abs(location.x - x) + Math.abs(location.y - y);
    result.push({ coord: `${x}-${y}`, dist });
  }

  const minDist = _.minBy(result, 'dist')!;
  return result.filter(r => r.dist === minDist.dist).length === 1 ? minDist.coord : 'X';
}


async function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(r => r)
    .map(i => {
      const [ x, y ] = i.split(', ');

      return { x: Number(x), y: Number(y) };
    });

  const ts1 = Date.now();
  console.log(`result1: ${ await solveA(inputs)} in ${Date.now() - ts1} ms`);
}

main();