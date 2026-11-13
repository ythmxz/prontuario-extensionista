"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import styles from "../../dashboard/dashboard.module.css";
import { API_URL } from "../../common";
import ProtectedArea from "@/components/ProtectedArea";

type PacienteOpcao = {
  id: number;
  pessoa: { nome: string; cpf: string };
};

type AcaoOpcao = {
  id: number;
  titulo: string;
};

type ProfissionalOpcao = {
  id: number;
  nome: string;
  tipo?: string;
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  fontSize: 14,
  background: "#fff",
  outline: "none",
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 18,
};

function Campo({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function dataHoraLocal() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 16);
}

async function buscarLista<T>(caminho: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${caminho}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Erro ao carregar dados (${caminho}): ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export default function NovoAtendimentoPage() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState<PacienteOpcao[]>([]);
  const [acoes, setAcoes] = useState<AcaoOpcao[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalOpcao[]>([]);

  const [participanteId, setParticipanteId] = useState("");
  const [acaoId, setAcaoId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState(dataHoraLocal);
  const [retornoPrevisto, setRetornoPrevisto] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [hipoteseDiagnostica, setHipoteseDiagnostica] = useState("");
  const [conduta, setConduta] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [listaPacientes, listaAcoes, listaProfissionais] =
          await Promise.all([
            buscarLista<PacienteOpcao>("/participantes"),
            buscarLista<AcaoOpcao>("/acoes-extensionistas"),
            buscarLista<ProfissionalOpcao>("/atendimentos/profissionais"),
          ]);

        setPacientes(listaPacientes);
        setAcoes(listaAcoes);
        setProfissionais(listaProfissionais);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do formulário."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarOpcoes();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      if (!participanteId) {
        throw new Error("Selecione o paciente.");
      }

      if (!acaoId) {
        throw new Error("Selecione a ação.");
      }

      if (!profissionalId) {
        throw new Error("Selecione o profissional.");
      }

      if (!tipoAtendimento) {
        throw new Error("Selecione o tipo de atendimento.");
      }

      if (!dataAtendimento) {
        throw new Error("Informe a data e hora do atendimento.");
      }

      if (!motivoConsulta.trim()) {
        throw new Error("Informe o motivo da consulta.");
      }

      const response = await fetch(`${API_URL}/atendimentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participanteId: Number(participanteId),
          acaoId: Number(acaoId),
          profissionalId: Number(profissionalId),
          tipoAtendimento,
          dataAtendimento: new Date(dataAtendimento).toISOString(),
          retornoPrevisto: retornoPrevisto || undefined,
          motivoConsulta: motivoConsulta.trim(),
          hipoteseDiagnostica,
          conduta,
        }),
      });

      if (!response.ok) {
        let mensagem = "Não foi possível cadastrar o atendimento.";

        try {
          const resposta = (await response.json()) as { message?: string };
          if (resposta?.message) {
            mensagem = resposta.message;
          }
        } catch {
          // mantém a mensagem padrão
        }

        throw new Error(mensagem);
      }

      setSucesso(true);

      setTimeout(() => {
        router.push("/agenda");
        router.refresh();
      }, 500);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao cadastrar o atendimento."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedArea>
      <div className={styles.container}>
        <Sidebar />

        <main className={styles.main}>
          <Link
            href="/agenda"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <ArrowLeft size={16} />
            Voltar para agenda
          </Link>

          <div className={styles.header} style={{ marginTop: 16 }}>
            <h1>Novo Atendimento</h1>
            <p>Preencha os dados abaixo para registrar um novo atendimento.</p>
          </div>

          {erro && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "#fee2e2",
                color: "#dc2626",
                fontSize: 14,
              }}
            >
              <strong>Erro: </strong>
              {erro}
            </div>
          )}

          {sucesso && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "#dcfce7",
                color: "#16a34a",
                fontSize: 14,
              }}
            >
              Atendimento cadastrado com sucesso! Redirecionando...
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={styles.box}
            style={{ marginTop: 20, maxWidth: 800 }}
          >
            <div style={grid}>
              <Campo label="Paciente *" htmlFor="paciente">
                <select
                  id="paciente"
                  value={participanteId}
                  onChange={(e) => setParticipanteId(e.target.value)}
                  disabled={carregando}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    {carregando ? "Carregando..." : "Selecione o paciente"}
                  </option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.pessoa.nome} — {paciente.pessoa.cpf}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Ação *" htmlFor="acao">
                <select
                  id="acao"
                  value={acaoId}
                  onChange={(e) => setAcaoId(e.target.value)}
                  disabled={carregando}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    {carregando ? "Carregando..." : "Selecione a ação"}
                  </option>
                  {acoes.map((acao) => (
                    <option key={acao.id} value={acao.id}>
                      {acao.titulo}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <div style={grid}>
              <Campo label="Profissional *" htmlFor="profissional">
                <select
                  id="profissional"
                  value={profissionalId}
                  onChange={(e) => setProfissionalId(e.target.value)}
                  disabled={carregando}
                  required
                  style={inputStyle}
                >
                  <option value="">
                    {carregando ? "Carregando..." : "Selecione o profissional"}
                  </option>
                  {profissionais.map((profissional) => (
                    <option key={profissional.id} value={profissional.id}>
                      {profissional.nome}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label="Tipo de atendimento *" htmlFor="tipoAtendimento">
                <select
                  id="tipoAtendimento"
                  value={tipoAtendimento}
                  onChange={(e) => setTipoAtendimento(e.target.value)}
                  required
                  style={inputStyle}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="CONSULTA">Consulta</option>
                  <option value="TRIAGEM">Triagem</option>
                  <option value="ORIENTACAO">Orientação</option>
                  <option value="ACOMPANHAMENTO">Acompanhamento</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </Campo>
            </div>

            <div style={grid}>
              <Campo label="Data e hora *" htmlFor="dataAtendimento">
                <input
                  id="dataAtendimento"
                  type="datetime-local"
                  value={dataAtendimento}
                  onChange={(e) => setDataAtendimento(e.target.value)}
                  required
                  style={inputStyle}
                />
              </Campo>

              <Campo label="Retorno previsto" htmlFor="retornoPrevisto">
                <input
                  id="retornoPrevisto"
                  type="date"
                  value={retornoPrevisto}
                  onChange={(e) => setRetornoPrevisto(e.target.value)}
                  style={inputStyle}
                />
              </Campo>
            </div>

            <div style={{ marginBottom: 18 }}>
              <Campo label="Motivo da consulta *" htmlFor="motivoConsulta">
                <textarea
                  id="motivoConsulta"
                  value={motivoConsulta}
                  onChange={(e) => setMotivoConsulta(e.target.value)}
                  rows={3}
                  required
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Campo>
            </div>

            <div style={{ marginBottom: 18 }}>
              <Campo label="Hipótese diagnóstica" htmlFor="hipoteseDiagnostica">
                <textarea
                  id="hipoteseDiagnostica"
                  value={hipoteseDiagnostica}
                  onChange={(e) => setHipoteseDiagnostica(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Campo>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Campo label="Conduta" htmlFor="conduta">
                <textarea
                  id="conduta"
                  value={conduta}
                  onChange={(e) => setConduta(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Campo>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Link
                href="/agenda"
                style={{
                  padding: "12px 18px",
                  borderRadius: 14,
                  background: "#eff6ff",
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading || carregando}
                style={{
                  background: loading ? "#93c5fd" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "12px 18px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Cadastrando..." : "Cadastrar Atendimento"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedArea>
  );
}
