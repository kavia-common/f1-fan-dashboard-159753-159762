import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getCurrentSchedule } from '../services/ergastApi';
dayjs.extend(utc);

/**
 * PUBLIC_INTERFACE
 * Schedule - shows current season race calendar.
 */
export default function Schedule() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentSchedule()
      .then(setRaces)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card cols-12">
      <h3>Season Schedule</h3>
      {loading && <div className="muted">Loading schedule...</div>}
      <ul className="list">
        {races.map((r) => {
          const ts = dayjs.utc(`${r.date}T${r.time || '00:00:00Z'}`).toDate();
          return (
            <li key={r.round} className="list-item">
              <div>
                <div className="value">{r.raceName}</div>
                <div className="muted">{r.Circuit?.circuitName} — {r.Circuit?.Location?.locality}, {r.Circuit?.Location?.country}</div>
              </div>
              <div className="muted">{ts.toLocaleString()}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
