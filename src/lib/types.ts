export interface Item {
  id: string;
  name: string;
  box: string;        // "A" | "B" | "C" | "D" | ...
  slot: string;        // "A1", "D12B", etc — full slot code
  qty: number;
  category: string;
  tags: string[];
  notes: string;
  image: string | null; // path like "images/foo.jpg", relative to repo root
  extra: Record<string, string | number | boolean>;
}

export interface BoxSlots {
  [slotCode: string]: string; // slot code -> short slot label/description
}

export interface BoxInfo {
  label: string;
  slots: BoxSlots;
}

export interface InventoryData {
  items: Item[];
  boxes: Record<string, BoxInfo>;
}

export type ViewMode = 'browse' | 'search';
