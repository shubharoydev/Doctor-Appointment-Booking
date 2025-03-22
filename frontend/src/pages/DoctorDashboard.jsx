import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import SidebarLayout from '../components/SidebarLayout';

function DoctorDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/doctor/login');

      try {
        // Fetch doctor profile
        const doctorResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(doctorResponse.data);

        // Fetch appointments
        const appointmentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appointmentsResponse.data);
      } catch (err) {
        console.error('Fetch data error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error('Delete doctor profile error:', err.response?.data || err.message);
      setError('Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <SidebarLayout profileId={id} userRole="doctor" onDelete={handleDelete}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Doctor Dashboard</h2>
        
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Booked Appointments</h3>
          {appointments.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Patient Name</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Date</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Day</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Time</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Place</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{appointment.user.name}</td>
                    <td className="py-3 px-4">{appointment.date || 'N/A'}</td>
                    <td className="py-3 px-4">{appointment.day}</td>
                    <td className="py-3 px-4">
                      {`${convertTo12Hour(appointment.timeInterval.start)}`}
                    </td>
                    <td className="py-3 px-4">{appointment.place}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'cancelled' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {appointment.status || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No appointments booked yet.</p>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}

export default DoctorDashboard; 