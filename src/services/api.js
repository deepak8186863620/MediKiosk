/**
 * MediKiosk API Service
 * All backend communication goes through this file.
 * Set VITE_API_BASE_URL in .env.local to point to your FastAPI backend.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(method, path, body = null, isFormData = false) {
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const options = {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * ASR — Transcribe patient audio using AI4Bharat ASR via your FastAPI backend.
 * @param {Blob} audioBlob - Recorded audio blob
 * @param {string} languageCode - e.g. 'hi-IN', 'te-IN'
 * @returns {Promise<{ success: boolean, text: string }>}
 */
export async function transcribeAudio(audioBlob, languageCode = 'en-IN') {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('language', languageCode);
  return request('POST', '/api/asr/transcribe', formData, true);
}

/**
 * Submit a patient answer and get the next clinical question.
 * @param {object} payload
 * @returns {Promise<{ question: string, options: string[]|null, red_flag: boolean, complete: boolean }>}
 */
export async function processClinicalAnswer(payload) {
  return request('POST', '/api/clinical/answer', payload);
}

/**
 * Get the next question in the clinical conversation.
 * @param {string} sessionId
 * @returns {Promise<{ question: string, options: string[]|null }>}
 */
export async function getNextQuestion(sessionId) {
  return request('GET', `/api/clinical/next?session_id=${sessionId}`);
}

/**
 * Submit the complete patient history.
 * @param {object} historyPayload
 * @returns {Promise<{ session_id: string, summary: object }>}
 */
export async function submitHistory(historyPayload) {
  return request('POST', '/api/history/submit', historyPayload);
}

/**
 * Upload a medical document (prescription, lab report, etc.)
 * @param {File} file
 * @param {string} documentType - 'prescription' | 'lab_report' | 'discharge_summary' | 'other'
 * @param {string} sessionId
 * @returns {Promise<{ success: boolean, document_id: string }>}
 */
export async function uploadMedicalDocument(file, documentType, sessionId) {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('document_type', documentType);
  formData.append('session_id', sessionId);
  return request('POST', '/api/documents/process', formData, true);
}

/**
 * Get the structured patient summary for doctor review.
 * @param {string} sessionId
 * @returns {Promise<object>} Structured clinical summary
 */
export async function getPatientSummary(sessionId) {
  return request('GET', `/api/history/summary?session_id=${sessionId}`);
}

/**
 * Start a new session
 * @param {object} patientInfo
 * @returns {Promise<{ session_id: string }>}
 */
export async function startSession(patientInfo) {
  return request('POST', '/api/session/start', patientInfo);
}

export default {
  transcribeAudio,
  processClinicalAnswer,
  getNextQuestion,
  submitHistory,
  uploadMedicalDocument,
  getPatientSummary,
  startSession,
};
