import {getFrequencies} from "./utilts";

function calculateResultingFrequency(frequencies: number[]) {
  let result = 0;
  for (const frequency of frequencies) {
    result += frequency;
  }

  return result;
}

const frequencies = getFrequencies();
console.log('result: ', calculateResultingFrequency(frequencies));