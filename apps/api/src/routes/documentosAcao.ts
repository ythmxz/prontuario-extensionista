import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

export async function documentosAcaoRoutes(
  app: FastifyInstance
) {
  setupCrudRoutes({
    app,
    path: "/documentos-acao",
    model: prisma.documentoAcao,

    select: {
      id: true,
      acaoId: true,
      tipo: true,
      titulo: true,
      arquivoUrl: true,
    },

    fields: {
      id: {
        type: "number",
        optional: true,
      },

      acaoId: {
        type: "number",
      },

      tipo: {
        type: "string",
      },

      titulo: trimmedStringFieldConfig,

      arquivoUrl: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Documento não encontrado.",

      foreignKey:
        "Ação extensionista informada não existe.",
    },
  });
}