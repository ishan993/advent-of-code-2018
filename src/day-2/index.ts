import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

function solveA(inputs: string[]) {
  let twoCount = 0;
  let threeCount = 0;
  for (const input of inputs) {
    let localTwoCount = 0;
    let localThreeCount = 0;
    const map: Record<string, number> = {};
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      map[char] = (map[char] || 0) + 1;
    }

    for (const key in map) {
      if (map[key] === 2) localTwoCount++;
      if (map[key] === 3) localThreeCount++;
    }

    if (localTwoCount) twoCount++;
    if (localThreeCount) threeCount++;
  }

  return twoCount * threeCount;
}

function solveB(inputs: string[]) {
  for (const first of inputs) {
    for (const second of inputs) {
      if (first === second) continue;
      let diffCount = 0;
      let diffIndex = -1;
      for (let i = 0; i < first.length; i++) {
        if (diffCount > 1) break;
        if (first[i] === second[i]) continue;
        diffCount++;
        diffIndex = i;
      }

      if (diffCount === 1) {
        return first.substr(0, diffIndex) + first.substr(diffIndex + 1);
      }
    }
  }

  throw new Error('Could not find the answer');
}

function main() {
  const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(s => s);

  console.log('result1: ', solveA(inputs));
  console.log('result2: ', solveB(inputs));
}

main();