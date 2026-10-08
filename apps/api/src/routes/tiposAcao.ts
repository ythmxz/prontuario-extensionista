import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const tipoAcaoSelect = {
  id: true,
  nome: true,
  descricao: true,
  // TODO: acoes extensionistas
};

export async function tiposAcaoRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/tipos-acao",
    model: prisma.tipoAcao,
    select: tipoAcaoSelect,

    fields: {
      id: { type: "number" },
      nome: trimmedStringFieldConfig,
      descricao: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Tipo de açao nao encontrada.",
      hasRelations: "Tipo de acao possui registros vinculados.",
    },
  });
}
