import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import PageLayout from '../components/PageLayout';
import PageStats from '../components/PageStats';
import PagesList from '../components/PagesList';
import ContentEditor from '../components/ContentEditor';
import './ContentManagement.css';

export default function ContentManagement() {
  const [activeTab,    setActiveTab]    = useState('Website Pages');
  const [selectedPage, setSelectedPage] = useState('Home');
  const [blocks,       setBlocks]       = useState([]);
  const [strings,      setStrings]      = useState([]);
  const [blockCount,   setBlockCount]   = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [unsaved,      setUnsaved]      = useState(0);
  const [saving,       setSaving]       = useState(false);
  const [pageId,       setPageId]       = useState(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count } = await supabase.from('cms_content_blocks').select('*', { count:'exact', head:true });
        setBlockCount(count || 0);
      } catch { /* default */ }
    }
    fetchCount();
  }, []);

  const loadPage = useCallback(async (pageName) => {
    setLoading(true);
    const slug = pageName.toLowerCase().replace(/ /g,'-').replace(/[^a-z0-9-]/g,'');
    try {
      const { data:pages } = await supabase.from('cms_pages').select('id').eq('slug', slug).limit(1);
      if (pages && pages.length > 0) {
        const pg = pages[0];
        setPageId(pg.id);
        const { data:blks } = await supabase
          .from('cms_content_blocks')
          .select('id, block_key, content_en, content_ar, block_order')
          .eq('page_id', pg.id)
          .order('block_order');
        setBlocks(blks || []);
      } else {
        setBlocks([]);
        setPageId(null);
      }
    } catch { setBlocks([]); }
    finally { setLoading(false); }
  }, []);

  const loadStrings = useCallback(async () => {
    try {
      const { data } = await supabase.from('translation_strings').select('id, key, en_value, ar_value, context').order('key');
      setStrings(data || []);
    } catch { setStrings([]); }
  }, []);

  useEffect(() => {
    if (activeTab === 'Website Pages') loadPage(selectedPage);
    if (activeTab === 'Global Strings') loadStrings();
  }, [activeTab, selectedPage, loadPage, loadStrings]);

  const handleBlockChange = (id, field, value) => {
    setBlocks(b => b.map(bl => bl.id === id ? { ...bl, [field]: value } : bl));
    setUnsaved(u => u + 1);
  };

  const handleSave = async () => {
    if (!pageId) return;
    setSaving(true);
    try {
      for (const block of blocks) {
        await supabase.from('cms_content_blocks')
          .update({ content_en: block.content_en, content_ar: block.content_ar })
          .eq('id', block.id);
      }
      setUnsaved(0);
    } catch { /* error */ }
    finally { setSaving(false); }
  };

  const slug = selectedPage.toLowerCase().replace(/ /g,'-').replace(/[^a-z0-9-]/g,'');

  const STATS = [
    { label:'TOTAL CONTENT BLOCKS', value: blockCount?.toLocaleString()||'0', sub:'Across website and app',  subColor:'#6B7280' },
    { label:'UNSAVED CHANGES',       value: String(unsaved),                   sub:'Ready to publish',        subColor: unsaved > 0 ? '#FFA500' : '#6B7280' },
    { label:'IMAGES UPLOADED',       value:'142',                              sub:'↑ 8 this week',           subColor:'#10B981' },
    { label:'LAST PUBLISHED',        value:'2 hrs ago',                        sub:'by Super Admin',          subColor:'#6B7280' },
  ];

  return (
    <PageLayout title="Content Management" subtitle="Edit website and app text, images and Arabic translations">
      <div className="cm__content">

        <PageStats stats={STATS} />

        <div className="cm__topbar">
          <div className="cm__tabs">
            {['Website Pages','App Screens','Images & Media','Arabic Translations','Global Strings'].map(t => (
              <button key={t} className={`cm__tab ${activeTab===t?'cm__tab--active':''}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
          <div className="cm__topbar-right">
            {unsaved > 0 && <span className="cm__unsaved">{unsaved} unsaved</span>}
            <button className="cm__preview-btn">👁 Preview</button>
            <button className="cm__publish-btn" onClick={handleSave} disabled={saving || unsaved === 0}>
              {saving ? 'Saving…' : '↑ Publish All Changes'}
            </button>
          </div>
        </div>

        {activeTab === 'Website Pages' && (
          <div className="cm__grid">
            <PagesList
              selected={selectedPage}
              onSelect={page => { setSelectedPage(page); setUnsaved(0); }}
              hasUnsaved={unsaved > 0}
            />
            <ContentEditor
              page={selectedPage}
              slug={slug}
              blocks={blocks}
              loading={loading}
              onBlockChange={handleBlockChange}
              onSave={handleSave}
              saving={saving}
              unsaved={unsaved}
            />
          </div>
        )}

        {activeTab === 'Global Strings' && (
          <div className="cm__table-card">
            <div className="cm__table-wrap">
              <table className="cm__table">
                <thead><tr><th>KEY</th><th>ENGLISH</th><th>ARABIC</th><th>CONTEXT</th></tr></thead>
                <tbody>
                  {strings.length === 0
                    ? <tr><td colSpan={4} style={{padding:'40px',textAlign:'center',color:'#6B7280'}}>No strings found.</td></tr>
                    : strings.map(s => (
                        <tr key={s.id}>
                          <td className="cm__td-key">{s.key}</td>
                          <td className="cm__td-white">{s.en_value}</td>
                          <td className="cm__td-ar">{s.ar_value}</td>
                          <td className="cm__td-muted">{s.context}</td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== 'Website Pages' && activeTab !== 'Global Strings' && (
          <div className="cm__placeholder">
            <p style={{color:'#6B7280',fontSize:'14px'}}>Coming soon — {activeTab}</p>
          </div>
        )}

      </div>
    </PageLayout>
  );
}
