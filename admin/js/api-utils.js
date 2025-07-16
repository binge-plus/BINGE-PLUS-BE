// api-utils.js - API calls and utility functions
const API_BASE_URL = 'http://localhost:7777/api';
const MOVIE_FORM_API = `${API_BASE_URL}/movie-form`;

export let actors = [];
export let crewMembers = [];
export let uploadedImages = {
    vPoster: null,
    hPoster: null,
    personPhoto: null
};

// API Functions
export async function loadActors() {
    const res = await fetch(`${MOVIE_FORM_API}/actors`);
    actors = await res.json();
}

export async function loadCrew() {
    const res = await fetch(`${MOVIE_FORM_API}/crew`);
    crewMembers = await res.json();
}

export async function uploadImage(file, folder) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async function (e) {
            try {
                const imageData = e.target.result.split(',')[1];
                const imageName = `${Date.now()}_${file.name}`;
                const imageType = file.type;
                const res = await fetch(`${MOVIE_FORM_API}/upload-image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageData, imageName, imageType, folder })
                });
                const result = await res.json();
                if (result.success) resolve(result.url);
                else reject(new Error(result.error || 'Upload failed'));
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
    });
}

export async function checkCastCrewExists(name) {
    const res = await fetch(`${MOVIE_FORM_API}/check-cast-crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    return res.json();
}

export async function createCastCrew(data) {
    const res = await fetch(`${MOVIE_FORM_API}/cast-crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function createMovie(data) {
    const res = await fetch(`${MOVIE_FORM_API}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

// Utility Functions
export function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}

export function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.toggle('show', show);
}

export function resetForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('castContainer').innerHTML = '';
    document.getElementById('crewContainer').innerHTML = '';
    document.getElementById('clipsContainer').innerHTML = '';
    document.getElementById('vPosterPreview').innerHTML = '';
    document.getElementById('hPosterPreview').innerHTML = '';
    document.getElementById('alertContainer').innerHTML = '';
    uploadedImages.vPoster = null;
    uploadedImages.hPoster = null;
    uploadedImages.personPhoto = null;
    showAlert('Form reset successfully!', 'success');
}

// Image Upload Handler
export async function handleImageUpload(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById(type + 'Preview');
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
    };
    reader.readAsDataURL(file);

    try {
        showLoading(true);
        // Update this line in handleImageUpload function
        const folder = type === 'vPoster' ? 'vPosters' : type === 'hPoster' ? 'hPosters' : 'Actors';
        const url = await uploadImage(file, folder);
        uploadedImages[type] = url;
        showAlert(`${type} uploaded successfully!`, 'success');
    } catch (err) {
        showAlert(`Error uploading ${type}`, 'error');
    } finally {
        showLoading(false);
    }
}

// api-utils.js - Updated collect functions

export function collectCastData() {
    const castData = [];
    document.querySelectorAll('[id^="cast_"]').forEach(select => {
        const id = select.id.split('_')[1];
        const characterInput = document.getElementById(`character_${id}`);
        
        // Validate actorId is a valid UUID string
        if (select.value && select.value !== "" && isValidUUID(select.value)) {
            castData.push({ 
                actorId: select.value, 
                characterName: characterInput?.value?.trim() || '' 
            });
        }
    });

    return castData;
}

export function collectCrewData() {
    const crewData = [];
    document.querySelectorAll('[id^="crew_"]').forEach(select => {
        const id = select.id.split('_')[1];
        const jobInput = document.getElementById(`job_${id}`);
        
        // Validate crewId is a valid UUID string
        if (select.value && select.value !== "" && isValidUUID(select.value)) {
            crewData.push({ 
                crewId: select.value, 
                jobTitle: jobInput?.value?.trim() || '' 
            });
        }
    });
    return crewData;
}

// Helper function to validate UUID format
function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

export function collectClipsData() {
    const clips = [];
    document.querySelectorAll('[id^="clip_title_"]').forEach(titleInput => {
        const id = titleInput.id.split('_')[2];
        const link = document.getElementById(`clip_link_${id}`);
        const dur = document.getElementById(`clip_duration_${id}`);
        
        // Only include if both title and link are provided
        if (titleInput.value?.trim() && link.value?.trim()) {
            const duration = parseInt(dur.value) || 0;
            clips.push({ 
                title: titleInput.value.trim(), 
                clipLink: link.value.trim(), 
                duration: duration 
            });
        }
    });
    return clips;
}