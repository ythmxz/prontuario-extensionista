"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import styles from "../../dashboard/dashboard.module.css";
import { API_URL } from "../../common";

type PacienteOpcao = {
  id: number;
  pessoa: { nome: string; cpf: string };
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

async function buscarLista<T>(caminho: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${caminho}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Erro ao carregar dados (${caminho}): ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export default function NovoProntuarioPage() {
  const router = useRouter();

  const [pacientes, setPacientes] = useState<PacienteOpcao[]>([]);

  const [participanteId, setParticipanteId] = useState("");
  const [numeroProntuario, setNumeroProntuario] = useState("");
  const [dataAbertura, setDataAbertura] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [alergias, setAlergias] = useState("");
  const [obsGerais, setObsGerais] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [participantes, prontuarios] = await Promise.all([
          buscarLista<PacienteOpcao>("/participantes"),
          buscarLista<{ participanteId: number }>("/prontuarios"),
        ]);

        // Cada paciente só pode ter um prontuário
        const comProntuario = new Set(prontuarios.map((p) => p.participanteId));

        setPacientes(participantes.filter((p) => !comProntuario.has(p.id)));
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

      const response = await fetch(`${API_URL}/prontuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participanteId: Number(participanteId),
          numeroProntuario,
          dataAbertura: dataAbertura || undefined,
          tipoSanguineo,
          alergias,
          obsGerais,
        }),
      });

      if (!response.ok) {
        let mensagem = "Não foi possível cadastrar o prontuário.";

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
        router.push("/prontuarios");
        router.refresh();
      }, 500);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao cadastrar o prontuário."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
        <Link
          href="/prontuarios"
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
          Voltar para prontuários
        </Link>

        <div className={styles.header} style={{ marginTop: 16 }}>
          <h1>Novo Prontuário</h1>
          <p>Preencha os dados abaixo para abrir um novo prontuário.</p>
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
            Prontuário cadastrado com sucesso! Redirecionando...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles.box}
          style={{ marginTop: 20, maxWidth: 800 }}
        >
          <div style={{ marginBottom: 18 }}>
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
                  {carregando
                    ? "Carregando..."
                    : pacientes.length === 0
                    ? "Todos os pacientes já possuem prontuário"
                    : "Selecione o paciente"}
                </option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.pessoa.nome} — {paciente.pessoa.cpf}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div style={grid}>
            <Campo label="Número do prontuário" htmlFor="numeroProntuario">
              <input
                id="numeroProntuario"
                type="text"
                value={numeroProntuario}
                onChange={(e) => setNumeroProntuario(e.target.value)}
                placeholder="Gerado automaticamente se vazio"
                maxLength={30}
                style={inputStyle}
              />
            </Campo>

            <Campo label="Data de abertura" htmlFor="dataAbertura">
              <input
                id="dataAbertura"
                type="date"
                value={dataAbertura}
                onChange={(e) => setDataAbertura(e.target.value)}
                style={inputStyle}
              />
            </Campo>
          </div>

          <div style={{ marginBottom: 18 }}>
            <Campo label="Tipo sanguíneo" htmlFor="tipoSanguineo">
              <select
                id="tipoSanguineo"
                value={tipoSanguineo}
                onChange={(e) => setTipoSanguineo(e.target.value)}
                style={inputStyle}
              >
                <option value="">Não informado</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  )
                )}
              </select>
            </Campo>
          </div>

          <div style={{ marginBottom: 18 }}>
            <Campo label="Alergias" htmlFor="alergias">
              <textarea
                id="alergias"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Campo>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Campo label="Observações gerais" htmlFor="obsGerais">
              <textarea
                id="obsGerais"
                value={obsGerais}
                onChange={(e) => setObsGerais(e.target.value)}
                rows={4}
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
              href="/prontuarios"
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
              {loading ? "Cadastrando..." : "Cadastrar Prontuário"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
