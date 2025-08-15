import React, { useEffect, useState } from 'react';
import { fetchF1News } from '../services/newsApi';

/**
 * PUBLIC_INTERFACE
 * News - displays the latest F1 news items.
 */
export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchF1News()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid">
      <div className="card cols-12">
        <h3>Latest News</h3>
        {loading && <div className="muted">Loading news...</div>}
        {(!loading && items.length === 0) && (
          <div className="error">No news loaded. Provide a REACT_APP_NEWSAPI_KEY or ensure RSS fallback is reachable.</div>
        )}
      </div>
      {items.map((n, idx) => (
        <a
          className="card cols-4"
          key={idx}
          href={n.url}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="muted" style={{ marginBottom: 8 }}>{new Date(n.publishedAt).toLocaleString()}</div>
          <div className="value" style={{ fontSize: 18, marginBottom: 6 }}>{n.title}</div>
          <div className="muted">{n.source}</div>
        </a>
      ))}
    </div>
  );
}
