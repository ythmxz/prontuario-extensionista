export default function Table() {
  return (
    <div style={box}>
      <h3>Últimos Pacientes</h3>

      <table style={{ width: "100%", marginTop: 10 }}>
        <tbody>
          <tr><td>Maria Oliveira</td><td>28 anos</td></tr>
          <tr><td>João Santos</td><td>35 anos</td></tr>
          <tr><td>Ana Costa</td><td>42 anos</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const box = {
  background: "white",
  padding: "20px",
  borderRadius: "15px"
};