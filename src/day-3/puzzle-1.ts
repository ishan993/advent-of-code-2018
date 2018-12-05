import * as fs from 'fs';
import * as path from 'path';

const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(r => r);
// @ts-ignore
const positions = inputs.map(transformer);

function transformer(i: string) {
  const id =  i.match(/#\d*\s/)![0].replace(/[#\s]/g, '');

  const xy = i.match(/@\s.*:/)![0].replace(/[@\s:]/g, '');
  const x = Number(xy.split(',')[0]);
  const y = Number(xy.split(',')[1]);

  const heightWidth = i.match(/(\d*)x\d*/)![0];
  const height = Number(heightWidth.split('x')[1]);
  const width = Number(heightWidth.split('x')[0]);

  return { i, id, x, y, height, width };
}

export interface Position {
  id: string;

  x: number;
  y: number;

  height: number;
  width: number;
}

function findOverlappingRectangles(positions: Position[]) {
  let count = 0;
  const section: number[][] = [];
  for (const position of positions) {
    for (let i = position.x; i <= position.x + (position.width - 1); i++) {
      for (let j = position.y; j <= position.y + (position.height - 1); j++) {
        if (!section[i]) section[i] = [];
        section[i][j] = (section[i][j] || 0) + 1;
      }
    }
  }

  for (let i = 0; i < section.length; i++) {
    for (let j = 0; j < (section[i] || []).length; j++) {
      if (section[i][j] > 1) count++;
    }
  }
  return count;
}

function findNonOverlapping(positions: Position[]) {
  const map: Record<string, string[]> = {};
  const blacklisted = new Set();
  for (const position of positions) {
    for (let i = position.x; i <= position.x + (position.width - 1); i++) {
      for (let j = position.y; j <= position.y + (position.height - 1); j++) {
        const key = `${i}-${j}`;
        map[key] = (map[key] || []);
        if (!map[key].includes(position.id)) {
          map[key].push(position.id);
          if (map[key].length > 1) {
            map[key].forEach(r => blacklisted.add(r));
          }
        }
      }
    }
  }

  for (const key in map) {
    if (map[key].length === 1 && !blacklisted.has(map[key][0])) return map[key][0];
  }

  throw new Error('All positions overlap');
}

// const test = `
// #1 @ 1,3: 4x4
// #2 @ 3,1: 4x4
// #3 @ 5,5: 2x2
// `.split('\n').filter(r => r).map(transformer);

console.log('result: ', findOverlappingRectangles(positions));
console.log('result2: ', findNonOverlapping(positions));