import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const membroSelect = {
  id: true,
  tipo: true,
  matricula: true,
  vinculo: true,
  pessoa: { select: { id: true, nome: true, cpf: true, email: true, telefone: true } },
  departamento: { select: { id: true, nome: true, sigla: true } },
};

const tiposMembro = ["COORDENADOR", "DOCENTE", "DISCENTE", "VOLUNTARIO", "TECNICO"];

export async function membrosEquipeRoutes(app: FastifyInstance) {
  app.get("/membros-equipe", async (request) => {
    const { tipo, departamentoId } = request.query as { tipo?: string; departamentoId?: string };
    return await prisma.membroEquipe.findMany({
      where: {
        tipo: tipo ? (tipo as any) : undefined,
        departamentoId: departamentoId ? Number(departamentoId) : undefined,
      },
      select: membroSelect,
    });
  });

  app.get("/membros-equipe/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const membroId = Number(id);
    if (Number.isNaN(membroId)) return reply.status(400).send({ message: "ID inválido." });

    const membro = await prisma.membroEquipe.findUnique({ where: { id: membroId }, select: membroSelect });
    if (!membro) return reply.status(404).send({ message: "Membro de equipe não encontrado." });
    return membro;
  });

  app.post("/membros-equipe", async (request, reply) => {
    const body = request.body as { pessoaId: number; departamentoId?: number; tipo: string; matricula?: string; vinculo?: string };
    const pessoaId = Number(body.pessoaId);
    const tipo = body.tipo;

    if (!pessoaId || Number.isNaN(pessoaId) || !tipo || !tiposMembro.includes(tipo)) {
      return reply.status(400).send({ message: "Dados obrigatórios ausentes ou tipo inválido." });
    }

    try {
      const membro = await prisma.membroEquipe.create({
        data: {
          pessoaId,
          departamentoId: body.departamentoId ? Number(body.departamentoId) : undefined,
          tipo: tipo as any,
          matricula: body.matricula?.trim(),
          vinculo: body.vinculo?.trim(),
        },
        select: membroSelect,
      });
      return reply.status(201).send(membro);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") return reply.status(409).send({ message: "Pessoa já cadastrada na equipe." });
        if (error.code === "P2003") return reply.status(400).send({ message: "Pessoa ou Departamento não existe." });
      }
      throw error;
    }
  });

  app.delete("/membros-equipe/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const membroId = Number(id);
    if (Number.isNaN(membroId)) return reply.status(400).send({ message: "ID inválido." });

    try {
      await prisma.membroEquipe.delete({ where: { id: membroId } });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return reply.status(404).send({ message: "Membro não encontrado." });
      }
      throw error;
    }
  });
}