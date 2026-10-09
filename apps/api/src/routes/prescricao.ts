import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const prescricaoSelect = {
  id: true,
  atendimentoId: true,
  descricao: true,
  validade: true,
  observacoes: true,
  // TODO: como acessar "linhas de atuação"?
};

export async function prescricaoRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/prescricao",
    model: prisma.prescricao,
    select: prescricaoSelect,

    fields: {
      id: { type: "number" },
      atendimentoId: { type: "number" },
      descricao: trimmedStringFieldConfig,
      validade: {type: "string",
        process: (value) => new Date(String(value))},
      observacoes: trimmedStringFieldConfig
    },

    messages: {
      notFound: "Prescricao nao encontrado.",
      foreignKey: "Atendimento informado nao existe.",
      hasRelations: "Atendimento possui registros vinculados.",
    },
  });
}
