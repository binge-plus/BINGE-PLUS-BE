import prisma from "../../config/db.js";

export const getCast = async (req, res) => {
    const { movieId } = req.params;
    
    try {
        // Validate movieId format (UUID)
        if (!movieId || !movieId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
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

        // Fetch cast with related cast member details
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

        // Fetch crew with related crew member details
        const crew = await prisma.movieCrew.findMany({
            where: { movieId: movieId },
            include: {
                crew: {
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
                jobTitle: 'asc'
            }
        });

        // Transform cast data
        const transformedCast = cast.map(member => ({
            id: member.id,
            characterName: member.characterName,
            castId: member.castId,
            name: member.cast.name,
            job: member.cast.job,
            description: member.cast.description,
            profilePhoto: member.cast.profilePhoto,
            dateOfBirth: member.cast.dob,
            deathDate: member.cast.deathDate,
            type: 'cast'
        }));

        // Transform crew data
        const transformedCrew = crew.map(member => ({
            id: member.id,
            jobTitle: member.jobTitle,
            crewId: member.crewId,
            name: member.crew.name,
            job: member.crew.job,
            description: member.crew.description,
            profilePhoto: member.crew.profilePhoto,
            dateOfBirth: member.crew.dob,
            deathDate: member.crew.deathDate,
            type: 'crew'
        }));

        // Return both cast and crew, or empty arrays if none found
        res.status(200).json({
            cast: transformedCast,
            crew: transformedCrew,
            total: transformedCast.length + transformedCrew.length
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