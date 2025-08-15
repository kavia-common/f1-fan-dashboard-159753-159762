import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiCalendar, FiHome, FiMessageSquare, FiAward } from 'react-icons/fi';

/**
 * PUBLIC_INTERFACE
 * Sidebar - navigation links for the app (unused directly as App embeds nav).
 */
export default function Sidebar() {
  return (
    <nav>
      <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        <FiHome /> Dashboard
      </NavLink>
      <NavLink to="/schedule" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        <FiCalendar /> Schedule
      </NavLink>
      <NavLink to="/standings" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        <FiAward /> Standings
      </NavLink>
      <NavLink to="/news" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        <FiActivity /> News
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        <FiMessageSquare /> Chat
      </NavLink>
    </nav>
  );
}
