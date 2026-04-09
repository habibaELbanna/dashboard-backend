import { useState } from 'react';
import './RevenueChart.css';

const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LINE_PTS = [140,130,118,110,100,90,80,70,60,45,40,28];

export default function RevenueChart() {
  const [tab, setTab] = useState('Monthly');
  return (
    <div className="rc__card">
      <div className="rc__header">
        <h3 className="rc__title">Revenue Over Time</h3>
        <div className="rc__tabs">
          {['Daily','Weekly','Monthly'].map(t => (
            <button key={t} className={`rc__tab ${tab===t?'rc__tab--active':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="rc__chart">
        <div className="rc__y-axis">
          {['2.4M','1.8M','1.2M','0.6M','0M'].map(v => <span key={v}>{v}</span>)}
        </div>
        <div className="rc__plot">
          <svg viewBox="0 0 600 150" preserveAspectRatio="none" className="rc__svg">
            <defs>
              <linearGradient id="rcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00A7E5" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#00A7E5" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={`M ${LINE_PTS.map((y,i) => `${i*54.5},${y}`).join(' L ')}`} fill="none" stroke="#00A7E5" strokeWidth="2"/>
            <path d={`M ${LINE_PTS.map((y,i) => `${i*54.5},${y}`).join(' L ')} L 600,150 L 0,150 Z`} fill="url(#rcGrad)"/>
            {LINE_PTS.map((y,i) => <circle key={i} cx={i*54.5} cy={y} r="3" fill="#00A7E5"/>)}
          </svg>
          <div className="rc__x-axis">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
