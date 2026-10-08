import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const colegiadoSelect = {
  id: true,
  nome: true,
  departamentoId: true,
};

export async function colegiadosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/colegiados",
    model: prisma.colegiado,
    select: colegiadoSelect,

    fields: {
      id: { type: "number" },
      nome: trimmedStringFieldConfig,
      departamentoId: { type: "number" },
    },

    messages: {
      notFound: "Colegiado nao encontrado.",
      foreignKey: "Departamento informado nao existe.",
      hasRelations: "Colegiado possui registros vinculados.",
    },
  });
}
