"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Pessoa = {
  id: number;
  nome: string;
  cpf?: string | null;
};

type Departamento = {
  id: number;
  nome: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

export default function NovoMembroPage() {
  const router = useRouter();

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [departamentos, setDepartamentos] = useState<
    Departamento[]
  >([]);

  const [pessoaId, setPessoaId] = useState("");
  const [departamentoId, setDepartamentoId] =
    useState("");
  const [tipo, setTipo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [vinculo, setVinculo] = useState("");

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
          pessoasResponse,
          departamentosResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/pessoas`),
          fetch(`${API_URL}/departments`),
        ]);

        if (
          !pessoasResponse.ok ||
          !departamentosResponse.ok
        ) {
          throw new Error(
            "Não foi possível carregar os dados necessários."
          );
        }

        const [pessoasData, departamentosData] =
          await Promise.all([
            pessoasResponse.json(),
            departamentosResponse.json(),
          ]);

        setPessoas(pessoasData);
        setDepartamentos(departamentosData);
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

    if (!pessoaId) {
      setErro("Selecione uma pessoa.");
      return;
    }

    if (!tipo) {
      setErro("Selecione o tipo do membro.");
      return;
    }

    try {
      setSalvando(true);

      const response = await fetch(
        `${API_URL}/membros-equipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pessoaId: Number(pessoaId),
            departamentoId: departamentoId
              ? Number(departamentoId)
              : undefined,
            tipo,
            matricula:
              matricula.trim() || undefined,
            vinculo:
              vinculo.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Não foi possível cadastrar o membro."
        );
      }

      router.push("/membros");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar o membro."
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
          href="/membros"
          style={{
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          ← Voltar para membros
        </Link>

        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#222",
          }}
        >
          Novo membro
        </h1>

        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          Cadastre uma pessoa como membro da equipe.
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
              htmlFor="pessoaId"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Pessoa
            </label>

            <select
              id="pessoaId"
              value={pessoaId}
              onChange={(event) =>
                setPessoaId(event.target.value)
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
                Selecione uma pessoa
              </option>

              {pessoas.map((pessoa) => (
                <option
                  key={pessoa.id}
                  value={pessoa.id}
                >
                  {pessoa.nome}
                  {pessoa.cpf
                    ? ` — CPF: ${pessoa.cpf}`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="departamentoId"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Departamento
            </label>

            <select
              id="departamentoId"
              value={departamentoId}
              onChange={(event) =>
                setDepartamentoId(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
              }}
            >
              <option value="">
                Nenhum departamento
              </option>

              {departamentos.map((departamento) => (
                <option
                  key={departamento.id}
                  value={departamento.id}
                >
                  {departamento.nome}
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
              Tipo do membro
            </label>

            <select
              id="tipo"
              value={tipo}
              onChange={(event) =>
                setTipo(event.target.value)
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
                Selecione o tipo
              </option>

              <option value="COORDENADOR">
                Coordenador
              </option>

              <option value="DOCENTE">
                Docente
              </option>

              <option value="DISCENTE">
                Discente
              </option>

              <option value="VOLUNTARIO">
                Voluntário
              </option>

              <option value="TECNICO">
                Técnico
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="matricula"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Matrícula
            </label>

            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(event) =>
                setMatricula(event.target.value)
              }
              placeholder="Matrícula"
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
              htmlFor="vinculo"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "bold",
              }}
            >
              Vínculo
            </label>

            <input
              id="vinculo"
              type="text"
              value={vinculo}
              onChange={(event) =>
                setVinculo(event.target.value)
              }
              placeholder="Ex.: Bolsista, voluntário, servidor..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
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
                : "Cadastrar membro"}
            </button>

            <Link
              href="/membros"
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
