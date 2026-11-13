"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import styles from "../dashboard/dashboard.module.css";
import { API_URL } from "../common";

type Participacao = {
  id: number;
  dataParticipacao: string;
  frequencia: string;
  observacoes?: string | null;
  acao: {
    id: number;
    titulo: string;
    status: string;
    dataInicio: string;
    dataFim?: string | null;
  };
};

type Participante = {
  id: number;
  pessoaId: number;
  escolaridade?: string | null;
  nomeResponsavel?: string | null;
  telResponsavel?: string | null;
  observacoes?: string | null;
  pessoa: {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento?: string | null;
    sexo?: string | null;
    telefone?: string | null;
    email?: string | null;
    endereco?: string | null;
    municipio?: string | null;
    uf?: string | null;
  };
  participacoes: Participacao[];
};

function formatarData(data?: string | null) {
  if (!data) {
    return "Não informada";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return data;
  }

  return valor.toLocaleDateString("pt-BR");
}

function formatarStatus(status: string) {
  switch (status) {
    case "EM_ANDAMENTO":
      return "Em andamento";
    case "CONCLUIDA":
      return "Concluída";
    case "PLANEJADA":
      return "Planejada";
    case "CANCELADA":
      return "Cancelada";
    default:
      return status;
  }
}

function formatarFrequencia(frequencia: string) {
  switch (frequencia) {
    case "PRESENTE":
      return "Presente";
    case "AUSENTE":
      return "Ausente";
    case "JUSTIFICADO":
      return "Justificado";
    default:
      return frequencia;
  }
}

function acaoEmAndamento(participacao: Participacao) {
  return participacao.acao.status === "EM_ANDAMENTO";
}

function acaoAnterior(participacao: Participacao) {
  return participacao.acao.status === "CONCLUIDA";
}

const mutedText: CSSProperties = {
  fontSize: 13,
  color: "#64748b",
};

export default function Pacientes() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregarParticipantes() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch(`${API_URL}/participantes`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar participantes: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        setParticipantes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar participantes:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os participantes."
        );

        setParticipantes([]);
      } finally {
        setLoading(false);
      }
    }

    carregarParticipantes();
  }, []);

  const participantesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return participantes;
    }

    return participantes.filter((participante) => {
      const nome = participante.pessoa.nome.toLowerCase();
      const cpf = participante.pessoa.cpf.toLowerCase();
      const email = participante.pessoa.email?.toLowerCase() || "";

      return (
        nome.includes(termo) ||
        cpf.includes(termo) ||
        email.includes(termo)
      );
    });
  }, [participantes, busca]);

  const participantesAtuais = useMemo(() => {
    return participantesFiltrados
      .map((participante) => ({
        ...participante,
        participacoes: participante.participacoes.filter(acaoEmAndamento),
      }))
      .filter((participante) => participante.participacoes.length > 0);
  }, [participantesFiltrados]);

  const participantesSemAcoes = useMemo(() => {
    return participantesFiltrados.filter(
      (participante) => participante.participacoes.length === 0
    );
  }, [participantesFiltrados]);

  const participantesHistoricos = useMemo(() => {
    return participantesFiltrados
      .map((participante) => ({
        ...participante,
        participacoes: participante.participacoes.filter(acaoAnterior),
      }))
      .filter((participante) => participante.participacoes.length > 0);
  }, [participantesFiltrados]);

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
        {/* HEADER */}
        <div className={styles.header}>
          <h1>Pacientes</h1>
          <p>
            Participantes das ações extensionistas em andamento e histórico de
            ações anteriores.
          </p>
        </div>

        {/* TOP ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
            gap: 16,
            flexWrap: "wrap",
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
            type="text"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Nome, CPF ou e-mail"
            aria-label="Buscar paciente"
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
          href="/pacientes/novo"
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
          Novo Paciente
        </Link>

        </div>

        {loading && (
          <div className={styles.box}>
            <p style={mutedText}>Carregando participantes...</p>
          </div>
        )}

        {erro && (
          <div
            className={styles.box}
            style={{ marginBottom: 20, border: "1px solid #fecaca" }}
          >
            <strong style={{ color: "#dc2626" }}>
              Erro ao carregar participantes
            </strong>
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>
              {erro}
            </p>
          </div>
        )}

        {!loading && (
          <>
            <Secao
              titulo="Participantes em ações em andamento"
              descricao="Participantes atualmente vinculados a ações em andamento."
              total={participantesAtuais.length}
              vazio="Nenhum participante encontrado em ações em andamento."
            >
              {participantesAtuais.map((participante) => (
                <CartaoParticipante
                  key={participante.id}
                  participante={participante}
                  badge="Participante atual"
                  tituloLista="Ações em andamento"
                  detalhado={false}
                />
              ))}
            </Secao>

            <Secao
              titulo="Pacientes sem ações"
              descricao="Pacientes cadastrados que ainda não participaram de nenhuma ação."
              total={participantesSemAcoes.length}
              vazio="Nenhum paciente sem ações encontrado."
            >
              {participantesSemAcoes.map((participante) => (
                <CartaoParticipante
                  key={participante.id}
                  participante={participante}
                  badge="Sem ações"
                  tituloLista=""
                  detalhado={false}
                />
              ))}
            </Secao>

            <Secao
              titulo="Participantes de ações anteriores"
              descricao="Histórico de participantes de ações já concluídas."
              total={participantesHistoricos.length}
              vazio="Nenhum participante encontrado no histórico de ações anteriores."
            >
              {participantesHistoricos.map((participante) => (
                <CartaoParticipante
                  key={participante.id}
                  participante={participante}
                  badge="Histórico"
                  tituloLista="Histórico de ações"
                  detalhado
                />
              ))}
            </Secao>
          </>
        )}
      </main>
    </div>
  );
}

function Secao({
  titulo,
  descricao,
  total,
  vazio,
  children,
}: {
  titulo: string;
  descricao: string;
  total: number;
  vazio: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>{titulo}</h2>
          <p style={{ ...mutedText, marginTop: 4 }}>{descricao}</p>
        </div>

        <span
          style={{
            background: "#eff6ff",
            color: "#2563eb",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {total} {total === 1 ? "participante" : "participantes"}
        </span>
      </div>

      {total === 0 ? (
        <div className={styles.box}>
          <p style={{ ...mutedText, textAlign: "center" }}>{vazio}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>{children}</div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "10px 14px",
        borderRadius: 10,
      }}
    >
      <strong style={{ fontSize: 13, color: "#64748b" }}>{label}</strong>
      <div style={{ fontSize: 14, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function CartaoParticipante({
  participante,
  badge,
  tituloLista,
  detalhado,
}: {
  participante: Participante;
  badge: string;
  tituloLista: string;
  detalhado: boolean;
}) {
  const { pessoa } = participante;
  const atual = participante.participacoes.length > 0 && !detalhado;
  const semAcoes = participante.participacoes.length === 0;

  return (
    <article className={styles.box}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
            {pessoa.nome.charAt(0)}
          </div>

          <div>
            <strong>{pessoa.nome}</strong>
            <p style={mutedText}>CPF: {pessoa.cpf}</p>
          </div>
        </div>

        <span
          style={{
            background: semAcoes ? "#f1f5f9" : atual ? "#dcfce7" : "#eff6ff",
            color: semAcoes ? "#64748b" : atual ? "#16a34a" : "#2563eb",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      </div>

      {!detalhado && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {pessoa.email && <Info label="E-mail" value={pessoa.email} />}
          {pessoa.telefone && <Info label="Telefone" value={pessoa.telefone} />}
          {participante.escolaridade && (
            <Info label="Escolaridade" value={participante.escolaridade} />
          )}
        </div>
      )}

      {!semAcoes && (
        <h4
          style={{
            marginTop: 22,
            marginBottom: 12,
            color: "#64748b",
            fontSize: 14,
          }}
        >
          {tituloLista}
        </h4>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {participante.participacoes.map((participacao) => (
          <div
            key={participacao.id}
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: 14,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>{participacao.acao.titulo}</strong>

            <div style={mutedText}>
              Status: {formatarStatus(participacao.acao.status)}
            </div>
            <div style={mutedText}>
              Data da participação: {formatarData(participacao.dataParticipacao)}
            </div>
            <div style={mutedText}>
              Frequência: {formatarFrequencia(participacao.frequencia)}
            </div>

            {detalhado && participacao.acao.dataInicio && (
              <div style={mutedText}>
                Início da ação: {formatarData(participacao.acao.dataInicio)}
              </div>
            )}

            {detalhado && participacao.acao.dataFim && (
              <div style={mutedText}>
                Término da ação: {formatarData(participacao.acao.dataFim)}
              </div>
            )}

            {participacao.observacoes && (
              <div style={mutedText}>
                Observações: {participacao.observacoes}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
