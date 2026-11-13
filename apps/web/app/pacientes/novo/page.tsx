"use client";

import { useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import styles from "../../dashboard/dashboard.module.css";
import { API_URL } from "../../common";

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  fontSize: 14,
  background: "#fff",
  outline: "none",
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 18,
};

function Campo({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 14,
          fontWeight: 600,
          color: "#334155",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Titulo({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        margin: "8px 0 16px",
        fontSize: 16,
        color: "#64748b",
      }}
    >
      {children}
    </h3>
  );
}

export default function NovoPacientePage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [uf, setUf] = useState("");
  const [escolaridade, setEscolaridade] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telResponsavel, setTelResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      if (!nome.trim()) {
        throw new Error("Informe o nome do paciente.");
      }

      if (cpf.replace(/\D/g, "").length !== 11) {
        throw new Error("Informe um CPF com 11 dígitos.");
      }

      if (!dataNascimento) {
        throw new Error("Informe a data de nascimento.");
      }

      if (!sexo) {
        throw new Error("Selecione o sexo.");
      }

      if (uf.trim() && uf.trim().length !== 2) {
        throw new Error("A UF deve ter 2 letras.");
      }

      const response = await fetch(`${API_URL}/participantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          cpf: cpf.replace(/\D/g, ""),
          dataNascimento,
          sexo,
          telefone,
          email,
          endereco,
          municipio,
          uf,
          escolaridade,
          nomeResponsavel,
          telResponsavel,
          observacoes,
        }),
      });

      if (!response.ok) {
        let mensagem = "Não foi possível cadastrar o paciente.";

        try {
          const resposta = (await response.json()) as { message?: string };
          if (resposta?.message) {
            mensagem = resposta.message;
          }
        } catch {
          // mantém a mensagem padrão
        }

        throw new Error(mensagem);
      }

      setSucesso(true);

      setTimeout(() => {
        router.push("/pacientes");
        router.refresh();
      }, 500);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao cadastrar o paciente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
        <Link
          href="/pacientes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} />
          Voltar para pacientes
        </Link>

        <div className={styles.header} style={{ marginTop: 16 }}>
          <h1>Novo Paciente</h1>
          <p>Preencha os dados abaixo para cadastrar um novo paciente.</p>
        </div>

        {erro && (
          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 12,
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: 14,
            }}
          >
            <strong>Erro: </strong>
            {erro}
          </div>
        )}

        {sucesso && (
          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 12,
              background: "#dcfce7",
              color: "#16a34a",
              fontSize: 14,
            }}
          >
            Paciente cadastrado com sucesso! Redirecionando...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles.box}
          style={{ marginTop: 20, maxWidth: 800 }}
        >
          <Titulo>Dados pessoais</Titulo>

          <div style={{ marginBottom: 18 }}>
            <Campo label="Nome completo *" htmlFor="nome">
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Oliveira"
                maxLength={200}
                required
                style={inputStyle}
              />
            </Campo>
          </div>

          <div style={grid}>
            <Campo label="CPF *" htmlFor="cpf">
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
            </Campo>

            <Campo label="Data de nascimento *" htmlFor="dataNascimento">
              <input
                id="dataNascimento"
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                style={inputStyle}
              />
            </Campo>
          </div>

          <div style={grid}>
            <Campo label="Sexo *" htmlFor="sexo">
              <select
                id="sexo"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Selecione o sexo</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="OUTRO">Outro</option>
              </select>
            </Campo>

            <Campo label="Escolaridade" htmlFor="escolaridade">
              <input
                id="escolaridade"
                type="text"
                value={escolaridade}
                onChange={(e) => setEscolaridade(e.target.value)}
                placeholder="Ex.: Ensino médio completo"
                maxLength={80}
                style={inputStyle}
              />
            </Campo>
          </div>

          <Titulo>Contato e endereço</Titulo>

          <div style={grid}>
            <Campo label="Telefone" htmlFor="telefone">
              <input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={20}
                style={inputStyle}
              />
            </Campo>

            <Campo label="E-mail" htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="paciente@email.com"
                maxLength={150}
                style={inputStyle}
              />
            </Campo>
          </div>

          <div style={{ marginBottom: 18 }}>
            <Campo label="Endereço" htmlFor="endereco">
              <input
                id="endereco"
                type="text"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Rua, número, bairro"
                style={inputStyle}
              />
            </Campo>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: 16,
              marginBottom: 18,
            }}
          >
            <Campo label="Município" htmlFor="municipio">
              <input
                id="municipio"
                type="text"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                maxLength={100}
                style={inputStyle}
              />
            </Campo>

            <Campo label="UF" htmlFor="uf">
              <input
                id="uf"
                type="text"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
                placeholder="UF"
                maxLength={2}
                style={inputStyle}
              />
            </Campo>
          </div>

          <Titulo>Responsável</Titulo>

          <div style={grid}>
            <Campo label="Nome do responsável" htmlFor="nomeResponsavel">
              <input
                id="nomeResponsavel"
                type="text"
                value={nomeResponsavel}
                onChange={(e) => setNomeResponsavel(e.target.value)}
                maxLength={200}
                style={inputStyle}
              />
            </Campo>

            <Campo label="Telefone do responsável" htmlFor="telResponsavel">
              <input
                id="telResponsavel"
                type="tel"
                value={telResponsavel}
                onChange={(e) => setTelResponsavel(e.target.value)}
                maxLength={20}
                style={inputStyle}
              />
            </Campo>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Campo label="Observações" htmlFor="observacoes">
              <textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Campo>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Link
              href="/pacientes"
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: "#eff6ff",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 14,
                padding: "12px 18px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Cadastrando..." : "Cadastrar Paciente"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
