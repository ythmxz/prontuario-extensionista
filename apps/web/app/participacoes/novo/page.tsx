"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Participante = {
  id: number;
  pessoaId: number;
  escolaridade?: string | null;
  nomeResponsavel?: string | null;
  telResponsavel?: string | null;
  observacoes?: string | null;
  pessoa?: {
    id: number;
    nome: string;
  };
};

type Acao = {
  id: number;
  titulo: string;
  status: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function NovaParticipacaoPage() {
  const router = useRouter();

  const [participantes, setParticipantes] =
    useState<Participante[]>([]);

  const [acoes, setAcoes] = useState<Acao[]>([]);

  const [participanteId, setParticipanteId] =
    useState("");

  const [acaoId, setAcaoId] = useState("");

  const [dataParticipacao, setDataParticipacao] =
    useState("");

  const [frequencia, setFrequencia] =
    useState("");

  const [observacoes, setObservacoes] =
    useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [
          participantesResponse,
          acoesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/participantes`),
          fetch(`${API_URL}/acoes-extensionistas`),
        ]);

        if (
          !participantesResponse.ok ||
          !acoesResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os participantes e as ações."
          );
        }

        const [
          participantesData,
          acoesData,
        ] = await Promise.all([
          participantesResponse.json(),
          acoesResponse.json(),
        ]);

        setParticipantes(participantesData);
        setAcoes(acoesData);

        if (participantesData.length > 0) {
          setParticipanteId(
            String(participantesData[0].id)
          );
        }

        if (acoesData.length > 0) {
          setAcaoId(String(acoesData[0].id));
        }
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");

    if (!participanteId) {
      setErro("Selecione um participante.");
      return;
    }

    if (!acaoId) {
      setErro("Selecione uma ação extensionista.");
      return;
    }

    if (!dataParticipacao) {
      setErro("Informe a data da participação.");
      return;
    }

    if (!frequencia.trim()) {
      setErro("Informe a frequência.");
      return;
    }

    try {
      setSalvando(true);

      const response = await fetch(
        `${API_URL}/participacoes-acao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participanteId: Number(participanteId),
            acaoId: Number(acaoId),
            dataParticipacao:
              `${dataParticipacao}T00:00:00`,
            frequencia: frequencia.trim(),
            observacoes:
              observacoes.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Não foi possível cadastrar a participação."
        );
      }

      router.push("/participacoes");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar a participação."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <Link
          href="/participacoes"
          style={{
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          ← Voltar para participações
        </Link>

        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#222",
          }}
        >
          Nova participação
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          Registre a participação de um participante
          em uma ação extensionista.
        </p>
      </div>

      {erro && (
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            borderRadius: "6px",
            background: "#ffe5e5",
            color: "#b00020",
            border: "1px solid #ffb3b3",
          }}
        >
          {erro}
        </div>
      )}

      {carregando ? (
        <p
          style={{
            color: "#666",
          }}
        >
          Carregando dados...
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div>
            <label
              htmlFor="participanteId"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Participante
            </label>

            <select
              id="participanteId"
              value={participanteId}
              onChange={(event) =>
                setParticipanteId(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <option value="">
                Selecione um participante
              </option>

              {participantes.map((participante) => (
                <option
                  key={participante.id}
                  value={participante.id}
                >
                  {participante.pessoa?.nome ||
                    `Participante #${participante.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="acaoId"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Ação extensionista
            </label>

            <select
              id="acaoId"
              value={acaoId}
              onChange={(event) =>
                setAcaoId(event.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <option value="">
                Selecione uma ação
              </option>

              {acoes.map((acao) => (
                <option
                  key={acao.id}
                  value={acao.id}
                >
                  {acao.titulo} — {acao.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dataParticipacao"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Data da participação
            </label>

            <input
              id="dataParticipacao"
              type="date"
              value={dataParticipacao}
              onChange={(event) =>
                setDataParticipacao(
                  event.target.value
                )
              }
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="frequencia"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Frequência
            </label>

            <input
              id="frequencia"
              type="text"
              value={frequencia}
              onChange={(event) =>
                setFrequencia(event.target.value)
              }
              placeholder="Ex.: PRESENTE"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                boxSizing: "border-box",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "0.4rem",
                color: "#777",
              }}
            >
              Informe o valor de frequência utilizado
              pelo sistema.
            </small>
          </div>

          <div>
            <label
              htmlFor="observacoes"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Observações
            </label>

            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(event) =>
                setObservacoes(event.target.value)
              }
              rows={5}
              placeholder="Observações sobre a participação..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="submit"
              disabled={salvando}
              style={{
                padding: "0.8rem 1.2rem",
                border: "none",
                borderRadius: "6px",
                background: salvando
                  ? "#999"
                  : "#0070f3",
                color: "#fff",
                fontWeight: "bold",
                cursor: salvando
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {salvando
                ? "Salvando..."
                : "Cadastrar participação"}
            </button>

            <Link
              href="/participacoes"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.8rem 1.2rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                color: "#333",
                textDecoration: "none",
              }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}