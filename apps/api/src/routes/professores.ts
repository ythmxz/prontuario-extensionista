import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const professorSelect = {
  id: true,
  pessoaId: true,
  departamentoId: true,
  matricula: true,
  vinculo: true,
};

export async function professoresRoutes(app: FastifyInstance) {
  app.get("/professores", async (request) => {
    const { nome, departamentoId } = request.query as {
      id?: string;
      pessoaId?: string,
      departamentoId?: string;
      matricula?: string;
      vinculo?: string;
    };

    function maybeQueryNum(s: ?string): number | undefined {
      return s ? Number(s) : undefined;
    }

    function maybeQueryStrExact(s: ?string): string | undefined {
      return s ? s : undefined;
    }

    return await prisma.professor.findMany({
      where: {
        id: maybeQueryNum(id),
        pessoaId: maybeQueryNum(pessoaId),
        departamentoId: maybeQueryStrExact(departamentoId),
        matricula: maybeQueryNum(matricula),
        vinculo: maybeQueryStrExact(vinculo),
      },
      select: professorSelect,
    });
  });

  app.get("/professores/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const profId = Number(id);

    if (Number.isNaN(profId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const ret = await prisma.professor.findUnique({
      where: { id: profId },
      select: professorSelect,
    });

    if (!ret) {
      return reply.status(404).send({ message: "Professor nao encontrado." });
    }

    return ret;
  });
}

/* ----------------------------------- */

app.post("/professores", async (request, reply) => {
  const body = request.body as {
    id: number;
    pessoaId: number;
    departamentoId: number;
    matricula: string;
    vinculo: string;
  };

  const id = Number(body.id);
  const pessoaId = Number(body.pessoaId);
  const departamentoId = Number(body.departamentoId);
  const matricula = body.matricula.trim();
  const vinculo = body.vinculo?.trim();

  if (Number.isNaN(id) || Number.isNaN(pessoaId) || Number.isNaN(departamentoId) || !matricula) {
    return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
  }

  try {
    const professor = await prisma.professor.create({
      data: {
        id,
        pessoaId,
        departamentoId,
        matricula,
        vinculo,
      },
      select: professorSelect,
    });

    return reply.status(201).send(professor);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return reply.status(400).send({ message: "Um ou mais IDs inválidos" });
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
