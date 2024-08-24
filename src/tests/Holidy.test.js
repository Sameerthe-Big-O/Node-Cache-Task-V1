import getDetails from "../Controllers/CountriesController.js";
import { getRedisClient } from "../Config/RedisClient.js";
import MockRedis from "redis-mock";

jest.mock("../Config/RedisClient.js");

describe("getDetails Controller", () => {
  let req, res, next, redisClient;

  beforeEach(async () => {
    redisClient = new MockRedis();
    getRedisClient.mockResolvedValue(redisClient);

    req = {
      query: {
        country: "US",
        year: "2024",
      },
    };

    res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return data from cache if available", async () => {
    const cachedData = JSON.stringify({ response: { holidays: ["New Year"] } });
    await redisClient.set("US_2024", cachedData); // Set mock data in the mock Redis

    await getDetails(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith("US_2024");
    expect(res.json).toHaveBeenCalledWith({
      fromCache: true,
      data: ["New Year"],
    });
  });
});
