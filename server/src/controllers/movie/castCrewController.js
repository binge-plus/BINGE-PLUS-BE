import prisma from "../../config/db.js";

export const getMovies = async (req, res) => {
    try {
        const movies = await prisma.movie.findMany({
            select: {
                id: true,
                title: true,
                releaseDate: true
            },
            orderBy: {
                title: 'asc'
            }
        });
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
};

export const getCastCrew = async (req, res) => {
    try {
        const castCrew = await prisma.castCrew.findMany({
            select: {
                id: true,
                name: true,
                job: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.json(castCrew);
    } catch (error) {
        console.error("Error fetching cast/crew:", error);
        res.status(500).json({ error: "Failed to fetch cast/crew" });
    }
};

export const addMovieCast = async (req, res) => {
    try {
        const { movieId, castId, characterName } = req.body;

        // Validate required fields
        if (!movieId || !castId || !characterName) {
            return res.status(400).json({ 
                error: "Movie ID, Cast ID, and Character Name are required" 
            });
        }

        // Check if movie exists
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Check if cast member exists
        const castMember = await prisma.castCrew.findUnique({
            where: { id: castId }
        });
        if (!castMember) {
            return res.status(404).json({ error: "Cast member not found" });
        }

        // Check if this cast member already exists for this movie
        const existingCast = await prisma.movieCast.findFirst({
            where: {
                movieId: movieId,
                castId: castId
            }
        });
        if (existingCast) {
            return res.status(400).json({ 
                error: "This cast member is already assigned to this movie" 
            });
        }

        // Create movie cast entry
        const movieCast = await prisma.movieCast.create({
            data: {
                movieId,
                castId,
                characterName
            },
            include: {
                movie: {
                    select: { title: true }
                },
                cast: {
                    select: { name: true }
                }
            }
        });

        res.status(201).json(movieCast);
    } catch (error) {
        console.error("Error adding movie cast:", error);
        res.status(500).json({ error: "Failed to add movie cast" });
    }
};

export const addMovieCrew = async (req, res) => {
    try {
        const { movieId, crewId, jobTitle } = req.body;

        // Validate required fields
        if (!movieId || !crewId || !jobTitle) {
            return res.status(400).json({ 
                error: "Movie ID, Crew ID, and Job Title are required" 
            });
        }

        // Check if movie exists
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Check if crew member exists
        const crewMember = await prisma.castCrew.findUnique({
            where: { id: crewId }
        });
        if (!crewMember) {
            return res.status(404).json({ error: "Crew member not found" });
        }

        // Check if this crew member with same job already exists for this movie
        const existingCrew = await prisma.movieCrew.findFirst({
            where: {
                movieId: movieId,
                crewId: crewId,
                jobTitle: jobTitle
            }
        });
        if (existingCrew) {
            return res.status(400).json({ 
                error: "This crew member with the same job title is already assigned to this movie" 
            });
        }

        // Create movie crew entry
        const movieCrew = await prisma.movieCrew.create({
            data: {
                movieId,
                crewId,
                jobTitle
            },
            include: {
                movie: {
                    select: { title: true }
                },
                crew: {
                    select: { name: true }
                }
            }
        });

        res.status(201).json(movieCrew);
    } catch (error) {
        console.error("Error adding movie crew:", error);
        res.status(500).json({ error: "Failed to add movie crew" });
    }
};