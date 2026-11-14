const dot = { width: 11, height: 11, borderRadius: "50%", background: "#B571DC", border: "2px solid #34184A" } as const;

export default function Dots() {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", gap: 4 }}>
      <span style={dot} />
      <span style={dot} />
      <span style={dot} />
    </span>
  );
}
