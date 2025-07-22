import express from 'express';
import { 
    createMovie, 
    getActors, 
    getCrew, 
    createCastCrew, 
    checkCastCrewExists,
    uploadImage 
} from '../controllers/movieform/movieFormConroller.js';

const router = express.Router();

// Main movie creation endpoint
router.post('/create', createMovie);

// Get all actors for dropdown
router.get('/actors', getActors);

// Get all crew members for dropdown
router.get('/crew', getCrew);

// Create new cast/crew member
router.post('/cast-crew', createCastCrew);

// Check if cast/crew member exists
router.post('/check-cast-crew', checkCastCrewExists);

// Upload image to Supabase
router.post('/upload-image', uploadImage);

export default router;