import * as fs from 'fs';
import * as path from 'path';

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

export interface Claim {
  id: string;

  x: number;
  y: number;

  height: number;
  width: number;
}

function solveA(claims: Claim[]) {
  let count = 0;
  const grid: number[][] = [];
  for (const claim of claims) {
    for (let i = claim.x; i <= claim.x + (claim.width - 1); i++) {
      for (let j = claim.y; j <= claim.y + (claim.height - 1); j++) {
        if (!grid[i]) grid[i] = [];
        grid[i][j] = (grid[i][j] || 0) + 1;
      }
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < (grid[i] || []).length; j++) {
      if (grid[i][j] > 1) count++;
    }
  }
  return count;
}

function solveB(positions: Claim[]) {
  const pointToIdMap: Record<string, string[]> = {};
  const blacklisted = new Set();
  for (const position of positions) {
    for (let i = position.x; i <= position.x + (position.width - 1); i++) {
      for (let j = position.y; j <= position.y + (position.height - 1); j++) {
        const key = `${i}-${j}`;
        pointToIdMap[key] = (pointToIdMap[key] || []);
        if (!pointToIdMap[key].includes(position.id)) {
          pointToIdMap[key].push(position.id);
          if (pointToIdMap[key].length > 1) {
            if (pointToIdMap[key].length === 2) {
              blacklisted.add(pointToIdMap[key][0]);
            }

            blacklisted.add(position.id);
          }
        }
      }
    }
  }

  for (const key in pointToIdMap) {
    if (pointToIdMap[key].length === 1 && !blacklisted.has(pointToIdMap[key][0])) return pointToIdMap[key][0];
  }

  throw new Error('All claims overlap');
}

function main() {
  const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(r => r);
  const claims = inputs.map(transformer);

  console.log('result: ', solveA(claims));
  console.log('result2: ', solveB(claims));
}

main();