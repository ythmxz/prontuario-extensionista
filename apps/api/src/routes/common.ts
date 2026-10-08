import { FastifyInstance, FastifyReply } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";

export type FieldType = "string" | "number";

export type FieldConfig = {
  type: FieldType;
  optional?: boolean;
  process?: (value: any) => any;
};

export type ErrorMessages = {
  notFound?: string;
  invalidId?: string;
  foreignKey?: string;
  hasRelations?: string;
};

export type RouteOptions = {
  app: FastifyInstance;
  path: string;
  model: CrudModel;
  idField?: string;
  fields: Record<string, FieldConfig>;
  select: Record<string, boolean>;
  messages?: ErrorMessages,
};

/**
 * Métodos que um modelo disponível no Prisma pode ter.
 */
export type CrudModel = {
  findMany(args: any): Promise<any>;
  findUnique(args: any): Promise<any>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
};

/**
 * Organiza as rotas para um modelo específico no banco de dados.
 */
export function setupCrudRoutes(options: RouteOptions): void {
  const { app, path, model, fields, select } = options;
  const idField = options.idField ?? "id";

  const idConfig = fields[idField];
  if (!idConfig) {
    throw new Error(`O campo de identificacao "${idField}" nao foi configurado.`);
  }

  const duplicateMessage = "Registro ja cadastrado.";

  const messages: ErrorMessages = {
    notFound: "Registro nao encontrado.",
    invalidId: "Id invalido.",
    foreignKey: "Um ou mais IDs invalidos.",
    hasRelations: "Registro possui registros vinculados.",
    ...options.messages,
  };

  const parseId = (id: string): number | undefined => {
    const ret = processField(idField, id);
    return (typeof ret === "number") ? ret : undefined;
  };

  const processField = (fieldName: string, value: unknown): unknown | undefined => {
    const config = fields[fieldName];
    if (!config) return undefined;

    let processedValue = value;

    if (config.type === "number") {
      if (typeof value === "number") {
        processedValue = value;
      } else if (typeof value === "string" && value.trim() !== "") {
        processedValue = Number(value);
      } else {
        return undefined;
      }

      if (typeof processedValue !== "number" || !Number.isFinite(processedValue)) {
        return undefined;
      }
    }

    if (config.type === "string") {
      if (typeof value !== "string") return undefined;
      processedValue = value;
    }

    if (config.process) {
      processedValue = config.process(processedValue);
    }

    return processedValue;
  };

  const handlePrismaError = (error: unknown, reply: FastifyReply): any => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return reply.status(404).send({
          message: messages.notFound,
        });
      }

      if (error.code === "P2002") {
        return reply.status(409).send({
          message: duplicateMessage,
        });
      }

      if (error.code === "P2003") {
        return reply.status(400).send({
          message: messages.foreignKey,
        });
      }

      if (error.code === "P2014") {
        return reply.status(409).send({
          message: messages.hasRelations,
        });
      }
    }

    throw error;
  };

  type ParseBodyRet =
    | { valid: true; value: Record<string, unknown> }
    | { valid: false; message: string };

  const parseBody = (body: Record<string, unknown>, partial: boolean, needId: boolean): ParseBodyRet => {
    const value: Record<string, unknown> = {};

    // lista de campos que estão faltando ou inválidos (vai ser montada nas iterações abaixo)
    const badFields: string[] = [];

    for (const [fieldName, config] of Object.entries(fields)) {
      const fieldValue = body[fieldName];

      if (fieldValue === undefined || fieldValue === null) {
        if (!partial && !config.optional && !(fieldName === idField && !needId)) {
          // reclamar que o valor está faltando
          badFields.push(fieldName);
        }

        // pular esta iteração e ir p/ o próximo campo
        continue;
      }

      const processedValue = processField(fieldName, fieldValue);

      if (processedValue === undefined) {
        badFields.push(`${fieldName} (dados invalidos)`);
      }

      // considerar campos de string vazios como faltando
      // FIXME: é bom esse sempre ser o caso?
      if (
        config.type === "string" &&
        typeof processedValue === "string" &&
        processedValue.length === 0 &&
        !config.optional
      ) {
        badFields.push(fieldName);
        continue;
      }

      value[fieldName] = processedValue;
    }

    if (badFields.length > 0) {
      return {
        valid: false,
        message: "Campos ausentes/invalidos: " + badFields.join(", "),
      }
    }

    return {
      valid: true,
      value,
    };
  };

  type ParamMap = Record<string, unknown>;

  // findMany
  app.get(path, async (request) => {
    const query = request.query as ParamMap;
    const where: ParamMap = {};

    for (const fieldName of Object.keys(fields)) {
      if (query[fieldName] !== undefined) {
        where[fieldName] = processField(
          fieldName,
          query[fieldName],
        );
      }
    }

    return await model.findMany({ where, select });
  });

  // findUnique
  app.get(`${path}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsedId = parseId(id);

    if (parsedId === undefined) {
      return reply.status(400).send({
        message: messages.invalidId,
      });
    }

    const record = await model.findUnique({
      where: {
        [idField]: parsedId,
      },
      select,
    });

    if (!record) {
      return reply.status(404).send({
        message: messages.notFound,
      });
    }

    return record;
  });

  // Criação (via POST)
  app.post(path, async (request, reply) => {
    const body = request.body as ParamMap;
    const data = parseBody(body, false, false);

    if (!data.valid) {
      return reply.status(400).send({
        message: data.message,
      });
    }

    try {
      const record = await model.create({
        data: data.value,
        select,
      });

      return reply.status(201).send(record);
    } catch (error) {
      return handlePrismaError(error, reply);
    }
  });

  // update
  app.put(`${path}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsedId = parseId(id);

    if (parsedId === undefined) {
      return reply.status(400).send({
        message: messages.invalidId,
      });
    }

    const body = request.body as ParamMap;
    const data = parseBody(body, false, false);

    if (!data.valid) {
      return reply.status(400).send({
        message: data.message,
      });
    }

    try {
      const record = await model.update({
        where: {
          [idField]: parsedId,
        },
        data: data.value,
        select,
      });

      return reply.status(200).send(record);
    } catch (error) {
      return handlePrismaError(error, reply);
    }
  });

  // patch
  app.patch(`${path}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsedId = parseId(id);

    if (parsedId === undefined) {
      return reply.status(400).send({
        message: messages.invalidId,
      });
    }

    const body = request.body as ParamMap;
    const data = parseBody(body, true, false);

    if (!data.valid) {
      return reply.status(400).send({
        message: data.message,
      });
    }

    if (Object.keys(data.value).length === 0) {
      return reply.status(400).send({
        message: "Nenhum dado informado.",
      });
    }

    try {
      const record = await model.update({
        where: {
          [idField]: parsedId,
        },
        data: data.value,
        select,
      });

      return reply.status(200).send(record);
    } catch (error) {
      return handlePrismaError(error, reply);
    }
  });

  // delete
  app.delete(`${path}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsedId = parseId(id);

    if (parsedId === undefined) {
      return reply.status(400).send({
        message: messages.invalidId,
      });
    }

    try {
      await model.delete({
        where: {
          [idField]: parsedId,
        },
      });

      return reply.status(204).send();
    } catch (error) {
      return handlePrismaError(error, reply);
    }
  });
}

export const trimmedStringFieldConfig: FieldConfig = {
  type: "string",
  process: (x: any): any => String(x).trim(),
};
