import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes } from "./common.ts";

const professorSelect = {
  id: true,
  pessoaId: true,
  departamentoId: true,
  matricula: true,
  vinculo: true,
};

export async function professoresRoutes(app: FastifyInstance) {
  const toTrimmedString = (x: any): string => String(x).trim();
  const trimmedStringProcess = {
    type: "string",
    process: toTrimmedString,
  };

  setupCrudRoutes({
    app,
    path: "/professores",
    model: prisma.professor,
    select: professorSelect,

    fields: {
      id: { type: "number" },
      pessoaId: { type: "number" },
      departamentoId: { type: "number" },
      matricula: trimmedStringProcess,
      vinculo: trimmedStringProcess,
    },

    messages: {
      notFound: "Professor nao encontrado.",
      duplicate: "Professor ja cadastrado.",
      foreignKey: "Pessoa ou departamento informado nao existe.",
      hasRelations: "Professor possui registros vinculados.",
    },
  });
}
