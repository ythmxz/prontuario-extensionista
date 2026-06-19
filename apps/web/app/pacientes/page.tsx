import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";

import { Search, Plus } from "lucide-react";

export default function Pacientes() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>Pacientes</h1>
          <p>Acompanhe os atendimentos da comunidade</p>
        </div>

        {/* TOP ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
          }}
        >

          {/* SEARCH */}
          <div
            style={{
              background: "white",
              padding: "12px 18px",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: 320,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Search size={18} color="#64748b" />

            <input
              placeholder="Buscar paciente..."
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: 14,
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <Plus size={18} />
            Novo Paciente
          </button>

        </div>

        {/* TABLE */}
        <div className={styles.box}>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>
              <tr
                style={{
                  textAlign: "left",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                <th style={{ paddingBottom: 20 }}>Paciente</th>
                <th>Idade</th>
                <th>Última Consulta</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              <PatientRow
                name="Maria Oliveira"
                age="28"
                date="20/05/2024"
                status="Ativo"
              />

              <PatientRow
                name="João Santos"
                age="35"
                date="18/05/2024"
                status="Ativo"
              />

              <PatientRow
                name="Ana Costa"
                age="42"
                date="15/05/2024"
                status="Inativo"
              />

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}

function PatientRow({
  name,
  age,
  date,
  status,
}: any) {
  return (
    <tr
      style={{
        borderTop: "1px solid #e2e8f0",
      }}
    >

      <td style={{ padding: "18px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            {name.charAt(0)}
          </div>

          <div>
            <strong>{name}</strong>

            <p
              style={{
                fontSize: 13,
                color: "#64748b",
              }}
            >
              paciente@email.com
            </p>
          </div>
        </div>
      </td>

      <td>{age} anos</td>

      <td>{date}</td>

      <td>
        <span
          style={{
            background:
              status === "Ativo"
                ? "#dcfce7"
                : "#fee2e2",

            color:
              status === "Ativo"
                ? "#16a34a"
                : "#dc2626",

            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {status}
        </span>
      </td>

      <td>
        <button
          style={{
            border: "none",
            background: "#eff6ff",
            color: "#2563eb",
            padding: "8px 14px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Ver Perfil
        </button>
      </td>

    </tr>
  );
}
