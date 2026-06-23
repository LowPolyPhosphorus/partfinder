import type { BoxInfo } from '../lib/types';

interface Props {
  box: BoxInfo;
  boxKey: string;
  activeSlot: string | null;
  onSelectSlot: (slot: string | null) => void;
  itemCounts: Record<string, number>;
}

export function SlotTabs({ box, boxKey, activeSlot, onSelectSlot, itemCounts }: Props) {
  const slotCodes = Object.keys(box.slots).sort();

  return (
    <div className="slot-tabs">
      <span className="slot-tabs-prefix">{boxKey} /</span>
      {slotCodes.map((code) => {
        const count = itemCounts[code] || 0;
        const isEmpty = box.slots[code].toLowerCase() === 'nothing' || box.slots[code].toLowerCase() === 'empty';
        return (
          <button
            key={code}
            className={`slot-tab ${activeSlot === code ? 'slot-tab-active' : ''} ${isEmpty ? 'slot-tab-empty' : ''}`}
            onClick={() => onSelectSlot(activeSlot === code ? null : code)}
            disabled={isEmpty}
            title={box.slots[code]}
          >
            {code}
            {!isEmpty && <span className="slot-tab-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
