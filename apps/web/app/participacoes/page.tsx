"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Participacao = {
  id: number;
  participanteId: number;
  acaoId: number;
  dataParticipacao: string;
  frequencia: string;
  observacoes?: string | null;
};

type Participante = {
  id: number;
  pessoaId: number;
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

export default function ParticipacoesPage() {
  const [participacoes, setParticipacoes] =
    useState<Participacao[]>([]);

  const [participantes, setParticipantes] =
    useState<Participante[]>([]);

  const [acoes, setAcoes] = useState<Acao[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [
          participacoesResponse,
          participantesResponse,
          acoesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/participacoes-acao`),
          fetch(`${API_URL}/participantes`),
          fetch(`${API_URL}/acoes-extensionistas`),
        ]);

        if (
          !participacoesResponse.ok ||
          !participantesResponse.ok ||
          !acoesResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar as participações."
          );
        }

        const [
          participacoesData,
          participantesData,
          acoesData,
        ] = await Promise.all([
          participacoesResponse.json(),
          participantesResponse.json(),
          acoesResponse.json(),
        ]);

        setParticipacoes(participacoesData);
        setParticipantes(participantesData);
        setAcoes(acoesData);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar as participações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const participantePorId = useMemo(() => {
    return new Map(
      participantes.map((participante) => [
        participante.id,
        participante,
      ])
    );
  }, [participantes]);

  const acaoPorId = useMemo(() => {
    return new Map(
      acoes.map((acao) => [acao.id, acao])
    );
  }, [acoes]);

  function obterNomeParticipante(
    participanteId: number
  ) {
    const participante =
      participantePorId.get(participanteId);

    return (
      participante?.pessoa?.nome ||
      `Participante #${participanteId}`
    );
  }

  function formatarData(data: string) {
    const somenteData = data.includes("T")
      ? data.split("T")[0]
      : data;

    const partes = somenteData.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#222",
            }}
          >
            Participações
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#666",
            }}
          >
            Registros de participação dos
            participantes nas ações extensionistas.
          </p>
        </div>

        <Link
          href="/participacoes/novo"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            background: "#0070f3",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Nova participação
        </Link>
      </div>

      {erro && (
        <div
          style={{
            marginTop: "1.5rem",
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
            marginTop: "2rem",
            color: "#666",
          }}
        >
          Carregando participações...
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <div
              style={{
                padding: "1.25rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f8f8f8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: "1.8rem",
                }}
              >
                {participacoes.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Registros
              </span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f8f8f8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: "1.8rem",
                }}
              >
                {participantes.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Participantes
              </span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f8f8f8",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: "1.8rem",
                }}
              >
                {acoes.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Ações
              </span>
            </div>
          </div>

          <section
            style={{
              marginTop: "2rem",
            }}
          >
            <h2
              style={{
                marginBottom: "1rem",
                color: "#222",
              }}
            >
              Registros de participação
            </h2>

            {participacoes.length === 0 ? (
              <div
                style={{
                  padding: "1.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  color: "#666",
                }}
              >
                Nenhuma participação cadastrada.
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "850px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f5f5f5",
                      }}
                    >
                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Participante
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Ação
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Data
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Frequência
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Status da ação
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Observações
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {participacoes.map(
                      (participacao) => {
                        const acao = acaoPorId.get(
                          participacao.acaoId
                        );

                        return (
                          <tr key={participacao.id}>
                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                              }}
                            >
                              {
                                obterNomeParticipante(
                                  participacao.participanteId
                                )
                              }
                            </td>

                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                              }}
                            >
                              {acao?.titulo ||
                                `Ação #${participacao.acaoId}`}
                            </td>

                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                              }}
                            >
                              {formatarData(
                                participacao.dataParticipacao
                              )}
                            </td>

                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                              }}
                            >
                              {participacao.frequencia}
                            </td>

                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                              }}
                            >
                              {acao?.status || "-"}
                            </td>

                            <td
                              style={{
                                padding: "0.9rem",
                                borderBottom:
                                  "1px solid #eee",
                                color: "#666",
                              }}
                            >
                              {participacao.observacoes ||
                                "-"}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <Link
              href="/participantes"
              style={{
                color: "#0070f3",
                textDecoration: "none",
              }}
            >
              ← Ver participantes
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
