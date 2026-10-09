"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Membro = {
  id: number;
  tipo: string;
  matricula?: string | null;
  vinculo?: string | null;
  pessoaId: number;
  departamentoId?: number | null;
};

type Pessoa = {
  id: number;
  nome: string;
};

type Departamento = {
  id: number;
  nome: string;
};

type Acao = {
  id: number;
  titulo: string;
  status: string;
};

type EquipeAcao = {
  id: number;
  membroId: number;
  acaoId: number;
  papel: string;
  dataEntrada: string;
  dataSaida?: string | null;
  horasDedicadas?: number | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function EquipePage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [departamentos, setDepartamentos] = useState<
    Departamento[]
  >([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [vinculos, setVinculos] = useState<EquipeAcao[]>(
    []
  );

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [
          membrosResponse,
          pessoasResponse,
          departamentosResponse,
          acoesResponse,
          vinculosResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/membros-equipe`),
          fetch(`${API_URL}/pessoas`),
          fetch(`${API_URL}/departments`),
          fetch(`${API_URL}/acoes-extensionistas`),
          fetch(`${API_URL}/equipe-acoes`),
        ]);

        if (
          !membrosResponse.ok ||
          !pessoasResponse.ok ||
          !departamentosResponse.ok ||
          !acoesResponse.ok ||
          !vinculosResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os dados da equipe."
          );
        }

        const [
          membrosData,
          pessoasData,
          departamentosData,
          acoesData,
          vinculosData,
        ] = await Promise.all([
          membrosResponse.json(),
          pessoasResponse.json(),
          departamentosResponse.json(),
          acoesResponse.json(),
          vinculosResponse.json(),
        ]);

        setMembros(membrosData);
        setPessoas(pessoasData);
        setDepartamentos(departamentosData);
        setAcoes(acoesData);
        setVinculos(vinculosData);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar a equipe."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const pessoaPorId = useMemo(() => {
    return new Map(
      pessoas.map((pessoa) => [
        pessoa.id,
        pessoa,
      ])
    );
  }, [pessoas]);

  const departamentoPorId = useMemo(() => {
    return new Map(
      departamentos.map((departamento) => [
        departamento.id,
        departamento,
      ])
    );
  }, [departamentos]);

  const acaoPorId = useMemo(() => {
    return new Map(
      acoes.map((acao) => [acao.id, acao])
    );
  }, [acoes]);

  const vinculosPorMembro = useMemo(() => {
    const mapa = new Map<number, EquipeAcao[]>();

    for (const vinculo of vinculos) {
      const atuais = mapa.get(vinculo.membroId) || [];

      atuais.push(vinculo);

      mapa.set(vinculo.membroId, atuais);
    }

    return mapa;
  }, [vinculos]);

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
            Equipe
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#666",
            }}
          >
            Visualização dos membros da equipe e das
            ações extensionistas às quais estão
            vinculados.
          </p>
        </div>

        <Link
          href="/membros/novo"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            background: "#0070f3",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Cadastrar membro
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
          Carregando equipe...
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
                {membros.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Membros
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
                {vinculos.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Vínculos
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
              Membros da equipe
            </h2>

            {membros.length === 0 ? (
              <p
                style={{
                  color: "#666",
                }}
              >
                Nenhum membro cadastrado.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {membros.map((membro) => {
                  const pessoa = pessoaPorId.get(
                    membro.pessoaId
                  );

                  const departamento =
                    membro.departamentoId
                      ? departamentoPorId.get(
                          membro.departamentoId
                        )
                      : undefined;

                  const membrosVinculos =
                    vinculosPorMembro.get(
                      membro.id
                    ) || [];

                  return (
                    <article
                      key={membro.id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "1.25rem",
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              color: "#222",
                            }}
                          >
                            {pessoa?.nome ||
                              `Pessoa #${membro.pessoaId}`}
                          </h3>

                          <p
                            style={{
                              margin:
                                "0.5rem 0 0",
                              color: "#666",
                            }}
                          >
                            Tipo: {membro.tipo}
                          </p>

                          {membro.matricula && (
                            <p
                              style={{
                                margin:
                                  "0.25rem 0 0",
                                color: "#666",
                              }}
                            >
                              Matrícula:{" "}
                              {membro.matricula}
                            </p>
                          )}

                          {membro.vinculo && (
                            <p
                              style={{
                                margin:
                                  "0.25rem 0 0",
                                color: "#666",
                              }}
                            >
                              Vínculo:{" "}
                              {membro.vinculo}
                            </p>
                          )}

                          {departamento && (
                            <p
                              style={{
                                margin:
                                  "0.25rem 0 0",
                                color: "#666",
                              }}
                            >
                              Departamento:{" "}
                              {departamento.nome}
                            </p>
                          )}
                        </div>

                        <div
                          style={{
                            minWidth: "260px",
                            flex: "1",
                          }}
                        >
                          <strong
                            style={{
                              display: "block",
                              marginBottom: "0.75rem",
                            }}
                          >
                            Ações vinculadas
                          </strong>

                          {membrosVinculos.length ===
                          0 ? (
                            <span
                              style={{
                                color: "#a00",
                              }}
                            >
                              Não vinculado a
                              nenhuma ação.
                            </span>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                flexDirection:
                                  "column",
                                gap: "0.5rem",
                              }}
                            >
                              {membrosVinculos.map(
                                (vinculo) => {
                                  const acao =
                                    acaoPorId.get(
                                      vinculo.acaoId
                                    );

                                  return (
                                    <div
                                      key={
                                        vinculo.id
                                      }
                                      style={{
                                        padding:
                                          "0.75rem",
                                        border:
                                          "1px solid #eee",
                                        borderRadius:
                                          "6px",
                                        background:
                                          "#f8f8f8",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontWeight:
                                            "bold",
                                          color:
                                            "#222",
                                        }}
                                      >
                                        {acao?.titulo ||
                                          `Ação #${vinculo.acaoId}`}
                                      </div>

                                      <div
                                        style={{
                                          marginTop:
                                            "0.25rem",
                                          fontSize:
                                            "0.9rem",
                                          color:
                                            "#666",
                                        }}
                                      >
                                        Papel:{" "}
                                        {vinculo.papel}
                                      </div>

                                      {acao && (
                                        <div
                                          style={{
                                            marginTop:
                                              "0.25rem",
                                            fontSize:
                                              "0.9rem",
                                            color:
                                              "#666",
                                          }}
                                        >
                                          Status:{" "}
                                          {
                                            acao.status
                                          }
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <Link
              href="/membros"
              style={{
                color: "#0070f3",
                textDecoration: "none",
              }}
            >
              ← Gerenciar membros e vínculos
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
