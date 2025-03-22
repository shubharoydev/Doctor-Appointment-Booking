import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import SidebarLayout from '../components/SidebarLayout';

function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
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

        // Fetch user's appointments - use the correct endpoint
        console.log('Fetching appointments for user ID:', id);
        const appointmentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Appointments data received:', appointmentsResponse.data);
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

  if (loading) return <Loader text="Loading profile..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <SidebarLayout profileId={id} userRole="user" onDelete={handleDelete}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">{profile?.name}'s Profile</h2>
        
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            {profile?.picture ? (
              <img
                src={profile.picture}
                alt={profile?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', profile.picture);
                  e.target.src = 'https://via.placeholder.com/128';
                }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/128"
                alt={profile?.name || "User"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Personal Information</h3>
              <p><strong>Name:</strong> {profile?.name} <span className="text-gray-500 text-sm">(Non-editable)</span></p>
              <p><strong>Email:</strong> {profile?.email} <span className="text-gray-500 text-sm">(Non-editable)</span></p>
              <p><strong>Phone:</strong> {profile?.contactNumber || 'Not provided'}</p>
              <p><strong>Blood Group:</strong> {profile?.bloodGroup || 'Not provided'}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Contact Details</h3>
              <p><strong>Address:</strong> {profile?.address || 'Not provided'}</p>
              <p><strong>City:</strong> {profile?.city || 'Not provided'}</p>
              <p><strong>State:</strong> {profile?.state || 'Not provided'}</p>
              <p><strong>Pincode:</strong> {profile?.pincode || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        {/* Only show this message if the user has no contact number AND is trying to book appointments */}
        {!profile?.contactNumber && appointments.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
            <p className="text-yellow-700">
              <strong>Note:</strong> Please add your contact number to book appointments with doctors.
            </p>
            <button 
              onClick={() => navigate(`/register?id=${id}`)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Complete Your Profile
            </button>
          </div>
        )}
        
        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Your Appointments</h3>
          {appointments.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Doctor</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Specialization</th>
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
                    <td className="py-3 px-4">{appointment.doctor.name}</td>
                    <td className="py-3 px-4">{appointment.doctor.specialist}</td>
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
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p className="text-yellow-700">You haven't booked any appointments yet.</p>
              <p className="mt-2">
                <a href="/all-doctors" className="text-blue-500 hover:underline">Browse doctors</a> to book your first appointment.
              </p>
            </div>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}

export default UserProfile;