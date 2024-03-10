import express from "express";
import config from "config";
import deserializeUser from "../middleware/deserializeUser";
import routes from "../routes";
import cors from "cors";

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: config.get("origin"),
      credentials: true,
    })
  );
  app.use(deserializeUser);
  routes(app);
  return app;
}

export default createServer;
