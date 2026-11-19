import { buildApp } from "./api/app.js";

const app = await buildApp();
const stop = () => { void app.close(); };
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
await app.listen({ port: Number(process.env["PORT"] ?? 3000), host: "127.0.0.1" });
