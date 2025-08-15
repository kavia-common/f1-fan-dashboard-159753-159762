import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getConstructorStandings, getDriverStandings, getNextRace } from '../services/ergastApi';
import CountdownRing from '../components/CountdownRing';
import TrackMap from '../components/TrackMap';
import RaceFlag from '../components/RaceFlag';
import { fetchF1News } from '../services/newsApi';
dayjs.extend(utc);

/**
 * PUBLIC_INTERFACE
 * Dashboard - main landing page showing next race, countdown, quick standings, map, and news.
 */
export default function Dashboard() {
  const [nextRace, setNextRace] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [nr, d, c, n] = await Promise.all([
          getNextRace(),
          getDriverStandings(),
          getConstructorStandings(),
          fetchF1News().catch(() => [])
        ]);
        setNextRace(nr);
        setDrivers(d.slice(0, 5));
        setConstructors(c.slice(0, 5));
        setNews(n.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const targetDate = useMemo(() => {
    if (!nextRace) return null;
    const s = `${nextRace.date}T${nextRace.time || '00:00:00Z'}`;
    return dayjs.utc(s).toDate();
  }, [nextRace]);

  const isRaceDay = useMemo(() => {
    if (!nextRace) return false;
    const d = dayjs.utc(nextRace.date);
    const now = dayjs.utc();
    return now.isSame(d, 'day');
  }, [nextRace]);

  return (
    <div className="grid">
      <div className="card cols-8">
        <h3>Next Grand Prix</h3>
        {loading && <div className="muted">Loading data...</div>}
        {nextRace && (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {isRaceDay && <RaceFlag />}
              <div>
                <div className="value" style={{ fontSize: 24 }}>{nextRace.raceName}</div>
                <div className="muted">{nextRace.Circuit?.circuitName} — {nextRace.Circuit?.Location?.locality}, {nextRace.Circuit?.Location?.country}</div>
                <div className="badge" style={{ marginTop: 8 }}>
                  <span>Round {nextRace.round}</span>
                </div>
              </div>
            </div>
            {targetDate && (
              <CountdownRing title="Countdown" target={targetDate} />
            )}
          </div>
        )}
      </div>

      <div className="card cols-4">
        <h3>Track Map</h3>
        <TrackMap isLive={isRaceDay} />
        <div className="muted" style={{ marginTop: 8 }}>{isRaceDay ? 'Live simulation' : 'Awaiting race'}</div>
      </div>

      <div className="card cols-6">
        <h3>Driver Standings (Top 5)</h3>
        <ul className="list">
          {drivers.map((d) => (
            <li className="list-item" key={d.Driver?.driverId}>
              <span>#{d.position} {d.Driver?.givenName} {d.Driver?.familyName}</span>
              <span className="muted">{d.points} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card cols-6">
        <h3>Constructor Standings (Top 5)</h3>
        <ul className="list">
          {constructors.map((c) => (
            <li className="list-item" key={c.Constructor?.constructorId}>
              <span>#{c.position} {c.Constructor?.name}</span>
              <span className="muted">{c.points} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card cols-12">
        <h3>Latest News</h3>
        {news.length === 0 ? (
          <div className="muted">No news available. Configure NewsAPI key or allow RSS fallback.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
            {news.map((n, idx) => (
              <a
                className="card cols-3"
                key={idx}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="muted" style={{ marginBottom: 8 }}>{new Date(n.publishedAt).toLocaleString()}</div>
                <div className="value" style={{ fontSize: 16, marginBottom: 6 }}>{n.title}</div>
                <div className="muted">{n.source}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
