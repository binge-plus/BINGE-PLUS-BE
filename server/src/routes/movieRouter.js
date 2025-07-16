import { Router } from "express";
import { addMovie } from "../controllers/movie/postController.js";
import { addMovieCast, addMovieCrew, getMovies, getCastCrew } from "../controllers/movie/castCrewController.js";
import { allMovies, getMovieById } from "../controllers/movie/getMovie.js";
import { getCast } from "../controllers/movie/getCast.js";

const router = Router();

router.get("/", allMovies);
router.get("/:id", getMovieById);

router.post("/adding", addMovie);

// New routes for cast and crew assignment
router.get("/list", getMovies);
router.get("/cast-crew", getCastCrew);
router.post("/cast", addMovieCast);
router.post("/crew", addMovieCrew);

// to get cast of a movie
router.get("/:movieId/cast", getCast);

export default router;