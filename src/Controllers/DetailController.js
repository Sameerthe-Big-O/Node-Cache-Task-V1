import ApiError from "../utils/ApiError.js";
import { getRedisClient } from "../Config/RedisClient.js";

let redisClient = await getRedisClient();

async function getDetails(req, res, next) {
  //*i'm assuming that frontend react will allow to have a filter options
  console.log("yoo");
  const { country, year } = req.query;
  try {
    //*check for the input
    if (!country || !year || isNaN(year)) {
      throw new ApiError(
        400,
        "Invalid input: country and year are required, and year should be a number too"
      );
    }

    let results;
    let isCached = false;
    const cacheKey = `${country}_${year}`;

    //*Check cache

    const cachedResults = await redisClient.get(cacheKey);

    console.log("asd", cachedResults);
    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      results = await fetchApiData(country, Number(year));
      console.log(results);
      if (!results || results.response.holidays.length === 0) {
        throw new ApiError(404, `Not found: Invalid Country Code :${country}`);
      }

      //*one minute of time validity!
      await redisClient.setEx(
        cacheKey,
        process.env.TTL_TIME,
        JSON.stringify(results)
      );
    }

    return res.send({
      fromCache: isCached,
      data: results.response.holidays,
    });
  } catch (error) {
    next(error);
  }
}

async function fetchApiData(country, year) {
  try {
    const apiResponse = await fetch(
      `${process.env.API_URL}/holidays?api_key=${process.env.SECRET_KEY}&country=${country}&year=${year}`
    );

    let data = await apiResponse.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export default getDetails;
