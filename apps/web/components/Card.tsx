export default function Card({ title, value, color }: any) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}>
      <p style={{ color: "#6b7280" }}>{title}</p>

      <h2 style={{ marginTop: 10 }}>{value}</h2>

      <div style={{
        height: 4,
        background: color,
        marginTop: 15,
        borderRadius: 10
      }} />
    </div>
  );
}