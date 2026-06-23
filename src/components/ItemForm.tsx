import { useState } from 'react';
import type { Item } from '../lib/types';
import { Sidebar } from './Sidebar';

interface Props {
  item: Item | null; // null = creating new
  defaultBox?: string;
  defaultSlot?: string;
  onSave: (item: Omit<Item, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  onUploadImage: (file: File, suggestedName: string) => Promise<string | null>;
}

const empty: Omit<Item, 'id'> = {
  name: '',
  box: '',
  slot: '',
  qty: 1,
  category: '',
  tags: [],
  notes: '',
  image: null,
  extra: {},
};

function imageSrc(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  const name = image.replace(/^images\//, '');
  return `/images/${name}`;
}

export function ItemForm({ item, defaultBox, defaultSlot, onSave, onDelete, onClose, onUploadImage }: Props) {
  const [form, setForm] = useState<Omit<Item, 'id'>>(
    item ?? { ...empty, box: defaultBox ?? '', slot: defaultSlot ?? '' }
  );
  const [tagsInput, setTagsInput] = useState(item?.tags.join(', ') ?? '');
  const [uploading, setUploading] = useState(false);
  const [extraRows, setExtraRows] = useState<[string, string][]>(
    item ? Object.entries(item.extra).map(([k, v]) => [k, String(v)]) : []
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const extra: Item['extra'] = {};
    extraRows.forEach(([k, v]) => {
      if (k.trim()) extra[k.trim()] = v;
    });
    onSave({
      ...form,
      id: item?.id,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      qty: Number(form.qty) || 1,
      extra,
    });
    onClose();
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      alert(
        `That image is ${(file.size / 1_000_000).toFixed(1)}MB — GitHub's upload limit for this method is 1MB. Try a smaller/compressed image.`
      );
      e.target.value = '';
      return;
    }
    setUploading(true);
    const slug = (form.name || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    try {
      const path = await onUploadImage(file, `${slug}-${Date.now()}`);
      if (path) {
        setForm((f) => ({ ...f, image: path }));
      } else {
        alert('Upload did not complete — no storage connected. Click "connect storage" first.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(err instanceof Error ? err.message : 'Image upload failed — see browser console for details.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const previewSrc = imageSrc(form.image);

  return (
    <Sidebar title={item ? 'edit item' : 'add item'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="detail-media detail-media-editable">
          {previewSrc ? (
            <img src={previewSrc} alt={form.name || 'preview'} />
          ) : (
            <div className="detail-media-empty" aria-hidden="true">
              <span>{form.category ? form.category.slice(0, 2).toUpperCase() : '··'}</span>
            </div>
          )}
        </div>

        <label className="form-field">
          <span>photo</span>
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
          {uploading && <span className="form-hint">uploading…</span>}
          {form.image && !uploading && <span className="form-hint">saved: {form.image}</span>}
        </label>

        <label className="form-field">
          <span>name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>box</span>
            <input
              required
              value={form.box}
              onChange={(e) => setForm((f) => ({ ...f, box: e.target.value.toUpperCase() }))}
            />
          </label>
          <label className="form-field">
            <span>slot</span>
            <input
              required
              value={form.slot}
              onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value.toUpperCase() }))}
            />
          </label>
          <label className="form-field form-field-narrow">
            <span>qty</span>
            <input
              type="number"
              min={1}
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))}
            />
          </label>
        </div>

        <label className="form-field">
          <span>category</span>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
        </label>

        <label className="form-field">
          <span>tags (comma separated)</span>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
        </label>

        <label className="form-field">
          <span>notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
          />
        </label>

        <div className="form-extra">
          <span className="form-extra-label">extra fields</span>
          {extraRows.map(([k, v], idx) => (
            <div className="form-row" key={idx}>
              <input
                placeholder="field name"
                value={k}
                onChange={(e) => {
                  const next = [...extraRows];
                  next[idx] = [e.target.value, v];
                  setExtraRows(next);
                }}
              />
              <input
                placeholder="value"
                value={v}
                onChange={(e) => {
                  const next = [...extraRows];
                  next[idx] = [k, e.target.value];
                  setExtraRows(next);
                }}
              />
              <button
                type="button"
                className="form-row-remove"
                onClick={() => setExtraRows(extraRows.filter((_, i) => i !== idx))}
                aria-label="Remove field"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="form-extra-add"
            onClick={() => setExtraRows([...extraRows, ['', '']])}
          >
            + add field
          </button>
        </div>

        <div className="modal-actions">
          {item && onDelete && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (confirm(`Delete "${item.name}"? This can't be undone.`)) {
                  onDelete(item.id);
                  onClose();
                }
              }}
            >
              delete
            </button>
          )}
          <div className="modal-actions-right">
            <button type="button" className="btn-ghost" onClick={onClose}>cancel</button>
            <button type="submit" className="btn-primary">save</button>
          </div>
        </div>
      </form>
    </Sidebar>
  );
}
