import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import RolePermissions from '../components/RolePermissions';
import './AdminRoles.css';

const FB_ADMINS = [
  { id:1, initials:'SA', name:'Sara Ahmed',      email:'sara@sela.io',  role:'super_admin',   since:'Super Admin since Jan 2025',    lastLogin:'2 min ago',  status:'active'   },
  { id:2, initials:'MK', name:'Mohamed Kamal',   email:'mk@sela.io',    role:'super_admin',   since:'Super Admin since Jan 2025',    lastLogin:'1 hr ago',   status:'active'   },
  { id:3, initials:'NA', name:'Nadia Ashraf',     email:'na@sela.io',    role:'moderator',     since:'Moderator since Feb 2025',      lastLogin:'3 hrs ago',  status:'active'   },
  { id:4, initials:'KH', name:'Khalid Hassan',    email:'kh@sela.io',    role:'moderator',     since:'Moderator since Feb 2025',      lastLogin:'1 day ago',  status:'active'   },
  { id:5, initials:'RM', name:'Rania Mahmoud',    email:'rm@sela.io',    role:'moderator',     since:'Moderator since Mar 2025',      lastLogin:'2 days ago', status:'active'   },
  { id:6, initials:'OA', name:'Omar Adel',        email:'oa@sela.io',    role:'moderator',     since:'Moderator since Mar 2025',      lastLogin:'3 days ago', status:'inactive' },
  { id:7, initials:'FS', name:'Fatma Salem',      email:'fs@sela.io',    role:'support_agent', since:'Support Agent since Mar 2025',  lastLogin:'4 hrs ago',  status:'active'   },
  { id:8, initials:'YM', name:'Youssef Mostafa',  email:'ym@sela.io',    role:'support_agent', since:'Support Agent since Mar 2025',  lastLogin:'1 day ago',  status:'active'   },
];

const ROLE_STYLE = {
  super_admin:   { label:'SUPER ADMIN',   color:'#EF4444', bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.3)'   },
  moderator:     { label:'MODERATOR',     color:'#FFA500', bg:'rgba(255,165,0,0.12)',   border:'rgba(255,165,0,0.3)'   },
  support_agent: { label:'SUPPORT AGENT', color:'#00A7E5', bg:'rgba(0,167,229,0.12)',   border:'rgba(0,167,229,0.3)'   },
};
const STATUS_STYLE = {
  active:   { label:'ACTIVE',   color:'#10B981', bg:'rgba(16,185,129,0.12)',  border:'rgba(16,185,129,0.3)'  },
  inactive: { label:'INACTIVE', color:'#6B7280', bg:'rgba(107,114,128,0.12)',border:'rgba(107,114,128,0.3)' },
};

function getInitials(name) {
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0]+w[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}

export default function AdminRoles() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts,  setCounts]  = useState({ total:0, super:0, moderators:0, support:0 });
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        const { data, error } = await supabase
          .from('profiles').select('id, full_name, email, role, status, created_at')
          .eq('role', 'admin').order('created_at');
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('empty');

        setAdmins(data.map(a => ({
          id:       a.id,
          initials: getInitials(a.full_name||'?'),
          name:     a.full_name || '—',
          email:    a.email || '—',
          role:     'moderator',
          since:    `Since ${new Date(a.created_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})}`,
          lastLogin:'—',
          status:   a.status || 'active',
        })));
        setCounts({ total:data.length, super:0, moderators:data.length, support:0 });
      } catch {
        setAdmins(FB_ADMINS);
        setCounts({ total:8, super:2, moderators:4, support:2 });
      } finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const STATS = [
    { label:'TOTAL ADMINS',   value: counts.total?.toString()||'0',     sub:'Across all roles',        subColor:'#6B7280' },
    { label:'SUPER ADMINS',   value: counts.super?.toString()||'0',     sub:'Full platform access',    subColor:'#EF4444' },
    { label:'MODERATORS',     value: counts.moderators?.toString()||'0',sub:'Content and user management', subColor:'#FFA500' },
    { label:'SUPPORT AGENTS', value: counts.support?.toString()||'0',   sub:'Ticket management only',  subColor:'#10B981' },
  ];

  return (
    <PageLayout title="Admin Roles" subtitle="Manage admin accounts, roles and access permissions">
      <div className="ar__content">
        <PageStats stats={STATS} />

        <div className="ar__grid">
          {/* Left: admin table */}
          <div className="ar__left">
            <div className="ar__filters">
              <div className="ar__search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input className="ar__search" placeholder="Search by name, email, role…" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <select className="ar__select"><option>Role: All</option><option>Super Admin</option><option>Moderator</option><option>Support Agent</option></select>
              <select className="ar__select"><option>Status: All</option><option>Active</option><option>Inactive</option></select>
              <button className="ar__clear" onClick={() => setSearch('')}>Clear filters</button>
              <span className="ar__count ar__hide-sm">{filtered.length} admins</span>
            </div>

            <div className="ar__table-wrap">
              {loading ? <div className="ar__loading">Loading…</div> : (
                <table className="ar__table">
                  <thead>
                    <tr>
                      <th>ADMIN</th>
                      <th className="ar__hide-sm">EMAIL</th>
                      <th>ROLE</th>
                      <th className="ar__hide-sm">LAST LOGIN</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(row => {
                      const r = ROLE_STYLE[row.role]     || ROLE_STYLE.moderator;
                      const s = STATUS_STYLE[row.status] || STATUS_STYLE.active;
                      return (
                        <tr key={row.id}>
                          <td>
                            <div className="ar__admin-cell">
                              <div className="ar__av">{row.initials}</div>
                              <div>
                                <p className="ar__admin-name">{row.name}</p>
                                <p className="ar__admin-since">{row.since}</p>
                              </div>
                            </div>
                          </td>
                          <td className="ar__muted ar__hide-sm">{row.email}</td>
                          <td><span className="ar__badge" style={{ color:r.color, background:r.bg, border:`1px solid ${r.border}` }}>{r.label}</span></td>
                          <td className="ar__muted ar__hide-sm">{row.lastLogin}</td>
                          <td><span className="ar__badge" style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>{s.label}</span></td>
                          <td>
                            <div className="ar__actions">
                              <button className="ar__action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                              <button className="ar__action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                              <button className="ar__action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: permissions */}
          <RolePermissions />
        </div>
      </div>
    </PageLayout>
  );
}
