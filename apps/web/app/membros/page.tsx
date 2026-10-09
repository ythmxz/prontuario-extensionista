"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

type Pessoa = {
  id: number;
  nome: string;
  cpf: string;
};

type Departamento = {
  id: number;
  nome: string;
  sigla: string;
};

type Membro = {
  id: number;
  pessoaId: number;
  departamentoId?: number | null;
  tipo: string;
  matricula?: string | null;
  vinculo?: string | null;
};

type Acao = {
  id: number;
  titulo: string;
  status: string;
  dataInicio?: string;
  dataFim?: string | null;
};

type EquipeAcao = {
  id: number;
  membroId: number;
  acaoId: number;
  papel: string;
  dataEntrada: string;
  dataSaida?: string | null;
  horasDedicadas?:
    | number
    | string
    | null;
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
  status?: string
) {
  switch (status) {
    case "PLANEJADA":
      return "Planejada";

    case "EM_ANDAMENTO":
      return "Em andamento";

    case "CONCLUIDA":
      return "Concluída";

    case "CANCELADA":
      return "Cancelada";

    default:
      return status || "Não informado";
  }
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function MembrosPage() {
  const [membros, setMembros] =
    useState<Membro[]>([]);

  const [pessoas, setPessoas] =
    useState<Pessoa[]>([]);

  const [departamentos, setDepartamentos] =
    useState<Departamento[]>([]);

  const [acoes, setAcoes] =
    useState<Acao[]>([]);

  const [vinculos, setVinculos] =
    useState<EquipeAcao[]>([]);

  const [membroId, setMembroId] =
    useState("");

  const [acaoId, setAcaoId] =
    useState("");

  const [papel, setPapel] =
    useState("");

  const [dataEntrada, setDataEntrada] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  const [
    horasDedicadas,
    setHorasDedicadas,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState("");

  const [sucesso, setSucesso] =
    useState("");

  const pessoaPorId = useMemo(
    () =>
      new Map(
        pessoas.map((pessoa) => [
          pessoa.id,
          pessoa,
        ])
      ),
    [pessoas]
  );

  const departamentoPorId = useMemo(
    () =>
      new Map(
        departamentos.map(
          (departamento) => [
            departamento.id,
            departamento,
          ]
        )
      ),
    [departamentos]
  );

  const acaoPorId = useMemo(
    () =>
      new Map(
        acoes.map((acao) => [
          acao.id,
          acao,
        ])
      ),
    [acoes]
  );

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [
        membrosResponse,
        pessoasResponse,
        departamentosResponse,
        acoesResponse,
        vinculosResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/membros-equipe`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/pessoas`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/departments`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/acoes-extensionistas`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/equipe-acoes`,
          {
            cache: "no-store",
          }
        ),
      ]);

      if (!membrosResponse.ok) {
        throw new Error(
          "Erro ao carregar membros."
        );
      }

      if (!pessoasResponse.ok) {
        throw new Error(
          "Erro ao carregar pessoas."
        );
      }

      if (!departamentosResponse.ok) {
        throw new Error(
          "Erro ao carregar departamentos."
        );
      }

      if (!acoesResponse.ok) {
        throw new Error(
          "Erro ao carregar ações."
        );
      }

      if (!vinculosResponse.ok) {
        throw new Error(
          "Erro ao carregar vínculos."
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

      setMembros(
        Array.isArray(membrosData)
          ? membrosData
          : []
      );

      setPessoas(
        Array.isArray(pessoasData)
          ? pessoasData
          : []
      );

      setDepartamentos(
        Array.isArray(departamentosData)
          ? departamentosData
          : []
      );

      setAcoes(
        Array.isArray(acoesData)
          ? acoesData
          : []
      );

      setVinculos(
        Array.isArray(vinculosData)
          ? vinculosData
          : []
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const membrosSemVinculo =
    membros.filter(
      (membro) =>
        !vinculos.some(
          (vinculo) =>
            vinculo.membroId ===
            membro.id
        )
    );

  async function vincularMembro(
    event: FormEvent
  ) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (
      !membroId ||
      !acaoId ||
      !papel.trim() ||
      !dataEntrada
    ) {
      setErro(
        "Preencha membro, ação, papel e data de entrada."
      );
      return;
    }

    const jaVinculado =
      vinculos.some(
        (vinculo) =>
          vinculo.membroId ===
            Number(membroId) &&
          vinculo.acaoId ===
            Number(acaoId)
      );

    if (jaVinculado) {
      setErro(
        "Este membro já está vinculado a esta ação."
      );
      return;
    }

    try {
      setSalvando(true);

      const body: Record<
        string,
        unknown
      > = {
        membroId: Number(membroId),
        acaoId: Number(acaoId),
        papel: papel.trim(),
        dataEntrada,
      };

      if (horasDedicadas.trim()) {
        body.horasDedicadas =
          Number(horasDedicadas);
      }

      const response = await fetch(
        `${API_URL}/equipe-acoes`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Erro ao vincular membro."
        );
      }

      setSucesso(
        "Membro vinculado à ação com sucesso."
      );

      setMembroId("");
      setAcaoId("");
      setPapel("");
      setHorasDedicadas("");

      await carregarDados();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao vincular membro."
      );
    } finally {
      setSalvando(false);
    }
  }

  function nomePessoa(
    pessoaId: number
  ) {
    return (
      pessoaPorId.get(pessoaId)
        ?.nome ||
      `Pessoa #${pessoaId}`
    );
  }

  function nomeDepartamento(
    departamentoId?: number | null
  ) {
    if (!departamentoId) {
      return "Sem departamento";
    }

    const departamento =
      departamentoPorId.get(
        departamentoId
      );

    if (!departamento) {
      return `Departamento #${departamentoId}`;
    }

    return `${departamento.nome} (${departamento.sigla})`;
  }

  function nomeAcao(acaoId: number) {
    return (
      acaoPorId.get(acaoId)
        ?.titulo ||
      `Ação #${acaoId}`
    );
  }

  if (loading) {
    return (
      <main
        style={{
          padding: 40,
        }}
      >
        Carregando...
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 40,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div>
          <h1>
            Membros da Equipe
          </h1>

          <p>
            Cadastre membros e faça a
            vinculação deles às ações
            extensionistas.
          </p>
        </div>

        <Link href="/membros/novo">
          Cadastrar novo membro
        </Link>
      </div>

      {erro && (
        <p
          style={{
            color: "red",
            marginTop: 20,
          }}
        >
          {erro}
        </p>
      )}

      {sucesso && (
        <p
          style={{
            color: "green",
            marginTop: 20,
          }}
        >
          {sucesso}
        </p>
      )}

      <section
        style={{
          marginTop: 40,
        }}
      >
        <h2>
          Vincular membro a uma ação
        </h2>

        <form
          onSubmit={vincularMembro}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          <select
            value={membroId}
            onChange={(event) =>
              setMembroId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Selecione o membro
            </option>

            {membros.map((membro) => (
              <option
                key={membro.id}
                value={membro.id}
              >
                {nomePessoa(
                  membro.pessoaId
                )}
              </option>
            ))}
          </select>

          <select
            value={acaoId}
            onChange={(event) =>
              setAcaoId(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Selecione a ação
            </option>

            {acoes.map((acao) => (
              <option
                key={acao.id}
                value={acao.id}
              >
                {acao.titulo} —{" "}
                {formatarStatus(
                  acao.status
                )}
              </option>
            ))}
          </select>

          <input
            placeholder="Papel na ação"
            value={papel}
            onChange={(event) =>
              setPapel(
                event.target.value
              )
            }
            required
          />

          <input
            type="date"
            value={dataEntrada}
            onChange={(event) =>
              setDataEntrada(
                event.target.value
              )
            }
            required
          />

          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Horas dedicadas"
            value={horasDedicadas}
            onChange={(event) =>
              setHorasDedicadas(
                event.target.value
              )
            }
          />

          <button
            type="submit"
            disabled={salvando}
          >
            {salvando
              ? "Vinculando..."
              : "Vincular"}
          </button>
        </form>
      </section>

      <section
        style={{
          marginTop: 40,
        }}
      >
        <h2>
          Membros ainda não vinculados
        </h2>

        {membrosSemVinculo.length ===
        0 ? (
          <p>
            Todos os membros já estão
            vinculados a pelo menos uma
            ação.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 16,
              marginTop: 20,
            }}
          >
            {membrosSemVinculo.map(
              (membro) => (
                <article
                  key={membro.id}
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <h3>
                    {nomePessoa(
                      membro.pessoaId
                    )}
                  </h3>

                  <p>
                    Tipo: {membro.tipo}
                  </p>

                  <p>
                    Departamento:{" "}
                    {nomeDepartamento(
                      membro.departamentoId
                    )}
                  </p>

                  {membro.matricula && (
                    <p>
                      Matrícula:{" "}
                      {membro.matricula}
                    </p>
                  )}

                  {membro.vinculo && (
                    <p>
                      Vínculo:{" "}
                      {membro.vinculo}
                    </p>
                  )}
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section
        style={{
          marginTop: 40,
        }}
      >
        <h2>
          Membros vinculados às ações
        </h2>

        {membros.length === 0 ? (
          <p>
            Nenhum membro cadastrado.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
              marginTop: 20,
            }}
          >
            {membros.map((membro) => {
              const meusVinculos =
                vinculos.filter(
                  (vinculo) =>
                    vinculo.membroId ===
                    membro.id
                );

              return (
                <article
                  key={membro.id}
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <h3>
                    {nomePessoa(
                      membro.pessoaId
                    )}
                  </h3>

                  <p>
                    Tipo: {membro.tipo}
                  </p>

                  <p>
                    Departamento:{" "}
                    {nomeDepartamento(
                      membro.departamentoId
                    )}
                  </p>

                  {membro.matricula && (
                    <p>
                      Matrícula:{" "}
                      {membro.matricula}
                    </p>
                  )}

                  {membro.vinculo && (
                    <p>
                      Vínculo:{" "}
                      {membro.vinculo}
                    </p>
                  )}

                  {meusVinculos.length ===
                  0 ? (
                    <p>
                      <strong>
                        Nenhuma ação vinculada.
                      </strong>
                    </p>
                  ) : (
                    <div
                      style={{
                        marginTop: 16,
                      }}
                    >
                      <strong>
                        Ações vinculadas:
                      </strong>

                      <div
                        style={{
                          display: "grid",
                          gap: 12,
                          marginTop: 12,
                        }}
                      >
                        {meusVinculos.map(
                          (vinculo) => (
                            <div
                              key={
                                vinculo.id
                              }
                              style={{
                                border:
                                  "1px solid #eee",
                                borderRadius: 6,
                                padding: 14,
                              }}
                            >
                              <strong>
                                {nomeAcao(
                                  vinculo.acaoId
                                )}
                              </strong>

                              <p>
                                Papel:{" "}
                                {
                                  vinculo.papel
                                }
                              </p>

                              <p>
                                Entrada:{" "}
                                {formatarData(
                                  vinculo.dataEntrada
                                )}
                              </p>

                              <p>
                                Saída:{" "}
                                {formatarData(
                                  vinculo.dataSaida
                                )}
                              </p>

                              <p>
                                Horas dedicadas:{" "}
                                {vinculo.horasDedicadas ??
                                  "Não informado"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
