import redis from "redis";

//*Singelton pattern so that only once instance will be used throught the server life-time
let redisClient;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = redis.createClient();

    redisClient.on("error", (error) => console.error(`Redis Error: ${error}`));

    await redisClient.connect();
    console.log("Connected to Redis...");
  }
  return redisClient;
};
