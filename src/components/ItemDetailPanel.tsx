import type { Item } from '../lib/types';
import { Sidebar } from './Sidebar';

interface Props {
  item: Item;
  onClose: () => void;
  onEdit: (item: Item) => void;
  editable: boolean;
}

function imageSrc(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  const name = image.replace(/^images\//, '');
  return `/images/${name}`;
}

export function ItemDetailPanel({ item, onClose, onEdit, editable }: Props) {
  const src = imageSrc(item.image);
  const extraEntries = Object.entries(item.extra ?? {});

  return (
    <Sidebar title={item.name} onClose={onClose}>
      <div className="detail-media">
        {src ? (
          <img src={src} alt={item.name} />
        ) : (
          <div className="detail-media-empty" aria-hidden="true">
            <span>{item.category ? item.category.slice(0, 2).toUpperCase() : '··'}</span>
          </div>
        )}
      </div>

      <div className="detail-fields">
        <div className="detail-row">
          <span className="detail-label">location</span>
          <span className="detail-value detail-value-mono">{item.slot}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">quantity</span>
          <span className="detail-value detail-value-mono">×{item.qty}</span>
        </div>

        {item.category && (
          <div className="detail-row">
            <span className="detail-label">category</span>
            <span className="detail-value">{item.category}</span>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">tags</span>
            <div className="detail-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {item.notes && (
          <div className="detail-row">
            <span className="detail-label">notes</span>
            <span className="detail-value detail-value-notes">{item.notes}</span>
          </div>
        )}

        {extraEntries.length > 0 && (
          <div className="detail-extra">
            <span className="detail-label">extra</span>
            {extraEntries.map(([key, value]) => (
              <div className="detail-row detail-row-extra" key={key}>
                <span className="detail-label detail-label-extra">{key}</span>
                <span className="detail-value detail-value-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editable && (
        <button className="btn-primary detail-edit-btn" onClick={() => onEdit(item)}>
          edit this item
        </button>
      )}
    </Sidebar>
  );
}
