import * as fs from 'fs';
import * as path from 'path';

function solveA(initialState: string, goodStates: string[]) {
  let currentState = initialState;
  const numPlants = initialState.length - 1;
  for (let i = 0; i < numPlants; i++) {
    currentState = '.' + currentState;
    currentState += '.';
  }

  for (let generation = 0; generation < 20; generation++) {
    let nextState = '';
    for (let i = 0; i < currentState.length; i++) {
      let charAtI = '.';
      const leftLeft = currentState.charAt(i - 2) || '';
      const left = currentState.charAt(i - 1) || '';
      const curr = currentState.charAt(i);
      const right = currentState.charAt(i + 1);
      const rightRight = currentState.charAt(i + 2);
      const str = leftLeft + left + curr + right + rightRight;
      if (goodStates.includes(str)) charAtI = '#';
      nextState += charAtI;
    }

    currentState = nextState;
  }

  let result = 0;
  let start = -numPlants;
  for (const plant of currentState.split('')) {
    if (plant === '#') result += start;
    start++;
  }

  return result;
}

function solveB(initialState: string, goodStates: string[]) {
  let lowestPlantIndex = 0;
  let highestPlantIndex = initialState.length - 1;

  let currentPlantsMap: Record<string, string> = {};
  for (let i = 0; i < initialState.length; i++) {
    currentPlantsMap[i] = initialState.charAt(i);
  }

  const goodStatesMap: Record<string, boolean> = goodStates.reduce((acc: Record<string, boolean>, c: string) => {
    acc[c] = true;
    return acc;
  }, {});

  let result = 0;
  let diff = -1;
  let repeating = false;
  for (let generation = 1; generation <= 50000000000; generation++) {
    if (repeating) { // After a certain year, we get linear growth
      result += (diff * (50000000000 - generation + 2));
      break;
    }

    const newResult = Object.keys(currentPlantsMap).reduce((acc: number, curr: string) => {
      if (currentPlantsMap[curr] === '#') acc += Number(curr);

      return acc;
    }, 0);

    const newDiff = newResult - result;
    if (diff === newDiff) {
      repeating = true;
    }

    result = newResult;
    diff = newDiff;

    let nextPlantsMap: Record<string, string> = {};
    for (let start = lowestPlantIndex - 2; start < highestPlantIndex + 2; start++) {
      let pattern = '';
      pattern += currentPlantsMap[start - 2] || '.';
      pattern += currentPlantsMap[start - 1] || '.';
      pattern += currentPlantsMap[start] || '.';
      pattern += currentPlantsMap[start + 1] || '.';
      pattern += currentPlantsMap[start + 2] || '.';

      if (goodStatesMap[pattern]) {
        if ((start - 1 < lowestPlantIndex) && currentPlantsMap[start - 1] === undefined) lowestPlantIndex = start - 1;
        if ((start + 1 > highestPlantIndex) && currentPlantsMap[start + 1] === undefined) highestPlantIndex = start + 1;

        nextPlantsMap[start] = '#';
      }
    }

    currentPlantsMap = nextPlantsMap;
  }

  return result;
}

function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8').split('\n');
  const initialState = inputs.shift()!.split('initial state: ')[1]!;
  const goodStates = inputs
    .filter(s => s)
    .filter(s => s[s.length-1] === '#')
    .map(s => s.split('=>')[0]!.trim());

  console.log('result1: ', solveA(initialState, goodStates));
  console.log('result2: ', solveB(initialState, goodStates));
}

main();