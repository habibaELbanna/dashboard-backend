import './FeatureToggles.css';

const GROUPS = [
  { title:'Core Features', items:[
    { key:'browse_needs_feed',      label:'Browse Needs Feed',       desc:'Vendors can browse procurement needs'         },
    { key:'browse_vendors_feed',    label:'Browse Vendors Feed',     desc:'Buyers can discover verified vendors'         },
    { key:'swipe_discovery',        label:'Swipe Discovery Mode',    desc:'Tinder-style swipe interface for both users'  },
    { key:'realtime_messaging',     label:'Real-time Messaging',     desc:'In-app chat between buyers and vendors'       },
    { key:'push_notifications',     label:'Push Notifications',      desc:'Mobile push alerts for activity'              },
    { key:'saved_items',            label:'Saved Items / Bookmarks', desc:'Users can save needs and vendors'             },
    { key:'profile_verification',   label:'Profile Verification',    desc:'Vendor and buyer verification system'         },
    { key:'search_filters',         label:'Search & Filters',        desc:'Advanced search and filtering on all feeds'   },
  ]},
  { title:'Proposal Features', items:[
    { key:'submit_proposals',       label:'Submit Proposals (Web Only)', desc:'Vendors submit proposals via web platform'},
    { key:'proposal_attachments',   label:'Proposal Attachments',    desc:'Allow file uploads with proposals'            },
    { key:'proposal_messaging',     label:'Proposal Messaging',      desc:'Buyer-vendor chat on proposal thread'         },
    { key:'proposal_analytics',     label:'Proposal Analytics',      desc:'Show proposal stats to buyers'                },
    { key:'multi_proposal',         label:'Multi-proposal per Need', desc:'Allow vendors to submit multiple proposals'   },
  ]},
  { title:'Advanced Features', items:[
    { key:'ar_3d_preview',          label:'AR 3D Model Preview',     desc:'Vendors view uploaded 3D models in AR'        },
    { key:'ai_match_score',         label:'AI Match Score',          desc:'Show % match score on browse feeds'           },
    { key:'arabic_rtl',             label:'Arabic RTL Support',      desc:'Full right-to-left layout for Arabic users'   },
    { key:'analytics_dashboard',    label:'Analytics Dashboard',     desc:'Show analytics to buyers and vendors'         },
    { key:'activity_log',           label:'Admin Activity Log',      desc:'Track all admin actions in activity log'      },
  ]},
  { title:'Maintenance', items:[
    { key:'maintenance_mode',       label:'Maintenance Mode',        desc:'Take platform offline for all users'          },
    { key:'read_only_mode',         label:'Read-Only Mode',          desc:'Disable all write actions platform-wide'      },
    { key:'allow_new_registrations',label:'New Registrations',       desc:'Allow new users to sign up'                   },
  ]},
];

function Toggle({ on, onChange }) {
  return (
    <button className={`ft__toggle ${on ? 'ft__toggle--on' : ''}`} onClick={onChange}>
      <span className="ft__knob"/>
    </button>
  );
}

export default function FeatureToggles({ toggles, onToggle, loading }) {
  if (loading) return <div className="ft__loading">Loading settings…</div>;
  return (
    <div className="ft__wrap">
      {GROUPS.map((group, gi) => (
        <div key={gi} className="ft__group">
          <h3 className="ft__group-title">{group.title}</h3>
          {group.items.map(item => (
            <div key={item.key} className="ft__item">
              <div className="ft__item-info">
                <p className="ft__item-label">{item.label}</p>
                <p className="ft__item-desc">{item.desc}</p>
              </div>
              <Toggle on={!!toggles[item.key]} onChange={() => onToggle(item.key)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
