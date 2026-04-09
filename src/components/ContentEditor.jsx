import { useState } from 'react';
import RichTextModal from './RichTextModal';
import './ContentEditor.css';

const FIELD_DEFS = {
  hero_section:     [{ en:'Headline', ar:'العنوان' }, { en:'Subheadline', ar:'العنوان الفرعي' }, { en:'CTA Button Text', ar:'نص الزر' }],
  hero_title:       [{ en:'Headline', ar:'العنوان' }],
  hero_subtitle:    [{ en:'Subheadline', ar:'العنوان الفرعي' }],
  hero_cta:         [{ en:'CTA Button Text', ar:'نص الزر' }],
  about_heading:    [{ en:'Heading', ar:'العنوان' }],
  about_description:[{ en:'Description', ar:'الوصف' }],
  pricing_heading:  [{ en:'Heading', ar:'العنوان' }],
  contact_title:    [{ en:'Title', ar:'العنوان' }],
  hiw_title:        [{ en:'Title', ar:'العنوان' }],
};

const HAS_IMAGE = ['hero_section','hero_title','hero_image'];

function getFields(key) {
  return FIELD_DEFS[key] || [{ en:'Content', ar:'المحتوى' }];
}
function splitContent(content, count) {
  const lines = (content||'').split('\n');
  return Array.from({ length: count }, (_, i) => lines[i] || '');
}
function joinContent(values) { return values.join('\n'); }

export default function ContentEditor({ page, slug, blocks, loading, onBlockChange, onSave, saving, unsaved }) {
  const [expanded,   setExpanded]   = useState([]);
  const [modalBlock, setModalBlock] = useState(null);

  const toggle = (key) =>
    setExpanded(e => e.includes(key) ? e.filter(k => k !== key) : [...e, key]);

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
          {blocks.map(block => {
            const isOpen   = expanded.includes(block.block_key);
            const fields   = getFields(block.block_key);
            const enVals   = splitContent(block.content_en, fields.length);
            const arVals   = splitContent(block.content_ar, fields.length);
            const hasImage = HAS_IMAGE.includes(block.block_key);

            return (
              <div key={block.id} className="ce__section">
                <div className="ce__section-header" onClick={() => toggle(block.block_key)}>
                  <span className="ce__section-key">{(block.block_key||'').toUpperCase()}</span>
                  <span className="ce__section-label">
                    {(block.block_key||'').replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())} Section
                  </span>
                  {unsaved > 0 && isOpen && <span className="ce__unsaved-tag">Unsaved</span>}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    style={{ marginLeft:'auto', transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {isOpen && (
                  <div className="ce__body">
                    <div className="ce__col-headers">
                      <span className="ce__lang-tag ce__lang-tag--en">EN</span>
                      <span className="ce__lang-tag ce__lang-tag--ar">AR</span>
                    </div>

                    {fields.map((f, fi) => (
                      <div key={fi} className="ce__field">
                        <div className="ce__field-labels">
                          <span className="ce__field-label">{f.en}</span>
                          <span className="ce__field-label ce__field-label--ar">{f.ar}</span>
                        </div>
                        <div className="ce__field-inputs">
                          <input className="ce__input"
                            value={enVals[fi]}
                            onChange={e => { const u=[...enVals]; u[fi]=e.target.value; onBlockChange(block.id,'content_en',joinContent(u)); }}
                          />
                          <input className="ce__input ce__input--ar" dir="rtl"
                            value={arVals[fi]}
                            onChange={e => { const u=[...arVals]; u[fi]=e.target.value; onBlockChange(block.id,'content_ar',joinContent(u)); }}
                          />
                        </div>
                      </div>
                    ))}

                    {hasImage && (
                      <div className="ce__field">
                        <div className="ce__field-labels">
                          <span className="ce__field-label">Hero Image</span>
                          <span/>
                        </div>
                        <div className="ce__image-upload">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <p className="ce__image-filename">hero-banner.jpg</p>
                        </div>
                        <div className="ce__image-actions">
                          <button className="ce__replace-btn">Replace Image</button>
                          <button className="ce__edit-rich-btn" onClick={() => setModalBlock(block)}>Edit Rich Text</button>
                        </div>
                      </div>
                    )}

                    {!hasImage && (
                      <div style={{ padding:'0 0 4px' }}>
                        <button className="ce__edit-rich-btn" onClick={() => setModalBlock(block)}>Edit Rich Text</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalBlock && (
        <RichTextModal
          block={modalBlock}
          onClose={() => setModalBlock(null)}
          onSave={(id, field, value) => onBlockChange(id, field, value)}
        />
      )}
    </div>
  );
}
