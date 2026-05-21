import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

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
    });

    return users;
  });

  app.post("/users", async (request, reply) => {
    const body = request.body as {
      name: string;
      email: string;
    };

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return reply.status(201).send(user);
  });

  app.put("/users/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const body = request.body as {
      name: string;
      email: string;
    };

    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: body.name,
        email: body.email,
      },
    });

    return reply.status(200).send(user);
  });

  app.patch("/users/:email", async (request, reply) => {
    const { email } = request.params as { email: string };
    const body = request.body as {
      name?: string;
      email?: string;
    };

    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: body.name,
        email: body.email,
      },
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
