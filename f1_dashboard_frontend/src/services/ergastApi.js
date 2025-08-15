import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const BASE = 'https://ergast.com/api/f1';
/**
 * Optional CORS proxy to work around environments where direct cross-origin fetch fails.
 * You can set REACT_APP_CORS_PROXY_URL in .env to override this default.
 * The proxy should accept the target URL appended after it (e.g., `${PROXY}${encodeURIComponent(url)}`).
 */
const CORS_PROXY = process.env.REACT_APP_CORS_PROXY_URL || 'https://api.allorigins.win/raw?url=';

/**
 * Fetch helper with JSON parsing, timeout, and CORS-proxy fallback.
 * Ensures we do not crash the UI when Ergast is temporarily unreachable from the environment.
 */
async function fetchJson(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      mode: 'cors',
      signal: controller.signal
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.json();
  } catch (err) {
    // Try a CORS proxy fallback
    try {
      const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
      const res2 = await fetch(proxiedUrl, {
        headers: { Accept: 'application/json' },
        // proxy generally handles CORS; no need to pass same signal as it may already be aborted
      });
      if (!res2.ok) {
        throw new Error(`Proxy HTTP ${res2.status} for ${url}`);
      }
      return await res2.json();
    } catch (err2) {
      // eslint-disable-next-line no-console
      console.error('Ergast fetch failed (direct and via proxy).', { url, err, err2 });
      // Re-throw for callers to handle (public functions below convert to safe defaults)
      throw err2 || err;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

// PUBLIC_INTERFACE
export async function getCurrentSchedule() {
  /** Fetches the current season's schedule from the Ergast API.
   * Returns [] on error so the UI can degrade gracefully.
   */
  try {
    const data = await fetchJson(`${BASE}/current.json`);
    return data?.MRData?.RaceTable?.Races || [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export async function getDriverStandings(season = 'current') {
  /** Fetches driver standings for the given season ('current' by default).
   * Returns [] on error so the UI can continue functioning.
   */
  try {
    const data = await fetchJson(`${BASE}/${season}/driverStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists || [];
    return lists[0]?.DriverStandings || [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export async function getConstructorStandings(season = 'current') {
  /** Fetches constructor standings for the given season ('current' by default).
   * Returns [] on error so the UI can continue functioning.
   */
  try {
    const data = await fetchJson(`${BASE}/${season}/constructorStandings.json`);
    const lists = data?.MRData?.StandingsTable?.StandingsLists || [];
    return lists[0]?.ConstructorStandings || [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export async function getNextRace() {
  /** Returns the next upcoming race object from the current season schedule.
   * Returns null on error or when no upcoming races are available.
   */
  try {
    const races = await getCurrentSchedule();
    const now = dayjs.utc();
    const withTimes = races.map((r) => {
      const dt = dayjs.utc(`${r.date}T${r.time || '00:00:00Z'}`);
      return { ...r, dateTime: dt };
    });
    const upcoming = withTimes.filter((r) => r.dateTime.isAfter(now));
    upcoming.sort((a, b) => a.dateTime.valueOf() - b.dateTime.valueOf());
    return upcoming[0] || null;
  } catch {
    return null;
  }
}
