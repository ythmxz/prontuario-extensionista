import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

export async function acoesExtensionistasRoutes(
  app: FastifyInstance
) {
  setupCrudRoutes({
    app,
    path: "/acoes-extensionistas",
    model: prisma.acaoExtensionista,

    select: {
      id: true,
      titulo: true,
      descricao: true,
      dataInicio: true,
      dataFim: true,
      cargaHoraria: true,
      modalidade: true,
      publicoAlvo: true,
      status: true,
      linhaAtuacaoId: true,
      tipoAcaoId: true,
      localId: true,
    },

    fields: {
      // Gerado automaticamente
      id: {
        type: "number",
        optional: true,
      },

      // Obrigatórios
      linhaAtuacaoId: {
        type: "number",
      },

      tipoAcaoId: {
        type: "number",
      },

      localId: {
        type: "number",
      },

      titulo: trimmedStringFieldConfig,

      descricao: trimmedStringFieldConfig,

      dataInicio: {
        type: "string",
      },

      // Opcional no banco
      dataFim: {
        type: "string",
        optional: true,
      },

      cargaHoraria: {
        type: "number",
      },

      modalidade: {
        type: "string",
      },

      publicoAlvo: trimmedStringFieldConfig,

      status: {
        type: "string",
      },
    },

    messages: {
      notFound:
        "Ação extensionista não encontrada.",

      foreignKey:
        "Linha de Atuação, Tipo de Ação ou Local não existe.",
    },
  });
}