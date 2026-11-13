import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";

type NovoProntuarioBody = {
  participanteId?: number | string;
  numeroProntuario?: string;
  dataAbertura?: string;
  tipoSanguineo?: string;
  alergias?: string;
  obsGerais?: string;
};

const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function textoOuNull(valor?: string) {
  const texto = valor?.trim();
  return texto ? texto : null;
}

export async function prontuariosRoutes(app: FastifyInstance) {
  app.get("/prontuarios", async () => {
    return await prisma.prontuario.findMany({
      select: {
        id: true,
        participanteId: true,
        numeroProntuario: true,
        dataAbertura: true,
        tipoSanguineo: true,
        alergias: true,
        obsGerais: true,
        participante: {
          select: {
            pessoa: {
              select: { nome: true, cpf: true, email: true },
            },
          },
        },
        atendimentos: {
          select: {
            id: true,
            dataAtendimento: true,
            tipoAtendimento: true,
            motivoConsulta: true,
          },
          orderBy: { dataAtendimento: "desc" },
        },
      },
      orderBy: { id: "asc" },
    });
  });

  app.post("/prontuarios", async (request, reply) => {
    const body = (request.body ?? {}) as NovoProntuarioBody;

    const participanteId = Number(body.participanteId);
    const tipoSanguineo = body.tipoSanguineo?.trim().toUpperCase();
    const dataAbertura = body.dataAbertura
      ? new Date(body.dataAbertura)
      : undefined;

    if (!Number.isInteger(participanteId) || participanteId <= 0) {
      return reply.status(400).send({ message: "Paciente e obrigatorio." });
    }

    if (tipoSanguineo && !TIPOS_SANGUINEOS.includes(tipoSanguineo)) {
      return reply.status(400).send({ message: "Tipo sanguineo invalido." });
    }

    if (dataAbertura && Number.isNaN(dataAbertura.getTime())) {
      return reply.status(400).send({ message: "Data de abertura invalida." });
    }

    const participante = await prisma.participante.findUnique({
      where: { id: participanteId },
    });

    if (!participante) {
      return reply.status(404).send({ message: "Paciente nao encontrado." });
    }

    const existente = await prisma.prontuario.findUnique({
      where: { participanteId },
    });

    if (existente) {
      return reply
        .status(409)
        .send({ message: "Este paciente ja possui prontuario." });
    }

    const numeroProntuario =
      body.numeroProntuario?.trim() ||
      `PRT-${String(participanteId).padStart(6, "0")}`;

    if (numeroProntuario.length > 30) {
      return reply
        .status(400)
        .send({ message: "Numero do prontuario deve ter ate 30 caracteres." });
    }

    const numeroEmUso = await prisma.prontuario.findUnique({
      where: { numeroProntuario },
    });

    if (numeroEmUso) {
      return reply
        .status(409)
        .send({ message: "Ja existe um prontuario com este numero." });
    }

    const prontuario = await prisma.prontuario.create({
      data: {
        participanteId,
        numeroProntuario,
        dataAbertura,
        tipoSanguineo: tipoSanguineo || null,
        alergias: textoOuNull(body.alergias),
        obsGerais: textoOuNull(body.obsGerais),
      },
      select: { id: true, numeroProntuario: true },
    });

    return reply.status(201).send(prontuario);
  });
}
