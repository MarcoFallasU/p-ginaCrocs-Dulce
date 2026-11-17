/** Marcador del contenido de una pestaña mientras carga: el resto del panel (cabecera y pestañas) no se mueve. */
export default function AdminSkeleton() {
  const bar = (w: string, h = 18): React.CSSProperties => ({ width: w, height: h, borderRadius: 6, background: "#F3E8F9" });
  return (
    <div aria-busy="true" aria-label="Cargando" role="status" style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 24 }}>
      <div style={bar("180px")} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: "2px solid #F3E8F9" }}>
          <div style={{ ...bar("88px", 66), borderRadius: 8 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            <div style={bar("40%")} />
            <div style={bar("25%", 14)} />
          </div>
        </div>
      ))}
    </div>
  );
}
