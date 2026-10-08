import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

const cursoSelect = {
  id: true,
  colegiadoId: true,
  nome: true,
  sigla: true,
  nivel: true,
  cargaHoraria: true,
  duracaoPeriodos: true,
};

export async function cursosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/cursos",
    model: prisma.curso,
    select: cursoSelect,

    fields: {
      id: {
        type: "number",
        optional: true,
      },
      colegiadoId: { type: "number" },
      nome: trimmedStringFieldConfig,
      sigla: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
      nivel: { type: "string" },
      cargaHoraria: {
        type: "number",
        optional: true,
      },
      duracaoPeriodos: {
        type: "number",
        optional: true,
      },
    },

    messages: {
      notFound: "Curso nao encontrado.",
      foreignKey: "Colegiado informado nao existe.",
      hasRelations: "Curso possui registros vinculados.",
    },
  });
}
