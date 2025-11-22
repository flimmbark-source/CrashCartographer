import { PathPoint } from "./types";

export function distancePoints(a: PathPoint, b: PathPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distancePointToSegment(p: PathPoint, a: PathPoint, b: PathPoint): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const abLenSq = abx * abx + aby * aby;

  if (abLenSq === 0) {
    return distancePoints(p, a);
  }

  const apx = p.x - a.x;
  const apy = p.y - a.y;
  let t = (apx * abx + apy * aby) / abLenSq;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;

  const closest = { x: a.x + abx * t, y: a.y + aby * t };
  return distancePoints(p, closest);
}

export function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function pickSome<T>(pool: T[], count: number): T[] {
  const copy = [...pool];
  const result: T[] = [];
  const n = Math.min(count, copy.length);
  for (let i = 0; i < n; i++) {
    const idx = randomInt(copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

function runInternalTests() {
  const d = distancePoints({ x: 0, y: 0 }, { x: 3, y: 4 });
  if (Math.abs(d - 5) > 0.001) {
    // eslint-disable-next-line no-console
    console.error("distancePoints test failed");
  }
}

runInternalTests();
