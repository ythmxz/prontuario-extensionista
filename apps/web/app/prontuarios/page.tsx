"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";
import { API_URL } from "../common";

import { FileText, Search, Plus, Eye, EyeOff } from "lucide-react";

type AtendimentoResumo = {
  id: number;
  dataAtendimento: string;
  tipoAtendimento: string;
  motivoConsulta: string;
};

type Prontuario = {
  id: number;
  participanteId: number;
  numeroProntuario: string;
  dataAbertura: string;
  tipoSanguineo?: string | null;
  alergias?: string | null;
  obsGerais?: string | null;
  participante: {
    pessoa: { nome: string; cpf: string; email?: string | null };
  };
  atendimentos: AtendimentoResumo[];
};

const TIPOS: Record<string, string> = {
  CONSULTA: "Consulta",
  TRIAGEM: "Triagem",
  ORIENTACAO: "Orientação",
  ACOMPANHAMENTO: "Acompanhamento",
  OUTRO: "Outro",
};

function formatarData(data?: string | null) {
  if (!data) {
    return "-";
  }

  const valor = new Date(data);

  return Number.isNaN(valor.getTime())
    ? data
    : valor.toLocaleDateString("pt-BR");
}

function mesmoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function Prontuarios() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await fetch(`${API_URL}/prontuarios`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar prontuários: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setProntuarios(Array.isArray(data) ? data : []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os prontuários."
        );
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return prontuarios;
    }

    return prontuarios.filter((p) => {
      const { nome, cpf, email } = p.participante.pessoa;

      return (
        nome.toLowerCase().includes(termo) ||
        cpf.includes(termo) ||
        (email?.toLowerCase().includes(termo) ?? false) ||
        p.numeroProntuario.toLowerCase().includes(termo)
      );
    });
  }, [prontuarios, busca]);

  const hoje = new Date();

  const atualizadosHoje = prontuarios.filter((p) =>
    p.atendimentos.some((a) => mesmoDia(new Date(a.dataAtendimento), hoje))
  ).length;

  const comAtendimentos = prontuarios.filter(
    (p) => p.atendimentos.length > 0
  ).length;

  const semAtendimentos = prontuarios.length - comAtendimentos;

  const valor = (n: number) => (loading ? "-" : n);

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
            value={valor(prontuarios.length)}
            icon={<FileText size={18} />}
            color="#2563eb"
          />

          <TopCard
            title="Atualizados Hoje"
            value={valor(atualizadosHoje)}
            icon={<FileText size={18} />}
            color="#16a34a"
          />

          <TopCard
            title="Com Atendimentos"
            value={valor(comAtendimentos)}
            icon={<FileText size={18} />}
            color="#ea580c"
          />

          <TopCard
            title="Sem Atendimentos"
            value={valor(semAtendimentos)}
            icon={<FileText size={18} />}
            color="#9333ea"
          />
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
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
          <Link
            href="/prontuarios/novo"
            style={{
              background: "#2563eb",
              color: "white",
              borderRadius: 14,
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={18} />
            Novo Prontuário
          </Link>
        </div>

        {erro && (
          <div
            className={styles.box}
            style={{ marginBottom: 20, border: "1px solid #fecaca" }}
          >
            <strong style={{ color: "#dc2626" }}>
              Erro ao carregar prontuários
            </strong>
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>
              {erro}
            </p>
          </div>
        )}

        {/* TABLE */}
        <div className={styles.box}>
          {loading ? (
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Carregando prontuários...
            </p>
          ) : filtrados.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Nenhum prontuário encontrado.
            </p>
          ) : (
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
                  <th>Nº Prontuário</th>
                  <th>Última Atualização</th>
                  <th>Tipo Sanguíneo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((prontuario) => (
                  <RecordRow
                    key={prontuario.id}
                    prontuario={prontuario}
                    aberto={aberto === prontuario.id}
                    onToggle={() =>
                      setAberto(aberto === prontuario.id ? null : prontuario.id)
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
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
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}) {
  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p>{title}</p>

        <div className={styles.icon} style={{ color }}>
          {icon}
        </div>
      </div>

      <h2 style={{ marginTop: 10 }}>{value}</h2>
    </div>
  );
}

function RecordRow({
  prontuario,
  aberto,
  onToggle,
}: {
  prontuario: Prontuario;
  aberto: boolean;
  onToggle: () => void;
}) {
  const { pessoa } = prontuario.participante;
  const ultimo = prontuario.atendimentos[0];
  const comAtendimentos = prontuario.atendimentos.length > 0;

  return (
    <Fragment>
      <tr style={{ borderTop: "1px solid #e2e8f0" }}>
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
              {pessoa.nome.charAt(0)}
            </div>

            <div>
              <strong>{pessoa.nome}</strong>

              <p style={{ fontSize: 13, color: "#64748b" }}>
                {pessoa.email || `CPF: ${pessoa.cpf}`}
              </p>
            </div>
          </div>
        </td>

        <td>{prontuario.numeroProntuario}</td>

        <td>
          {formatarData(
            ultimo ? ultimo.dataAtendimento : prontuario.dataAbertura
          )}
        </td>

        <td>{prontuario.tipoSanguineo || "-"}</td>

        <td>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              background: comAtendimentos ? "#dcfce7" : "#fef9c3",
              color: comAtendimentos ? "#16a34a" : "#ca8a04",
            }}
          >
            {comAtendimentos
              ? `${prontuario.atendimentos.length} ${
                  prontuario.atendimentos.length === 1
                    ? "atendimento"
                    : "atendimentos"
                }`
              : "Sem atendimentos"}
          </span>
        </td>

        <td>
          <button
            onClick={onToggle}
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
            {aberto ? <EyeOff size={16} /> : <Eye size={16} />}
            {aberto ? "Ocultar" : "Visualizar"}
          </button>
        </td>
      </tr>

      {aberto && (
        <tr>
          <td colSpan={6} style={{ paddingBottom: 18 }}>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: 16,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <div>
                <strong>Abertura:</strong> {formatarData(prontuario.dataAbertura)}
              </div>
              <div>
                <strong>CPF:</strong> {pessoa.cpf}
              </div>
              <div>
                <strong>Alergias:</strong> {prontuario.alergias || "Não informadas"}
              </div>
              <div>
                <strong>Observações gerais:</strong>{" "}
                {prontuario.obsGerais || "Nenhuma"}
              </div>

              <h4 style={{ marginTop: 14, marginBottom: 8, color: "#64748b" }}>
                Histórico de atendimentos
              </h4>

              {comAtendimentos ? (
                prontuario.atendimentos.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: 8,
                      marginTop: 8,
                    }}
                  >
                    <strong>
                      {formatarData(a.dataAtendimento)} —{" "}
                      {TIPOS[a.tipoAtendimento] ?? a.tipoAtendimento}
                    </strong>
                    <div style={{ color: "#64748b" }}>{a.motivoConsulta}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b" }}>
                  Nenhum atendimento registrado.
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
