import { useMemo, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import { ConnectStorage } from './components/ConnectStorage';
import { BoxTabs } from './components/BoxTabs';
import { SlotTabs } from './components/SlotTabs';
import { SearchBar } from './components/SearchBar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailPanel } from './components/ItemDetailPanel';
import { ItemForm } from './components/ItemForm';
import type { Item, ViewMode } from './lib/types';

export default function App() {
  const { ghConfig, saveGhConfig, clearGhConfig } = useAuth();
  const { data, search, addItem, updateItem, deleteItem, uploadImage, saving, saveError, dirty } =
    useInventory(ghConfig);

  const [query, setQuery] = useState('');
  const [activeBox, setActiveBox] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [showConnectStorage, setShowConnectStorage] = useState(false);

  const viewMode: ViewMode = query.trim() ? 'search' : 'browse';

  const searchResults = useMemo(() => (viewMode === 'search' ? search(query) : []), [viewMode, query, search]);

  const browseResults = useMemo(() => {
    let items = data.items;
    if (activeBox) items = items.filter((i) => i.box === activeBox);
    if (activeSlot) items = items.filter((i) => i.slot === activeSlot);
    return items;
  }, [data.items, activeBox, activeSlot]);

  const slotItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!activeBox) return counts;
    data.items.filter((i) => i.box === activeBox).forEach((i) => {
      counts[i.slot] = (counts[i.slot] || 0) + 1;
    });
    return counts;
  }, [data.items, activeBox]);

  const visibleItems = viewMode === 'search' ? searchResults : browseResults;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-brand-mark">⏚</span>
            <div>
              <h1 className="app-title">finder</h1>
              <p className="app-subtitle">
                lowpolyphosphor.us — {data.items.length} parts, {Object.keys(data.boxes).length} boxes
              </p>
            </div>
          </div>
          <div className="app-header-actions">
            {saving && <span className="status-pill status-saving">saving…</span>}
            {!saving && dirty && !ghConfig && <span className="status-pill status-local">local only — no token set</span>}
            {saveError && <span className="status-pill status-error" title={saveError}>save failed</span>}
            {ghConfig ? (
              <button
                className="btn-ghost btn-small"
                onClick={() => {
                  if (confirm('Disconnect GitHub storage? Edits will stop saving permanently until reconnected.')) {
                    clearGhConfig();
                  }
                }}
                title={`Connected to ${ghConfig.owner}/${ghConfig.repo}`}
              >
                storage: connected
              </button>
            ) : (
              <button className="btn-ghost btn-small" onClick={() => setShowConnectStorage(true)}>
                connect storage
              </button>
            )}
            <button className="btn-primary btn-small" onClick={() => setCreatingNew(true)}>
              + add item
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <SearchBar value={query} onChange={setQuery} resultCount={viewMode === 'search' ? searchResults.length : null} />

        {viewMode === 'browse' && (
          <>
            <BoxTabs
              data={data}
              activeBox={activeBox}
              onSelectBox={(box) => {
                setActiveBox(box);
                setActiveSlot(null);
              }}
            />
            {activeBox && data.boxes[activeBox] && (
              <SlotTabs
                box={data.boxes[activeBox]}
                boxKey={activeBox}
                activeSlot={activeSlot}
                onSelectSlot={setActiveSlot}
                itemCounts={slotItemCounts}
              />
            )}
          </>
        )}

        <section className="item-grid" aria-live="polite">
          {visibleItems.length === 0 ? (
            <div className="empty-state">
              {viewMode === 'search' ? (
                <p>nothing matches "{query}" — try fewer words, or check it's not still in transit.</p>
              ) : activeBox ? (
                <p>nothing logged here yet.</p>
              ) : (
                <p>pick a box above, or search for something.</p>
              )}
            </div>
          ) : (
            visibleItems.map((item) => (
              <ItemCard key={item.id} item={item} editable onView={setViewingItem} onEdit={setEditingItem} />
            ))
          )}
        </section>
      </main>

      {viewingItem && (
        <ItemDetailPanel
          item={viewingItem}
          editable
          onEdit={(item) => {
            setViewingItem(null);
            setEditingItem(item);
          }}
          onClose={() => setViewingItem(null)}
        />
      )}

      {(editingItem || creatingNew) && (
        <ItemForm
          item={editingItem}
          defaultBox={activeBox ?? undefined}
          defaultSlot={activeSlot ?? undefined}
          onUploadImage={uploadImage}
          onSave={(values) => {
            if (values.id) {
              updateItem(values.id, values);
            } else {
              addItem(values);
            }
          }}
          onDelete={deleteItem}
          onClose={() => {
            setEditingItem(null);
            setCreatingNew(false);
          }}
        />
      )}

      {showConnectStorage && (
        <ConnectStorage onSave={saveGhConfig} onClose={() => setShowConnectStorage(false)} />
      )}
    </div>
  );
}
