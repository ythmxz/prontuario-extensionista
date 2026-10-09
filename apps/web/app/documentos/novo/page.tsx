"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Acao = {
  id: number;
  titulo: string;
  status: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function NovoDocumentoPage() {
  const router = useRouter();

  const [acoes, setAcoes] = useState<Acao[]>([]);

  const [acaoId, setAcaoId] = useState("");
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [arquivoUrl, setArquivoUrl] = useState("");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAcoes() {
      try {
        setCarregando(true);
        setErro("");

        const response = await fetch(
          `${API_URL}/acoes-extensionistas`
        );

        if (!response.ok) {
          throw new Error(
            "Não foi possível carregar as ações extensionistas."
          );
        }

        const data = await response.json();

        setAcoes(data);

        if (data.length > 0) {
          setAcaoId(String(data[0].id));
        }
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar as ações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarAcoes();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");

    if (!acaoId) {
      setErro("Selecione uma ação extensionista.");
      return;
    }

    if (!tipo.trim()) {
      setErro("Informe o tipo do documento.");
      return;
    }

    if (!titulo.trim()) {
      setErro("Informe o título do documento.");
      return;
    }

    if (!arquivoUrl.trim()) {
      setErro("Informe a URL do arquivo.");
      return;
    }

    try {
      setSalvando(true);

      const response = await fetch(
        `${API_URL}/documentos-acao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acaoId: Number(acaoId),
            tipo: tipo.trim(),
            titulo: titulo.trim(),
            arquivoUrl: arquivoUrl.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Não foi possível cadastrar o documento."
        );
      }

      router.push("/documentos");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar o documento."
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
          href="/documentos"
          style={{
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          ← Voltar para documentos
        </Link>

        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#222",
          }}
        >
          Novo documento
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          Cadastre um documento relacionado a uma ação
          extensionista.
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
          Carregando ações...
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
              htmlFor="tipo"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Tipo do documento
            </label>

            <input
              id="tipo"
              type="text"
              value={tipo}
              onChange={(event) =>
                setTipo(event.target.value)
              }
              placeholder="Ex.: RELATORIO, PLANO, ATA"
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
              htmlFor="titulo"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Título
            </label>

            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(event) =>
                setTitulo(event.target.value)
              }
              placeholder="Título do documento"
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
              htmlFor="arquivoUrl"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              URL do arquivo
            </label>

            <input
              id="arquivoUrl"
              type="url"
              value={arquivoUrl}
              onChange={(event) =>
                setArquivoUrl(event.target.value)
              }
              placeholder="https://..."
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
              Informe o endereço onde o arquivo está
              disponível.
            </small>
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
                : "Cadastrar documento"}
            </button>

            <Link
              href="/documentos"
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