import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './PageLayout.css';

export default function PageLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pl__layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="pl__backdrop" onClick={() => setSidebarOpen(false)} />}
      <div className="pl__main">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
        <div className="pl__content">
          {children}
        </div>
      </div>
    </div>
  );
}
