"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AcoesPage() {
  const [acoes, setAcoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3333/acoes-extensionistas")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Dados recebidos da API:", data);
        setAcoes(Array.isArray(data) ? data : data.acoes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar ações:", err);
        setErro(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Gerenciamento de Ações Extensionistas</h1>
        <Link href="/acoes/novo" style={{ background: "#0070f3", color: "#fff", padding: "0.5rem 1rem", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}>
          + Nova Ação
        </Link>
      </div>

      {loading && <p>Carregando ações...</p>}
      {erro && <p style={{ color: "red" }}>Falha ao carregar: {erro}. Verifique se a API está rodando na porta 3333.</p>}

      {!loading && !erro && acoes.length === 0 && (
        <p>Nenhuma ação cadastrada no banco de dados.</p>
      )}

      {!loading && acoes.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {acoes.map((acao) => (
            <li key={acao.id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "6px", background: "#f9f9f9" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#0070f3" }}>{acao.titulo}</h3>
              <p style={{ margin: "0 0 0.5rem 0" }}>{acao.descricao}</p>
              <small style={{ color: "#666" }}>
                Modalidade: <strong>{acao.modalidade}</strong> | Status: <strong>{acao.status}</strong> | Carga Horária: <strong>{acao.cargaHoraria}h</strong>
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}