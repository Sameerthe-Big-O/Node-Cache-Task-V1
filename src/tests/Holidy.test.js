import getDetails from "../Controllers/CountriesController.js";
import ApiError from "../utils/ApiError.js";
import { jest } from "@jest/globals";

describe("Api tests cases for the endpoints of holidays of each country", () => {
  let req, res, next, redisClient;

  const getRedisClient = jest.fn();
  beforeEach(async () => {
    redisClient = {
      get: jest.fn(),
      setEx: jest.fn(),
    };

    getRedisClient.mockResolvedValue(redisClient);

    req = {
      query: {
        country: "US",
        year: "2024",
      },
    };

    res = {
      send: jest.fn(),
    };
    next = jest.fn();

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return data from cache if available", async () => {
    const cachedData = JSON.stringify({ response: { holidays: ["New Year"] } });
    redisClient.get.mockResolvedValue(cachedData);

    await getDetails(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith("US_2024");
    expect(res.send).toHaveBeenCalledWith({
      fromCache: true,
      data: ["New Year"],
    });
  });

  it("should fetch the data from the external API and store it in cache if not available", async () => {
    redisClient.get.mockResolvedValue(null);
    const apiResponse = { response: { holidays: ["Independence Day"] } };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(apiResponse),
    });

    await getDetails(req, res, next);

    expect(redisClient.get).toHaveBeenCalledWith("US_2024");
    expect(redisClient.setEx).toHaveBeenCalledWith(
      "US_2024",
      process.env.TTL_TIME,
      JSON.stringify(apiResponse)
    );
    expect(res.send).toHaveBeenCalledWith({
      fromCache: false,
      data: ["Independence Day"],
    });
  });

  it("should handle invalid input and throw an ApiError", async () => {
    req.query = {
      country: "",
      year: "invalid-year",
    };

    await getDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ApiError(
        400,
        "Invalid input: country and year are required, and year should be a number too"
      )
    );
  });

  it("should throw an ApiError if the API returns no results", async () => {
    req.query = {
      country: "UL",
      year: "2024",
    };
    redisClient.get.mockResolvedValue(null);
    const apiResponse = { response: { holidays: [] } };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(apiResponse),
    });

    await getDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ApiError(404, `Not found: Invalid Country Code :UL`)
    );
  });
});
