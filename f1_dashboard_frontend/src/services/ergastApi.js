import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const BASE = 'https://ergast.com/api/f1';

/**
 * Fetch helper with JSON parsing and basic error handling.
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function getCurrentSchedule() {
  /** Fetches the current season's schedule from the Ergast API. */
  const data = await fetchJson(`${BASE}/current.json`);
  return data?.MRData?.RaceTable?.Races || [];
}

// PUBLIC_INTERFACE
export async function getDriverStandings(season = 'current') {
  /** Fetches driver standings for the given season ('current' by default). */
  const data = await fetchJson(`${BASE}/${season}/driverStandings.json`);
  const lists = data?.MRData?.StandingsTable?.StandingsLists || [];
  return lists[0]?.DriverStandings || [];
}

// PUBLIC_INTERFACE
export async function getConstructorStandings(season = 'current') {
  /** Fetches constructor standings for the given season ('current' by default). */
  const data = await fetchJson(`${BASE}/${season}/constructorStandings.json`);
  const lists = data?.MRData?.StandingsTable?.StandingsLists || [];
  return lists[0]?.ConstructorStandings || [];
}

// PUBLIC_INTERFACE
export async function getNextRace() {
  /** Returns the next upcoming race object from the current season schedule. */
  const races = await getCurrentSchedule();
  const now = dayjs.utc();
  const withTimes = races.map((r) => {
    const dt = dayjs.utc(`${r.date}T${r.time || '00:00:00Z'}`);
    return { ...r, dateTime: dt };
  });
  const upcoming = withTimes.filter((r) => r.dateTime.isAfter(now));
  upcoming.sort((a, b) => a.dateTime.valueOf() - b.dateTime.valueOf());
  return upcoming[0] || null;
}
