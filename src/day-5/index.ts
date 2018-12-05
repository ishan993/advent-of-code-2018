import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

function solveA(str: string) {
  const result: string[] = [];
  let start = 0;
  while (str.charAt(start)) {
    const prev = result.pop();
    const curr = str.charAt(start);

    if (prev !== curr && (prev || '').toLowerCase() === curr.toLowerCase()) {
      start++;
      continue;
    } else {
      if (prev) result.push(prev);
      result.push(curr);
      start++;
    }
  }

  return result.join('').length;
}

function solveB(str: string) {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowestCount = 9999999999;
  for (const alphabet of alphabets) {
    console.log(alphabet);
    let regex = new RegExp(alphabet.toUpperCase(), 'g');
    let localStr = str.replace(regex, '');

    regex = new RegExp(alphabet.toLowerCase(), 'g');
    localStr = localStr.replace(regex, '');

    const charCount = solveA(localStr);
    if (charCount < lowestCount) {
      lowestCount = charCount;
    }
  }

  return lowestCount;
}

function main() {
  const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim();
  console.log('result1: ', solveA(input));
  console.log('result2: ', solveB(input));
}

main();