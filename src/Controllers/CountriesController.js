import ApiError from "../utils/ApiError.js";
import { getRedisClient } from "../Config/RedisClient.js";

let redisClient = await getRedisClient();

async function getDetails(req, res, next) {
  try {
    let isCached = false;
    const cacheKey = `countries`;
    let results;

    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      isCached = true;
      results = JSON.parse(cachedResults);
    } else {
      results = await fetchApiData();
      if (!results || results.length === 0) {
        throw new ApiError(404, `Not Found `);
      }

      //*one minute of time validity!
      await redisClient.setEx(
        cacheKey,
        process.env.TTL_TIME,
        JSON.stringify(results)
      );
    }

    res.send({
      fromCache: isCached,
      data: results.response.countries,
    });
  } catch (error) {
    next(error);
  }
}

async function fetchApiData() {
  try {
    const apiResponse = await fetch(
      `${process.env.API_URL}/countries?api_key=${process.env.SECRET_KEY}`
    );

    let data = await apiResponse.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export default getDetails;
