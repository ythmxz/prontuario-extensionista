"use client";

import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";

import {
  FileText,
  Search,
  Plus,
  Eye,
} from "lucide-react";

export default function Prontuarios() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>Prontuários</h1>
          <p>Acompanhe registros e históricos de atendimento</p>
        </div>

        {/* CARDS */}
        <div className={styles.cards}>

          <TopCard
            title="Prontuários"
            value="1.284"
            icon={<FileText size={18} />}
            color="#2563eb"
          />

          <TopCard
            title="Atualizados Hoje"
            value="18"
            icon={<FileText size={18} />}
            color="#16a34a"
          />

          <TopCard
            title="Pendentes"
            value="7"
            icon={<FileText size={18} />}
            color="#ea580c"
          />

          <TopCard
            title="Arquivados"
            value="312"
            icon={<FileText size={18} />}
            color="#9333ea"
          />

        </div>

        {/* ACTIONS */}
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
              placeholder="Buscar prontuário..."
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
            Novo Prontuário
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
                <th style={{ paddingBottom: 20 }}>
                  Paciente
                </th>

                <th>Última Atualização</th>

                <th>Categoria</th>

                <th>Status</th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>

              <RecordRow
                patient="Maria Oliveira"
                date="20/05/2024"
                category="Cardiologia"
                status="Atualizado"
              />

              <RecordRow
                patient="João Santos"
                date="18/05/2024"
                category="Neurologia"
                status="Pendente"
              />

              <RecordRow
                patient="Ana Costa"
                date="14/05/2024"
                category="Ortopedia"
                status="Arquivado"
              />

              <RecordRow
                patient="Carlos Lima"
                date="10/05/2024"
                category="Dermatologia"
                status="Atualizado"
              />

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}

function TopCard({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <div className={styles.card}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>{title}</p>

        <div
          className={styles.icon}
          style={{
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <h2 style={{ marginTop: 10 }}>
        {value}
      </h2>

    </div>
  );
}

function RecordRow({
  patient,
  date,
  category,
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
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            {patient.charAt(0)}
          </div>

          <div>
            <strong>{patient}</strong>

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

      <td>{date}</td>

      <td>{category}</td>

      <td>

        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,

            background:
              status === "Atualizado"
                ? "#dcfce7"
                : status === "Pendente"
                ? "#fef9c3"
                : "#ede9fe",

            color:
              status === "Atualizado"
                ? "#16a34a"
                : status === "Pendente"
                ? "#ca8a04"
                : "#7c3aed",
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
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Eye size={16} />
          Visualizar
        </button>

      </td>

    </tr>
  );
}
