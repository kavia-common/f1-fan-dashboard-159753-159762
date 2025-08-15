import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import { FiActivity, FiAlignLeft, FiCalendar, FiGlobe, FiHome, FiMessageSquare, FiMoon, FiSun, FiAward } from 'react-icons/fi';

import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Standings from './pages/Standings';
import News from './pages/News';
import Chat from './pages/Chat';

/**
 * PUBLIC_INTERFACE
 * App - Root component setting up the app shell, theme, sidebar, and routes.
 * The theme supports 'auto' (system), 'light', and 'dark'. The chosen theme is persisted in localStorage.
 */
function App() {
  const savedTheme = useMemo(() => localStorage.getItem('theme') || 'auto', []);
  const savedCollapsed = useMemo(() => localStorage.getItem('sidebar-collapsed') === '1', []);
  const [theme, setTheme] = useState(savedTheme);
  const [collapsed, setCollapsed] = useState(savedCollapsed);

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const applied = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', applied);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleCollapsed = () => {
    const v = !collapsed;
    setCollapsed(v);
    localStorage.setItem('sidebar-collapsed', v ? '1' : '0');
  };

  const cycleTheme = () => {
    setTheme(t => (t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto'));
  };

  const ThemeIcon = theme === 'dark' ? FiSun : theme === 'light' ? FiMoon : FiGlobe;
  const themeLabel = theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light';

  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="brand">
            <span className="logo-dot" />
            {!collapsed && <span className="title">F1 Fan Dashboard</span>}
          </div>
          <nav>
            <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiHome /> {!collapsed && 'Dashboard'}
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiCalendar /> {!collapsed && 'Schedule'}
            </NavLink>
            <NavLink to="/standings" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiAward /> {!collapsed && 'Standings'}
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiActivity /> {!collapsed && 'News'}
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <FiMessageSquare /> {!collapsed && 'Chat'}
            </NavLink>
          </nav>
          <button className="collapse-btn" onClick={toggleCollapsed}>
            <FiAlignLeft /> {!collapsed && 'Collapse'}
          </button>
        </aside>
        <main>
          <div className="topbar">
            <div className="muted">A modern F1 dashboard with live data</div>
            <button className="theme-toggle" onClick={cycleTheme} aria-label="Toggle theme">
              <ThemeIcon style={{ marginRight: 8 }} /> {themeLabel}
            </button>
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/news" element={<News />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
