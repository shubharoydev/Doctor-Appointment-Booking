import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import SidebarLayout from '../components/SidebarLayout';

function DoctorProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/doctor/login');

    try {
      const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userResponse.data;
      console.log('User data fetched in DoctorProfile:', user); // Debug

      // Make sure we're using the correct ID property
      const userId = user._id || user.id;
      console.log('User ID in DoctorProfile:', userId); // Debug

      // Ensure the user is a doctor
      const role = localStorage.getItem('userRole');
      if (role !== 'doctor') {
        console.log('User is not a doctor:', role); // Debug
        return navigate('/');
      }

      let doctorData = null;
      try {
        console.log('Fetching doctor profile for user ID:', userId); // Debug
        const doctorResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Doctor profile fetched in DoctorProfile:', doctorResponse.data); // Debug
        doctorData = doctorResponse.data;
        
        // If we have a doctor profile but the ID doesn't match the URL param, redirect to the correct profile
        if (doctorData._id !== id) {
          console.log('Doctor ID mismatch, redirecting:', { doctorId: doctorData._id, paramId: id }); // Debug
          return navigate(`/profile/${doctorData._id}`);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err.response?.data || err.message); // Debug
        if (err.response?.status === 404) {
          // No doctor profile found, redirect to registration form
          navigate(`/register`);
          return;
        }
        throw err;
      }

      const appointmentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/appointments/doctor/${doctorData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Appointments fetched in DoctorProfile:', appointmentsResponse.data); // Debug
      setProfile({ ...user, ...doctorData });
      setAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error('Fetch data error in DoctorProfile:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate, location]);

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

  const handleEdit = () => {
    console.log('Edit button clicked, navigating to:', `/edit-doctor/${profile._id}`);
    navigate(`/edit-doctor/${profile._id}`);
  };

  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) return <Loader text="Loading profile..." />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <SidebarLayout profileId={id} userRole="doctor" onDelete={handleDelete}>
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
                alt={profile?.name || "Doctor"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Personal Information</h3>
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.contactNumber || 'Not provided'}</p>
              <p><strong>Gender:</strong> {profile?.gender || 'Not provided'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Professional Details</h3>
              <p><strong>Experience:</strong> {profile?.experienceYears} years</p>
              <p><strong>Specialist:</strong> {profile?.specialist}</p>
              <p><strong>Education:</strong> {profile?.education}</p>
              <p><strong>Qualification:</strong> {profile?.qualification || 'Not provided'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Practice Information</h3>
              <p><strong>Location:</strong> {profile?.location || 'Not provided'}</p>
              <p><strong>Languages:</strong> {profile?.language}</p>
              <p><strong>Fees:</strong> ₹{profile?.fees}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Additional Information</h3>
              <p><strong>About:</strong> {profile?.about || 'Not provided'}</p>
              <p><strong>Achievement:</strong> {profile?.achievement || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Schedule</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Day</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Time Slot</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Place</th>
                  <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Max Patients</th>
                </tr>
              </thead>
              <tbody>
                {profile?.schedule?.flatMap((sched, dayIndex) =>
                  sched.places.map((place, placeIndex) => (
                    <tr key={`${dayIndex}-${placeIndex}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{sched.day}</td>
                      <td className="py-3 px-4">
                        {`${convertTo12Hour(place.timeInterval.start)} - ${convertTo12Hour(place.timeInterval.end)}`}
                      </td>
                      <td className="py-3 px-4">{place.place}</td>
                      <td className="py-3 px-4">{place.maxPatients}</td>
                    </tr>
                  ))
                ) || <tr><td colSpan="4" className="py-3 px-4 text-center">No schedule available</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

 

       
      </div>
    </SidebarLayout>
  );
}

export default DoctorProfile;