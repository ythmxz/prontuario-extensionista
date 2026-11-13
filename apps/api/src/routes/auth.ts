import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.ts";
import jwt from "@fastify/jwt";
import { requireAuth } from "./common.ts";

const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  phone: true,
  passwordHash: true,
};

export async function authRoutes(app: FastifyInstance) {
  await app.register(jwt, {
    secret: "segredo-jwt-aleatorio-sla", // TODO: usar um segredo propriamente dito, externamente! algo tipo process.env.JWT_SECRET!
  });

  app.post("/auth/login", async (request, reply) => {
    const body = request.body as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim();

    if (!email || !body.password) {
      return reply.status(400).send({ message: "Email e senha sao obrigatorios." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });

    const authFailReply = () => reply.status(401).send({ message: "Credenciais invalidas." });

    if (!user) return authFailReply();
    if (!user.passwordHash) return authFailReply();

    const isValid = await bcrypt.compare(body.password, user.passwordHash);
    if (!isValid) return authFailReply();

    const { passwordHash, ...safeUser } = user;

    const token = app.jwt.sign(
      safeUser,
      { sub: user.id, expiresIn: "1h" },
    );

    return reply.send({ token, user: safeUser });
  });

  app.get("/auth/info", { preHandler: requireAuth }, async (request, reply) => {
    const payload = request.user as { sub?: string };

    if (!payload.sub) {
      return reply.status(401).send({ message: "Token inválido." });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: userSelect,
    });

    if (!user) {
      return reply.status(401).send({ message: "Usuário não encontrado." });
    }

    return reply.send(user);
  });
}
