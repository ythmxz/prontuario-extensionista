"use client";

import styles from "@/app/dashboard/dashboard.module.css";

export default function Activity() {
  return (
    <div className={styles.box}>
      <h3>Atividades Recentes</h3>

      <div className={styles.activity}>
        <div className={styles.iconCircle}>👤</div>

        <div>
          <strong>Novo paciente cadastrado</strong>
          <p style={{ fontSize: 12, color: "#64748b" }}>
            Maria Oliveira
          </p>
        </div>

        <span style={{ fontSize: 12, color: "#64748b" }}>
          Há 10 min
        </span>
      </div>

      <div className={styles.activity}>
        <div className={styles.iconCircle}>📄</div>

        <div>
          <strong>Prontuário atualizado</strong>
          <p style={{ fontSize: 12, color: "#64748b" }}>
            João Santos
          </p>
        </div>

        <span style={{ fontSize: 12, color: "#64748b" }}>
          Há 25 min
        </span>
      </div>

      <div className={styles.activity}>
        <div className={styles.iconCircle}>📅</div>

        <div>
          <strong>Agendamento realizado</strong>
          <p style={{ fontSize: 12, color: "#64748b" }}>
            Para amanhã, 10:00
          </p>
        </div>

        <span style={{ fontSize: 12, color: "#64748b" }}>
          Há 1h
        </span>
      </div>
    </div>
  );
}