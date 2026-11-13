import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";

const TIPOS_ATENDIMENTO = [
  "CONSULTA",
  "TRIAGEM",
  "ORIENTACAO",
  "ACOMPANHAMENTO",
  "OUTRO",
] as const;

type TipoAtendimento = (typeof TIPOS_ATENDIMENTO)[number];

type NovoAtendimentoBody = {
  participanteId?: number | string;
  acaoId?: number | string;
  profissionalId?: number | string;
  dataAtendimento?: string;
  tipoAtendimento?: string;
  motivoConsulta?: string;
  hipoteseDiagnostica?: string;
  conduta?: string;
  retornoPrevisto?: string;
};

function textoOuNull(valor?: string) {
  const texto = valor?.trim();
  return texto ? texto : null;
}

function inteiro(valor: unknown) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

export async function atendimentosRoutes(app: FastifyInstance) {
  // Profissionais (membros da equipe) com nome, para o formulário
  app.get("/atendimentos/profissionais", async () => {
    const membros = await prisma.membroEquipe.findMany({
      select: {
        id: true,
        tipo: true,
        pessoa: { select: { nome: true } },
      },
      orderBy: { id: "asc" },
    });

    return membros.map((membro) => ({
      id: membro.id,
      tipo: membro.tipo,
      nome: membro.pessoa.nome,
    }));
  });

  app.get("/atendimentos", async () => {
    return await prisma.atendimento.findMany({
      select: {
        id: true,
        prontuarioId: true,
        acaoId: true,
        profissionalId: true,
        dataAtendimento: true,
        tipoAtendimento: true,
        motivoConsulta: true,
        hipoteseDiagnostica: true,
        conduta: true,
        retornoPrevisto: true,
        prontuario: {
          select: {
            participante: {
              select: { pessoa: { select: { nome: true } } },
            },
          },
        },
      },
      orderBy: { dataAtendimento: "desc" },
    });
  });

  app.post("/atendimentos", async (request, reply) => {
    const body = (request.body ?? {}) as NovoAtendimentoBody;

    const participanteId = inteiro(body.participanteId);
    const acaoId = inteiro(body.acaoId);
    const profissionalId = inteiro(body.profissionalId);
    const motivoConsulta = body.motivoConsulta?.trim();
    const dataAtendimento = body.dataAtendimento
      ? new Date(body.dataAtendimento)
      : null;
    const retornoPrevisto = body.retornoPrevisto
      ? new Date(body.retornoPrevisto)
      : null;

    if (!participanteId) {
      return reply.status(400).send({ message: "Paciente e obrigatorio." });
    }

    if (!acaoId) {
      return reply.status(400).send({ message: "Acao e obrigatoria." });
    }

    if (!profissionalId) {
      return reply
        .status(400)
        .send({ message: "Profissional e obrigatorio." });
    }

    if (
      !body.tipoAtendimento ||
      !TIPOS_ATENDIMENTO.includes(body.tipoAtendimento as TipoAtendimento)
    ) {
      return reply.status(400).send({ message: "Tipo de atendimento invalido." });
    }

    if (!dataAtendimento || Number.isNaN(dataAtendimento.getTime())) {
      return reply.status(400).send({ message: "Data do atendimento invalida." });
    }

    if (!motivoConsulta) {
      return reply.status(400).send({ message: "Motivo e obrigatorio." });
    }

    if (retornoPrevisto && Number.isNaN(retornoPrevisto.getTime())) {
      return reply.status(400).send({ message: "Retorno previsto invalido." });
    }

    const [participante, acao, profissional] = await Promise.all([
      prisma.participante.findUnique({ where: { id: participanteId } }),
      prisma.acaoExtensionista.findUnique({ where: { id: acaoId } }),
      prisma.membroEquipe.findUnique({ where: { id: profissionalId } }),
    ]);

    if (!participante) {
      return reply.status(404).send({ message: "Paciente nao encontrado." });
    }

    if (!acao) {
      return reply.status(404).send({ message: "Acao nao encontrada." });
    }

    if (!profissional) {
      return reply.status(404).send({ message: "Profissional nao encontrado." });
    }

    // Todo atendimento fica num prontuario; cria o do paciente se ainda nao existir
    let prontuario = await prisma.prontuario.findUnique({
      where: { participanteId },
    });

    if (!prontuario) {
      prontuario = await prisma.prontuario.create({
        data: {
          participanteId,
          numeroProntuario: `PRT-${String(participanteId).padStart(6, "0")}`,
        },
      });
    }

    const atendimento = await prisma.atendimento.create({
      data: {
        prontuarioId: prontuario.id,
        acaoId,
        profissionalId,
        dataAtendimento,
        tipoAtendimento: body.tipoAtendimento as TipoAtendimento,
        motivoConsulta,
        hipoteseDiagnostica: textoOuNull(body.hipoteseDiagnostica),
        conduta: textoOuNull(body.conduta),
        retornoPrevisto,
      },
      select: { id: true, prontuarioId: true },
    });

    return reply.status(201).send(atendimento);
  });
}
