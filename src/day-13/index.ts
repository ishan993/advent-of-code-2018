import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const CURVES = [ '/', '\\'];
type Curve = '\\' | '/';

const DIRECTIONS = ['<', '>', '^', 'v'];
type Direction = '<' | '>' | '^' | 'v';

interface Cart {
  id: string;
  x: number;
  y: number;
  cartDirection: Direction
  turnAtLastIntersection?: Exclude<Direction, 'v'>;
}

function solve(track: string[][], carts: Cart[], solveA: boolean) {
  while (true) {
    const cartsAtTicks: Record<string, Cart[]> = _.groupBy(carts, c => c.x);
    const tickIndexes = Object.keys(cartsAtTicks).sort(sortAsc);

    for (const tickIndex of tickIndexes) {
      const cartsAtTick = cartsAtTicks[tickIndex].sort(sortAscOnProperty('y'));

      for (const cart of cartsAtTick) {
        if (!carts.find(c => c.id === cart.id)) continue;

        const updatedCart = driveCart(cart, track);
        const duplicate = carts.find(c => c.x === updatedCart.x && c.y === updatedCart.y);
        if (duplicate) {
          if (solveA) return { y: updatedCart.x, x: updatedCart.y };
          _.remove(carts, c => c.id === duplicate.id);
          _.remove(carts, c => c.id === cart.id);
        } else {
          _.remove(carts, c => c.id === cart.id);
          carts.push(updatedCart);
        }
      }
    }

    if (!solveA && carts.length === 1) {
      return { y: carts[0].y, x: carts[0].x, id: carts[0].id, dir: carts[0].cartDirection };
    }
  }
}

function getCartDirectionAfterCurve(currentDirection: Direction, curve: Curve) {
  if (curve === '/') {
    if (currentDirection === '<') return 'v';
    if (currentDirection === '>') return '^';
    if (currentDirection === '^') return '>';

    return '<';
  } else if (curve === '\\') {
    if (currentDirection === '<') return '^';
    if (currentDirection === '>') return 'v';
    if (currentDirection === '^') return '<';

    return '>';
  }

  throw new Error('Unkown curve');
}

function driveCart(cart: Cart, track: string[][]) {
  const { cartDirection, turnAtLastIntersection, x, y, id } = cart;
  const { x: updatedX, y: updatedY } = calculateNextCartPosition(Number(x), Number(y), cartDirection);
  const newCart = { x: updatedX, y: updatedY, cartDirection, turnAtLastIntersection, id };

  const trackEl = track[updatedX][updatedY];
  if (trackEl === '+') {
    const res = getNextTurnDirection(cartDirection, turnAtLastIntersection);
    newCart['turnAtLastIntersection']  = res.turnAtLastIntersection as Exclude<Direction, 'v'>;
    newCart['cartDirection'] = res.cartDirection as Direction;
  } else if  (isCurve(trackEl)) {
    newCart['cartDirection'] = getCartDirectionAfterCurve(cartDirection, trackEl);
  }

  return newCart;
}

function getNextTurnDirection(cartDirection: Direction, turnAtLastIntersection?: Exclude<Direction, 'v'>) {
  if (turnAtLastIntersection === '<') {
    return { cartDirection, turnAtLastIntersection: '^' };
  } else if (turnAtLastIntersection === '^') {
    if (cartDirection === '^') return { turnAtLastIntersection: '>', cartDirection: '>'};
    else if (cartDirection === 'v') return { turnAtLastIntersection: '>', cartDirection: '<' };
    else if (cartDirection === '<') return { turnAtLastIntersection: '>', cartDirection: '^' };
    return {turnAtLastIntersection: '>', cartDirection: 'v' };
  } else if (turnAtLastIntersection === '>' || !turnAtLastIntersection) {
    if (cartDirection === '>') return { turnAtLastIntersection: '<', cartDirection: '^' };
    else if (cartDirection === '<') return { turnAtLastIntersection: '<', cartDirection: 'v' };
    else if (cartDirection === '^') return { turnAtLastIntersection: '<', cartDirection: '<' };

    return { turnAtLastIntersection: '<', cartDirection: '>'}
  }

  throw new Error(`Unknown lastTurnDirection: ${turnAtLastIntersection}`);
}

function calculateNextCartPosition(x: number, y: number, direction: Direction) {
  if (direction === '<') return { x, y: y - 1 };
  if (direction === '>') return { x, y: y + 1 };
  if (direction === '^') return { x: x - 1, y };

  return { x: x + 1, y };
}

function isDirection(e: string): e is Direction {
  return DIRECTIONS.includes(e);
}

function isCurve(e: string): e is Curve {
  return CURVES.includes(e);
}

function main() {
  const filePath = path.join(__dirname, 'input.txt');
  let inputs = fs.readFileSync(filePath, 'utf8').split('\n');
  const track: string[][] = [];
  const carts: Cart[] = [];

  for (let row = 0; row < inputs.length; row++) {
    if (!track[row]) track[row] = [];
    for (let col = 0; col < inputs[row].length; col++) {
      const element = inputs[row][col];
      if (isDirection(element)) {
        carts.push({ cartDirection: element, x: row, y: col, id: randomId() });

        if (element === '^' || element === 'v') track[row][col] = '|';
        else track[row][col] = '-';
      } else {
        track[row][col] = element;
      }
    }
  }

  console.log('result1: ', solve(_.cloneDeep(track), _.cloneDeep(carts), true));
  console.log('result2: ', solve(_.cloneDeep(track), _.cloneDeep(carts), false));
}

function sortAsc(a: string, b: string) {
  return Number(a) - Number(b);
}

function sortAscOnProperty(property: keyof Cart) {
  return (a: Cart, b: Cart) => Number(a[property]) - Number(b[property]);
}

function randomId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

main();