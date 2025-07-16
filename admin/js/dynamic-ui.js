// dynamic-ui.js - Dynamic UI elements and modal management
import { actors, crewMembers, uploadedImages, showAlert, showLoading, checkCastCrewExists, createCastCrew, loadActors, loadCrew, handleImageUpload } from './api-utils.js';

let castCount = 0;
let crewCount = 0;
let clipCount = 0;

// dynamic-ui.js - Updated dropdown generation

export function addCastMember() {
    castCount++;
    const container = document.getElementById('castContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="selection-container">
            <select id="cast_${castCount}">
                <option value="">Select Actor</option>
                ${actors.map(actor => `<option value="${actor.id}">${actor.name}</option>`).join('')}
            </select>
            <button type="button" class="btn btn-secondary" onclick="openCastCrewModal('ACTOR', ${castCount})">+ New Actor</button>
        </div>
        <div class="form-group">
            <label for="character_${castCount}">Character Name</label>
            <input type="text" id="character_${castCount}" placeholder="Character name">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeCastMember(${castCount})">Remove</button>
    `;
    container.appendChild(div);
}

export function addCrewMember() {
    crewCount++;
    const container = document.getElementById('crewContainer');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <div class="selection-container">
            <select id="crew_${crewCount}">
                <option value="">Select Crew</option>
                ${crewMembers.map(crew => `<option value="${crew.id}">${crew.name} (${crew.job.join(', ')})</option>`).join('')}
            </select>
            <button type="button" class="btn btn-secondary" onclick="openCastCrewModal('CREW', ${crewCount})">+ New Crew</button>
        </div>
        <div class="form-group">
            <label for="job_${crewCount}">Job Title</label>
            <input type="text" id="job_${crewCount}" placeholder="Job title">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeCrewMember(${crewCount})">Remove</button>
    `;
    container.appendChild(div);
}

export function addClip() {
    clipCount++;
    const container = document.getElementById('clipsContainer');
    const div = document.createElement('div');
    div.className = 'clip-item';
    div.innerHTML = `
        <div class="form-group">
            <label>Clip Title</label>
            <input type="text" id="clip_title_${clipCount}" placeholder="Clip title">
        </div>
        <div class="form-group">
            <label>Clip Link</label>
            <input type="url" id="clip_link_${clipCount}" placeholder="YouTube URL">
        </div>
        <div class="form-group">
            <label>Duration (s)</label>
            <input type="number" id="clip_duration_${clipCount}" min="1">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeClip(${clipCount})">Remove</button>
    `;
    container.appendChild(div);
}

export function removeCastMember(id) {
    const element = document.getElementById(`cast_${id}`).parentElement.parentElement;
    element.remove();
}

export function removeCrewMember(id) {
    const element = document.getElementById(`crew_${id}`).parentElement.parentElement;
    element.remove();
}

export function removeClip(id) {
    const element = document.getElementById(`clip_title_${id}`).parentElement.parentElement;
    element.remove();
}

// Modal Management
export function openCastCrewModal(type, id) {
    const modal = document.getElementById('castCrewModal');
    const modalTitle = document.getElementById('modalTitle');
    const jobSelect = document.getElementById('personJob');

    modalTitle.textContent = `Add New ${type === 'ACTOR' ? 'Actor' : 'Crew Member'}`;
    jobSelect.value = type === 'ACTOR' ? 'ACTOR' : '';
    modal.dataset.type = type;
    modal.dataset.id = id;
    modal.style.display = 'block';
}

export function closeModal() {
    const modal = document.getElementById('castCrewModal');
    modal.style.display = 'none';
    document.getElementById('castCrewForm').reset();
    document.getElementById('personPhotoPreview').innerHTML = '';
    uploadedImages.personPhoto = null;
}

export async function saveCastCrew() {
    const form = document.getElementById('castCrewForm');
    const modal = document.getElementById('castCrewModal');
    const formData = new FormData(form);

    const personData = {
        name: formData.get('personName'),
        job: formData.get('personJob'),
        description: formData.get('personDescription') || '',
        dob: formData.get('personDob') || null,
        deathDate: formData.get('personDeathDate') || null,
        profilePhoto: uploadedImages.personPhoto || null,
        imageUrls: uploadedImages.personPhoto ? [uploadedImages.personPhoto] : []
    };

    if (!personData.name || !personData.job) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    try {
        showLoading(true);
        const existsResult = await checkCastCrewExists(personData.name);

        if (existsResult.exists) {
            const confirm = window.confirm(`${personData.name} already exists. Update job roles?`);
            if (!confirm) return;
            personData.isUpdate = true;
            personData.personId = existsResult.person.id;
        }

        const result = await createCastCrew(personData);

        if (result.success) {
            const type = modal.dataset.type;
            const id = modal.dataset.id;

            if (type === 'ACTOR') {
                await loadActors();
                updateCastDropdown(id, result.person.id);
            } else {
                await loadCrew();
                updateCrewDropdown(id, result.person.id);
            }

            showAlert(`${personData.name} saved successfully!`, 'success');
            closeModal();
        }
    } catch (err) {
        console.error(err);
        showAlert('Error saving person.', 'error');
    } finally {
        showLoading(false);
    }
}

// Dropdown Update Functions
export function updateCastDropdown(id, personId) {
    const select = document.getElementById(`cast_${id}`);
    if (select) {
        select.innerHTML = `
            <option value="">Select Actor</option>
            ${actors.map(actor => `<option value="${actor.id}" ${actor.id === personId ? 'selected' : ''}>${actor.name}</option>`).join('')}
        `;
    }
}

export function updateCrewDropdown(id, personId) {
    const select = document.getElementById(`crew_${id}`);
    if (select) {
        select.innerHTML = `
            <option value="">Select Crew</option>
            ${crewMembers.map(crew => `<option value="${crew.id}" ${crew.id === personId ? 'selected' : ''}>${crew.name} (${crew.job.join(', ')})</option>`).join('')}
        `;
    }
}

// Selection Handlers
export function handleCastSelection(id) {
    // Handle cast selection logic if needed
}

export function handleCrewSelection(id) {
    // Handle crew selection logic if needed
}

// Make functions globally available
window.addCastMember = addCastMember;
window.addCrewMember = addCrewMember;
window.addClip = addClip;
window.removeCastMember = removeCastMember;
window.removeCrewMember = removeCrewMember;
window.removeClip = removeClip;
window.openCastCrewModal = openCastCrewModal;
window.closeModal = closeModal;
window.saveCastCrew = saveCastCrew;
window.handleCastSelection = handleCastSelection;
window.handleCrewSelection = handleCrewSelection;