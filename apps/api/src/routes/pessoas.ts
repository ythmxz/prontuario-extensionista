import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";

export async function pessoasRoutes(
  app: FastifyInstance
) {
  app.get("/pessoas", async () => {
    return await prisma.pessoa.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        dataNascimento: true,
        sexo: true,
        telefone: true,
        email: true,
        endereco: true,
        municipio: true,
        uf: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  });
}
