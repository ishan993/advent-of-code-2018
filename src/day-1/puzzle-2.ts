import {getFrequencies} from "./utilts";

function findDuplicateFrequency(frequencies: number[]) {
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

const frequencies = getFrequencies();
console.log('result: ', findDuplicateFrequency(frequencies));