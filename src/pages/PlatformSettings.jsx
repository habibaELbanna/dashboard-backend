import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import FeatureToggles from '../components/FeatureToggles';
import SettingsSidebar from '../components/SettingsSidebar';
import './PlatformSettings.css';

const DEFAULTS = {
  browse_needs_feed:true, browse_vendors_feed:true, swipe_discovery:true,
  realtime_messaging:true, push_notifications:true, saved_items:true,
  profile_verification:true, search_filters:true, submit_proposals:true,
  proposal_attachments:true, proposal_messaging:true, proposal_analytics:true,
  multi_proposal:false, ar_3d_preview:true, ai_match_score:true,
  arabic_rtl:true, analytics_dashboard:true, activity_log:true,
  maintenance_mode:false, read_only_mode:false, allow_new_registrations:true,
};

export default function PlatformSettings() {
  const [toggles,   setToggles]   = useState(DEFAULTS);
  const [activeTab, setActiveTab] = useState('Feature Toggles');
  const [unsaved,   setUnsaved]   = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('platform_settings').select('setting_key, setting_value');
        if (error) throw error;
        if (data && data.length > 0) {
          const fromDB = { ...DEFAULTS };
          data.forEach(row => {
            if (row.setting_key in fromDB)
              fromDB[row.setting_key] = row.setting_value === 'true' || row.setting_value === true;
          });
          setToggles(fromDB);
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleToggle = (key) => {
    setToggles(t => ({ ...t, [key]: !t[key] }));
    setUnsaved(u => u + 1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const upserts = Object.entries(toggles).map(([key, val]) => ({
        setting_key: key, setting_value: String(val),
        value_type: 'boolean', updated_at: new Date().toISOString(),
      }));
      await supabase.from('platform_settings').upsert(upserts, { onConflict:'setting_key' });
      setUnsaved(0);
    } catch { /* error */ }
    finally { setSaving(false); }
  };

  const onCount  = Object.values(toggles).filter(Boolean).length;
  const offCount = Object.values(toggles).filter(v => !v).length;

  return (
    <PageLayout title="Platform Settings" subtitle="Configure features, notifications and platform behaviour">
      <div className="ps__content">

        <div className="ps__action-bar">
          <div className="ps__tabs">
            {['Feature Toggles','Announcements','Email & SMS Templates'].map(t => (
              <button key={t} className={`ps__tab ${activeTab===t?'ps__tab--active':''}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
          <div className="ps__action-right">
            {unsaved > 0 && <span className="ps__unsaved">{unsaved} unsaved</span>}
            <button className="ps__save-btn" onClick={handleSave} disabled={saving || unsaved===0}>
              {saving ? 'Saving…' : 'Save All Settings'}
            </button>
          </div>
        </div>

        {activeTab === 'Feature Toggles' && (
          <div className="ps__grid">
            <FeatureToggles toggles={toggles} onToggle={handleToggle} loading={loading} />
            <SettingsSidebar onCount={onCount} offCount={offCount} unsaved={unsaved} />
          </div>
        )}

        {activeTab !== 'Feature Toggles' && (
          <div className="ps__placeholder">
            <p style={{color:'#6B7280',fontSize:'14px'}}>Coming soon — {activeTab}</p>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
