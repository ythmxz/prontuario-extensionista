import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  phone: true,
};

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users", async (request) => {
    const { name, email } = request.query as {
      name?: string;
      email?: string;
    };

    const users = await prisma.user.findMany({
      where: {
        name: name ? { contains: name, mode: "insensitive" } : undefined,
        email: email ? { contains: email, mode: "insensitive" } : undefined,
      },
      select: userSelect,
    });

    return users;
  });

  app.post("/users", async (request, reply) => {
    const body = request.body as {
      name: string;
      email: string;
      cpf: string;
      phone: string;
      password: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const cpf = body.cpf?.trim();
    const phone = body.phone?.trim();

    if (!name || !email || !cpf || !phone || !body.password) {
      return reply.status(400).send({ message: "Dados obrigatorios ausentes." });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          cpf,
          phone,
          passwordHash,
        },
        select: userSelect,
      });

      return reply.status(201).send(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return reply.status(409).send({ message: "Email ja cadastrado." });
        }
      }

      throw error;
    }
  });

  app.put("/users/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const body = request.body as {
      name: string;
      email: string;
      cpf: string;
      phone: string;
    };

    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        phone: body.phone,
      },
      select: userSelect,
    });

    return reply.status(200).send(user);
  });

  app.patch("/users/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const body = request.body as {
      name?: string;
      email?: string;
      cpf?: string;
      phone?: string;
    };

    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: body.name,
        email: body.email,
        cpf: body.cpf,
        phone: body.phone,
      },
      select: userSelect,
    });

    return reply.status(200).send(user);
  });

  app.delete("/users/:email", async (request, reply) => {
    const { email } = request.params as { email: string };

    await prisma.user.delete({
      where: {
        email: email,
      },
    });

    return reply.status(204).send();
  });
}
