import { FastifyInstance, FastifyReply } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";

export type FieldType = "string" | "number";

export type FieldConfig = {
  type: FieldType;
  optional?: boolean;
  process?: (value: unknown) => unknown;
};

export type RouteOptions = {
  app: FastifyInstance;
  path: string;
  model: CrudModel;
  idField?: string;
  fields: Record<string, FieldConfig>;
  select: Record<string, boolean>;
  messages?: {
    notFound?: string;
    invalidId?: string;
    missingData?: string;
    invalidData?: string;
    duplicate?: string;
    foreignKey?: string;
    hasRelations?: string;
  };
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

  if (!fields[idField]) {
    throw new Error(
      `O campo de identificacao "${idField}" nao foi configurado.`,
    );
  }

  const messages = {
    notFound: "Registro nao encontrado.",
    invalidId: "Id invalido.",
    missingData: "Dados obrigatorios ausentes.",
    invalidData: "Dados invalidos.",
    duplicate: "Registro ja cadastrado.",
    foreignKey: "Um ou mais IDs invalidos.",
    hasRelations: "Registro possui registros vinculados.",
    ...options.messages,
  };

  const parseId = (id: string): number | string | undefined => {
    const idConfig = fields[idField];
    if (!idConfig) return undefined;
    return processField(idField, id);
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

      if (
        typeof processedValue !== "number" ||
        !Number.isFinite(processedValue)
      ) {
        return undefined;
      }
    }

    if (config.type === "string") {
      if (typeof value !== "string") {
        return undefined;
      }

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
          message: messages.duplicate,
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

  const parseBody = (body: Record<string, unknown>, partial: boolean): ParseBodyRet => {
    const value: Record<string, unknown> = {};

    for (const [fieldName, config] of Object.entries(fields)) {
      const fieldValue = body[fieldName];

      if (fieldValue === undefined || fieldValue === null) {
        if (!partial && !config.optional) {
          return {
            valid: false,
            message: messages.missingData,
          };
        }

        continue;
      }

      const processedValue = processField(fieldName, fieldValue);

      if (processedValue === undefined) {
        return {
          valid: false,
          message: messages.invalidData,
        };
      }

      if (
        config.type === "string" &&
        typeof processedValue === "string" &&
        processedValue.length === 0 &&
        !config.optional
      ) {
        return {
          valid: false,
          message: messages.missingData,
        };
      }

      value[fieldName] = processedValue;
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

  // create
  app.post(path, async (request, reply) => {
    const body = request.body as ParamMap;
    const data = parseBody(body, false);

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
    const data = parseBody(body, false);

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
    const data = parseBody(body, true);

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
