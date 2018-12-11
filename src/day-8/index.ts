import * as fs from 'fs';
import * as path from 'path';

function solveA(inputs: number[]) {
  const childNodesCount = inputs.shift() || 0;
  const metadataCount = inputs.shift() || 0;

  let childSum = 0;

  for (let i = 0; i < childNodesCount; i++) {
    childSum += solveA(inputs);
  }

  let rootCount = 0;
  for (let i = 0; i < metadataCount; i++) {
    rootCount += inputs.shift() || 0;
  }

  return childSum + rootCount;
}

function solveB(inputs: number[]) {
  const childNodesCount = inputs.shift() || 0;
  const metadataCount = inputs.shift() || 0;
  const childResultMap: Record<string, number> = {};
  let childSum = 0;

  for (let i = 0; i < childNodesCount; i++) {
    const thisChildSum = solveB(inputs);
    childResultMap[i] = thisChildSum;
    childSum += thisChildSum;
  }

  let rootSum = 0;
  if (!childNodesCount) {
    for (let i = 0; i < metadataCount; i++) {
      const metadatum = inputs.shift() || 0;
      rootSum += metadatum;
    }

    rootSum += childSum;
  } else {
    for (let i = 0; i < metadataCount; i++) {
      const metadatum = inputs.shift() || 0;
      rootSum += childResultMap[metadatum - 1] || 0;
    }
  }

  return rootSum;
}

function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8')
    .split(' ')
    .filter(r => r !== '' && r !== ' ')
    .map(r => Number(r));

  console.log('result1: ', solveA(inputs.slice()));
  console.log('result2: ', solveB(inputs.slice()));
}

main();