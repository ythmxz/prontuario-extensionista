import Fastify, { FastifyInstance } from "fastify";

import cors from "@fastify/cors";

import { authRoutes } from "./routes/auth.ts";

import { usersRoutes } from "./routes/users.ts";

import { departmentsRoutes } from "./routes/departments.ts";

import { cursosRoutes } from "./routes/cursos.ts";

import { colegiadosRoutes } from "./routes/colegiados.ts";

import { professoresRoutes } from "./routes/professores.ts";

import { nucleosRoutes } from "./routes/nucleos.ts";

import { linhasAtuacaoRoutes } from "./routes/linhasAtuacao.ts";

import { tiposAcaoRoutes } from "./routes/tiposAcao.ts";

import { locaisAcaoRoutes } from "./routes/locaisAcao.ts";
import { alunosRoutes } from "./routes/alunos.ts";
import { pessoasRoutes } from "./routes/pessoas.ts";

import { participantesRoutes } from "./routes/participantes.ts";

import { membrosEquipeRoutes } from "./routes/membrosEquipe.ts";

import { acoesExtensionistasRoutes } from "./routes/acoesExtensionistas.ts";

import { documentosAcaoRoutes } from "./routes/documentosAcao.ts";

import { associacoesAcaoRoutes } from "./routes/associacoesAcao.ts";

import { atendimentosRoutes } from "./routes/atendimento.ts";

import { prontuariosRoutes } from "./routes/prontuarios.ts";

const app = Fastify({
  logger: false,
});

app.register(cors, {
  origin: true,
});

async function apiRoutes(instance: FastifyInstance) {
  instance.register(authRoutes);
  instance.register(cursosRoutes);
  instance.register(usersRoutes);
  instance.register(departmentsRoutes);
  instance.register(colegiadosRoutes);
  instance.register(professoresRoutes);
  instance.register(nucleosRoutes);
  instance.register(linhasAtuacaoRoutes);
  instance.register(tiposAcaoRoutes);
  instance.register(locaisAcaoRoutes);
  instance.register(alunosRoutes);
  instance.register(pessoasRoutes);
  instance.register(participantesRoutes);
  instance.register(membrosEquipeRoutes);
  instance.register(acoesExtensionistasRoutes);
  instance.register(documentosAcaoRoutes);
  instance.register(associacoesAcaoRoutes);
  instance.register(atendimentosRoutes);
  instance.register(prontuariosRoutes);
  instance.get("/health", async () => ({ status: "ok" }));
}

// Suporta tanto requisições diretas quanto roteadas pelo Vercel sob /api
app.register(apiRoutes);
app.register(apiRoutes, { prefix: "/api" });

const start = async () => {
  try {
    const port =
      Number(process.env.PORT) || 3333;

    const address = await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(address);
  } catch (err) {
    app.log.error(err);

    process.exit(1);
  }
};

start();

export default app;
