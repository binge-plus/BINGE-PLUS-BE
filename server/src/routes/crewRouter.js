import prisma from "../config/db.js";
import express from "express";
import { crewAdder, crewAdderMany } from "../controllers/castCrew/crewController.js";

const crewRouter = express.Router();

crewRouter.post("/", crewAdder);
crewRouter.post("/many", crewAdderMany)

export default crewRouter;
