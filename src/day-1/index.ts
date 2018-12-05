import * as fs from 'fs';
import * as path from 'path';

function getFrequencies() {
  return fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').map(n => parseInt(n));
}

function solveA(frequencies: number[]) {
  let result = 0;
  for (const frequency of frequencies) {
    result += frequency;
  }

  return result;
}

function solveB(frequencies: number[]) {
  const map: Record<string, number> = {};
  map['0'] = 1;
  let result = 0;
  while (true) {
    for (const frequency of frequencies) {
      result += frequency;
      if (map[result]) return result;
      map[result] = 1;
    }
  }
}

function main() {
  const frequencies = getFrequencies();
  console.log('result1: ', solveA(frequencies));
  console.log('result2: ', solveB(frequencies));
}

main();