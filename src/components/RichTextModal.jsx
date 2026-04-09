import { useState } from 'react';
import './RichTextModal.css';

const TOOLBAR_GROUPS = [
  [
    { icon:'B', title:'Bold',      style:{fontWeight:700} },
    { icon:'I', title:'Italic',    style:{fontStyle:'italic'} },
    { icon:'U', title:'Underline', style:{textDecoration:'underline'} },
    { icon:'S', title:'Strikethrough', style:{textDecoration:'line-through'} },
  ],
  [
    { icon:'H1', title:'Heading 1' },
    { icon:'H2', title:'Heading 2' },
    { icon:'H3', title:'Heading 3' },
    { icon:'H4', title:'Heading 4' },
  ],
  [
    { icon:'■', title:'Color Red',   bg:'#EF4444', isColor:true },
    { icon:'■', title:'Color Yellow',bg:'#FFA500', isColor:true },
  ],
  [
    { icon:'≡', title:'Bullet list' },
    { icon:'№', title:'Numbered list' },
    { icon:'❝', title:'Blockquote' },
    { icon:'""', title:'Quote' },
  ],
  [
    { icon:'⬅', title:'Align left' },
    { icon:'⬛', title:'Align center' },
    { icon:'➡', title:'Align right' },
    { icon:'⬜', title:'Justify' },
    { icon:'RTL', title:'Right-to-left', small:true },
  ],
  [
    { icon:'🔗', title:'Link' },
    { icon:'🖼', title:'Image' },
    { icon:'⊞', title:'Table' },
    { icon:'—', title:'Divider' },
  ],
  [
    { icon:'↩', title:'Undo' },
    { icon:'↪', title:'Redo' },
    { icon:'<>', title:'Code' },
    { icon:'✕', title:'Clear format' },
  ],
];

export default function RichTextModal({ block, onClose, onSave }) {
  const [lang,    setLang]    = useState('EN');
  const [content, setContent] = useState(lang === 'EN' ? (block?.content_en||'') : (block?.content_ar||''));
  const [slug,    setSlug]    = useState('browse-needs');

  const handleLang = (l) => {
    setLang(l);
    setContent(l === 'EN' ? (block?.content_en||'') : (block?.content_ar||''));
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSave = () => {
    if (onSave) onSave(block?.id, lang === 'EN' ? 'content_en' : 'content_ar', content);
    onClose();
  };

  if (!block) return null;

  return (
    <div className="rtm__overlay" onClick={onClose}>
      <div className="rtm__modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="rtm__header">
          <h3 className="rtm__title">Edit Section — {(block.block_key||'').replace(/_/g,' ')}</h3>
          <div className="rtm__lang-group">
            <button className={`rtm__lang ${lang==='EN'?'rtm__lang--active':''}`} onClick={() => handleLang('EN')}>EN</button>
            <button className={`rtm__lang ${lang==='AR'?'rtm__lang--active':''}`} onClick={() => handleLang('AR')}>AR</button>
          </div>
          <button className="rtm__close" onClick={onClose}>✕</button>
        </div>

        {/* Toolbar */}
        <div className="rtm__toolbar">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <div key={gi} className="rtm__toolbar-group">
              {group.map((btn, bi) => (
                btn.isColor
                  ? <button key={bi} className="rtm__toolbar-color" style={{background:btn.bg}} title={btn.title}/>
                  : <button key={bi} className="rtm__toolbar-btn" title={btn.title} style={btn.style||{}}>
                      <span style={{fontSize: btn.small ? '10px' : '13px'}}>{btn.icon}</span>
                    </button>
              ))}
            </div>
          ))}
        </div>

        {/* Content editable area */}
        <div className="rtm__body">
          <textarea
            className={`rtm__textarea ${lang==='AR'?'rtm__textarea--ar':''}`}
            value={content}
            onChange={e => setContent(e.target.value)}
            dir={lang==='AR'?'rtl':'ltr'}
            placeholder={lang==='AR' ? 'أدخل المحتوى هنا...' : 'Enter content here...'}
          />
        </div>

        {/* Page Slug */}
        <div className="rtm__slug-section">
          <div className="rtm__slug-label">
            Page Slug
            <span className="rtm__slug-info">ⓘ</span>
          </div>
          <div className="rtm__slug-row">
            <span className="rtm__slug-base">https://sela.io/</span>
            <input className="rtm__slug-input" value={slug} onChange={e => setSlug(e.target.value)}/>
            <span className="rtm__slug-check">✓</span>
            <button className="rtm__slug-auto">Auto-generate</button>
          </div>
          <p className="rtm__slug-hint">
            sela.io/{slug} — must be lowercase, no spaces, hyphens only.&nbsp;
            <span style={{color:'#10B981'}}>Available</span>
          </p>
        </div>

        {/* Footer */}
        <div className="rtm__footer">
          <span className="rtm__word-count">{wordCount} words</span>
          <button className="rtm__cancel" onClick={onClose}>Cancel</button>
          <button className="rtm__save" onClick={handleSave}>Save Changes</button>
        </div>

      </div>
    </div>
  );
}
