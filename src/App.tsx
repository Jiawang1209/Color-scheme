import { useState, useEffect } from 'react';
import { AppTabs } from './components/AppTabs';
import { LibraryView } from './views/LibraryView';
import { PickerView } from './views/PickerView';
import { ImageView } from './views/ImageView';
import { readView, writeView } from './state/view';
import type { AppView } from './state/view';

export default function App() {
  const [view, setView] = useState<AppView>(() => readView(window.location.search));
  useEffect(() => {
    history.replaceState(null, '', '?' + writeView(window.location.search.slice(1), view));
  }, [view]);
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <span className="app-title">SciColor</span>
        <AppTabs value={view} onChange={setView} />
      </nav>
      {view === 'library' && <LibraryView />}
      {view === 'picker' && <PickerView />}
      {view === 'image' && <ImageView />}
    </div>
  );
}
