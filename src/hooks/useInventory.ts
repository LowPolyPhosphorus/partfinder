import { useCallback, useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { v4 as uuidv4 } from 'uuid';
import type { InventoryData, Item } from '../lib/types';
import { saveInventory, putBinaryFile, getFile, type GitHubConfig } from '../lib/github';
import rawData from '../data/data.json';

const initialData = rawData as InventoryData;

export function useInventory(ghConfig: GitHubConfig | null) {
  const [data, setData] = useState<InventoryData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // If we have GitHub access, pull the latest committed version on load
  // so multiple devices/sessions don't clobber each other with stale data.
  useEffect(() => {
    if (!ghConfig) return;
    (async () => {
      try {
        const file = await getFile(ghConfig, ghConfig.dataPath);
        const decoded = decodeURIComponent(
          atob(file.content)
            .split('')
            .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        );
        setData(JSON.parse(decoded));
      } catch (e) {
        // fall back to bundled data.json silently; not fatal
        console.warn('Could not fetch live data.json from GitHub, using bundled copy', e);
      }
    })();
  }, [ghConfig]);

  const fuse = useMemo(
    () =>
      new Fuse(data.items, {
        keys: [
          { name: 'name', weight: 2 },
          { name: 'tags', weight: 1.5 },
          { name: 'category', weight: 1 },
          { name: 'notes', weight: 0.5 },
          { name: 'slot', weight: 1 },
          { name: 'box', weight: 0.5 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [data.items]
  );

  const search = useCallback(
    (query: string): Item[] => {
      if (!query.trim()) return data.items;
      return fuse.search(query).map((r) => r.item);
    },
    [fuse, data.items]
  );

  const persist = useCallback(
    async (next: InventoryData) => {
      setData(next);
      setDirty(true);
      if (!ghConfig) return; // no token configured — stays local-only this session
      setSaving(true);
      setSaveError(null);
      try {
        await saveInventory(ghConfig, next, 'Update inventory via finder UI');
        setDirty(false);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'Save failed');
      } finally {
        setSaving(false);
      }
    },
    [ghConfig]
  );

  const addItem = useCallback(
    (item: Omit<Item, 'id'>) => {
      const newItem: Item = { ...item, id: uuidv4() };
      void persist({ ...data, items: [...data.items, newItem] });
      return newItem;
    },
    [data, persist]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<Item>) => {
      void persist({
        ...data,
        items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      });
    },
    [data, persist]
  );

  const deleteItem = useCallback(
    (id: string) => {
      void persist({ ...data, items: data.items.filter((it) => it.id !== id) });
    },
    [data, persist]
  );

  const uploadImage = useCallback(
    async (file: File, suggestedName: string): Promise<string | null> => {
      if (!ghConfig) return null;
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `public/images/${suggestedName}.${ext}`;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await putBinaryFile(ghConfig, path, base64, `Add image for ${suggestedName}`);
      return `images/${suggestedName}.${ext}`;
    },
    [ghConfig]
  );

  return {
    data,
    search,
    addItem,
    updateItem,
    deleteItem,
    uploadImage,
    saving,
    saveError,
    dirty,
  };
}
