import prisma from "../../config/db.js";

export const addMovie = async (req, res) => {
  try {
    const { title, description, releaseDate, genres, rating, vPoster, hPoster, trailerLink, movieLink, tags, duration } = req.body;

    
    // Validate the new movie object
    if (!title || !description || !releaseDate || !genres || !rating || !vPoster || !hPoster || !trailerLink || !movieLink || !tags || !duration) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if Date is in correct format
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // if (!dateRegex.test(releaseDate)) {
    //     return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    // }
    
    // Check if rating is a number between 0 and 10
    if (typeof rating !== 'number' || rating < 0 || rating > 10) {
        return res.status(400).json({ error: "Rating must be a number between 0 and 10" });
    }
    
    // Check if duration is a positive integer
    if (typeof duration !== 'number' || duration <= 0 || !Number.isInteger(duration)) {
        return res.status(400).json({ error: "Duration must be a positive integer" });
    }
    
    // Check if genres is an array and contains valid genre strings and the strings belong to a predefined set
    // enum Genre { ACTION, ADVENTURE, DRAMA, COMEDY, FANTASY, HORROR, MYSTERY, ROMANCE, SCI_FI, THRILLER, DOCUMENTARY, ANIMATION, CRIME }
    const validGenres = ["ACTION", "ADVENTURE", "COMEDY", "DRAMA", "FANTASY", "HORROR", "ROMANCE", "MYSTERY", "SCI_FI", "THRILLER", "DOCUMENTARY", "ANIMATION", "CRIME"];
    if (!Array.isArray(genres) || genres.some(genre => typeof genre !== 'string' || !validGenres.includes(genre))) {
        return res.status(400).json({ error: "Genres must be an array of valid strings" });
    }
    
    // Check if tags is an array and contains valid tag strings
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        return res.status(400).json({ error: "Tags must be an array of strings" });
    }
    
    // Check if vPoster and hPoster are valid URLs
    // const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6}|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(:[0-9]{1,5})?(\/[\w.-]*)*$/;
    // // if (!urlRegex.test(vPoster) || !urlRegex.test(hPoster)) {
    // //     return res.status(400).json({ error: "Poster URLs must be valid URLs" });
    // // }
    
    // // Check if trailerLink and movieLink are valid URLs
    // if (!urlRegex.test(trailerLink) || !urlRegex.test(movieLink)) {
    //     return res.status(400).json({ error: "Trailer and movie links must be valid URLs" });
    // }
    
    // if all validations pass, proceed to create the movie
    const newMovie = await prisma.movie.create({
      data: {
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
        duration
      }
    });

    // Return the newly created movie
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post", details: error.message });
  }
};
  