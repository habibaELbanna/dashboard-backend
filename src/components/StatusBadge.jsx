import './StatusBadge.css';

const STATUS_MAP = {
  // User statuses
  active:      { label:'ACTIVE',      color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
  suspended:   { label:'SUSPENDED',   color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
  pending:     { label:'PENDING',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)'  },
  // Need statuses
  open:        { label:'OPEN',        color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
  closed:      { label:'CLOSED',      color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
  expired:     { label:'EXPIRED',     color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
  flagged:     { label:'FLAGGED',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',  border:'rgba(255,165,0,0.3)'  },
  // Proposal statuses
  accepted:    { label:'ACCEPTED',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
  rejected:    { label:'REJECTED',    color:'#EF4444', bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.3)'  },
  withdrawn:   { label:'WITHDRAWN',   color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
  shortlisted: { label:'SHORTLISTED', color:'#00A7E5', bg:'rgba(0,167,229,0.12)',  border:'rgba(0,167,229,0.3)'  },
  // Report statuses
  reviewed:    { label:'REVIEWED',    color:'#10B981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)' },
  dismissed:   { label:'DISMISSED',   color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)'},
};

export default function StatusBadge({ status }) {
  const m = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
  return (
    <span className="sb__badge" style={{ color:m.color, background:m.bg, border:`1px solid ${m.border}` }}>
      {m.label}
    </span>
  );
}
