import * as fs from 'fs';
import * as path from 'path';

export function getFrequencies() {
  return fs.readFileSync(path.join(__dirname, 'input-1.txt'), 'utf8').split('\n').map(n => parseInt(n));
}

