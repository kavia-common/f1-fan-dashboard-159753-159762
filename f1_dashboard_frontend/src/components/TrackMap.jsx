import React, { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * TrackMap - simple SVG-based track map visualization.
 * It animates a dot along a path to simulate a car moving when isLive is true.
 * Props:
 * - isLive: boolean
 * - width, height: numbers
 */
export default function TrackMap({ isLive = false, width = 360, height = 220 }) {
  const dotRef = useRef(null);

  useEffect(() => {
    let raf = null;
    let t = 0;

    function animate() {
      t += 0.003;
      if (t > 1) t = 0;
      const path = document.getElementById('track-path');
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(t * len);
      if (dotRef.current) {
        dotRef.current.setAttribute('cx', pt.x);
        dotRef.current.setAttribute('cy', pt.y);
      }
      raf = requestAnimationFrame(animate);
    }

    if (isLive) {
      raf = requestAnimationFrame(animate);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isLive]);

  return (
    <svg width={width} height={height} viewBox="0 0 360 220">
      <defs>
        <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="220" rx="12" fill="rgba(255,255,255,0.02)" />
      <path
        id="track-path"
        d="M 40 110 C 60 20, 300 20, 320 110 S 300 200, 180 180 S 40 200, 40 110 Z"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="6"
      />
      <circle ref={dotRef} r="6" cx="40" cy="110" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 23, 68, 0.6))' }} />
      <text x="12" y="20" fill="var(--text-dim)" fontSize="12">Track Visualization</text>
    </svg>
  );
}
