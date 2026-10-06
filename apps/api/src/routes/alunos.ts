import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

const alunoSelect = {
  id: true,
  pessoaId: true,
  cursoId: true,
  matricula: true,
  periodoAtual: true,
  situacao: true,
  dataIngresso: true,
};

export async function alunosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/alunos",
    model: prisma.aluno,
    select: alunoSelect,

    fields: {
      id: {
        type: "number",
        optional: true,
      },
      pessoaId: { type: "number" },
      cursoId: { type: "number" },
      matricula: trimmedStringFieldConfig,
      periodoAtual: {
        type: "number",
        optional: true,
      },
      situacao: {
        type: "string",
        optional: true,
      },
      dataIngresso: {
        type: "string",
        process: (value) => new Date(String(value)),
      },
    },

    messages: {
      notFound: "Aluno nao encontrado.",
      duplicate: "Aluno ja cadastrado.",
      foreignKey: "Pessoa ou curso informado nao existe.",
      hasRelations: "Aluno possui registros vinculados.",
    },
  });
}