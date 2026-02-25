// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

// ==========================================
// MOCK DATABASE (Using localStorage for persistence)
// ==========================================
const DB_KEY = 'event_registrations_db';
const MAX_CAPACITY = 3; // Setting a low capacity so you can test EVENT_FULL easily

const db = {
  // Get all registrations from localStorage
  getAll: () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },
  
  // Save a new registration
  insert: (registration) => {
    const currentData = db.getAll();
    currentData.push(registration);
    localStorage.setItem(DB_KEY, JSON.stringify(currentData));
  },

  // Clear the database (useful for resetting tests)
  clear: () => {
    localStorage.removeItem(DB_KEY);
  }
};


// ==========================================
// API HANDLERS
// ==========================================
export const handlers = [
  http.post('/api/v1/events/:eventId/register', async ({ request, params }) => {
    const body = await request.json();
    const currentRegistrations = db.getAll();

    // 1. Check for INVALID_DATA (basic validation example)
    if (!body.name || !body.email || !body.college) {
      return HttpResponse.json({
        success: false,
        error: 'INVALID_DATA'
      }, { status: 400 });
    }

    // 2. Check for ALREADY_REGISTERED
    const isAlreadyRegistered = currentRegistrations.some(reg => reg.email === body.email);
    if (isAlreadyRegistered) {
      return HttpResponse.json({
        success: false,
        error: 'ALREADY_REGISTERED'
      }, { status: 400 });
    }

    // 3. Check for EVENT_FULL
    if (currentRegistrations.length >= MAX_CAPACITY) {
      return HttpResponse.json({
        success: false,
        error: 'EVENT_FULL'
      }, { status: 400 });
    }

    // 4. Success! Create and save the new registration
    const newRegistration = {
      ...body,
      registration_id: Math.floor(Math.random() * 100000),
      status: "registered",
      registered_at: new Date().toISOString()
    };

    db.insert(newRegistration);

    return HttpResponse.json({
      success: true,
      data: {
        registration_id: newRegistration.registration_id,
        status: newRegistration.status
      },
      error: null
    });
  })
];