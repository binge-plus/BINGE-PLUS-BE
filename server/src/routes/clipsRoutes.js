import { Router } from "express";

import { clipAdder, getClipByMovieId } from "../controllers/clips/clipsController.js";


const clipRouter = Router();

clipRouter.post("/:movieId", clipAdder);
clipRouter.get("/:movieId", getClipByMovieId);

export default clipRouter;
