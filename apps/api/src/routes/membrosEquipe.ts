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
      // Gerado automaticamente
      id: {
        type: "number",
        optional: true,
      },

      // Obrigatório
      pessoaId: {
        type: "number",
      },

      // Opcional
      departamentoId: {
        type: "number",
        optional: true,
      },

      // Obrigatório
      tipo: {
        type: "string",
      },

      // Opcional
      matricula: {
        ...trimmedStringFieldConfig,
        optional: true,
      },

      // Opcional
      vinculo: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
    },

    messages: {
      notFound:
        "Membro de equipe não encontrado.",

      duplicate:
        "Pessoa já cadastrada na equipe.",

      foreignKey:
        "Pessoa ou Departamento não existe.",
    },
  });
}