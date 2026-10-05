import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const localAcaoSelect = {
  id: true,
  nome: true,
  tipo: true,
  endereco: true,
  municipio: true,
  // TODO: acoes extensionistas
};

export async function locaisAcaoRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/locais-acao",
    model: prisma.localAcao,
    select: localAcaoSelect,

    fields: {
      id: { type: "number" },
      nome: trimmedStringFieldConfig,
      tipo: { type: "string" }, // TODO: ficar tipo { type: "string_enum", variants: ["ESCOLA", "UBS", "CAMPUS", "COMUNIDADE", "OUTRO"] }
      endereco: trimmedStringFieldConfig,
      municipio: trimmedStringFieldConfig,
    },

    messages: {
      notFound: "Local de acao nao encontrado.",
      duplicate: "Local de acao ja cadastrado.",
      hasRelations: "Local de acao possui registros vinculados.",
    },
  });
}
