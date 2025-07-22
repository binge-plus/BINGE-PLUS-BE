import prisma from "../../config/db.js";

export const allMovies = async (req ,res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMovieById = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await prisma.movie.findUnique({
            where: { id: id }
        });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};