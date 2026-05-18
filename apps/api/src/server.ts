import Fastify from "fastify";
import { usersRoutes } from "./routes/users";

const app = Fastify();

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
