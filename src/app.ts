import config from "config";
import connectdb from "./utils/connectdb";
import logger from "./utils/logger";
import createServer from "./utils/server";


const port = process.env.PORT || config.get<number>("port");
const environment = process.env.NODE_ENV || "development";

const app = createServer();

app.listen(port, async () => {
  logger.info(
    `App is running st http://localhost:${port} in ${environment} environment`
  );
  await connectdb();
});
