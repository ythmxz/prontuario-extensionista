"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";
import { API_URL } from "../common";
import ProtectedArea from "@/components/ProtectedArea";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  User,
} from "lucide-react";

type Atendimento = {
  id: number;
  dataAtendimento: string;
  tipoAtendimento: string;
  motivoConsulta: string;
  prontuario: {
    participante: {
      pessoa: { nome: string };
    };
  };
};

const TIPOS: Record<string, string> = {
  CONSULTA: "Consulta",
  TRIAGEM: "Triagem",
  ORIENTACAO: "Orientação",
  ACOMPANHAMENTO: "Acompanhamento",
  OUTRO: "Outro",
};

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function mesmoDia(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatarHora(data: Date) {
  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Agenda() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    async function carregar() {
      try {
        const response = await fetch(`${API_URL}/atendimentos`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar atendimentos: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setAtendimentos(Array.isArray(data) ? data : []);
        setAgora(new Date());
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os atendimentos."
        );
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const atendimentosHoje = useMemo(() => {
    return atendimentos
      .filter((a) => mesmoDia(new Date(a.dataAtendimento), agora))
      .sort(
        (a, b) =>
          new Date(a.dataAtendimento).getTime() -
          new Date(b.dataAtendimento).getTime()
      );
  }, [atendimentos, agora]);

  const pendentesHoje = atendimentosHoje.filter(
    (a) => new Date(a.dataAtendimento) > agora
  ).length;

  const diasComAtendimento = useMemo(() => {
    const dias = new Set<number>();

    atendimentos.forEach((a) => {
      const data = new Date(a.dataAtendimento);

      if (
        data.getFullYear() === agora.getFullYear() &&
        data.getMonth() === agora.getMonth()
      ) {
        dias.add(data.getDate());
      }
    });

    return dias;
  }, [atendimentos, agora]);

  // Calendário do mês atual, semana começando na segunda-feira
  const diasDoMes = new Date(
    agora.getFullYear(),
    agora.getMonth() + 1,
    0
  ).getDate();
  const deslocamento =
    (new Date(agora.getFullYear(), agora.getMonth(), 1).getDay() + 6) % 7;

  const calendario: (string | number | null)[] = [
    "S",
    "T",
    "Q",
    "Q",
    "S",
    "S",
    "D",
    ...Array.from({ length: deslocamento }, () => null),
    ...Array.from({ length: diasDoMes }, (_, i) => i + 1),
  ];

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
              title="Atendimentos Hoje"
              value={loading ? "-" : atendimentosHoje.length}
              icon={<CalendarDays size={18} />}
            />

            <MiniCard
              title="Pendentes"
              value={loading ? "-" : pendentesHoje}
              icon={<Clock3 size={18} />}
            />
          </div>

          {/* BUTTON */}
          <Link
            href="/agenda/novo"
            style={{
              background: "#2563eb",
              color: "white",
              borderRadius: 14,
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              height: "fit-content",
              textDecoration: "none",
            }}
          >
            <Plus size={18} />
            Novo Atendimento
          </Link>
        </div>

        {erro && (
          <div
            className={styles.box}
            style={{ marginBottom: 20, border: "1px solid #fecaca" }}
          >
            <strong style={{ color: "#dc2626" }}>
              Erro ao carregar atendimentos
            </strong>
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>
              {erro}
            </p>
          </div>
        )}

        {/* CONTENT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 20,
          }}
        >
          {/* ATENDIMENTOS */}
          <div className={styles.box}>
            <h3>Atendimentos de Hoje</h3>

            <div style={{ marginTop: 20 }}>
              {loading ? (
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Carregando atendimentos...
                </p>
              ) : atendimentosHoje.length === 0 ? (
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  Nenhum atendimento agendado para hoje.
                </p>
              ) : (
                atendimentosHoje.map((atendimento) => {
                  const data = new Date(atendimento.dataAtendimento);

                  return (
                    <Appointment
                      key={atendimento.id}
                      hour={formatarHora(data)}
                      patient={atendimento.prontuario.participante.pessoa.nome}
                      type={
                        TIPOS[atendimento.tipoAtendimento] ??
                        atendimento.tipoAtendimento
                      }
                      status={data > agora ? "Pendente" : "Realizado"}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* CALENDÁRIO */}
          <div className={styles.box}>
            <h3>
              {MESES[agora.getMonth()]} {agora.getFullYear()}
            </h3>

            <div
              style={{
                marginTop: 20,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 10,
                textAlign: "center",
              }}
            >
              {calendario.map((item, index) => {
                const hoje = item === agora.getDate();
                const temAtendimento =
                  typeof item === "number" && diasComAtendimento.has(item);

                return (
                  <div
                    key={index}
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      background: hoje ? "#2563eb" : "transparent",
                      color: hoje ? "white" : "#0f172a",
                      fontWeight: typeof item === "number" ? 600 : 400,
                      position: "relative",
                    }}
                  >
                    {item}

                    {temAtendimento && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: hoje ? "white" : "#2563eb",
                        }}
                      />
                    )}
                  </div>
                );
              })}
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
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
}) {
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

        <div className={styles.icon}>{icon}</div>
      </div>

      <h2 style={{ marginTop: 10 }}>{value}</h2>
    </div>
  );
}

function Appointment({
  hour,
  patient,
  type,
  status,
}: {
  hour: string;
  patient: string;
  type: string;
  status: string;
}) {
  const realizado = status === "Realizado";

  return (
    <ProtectedArea>
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
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: realizado ? "#dcfce7" : "#fef9c3",
            color: realizado ? "#16a34a" : "#ca8a04",
          }}
        >
          {realizado && <CheckCircle2 size={12} />}
          {status}
        </span>
      </div>
    </ProtectedArea>
  );
}
