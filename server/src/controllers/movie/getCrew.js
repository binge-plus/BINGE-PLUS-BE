import prisma from "../../config/db.js";

export const getCast = async (req, res) => {
    const { movieId } = req.params;
    console.log("Fetching cast for movie ID:", movieId);
    
    try {
        // Validate movieId format (UUID)
        if (!movieId) {
            return res.status(400).json({ error: "Invalid movie ID format" });
        }

        // Check if movie exists
        const movieExists = await prisma.movie.findUnique({
            where: { id: movieId },
            select: { id: true }
        });

        if (!movieExists) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Fetch cast with related cast member details using include (optimized approach)
        const cast = await prisma.movieCast.findMany({
            where: { movieId: movieId },
            include: {
                cast: {
                    select: {
                        id: true,
                        name: true,
                        job: true,
                        description: true,
                        profilePhoto: true,
                        dob: true,
                        deathDate: true
                    }
                }
            },
            orderBy: {
                characterName: 'asc'
            }
        });

        if (cast.length === 0) {
            return res.status(404).json({ error: "No cast found for this movie" });
        }

        // Transform the data to flatten the structure and format the response
        const transformedCast = cast.map(member => ({
            id: member.id,
            characterName: member.characterName,
            castId: member.castId,
            name: member.cast.name,
            job: member.cast.job,
            description: member.cast.description,
            profilePhoto: member.cast.profilePhoto,
            dateOfBirth: member.cast.dob,
            deathDate: member.cast.deathDate
        }));

        res.status(200).json({transformedCast
        });

    } catch (error) {
        console.error("Error fetching cast:", error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Movie not found" });
        }
        
        res.status(500).json({ 
            error: "Failed to fetch cast",
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

