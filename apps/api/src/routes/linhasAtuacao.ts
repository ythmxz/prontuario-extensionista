import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const linhaAtuacaoSelect = {
  id: true,
  nucleoId: true,
  nome: true,
  descricao: true,
  publicoFoco: true,
  // TODO: acoes
};

export async function linhasAtuacaoRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/linhasAtuacao",
    model: prisma.linhaAtuacao,
    select: linhaAtuacaoSelect,

    fields: {
      id: { type: "number" },
      nucleoId: { type: "number" },
      nome: trimmedStringFieldConfig,
      descricao: trimmedStringFieldConfig,
      publicoFoco: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Linha de atuacao nao encontrada.",
      duplicate: "Linha de atuacao ja cadastrada.",
      foreignKey: "Nucleo informado nao existe.",
      hasRelations: "Nucleo possui registros vinculados.",
    },
  });
}
