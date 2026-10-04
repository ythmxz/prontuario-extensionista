import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const nucleoSelect = {
  id: true,
  departamentoId: true,
  nome: true,
  sigla: true,
  objetivo: true,
  dataAprovacao: true,
  resolucaoConsepe: true,
  // TODO: como acessar "linhas de atuação"?
};

export async function nucleosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/nucleos",
    model: prisma.nucleo,
    select: nucleoSelect,

    fields: {
      id: { type: "number" },
      departamentoId: { type: "number" },
      nome: trimmedStringFieldConfig,
      sigla: trimmedStringFieldConfig,
      objetivo: trimmedStringFieldConfig,
      dataAprovacao: trimmedStringFieldConfig,
      resolucaoConsepe: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Nucleo nao encontrado.",
      duplicate: "Nucleo ja cadastrado.",
      foreignKey: "Departamento informado nao existe.",
      hasRelations: "Departamento possui registros vinculados.",
    },
  });
}
