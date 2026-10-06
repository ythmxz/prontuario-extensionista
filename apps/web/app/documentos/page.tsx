"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Documento = {
  id: number;
  acaoId: number;
  tipo: string;
  titulo: string;
  arquivoUrl: string;
};

type Acao = {
  id: number;
  titulo: string;
  status: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function DocumentosPage() {
  const [documentos, setDocumentos] =
    useState<Documento[]>([]);

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
          documentosResponse,
          acoesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/documentos-acao`),
          fetch(`${API_URL}/acoes-extensionistas`),
        ]);

        if (
          !documentosResponse.ok ||
          !acoesResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os documentos."
          );
        }

        const [
          documentosData,
          acoesData,
        ] = await Promise.all([
          documentosResponse.json(),
          acoesResponse.json(),
        ]);

        setDocumentos(documentosData);
        setAcoes(acoesData);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os documentos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const acaoPorId = useMemo(() => {
    return new Map(
      acoes.map((acao) => [acao.id, acao])
    );
  }, [acoes]);

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
            Documentos
          </h1>

          <p
            style={{
              marginTop: "0.5rem",
              color: "#666",
            }}
          >
            Documentos associados às ações
            extensionistas.
          </p>
        </div>

        <Link
          href="/documentos/novo"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            background: "#0070f3",
            color: "#fff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Novo documento
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
          Carregando documentos...
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
                {documentos.length}
              </strong>

              <span
                style={{
                  color: "#666",
                }}
              >
                Documentos
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
                Ações extensionistas
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
              Documentos cadastrados
            </h2>

            {documentos.length === 0 ? (
              <div
                style={{
                  padding: "1.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  color: "#666",
                }}
              >
                Nenhum documento cadastrado.
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
                    minWidth: "900px",
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
                        Título
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Tipo
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
                        Status
                      </th>

                      <th
                        style={{
                          padding: "0.9rem",
                          textAlign: "left",
                          borderBottom:
                            "1px solid #ddd",
                        }}
                      >
                        Arquivo
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {documentos.map((documento) => {
                      const acao = acaoPorId.get(
                        documento.acaoId
                      );

                      return (
                        <tr key={documento.id}>
                          <td
                            style={{
                              padding: "0.9rem",
                              borderBottom:
                                "1px solid #eee",
                              fontWeight: "bold",
                            }}
                          >
                            {documento.titulo}
                          </td>

                          <td
                            style={{
                              padding: "0.9rem",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >
                            {documento.tipo}
                          </td>

                          <td
                            style={{
                              padding: "0.9rem",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >
                            {acao?.titulo ||
                              `Ação #${documento.acaoId}`}
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
                            }}
                          >
                            {documento.arquivoUrl ? (
                              <a
                                href={
                                  documento.arquivoUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#0070f3",
                                  textDecoration:
                                    "none",
                                }}
                              >
                                Abrir arquivo
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
