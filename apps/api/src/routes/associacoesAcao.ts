import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

export async function associacoesAcaoRoutes(
  app: FastifyInstance
) {
  // ==========================================================
  // EQUIPE DA AÇÃO
  // ==========================================================

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
      // Gerado automaticamente
      id: {
        type: "number",
        optional: true,
      },

      // Obrigatórios
      membroId: {
        type: "number",
      },

      acaoId: {
        type: "number",
      },

      papel: trimmedStringFieldConfig,

      dataEntrada: {
        type: "string",
      },

      // Opcional
      dataSaida: {
        type: "string",
        optional: true,
      },

      // Opcional
      horasDedicadas: {
        type: "number",
        optional: true,
      },
    },

    messages: {
      notFound:
        "Registro de equipe não encontrado.",

      duplicate:
        "Membro já vinculado a esta ação.",

      foreignKey:
        "Membro ou Ação não existe.",
    },
  });

  // ==========================================================
  // PARTICIPAÇÃO NA AÇÃO
  // ==========================================================

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
      // Gerado automaticamente
      id: {
        type: "number",
        optional: true,
      },

      // Obrigatórios
      participanteId: {
        type: "number",
      },

      acaoId: {
        type: "number",
      },

      dataParticipacao: {
        type: "string",
      },

      frequencia: {
        type: "string",
      },

      // Opcional
      observacoes: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
    },

    messages: {
      notFound:
        "Participação não encontrada.",

      foreignKey:
        "Participante ou Ação não existe.",
    },
  });
}