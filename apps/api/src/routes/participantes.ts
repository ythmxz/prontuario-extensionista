import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.ts";

type NovoParticipanteBody = {
  cpf?: string;
  nome?: string;
  dataNascimento?: string;
  sexo?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  municipio?: string;
  uf?: string;
  escolaridade?: string;
  nomeResponsavel?: string;
  telResponsavel?: string;
  observacoes?: string;
};

function textoOuNull(valor?: string) {
  const texto = valor?.trim();
  return texto ? texto : null;
}

export async function participantesRoutes(app: FastifyInstance) {
  app.post("/participantes", async (request, reply) => {
    const body = (request.body ?? {}) as NovoParticipanteBody;

    const nome = body.nome?.trim();
    const cpf = body.cpf?.replace(/\D/g, "");
    const uf = body.uf?.trim().toUpperCase();
    const dataNascimento = body.dataNascimento
      ? new Date(body.dataNascimento)
      : null;

    if (!nome) {
      return reply.status(400).send({ message: "Nome e obrigatorio." });
    }

    if (!cpf || cpf.length !== 11) {
      return reply.status(400).send({ message: "CPF deve ter 11 digitos." });
    }

    if (!dataNascimento || Number.isNaN(dataNascimento.getTime())) {
      return reply
        .status(400)
        .send({ message: "Data de nascimento invalida." });
    }

    if (!body.sexo || !["M", "F", "OUTRO"].includes(body.sexo)) {
      return reply.status(400).send({ message: "Sexo invalido." });
    }

    if (uf && uf.length !== 2) {
      return reply.status(400).send({ message: "UF deve ter 2 letras." });
    }

    const cpfExistente = await prisma.pessoa.findUnique({ where: { cpf } });

    if (cpfExistente) {
      return reply
        .status(409)
        .send({ message: "Ja existe uma pessoa com este CPF." });
    }

    const participante = await prisma.participante.create({
      data: {
        escolaridade: textoOuNull(body.escolaridade),
        nomeResponsavel: textoOuNull(body.nomeResponsavel),
        telResponsavel: textoOuNull(body.telResponsavel),
        observacoes: textoOuNull(body.observacoes),
        pessoa: {
          create: {
            cpf,
            nome,
            dataNascimento,
            sexo: body.sexo as "M" | "F" | "OUTRO",
            telefone: textoOuNull(body.telefone),
            email: textoOuNull(body.email),
            endereco: textoOuNull(body.endereco),
            municipio: textoOuNull(body.municipio),
            uf: uf || null,
          },
        },
      },
      select: { id: true, pessoaId: true },
    });

    return reply.status(201).send(participante);
  });

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