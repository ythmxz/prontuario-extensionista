import Fastify from "fastify";

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

import { pessoasRoutes } from "./routes/pessoas.ts";

import { participantesRoutes } from "./routes/participantes.ts";

import { membrosEquipeRoutes } from "./routes/membrosEquipe.ts";

import { acoesExtensionistasRoutes } from "./routes/acoesExtensionistas.ts";

import { documentosAcaoRoutes } from "./routes/documentosAcao.ts";

import { associacoesAcaoRoutes } from "./routes/associacoesAcao.ts";

const app = Fastify({
  logger: false,
});

app.register(cors, {
  origin: true,
});

app.register(authRoutes);

app.register(cursosRoutes);

app.register(usersRoutes);

app.register(departmentsRoutes);

app.register(colegiadosRoutes);

app.register(professoresRoutes);

app.register(nucleosRoutes);

app.register(linhasAtuacaoRoutes);

app.register(tiposAcaoRoutes);

app.register(locaisAcaoRoutes);

app.register(pessoasRoutes);

app.register(participantesRoutes);

app.register(membrosEquipeRoutes);

app.register(acoesExtensionistasRoutes);

app.register(documentosAcaoRoutes);

app.register(associacoesAcaoRoutes);

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

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
