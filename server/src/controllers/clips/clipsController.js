import prisma from "../../config/db.js";

export async function clipAdder(req, res) {
    const { type, clipLink, title, duration } = req.body;
    const referenceId = req.params.movieId;

    if (!clipLink || !type || !title) {
        return res.status(400).json({ error: 'Clip link, type, and title are required.' });
    }

    const formattedLink = clipLink.replace("watch?v=", "embed/");

    if (!['MOVIE', 'SERIES', 'SEASON'].includes(type)) {
        return res.status(400).json({ error: 'Invalid clip type. Must be MOVIE, SERIES, or SEASON.' });
    }

    let referenceExists = false;

    if (type === "MOVIE") {
        referenceExists = await prisma.movie.findUnique({ where: { id: referenceId } });
    } else if (type === "SERIES") {
        referenceExists = await prisma.series.findUnique({ where: { id: referenceId } });
    } else if (type === "SEASON") {
        referenceExists = await prisma.season.findUnique({ where: { id: referenceId } });
    }

    if (!referenceExists) {
        return res.status(404).json({ error: `${type} with ID ${referenceId} does not exist.` });
    }

    try {
        const newClip = await prisma.clip.create({
        data: {
            type,
            title,
            clipLink: formattedLink,
            duration: duration || 0,

            ...(type === "MOVIE" && {
            movie: { connect: { id: referenceId } }
            }),
            ...(type === "SERIES" && {
            series: { connect: { id: referenceId } }
            }),
            ...(type === "SEASON" && {
            season: { connect: { id: referenceId } }
            })
        }
        });


        return res.status(201).json(newClip);
    } catch (error) {
        console.error('Error adding clip:', error);
        return res.status(500).json({ error: 'Failed to add clip.' });
    }
}



export async function getClipByMovieId(req, res) {
    const movieId = req.params.movieId;

    try {
        const clips = await prisma.clip.findMany({
            where: { movieId: movieId }
        });
        return res.status(200).json(clips);
    } catch (error) {
        console.error('Error fetching clips:', error);
        return res.status(500).json({ error: 'Failed to fetch clips.' });
    }
}
