import type { Item } from '../lib/types';

interface Props {
  item: Item;
  editable: boolean;
  onEdit: (item: Item) => void;
}

function imageSrc(image: string | null): string | null {
  if (!image) return null;
  // images live in /public/images at build time, served at site root /images
  if (image.startsWith('http')) return image;
  const name = image.replace(/^images\//, '');
  return `/images/${name}`;
}

export function ItemCard({ item, editable, onEdit }: Props) {
  const src = imageSrc(item.image);

  return (
    <article className="item-card">
      <div className="item-card-media">
        {src ? (
          <img src={src} alt={item.name} loading="lazy" />
        ) : (
          <div className="item-card-media-empty" aria-hidden="true">
            <span>{item.category ? item.category.slice(0, 2).toUpperCase() : '··'}</span>
          </div>
        )}
      </div>

      <div className="item-card-body">
        <div className="item-card-top">
          <span className="item-card-slot">{item.slot}</span>
          {item.qty > 1 && <span className="item-card-qty">×{item.qty}</span>}
        </div>

        <h3 className="item-card-name">{item.name}</h3>

        {item.category && <p className="item-card-category">{item.category}</p>}

        {item.tags.length > 0 && (
          <div className="item-card-tags">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {item.notes && <p className="item-card-notes">{item.notes}</p>}

        {editable && (
          <button className="item-card-edit" onClick={() => onEdit(item)}>
            edit
          </button>
        )}
      </div>
    </article>
  );
}
