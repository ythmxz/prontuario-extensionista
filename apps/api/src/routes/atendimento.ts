import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const atendimentoSelect = {
  id: true,
  prontuarioId: true,
  acaoId: true,
  profissionalId: true,
  dataAtendimento: true,
  motivoConsulta: true,
  hipoteseDiagnostica: true,
  conduta: true,
  retornoPrevisto: true,
  createdAt: true,
  updatedAt: true
  // TODO: como acessar "linhas de atuação"?
};

export async function atendimentosRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/atendimentos",
    model: prisma.atendimento,
    select: atendimentoSelect,

    fields: {
      id: { type: "number" },
      prontuarioId: { type: "number" },
      acaoId: { type: "number" },
      profissionalId: { type: "number" },
      dataAtendimento: {type: "string",
        process: (value) => new Date(String(value))},
      observacoes: trimmedStringFieldConfig,
	  motivoConsulta: trimmedStringFieldConfig,
	  hipoteseDiagnostica: trimmedStringFieldConfig,
	  conduta: trimmedStringFieldConfig,
	  retornoPrevisto: {type: "string",
        process: (value) => new Date(String(value))},
	  createdAt: {type: "string",
        process: (value) => new Date(String(value))},
	  updatedAt: {type: "string",
        process: (value) => new Date(String(value))}
    },

    messages: {
      notFound: "Atendimento nao encontrado.",
      foreignKey: "Prontuario informado nao existe.",
      hasRelations: "Prontuario possui registros vinculados.",
    },
  });
}
