import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

export async function membrosEquipeRoutes(
  app: FastifyInstance
) {
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
      id: {
        type: "number",
        optional: true,
      },
      pessoaId: {
        type: "number",
      },
      departamentoId: {
        type: "number",
        optional: true,
      },
      tipo: {
        type: "string",
      },
      matricula: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
      vinculo: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
    },

    messages: {
      notFound: "Membro de equipe não encontrado.",
      foreignKey: "Pessoa ou Departamento não existe.",
    },
  });
}
