import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const professorSelect = {
  id: true,
  pessoaId: true,
  departamentoId: true,
  matricula: true,
  vinculo: true,
};

export async function professoresRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/professores",
    model: prisma.professor,
    select: professorSelect,

    fields: {
      id: { type: "number" },
      pessoaId: { type: "number" },
      departamentoId: { type: "number" },
      matricula: trimmedStringFieldConfig,
      vinculo: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Professor nao encontrado.",
      foreignKey: "Pessoa ou departamento informado nao existe.",
      hasRelations: "Professor possui registros vinculados.",
    },
  });
}
