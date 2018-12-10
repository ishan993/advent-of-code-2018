import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

function solveA(inputs: { task: string, dependent: string }[]) {
  const completed: string[] = [];
  const { dependencyMap, taskMap } = buildTaskAndDependencyMap(inputs);

  let tasks = Object.keys(taskMap);
  while (tasks.length) {
    const task = Object.keys(taskMap).sort().filter((t) => hasDependencyComplete(t, completed, dependencyMap))[0];
    if (!completed.includes(task)) completed.push(task);

    delete taskMap[task];
    tasks = Object.keys(taskMap);
  }

  return completed.join('');
}

function hasDependencyComplete(task: string, completed: string[], dependencyMap: Record<string, string[]>) {
  if (completed.includes(task)) return true;
  const dependentOn = dependencyMap[task] || [];
  for (const dep of dependentOn) {
    if (!completed.includes(dep)) return false;
  }

  return true;
}

function buildTaskAndDependencyMap(inputs: { task: string, dependent: string }[]) {
  const dependencyMap: Record<string, string[]> = {};
  const taskMap: Record<string, string[]> = {};

  for (const input of inputs) {
    const { task, dependent } = input;
    if (!taskMap[task]) taskMap[task] = [];
    if (!taskMap[dependent]) taskMap[dependent] = [];
    if (!dependencyMap[dependent]) dependencyMap[dependent] = [];


    taskMap[task].push(dependent);
    dependencyMap[dependent].push(task);
  }

  return { taskMap, dependencyMap };
}

async function solveB(inputs: { task: string, dependent: string }[]) {
  const currentTaskCountMap: Record<string, number> = {};
  const currentlyRunningTasksMap: Record<string, string> = {};
  const completed: string[] = [];
  const { taskMap, dependencyMap } = buildTaskAndDependencyMap(inputs);
  let timer: number = 0;

  while (Object.keys(taskMap).length || Object.keys(currentlyRunningTasksMap).length) {
    taskRunner('a');
    taskRunner('b');
    taskRunner('c');
    taskRunner('d');
    taskRunner('f');

    timer++;
  }

  return --timer;

  function taskRunner(key: string) {
    if (timer === (currentTaskCountMap[key] || 0) - 1) {
      delete currentTaskCountMap[key];
      completed.push(currentlyRunningTasksMap[key]);
      delete currentlyRunningTasksMap[key];

      taskRunner(key);
    } else if (!currentTaskCountMap.hasOwnProperty(key)) {
      const task = getTask();
      if (!task) return;

      currentTaskCountMap[key] = timer + (task.charCodeAt(0) - 63) + 60;
      currentlyRunningTasksMap[key] = task;
    }
  }

  function getTask() {
    const task = Object.keys(taskMap)
      .sort()
      .filter(t => hasDependencyComplete(t, completed, dependencyMap) && !_.values(currentlyRunningTasksMap).includes(t))[0];

    delete taskMap[task];

    return task;
  }
}

async function main() {
  const filePath = path.join(__dirname, 'input.txt');
  const inputs = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(r => r)
    .map(r => {
      const match = /\w+ (\w+) .* step (\w+) .*/.exec(r);
      if (!match) throw new Error('Could not parse input');

      const [, task, dependent] = match;

      return {task, dependent};
    });

  console.log('result1: ', solveA(inputs));
  console.log('result2: ', await solveB(inputs));
}

main();