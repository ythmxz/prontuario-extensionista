import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.ts";
import { usersRoutes } from "./routes/users.ts";

const app = Fastify({ logger: false });

app.register(cors, {
  origin: true,
});

app.register(authRoutes);
app.register(usersRoutes);

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    const address = await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log(address)
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
