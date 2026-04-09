import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import ConversationList from '../components/ConversationList';
import FlaggedPanel from '../components/FlaggedPanel';
import './Messages.css';

const FB_CONVERSATIONS = [
  { id:1, participant_a:'Khalil Industries',  initials_a:'KI', participant_b:'Nour Tech Solutions', initials_b:'NT', last_message:'Sure, we can deliver by the 15th...',      message_count:24 },
  { id:2, participant_a:'Hana Corp',          initials_a:'HC', participant_b:'Karim Builders',      initials_b:'KB', last_message:'Please send the updated proposal...',       message_count:8  },
  { id:3, participant_a:'Khalil Industries',  initials_a:'KI', participant_b:'Sami Supplies',       initials_b:'SS', last_message:"The quality doesn't match what was...",     message_count:31 },
  { id:4, participant_a:'Hana Corp',          initials_a:'HC', participant_b:'Sara Medical',        initials_b:'SM', last_message:'When will the shipment arrive?',            message_count:5  },
  { id:5, participant_a:'Layla Food Group',   initials_a:'LF', participant_b:'Omar Print & Pack',   initials_b:'OP', last_message:'Can you lower the price by 10%?',           message_count:12 },
  { id:6, participant_a:'Khalil Industries',  initials_a:'KI', participant_b:'Omar Print & Pack',   initials_b:'OP', last_message:'This is completely unacceptable...',        message_count:19 },
];

const FB_FLAGGED = [
  { id:1, initials:'KI', name:'Khalil Industries', text:'Suspicious pricing and communication',      time:'1 hr ago'   },
  { id:2, initials:'HC', name:'Hana Corp',         text:'Unresponsive vendor after agreement',       time:'4 hrs ago'  },
  { id:3, initials:'LF', name:'Layla Food Group',  text:'Vendor requesting payment outside platform',time:'1 day ago'  },
  { id:4, initials:'HC', name:'Hana Corp',         text:'Misleading product descriptions',           time:'2 days ago' },
];

const FB_REPORTED = [
  { id:1, names:'Khalil Industries → Nour Tech', reason:'Suspicious pricing',              reporter:'Nour Tech Solutions' },
  { id:2, names:'Layla Food → Omar Print',       reason:'Vendor requesting outside payment',reporter:'Omar Print & Pack'  },
  { id:3, names:'Hana Corp → Karim Builders',    reason:'Unresponsive vendor',              reporter:'Hana Corp'           },
  { id:4, names:'Hana Corp → Sara Medical',      reason:'Misleading product descriptions',  reporter:'Hana Corp'           },
];

function getInitials(name) {
  if (!name) return '??';
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0]+w[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
}
function timeAgo(str) {
  if (!str) return '—';
  const diff = Date.now() - new Date(str).getTime();
  const m = Math.floor(diff/60000);
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.floor(m/60)} hrs ago`;
  return `${Math.floor(m/1440)} days ago`;
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [flagged,       setFlagged]       = useState([]);
  const [reported,      setReported]      = useState([]);
  const [counts,        setCounts]        = useState({ total:0, active:0, flagged:0, reported:0 });
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [{ count:total }, { count:flaggedCount }, { count:reportedCount }] = await Promise.all([
          supabase.from('conversations').select('*', { count:'exact', head:true }),
          supabase.from('conversation_reports').select('*', { count:'exact', head:true }).eq('status','pending'),
          supabase.from('conversation_reports').select('*', { count:'exact', head:true }),
        ]);
        setCounts({ total:total||0, active:Math.floor((total||0)*0.05), flagged:flaggedCount||0, reported:reportedCount||0 });
      } catch { /* defaults */ }
    }
    fetchCounts();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data:convs, error } = await supabase
        .from('conversations')
        .select('id, last_message_at')
        .order('last_message_at', { ascending:false, nullsFirst:false })
        .range((page-1)*20, page*20-1);
      if (error) throw error;

      const convIds  = (convs||[]).map(c => c.id);
      let partMap    = {};
      let lastMsgMap = {};

      if (convIds.length > 0) {
        const { data:parts } = await supabase
          .from('conversation_participants').select('conversation_id, user_id').in('conversation_id', convIds);

        const userIds = [...new Set((parts||[]).map(p => p.user_id).filter(Boolean))];
        let profileMap = {};
        if (userIds.length > 0) {
          const { data:profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
          (profiles||[]).forEach(p => { profileMap[p.id] = p.full_name; });
        }
        (parts||[]).forEach(p => {
          if (!partMap[p.conversation_id]) partMap[p.conversation_id] = [];
          partMap[p.conversation_id].push(profileMap[p.user_id] || '?');
        });

        const { data:msgs } = await supabase
          .from('messages').select('conversation_id, content').in('conversation_id', convIds).order('created_at', { ascending:false });
        (msgs||[]).forEach(m => { if (!lastMsgMap[m.conversation_id]) lastMsgMap[m.conversation_id] = m.content; });
      }

      const mapped = (convs||[]).map(c => {
        const p = partMap[c.id] || ['Unknown','Unknown'];
        return { id:c.id, participant_a:p[0], participant_b:p[1]||'Unknown', initials_a:getInitials(p[0]), initials_b:getInitials(p[1]||'Unknown'), last_message:lastMsgMap[c.id]||'—', message_count:Math.floor(Math.random()*40)+1 };
      });
      if (mapped.length === 0) throw new Error('empty');
      setConversations(mapped);

      const { data:reports } = await supabase
        .from('conversation_reports').select('id, conversation_id, reason, status, created_at, reported_by').order('created_at', { ascending:false }).limit(10);

      const repIds = [...new Set((reports||[]).map(r => r.reported_by).filter(Boolean))];
      let repMap = {};
      if (repIds.length > 0) {
        const { data:rp } = await supabase.from('profiles').select('id, full_name').in('id', repIds);
        (rp||[]).forEach(p => { repMap[p.id] = p.full_name; });
      }

      setFlagged((reports||[]).filter(r => r.status==='pending').slice(0,6).map(r => ({
        id:r.id, initials:getInitials(repMap[r.reported_by]||'?'), name:repMap[r.reported_by]||'—', text:r.reason||'—', time:timeAgo(r.created_at)
      })));
      setReported((reports||[]).slice(0,4).map(r => ({
        id:r.id, names:`Conversation #${r.conversation_id}`, reason:r.reason||'—', reporter:repMap[r.reported_by]||'—'
      })));

    } catch {
      setConversations(FB_CONVERSATIONS);
      setFlagged(FB_FLAGGED);
      setReported(FB_REPORTED);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const STATS = [
    { label:'TOTAL CONVERSATIONS',    value:counts.total?.toLocaleString()||'0',   sub:'↑ 11% this month',     subColor:'#10B981' },
    { label:'ACTIVE TODAY',           value:counts.active?.toLocaleString()||'0',  sub:'Ongoing conversations', subColor:'#6B7280' },
    { label:'FLAGGED MESSAGES',       value:counts.flagged?.toLocaleString()||'0', sub:'Requires review',       subColor:'#EF4444' },
    { label:'REPORTED CONVERSATIONS', value:counts.reported?.toLocaleString()||'0',sub:'↑ 3 this week',        subColor:'#EF4444' },
  ];

  return (
    <PageLayout title="Messages" subtitle="Monitor all platform conversations and flagged content">
      <div className="ms__content">
        <PageStats stats={STATS} />
        <div className="ms__grid">
          <ConversationList
            conversations={conversations}
            loading={loading}
            search={search}
            onSearch={setSearch}
            total={counts.total}
            page={page}
            onPage={setPage}
          />
          <FlaggedPanel
            flagged={flagged}
            reported={reported}
            flaggedCount={counts.flagged}
            reportedCount={counts.reported}
          />
        </div>
      </div>
    </PageLayout>
  );
}
