import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const departmentSelect = {
  id: true,
  nome: true,
  sigla: true,
};

export async function departmentsRoutes(app: FastifyInstance) {
  app.get("/departments", async (request) => {
    const { nome, sigla } = request.query as {
      nome?: string;
      sigla?: string;
    };

    const departamentos = await prisma.departamento.findMany({
      where: {
        nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
        sigla: sigla ? { contains: sigla, mode: "insensitive" } : undefined,
      },
      select: departmentSelect,
    });

    return departamentos;
  });

  app.get("/departments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const departamento = await prisma.departamento.findUnique({
      where: { id: departmentId },
      select: departmentSelect,
    });

    if (!departamento) {
      return reply.status(404).send({ message: "Departamento nao encontrado." });
    }

    return departamento;
  });

  app.post("/departments", async (request, reply) => {
    const body = request.body as {
      nome: string;
      sigla: string;
    };

    const nome = body.nome?.trim();
    const sigla = body.sigla?.trim();

    if (!nome || !sigla) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
    }

    try {
      const department = await prisma.departamento.create({
        data: {
          nome,
          sigla,
        },
        select: departmentSelect,
      });

      return reply.status(201).send(department);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return reply.status(409).send({ message: "Departamento ja cadastrado." });
        }
      }

      throw error;
    }
  });

  app.put("/departments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      nome: string;
      sigla: string;
    };

    if (!body.nome?.trim() || !body.sigla?.trim()) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
    }

    try {
      const department = await prisma.departamento.update({
        where: {
          id: departmentId,
        },
        data: {
          nome: body.nome,
          sigla: body.sigla,
        },
        select: departmentSelect,
      });

      return reply.status(200).send(department);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Departamento nao encontrado." });
        }
      }

      throw error;
    }
  });

  app.patch("/departments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      nome?: string;
      sigla?: string;
    };

    try {
      const department = await prisma.departamento.update({
        where: {
          id: departmentId,
        },
        data: {
          nome: body.nome,
          sigla: body.sigla,
        },
        select: departmentSelect,
      });

      return reply.status(200).send(department);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Departamento nao encontrado." });
        }
      }

      throw error;
    }
  });

  app.delete("/departments/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const departmentId = Number(id);

    if (Number.isNaN(departmentId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    try {
      await prisma.departamento.delete({
        where: {
          id: departmentId,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Departamento nao encontrado." });
        }
      }

      throw error;
    }
  });
}