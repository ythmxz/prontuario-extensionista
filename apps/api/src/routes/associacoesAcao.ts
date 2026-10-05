import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, trimmedStringFieldConfig } from "./common.ts";

export async function associacoesAcaoRoutes(app: FastifyInstance) {
  // Rota para Equipe da Ação
  setupCrudRoutes({
    app,
    path: "/equipe-acoes",
    model: prisma.equipeAcao,
    select: {
      id: true,
      membroId: true,
      acaoId: true,
      papel: true,
      dataEntrada: true,
      dataSaida: true,
      horasDedicadas: true,
    },
    fields: {
      id: { type: "number" },
      membroId: { type: "number" },
      acaoId: { type: "number" },
      papel: trimmedStringFieldConfig,
      dataEntrada: { type: "string" },
      dataSaida: { type: "string" },
      horasDedicadas: { type: "number" },
    },
    messages: {
      notFound: "Registro de equipe não encontrado.",
      duplicate: "Membro já vinculado a esta ação.",
      foreignKey: "Membro ou Ação não existe.",
    },
  });

  // Rota para Participação na Ação
  setupCrudRoutes({
    app,
    path: "/participacoes-acao",
    model: prisma.participacaoAcao,
    select: {
      id: true,
      participanteId: true,
      acaoId: true,
      dataParticipacao: true,
      frequencia: true,
      observacoes: true,
    },
    fields: {
      id: { type: "number" },
      participanteId: { type: "number" },
      acaoId: { type: "number" },
      dataParticipacao: { type: "string" },
      frequencia: { type: "string" },
      observacoes: trimmedStringFieldConfig,
    },
    messages: {
      notFound: "Participação não encontrada.",
      foreignKey: "Participante ou Ação não existe.",
    },
  });
}