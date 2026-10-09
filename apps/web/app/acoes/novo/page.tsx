"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovaAcaoPage() {
  const router = useRouter();

  // Dados do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // Relacionamentos
  const [tipoAcaoId, setTipoAcaoId] = useState("");
  const [localId, setLocalId] = useState("");
  const [linhaAtuacaoId, setLinhaAtuacaoId] = useState("");

  // Datas
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Demais informações
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      // Validações básicas
      if (!titulo.trim()) {
        throw new Error("Informe o título da ação.");
      }

      if (!descricao.trim()) {
        throw new Error("Informe a descrição da ação.");
      }

      if (!tipoAcaoId) {
        throw new Error("Selecione o tipo da ação.");
      }

      if (!localId) {
        throw new Error("Selecione o local da ação.");
      }

      if (!linhaAtuacaoId) {
        throw new Error("Selecione a linha de atuação.");
      }

      if (!dataInicio) {
        throw new Error("Informe a data de início.");
      }

      if (!cargaHoraria) {
        throw new Error("Informe a carga horária.");
      }

      if (!modalidade) {
        throw new Error("Selecione a modalidade.");
      }

      if (!publicoAlvo.trim()) {
        throw new Error("Informe o público-alvo.");
      }

      if (!status) {
        throw new Error("Selecione o status.");
      }

      // Monta o objeto exatamente com os campos esperados pela API
      const payload: Record<string, unknown> = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),

        tipoAcaoId: Number(tipoAcaoId),
        localId: Number(localId),
        linhaAtuacaoId: Number(linhaAtuacaoId),

        dataInicio: new Date(`${dataInicio}T00:00:00`).toISOString(),

        cargaHoraria: Number(cargaHoraria),

        modalidade,
        publicoAlvo: publicoAlvo.trim(),
        status,
      };

      // Data final é opcional
      if (dataFim) {
        payload.dataFim = new Date(`${dataFim}T00:00:00`).toISOString();
      }

      console.log("Payload enviado para a API:", payload);

      const response = await fetch(
        "http://localhost:3333/acoes-extensionistas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");

      let resposta: any = null;

      if (contentType?.includes("application/json")) {
        resposta = await response.json();
      } else {
        resposta = await response.text();
      }

      console.log("Resposta da API:", resposta);

      if (!response.ok) {
        let mensagem = "Não foi possível cadastrar a ação.";

        if (
          resposta &&
          typeof resposta === "object" &&
          resposta.message
        ) {
          mensagem = resposta.message;
        }

        throw new Error(mensagem);
      }

      setSucesso(true);

      // Volta para a listagem após o cadastro
      setTimeout(() => {
        router.push("/acoes");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error("Erro ao cadastrar ação:", error);

      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Erro desconhecido ao cadastrar a ação.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "750px",
          margin: "0 auto",
        }}
      >
        {/* VOLTAR */}
        <Link
          href="/acoes"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Voltar para ações
        </Link>

        {/* CABEÇALHO */}
        <div
          style={{
            marginTop: "1.5rem",
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
            Cadastrar Nova Ação Extensionista
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "0.5rem",
            }}
          >
            Preencha os dados abaixo para cadastrar uma nova ação extensionista.
          </p>
        </div>

        {/* MENSAGEM DE ERRO */}
        {erro && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #f5c2c7",
              background: "#f8d7da",
              color: "#842029",
            }}
          >
            <strong>Erro: </strong> {erro}
          </div>
        )}

        {/* MENSAGEM DE SUCESSO */}
        {sucesso && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #badbcc",
              background: "#d1e7dd",
              color: "#0f5132",
            }}
          >
            Ação cadastrada com sucesso! Redirecionando...
          </div>
        )}

        {/* FORMULÁRIO */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "2rem",
          }}
        >
          {/* TÍTULO */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="titulo"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Título *
            </label>

            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Programa de Reforço Escolar Comunitário"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* DESCRIÇÃO */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="descricao"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Descrição *
            </label>

            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a ação extensionista"
              rows={5}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                resize: "vertical",
              }}
            />
          </div>

          {/* TIPO / LOCAL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <label
                htmlFor="tipoAcao"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Tipo de Ação *
              </label>

              <select
                id="tipoAcao"
                value={tipoAcaoId}
                onChange={(e) => setTipoAcaoId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fff",
                }}
              >
                <option value="">Selecione o tipo</option>
                <option value="1">Projeto</option>
                <option value="2">Curso</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="local"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Local *
              </label>

              <select
                id="local"
                value={localId}
                onChange={(e) => setLocalId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fff",
                }}
              >
                <option value="">Selecione o local</option>
                <option value="1">Campus Principal</option>
                <option value="2">Escola Municipal Comunitária</option>
              </select>
            </div>
          </div>

          {/* LINHA DE ATUAÇÃO */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="linhaAtuacao"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Linha de Atuação *
            </label>

            <select
              id="linhaAtuacao"
              value={linhaAtuacaoId}
              onChange={(e) => setLinhaAtuacaoId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <option value="">Selecione a linha de atuação</option>
              <option value="1">Educação e Extensão Comunitária</option>
            </select>
          </div>

          {/* DATAS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <label
                htmlFor="dataInicio"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Data de Início *
              </label>

              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="dataFim"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Data de Término
              </label>

              <input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>

          {/* CARGA HORÁRIA */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="cargaHoraria"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Carga Horária *
            </label>

            <input
              id="cargaHoraria"
              type="number"
              min="0"
              step="0.5"
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(e.target.value)}
              placeholder="Ex.: 40.5"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* MODALIDADE / STATUS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <label
                htmlFor="modalidade"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Modalidade *
              </label>

              <select
                id="modalidade"
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fff",
                }}
              >
                <option value="">Selecione a modalidade</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="REMOTO">Remoto</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Status *
              </label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#fff",
                }}
              >
                <option value="">Selecione o status</option>
                <option value="PLANEJADA">Planejada</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          </div>

          {/* PÚBLICO-ALVO */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="publicoAlvo"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Público-alvo *
            </label>

            <input
              id="publicoAlvo"
              type="text"
              value={publicoAlvo}
              onChange={(e) => setPublicoAlvo(e.target.value)}
              placeholder="Ex.: Crianças e Adolescentes"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* BOTÕES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
            }}
          >
            <Link
              href="/acoes"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.25rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                color: "#333",
                background: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "6px",
                background: loading ? "#8ab4f8" : "#0070f3",
                color: "#fff",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Cadastrando..." : "Cadastrar Ação"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}