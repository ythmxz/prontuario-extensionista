import { FastifyInstance } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const acaoSelect = {
  id: true,
  titulo: true,
  descricao: true,
  dataInicio: true,
  dataFim: true,
  cargaHoraria: true,
  modalidade: true,
  publicoAlvo: true,
  status: true,
  linhaAtuacao: { select: { id: true, nome: true } },
  tipoAcao: { select: { id: true, nome: true } },
  local: { select: { id: true, nome: true, municipio: true } },
};

const modalidades = ["PRESENCIAL", "REMOTO", "HIBRIDO"];
const statusAcao = ["PLANEJADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"];

export async function acoesExtensionistasRoutes(app: FastifyInstance) {
  app.get("/acoes-extensionistas", async (request) => {
    const { status, modalidade } = request.query as { status?: string; modalidade?: string };
    return await prisma.acaoExtensionista.findMany({
      where: {
        status: status ? (status as any) : undefined,
        modalidade: modalidade ? (modalidade as any) : undefined,
      },
      select: acaoSelect,
    });
  });

  app.get("/acoes-extensionistas/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const acaoId = Number(id);
    if (Number.isNaN(acaoId)) return reply.status(400).send({ message: "ID inválido." });

    const acao = await prisma.acaoExtensionista.findUnique({
      where: { id: acaoId },
      include: { linhaAtuacao: true, tipoAcao: true, local: true, documentos: true },
    });
    if (!acao) return reply.status(404).send({ message: "Ação não encontrada." });
    return acao;
  });

  app.post("/acoes-extensionistas", async (request, reply) => {
    const body = request.body as {
      linhaAtuacaoId: number;
      tipoAcaoId: number;
      localId: number;
      titulo: string;
      descricao: string;
      dataInicio: string;
      dataFim?: string;
      cargaHoraria: number;
      modalidade: string;
      publicoAlvo: string;
      status?: string;
    };

    const linhaAtuacaoId = Number(body.linhaAtuacaoId);
    const tipoAcaoId = Number(body.tipoAcaoId);
    const localId = Number(body.localId);
    const dataInicio = body.dataInicio ? new Date(body.dataInicio) : undefined;
    const modalidade = body.modalidade;
    const status = body.status || "PLANEJADA";

    if (
      !linhaAtuacaoId || !tipoAcaoId || !localId || !body.titulo || !body.descricao ||
      !dataInicio || Number.isNaN(dataInicio.getTime()) || !body.cargaHoraria ||
      !modalidade || !modalidades.includes(modalidade) || !body.publicoAlvo || !statusAcao.includes(status)
    ) {
      return reply.status(400).send({ message: "Dados obrigatórios ausentes ou inválidos." });
    }

    try {
      const acao = await prisma.acaoExtensionista.create({
        data: {
          linhaAtuacaoId,
          tipoAcaoId,
          localId,
          titulo: body.titulo.trim(),
          descricao: body.descricao.trim(),
          dataInicio,
          dataFim: body.dataFim ? new Date(body.dataFim) : undefined,
          cargaHoraria: new Prisma.Decimal(body.cargaHoraria),
          modalidade: modalidade as any,
          publicoAlvo: body.publicoAlvo.trim(),
          status: status as any,
        },
        select: acaoSelect,
      });
      return reply.status(201).send(acao);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        return reply.status(400).send({ message: "Linha de Atuação, Tipo de Ação ou Local não existe." });
      }
      throw error;
    }
  });

  app.delete("/acoes-extensionistas/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const acaoId = Number(id);
    if (Number.isNaN(acaoId)) return reply.status(400).send({ message: "ID inválido." });

    try {
      await prisma.acaoExtensionista.delete({ where: { id: acaoId } });
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return reply.status(404).send({ message: "Ação não encontrada." });
      }
      throw error;
    }
  });
}