import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import { setupCrudRoutes, FieldConfig, trimmedStringFieldConfig } from "./common.ts";

const avaliacaoFisicaSelect = {
  id: true,
  atendimentoId: true,
  pesoKg: true,
  alturaCm: true,
  imc: true,
  pressaoArterial: true,
  freqCardiaca: true,
  temperatura: true,
  saturacaoO2: true
  // TODO: como acessar "linhas de atuação"?
};

export async function avaliacaoFisicaRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/avaliacaoFisica",
    model: prisma.avaliacaoFisica,
    select: avaliacaoFisicaSelect,

    fields: {
      id: { type: "number" },
      atendimentoId: { type: "number" },
      pesoKg: { type: "number" },
      alturaCm: { type: "number" },
      imc: { type: "number" },
	  pressaoArterial: trimmedStringFieldConfig,
	  freqCardiaca: { type: "number" },
	  temperatura: { type: "number" },
	  saturacaoO2: { type: "number" }
    },

    messages: {
      notFound: "AvaliacaoFisica nao encontrado.",
      foreignKey: "Atendimento informado nao existe.",
      hasRelations: "Atendimento possui registros vinculados.",
    },
  });
}
