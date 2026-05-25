import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";

const app = Fastify();

app.register(cors, {
  origin: true,
});

app.register(authRoutes);
app.register(usersRoutes);

const start = async () => {
  try {
    await app.listen({
      port: 3333,
    });

    console.log("Hello, World!");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
