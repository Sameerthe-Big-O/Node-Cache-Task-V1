import express from "express";
import GetDetailController from "../Controllers/DetailController.js";
import CountriesController from "../Controllers/CountriesController.js";
const router = express();

router.get("/details", GetDetailController);
router.get("/countries", CountriesController);

export default router;
