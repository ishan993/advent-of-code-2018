import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

function transformer(i: string) {
  const match = /\[(\d+-\d+-\d+) (\d+:\d+)]/g.exec(i);
  if (!match) throw new Error('No match found!');

  const [, date, time ] = match;
  const status = i.split(']')[1].replace(']', '').trim();
  const id = /\w+ #(\d+)/g.exec(status);
  const res: ActivityLog = { date, time, status };
  if (id) res['id'] = id[1];

  return res;
}

const inputs = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split('\n').filter(r => r).map(transformer);

export interface ActivityLog {
  date: string;
  time: string;
  status: string;
  id?: string;
}

function buildActivities(inputs: ActivityLog[]): ActivityLog[][] {
  const dateToActivitiesMap: Record<string, ActivityLog[]> = _.groupBy(inputs, 'date');

  const sortedDates = Object.keys(dateToActivitiesMap).sort();
  for (let i = 0; i < sortedDates.length; i++) {
    const dateKey = sortedDates[i];
    const dayActivity: ActivityLog[] = dateToActivitiesMap[dateKey];
    let index = -1;
    for (let j = 0; j < dayActivity.length; j++) {
      if (dayActivity[j].id && dayActivity[j].time.includes('23:') && dayActivity[j].date === dateKey) {
        index = j;
        break;
      };
    }
    const nextDayKey = sortedDates[i + 1];
    if (index !== -1) {
      dateToActivitiesMap[nextDayKey].push(_.pullAt(dayActivity, index)[0]);
    }
  }

  return _.values(dateToActivitiesMap);
}

export interface GuardSleepLog {
  guardId: string;
  total: number;
  sleepMinutesCountMap: { [minute: string]: number };
}

function buildSleepLogs(allActivities: ActivityLog[][]): GuardSleepLog[] {
  const guardSleepLogs: GuardSleepLog[] = [];

  const guardToDayActivitiesMap: Record<string, boolean[][]> = {};
  const guardSleepCount: Record<string, number> = {};
  for (const dayActivities of allActivities) {
    const guardId: string = dayActivities.find(a => a.id !== undefined)!.id!;
    const sleepWakeActs = _.sortBy(dayActivities.filter(i => !i.id), 'time');
    const bool: boolean[] = [];
    let count = 0;
    while (sleepWakeActs.length) {
      const sleep = Number(sleepWakeActs.shift()!.time.split(':')[1]);
      const wake = Number(sleepWakeActs.shift()!.time.split(':')[1]);
      for (let i = sleep; i < wake; i++) {
        bool[i] = true;
        count++;
      }
    }

    guardSleepCount[guardId] = (guardSleepCount[guardId] || 0) + count;
    if (!guardToDayActivitiesMap[guardId]) guardToDayActivitiesMap[guardId] = [];
    guardToDayActivitiesMap[guardId].push(bool);
  }

  for (const guardId in guardToDayActivitiesMap) {
    const sleepMinutesCountMap: Record<string, number> = {};
    const sleepPatterns = guardToDayActivitiesMap[guardId];
    for (const pattern of sleepPatterns) {
      for (let minute = 0; minute <= 60; minute++) {
        if (pattern[minute]) {
          sleepMinutesCountMap[minute] = (sleepMinutesCountMap[minute] || 0) + 1;
        }
      }
    }

    guardSleepLogs.push({ guardId, sleepMinutesCountMap, total: guardSleepCount[guardId] });
  }

  return guardSleepLogs;
}

function solveA(guardSleepLogs: GuardSleepLog[]) {
  const highest = _.maxBy(guardSleepLogs, 'total')!;
  let highestCount = -1;
  let highestCountMinute = -1;

  for (const minute in highest.sleepMinutesCountMap) {
    if (highest.sleepMinutesCountMap[minute] > highestCount) {
      highestCount = highest.sleepMinutesCountMap[minute];
      highestCountMinute = Number(minute);
    }
  }

  return Number(highest.guardId) * highestCountMinute;
}

function solveB(activityLogs: GuardSleepLog[]) {
  let highestSleepCount = -1;
  let highestSleepMinute = -1;
  let highestSleepCountGuardId = null;
  for (const log of activityLogs) {
    for (const minute in log.sleepMinutesCountMap) {
      if (log.sleepMinutesCountMap[minute] > highestSleepCount) {
        highestSleepCount = log.sleepMinutesCountMap[minute];
        highestSleepMinute = Number(minute);
        highestSleepCountGuardId = log.guardId;
      }
    }
  }

  return highestSleepMinute * Number(highestSleepCountGuardId);
}

const allActs = buildActivities(inputs);
const guardSleepLogs = buildSleepLogs(allActs);

console.log('result1: ', solveA(guardSleepLogs));
console.log('result2: ', solveB(guardSleepLogs));