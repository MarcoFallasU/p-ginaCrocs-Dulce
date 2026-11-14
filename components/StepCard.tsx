export default function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: "2px solid #34184A", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.02em" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, fontWeight: 500, color: "#604872" }}>{children}</p>
    </div>
  );
}
