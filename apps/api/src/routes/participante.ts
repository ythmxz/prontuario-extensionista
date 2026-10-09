import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const participanteSelect = {
  id: true,
  pessoaId: true,
  escolaridade: true,
  nomeResponsavel: true,
  telResponsavel: true,
  observacoes: true
  // TODO: como acessar "linhas de atuação"?
};

export async function participantesRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/participantes",
    model: prisma.participante,
    select: participanteSelect,

    fields: {
      id: { type: "number" },
      pessoaId: { type: "number" },
      escolaridade: trimmedStringFieldConfig,
      nomeResponsavel: trimmedStringFieldConfig,
      telResponsavel: trimmedStringFieldConfig,
      observacoes: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Participante nao encontrado.",
      foreignKey: "Pessoa informado nao existe.",
      hasRelations: "Pessoa possui registros vinculados.",
    },
  });
}
