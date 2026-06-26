import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const cursoSelect = {
  id: true,
  colegiadoId: true,
  nome: true,
  sigla: true,
  nivel: true,
  cargaHoraria: true,
  duracaoPeriodos: true,
};

const niveisCurso = ["GRADUACAO", "ESPECIALIZACAO", "MESTRADO", "DOUTORADO"];

export async function cursosRoutes(app: FastifyInstance) {
  app.get("/cursos", async (request) => {
    const { nome, colegiadoId, nivel } = request.query as {
      nome?: string;
      colegiadoId?: string;
      nivel?: string;
    };

    const cursos = await prisma.curso.findMany({
      where: {
        nome: nome ? { contains: nome, mode: "insensitive" } : undefined,
        colegiadoId: colegiadoId ? Number(colegiadoId) : undefined,
        nivel: nivel as any,
      },
      select: cursoSelect,
    });

    return cursos;
  });

  app.get("/cursos/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const cursoId = Number(id);

    if (Number.isNaN(cursoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
      select: cursoSelect,
    });

    if (!curso) {
      return reply.status(404).send({ message: "Curso nao encontrado." });
    }

    return curso;
  });

  app.post("/cursos", async (request, reply) => {
    const body = request.body as {
      colegiadoId: number;
      nome: string;
      sigla?: string;
      nivel: string;
      cargaHoraria?: number;
      duracaoPeriodos?: number;
    };

    const colegiadoId = Number(body.colegiadoId);
    const nome = body.nome?.trim();
    const sigla = body.sigla?.trim() || undefined;
    const nivel = body.nivel;
    const cargaHoraria =
      body.cargaHoraria !== undefined ? Number(body.cargaHoraria) : undefined;
    const duracaoPeriodos =
      body.duracaoPeriodos !== undefined ? Number(body.duracaoPeriodos) : undefined;

    if (
      !body.colegiadoId ||
      Number.isNaN(colegiadoId) ||
      !nome ||
      !nivel ||
      !niveisCurso.includes(nivel)
    ) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes ou invalidos." });
    }

    if (
      (cargaHoraria !== undefined && Number.isNaN(cargaHoraria)) ||
      (duracaoPeriodos !== undefined && Number.isNaN(duracaoPeriodos))
    ) {
      return reply.status(400).send({ message: "Campos numericos invalidos." });
    }

    try {
      const curso = await prisma.curso.create({
        data: {
          colegiadoId,
          nome,
          sigla,
          nivel: nivel as any,
          cargaHoraria,
          duracaoPeriodos,
        },
        select: cursoSelect,
      });

      return reply.status(201).send(curso);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Colegiado informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.put("/cursos/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const cursoId = Number(id);

    if (Number.isNaN(cursoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      colegiadoId: number;
      nome: string;
      sigla?: string;
      nivel: string;
      cargaHoraria?: number;
      duracaoPeriodos?: number;
    };

    const colegiadoId = Number(body.colegiadoId);
    const nome = body.nome?.trim();
    const sigla = body.sigla?.trim() || undefined;
    const nivel = body.nivel;
    const cargaHoraria =
      body.cargaHoraria !== undefined ? Number(body.cargaHoraria) : undefined;
    const duracaoPeriodos =
      body.duracaoPeriodos !== undefined ? Number(body.duracaoPeriodos) : undefined;

    if (
      !body.colegiadoId ||
      Number.isNaN(colegiadoId) ||
      !nome ||
      !nivel ||
      !niveisCurso.includes(nivel)
    ) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes ou invalidos." });
    }

    if (
      (cargaHoraria !== undefined && Number.isNaN(cargaHoraria)) ||
      (duracaoPeriodos !== undefined && Number.isNaN(duracaoPeriodos))
    ) {
      return reply.status(400).send({ message: "Campos numericos invalidos." });
    }

    try {
      const curso = await prisma.curso.update({
        where: {
          id: cursoId,
        },
        data: {
          colegiadoId,
          nome,
          sigla,
          nivel: nivel as any,
          cargaHoraria,
          duracaoPeriodos,
        },
        select: cursoSelect,
      });

      return reply.status(200).send(curso);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Curso nao encontrado." });
        }

        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Colegiado informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.patch("/cursos/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const cursoId = Number(id);

    if (Number.isNaN(cursoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    const body = request.body as {
      colegiadoId?: number;
      nome?: string;
      sigla?: string;
      nivel?: string;
      cargaHoraria?: number;
      duracaoPeriodos?: number;
    };

    const colegiadoId =
      body.colegiadoId !== undefined ? Number(body.colegiadoId) : undefined;

    const nome = body.nome !== undefined ? body.nome.trim() : undefined;
    const sigla = body.sigla !== undefined ? body.sigla.trim() : undefined;
    const nivel = body.nivel;

    const cargaHoraria =
      body.cargaHoraria !== undefined ? Number(body.cargaHoraria) : undefined;

    const duracaoPeriodos =
      body.duracaoPeriodos !== undefined ? Number(body.duracaoPeriodos) : undefined;

    if (nome !== undefined && !nome) {
      return reply.status(400).send({ message: "Nome invalido." });
    }

    if (colegiadoId !== undefined && Number.isNaN(colegiadoId)) {
      return reply.status(400).send({ message: "Colegiado invalido." });
    }

    if (nivel !== undefined && !niveisCurso.includes(nivel)) {
      return reply.status(400).send({ message: "Nivel de curso invalido." });
    }

    if (
      (cargaHoraria !== undefined && Number.isNaN(cargaHoraria)) ||
      (duracaoPeriodos !== undefined && Number.isNaN(duracaoPeriodos))
    ) {
      return reply.status(400).send({ message: "Campos numericos invalidos." });
    }

    try {
      const curso = await prisma.curso.update({
        where: {
          id: cursoId,
        },
        data: {
          colegiadoId,
          nome,
          sigla,
          nivel: nivel as any,
          cargaHoraria,
          duracaoPeriodos,
        },
        select: cursoSelect,
      });

      return reply.status(200).send(curso);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Curso nao encontrado." });
        }

        if (error.code === "P2003") {
          return reply.status(400).send({ message: "Colegiado informado nao existe." });
        }
      }

      throw error;
    }
  });

  app.delete("/cursos/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const cursoId = Number(id);

    if (Number.isNaN(cursoId)) {
      return reply.status(400).send({ message: "Id invalido." });
    }

    try {
      await prisma.curso.delete({
        where: {
          id: cursoId,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return reply.status(404).send({ message: "Curso nao encontrado." });
        }

        if (error.code === "P2003") {
          return reply.status(409).send({ message: "Curso possui alunos vinculados." });
        }
      }

      throw error;
    }
  });
}