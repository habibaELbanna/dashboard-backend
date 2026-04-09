import { useState } from 'react';
import './ContentEditor.css';

export default function ContentEditor({ page, slug, blocks, loading, onBlockChange, onSave, saving, unsaved }) {
  const [expanded, setExpanded] = useState([]);

  const toggle = (key) => setExpanded(e => e.includes(key) ? e.filter(k => k !== key) : [...e, key]);

  return (
    <div className="ce__editor">
      <div className="ce__header">
        <div className="ce__title-wrap">
          <h3 className="ce__title">{page} Page</h3>
          <span className="ce__slug">/ {slug}</span>
        </div>
        <div className="ce__actions">
          <button className="ce__lang-btn ce__lang-btn--active">EN</button>
          <button className="ce__lang-btn">AR</button>
          <button className="ce__save-btn" onClick={onSave} disabled={saving || unsaved === 0}>
            {saving ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ce__loading">Loading content…</div>
      ) : blocks.length === 0 ? (
        <div className="ce__loading">No content blocks found for this page.</div>
      ) : (
        <div className="ce__sections">
          {blocks.map(block => (
            <div key={block.id} className="ce__section">
              <div className="ce__section-header" onClick={() => toggle(block.block_key)}>
                <span className="ce__section-key">{(block.block_key||'').toUpperCase()}</span>
                <span className="ce__section-title">{(block.block_key||'').replace(/_/g,' ')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  style={{ marginLeft:'auto', transform: expanded.includes(block.block_key) ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {expanded.includes(block.block_key) && (
                <div className="ce__section-body">
                  <div className="ce__lang-labels">
                    <span className="ce__lang-tag ce__lang-tag--en">EN</span>
                    <span className="ce__lang-tag ce__lang-tag--ar">AR</span>
                  </div>
                  <div className="ce__inputs">
                    <textarea className="ce__input"
                      value={block.content_en || ''}
                      onChange={e => onBlockChange(block.id, 'content_en', e.target.value)}
                      rows={3}/>
                    <textarea className="ce__input ce__input--ar"
                      value={block.content_ar || ''}
                      onChange={e => onBlockChange(block.id, 'content_ar', e.target.value)}
                      rows={3} dir="rtl"/>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
