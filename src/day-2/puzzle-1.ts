import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

function calculateChecksum(inputs: string[]) {
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

const testInput = `
abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
`.split('\n').filter(s => s);

const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(s => s);

expect(calculateChecksum(testInput)).to.equal(12);
console.log('result: ', calculateChecksum(inputs));
