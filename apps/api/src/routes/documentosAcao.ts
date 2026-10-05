import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const tiposDoc = ["RELATORIO", "MATERIAL_EDUCATIVO", "FOTO", "VIDEO", "OUTRO"];

export async function documentosAcaoRoutes(app: FastifyInstance) {
  app.get("/documentos-acao", async (request) => {
    const { acaoId } = request.query as { acaoId?: string };
    return await prisma.documentoAcao.findMany({
      where: { acaoId: acaoId ? Number(acaoId) : undefined },
      include: { acao: { select: { id: true, titulo: true } } },
    });
  });

  app.post("/documentos-acao", async (request, reply) => {
    const body = request.body as { acaoId: number; tipo: string; titulo: string; arquivoUrl: string };
    const acaoId = Number(body.acaoId);

    if (!acaoId || Number.isNaN(acaoId) || !body.tipo || !tiposDoc.includes(body.tipo) || !body.titulo || !body.arquivoUrl) {
      return reply.status(400).send({ message: "Dados obrigatórios ausentes ou inválidos." });
    }

    try {
      const documento = await prisma.documentoAcao.create({
        data: {
          acaoId,
          tipo: body.tipo as any,
          titulo: body.titulo.trim(),
          arquivoUrl: body.arquivoUrl.trim(),
        },
      });
      return reply.status(201).send(documento);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return reply.status(400).send({ message: "Ação extensionista informada não existe." });
      }
      throw error;
    }
  });

  app.delete("/documentos-acao/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const docId = Number(id);
    if (Number.isNaN(docId)) return reply.status(400).send({ message: "ID inválido." });

    try {
      await prisma.documentoAcao.delete({ where: { id: docId } });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return reply.status(404).send({ message: "Documento não encontrado." });
      }
      throw error;
    }
  });
}