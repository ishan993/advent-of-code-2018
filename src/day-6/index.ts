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
      const point = findClosestCoordinate({x, y}, coordinates);
      if (x === 0 || x === limit || y === 0 || y === limit) {
        blacklisted.add(point);
        delete recordKeeper[point];
      } else if (point !== 'X') {
        recordKeeper[point] = (recordKeeper[point] || 0) + 1;
      }
    }
  }

  let highest = -1;
  for (const key in recordKeeper) {
    const val = recordKeeper[key];
    if (val > highest && !blacklisted.has(key)) highest = val;
  }

  return highest;
}

function findClosestCoordinate(location: Location, coordinates: Coordinate[]) {
  let minDist = Number.POSITIVE_INFINITY;
  let minDistCoords = null;
  let secondMinDist = Number.POSITIVE_INFINITY;

  for (const coordinate of coordinates) {
    const { x, y } = coordinate;
    const dist = Math.abs(location.x - x) + Math.abs(location.y - y);

    if (dist === minDist) {
      secondMinDist = dist;
    } else if (dist < minDist) {
      minDist = dist;
      minDistCoords = coordinate;
    }
  }

  return minDist === secondMinDist ? 'X' : `${minDistCoords!.x}-${minDistCoords!.y}`;
}

function solveB(coordinates: Coordinate[]) {
  const xMax = _.maxBy(coordinates, 'x')!.x;
  const yMax = _.maxBy(coordinates, 'y')!.y;
  let count = 0;

  const limit = Math.max(xMax, yMax);
  const maxDistance = 10000;
  for (let x = 0; x <= limit; x++) {
    for (let y = 0; y <= limit; y++) {
      let totalDist = 0;
      for (const coord of coordinates) {
        const { x: xCoord, y: yCoord } = coord;
        const dist = Math.abs(x - xCoord) + Math.abs(y - yCoord);
        totalDist += dist;
      }
      if (totalDist < maxDistance) count++;
    }
  }

  return count;
}

function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map(i => {
      const [ x, y ] = i.split(', ');

      return { x: Number(x), y: Number(y) };
    });

  console.log(`result1: ${ solveA(inputs)}`);
  console.log(`result1: ${ solveB(inputs)}`);
}

main();