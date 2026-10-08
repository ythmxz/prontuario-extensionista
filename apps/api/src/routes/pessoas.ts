import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";
import {
  setupCrudRoutes,
  trimmedStringFieldConfig,
} from "./common.ts";

const pessoaSelect = {
  id: true,
  cpf: true,
  nome: true,
  dataNascimento: true,
  sexo: true,
  telefone: true,
  email: true,
  endereco: true,
  municipio: true,
  uf: true,
};

export async function pessoasRoutes(app: FastifyInstance) {
  setupCrudRoutes({
    app,
    path: "/pessoas",
    model: prisma.pessoa,
    select: pessoaSelect,

    fields: {
      id: {
        type: "number",
        optional: true,
      },

      cpf: trimmedStringFieldConfig,

      nome: trimmedStringFieldConfig,

      dataNascimento: {
        type: "string",
        process: (value) => new Date(String(value)),
      },

      sexo: {
        type: "string",
      },

      telefone: {
        ...trimmedStringFieldConfig,
        optional: true,
      },

      email: {
        ...trimmedStringFieldConfig,
        optional: true,
      },

      endereco: {
        ...trimmedStringFieldConfig,
        optional: true,
      },

      municipio: {
        ...trimmedStringFieldConfig,
        optional: true,
      },

      uf: {
        ...trimmedStringFieldConfig,
        optional: true,
      },
    },

    messages: {
      notFound: "Pessoa nao encontrada.",
      foreignKey: "Dados relacionados informados nao existem.",
      hasRelations: "Pessoa possui registros vinculados.",
    },
  });
}
