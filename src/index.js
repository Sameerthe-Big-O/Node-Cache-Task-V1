import express from "express";
import ErrorHandler from "./middlwares/ErrorHandle.js";
import { getRedisClient } from "./Config/RedisClient.js";
import Routes from "./Routes/Index.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//*setting up the redis client
await getRedisClient();

app.use("/", Routes);

//*global error handler
app.use(ErrorHandler);

let server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export default server;
