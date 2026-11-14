interface Props {
  size: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

/** Botón redondo de talla, usado en las tarjetas y en el filtro del catálogo. */
export default function SizeButton({ size, active, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      className={`hq-press ${className}`.trim()}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Talla ${size}`}
      style={{
        width: 44, height: 44, padding: 0, borderRadius: "50%",
        border: `1.5px solid ${active ? "#34184A" : "#E7D2F4"}`,
        background: active ? "#34184A" : "#FFFFFF",
        color: active ? "#FFFFFF" : "#34184A",
        fontSize: 15, fontWeight: 700, fontVariantNumeric: "tabular-nums", cursor: "pointer",
      }}
    >
      {size}
    </button>
  );
}
