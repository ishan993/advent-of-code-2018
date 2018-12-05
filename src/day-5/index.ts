import * as fs from 'fs';
import * as path from 'path';

function solveA(str: string) {
  const result: string[] = [];
  for (let start = 0; start < str.length; start++) {
    const prev = result.pop();
    const curr = str.charAt(start);
    if (!prev) {
      result.push(curr);
      continue;
    }
    
    if (prev !== curr && prev.toLowerCase() === curr.toLowerCase()) continue;
    result.push(prev);
    result.push(curr);
  }

  return result.length;
}

function solveB(str: string) {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowestCount = Number.POSITIVE_INFINITY;
  for (const alphabet of alphabets) {
    let regex = new RegExp(alphabet, 'ig');
    let localStr = str.replace(regex, '');

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