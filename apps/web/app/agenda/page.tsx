import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";

import {
  CalendarDays,
  Clock3,
  Plus,
  User,
} from "lucide-react";

export default function Agenda() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>Agenda</h1>
          <p>Organize os atendimentos e horários</p>
        </div>

        {/* TOP */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
          }}
        >

          {/* CARDS */}
          <div
            style={{
              display: "flex",
              gap: 20,
            }}
          >

            <MiniCard
              title="Consultas Hoje"
              value="12"
              icon={<CalendarDays size={18} />}
            />

            <MiniCard
              title="Pendentes"
              value="4"
              icon={<Clock3 size={18} />}
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
              height: "fit-content",
            }}
          >
            <Plus size={18} />
            Nova Consulta
          </button>

        </div>

        {/* CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
        >

          {/* CONSULTAS */}
          <div className={styles.box}>

            <h3>Consultas de Hoje</h3>

            <div style={{ marginTop: 20 }}>

              <Appointment
                hour="08:00"
                patient="Maria Oliveira"
                type="Consulta"
                status="Confirmada"
              />

              <Appointment
                hour="10:00"
                patient="João Santos"
                type="Retorno"
                status="Pendente"
              />

              <Appointment
                hour="14:00"
                patient="Ana Costa"
                type="Avaliação"
                status="Confirmada"
              />

              <Appointment
                hour="16:00"
                patient="Carlos Lima"
                type="Consulta"
                status="Cancelada"
              />

            </div>

          </div>

          {/* CALENDÁRIO */}
          <div className={styles.box}>

            <h3>Maio 2024</h3>

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 10,
                textAlign: "center",
              }}
            >

              {[
                "S", "T", "Q", "Q", "S", "S", "D",
                1,2,3,4,5,6,7,
                8,9,10,11,12,13,14,
                15,16,17,18,19,20,21,
                22,23,24,25,26,27,28,
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background:
                      item === 24
                        ? "#2563eb"
                        : "transparent",

                    color:
                      item === 24
                        ? "white"
                        : "#0f172a",

                    fontWeight:
                      typeof item === "number"
                        ? 600
                        : 400,
                  }}
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

function MiniCard({
  title,
  value,
  icon,
}: any) {
  return (
    <div
      className={styles.card}
      style={{
        minWidth: 180,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>{title}</p>

        <div className={styles.icon}>
          {icon}
        </div>
      </div>

      <h2 style={{ marginTop: 10 }}>
        {value}
      </h2>
    </div>
  );
}

function Appointment({
  hour,
  patient,
  type,
  status,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >

        {/* HOUR */}
        <div
          style={{
            background: "#eff6ff",
            color: "#2563eb",
            padding: "10px 14px",
            borderRadius: 12,
            fontWeight: 600,
            minWidth: 80,
            textAlign: "center",
          }}
        >
          {hour}
        </div>

        {/* USER */}
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
            }}
          >
            <User size={18} />
          </div>

          <div>
            <strong>{patient}</strong>

            <p
              style={{
                fontSize: 13,
                color: "#64748b",
              }}
            >
              {type}
            </p>
          </div>

        </div>

      </div>

      {/* STATUS */}
      <span
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,

          background:
            status === "Confirmada"
              ? "#dcfce7"
              : status === "Pendente"
              ? "#fef9c3"
              : "#fee2e2",

          color:
            status === "Confirmada"
              ? "#16a34a"
              : status === "Pendente"
              ? "#ca8a04"
              : "#dc2626",
        }}
      >
        {status}
      </span>

    </div>
  );
}
