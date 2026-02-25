import React, { useState } from 'react';

const EventRegistrationForm = ({ eventId = "123" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: ''
  });
  
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [registrationData, setRegistrationData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'EVENT_NOT_FOUND':
        return 'The event you are trying to register for could not be found.';
      case 'EVENT_FULL':
        return 'Sorry, this event has reached maximum capacity.';
      case 'ALREADY_REGISTERED':
        return 'It looks like you have already registered for this event.';
      case 'INVALID_DATA':
        return 'Please check your information and try again. Invalid data submitted.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setRegistrationData(null);

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${backendUrl}/api/v1/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setRegistrationData(data.data);
      } else {
        setStatus('error');
        // Handle documented errors returned by the API
        setMessage(getErrorMessage(data.error));
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Event Registration</h2>

      {status === 'success' && registrationData ? (
        <div className="p-4 mb-6 bg-green-50 text-green-800 rounded-md border border-green-200">
          <h3 className="font-semibold text-lg">Registration Successful!</h3>
          <p className="mt-2">Status: <span className="font-mono bg-green-100 px-1 rounded">{registrationData.status}</span></p>
          <p>Registration ID: <span className="font-mono bg-green-100 px-1 rounded">{registrationData.registration_id}</span></p>
          <button 
            onClick={() => { setStatus('idle'); setFormData({name: '', email: '', college: ''}); }}
            className="mt-4 text-sm text-green-700 underline"
          >
            Register another person
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
            <input
              type="text"
              id="college"
              name="college"
              required
              value={formData.college}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State University"
            />
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      )}
    </div>
  );
};

export default EventRegistrationForm;