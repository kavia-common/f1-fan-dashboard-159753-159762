import React, { useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * CountdownRing - shows time remaining and an animated circular progress to a target time.
 * Props:
 * - target: Date object for target moment (UTC or local)
 * - size: number (px)
 * - stroke: number (px)
 * - title: string (optional)
 */
export default function CountdownRing({ target, size = 140, stroke = 8, title }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diffMs = Math.max(0, (target?.getTime?.() || 0) - now);
  const totalMs = useMemo(() => {
    // default to 7 days window for ring fill reference if we don't know total
    return Math.max(diffMs, 1) + 1000 * 60 * 60 * 24 * 7;
  }, [diffMs]);

  const progress = 1 - diffMs / totalMs;
  const dash = circumference * progress;

  const d = millisToParts(diffMs);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={size} height={size}>
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="var(--accent)"
          fill="transparent"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: 'drop-shadow(0 0 6px rgba(255, 23, 68, 0.6))'
          }}
        />
      </svg>
      <div>
        {title && <div className="muted" style={{ marginBottom: 6 }}>{title}</div>}
        <div className="value" style={{ fontSize: 28 }}>
          {d.days}d {d.hours}h {d.minutes}m {d.seconds}s
        </div>
        <div className="muted">until start</div>
      </div>
    </div>
  );
}

function millisToParts(ms) {
  const days = Math.floor(ms / (24 * 3600 * 1000));
  ms -= days * 24 * 3600 * 1000;
  const hours = Math.floor(ms / (3600 * 1000));
  ms -= hours * 3600 * 1000;
  const minutes = Math.floor(ms / (60 * 1000));
  ms -= minutes * 60 * 1000;
  const seconds = Math.floor(ms / 1000);
  return { days, hours, minutes, seconds };
}
