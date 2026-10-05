import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

export async function associacoesAcaoRoutes(app: FastifyInstance) {
  // Equipe Ação
  app.get("/equipe-acoes", async () => {
    return await prisma.equipeAcao.findMany({
      include: {
        membro: { include: { pessoa: { select: { nome: true } } } },
        acao: { select: { id: true, titulo: true } },
      },
    });
  });

  app.post("/equipe-acoes", async (request, reply) => {
    const body = request.body as { membroId: number; acaoId: number; papel: string; dataEntrada: string; dataSaida?: string; horasDedicadas?: number };
    const membroId = Number(body.membroId);
    const acaoId = Number(body.acaoId);
    const dataEntrada = body.dataEntrada ? new Date(body.dataEntrada) : undefined;

    if (!membroId || !acaoId || !body.papel || !dataEntrada || Number.isNaN(dataEntrada.getTime())) {
      return reply.status(400).send({ message: "Dados obrigatórios ausentes ou inválidos." });
    }

    try {
      const vinculo = await prisma.equipeAcao.create({
        data: {
          membroId,
          acaoId,
          papel: body.papel.trim(),
          dataEntrada,
          dataSaida: body.dataSaida ? new Date(body.dataSaida) : undefined,
          horasDedicadas: body.horasDedicadas !== undefined ? new Prisma.Decimal(body.horasDedicadas) : undefined,
        },
      });
      return reply.status(201).send(vinculo);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") return reply.status(409).send({ message: "Membro já vinculado a esta ação." });
        if (error.code === "P2003") return reply.status(400).send({ message: "Membro ou Ação não existe." });
      }
      throw error;
    }
  });

  // Participação Ação
  app.get("/participacoes-acao", async () => {
    return await prisma.participacaoAcao.findMany({
      include: {
        participante: { include: { pessoa: { select: { nome: true } } } },
        acao: { select: { id: true, titulo: true } },
      },
    });
  });

  app.post("/participacoes-acao", async (request, reply) => {
    const body = request.body as { participanteId: number; acaoId: number; dataParticipacao: string; frequencia?: string; observacoes?: string };
    const participanteId = Number(body.participanteId);
    const acaoId = Number(body.acaoId);
    const dataParticipacao = body.dataParticipacao ? new Date(body.dataParticipacao) : undefined;

    if (!participanteId || !acaoId || !dataParticipacao || Number.isNaN(dataParticipacao.getTime())) {
      return reply.status(400).send({ message: "Dados obrigatórios ausentes ou inválidos." });
    }

    try {
      const part = await prisma.participacaoAcao.create({
        data: {
          participanteId,
          acaoId,
          dataParticipacao,
          frequencia: body.frequencia ? (body.frequencia as any) : "PRESENTE",
          observacoes: body.observacoes?.trim(),
        },
      });
      return reply.status(201).send(part);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return reply.status(400).send({ message: "Participante ou Ação não existe." });
      }
      throw error;
    }
  });
}