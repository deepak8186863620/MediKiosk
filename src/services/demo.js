/**
 * DEMO MODE data for MediKiosk
 * Used when VITE_DEMO_MODE=true or APIs are unavailable.
 * Clearly separated from real API responses.
 */

export const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

// Simulated ASR responses
export const DEMO_TRANSCRIPTS = [
  'I have fever for three days and I feel very weak.',
  'मुझे तीन दिनों से बुखार है और मैं बहुत कमज़ोर महसूस कर रहा हूँ।',
  'నాకు మూడు రోజులుగా జ్వరం ఉంది.',
];

// Simulated clinical conversation
export const DEMO_CONVERSATION = [
  {
    question: 'When did your fever start?',
    options: ['Today', '1–3 days ago', '4–7 days ago', 'More than a week', "I don't know"],
    answer: '1–3 days ago',
  },
  {
    question: 'Do you have any other symptoms — like cough, cold, or body ache?',
    options: ['Cough', 'Cold / Runny nose', 'Body ache', 'Headache', 'No other symptoms'],
    answer: 'Body ache',
  },
  {
    question: 'Have you taken any medicines for the fever?',
    options: ['Yes', 'No', "I'm not sure"],
    answer: 'Yes — Paracetamol',
  },
  {
    question: 'Do you have any known allergies to medicines?',
    options: ['No known allergy', 'Yes, I have allergies', "I don't know"],
    answer: 'No known allergy',
  },
];

// Simulated structured summary
export const DEMO_SUMMARY = {
  session_id: 'DEMO-SESSION-001',
  patient: {
    name: 'Demo Patient',
    age: '42',
    gender: 'Male',
    phone: '',
    abha_id: '',
    patient_type: 'new',
  },
  chief_complaint: 'Fever',
  history: {
    present_illness:
      'Patient reports fever for 3 days with associated weakness and body ache. Has been taking Paracetamol with partial relief.',
    duration: '1–3 days',
    severity: 'Moderate',
    associated_symptoms: ['Weakness', 'Body ache'],
    relieving_factors: 'Paracetamol partially helps',
    aggravating_factors: 'None reported',
  },
  past_medical_history: 'No significant past illness reported.',
  medications: ['Paracetamol 500mg (self-medicated)'],
  allergies: 'No known drug allergies.',
  family_history: 'Not assessed.',
  personal_history: 'Not assessed.',
  review_of_systems: 'Negative for cough, cold, breathing difficulty, chest pain.',
  ai_flags: [],
  red_flag: false,
  documents: [],
  generated_at: new Date().toISOString(),
};

// Simulate API delay
export function simulateDelay(ms = 1200) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Demo ASR simulation
export async function demoTranscribe() {
  await simulateDelay(1800);
  return { success: true, text: DEMO_TRANSCRIPTS[0] };
}

// Demo next question simulation
export async function demoGetNextQuestion(index = 0) {
  await simulateDelay(900);
  const q = DEMO_CONVERSATION[index % DEMO_CONVERSATION.length];
  return {
    question: q.question,
    options: q.options,
    red_flag: false,
    complete: index >= DEMO_CONVERSATION.length - 1,
    progress: { current: index + 1, total: DEMO_CONVERSATION.length },
  };
}

// Demo submit
export async function demoSubmit() {
  await simulateDelay(1500);
  return DEMO_SUMMARY;
}
