import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ eventId = "123" }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${backendUrl}/api/v1/events/${eventId}/attendees`);
        const result = await response.json();

        if (response.ok && result.success) {
          setAttendees(result.data);
        } else {
          setError(result.error || 'Failed to load attendees');
        }
      } catch (err) {
        setError('Network error. Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  if (loading) {
    return <div className="text-center p-10 text-gray-600">Loading attendees...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-md max-w-2xl mx-auto mt-10 border border-red-200">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-sans border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event Dashboard</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Total: {attendees.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">Reg ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">College</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No one has registered for this event yet.
                </td>
              </tr>
            ) : (
              attendees.map((person) => (
                <tr key={person.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-900">{person.registration_id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{person.name}</td>
                  <td className="px-6 py-4">{person.email}</td>
                  <td className="px-6 py-4">{person.college}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;