import Fastify from "fastify";

const app = Fastify();

app.get("/", async () => {
  return {
    message: "Hello, World!",
  };
});

const start = async () => {
  try {
    const address = await app.listen({
      port: 3333,
    });

    console.log(`Rodando em ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
