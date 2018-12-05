import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

function getClosestString(inputs: string[]) {
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

const testInputs = `
abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
`.split('\n').filter(s => s);

expect(getClosestString(testInputs)).to.equal('fgij');

const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(s => s);
console.log('result: ', getClosestString(inputs));
