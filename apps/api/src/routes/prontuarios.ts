import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const prontuarioSelect = {
  id: true,
  participanteId: true,
  numeroProntuario: true,
  dataAbertura: true,
  tipoSanguineo: true,
  alergias: true,
  obsGerais: true
  // TODO: como acessar "linhas de atuação"?
};

export async function prontuariosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/prontuarios",
    model: prisma.prontuario,
    select: prontuarioSelect,

    fields: {
      id: { type: "number" },
      participanteId: { type: "number" },
      numeroProntuario: trimmedStringFieldConfig,
      dataAbertura: {type: "string",
        process: (value) => new Date(String(value))},
      tipoSanguineo: trimmedStringFieldConfig,
      alergias: trimmedStringFieldConfig,
      obsGerais: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Prontuario nao encontrado.",
      foreignKey: "Participante informado nao existe.",
      hasRelations: "Participante possui registros vinculados.",
    },
  });
}
