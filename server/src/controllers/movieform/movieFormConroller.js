import prisma from "../../config/db.js";
import { supabaseAdmin } from "../../config/supabaseConfig.js";

// Helper function to convert YouTube URL to embed format
const convertToEmbedUrl = (url) => {
    if (!url) return '';

    // Handle different YouTube URL formats
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
};

// Upload image to Supabase storage
export const uploadImage = async (req, res) => {
    try {
        const { imageData, imageName, imageType, folder } = req.body;

        // Validate required fields
        if (!imageData || !imageName || !imageType || !folder) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: imageData, imageName, imageType, or folder'
            });
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, 'base64');

        // Determine storage path
        let storagePath;
        const allowedFolders = ['Actors', 'vPosters', 'hPosters'];

        if (allowedFolders.includes(folder)) {
            storagePath = `${folder}/${imageName}`;
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid folder. Must be one of: Actors, vPosters, hPosters'
            });
        }

        // Upload to Supabase storage using admin client
        const { data, error } = await supabaseAdmin.storage
        .from('movie-poster')
        .upload(storagePath, buffer, {
            contentType: imageType,
            cacheControl: '3600',
            upsert: true,
            contentDisposition: `inline; filename=${imageName}`
        });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        // Get signed URL instead of public URL
        const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
            .from('movie-poster')
            .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10); // 10 years expiry

        if (signedUrlError) {
            console.error('Signed URL error:', signedUrlError);
            throw signedUrlError;
        }

        res.json({
            success: true,
            url: signedUrlData.signedUrl,
            path: storagePath
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload image',
            details: error.message
        });
    }
};

// Get all actors for dropdown
export const getActors = async (req, res) => {
    try {
        const actors = await prisma.castCrew.findMany({
            where: {
                job: {
                    has: 'ACTOR'
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        res.json(actors);
    } catch (error) {
        console.error('Error fetching actors:', error);
        res.status(500).json({ error: 'Failed to fetch actors' });
    }
};

// Get all crew members for dropdown
export const getCrew = async (req, res) => {
    try {
        const crew = await prisma.castCrew.findMany({
            where: {
                job: {
                    hasSome: ['DIRECTOR', 'WRITER', 'PRODUCER', 'MUSIC']
                }
            },
            select: {
                id: true,
                name: true,
                job: true
            }
        });

        res.json(crew);
    } catch (error) {
        console.error('Error fetching crew:', error);
        res.status(500).json({ error: 'Failed to fetch crew' });
    }
};

// Check if cast/crew member exists
export const checkCastCrewExists = async (req, res) => {
    try {
        const { name } = req.body;

        const existingPerson = await prisma.castCrew.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });

        res.json({
            exists: !!existingPerson,
            person: existingPerson
        });
    } catch (error) {
        console.error('Error checking cast/crew:', error);
        res.status(500).json({ error: 'Failed to check cast/crew' });
    }
};

// Create new cast/crew member
export const createCastCrew = async (req, res) => {
    try {
        const {
            name,
            job,
            description,
            dob,
            deathDate,
            imageUrls,
            profilePhoto,
            isUpdate,
            personId
        } = req.body;

        const jobArray = Array.isArray(job) ? job : [job];

        let person;

        if (isUpdate && personId) {
            // Update existing person with new job
            const existingPerson = await prisma.castCrew.findUnique({
                where: { id: personId }
            });

            if (!existingPerson) {
                return res.status(404).json({ error: 'Person not found' });
            }

            const updatedJobs = [...new Set([...existingPerson.job, ...jobArray])];

            person = await prisma.castCrew.update({
                where: { id: personId },
                data: {
                    job: updatedJobs
                }
            });
        } else {
            // Create new person
            person = await prisma.castCrew.create({
                data: {
                    name,
                    job: jobArray,
                    description,
                    dob: formatDate(dob),
                    deathDate: formatDate(deathDate),
                    imageUrls: imageUrls || [],
                    profilePhoto
                }
            });
        }

        res.json({
            success: true,
            person
        });
    } catch (error) {
        console.error('Error creating cast/crew:', error);
        res.status(500).json({ error: 'Failed to create cast/crew member' });
    }
};

// Create movie with all related data
export const createMovie = async (req, res) => {
    try {
        const {
            // Movie details
            title,
            description,
            releaseDate,
            genres,
            rating,
            vPoster,
            hPoster,
            trailerLink,
            movieLink,
            tags,
            duration,

            // Cast data
            cast,

            // Crew data
            crew,

            // Clips data
            clips
        } = req.body;

        // Validate required fields
        if (!title || !description || !releaseDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: title, description, or releaseDate'
            });
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create movie
            const movie = await tx.movie.create({
                data: {
                    title,
                    description,
                    releaseDate: formatDate(releaseDate),
                    genres,
                    rating: rating ? parseFloat(rating) : null,
                    vPoster,
                    hPoster,
                    trailerLink: convertToEmbedUrl(trailerLink),
                    movieLink,
                    tags,
                    duration: duration ? parseInt(duration) : null
                }
            });

            // Add cast members
            if (cast && Array.isArray(cast) && cast.length > 0) {
                for (const member of cast) {
                    const { actorId, characterName } = member;
                    if (!actorId || !characterName) continue;

                    // Check if cast member exists
                    const castMember = await tx.castCrew.findUnique({
                        where: { id: actorId }
                    });
                    if (!castMember) continue;

                    // Check if already assigned
                    const existingCast = await tx.movieCast.findFirst({
                        where: {
                            movieId: movie.id,
                            castId: actorId
                        }
                    });
                    if (existingCast) continue;

                    await tx.movieCast.create({
                        data: {
                            movieId: movie.id,
                            castId: actorId,
                            characterName
                        }
                    });
                }
            }

            // Add crew members
            if (crew && Array.isArray(crew) && crew.length > 0) {
                for (const member of crew) {
                    const { crewId, jobTitle } = member;
                    if (!crewId || !jobTitle) continue;

                    // Check if crew member exists
                    const crewMember = await tx.castCrew.findUnique({
                        where: { id: crewId }
                    });
                    if (!crewMember) continue;

                    // Check if already assigned with same job
                    const existingCrew = await tx.movieCrew.findFirst({
                        where: {
                            movieId: movie.id,
                            crewId: crewId,
                            jobTitle: jobTitle
                        }
                    });
                    if (existingCrew) continue;

                    await tx.movieCrew.create({
                        data: {
                            movieId: movie.id,
                            crewId: crewId,
                            jobTitle
                        }
                    });
                }
            }

            // Create clips
            if (clips && clips.length > 0) {
                const validClips = clips.filter(clip =>
                    clip.title &&
                    clip.clipLink &&
                    clip.title.trim() !== '' &&
                    clip.clipLink.trim() !== ''
                );

                if (validClips.length > 0) {
                    const clipData = validClips.map(clip => ({
                        type: 'MOVIE',
                        movieId: movie.id,
                        clipLink: convertToEmbedUrl(clip.clipLink),
                        title: clip.title,
                        duration: clip.duration ? parseInt(clip.duration) : null
                    }));

                    await tx.clip.createMany({
                        data: clipData
                    });
                }
            }

            return movie;
        });

        res.json({
            success: true,
            movie: result
        });

    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create movie',
            details: error.message
        });
    }
};
