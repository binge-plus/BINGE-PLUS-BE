import prisma from "../../config/db.js";

export const addReview = async (req, res) => {
    const { userID, type, movieID } = req.params;
    const { reviewText, rating } = req.body;

    //Validate userID in the table
    const user = await prisma.profile.findUnique({
        where: { id: userID }
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Validate type
    if (type !== 'MOVIE' && type !== 'SEASON') {
        return res.status(400).json({ error: "Invalid type. Must be 'MOVIE' or 'SEASON'" });
    }

    if (type === 'MOVIE') {
        try {
            // Validate Movie ID
            const movie = await prisma.movie.findUnique({
                where: { id: movieID }
            });
            if (!movie) {
                return res.status(404).json({ error: "Movie not found" });
            }

            // Validate input
            if (!reviewText || !rating) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Validate rating
            if (typeof rating !== 'number' || rating < 0 || rating > 5) {
                return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
            }

            // Create the review
            const review = await prisma.review.create({
                data: {
                    type: type,
                    referenceId: movieID,
                    authorId: userID,
                    reviewText,
                    rating,
                }
            });

            res.status(201).json(review);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}