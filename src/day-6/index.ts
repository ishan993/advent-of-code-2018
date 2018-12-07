import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

export interface Coordinate {
  x: number;
  y: number;
}

export type Location = Coordinate;

function solveA(coordinates: Coordinate[]) {
  const xMax = _.maxBy(coordinates, 'x')!.x;
  const yMax = _.maxBy(coordinates, 'y')!.y;

  const limit = Math.max(xMax, yMax);
  const blacklisted = new Set();

  const recordKeeper: Record<string, number> = {};
  for (let x = 0; x <= limit; x++) {
    for (let y = 0; y <= limit; y++) {
        const point = findClosestCoordinate({ x, y }, coordinates);
      if (x === 0 || x === limit || y === 0 || y === limit) {
        blacklisted.add(point);
      } else if (point !== 'X') {
        recordKeeper[point] = (recordKeeper[point] || 0) + 1;
      }
    }
  }

  return Object.keys(recordKeeper)
    .reduce((acc: number[], c: string) => {
      if (blacklisted.has(c)) return acc;
      acc.push(recordKeeper[c]);

      return acc;
  }, []).sort((a, b) => b - a)[0];
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


function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(r => r)
    .map(i => {
      const [ x, y ] = i.split(', ');

      return { x: Number(x), y: Number(y) };
    });

  const ts1 = Date.now();
  console.log(`result1: ${ solveA(inputs)} in ${Date.now() - ts1} ms`);
}

main();