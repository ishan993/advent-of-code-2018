import * as _ from 'lodash';

function buildPowerGrid(serialNumber: number) {
  const powerGrid: number[][] = [];
  for (let col = 1; col <= 300; col++) {
    if (!powerGrid[col]) powerGrid[col] = [];
    for (let row = 1; row <= 300; row++) {
      const rackId = row + 10;
      let powerLevel = ((rackId * col) + serialNumber) * rackId;
      powerLevel = Math.floor(powerLevel/100);
      const digit = (powerLevel % 10) - 5;

      powerGrid[col][row] = digit;
    }
  }

  return powerGrid;
}

function solveA(serialNumber: number) {
  const sumMap: Record<string, number> = {};
  const powerGrid =buildPowerGrid(serialNumber);

  for (let col = 1; col <= 300; col++) {
    for (let row = 1; row <= 300; row++) {
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const resultCol = col + i;
          const resultRow = row + j;
          if (resultCol > 300 || resultRow > 300) continue;
          sum += powerGrid[resultCol][resultRow];
        }
      }

      const key = `${col}.${row}`;
      sumMap[key] = sum;
    }
  }

  let resKey = null;
  let max = Number.NEGATIVE_INFINITY;
  for (const key of Object.keys(sumMap)) {
    if (sumMap[key] > max) {
      max = sumMap[key];
      resKey = key;
    }
  }

  const [, y, x] = /(\d+).(\d+)/.exec(resKey!)!;

  return { x, y };
}

function solveB(serialNumber: number) {
  const powerGrid = buildPowerGrid(serialNumber);

  let resKey = null;
  let max = Number.NEGATIVE_INFINITY;

  for (let col = 1; col <= 300; col++) {
    for (let row = 1; row <= 300; row++) {
      let sum = 0;
      for (let size = 0; size <= 300; size++) {
        if (row + size > 300 || col + size > 300) break;

        for (let i = 0; i <= size; i++) {
          sum += powerGrid[col + i][row + size];
        }

        for (let j = 0; j <= size + 1; j++) {
          sum += powerGrid[col + size][row + j];
        }

        const key = `${col}.${row}.${size + 1}`;
        if (sum > max) {
          max = sum;
          resKey = key;
        }
      }

    }
  }

  const [, y, x, size] = /(\d+).(\d+).(\d+)/.exec(resKey!)!;

  return { x, y, size };
}

function main() {
  const input = 5791;
  console.log('result1: ', solveA(input));
  console.log('result2: ', solveB(input));
}

main();