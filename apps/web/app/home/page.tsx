import Link from "next/link";

const paginas = [
  { nome: "Dashboard", rota: "/dashboard" },
  { nome: "Login", rota: "/login" },
  { nome: "Cadastro", rota: "/cadastro" },
  { nome: "Pacientes", rota: "/pacientes" },
  { nome: "Agenda", rota: "/agenda" },
  { nome: "Configurações", rota: "/configuracoes" },
  { nome: "Ações", rota: "/acoes" },
  { nome: "Nova Ação", rota: "/acoes/novo" },
  { nome: "Participantes", rota: "/participantes" },
  { nome: "Membros", rota: "/membros" },
  { nome: "Novo Membro", rota: "/membros/novo" },
  { nome: "Equipe", rota: "/equipe" },
  { nome: "Participações", rota: "/participacoes" },
  { nome: "Nova Participação", rota: "/participacoes/novo" },
  { nome: "Documentos", rota: "/documentos" },
  { nome: "Novo Documento", rota: "/documentos/novo" },
];

export default function HomeFidelis() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          margin: 0,
        }}
      >
        HomeFidelis
      </h1>

      <p
        style={{
          marginTop: "0.5rem",
          color: "#666",
        }}
      >
        Acesso às páginas do sistema.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {paginas.map((pagina) => (
          <Link
            key={pagina.rota}
            href={pagina.rota}
            style={{
              color: "#0070f3",
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            {pagina.nome}
          </Link>
        ))}
      </div>
    </main>
  );
}
