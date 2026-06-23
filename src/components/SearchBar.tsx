interface Props {
  value: string;
  onChange: (value: string) => void;
  resultCount: number | null;
}

export function SearchBar({ value, onChange, resultCount }: Props) {
  return (
    <div className="search-bar">
      <span className="search-bar-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="find a stepper, an antenna, a screen..."
        className="search-bar-input"
        aria-label="Search inventory"
      />
      {value && resultCount !== null && (
        <span className="search-bar-count">{resultCount} found</span>
      )}
    </div>
  );
}
