import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";

export async function participantesRoutes(app: FastifyInstance) {
  app.get("/participantes", async () => {
    return await prisma.participante.findMany({
      select: {
        id: true,
        pessoaId: true,
        escolaridade: true,
        nomeResponsavel: true,
        telResponsavel: true,
        observacoes: true,
        pessoa: {
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
        },
        participacoes: {
          select: {
            id: true,
            dataParticipacao: true,
            frequencia: true,
            observacoes: true,
            acao: {
              select: {
                id: true,
                titulo: true,
                status: true,
                dataInicio: true,
                dataFim: true,
              },
            },
          },
          orderBy: {
            dataParticipacao: "desc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  });
}