import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth.ts";
import { usersRoutes } from "./routes/users.ts";
import { departmentsRoutes } from "./routes/departments.ts";
import { cursosRoutes } from "./routes/cursos.ts";
import { colegiadosRoutes } from "./routes/colegiados.ts";

const app = Fastify({ logger: false });

app.register(cors, {
  origin: true,
});

app.register(authRoutes);
app.register(cursosRoutes);
app.register(usersRoutes);
app.register(departmentsRoutes);
app.register(colegiadosRoutes);

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    const address = await app.listen({ port, host: "0.0.0.0" });
    console.log(address)
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
