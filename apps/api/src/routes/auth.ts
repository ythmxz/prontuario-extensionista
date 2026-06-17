import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const body = request.body as {
      email: string;
      password: string;
    };

    const email = body.email?.trim();

    if (!email || !body.password) {
      return reply.status(400).send({ message: "Email e senha sao obrigatorios." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return reply.status(401).send({ message: "Credenciais invalidas." });
    }

    if (!user.passwordHash) {
      return reply.status(401).send({ message: "Credenciais invalidas." });
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValid) {
      return reply.status(401).send({ message: "Credenciais invalidas." });
    }

    const { passwordHash, ...safeUser } = user;
    return reply.status(200).send(safeUser);
  });
}
