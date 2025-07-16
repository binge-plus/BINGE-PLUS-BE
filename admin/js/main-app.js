// main-app.js - Main application initialization and form handling
import { showAlert, showLoading, resetForm, uploadedImages, loadActors, loadCrew, createMovie, collectCastData, collectCrewData, collectClipsData, handleImageUpload } from './api-utils.js';
import { addCastMember, addCrewMember, addClip, removeCastMember, removeCrewMember, removeClip, openCastCrewModal, closeModal, saveCastCrew } from './dynamic-ui.js';

let initialized = false;

// Initialize Application
export async function initializeApp() {
    try {
        await loadActors();
        await loadCrew();
        setupEventListeners();
        showAlert('Application loaded successfully!', 'success');
        initialized = true;
    } catch (error) {
        console.error('Error initializing app:', error);
        showAlert('Error initializing application. Please refresh the page.', 'error');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Image upload handlers
    document.getElementById('vPoster').addEventListener('change', (e) => handleImageUpload(e, 'vPoster'));
    document.getElementById('hPoster').addEventListener('change', (e) => handleImageUpload(e, 'hPoster'));
    document.getElementById('personPhoto').addEventListener('change', (e) => handleImageUpload(e, 'personPhoto'));

    // Form submission
    document.getElementById('movieForm').addEventListener('submit', handleFormSubmit);

    // Modal close handlers
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('castCrewModal');
        if (e.target === modal) closeModal();
    });

    // Reset form handler
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
}

// Handle Form Submission
export async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Collect and validate data
    const castData = collectCastData();
    const crewData = collectCrewData();
    const clipsData = collectClipsData();

    const movieData = {
        title: formData.get('title')?.trim() || '',
        description: formData.get('description')?.trim() || '',
        releaseDate: formData.get('releaseDate') || '',
        genres: formData.get('genres')?.split(',').map(x => x.trim()).filter(x => x) || [],
        tags: formData.get('tags')?.split(',').map(x => x.trim()).filter(x => x) || [],
        rating: formData.get('rating') ? parseFloat(formData.get('rating')) : null,
        duration: formData.get('duration') ? parseInt(formData.get('duration')) : null,
        trailerLink: formData.get('trailerLink')?.trim() || '',
        movieLink: formData.get('movieLink')?.trim() || '',
        vPoster: uploadedImages.vPoster || '',
        hPoster: uploadedImages.hPoster || '',
        cast: castData,
        crew: crewData,
        clips: clipsData
    };

    // Validate form data
    const validationErrors = validateForm(movieData);
    if (validationErrors.length > 0) {
        showAlert(validationErrors.join(', '), 'error');
        return;
    }


    try {
        showLoading(true);
        const result = await createMovie(movieData);

        if (result.success) {
            showAlert('Movie created successfully! 🎉', 'success');
            setTimeout(() => {
                if (confirm('Create another movie?')) resetForm();
            }, 1500);
        } else {
            showAlert(result.error || 'Failed to create movie.', 'error');
            console.error('Movie creation failed:', result);
        }
    } catch (err) {
        console.error('Error creating movie:', err);
        showAlert('Failed to create movie. Please check console for details.', 'error');
    } finally {
        showLoading(false);
    }
}

// Form validation
function validateForm(movieData) {
    const errors = [];

    if (!movieData.title.trim()) {
        errors.push('Movie title is required');
    }

    if (!movieData.description.trim()) {
        errors.push('Movie description is required');
    }

    if (!movieData.releaseDate) {
        errors.push('Release date is required');
    }

    if (movieData.duration && movieData.duration <= 0) {
        errors.push('Duration must be greater than 0');
    }

    if (movieData.rating && (movieData.rating < 1 || movieData.rating > 10)) {
        errors.push('Rating must be between 1 and 10');
    }

    if (movieData.trailerLink && !isValidURL(movieData.trailerLink)) {
        errors.push('Trailer link must be a valid URL');
    }

    if (movieData.movieLink && !isValidURL(movieData.movieLink)) {
        errors.push('Movie link must be a valid URL');
    }

    // Validate cast data
    if (movieData.cast && movieData.cast.length > 0) {
        movieData.cast.forEach((member, index) => {
            if (!member.actorId || member.actorId <= 0) {
                errors.push(`Cast member ${index + 1}: Actor must be selected`);
            }
        });
    }

    // Validate crew data
    if (movieData.crew && movieData.crew.length > 0) {
        movieData.crew.forEach((member, index) => {
            if (!member.crewId || member.crewId <= 0) {
                errors.push(`Crew member ${index + 1}: Crew must be selected`);
            }
        });
    }

    // Validate clips data
    if (movieData.clips && movieData.clips.length > 0) {
        movieData.clips.forEach((clip, index) => {
            if (!clip.title.trim()) {
                errors.push(`Clip ${index + 1}: Title is required`);
            }
            if (!clip.clipLink.trim()) {
                errors.push(`Clip ${index + 1}: Link is required`);
            }
            if (clip.clipLink && !isValidURL(clip.clipLink)) {
                errors.push(`Clip ${index + 1}: Link must be a valid URL`);
            }
        });
    }

    return errors;
}

// URL validation helper
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showAlert('An unexpected error occurred. Please try again.', 'error');
});

// Network error handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (e.reason.message.includes('fetch')) {
        showAlert('Network error. Please check your connection and try again.', 'error');
    } else {
        showAlert('An error occurred. Please try again.', 'error');
    }
});

// Auto-save functionality (disabled due to storage restrictions)
// Note: localStorage is not available in Claude.ai artifacts

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                document.getElementById('movieForm').dispatchEvent(new Event('submit'));
                break;
            case 'r':
                e.preventDefault();
                resetForm();
                break;
        }
    }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access
window.initializeApp = initializeApp;
window.handleFormSubmit = handleFormSubmit;