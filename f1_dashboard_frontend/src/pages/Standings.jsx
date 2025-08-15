import React, { useEffect, useState } from 'react';
import { getConstructorStandings, getDriverStandings } from '../services/ergastApi';

/**
 * PUBLIC_INTERFACE
 * Standings - displays drivers and constructors standings with a simple toggle.
 */
export default function Standings() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [tab, setTab] = useState('drivers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [d, c] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
      setDrivers(d);
      setConstructors(c);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="card cols-12">
      <h3>Standings</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn" onClick={() => setTab('drivers')} disabled={tab === 'drivers'}>Drivers</button>
        <button className="btn" onClick={() => setTab('constructors')} disabled={tab === 'constructors'}>Constructors</button>
      </div>
      {loading && <div className="muted">Loading standings...</div>}
      {!loading && tab === 'drivers' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="muted">
              <th style={{ textAlign: 'left', padding: 8 }}>Pos</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Driver</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Points</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Wins</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.Driver?.driverId} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 8 }}>#{d.position}</td>
                <td style={{ padding: 8 }}>{d.Driver?.givenName} {d.Driver?.familyName}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{d.points}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{d.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && tab === 'constructors' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="muted">
              <th style={{ textAlign: 'left', padding: 8 }}>Pos</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Constructor</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Points</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Wins</th>
            </tr>
          </thead>
          <tbody>
            {constructors.map((c) => (
              <tr key={c.Constructor?.constructorId} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 8 }}>#{c.position}</td>
                <td style={{ padding: 8 }}>{c.Constructor?.name}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{c.points}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{c.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
