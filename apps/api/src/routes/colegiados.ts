import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const colegiadoSelect = {
  id: true,
  nome: true,
  departamentoId: true,
};

export async function colegiadosRoutes(app: FastifyInstance) {
  app.get("/colegiados", async (request) => {
    const { nome, departamentoId } = request.query as {
      nome?: string;
      departamentoId?: string;
    };

    const colegiados = await prisma.colegiado.findMany({
      where: {
        nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
        departamentoId: departamentoId ? Number(departamentoId) : undefined,
      },
      select: colegiadoSelect,
    });

    return colegiados;
  });

  app.get("/colegiados/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const colegiadoId = Number(id);

    if (Number.isNaN(colegiadoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const colegiado = await prisma.colegiado.findUnique({
      where: { id: colegiadoId },
      select: colegiadoSelect,
    });

    if (!colegiado) {
      return reply.status(404).send({ message: "Colegiado nao encontrado." });
    }

    return colegiado;
  });

  app.post("/colegiados", async (request, reply) => {
    const body = request.body as {
      nome: string;
      departamentoId: number;
    };

    const nome = body.nome?.trim();
    const departamentoId = Number(body.departamentoId);

    if (!nome || !body.departamentoId || Number.isNaN(departamentoId)) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
    }

    try {
      const colegiado = await prisma.colegiado.create({
        data: {
          nome,
          departamentoId,
        },
        select: colegiadoSelect,
      });

      return reply.status(201).send(colegiado);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Departamento informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.put("/colegiados/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const colegiadoId = Number(id);

    if (Number.isNaN(colegiadoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      nome: string;
      departamentoId: number;
    };

    if (!body.nome?.trim() || !body.departamentoId) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
    }

    try {
      const colegiado = await prisma.colegiado.update({
        where: {
          id: colegiadoId,
        },
        data: {
          nome: body.nome,
          departamentoId: Number(body.departamentoId),
        },
        select: colegiadoSelect,
      });

      return reply.status(200).send(colegiado);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Colegiado nao encontrado." });
        }
        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Departamento informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.patch("/colegiados/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const colegiadoId = Number(id);

    if (Number.isNaN(colegiadoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      nome?: string;
      departamentoId?: number;
    };

    try {
      const colegiado = await prisma.colegiado.update({
        where: {
          id: colegiadoId,
        },
        data: {
          nome: body.nome,
          departamentoId: body.departamentoId ? Number(body.departamentoId) : undefined,
        },
        select: colegiadoSelect,
      });

      return reply.status(200).send(colegiado);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Colegiado nao encontrado." });
        }
        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Departamento informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.delete("/colegiados/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const colegiadoId = Number(id);

    if (Number.isNaN(colegiadoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    try {
      await prisma.colegiado.delete({
        where: {
          id: colegiadoId,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Colegiado nao encontrado." });
        }
        if (error.code === "P2003") {
          return reply.status(409).send({ message: "Colegiado possui cursos vinculados." });
        }
      }

      throw error;
    }
  });
}