import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import SidebarLayout from '../components/SidebarLayout';

function UserDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    uniqueDoctors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return navigate('/user/login');

      try {
        // Fetch user profile
        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(userResponse.data);

        // Fetch user's appointments
        console.log('Fetching appointments for user ID:', id);
        const appointmentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const allAppointments = appointmentsResponse.data;
        console.log('Appointments fetched:', allAppointments);
        
        // If no appointments were found, try the other endpoint
        if (!allAppointments || allAppointments.length === 0) {
          console.log('No appointments found, trying alternative endpoint');
          const altResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (altResponse.data && altResponse.data.length > 0) {
            console.log('Found appointments with alternative endpoint:', altResponse.data);
            setAppointments(altResponse.data);
            
            // Calculate stats with these appointments
            calculateStats(altResponse.data);
          } else {
            setAppointments([]);
            setStats({
              totalAppointments: 0,
              upcomingAppointments: 0,
              completedAppointments: 0,
              cancelledAppointments: 0,
              uniqueDoctors: 0,
            });
          }
        } else {
          setAppointments(allAppointments);
          calculateStats(allAppointments);
        }
      } catch (err) {
        console.error('Fetch data error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (appointments) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = appointments.filter(app => {
        if (!app.date) return false;
        const [day, month, year] = app.date.split('/').map(Number);
        const appDate = new Date(year, month - 1, day);
        return appDate >= today;
      });
      
      const completed = appointments.filter(app => {
        if (!app.date) return false;
        const [day, month, year] = app.date.split('/').map(Number);
        const appDate = new Date(year, month - 1, day);
        return appDate < today && app.status !== 'cancelled';
      });
      
      const cancelled = appointments.filter(app => app.status === 'cancelled');
      
      // Count unique doctors
      const uniqueDoctorIds = new Set(appointments.map(app => app.doctor._id));
      
      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming.length,
        completedAppointments: completed.length,
        cancelledAppointments: cancelled.length,
        uniqueDoctors: uniqueDoctorIds.size,
      });
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      navigate('/');
    } catch (err) {
      console.error('Delete user profile error:', err.response?.data || err.message);
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
    <SidebarLayout profileId={id} userRole="user" onDelete={handleDelete}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">User Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800">Total Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-800">Upcoming</h3>
            <p className="text-3xl font-bold text-green-600">{stats.upcomingAppointments}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800">Doctors Consulted</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.uniqueDoctors}</p>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Upcoming Appointments</h3>
          {appointments.filter(app => {
            const [day, month, year] = (app.date || '1/1/2000').split('/').map(Number);
            const appDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return appDate >= today && app.status !== 'cancelled';
          }).length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Doctor</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Specialization</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Date</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Day</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Time</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Place</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(app => {
                    const [day, month, year] = (app.date || '1/1/2000').split('/').map(Number);
                    const appDate = new Date(year, month - 1, day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appDate >= today && app.status !== 'cancelled';
                  })
                  .map((appointment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{appointment.doctor.name}</td>
                      <td className="py-3 px-4">{appointment.doctor.specialist}</td>
                      <td className="py-3 px-4">{appointment.date || 'N/A'}</td>
                      <td className="py-3 px-4">{appointment.day}</td>
                      <td className="py-3 px-4">
                        {`${convertTo12Hour(appointment.timeInterval.start)}`}
                      </td>
                      <td className="py-3 px-4">{appointment.place}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-700">You don't have any upcoming appointments.</p>
              <p className="mt-2">
                <a href="/all-doctors" className="text-blue-500 hover:underline">Browse doctors</a> to book an appointment.
              </p>
            </div>
          )}
        </section>
        
        {/* Past Appointments */}
        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Past Appointments</h3>
          {appointments.filter(app => {
            const [day, month, year] = (app.date || '1/1/2000').split('/').map(Number);
            const appDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return appDate < today && app.status !== 'cancelled';
          }).length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Doctor</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Specialization</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Date</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Day</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Time</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Place</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(app => {
                    const [day, month, year] = (app.date || '1/1/2000').split('/').map(Number);
                    const appDate = new Date(year, month - 1, day);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appDate < today && app.status !== 'cancelled';
                  })
                  .map((appointment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{appointment.doctor.name}</td>
                      <td className="py-3 px-4">{appointment.doctor.specialist}</td>
                      <td className="py-3 px-4">{appointment.date || 'N/A'}</td>
                      <td className="py-3 px-4">{appointment.day}</td>
                      <td className="py-3 px-4">
                        {`${convertTo12Hour(appointment.timeInterval.start)}`}
                      </td>
                      <td className="py-3 px-4">{appointment.place}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No past appointments.</p>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}

export default UserDashboard; 