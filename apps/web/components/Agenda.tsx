"use client";

import styles from "@/app/dashboard/dashboard.module.css";

export default function Agenda() {
  return (
    <div className={styles.box}>
      <h3>Agenda do Dia</h3>

      <p style={{ fontSize: 13, color: "#64748b", marginTop: 5 }}>
        24 de Maio, 2024
      </p>

      <div className={styles.agendaItem}>
        <span>08:00 - Maria Oliveira</span>
        <span className={styles.badgeBlue}>Consulta</span>
      </div>

      <div className={styles.agendaItem}>
        <span>10:00 - João Santos</span>
        <span className={styles.badgeGreen}>Retorno</span>
      </div>

      <div className={styles.agendaItem}>
        <span>14:00 - Ana Costa</span>
        <span className={styles.badgeBlue}>Consulta</span>
      </div>

      <div className={styles.agendaItem}>
        <span>16:00 - Carlos Lima</span>
        <span className={styles.badgeOrange}>Avaliação</span>
      </div>

      <p
        style={{
          marginTop: 15,
          color: "#2563eb",
          fontSize: 14,
          cursor: "pointer"
        }}
      >
        Ver agenda completa
      </p>
    </div>
  );
}