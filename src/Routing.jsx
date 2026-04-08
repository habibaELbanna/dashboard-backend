import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import loginImage from './Assets/login.svg';

// ── Placeholder page for unbuilt sections ──────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0e0e0e', flexDirection: 'column', gap: '12px'
    }}>
      <p style={{ color: '#6B7280', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        Coming soon
      </p>
      <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, margin: 0 }}>{title}</h2>
    </div>
  );
}

// ── Login page ─────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) return;
    navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: '#0e0e0e'
    }}>
      {/* Left — image */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden'
      }}>
        <img
          src={loginImage}
          alt="SELA"
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block'
          }}
        />
        {/* subtle dark overlay */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)'
        }} />
      </div>

      {/* Right — form */}
      <div style={{
        width: '640px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0e0e0e', borderLeft: '1px solid #2a2a2a', padding: '40px'
      }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Logo */}
          <div>
            <span style={{ color: '#00A7E5', fontSize: '26px', fontWeight: 700, letterSpacing: '2px' }}>SELA</span>
            <span style={{ color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', marginLeft: '10px' }}>Admin</span>
          </div>

          {/* Heading */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 600, margin: 0 }}>Welcome back</h1>
            <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Sign in to the admin panel</p>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background: '#111', border: '1px solid #2a2a2a', color: '#fff',
                padding: '12px 16px', fontSize: '13px', outline: 'none',
                fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#00A7E5'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                background: '#111', border: '1px solid #2a2a2a', color: '#fff',
                padding: '12px 16px', fontSize: '13px', outline: 'none',
                fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
                transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#00A7E5'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            style={{
              background: '#00A7E5', color: '#fff', border: 'none',
              padding: '13px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em',
              transition: 'opacity 0.15s'
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Sign In
          </button>

        </div>
      </div>
    </div>
  );
}

// ── App routes ─────────────────────────────────────────────────────────────
export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users"     element={<PlaceholderPage title="Users" />} />
        <Route path="/needs"     element={<PlaceholderPage title="Needs" />} />
        <Route path="/proposals" element={<PlaceholderPage title="Proposals" />} />
        <Route path="/messages"  element={<PlaceholderPage title="Messages" />} />
        <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="/vendors"   element={<PlaceholderPage title="Verification" />} />
        <Route path="/mobile"    element={<PlaceholderPage title="Mobile App" />} />
        <Route path="/content"   element={<PlaceholderPage title="Content Management" />} />
        <Route path="/settings"  element={<PlaceholderPage title="Platform Settings" />} />
        <Route path="/marketing" element={<PlaceholderPage title="Marketing" />} />
        <Route path="/support"   element={<PlaceholderPage title="Support" />} />
        <Route path="/roles"     element={<PlaceholderPage title="Admin Roles" />} />
        <Route path="/activity"  element={<PlaceholderPage title="Activity Log" />} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}