import { useState, useEffect } from 'react';
import type { AppState } from './state/types';
import type { Palette } from './data/types';
import { decodeState, encodeState } from './lib/url/state';
import { palettes, getColors } from './data/index';
import { SwatchStrip } from './components/SwatchStrip';
import { TypeTabs } from './components/TypeTabs';
import { CvdToggle } from './components/CvdToggle';
import { NSelector } from './components/NSelector';
import { CollectionFilter } from './components/CollectionFilter';
import { SafetyFilter } from './components/SafetyFilter';
import { PaletteList } from './components/PaletteList';
import { ExportPanel } from './components/ExportPanel';
import { PreviewFigure } from './components/PreviewFigure';

interface SafetyValue {
  cb: boolean;
  print: boolean;
  grey: boolean;
}

function App() {
  const [state, setState] = useState<AppState>(() =>
    decodeState(window.location.search.slice(1))
  );
  const [query, setQuery] = useState('');
  const [safety, setSafety] = useState<SafetyValue>({ cb: false, print: false, grey: false });

  useEffect(() => {
    history.replaceState(null, '', '?' + encodeState(state));
  }, [state]);

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  const passesSafety = (p: Palette) =>
    (!safety.cb || p.meta.colorblindSafe !== false) &&
    (!safety.print || p.meta.printFriendly) &&
    (!safety.grey || p.meta.photocopySafe);

  const visible = palettes
    .filter((p) => p.type === state.type)
    .filter((p) => state.collections.includes(p.collection))
    .filter(passesSafety)
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  const current = visible.find((p) => p.id === state.paletteId) ?? visible[0];
  const colors = current ? getColors(current.id, state.n) : [];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="app-title">SciColor</span>
          <TypeTabs value={state.type} onChange={(type) => update({ type })} />
        </div>
        <div className="header-center">
          <input
            className="search-input"
            type="search"
            placeholder="搜索配色方案…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="搜索配色方案"
          />
        </div>
        <div className="header-right">
          <CvdToggle value={state.cvd} onChange={(cvd) => update({ cvd })} />
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <section className="sidebar-section">
            <h3 className="sidebar-label">色阶数</h3>
            <NSelector value={state.n} onChange={(n) => update({ n })} />
          </section>
          <section className="sidebar-section">
            <h3 className="sidebar-label">数据集</h3>
            <CollectionFilter
              value={state.collections}
              onChange={(collections) => update({ collections })}
            />
          </section>
          <section className="sidebar-section">
            <h3 className="sidebar-label">可用性筛选</h3>
            <SafetyFilter value={safety} onChange={setSafety} />
          </section>
          <section className="sidebar-section palette-list-section">
            <h3 className="sidebar-label">配色方案 ({visible.length})</h3>
            <PaletteList
              palettes={visible}
              selectedId={current?.id ?? ''}
              n={state.n}
              cvd={state.cvd}
              onSelect={(paletteId) => update({ paletteId })}
            />
          </section>
        </aside>

        <section className="center-panel">
          {current ? (
            <>
              <div className="center-palette-header">
                <h2 className="palette-title">{current.name}</h2>
                <span className="palette-meta">
                  {current.collection} · {state.n} 色
                </span>
              </div>
              <div className="center-strip">
                <SwatchStrip colors={colors} cvd={state.cvd} />
              </div>
              <div className="center-preview">
                <PreviewFigure colors={colors} cvd={state.cvd} type={state.type} />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>无匹配配色</p>
              <p className="empty-hint">请调整筛选条件</p>
            </div>
          )}
        </section>

        <aside className="export-sidebar">
          <ExportPanel
            format={state.exportFormat}
            colors={colors}
            name={current?.id ?? 'palette'}
            onFormat={(exportFormat) => update({ exportFormat })}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
