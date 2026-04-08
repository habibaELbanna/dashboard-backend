import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatsGrid from '../components/StatsGrid';
import Activity from '../components/Activity';
import Verifications from '../components/Verifications';
import Tickets from '../components/Tickets';
import Charts from '../components/Charts';
import './Dashboard.css';

const ACTIVITIES = [
  { id:'1', avatar:'MC', text:'Masr Construction Co. posted a new need', time:'2 min ago', badge:{ label:'NEW NEED', color:'#00A7E5', bg:'rgba(0,167,229,0.15)' } },
  { id:'2', avatar:'AH', text:'Ahmed Hassan submitted a proposal', time:'5 min ago', badge:{ label:'PROPOSAL', color:'#FFA500', bg:'rgba(255,165,0,0.15)' } },
  { id:'3', avatar:'SV', text:'SafeVend Ltd requested verification', time:'12 min ago', badge:{ label:'VERIFICATION', color:'#10B981', bg:'rgba(16,185,129,0.15)' } },
  { id:'4', avatar:'DG', text:'Delta Group reported a message', time:'18 min ago', badge:{ label:'REPORT', color:'#EF4444', bg:'rgba(239,68,68,0.15)' } },
  { id:'5', avatar:'NK', text:'Nour Khaled joined as Buyer', time:'24 min ago', badge:{ label:'NEW USER', color:'#00A7E5', bg:'rgba(0,167,229,0.15)' } },
  { id:'6', avatar:'TS', text:'TechSupply Co. proposal accepted', time:'31 min ago', badge:{ label:'ACCEPTED', color:'#10B981', bg:'rgba(16,185,129,0.15)' } },
  { id:'7', avatar:'HG', text:'Horizon Group opened a support ticket', time:'45 min ago', badge:{ label:'SUPPORT', color:'#FFA500', bg:'rgba(255,165,0,0.15)' } },
  { id:'8', avatar:'MR', text:'Mohamed Ramy updated his vendor profile', time:'1 hr ago', badge:{ label:'UPDATE', color:'#6B7280', bg:'rgba(107,114,128,0.15)' } },
  { id:'9', avatar:'BRC', text:'BuildRight Construction need expired', time:'2 hrs ago', badge:{ label:'EXPIRED', color:'#EF4444', bg:'rgba(239,68,68,0.15)' } },
  { id:'10', avatar:'OL', text:'Office Line joined as Vendor', time:'3 hrs ago', badge:{ label:'NEW USER', color:'#00A7E5', bg:'rgba(0,167,229,0.15)' } },
];

const VERIFICATIONS = [
  { avatar:'BR', name:'BuildRight Construction', type:'Vendor' },
  { avatar:'NT', name:'NileTrans Ltd', type:'Vendor' },
  { avatar:'SK', name:'Sara Kamal', type:'Buyer' },
  { avatar:'MS', name:'MediSource Egypt', type:'Vendor' },
  { avatar:'HG', name:'Horizon Group', type:'Buyer' },
];

const TICKETS = [
  { title:'Proposal not received — Ahmed H.', priority:'URGENT', color:'#EF4444', time:'2h ago' },
  { title:'Payment issue — Delta Corp', priority:'HIGH', color:'#FFA500', time:'4h ago' },
  { title:'Profile verification delay', priority:'MEDIUM', color:'#6B7280', time:'6h ago' },
  { title:'Wrong category shown', priority:'LOW', color:'#6B7280', time:'8h ago' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: buyers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'buyer');
        const { count: vendors } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'vendor');
        const { count: activeNeeds } = await supabase.from('needs').select('*', { count: 'exact', head: true }).eq('status', 'open');
        const { count: proposals } = await supabase.from('proposals').select('*', { count: 'exact', head: true });
        setStats({ users, buyers, vendors, activeNeeds, proposals });
      } catch(e) { console.error(e); }
    }
    fetchStats();
  }, []);

  return (
    <div className="db__layout">
      <Sidebar />
      <div className="db__main">
        <Topbar />
        <div className="db__content">
          <StatsGrid stats={stats} />
          <div className="db__middle">
            <div className="db__middle-left">
              <Activity activities={ACTIVITIES} />
            </div>
            <div className="db__middle-right">
              <Verifications verifications={VERIFICATIONS} />
              <Tickets tickets={TICKETS} />
            </div>
          </div>
          <Charts />
        </div>
      </div>
    </div>
  );
}
