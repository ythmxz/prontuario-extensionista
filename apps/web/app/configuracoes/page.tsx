"use client";

import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";

import {
  User,
  Bell,
  Shield,
  Moon,
  Save,
} from "lucide-react";

export default function Configuracoes() {
  return (
    <div className={styles.container}>

      <Sidebar />

      <main className={styles.main}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1>Configurações</h1>
          <p>Gerencie preferências e segurança</p>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >

          {/* PERFIL */}
          <div className={styles.box}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 25,
              }}
            >
              <User size={20} />
              <h3>Perfil</h3>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Nome
              </label>

              <input
                defaultValue="João Silva"
                style={input}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Email
              </label>

              <input
                defaultValue="joao@email.com"
                style={input}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Cargo
              </label>

              <input
                defaultValue="Administrador"
                style={input}
              />
            </div>

            <button style={buttonPrimary}>
              <Save size={18} />
              Salvar Alterações
            </button>

          </div>

          {/* SEGURANÇA */}
          <div className={styles.box}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 25,
              }}
            >
              <Shield size={20} />
              <h3>Segurança</h3>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Senha Atual
              </label>

              <input
                type="password"
                placeholder="********"
                style={input}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Nova Senha
              </label>

              <input
                type="password"
                placeholder="********"
                style={input}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={label}>
                Confirmar Senha
              </label>

              <input
                type="password"
                placeholder="********"
                style={input}
              />
            </div>

            <button style={buttonPrimary}>
              Alterar Senha
            </button>

          </div>

        </div>

        {/* PREFERÊNCIAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginTop: 20,
          }}
        >

          {/* NOTIFICAÇÕES */}
          <div className={styles.box}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 25,
              }}
            >
              <Bell size={20} />
              <h3>Notificações</h3>
            </div>

            <ToggleItem
              title="Receber notificações"
              description="Atualizações do sistema"
            />

            <ToggleItem
              title="Alertas de consultas"
              description="Avisos automáticos"
            />

            <ToggleItem
              title="Emails administrativos"
              description="Relatórios e desempenho"
            />

          </div>

          {/* APARÊNCIA */}
          <div className={styles.box}>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 25,
              }}
            >
              <Moon size={20} />
              <h3>Aparência</h3>
            </div>

            <ToggleItem
              title="Modo Escuro"
              description="Ativar tema dark"
            />

            <ToggleItem
              title="Animações"
              description="Ativar transições"
            />

            <ToggleItem
              title="Compactar Layout"
              description="Reduzir espaçamentos"
            />

          </div>

        </div>

      </main>
    </div>
  );
}

function ToggleItem({
  title,
  description,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >

      <div>
        <strong>{title}</strong>

        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            marginTop: 4,
          }}
        >
          {description}
        </p>
      </div>

      {/* TOGGLE */}
      <div
        style={{
          width: 50,
          height: 28,
          background: "#2563eb",
          borderRadius: 999,
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >

        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
          }}
        />

      </div>

    </div>
  );
}

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  marginTop: 8,
  outline: "none",
  fontSize: 14,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
};

const buttonPrimary = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "14px 18px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontWeight: 600,
};
