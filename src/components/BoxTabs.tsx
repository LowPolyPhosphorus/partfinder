import type { InventoryData } from '../lib/types';

interface Props {
  data: InventoryData;
  activeBox: string | null;
  onSelectBox: (box: string | null) => void;
}

// hand-drawn-feeling squiggle, used as the active-tab underline.
// Same path every time on purpose — it's a mark, not noise.
function Squiggle({ color }: { color: string }) {
  return (
    <svg
      className="squiggle"
      width="100%"
      height="8"
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,4 C8,1 14,7 22,4 C30,1 36,7 44,4 C52,1 58,7 66,4 C74,1 80,7 88,4 C96,1 102,7 110,4 C114,2.5 117,3.5 120,4"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BoxTabs({ data, activeBox, onSelectBox }: Props) {
  const boxKeys = Object.keys(data.boxes).sort();

  return (
    <nav className="box-tabs" aria-label="Boxes">
      {boxKeys.map((key) => {
        const box = data.boxes[key];
        const isActive = activeBox === key;
        const itemCount = data.items.filter((i) => i.box === key).length;
        return (
          <button
            key={key}
            className={`box-tab ${isActive ? 'box-tab-active' : ''}`}
            onClick={() => onSelectBox(isActive ? null : key)}
            aria-pressed={isActive}
          >
            <span className="box-tab-label">{box.label}</span>
            <span className="box-tab-count">{itemCount}</span>
            {isActive && <Squiggle color="var(--rust)" />}
          </button>
        );
      })}
    </nav>
  );
}
