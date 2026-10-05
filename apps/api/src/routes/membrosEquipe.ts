import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, trimmedStringFieldConfig } from "./common.ts";

export async function membrosEquipeRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/membros-equipe",
    model: prisma.membroEquipe,
    select: {
      id: true,
      tipo: true,
      matricula: true,
      vinculo: true,
      pessoaId: true,
      departamentoId: true,
    },
    fields: {
      id: { type: "number" },
      pessoaId: { type: "number" },
      departamentoId: { type: "number" },
      tipo: { type: "string" },
      matricula: trimmedStringFieldConfig,
      vinculo: trimmedStringFieldConfig,
    },
    messages: {
      notFound: "Membro de equipe não encontrado.",
      duplicate: "Pessoa já cadastrada na equipe.",
      foreignKey: "Pessoa ou Departamento não existe.",
    },
  });
}