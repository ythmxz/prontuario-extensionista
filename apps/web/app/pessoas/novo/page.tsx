"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3333";

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
  background: "#fff",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: "bold" as const,
};

function NovaPessoaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Permite voltar para a tela de origem (ex.: /membros/novo) após salvar.
  const retorno = searchParams.get("retorno") || "/membros/novo";

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErro("");

    const cpfNumerico = cpf.replace(/\D/g, "");

    if (cpfNumerico.length !== 11) {
      setErro("O CPF deve ter 11 dígitos.");
      return;
    }

    try {
      setSalvando(true);

      const response = await fetch(`${API_URL}/pessoas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf: cpfNumerico,
          dataNascimento,
          sexo,
          telefone: telefone.trim() || undefined,
          email: email.trim() || undefined,
          endereco: endereco.trim() || undefined,
          municipio: municipio.trim() || undefined,
          uf: uf.trim().toUpperCase() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Não foi possível cadastrar a pessoa."
        );
      }

      router.push(retorno);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar a pessoa."
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
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href={retorno}
          style={{
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          ← Voltar
        </Link>

        <h1
          style={{
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#222",
          }}
        >
          Nova pessoa
        </h1>

        <p style={{ margin: 0, color: "#666" }}>
          Cadastre uma pessoa para vinculá-la depois como
          membro da equipe ou participante.
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

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div>
          <label htmlFor="nome" style={labelStyle}>
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={200}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="cpf" style={labelStyle}>
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Somente números"
            maxLength={14}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="dataNascimento"
            style={labelStyle}
          >
            Data de nascimento
          </label>
          <input
            id="dataNascimento"
            type="date"
            value={dataNascimento}
            onChange={(e) =>
              setDataNascimento(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="sexo" style={labelStyle}>
            Sexo
          </label>
          <select
            id="sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div>
          <label htmlFor="telefone" style={labelStyle}>
            Telefone
          </label>
          <input
            id="telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            maxLength={20}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={150}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="endereco" style={labelStyle}>
            Endereço
          </label>
          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 3 }}>
            <label htmlFor="municipio" style={labelStyle}>
              Município
            </label>
            <input
              id="municipio"
              type="text"
              value={municipio}
              onChange={(e) =>
                setMunicipio(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="uf" style={labelStyle}>
              UF
            </label>
            <input
              id="uf"
              type="text"
              value={uf}
              onChange={(e) => setUf(e.target.value)}
              maxLength={2}
              style={inputStyle}
            />
          </div>
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
              background: salvando ? "#999" : "#0070f3",
              color: "#fff",
              fontWeight: "bold",
              cursor: salvando ? "not-allowed" : "pointer",
            }}
          >
            {salvando ? "Salvando..." : "Cadastrar pessoa"}
          </button>

          <Link
            href={retorno}
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
    </main>
  );
}

export default function NovaPessoaPage() {
  return (
    <Suspense fallback={null}>
      <NovaPessoaForm />
    </Suspense>
  );
}
