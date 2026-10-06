"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

function formatarData(
  data?: string | null
) {
  if (!data) {
    return "Não informada";
  }

  const valor = new Date(data);

  if (Number.isNaN(valor.getTime())) {
    return data;
  }

  return valor.toLocaleDateString(
    "pt-BR"
  );
}

function formatarStatus(
  status: string
) {
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

function formatarFrequencia(
  frequencia: string
) {
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

function acaoEmAndamento(
  participacao: Participacao
) {
  return (
    participacao.acao.status ===
    "EM_ANDAMENTO"
  );
}

function acaoAnterior(
  participacao: Participacao
) {
  return (
    participacao.acao.status ===
    "CONCLUIDA"
  );
}

export default function ParticipantesPage() {
  const [participantes, setParticipantes] =
    useState<Participante[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const [busca, setBusca] =
    useState("");

  useEffect(() => {
    async function carregarParticipantes() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch(
          "http://localhost:3333/participantes",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar participantes: ${response.status} ${response.statusText}`
          );
        }

        const data =
          await response.json();

        setParticipantes(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Erro ao buscar participantes:",
          error
        );

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

  const participantesFiltrados =
    useMemo(() => {
      const termo =
        busca.trim().toLowerCase();

      if (!termo) {
        return participantes;
      }

      return participantes.filter(
        (participante) => {
          const nome =
            participante.pessoa.nome
              .toLowerCase();

          const cpf =
            participante.pessoa.cpf
              .toLowerCase();

          const email =
            participante.pessoa.email
              ?.toLowerCase() || "";

          return (
            nome.includes(termo) ||
            cpf.includes(termo) ||
            email.includes(termo)
          );
        }
      );
    }, [participantes, busca]);

  const participantesAtuais =
    useMemo(() => {
      return participantesFiltrados
        .map((participante) => ({
          ...participante,
          participacoes:
            participante.participacoes.filter(
              acaoEmAndamento
            ),
        }))
        .filter(
          (participante) =>
            participante.participacoes.length >
            0
        );
    }, [participantesFiltrados]);

  const participantesHistoricos =
    useMemo(() => {
      return participantesFiltrados
        .map((participante) => ({
          ...participante,
          participacoes:
            participante.participacoes.filter(
              acaoAnterior
            ),
        }))
        .filter(
          (participante) =>
            participante.participacoes.length >
            0
        );
    }, [participantesFiltrados]);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          padding: "2rem",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            Carregando participantes...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "2rem",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              color: "#222",
            }}
          >
            Participantes
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#666",
            }}
          >
            Participantes das ações
            extensionistas em andamento e
            histórico de ações anteriores.
          </p>
        </header>

        <div
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Buscar participante
          </label>

          <input
            type="text"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Nome, CPF ou e-mail"
            style={{
              width: "100%",
              padding: "0.75rem",
              border:
                "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {erro && (
          <div
            style={{
              background: "#fff",
              border:
                "1px solid #f5c2c7",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "2rem",
            }}
          >
            <strong
              style={{
                color: "#b02a37",
              }}
            >
              Erro ao carregar
              participantes
            </strong>

            <p
              style={{
                color: "#842029",
                marginBottom: 0,
              }}
            >
              {erro}
            </p>
          </div>
        )}

        <section>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#222",
                }}
              >
                Participantes em ações
                em andamento
              </h2>

              <p
                style={{
                  marginTop: "0.4rem",
                  color: "#666",
                }}
              >
                Participantes atualmente
                vinculados a ações em
                andamento.
              </p>
            </div>

            <strong>
              {participantesAtuais.length}{" "}
              {participantesAtuais.length ===
              1
                ? "participante"
                : "participantes"}
            </strong>
          </div>

          {participantesAtuais.length ===
          0 ? (
            <div
              style={{
                background: "#fff",
                border:
                  "1px solid #ddd",
                borderRadius: "10px",
                padding: "2rem",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              <p style={{ margin: 0 }}>
                Nenhum participante
                encontrado em ações em
                andamento.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              {participantesAtuais.map(
                (participante) => (
                  <article
                    key={participante.id}
                    style={{
                      background: "#fff",
                      border:
                        "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "1rem",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            color: "#0070f3",
                          }}
                        >
                          {
                            participante.pessoa
                              .nome
                          }
                        </h3>

                        <p
                          style={{
                            marginTop:
                              "0.4rem",
                            color: "#666",
                          }}
                        >
                          CPF:{" "}
                          {
                            participante.pessoa
                              .cpf
                          }
                        </p>
                      </div>

                      <span
                        style={{
                          background:
                            "#fff3cd",
                          color:
                            "#664d03",
                          padding:
                            "0.4rem 0.7rem",
                          borderRadius:
                            "20px",
                          fontSize:
                            "0.8rem",
                          fontWeight:
                            "bold",
                        }}
                      >
                        Participante atual
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "0.8rem",
                        marginTop:
                          "1rem",
                      }}
                    >
                      {participante.pessoa
                        .email && (
                        <div
                          style={{
                            background:
                              "#f8f9fa",
                            padding:
                              "0.8rem",
                            borderRadius:
                              "6px",
                          }}
                        >
                          <strong>
                            E-mail
                          </strong>

                          <div>
                            {
                              participante
                                .pessoa
                                .email
                            }
                          </div>
                        </div>
                      )}

                      {participante.pessoa
                        .telefone && (
                        <div
                          style={{
                            background:
                              "#f8f9fa",
                            padding:
                              "0.8rem",
                            borderRadius:
                              "6px",
                          }}
                        >
                          <strong>
                            Telefone
                          </strong>

                          <div>
                            {
                              participante
                                .pessoa
                                .telefone
                            }
                          </div>
                        </div>
                      )}

                      {participante.escolaridade && (
                        <div
                          style={{
                            background:
                              "#f8f9fa",
                            padding:
                              "0.8rem",
                            borderRadius:
                              "6px",
                          }}
                        >
                          <strong>
                            Escolaridade
                          </strong>

                          <div>
                            {
                              participante.escolaridade
                            }
                          </div>
                        </div>
                      )}
                    </div>

                    <h4
                      style={{
                        marginTop:
                          "1.5rem",
                        marginBottom:
                          "0.8rem",
                      }}
                    >
                      Ações em andamento
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gap: "0.8rem",
                      }}
                    >
                      {participante.participacoes.map(
                        (participacao) => (
                          <div
                            key={
                              participacao.id
                            }
                            style={{
                              border:
                                "1px solid #eee",
                              borderRadius:
                                "6px",
                              padding:
                                "1rem",
                            }}
                          >
                            <strong>
                              {
                                participacao
                                  .acao
                                  .titulo
                              }
                            </strong>

                            <p
                              style={{
                                margin:
                                  "0.5rem 0 0",
                              }}
                            >
                              Status:{" "}
                              {formatarStatus(
                                participacao
                                  .acao
                                  .status
                              )}
                            </p>

                            <p
                              style={{
                                margin:
                                  "0.35rem 0 0",
                              }}
                            >
                              Data da
                              participação:{" "}
                              {formatarData(
                                participacao.dataParticipacao
                              )}
                            </p>

                            <p
                              style={{
                                margin:
                                  "0.35rem 0 0",
                              }}
                            >
                              Frequência:{" "}
                              {formatarFrequencia(
                                participacao.frequencia
                              )}
                            </p>

                            {participacao.observacoes && (
                              <p
                                style={{
                                  margin:
                                    "0.35rem 0 0",
                                }}
                              >
                                Observações:{" "}
                                {
                                  participacao.observacoes
                                }
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#222",
                }}
              >
                Participantes de ações
                anteriores
              </h2>

              <p
                style={{
                  marginTop: "0.4rem",
                  color: "#666",
                }}
              >
                Histórico de participantes
                de ações já concluídas.
              </p>
            </div>

            <strong>
              {participantesHistoricos.length}{" "}
              {participantesHistoricos.length ===
              1
                ? "participante"
                : "participantes"}
            </strong>
          </div>

          {participantesHistoricos.length ===
          0 ? (
            <div
              style={{
                background: "#fff",
                border:
                  "1px solid #ddd",
                borderRadius: "10px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0 }}>
                Nenhum participante
                encontrado no histórico de
                ações anteriores.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "1rem",
              }}
            >
              {participantesHistoricos.map(
                (participante) => (
                  <article
                    key={participante.id}
                    style={{
                      background: "#fff",
                      border:
                        "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "1.5rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#0070f3",
                      }}
                    >
                      {
                        participante.pessoa
                          .nome
                      }
                    </h3>

                    <p
                      style={{
                        marginTop:
                          "0.4rem",
                        color: "#666",
                      }}
                    >
                      CPF:{" "}
                      {
                        participante.pessoa
                          .cpf
                      }
                    </p>

                    <h4
                      style={{
                        marginTop:
                          "1.5rem",
                        marginBottom:
                          "0.8rem",
                      }}
                    >
                      Histórico de ações
                    </h4>

                    <div
                      style={{
                        display: "grid",
                        gap: "0.8rem",
                      }}
                    >
                      {participante.participacoes.map(
                        (participacao) => (
                          <div
                            key={
                              participacao.id
                            }
                            style={{
                              border:
                                "1px solid #eee",
                              borderRadius:
                                "6px",
                              padding:
                                "1rem",
                            }}
                          >
                            <strong>
                              {
                                participacao
                                  .acao
                                  .titulo
                              }
                            </strong>

                            <p
                              style={{
                                margin:
                                  "0.5rem 0 0",
                              }}
                            >
                              Status:{" "}
                              {formatarStatus(
                                participacao
                                  .acao
                                  .status
                              )}
                            </p>

                            <p
                              style={{
                                margin:
                                  "0.35rem 0 0",
                              }}
                            >
                              Data da
                              participação:{" "}
                              {formatarData(
                                participacao.dataParticipacao
                              )}
                            </p>

                            <p
                              style={{
                                margin:
                                  "0.35rem 0 0",
                              }}
                            >
                              Frequência:{" "}
                              {formatarFrequencia(
                                participacao.frequencia
                              )}
                            </p>

                            {participacao.acao
                              .dataInicio && (
                              <p
                                style={{
                                  margin:
                                    "0.35rem 0 0",
                                }}
                              >
                                Início da ação:{" "}
                                {formatarData(
                                  participacao
                                    .acao
                                    .dataInicio
                                )}
                              </p>
                            )}

                            {participacao.acao
                              .dataFim && (
                              <p
                                style={{
                                  margin:
                                    "0.35rem 0 0",
                                }}
                              >
                                Término da ação:{" "}
                                {formatarData(
                                  participacao
                                    .acao
                                    .dataFim
                                )}
                              </p>
                            )}

                            {participacao.observacoes && (
                              <p
                                style={{
                                  margin:
                                    "0.35rem 0 0",
                                }}
                              >
                                Observações:{" "}
                                {
                                  participacao.observacoes
                                }
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
