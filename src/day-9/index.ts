import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

function solveA(players: number, points: number) {
  const circle = [0];
  const scoreMap: Record<string, number> = {};
  let currentMarbleIndex = -1;
  let player = 0;
  for (let i = 1; i <= points; i++) {
    player = ((player + 1) % players) || players;
    if (circle.length === 1) {
      circle.push(i);
      currentMarbleIndex = 1;
      continue;
    }

    if (i % 23 !== 0) {
      let nextMarbleIndex = currentMarbleIndex + 2;
      if (nextMarbleIndex === circle.length) {
        circle.push(i);
        currentMarbleIndex = nextMarbleIndex;
      } else {
        nextMarbleIndex = (nextMarbleIndex % circle.length);
        circle.splice(nextMarbleIndex, 0, i);
        currentMarbleIndex = nextMarbleIndex;
      }
    } else {
      scoreMap[player] = (scoreMap[player] || 0) + i;
      let adjustedIndex = currentMarbleIndex - 7;
      if (adjustedIndex >= 1) {
        const poppedValue = circle.splice(adjustedIndex, 1)[0];
        scoreMap[player] = scoreMap[player] +  (poppedValue || 0);
        currentMarbleIndex = adjustedIndex;
      } else if (adjustedIndex === 0) {
        scoreMap[player] = scoreMap[player] + (circle.shift() || 0);
        currentMarbleIndex = circle.length - 1;
      } else {
        adjustedIndex = (circle.length + adjustedIndex) - 1;
        scoreMap[player] = scoreMap[player] + (circle.splice(adjustedIndex, 1)[0] || 0);
        currentMarbleIndex = adjustedIndex + 1;
      }
    }
  }

  return _.max(_.values(scoreMap));
}

class Node {
  value: number;
  next: Node|null = null;
  prev: Node|null = null;
  constructor(value: number) {
    this.value = value;
  }
}

function solveB(players: number, points: number) {
  let head = new Node(0);
  head.next = head;
  head.prev = head;

  const scoreMap: Record<string, number> = {};
  let player = 0;
  for (let i = 1; i <= points; i++) {
    player = ((player + 1) % players) || players;
    if (i % 23 !== 0) {
      head = head.next!;
      const next = head!.next;
      const prev = head;

      const newNode = new Node(i);
      newNode.prev = head;
      newNode.next = next;
      next!.prev = newNode;

      head.next = newNode;

      head = newNode;
    } else {
      scoreMap[player] = (scoreMap[player] || 0) + i;
      for (let i = 0; i < 7; i++) {
        head = head.prev!;
      }
      scoreMap[player] += head.value;
      const prev = head.prev;
      const next = head.next;
      prev!.next = next;
      next!.prev = prev;
      head = next!;
    }
  }

  return _.max(_.values(scoreMap));
}

function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const input = fs.readFileSync(filePath, 'utf8');
  const [ , players, points ] = /(\d+) players.* (\d+) points/.exec(input)!;
  console.log('result1: ', solveA(Number(players), Number(points)));
  console.log('result2: ', solveB(Number(players), Number(points) * 100));
}

main();