import React, { useEffect, useRef, useState } from 'react';
import { isFirebaseConfigured, sendMessage, subscribeToMessages } from '../services/firebase';

/**
 * PUBLIC_INTERFACE
 * Chat - a simple realtime chatroom using Firebase Realtime Database.
 */
export default function Chat() {
  const configured = isFirebaseConfigured();
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  useEffect(() => {
    if (!configured) return;
    const unsub = subscribeToMessages((list) => {
      setMessages(list);
      // auto-scroll
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
    return () => unsub();
  }, [configured]);

  const onSaveName = () => {
    localStorage.setItem('username', username.trim());
  };

  const onSend = async () => {
    if (!text.trim()) return;
    await sendMessage(username || 'Anonymous', text);
    setText('');
  };

  if (!configured) {
    return (
      <div className="card cols-12">
        <h3>Fan Chatroom</h3>
        <div className="error" style={{ marginBottom: 8 }}>Firebase is not configured.</div>
        <div className="muted">To enable chat, set Firebase environment variables in .env (see .env.example) and restart the app.</div>
      </div>
    );
  }

  return (
    <div className="card cols-12">
      <h3>Fan Chatroom</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          className="input"
          placeholder="Your nickname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={onSaveName}
          style={{ maxWidth: 260 }}
        />
        <button className="btn" onClick={onSaveName}>Save</button>
      </div>
      <div className="chat-container">
        <div className="chat-messages" ref={listRef}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 10 }}>
              <div className="muted" style={{ fontSize: 12 }}>
                <strong style={{ color: '#fff' }}>{m.username}</strong> • {new Date(m.createdAt || Date.now()).toLocaleString()}
              </div>
              <div>{m.text}</div>
              <div className="hr" />
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            className="input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? onSend() : null}
            style={{ flex: 1 }}
          />
          <button className="btn" onClick={onSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
